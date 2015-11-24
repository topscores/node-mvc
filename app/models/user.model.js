var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

UserSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  email: {
    type: String,
    index: true,
    match: /.+\@.+\.+/
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length > 6;
      },
      'Password must be longer than 6 characters'
    ]
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'user']
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: true
  },
  providerId: String,
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('base64');
}

UserSchema.methods.authenticate = function(password) {
  return this.password = this.hashPassword(password);
}

mongoose.model('User', UserSchema);
console.log('Test');
