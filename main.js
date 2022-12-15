import App from './App'

// 搜素框组件
import MySearch from './components/my-search/my-search'
Vue.component('my-search',MySearch)
// 商品列表组件
import MyGoods from './components/my-goods/my-goods'
Vue.component('my-goods',MyGoods)
// 收货地址的组件
import myAddress from './components/my-address/my-address.vue'
Vue.component('my-goods',myAddress)
// 结算组件
import mySettle from './components/my-search/my-search.vue'
Vue.component('my-settle',mySettle)
// 登录组件
import myLogin from './components/my_login/my_login.vue'
Vue.component('my-login',myLogin)
// 用户信息组件
import myUserInfo from './components/my_userinfo/my_userinfo.vue'
Vue.component('my-userinfo',myUserInfo)

// 4.把vue实例挂载页面上
import store from './store/store.js'


// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'


// 请求拦截器
$http.beforeRequest = function (options) {
  wx.showLoading({
    title: '数据加载中...',
  })
  
  // 这个页面是需要登录之后才能访问的，如果能找到就返回1，找不到就-1
  if(options.url.indexOf('/my/') !== -1){
    options.header = {
      // 访问此系列请求必须在头信息中添加token,"Authorization" : token
      Authorization : store.state.m_user.token
    }
  }
  
}



// 响应拦截器
// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
}

// 封装数据加载
uni.$showMsg = function(title = '数据加载失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: "none"
  })
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    // 5 挂载上去
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif