var User = require('mongoose').model('User');

var getErrorMessage = function(err) {
    message = '';
    if (err.code) {
      switch(err.code) {
        case 11000:
        case 11001:
          message = 'Username already exist';
          break;
        default:
          message = 'Something went wrong';
      }
    }
    else {
      for (errName in err.errors) {
        if (err.errors[errName].message) {
          message = err.errors[errName].message;
        }
      }
    }
    return message;
}

exports.renderSignup = function(req, res) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign up',
      messages: req.flash('error')
    });
  }
  else {
    res.redirect('/');
  }
}

exports.signup = function(req, res) {
    if (!req.user){
      var user = User(req.body);
      user.provider = 'local';

      user.save(function(err) {
        if (err) {
          var message = getErrorMessage(err);
          req.flash('error', message);
          return res.redirect('/signup');
        }

        req.login(user, function(err) {
          if (err) return next(err);
          return res.redirect('/');
        });
      });
    }
    else {
      return res.redirect('/');
    }
}

exports.renderLogin = function(req, res) {
    if (!req.user) {
      res.render('login', {
        title: 'Log in',
        messages: req.flash('error')
      });
    }
    else {
      res.redirect('/');
    }
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}

exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err) {
    if (err) {
      return next(err);
    }
    else {
      res.json(user);
    }
  });
}

exports.list = function(req, res, next) {
  User.find({}, function(err, users){
    if (err) {
      next(err);
    }
    else {
      res.json(users);
    }
  });
}

exports.userByUsername = function(req, res, next, username) {
  User.findOne({
    username: username
  }, function(err, user){
      if (err) {
        return next(err);
      }
      else {
        req.user = user;
        next();
      }
  });
}

exports.read = function(req, res, next) {
  res.json(req.user);
}

exports.update = function(req, res, next) {
  User.findOneAndUpdate({username: req.user.username}
    , req.body
    , { new:true }
    , function(err, user) {
    if(err) {
      next(err);
    }
    else {
      res.json(user);
    }
  });
}

exports.delete = function(req, res, next) {
  req.user.remove(function(err) {
    if (err) {
      next(err);
    }
    else {
      res.json(user);
    }
  });
}
