// import express from 'express';
var express = require('express');
var router = express.Router();
var crowler = require('../crowler');

router.post('/', function (req, res, next) {
  crowler().then(m => res.send(m))
    .catch(err => {
      res.send(err == 304 ? "前回の取得から、3分間は更新できません" : `エラーが発生しました(${err})`)
    });
});

module.exports = router;
