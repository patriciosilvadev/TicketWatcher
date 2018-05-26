import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import mainComponent from './main.vue'

Vue.use(BootstrapVue);
var app = new Vue(
    {
        el: '#app',
        components: {
            "app-main": mainComponent
        }
    }
)
