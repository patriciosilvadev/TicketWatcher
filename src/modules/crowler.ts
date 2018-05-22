import fs from 'fs';
import path from 'path';
import request from 'request-promise';
import { promisify } from 'util';
import { settings } from 'cluster';
var setting = require('../config/setting');

/**
 * Redmineをクロールして、チケットを取得する
 */
export var exec = async function () {
    var issuesPath = path.join(setting.ticketsPath, "issues.json");
    var file = fs.existsSync(issuesPath) ? JSON.parse(fs.readFileSync(issuesPath).toString()) : undefined;

    if (!file) console.log("[warn]issues.jsonが見つからない。");

    var nowDate = new Date();
    nowDate.setMinutes(nowDate.getMinutes() - 1);
    var beforeTicketDate = file ? new Date(file.issues[0].updated_on) : new Date(0);
    var beforeDate = file ? new Date(file.undateDate) : new Date(0);
    if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
        console.log(`  再更新は、3分後:${nowDate.toLocaleTimeString()} < ${beforeDate.toLocaleTimeString()}`);
        throw 304;
    }

    return await procedure(beforeTicketDate);
}

const procedure = async function (beforeTicketDate: Date) {

    var projects = await request({ "uri": `${setting.redmineUri}/projects.json?key=${setting.apiKey}`, "json": true });
    var writeFileSync = promisify(fs.writeFile);
    await writeFileSync(setting.ticketsPath + '/projects.json', JSON.stringify(projects));

    var tickets = await requestIssues(beforeTicketDate);

    if (!tickets) return undefined;

    var count = await requestTickets(tickets, beforeTicketDate);

    return tickets.issues.length > 0 ? `${count}件更新されました。` : "チケットは更新されていませんでした";
}

/**
 * Redmineからissues.jsonを取得する
 * @param {*} beforeTicketDate 前回のチケット更新日
 */
const requestIssues = async function (beforeTicketDate: any) {
    var p = setting.query;
    var uri = `${setting.redmineUri}/issues.json?f=&limit=100&sort=updated_on%3Adesc%2Cid%3Adesc&key=${setting.apiKey}${p}`;
    var tickets = await request({ "uri": uri, "json": true });
    var pageCount = Math.ceil(tickets.total_count / tickets.limit);
    console.log(`ISSUES limit=${tickets.limit} ; total_count=${tickets.total_count} ; page_Count=${pageCount}`);
    console.log(`  [1/${pageCount}] GET: ${setting.redmineUri}/issues.json ${tickets ? "200" : "empty"}`);

    for (let i = 2; i <= pageCount; i++) {
        var updatedOn = new Date(tickets.issues[tickets.issues.length - 1].updated_on);
        uri = `${setting.redmineUri}/issues.json?f=&limit=100&sort=updated_on%3Adesc%2Cid%3Adesc&key=${setting.apiKey}&page=${i}${p}`;
        var tickets2 = await request({ "uri": uri, "json": true });
        Array.prototype.push.apply(tickets.issues, tickets2.issues);
        console.log(`  [${i}/${pageCount}] GET: ${setting.redmineUri}/issues.json ${tickets2 ? "200" : "empty"}`);
    }
    return tickets;
}

/**
 * Redmineからチケットを取得する
 * @param {any} tickets チケット情報
 * @param {Date} beforeTicketDate  
 */
const requestTickets = async function (tickets: any, beforeTicketDate: Date) {
    tickets.updateDate = new Date();

    var count = 0;
    for (let i = 0; i < tickets.issues.length; i++) {
        var updatedOn = new Date(tickets.issues[i].updated_on);
        if (updatedOn.getTime() <= beforeTicketDate.getTime()) {
            continue;
        }

        count++;
        var uri = `${setting.redmineUri}/issues/${tickets.issues[i].id}.pdf?key=${setting.apiKey}`;
        var b = await request({ "url": uri, "encoding": null });
        console.log(`  TICKET[${i + 1}/${tickets.issues.length}] GET: ${setting.redmineUri}/issues/${tickets.issues[i].id}.pdf ${b ? "200" : "empty"}`);
        if (b) {
            var filePath = path.join(setting.ticketsPath, `${tickets.issues[i].id}.pdf`);
            fs.writeFileSync(filePath, b);
        }
    }

    var issuesPath = path.join(setting.ticketsPath, "issues.json");
    fs.writeFileSync(issuesPath, JSON.stringify(tickets));
    return count;
}
