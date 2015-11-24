process.env.NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT || 'development';

var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);

module.exports = app;

console.log('Server start at http://localhost:3000');
