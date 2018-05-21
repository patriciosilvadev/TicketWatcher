<template>
    <div class="alert alert-danger center-block" :class="{'alert-hide': isHide}" role="alert" id="message" @click="closeMessage">
        <button type="button" class="close" data-dismiss="alert" aria-label="閉じる" @click="closeMessage">
            <span aria-hidden="true">×</span>
        </button>
        <i class="fas fa-exclamation-circle"></i><span id="messageText">{{ message }}</span>
    </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "alert-message",
  props: {
    message: { type: String, deault: "" }
  },
  computed: {
    isHide:  function () {
        return this.message == ""
    }
  },
  methods: {
    closeMessage: function(event) {
      this.$emit('close')
    }
  }
};
</script>

<style scoped>
.alert-hide {
  display: none;
}
</style>
