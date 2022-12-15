<template>
  <view>
    <view class="search-box">
      <my-search @click="gotoSearch()"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?good_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in nacList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层数据 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <view class="floor-img-box">
          <!-- 左侧图片 -->
          <navigator class="left-image-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧图片 -->
          <view class="right-img-box">
            <view class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </view>
          </view>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // 轮播图
        swiperList: [],
        // 分类导航
        nacList: [],
        // 楼层数据
        floorList: []
      };
    },
    
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    
    methods: {
      // 轮播图
      async getSwiperList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
      },
      // 分类导航
      async getNavList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.nacList = res.message
      },
      // 四个分类导航点击跳转链接
      navClickHandler(item) {
        if(item.name === "分类") {
          uni.switchTab({
              url: '/pages/cate/cate',
          })
        }
      },
      // 楼层数据
      async getFloorList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
        if(res.meta.status !== 200) return uni.$showMsg()
        // 处理rul地址item.product_list[0].url
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    },
  }
</script>

<style lang="scss">
  // 轮播图
swiper {
  height: 330rpx;
  .swiper-item,
  image{
    width: 100%;
    height: 100%;
  }
}
// 分类
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img{
    width: 128rpx;
    height: 140rpx;
  }
}
// 楼层
.floor-list {
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
    .right-img-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
  }
}
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}


</style>
