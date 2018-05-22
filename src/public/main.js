import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// font-awesome Regular・Brandsライブラリを使用する場合、onloadでライブラリを追加
import fontawesome from '@fortawesome/fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'

import mainComponent from './ticket-table.vue'

Vue.use(BootstrapVue);

var app = new Vue(
    {
        el: '#app',
        components: {
            "app-main": mainComponent
        }
    }
)





// /* import $ from 'jquery';
// import 'bootstrap'
// var dt = require('datatables.net')()
// import 'datatables.net-bs4'
// //import { requestSync } from '../helper/XmlHttpRequestSync'
// import moment from 'moment';

// // font-awesome RegularやBrandsライブラリを使用する場合、onloadでライブラリを追加
// import fontawesome from '@fortawesome/fontawesome'
// import faSolid from '@fortawesome/fontawesome-free-solid'

// import 'bootstrap/dist/css/bootstrap.css';
// import 'datatables/media/css/jquery.dataTables.css'
// import 'datatables.net-bs4/css/dataTables.bootstrap4.css';

// import '../stylesheets/style.css';
// import '../stylesheets/navbar-top-fixed.css';

// window.onload = () => {
//     // font-awesomeの設定
//     fontawesome.library.add(faSolid)    // ライブラリの設定
//     fontawesome.dom.css()

//     $('#updateButton').on('click', () => update());

//     // DataTablesの言語設定
//     $.extend($.fn.dataTable.defaults, {
//         language: {
//             url: "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
//         }
//     });

//     document.getElementById("tableBody").innerText = "";
//     $("#tickets").DataTable({
//         // 件数切替機能
//         lengthChange: false,
//         // 検索機能
//         searching: true,
//         // 情報表示 無効
//         info: false,
//         // ページング機能
//         paging: false,
//         columns: [
//             { data: "id" },
//             { data: "project" },
//             { data: "status" },
//             { data: "start_date" },
//             { data: "due_date" },
//             { data: "priority" },
//             { data: "subject" },
//             { data: "assigned_to" },
//             { data: "updated_on" }
//         ],
//         "order": [[8, "desc"]]
//     });
//     $('#tickets').DataTable().clear().draw();
//     showDataTablesSync();
// }

// /**
//  * テーブルに値を表示する
//  */
// var showDataTablesSync = async () => {
//     // 値をjsonで取得
//     var errorData;
//     var datas = await fetch("./issues.json").then(i => i.json()).catch(e => errorData = e);
//     if (errorData) {
//         console.error(errorData);
//         return;
//     }

//     if (datas.fessUri) {
//         $('#fessSearch').css("visibility", "visible");
//     }

//     console.log("成功");
//     $("#update").text(datas.updateDate ? getDateAndTimes(datas.updateDate) : "未取得");
//     $('#tickets').DataTable().clear().draw();
//     for (let i = 0; i < datas.issues.length; i++) {
//         var element = datas.issues[i];

//         $('#tickets').DataTable().row.add({
//             "id": `<a href='./${element.id}.pdf' style='display: block;'>#${element.id}</a>`,
//             "project": element.project.name,
//             "status": element.status.name,
//             "start_date": element.start_date ? element.start_date : "",
//             "due_date": element.due_date ? element.due_date : "",
//             "priority": element.priority.name,
//             "subject": element.subject,
//             "assigned_to": element.assigned_to ? element.assigned_to.name : "",
//             "updated_on": getDateAndTimes(element.updated_on)
//         }).draw();
//         // tz('Asia/Tokyo')
//     }
// }

// function update() {

//     closeMessage();
//     if (document.getElementById("update").innerText != "未取得") {
//         var beforeDate = new Date(document.getElementById("update").innerText);
//         var nowDate = new Date();
//         nowDate.setMinutes(nowDate.getMinutes() - 1);
//         if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
//             showMessage("前回の更新から、3分間は更新できません", true);
//             return;
//         }
//     }

//     showMessage("チケットを更新しています", false);
//     var request = new XMLHttpRequest();
//     request.open('POST', './update', true);
//     request.onloadend = function () {
//         showMessage(this.responseText, false);
//         showDataTablesSync();
//     }
//     request.send();
// }
// /** 
//  * アラートメッセージを表示する
//  * @param {string} message メッセージ 
//  * @param {any} isError trueの場合、エラーアラートを表示する
//  */
// function showMessage(m, isError) {
//     var e = document.getElementById("message");
//     e.classList.remove("alert-danger");
//     e.classList.remove("alert-info");
//     e.classList.add(isError ? "alert-danger" : "alert-info");
//     document.getElementById("messageText").innerText = m;
//     $("#message").fadeIn();
// }

// /**
//  * アラートメッセージを閉じる
//  */
// var closeMessage = () => {
//     var e = document.getElementById("message");
//     e.classList.remove("alert-danger");
//     e.classList.remove("alert-info");
//     document.getElementById("messageText").innerText = "";
//     $("#message").fadeOut();
// }

// function getDateAndTimes(value) {
//     return moment(value).format('YYYY-MM-DD HH:mm:ss');
// };
