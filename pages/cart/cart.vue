<template>
  <!-- 如果购物车的长度不等于0就渲染这个页面 -->
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址 -->
    <my-address></my-address>
    <!-- 商品列表标题 -->
    <view class="cart-title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 商品列表 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
          <my-goods :goods="goods" :show-radio="true" @radio-change="radioChangHandler" :show-num="true" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    
    <!-- 结算组件-->
    <my-settle></my-settle>
  </view>

  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">购物车为空，快去选购商品吧~</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: "删除",
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    methods: {
      // 选中状态和数量按钮
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 选中状态
      radioChangHandler(e) {
        console.log(e);
        this.updateGoodsState(e)
      },
      // 数量按钮
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 点击删除按钮
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
  
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    
    .cart-title-text {
      margin-left: 10px;
    }
  }
}
// 购物车是空的
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  
  .empty-img {
    width: 90px;
    height: 90px;
  }
  
  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}

</style>
