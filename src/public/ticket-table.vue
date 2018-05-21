<template>
  <div id="listCard" class="card">
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="i in data.projects" v-bind:key="i.id">
        <a class="nav-link active" href="#">{{i.name}}</a>
      </li>
    </ul>
    <div class="card-block">
      <h3 class="card-header">Featured</h3>
        <i class="fas fa-calendar"></i>更新日：
        <span v-if="data.issues.updateDate">{{getDateAndTimes(data.issues.updateDate)}}</span><span v-else>未取得</span>
                <table id="tickets" class="table table-striped table-hover table-autofilter">
        <thead>
          <tr>
            <th @click="sortTickets">#<i class="fas fa-sort-down"></i></th>
            <th @click="sortTickets">ステータス</th>
            <th @click="sortTickets">開始日</th>
            <th @click="sortTickets">期日</th>
            <th @click="sortTickets">優先度</th>
            <th @click="sortTickets">題名</th>
            <th @click="sortTickets">担当者</th>
            <th @click="sortTickets">更新日</th>
          </tr>
        </thead>
        <tbody id="tableBody" class="list">
          <tr v-for="i in data.issues.issues" v-bind:key="i.id" @click="showTicket(i.id)">
            <td>{{i.id}}</td>
            <td>{{i.status.name}}</td>
            <td>{{i.start_date}}</td>
            <td>{{i.due_date}}</td>
            <td>{{i.priority.name}}</td>
            <td>{{i.subject}}</td>
            <td>{{i.assigned_to.name}}</td>
            <td>{{getDateAndTimes(i.updated_on)}}</td>              
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";

export default {
  data() {
    return {
      data: {
        projects: [],
        issues: [],
        sortColumn: "id",
        isDesc: false
      }
    };
  },
  created: function() {
    this.requestTickets();
  },
  methods: {
    requestTickets: function() {
      var self = this;
      fetch(`issues.json`)
        .then(r => r.json())
        .then(body => {
          self.data.issues = body;
          return fetch("projects.json");
        })
        .then(r => r.json())
        .then(body => (self.data.projects = body.projects));
    },
    sortTickets: function() {},
    updateIssues: function() {
      closeMessage();
      if (document.getElementById("update").innerText != "未取得") {
        var beforeDate = new Date(document.getElementById("update").innerText);
        var nowDate = new Date();
        nowDate.setMinutes(nowDate.getMinutes() - 1);
        if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
          showMessage("前回の更新から、3分間は更新できません", true);
          return;
        }
      }

      showMessage("チケットを更新しています", false);
      fetch("./update", { method: "POST" })
        .then(i => i.json())
        .then(i => {
          showMessage(i.responseText, false);
          showDataTablesSync();
        });
    },
    showTicket: function(id) {
      var url = id + ".pdf";
      open(url, "_blank");
    },
    getDateAndTimes: function(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style>
#listCard {
  margin-top: 60px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
