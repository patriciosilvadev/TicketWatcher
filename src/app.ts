import express from 'express';
import fs from 'fs';
import path from 'path';
var app = express();
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var logger = require('morgan');
var setting = require('./config/setting.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => res.sendfile('./public/index.html'));

app.get('/:id.pdf', (req, res, next) => res.sendfile(path.join(setting.ticketsPath, req.params["id"] + ".pdf")));

app.get('/projects.json', (req, res, next) => res.sendfile(path.join(setting.ticketsPath, "projects.json")));

app.get('/issues.json', function (req, res, next) {
  var issuesPath = path.join(setting.ticketsPath, "issues.json");
  var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath).toString()) : undefined;
  if (file) file.fessUri = setting.fessUri;

  res.send(file);
});

app.get('projects.json', (req,res,next) => res.sendfile(path.join(setting.ticketsPath, "projects.json")));

app.use('/update', require('./routes/update'));

app.use(function (req: express.Request, res: express.Response, next: Function) { next(createError(404)) });

app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
