// 购物车的store模块
export default {
  namespaced: true,
  
  state: () => ({
    // 里面有数据可以渲染数据里的，如果没有就赋值一个空的
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  mutations: {
    // 加入购物车
    addToCart(state, goods) {
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      
      if(!findResult) {
        state.cart.push(goods)
      }else {
        findResult.goods_count++
      }
      
      // 调用这个方法
      this.commit('m_cart/saveToStorage')
    },
    
    // 持久化本地存储
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车商品选中状态  state:状态   goods: 商品信息
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    // 点击数量按钮的增或减
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 滑动删除
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id != goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的选中状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },
  
  getters: {
    // 统计购物车中商品数量
    total(state) {
      let count = 0
      state.cart.forEach(goods => count += goods.goods_count) 
        return count
    },
    // 勾选商品的总数量
    checkedCount(state) {
      // 把购物中勾选的商品过滤一下  .reduce 遍历
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选商品的总价
    checkedGoodsMaount(state) {
      return state.cart
        // 选出勾选的商品
        .filter(x => x.goods_state)
        // 遍历的计算出商品的总价
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        // 保留两位小数
        .toFixed(2)
    }
  }
}