import fs from 'fs';

// #region 設定
/** Redmine URI */
module.exports.redmineUri = process.env.REDMINE_URI ? process.env.REDMINE_URI : "http://localhost:3000";
console.log(`REDMINE_URI=${module.exports.redmineUri}`);

/** FESS URI */
module.exports.fessUri = process.env.FESS_URI
console.log(`FESS_URI=${module.exports.fessUri}`);

/** API KEY */
module.exports.apiKey = process.env.API_KEY ? process.env.API_KEY : "XXXXXXXXXX";

/** チケット格納パス */
module.exports.ticketsPath = process.env.TICKETS_PATH ? process.env.TICKETS_PATH : "/data";
if (!fs.existsSync(module.exports.ticketsPath)) fs.mkdirSync(module.exports.ticketsPath);
console.log(`TICKETS_PATH=${module.exports.ticketsPath}`);

/** Redmineアクセス時に付加するクエリ文字列 */
module.exports.query = process.env.QUERY ? '&' + process.env.QUERY : '';
/** タイトル */
module.exports.title = process.env.TITLE ? process.env.TITLE : require("../../package.json").name;
// #endregion
