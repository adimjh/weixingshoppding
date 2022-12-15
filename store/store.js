// 1导入
import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的模块
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 2把这个Vuex安装到vue上
Vue.use(Vuex)

// 3.store 实例对象
const store = new Vuex.Store({
  modules: {
    // 把模块内成员的访问路径调成m_cart
    m_cart: moduleCart,
    m_user: moduleUser
  }
})

export default store