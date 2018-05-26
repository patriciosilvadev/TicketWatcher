import express from 'express';
import http from 'http';
import socket from 'socket.io';
import exec from '../modules/crowler';
var router = express.Router();
var io = socket(http);

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  io.emit('updateError');
  exec().then((m: any) => res.send(m))
    .catch((err: any) => {
      res.send(err == 304 ? "前回の取得から、3分間は更新できません" : `エラーが発生しました(${err})`)
    });
});

module.exports = router;
