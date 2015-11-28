var express = require('express');
var morgan  = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var sass = require('node-sass-middleware');
var session = require('express-session');
var config = require('./config');
var passport = require('passport');
var flash = require('connect-flash');

module.exports = function() {
  var app = express();
  if (process.env.NODE_ENVIRONMENT === 'development') {
    app.use(morgan('dev'));
  }
  else {
    app.use(compression());
  }

  /*app.use(cookieSession({
    name: 'session',
    keys: ['secret_key', 'secret_key2']
  }));*/
  app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }));

  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(bodyParser.urlencoded({
    'extended': true
  }));
  app.use(bodyParser.json());

  app.use(validator());

  app.set('views', './app/views');
  app.set('view engine', 'jade');

  require('../app/routes/index.routes')(app);
  require('../app/routes/user.routes')(app);

  app.use(sass({
    src: './sass',
    dest: './public/css',
    outputStyle: 'compressed',
    indentedSyntax: true,
    prefix: '/css'
  }));
  app.use(express.static('./public'));
  return app;
}
