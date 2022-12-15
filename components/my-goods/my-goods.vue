<template>
    <view class="goods-item">
      <!-- 左侧的商品图 -->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧的商品信息 -->、
      <view class="goods-item-right">
        <view class="goods-name">
          {{goods.goods_name}}
        </view>
        <view class="goods-info-box">
          <view class="goods-price">
            <!-- 把价格控制在小数点两位 -->
            ¥{{goods.goods_price | tofixed}}
          </view>
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
</template>

<script>
  export default {
    name:"my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      // 判断选中的样式在页面的展示或不展示，默认不展示
      showRadio: {
        type: Boolean,
        default: false
      },
      // 判断数量按钮的展示或不展示
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultPic: 'https://img.zcool.cn/community/01752e5e70bbd0a80120a895520a30.jpg@1280w_1l_2o_100sh.jpg'
      };
    },
    filters: {
      // 过滤器,把小数点控制在两位,仅限于vue2 ,vue3已经没有了
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // 选中切换
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      numChangeHandler(value) {
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: +value
        })
      },
    }
  }
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  
  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  
  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    
    .goods-name {
      font-size: 13px;
    }
    
    .goods-info-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
}
</style>