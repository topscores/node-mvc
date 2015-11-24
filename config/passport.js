var passport = require('passport');
var mongoose = require('mongoose');

module.exports = function() {
  var User = mongoose.model('User');

  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(userId, done) {
    User.findOne({_id: userId}, '-password -salt', function(err, user) {
      return done(err, user);
    });
  });

  local = require('./strategy/local');
  local();
}
