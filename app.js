var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request-promise');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// #region 設定
/** Redmine URI */
var redmineUri = process.env.REDMINE_URI ? process.env.REDMINE_URI : "http://localhost:3000";
console.log(`REDMINE_URI=${redmineUri}`);

/** FESS URI */
var fessUri = process.env.FESS_URI
console.log(`FESS_URI=${fessUri}`);

/** API KEY */
var apiKey = process.env.API_KEY ? process.env.API_KEY : "XXXXXXXXXX";

/** チケット格納パス */
var ticketsPath = process.env.TICKETS_PATH ? process.env.TICKETS_PATH : "/data";
if (!fs.existsSync(ticketsPath)) fs.mkdir(ticketsPath);
console.log(`TICKETS_PATH=${ticketsPath}`);
// #endregion

app.get('/', function (req, res, next) {
  res.sendfile("index.html");
});

app.get('/:id.pdf', function (req, res, next) {
  res.sendfile(path.join(ticketsPath, req.params["id"] + ".pdf"));
});

app.get('/issues.json', function (req, res, next) {
  var issuesPath = path.join(ticketsPath, "issues.json");
  var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath)) : undefined;

  if (file) {
    file.fessUri = fessUri;
  }

  res.send(file);
});

app.use('/main.js', express.static(path.join(__dirname, 'main.js')));

app.post('/update', function (req, res, next) {
  var issuesPath = path.join(ticketsPath, "issues.json");
  var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath)) : undefined;

  if (!file) {
    console.log("[warn]issues.jsonが見つからない。");
  }

  var nowDate = new Date();
  nowDate.setMinutes(nowDate.getMinutes() - 1);
  var beforeTicketDate = file ? new Date(file.issues[0].updated_on) : new Date(0);
  var beforeDate = file ? new Date(file.undateDate) : new Date(0);
  if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
    console.log(`  再更新は、3分後:${nowDate.toLocaleTimeString()} < ${beforeDate.toLocaleTimeString()}`);
    res.send("前回の取得から、3分間は更新できません");
    return;
  }

  const procedure = async () => {
    var issuesUri = `${redmineUri}/issues.json?f=&limit=300&sort=updated_on%3Adesc%2Cid%3Adesc&key=${apiKey}`;
    var tickets = await request({ "uri": issuesUri, "json": true });
    console.log(`  TICKET GET: ${redmineUri}/issues.json ${tickets ? "200" : "empty"}`);
    if (!tickets) {
      res.sendStatus(404);
      return;
    }
    tickets.updateDate = new Date();
    if (!tickets.updateDate) {
      res.sendStatus(200);
      return;
    }

    var count = 0;
    for (let i = 0; i < tickets.issues.length; i++) {
      var updatedOn = new Date(tickets.issues[i].updated_on);
      if (updatedOn.getTime() <= beforeTicketDate.getTime()) {
        continue;
      }
      var uri = `${redmineUri}/issues/${tickets.issues[i].id}.pdf?key=${apiKey}`;
      var b = await request({ "url": uri, "encoding": null });
      console.log(`  TICKET GET: ${redmineUri}/issues/${tickets.issues[i].id}.pdf ${b ? "200" : "empty"}`);
      if (b) {
        var filePath = path.join(ticketsPath, `${tickets.issues[i].id}.pdf`);
        fs.writeFileSync(filePath, b);
      }
      count++;
    }
    fs.writeFileSync(issuesPath, JSON.stringify(tickets));
    res.send(count > 0 ? `${count}件更新されました。` : "チケットは更新されていませんでした");
  }
  procedure();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

function getFileName(value) {
  return path.basename(path.basename(value).split("?")[0]);
}
module.exports = app;
