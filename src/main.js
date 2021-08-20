/*
 * @Author: your name
 * @Date: 2021-01-11 11:41:11
 * @LastEditTime: 2021-02-04 17:38:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hss\vue-iview-admin\src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import iview from "iview";
import axios from "axios";
import less from "less";
import * as echarts from "echarts";

// import 'iview/dist/styles/iview.css';

console.log(process.env);
console.log("当前是:" + process.env.NODE_ENV + "环境");

if (process.env.NODE_ENV == "development") {
  /**
   * 由于这里是异步加载，所以，会出现首次加载闪屏的现象(dom结构加载完了，但是iview样式还没加载完，等iview样式加载完了就会闪一下)
   * 不过这里是开发模式下才会，生产模式都是使用cdn的，不会出现这个情况。为了照顾生产环境，
   * 这里就是使用让开发模式异步加载iview.css吧，取舍一下，优先照顾生产环境。
   * 因为如果这里直接在开头写：import 'iview/dist/styles/iview.css';它是同步代码，不管在开发还是生产模式，
   * 都会打包到css文件里的，开发环境打包没问题，但是生产环境都使用了cdn了，还将它打包到css，就有点浪费了，
   * 所以为了照顾生产环境，就使用hack方法，hack一下。
   */
  import("iview/dist/styles/iview.css").then((res) => {
    console.log("development模式下加载本地iview.css成功");
  });
}

import request from "./api/request";

Vue.prototype.$axios = axios;
Vue.prototype.$http = request;

// console.log(request({
//   url: '/api/log/list',
//   method: 'get',

// }))
import router from "./router";
import store from "./store";

// 全局路由鉴权以及判断token
import "./permission";

import plugins from "./libs/plugins";
Vue.prototype.$bus = new Vue();
Vue.prototype.$echarts = echarts;

Vue.use(iview);
Vue.use(plugins);
Vue.use(less);

Vue.config.productionTip = false;

// import cache from './libs/cache1'

// console.log(cache)

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
