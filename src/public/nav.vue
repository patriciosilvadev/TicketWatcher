<template>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <span class="navbar-brand">TicketWatcher</span>
      <button type="button" class="btn btn-outline-info mr-4" @click="update">
        <i class="fas fa-sync"></i> Refresh
      </button>
    </nav>
</template>

<script>
export default {
  props: {
    updateDate: { type: Date, deault: new Date() }
  },
  methods: {
    update: () => {
    //   if (document.getElementById("update").innerText != "未取得") {
    //     var beforeDate = new Date(document.getElementById("update").innerText);
    //     var nowDate = new Date();
    //     nowDate.setMinutes(nowDate.getMinutes() - 1);
    //     if (beforeDate && nowDate.getTime() < beforeDate.getTime()) {
    //       showMessage("前回の更新から、3分間は更新できません", true);
    //       return;
    //     }
    //   }

      fetch("./update", { method: "POST" }).then(r => {
        console.log("終了");
      });
    }
  }
};
</script>
