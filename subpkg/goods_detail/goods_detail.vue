<!-- 商品详细信息 -->
<template>
  <!-- 先使用if来判断一下，有数据了就开始渲染，如果没有数据就等加载 -->
  <view class="goods-detail-container" v-if="goods_info.goods_name">
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息 -->
    <view class="goods-info-box">
      <!-- 价格 -->
      <view class="price">
        ¥{{goods_info.goods_price}}
      </view>
      <view class="goods-info-body">
        <!-- 商品的名称 -->
        <view class="goods-name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
        <!-- 运费 -->
        <view class="yf">
          快递： 免运费--- {{cart.length}}
        </view>
      </view>
    </view>
    <!-- 商品详情 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品导航 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
  // 先导出vuex里面的mapState
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  
  export default {
    data() {
      return {
        goods_info: {},
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "red"
        }, {
        		icon: 'cart',
        	 text: '购物车',
          info: 2
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      // 把获取到的数据给到goods_id
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 把我们自己封装的m_cart模块映射到当前页面
      ...mapMutations('m_cart', ['addToCart']),
      // 获取数据
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 处理一下商品详情页面的数据  使用正则表达式 匹配到所有的img 在img里面加上style="display:block;"  在把所有的webp格式替换成jpg格式，先是匹配到所有的webp  在修改成jpg
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
          .replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      // 点击事件
      preview(i) {
        // 点击图片变大  previewImage是预览图片事件的方法
        uni.previewImage({
          // 这个current是轮播的索引,看你查看哪一个就是哪一个
          current: i,
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      // 商品导航事件
      onClick(e) {
        if(e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        if(e.content.text === '加入购物车') {
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1,
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true
          }
          
          this.addToCart(goods)
        } 
      }
    },
    computed: {
      // 先是把模块名称放进来,然后是映射进来的数据的名称
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      // 页面首次加载完毕不会调用这个监听器
      total: {
        handler(newVal) {
          const findResult = this.options.find((x) => x.text === '购物车')
          if(findResult) {
            findResult.info = newVal
          }
        },
        // 声明监听器,页面初次加载完毕后立即调用
        immediate:true
      }
    }
  }
</script>

<style lang="scss">
  // 整个页面最外层
  .goods-detail-container {
    padding-bottom: 50px;
    
    // 轮播图
      swiper {
        height: 750rpx;
    
        image {
          width: 100%;
          height: 100%;
        }
      }
    // 商品信息
      .goods-info-box {
        padding: 10px;
        padding-right: 0;
    
        .price {
          color: #c00000;
          font-size: 18px;
          margin: 10px 0;
        }
    
        .goods-info-body {
          display: flex;
          justify-content: space-between;
    
          .goods-name {
            font-size: 13px;
            pointer-events: 10px;
          }
    
          .favi {
            width: 120px;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-left: 1px solid #efefef;
            color: gray;
          }
    
          .yf {
            margin: 10px 0;
            font-size: 12px;
            color: gray;
          }
        }
      }
      .goods_nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
      }
  }
  
</style>
