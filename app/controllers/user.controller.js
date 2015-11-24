var User = require('mongoose').model('User');

exports.renderSignup = function(req, res) {
  res.render('signup', {
    title: 'Sign up'
  });
}

exports.signup = function(req, res) {
    if (!req.user){
      var user = User(req.body);
      user.provider = 'local';

      user.save(function(err) {
        if (err) return res.redirect('/signup');

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

exports.login = function(req, res) {
  console.log(req.body);
  console.log('Email: ' + req.body.email);
  console.log('Password: ' + req.body.password);

  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.sanitizeBody('email').normalizeEmail();
  var errors = req.validationErrors();
  if (errors) {
    res.render('index', {
      title: 'There have been validation errors: ' + JSON.stringify(errors),
      isLoggedIn: false
    });
    return;
  }

  if (req.body.remember === 'remember') {
    req.session.remember = true;
    req.session.email = req.body.email;
    req.session.cookie.maxAge = 60000; // milliseconds
  }

  res.render('index', {
    title: 'Logged in as ' + req.body.email,
    isLoggedIn: true
  });
}

exports.logout = function(req, res) {
  req.session = null;
  res.render('index', {
    title: 'See you again later',
    isLoggedIn: false
  });
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
