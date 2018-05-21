import express from 'express';
var router = express.Router();

var crowler = require('../modules/crowler');
router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  crowler().then((m: any) => res.send(m))
    .catch((err: any) => {
      res.send(err == 304 ? "前回の取得から、3分間は更新できません" : `エラーが発生しました(${err})`)
    });
});

module.exports = router;
