var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var setting = require('./setting.js');
var fs = require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'sample')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.get('/:id.pdf', function (req, res, next) { res.sendfile(path.join(setting.ticketsPath, req.params["id"] + ".pdf")); });

app.get('/issues.json', function (req, res, next) {
  var issuesPath = path.join(setting.ticketsPath, "issues.json");
  var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath)) : undefined;
  if (file) file.fessUri = setting.fessUri;

  res.send(file);
});


app.use('/update', require('./routes/update'));
app.use('/users', require('./routes/users'));

app.use(function (req, res, next) { next(createError(404)) });

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
