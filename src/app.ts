import express from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
var setting = require('./config/setting');
var app = express()
var createError = require('http-errors');

app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res, next) => res.sendfile('./public/index.html'));
app.get('/projects.json', (req, res, next) => res.sendfile(path.join(setting.ticketsPath, "projects.json")));
app.get('/issues.json', function (req, res, next) {
  var issuesPath = path.join(setting.ticketsPath, "issues.json");
  var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath).toString()) : undefined;
  if (file) file.fessUri = setting.fessUri;

  res.send(file);
});

app.get('/:id.pdf', (req, res, next) => res.sendfile(path.join(setting.ticketsPath, req.params["id"] + ".pdf")));
app.use('/update', require('./routes/update'));

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
