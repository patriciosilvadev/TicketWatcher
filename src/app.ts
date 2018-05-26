import { promisify } from 'bluebird';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import socket from 'socket.io';
var app = express();
var createError = require('http-errors');
var logger = require('morgan');
var setting = require('./config/setting.js');
var io = socket(http);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get('projects.json', (req, res, next) => res.sendfile(path.join(setting.ticketsPath, "projects.json")));

app.use('/update', require('./routes/update'));

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(function (req: express.Request, res: express.Response, next: Function) { next(createError(404)) });

app.use(function (err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  fs.readFile("./dist/public/error.html", 'utf-8', function (readerr, data) {
    data = data.replace('<%= message %>', err.message).replace('<%= error.stack %>', err.stack).replace('<%= error.status %>', err.status);
    res.send(data);
  })

});

async function readPdf(id: string, res: express.Response) {
  var filePath = path.join(setting.ticketsPath, id + ".pdf");

  var existsSync = promisify(fs.exists);

  res.sendfile(filePath);
}

module.exports = app;
