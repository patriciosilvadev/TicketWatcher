<template>
  <div>
    <b-nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <b-navbar-brand>TicketWatcher</b-navbar-brand>
      <b-button info type="button" class="btn mr-4" @click="updateIssues"><i class="fas fa-sync"></i> Refresh</b-button>
    </b-nav>

    <b-card id="listCard">
      <b-card-header>
        <b-alert :show="message!=''" dismissible fade @click="message = ''">{{message}}</b-alert>
        <b-tabs>
          <b-tab :title="i.name" v-for="i in projects" v-bind:key="i.id" @click="onTabLink(i.name)"></b-tab>
        </b-tabs>
      </b-card-header>
      <b-card-body id="card-content">
        <p><i class="fas fa-calendar"></i>更新日：
          <span v-if="issues.updateDate">{{getDateAndTimes(issues.updateDate)}}</span><span v-else>未取得</span>
        </p>
        <b-table hover striped autofilter :items="issues.issues" :fields="fields" :filter="filter">
          <template slot="id" slot-scope="data"><a :href="data.item.id + '.pdf'">{{data.item.id}}</a></template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
// import io from "socket.io-client";
// import vueSocketIo from "vue-socket.io";
// Vue.use(vueSocketIo,socket);
export default Vue.extend({
  data() {
    return {
      projects: [],
      issues: [],
      fields: {
        id: { label: "#", sortable: true },
        status: { key: "status.name", label: "ステータス", sortable: true },
        start_date: { label: "開始日", sortable: true },
        due_date: { label: "期日", sortable: true },
        priority: { key: "priority.name", label: "優先度", sortable: true },
        subject: { label: "題名", sortable: true },
        assigned_to: {
          key: "assigned_to.name",
          label: "担当者",
          sortable: true
        },
        updated_on: { label: "更新日", sortable: true }
      },
      filter: "",
      message: "",
    };
  },
  created: function() {
    this.requestTickets();
  },
  methods: {
    requestTickets: function() {
      var self = this;
      fetch("projects.json")
        .then(r => r.json())
        .then(body => {
          self.projects = body.projects;
        });
    },
    updateIssues: function() {
      this.message = "";
      if (this.issues.updateDate != undefined) {
        var beforeDate = new Date(this.issues.updateDate);
        var nowDate = new Date();
        nowDate.setMinutes(nowDate.getMinutes() - 1);
        if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
          this.message = "前回の更新から、3分間は更新できません";
          return;
        }
      }

      this.message = "チケットを更新しています";
      var self = this;
      fetch("./update", { method: "POST" })
        .then(i => i.text())
        .then(i => {
          this.message = i;
          self.requestTickets();
        });
    },
    showTicket: function(id:string) {
      open(id + ".pdf", "_blank");
    },
    getDateAndTimes: function(value:string) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    onTabLink: function(tabName:string) {
      this.filter = tabName;
      var self = this;
     fetch(`issues-${tabName}.json`).then(r => r.json())
        .then(body => {
          self.issues.splice(0, self.issues.length);
          Array.prototype.push.apply(self.issues, body);
        }
          );

    }
  },
});
</script>

<style>
#listCard {
  margin-top: 80px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 60px;
}
#card-content {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
