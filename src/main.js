// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VCharts from 'v-charts';
import echarts from "echarts"; // 图表
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css';
import 'font-awesome/css/font-awesome.min.css'
import './components/base/chalk.js';

Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios.create({
  baseURL: "http://172.30.193.134:8080",
  // baseURL: "http://139.196.200.37:8080",
  //baseURL:"http://192.168.1.119:8080",
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // },
});

Vue.use(ElementUI);
Vue.use(VCharts);


// 使用钩子函数控制登录跳转
router.beforeEach((to, from, next) => {
  let permissionList = JSON.parse(sessionStorage.getItem('permissionList') || '[]');
  console.log(permissionList)
  let user_id = sessionStorage.getItem('user_id');
  if (to.path == '/login') {
    console.log("path==login")
    next();
  } else if (!user_id) {
    console.log("没有登录")
    next('/login');
  } else if (permissionList.indexOf(to.path) > 0) {
    console.log("有权限")
    next();
  } else {
    console.log(to.path)
    console.log("没有权限")
    next("/403");
  }
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
