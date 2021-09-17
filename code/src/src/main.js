// 入口文件
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/plugins/element.js'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/iconfont/iconfont.css'
// 导入 axios 包
import axios from 'axios'

Vue.config.productionTip = false

// 配置 axios 将其挂载到vue 原型
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/private/v1/'

// axios 请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
