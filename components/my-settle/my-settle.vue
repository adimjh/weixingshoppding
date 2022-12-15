<template>
  <!-- 结算组件 -->
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计 -->
    <view class="amount-box">
      合计： <text class="amount">¥{{checkedGoodsMaount}}</text>
    </view>

    <!-- 结算 -->
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        seconds: 3,
        timer: null
      };
    },

    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsMaount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 全选,数量对上了就是全选
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      // 点击全选功能
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        if (!this.addstr) return uni.$showMsg('请选择收货地址')
        // if(!this.token) return uni.$showMsg('请先登录')
        if (!this.token) return this.delayNavigate()

        // 支付功能
        this.payOrder()
      },
      // 点击结算跳转登录页面
      showTips(num) {
        uni.showToast({
          icon: 'none',
          title: '请登录再结算' + num + '秒后自动跳转到登录页面',
          mask: true,
          duration: 1500
        })
      },
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        // 用定时器每隔一秒减一个数字
        this.timer = setInterval(() => {
          this.seconds--
          // 如果秒数没有了就跳转到登录页面
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              // 跳转成功之后执行这样的回调
              success: () => {
                this.updateRedirectInfo({
                  // 从哪个页面跳转过来的,存入一下
                  openType: 'switchTab',
                  // 从哪个页面跳转过来的
                  from: '/pages/cart/cart',
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      // 支付
      async payOrder() {
        // 创建订单
        const orderInfo = {
          // order_price: this.checkedGoodsAmount  正常怎么写,测试的话就写死
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('订单创建失败')
        // 否则拿到订单的响应
        const orderNumber = res.message.order_number
        // 订单预支付
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        if (res2.meta.status !== 200) return uni.$showError('预订单生成失败!')
        const payInfo = res2.message.pay

        // 发起微信支付功能
        const [err, succ] = await uni.requestPayment(payInfo)
        // 支付失败返回这个
        if (err) return uni.$showMsg('订单未支付！')
        // 支付成功
        const {
          dara: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        if (res3.meta.status !== 200) return uni.$showError('订单支付失败')
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      height: 50px;
      min-width: 100px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
    }
  }
</style>
