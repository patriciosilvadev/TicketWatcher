#!/usr/bin/env node

var crowler = require('./modules/crowler');
crowler()
  .then((count:any) => console.log(count > 0 ? `${count}件更新されました。` : "更新されていませんでした"))
  .catch((err:any) => {
    if (err == 304) {
      console.log("前回の取得から、3分間は更新できません");
    } else {
      console.log(err);
    }
  });
