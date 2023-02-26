var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var index = require('./routes/index');
var users = require('./routes/users');
var arts = require('./routes/arts');
const flash = require("express-flash");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("fgfefh55t"));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(flash())
app.use(session({
  secret:"89er95j0h3k7yh34",
  cookie:{ maxAge: 1000*60*60*24 }, // one day
  resave: true,
  saveUninitialized: true
}));

// routes
app.use('/', index);
app.use('/users', users);
app.use('/arts', arts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080,() => {
  console.log("server on");
})

module.exports = app;
