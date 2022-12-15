export default {
  namespaced: true,
  
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录  从本地存储中拿到这个token
    token: uni.getStorageSync('token' || ''),
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    redirectInfo: null
  }),
  
  // 方法
  mutations: {
    // 点击收货地址的功能
    updateAddress(state, address) {
      state.address = address
      // 调用储存
      this.commit('m_user/saveAddressToStorage')
    },
    // 把购物车里的数据存储到这个里面
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 登录功能
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 把个人信息的数据存储起来
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    }
  },
  
  // 数据包装器
  getters: {
    // 定义一下这收货地址的详细属性
    addstr(state) {
      if(!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
      }
  }
}