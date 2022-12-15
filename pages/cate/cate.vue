<template>
  <view>
    <my-search @click="gotoSearch()"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滚动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left-scroll-view">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滚动区域 -->
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <image src="/static/tab_icons/在线验资.png" mode=""></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // 窗口可用高度 = 屏幕高度 - navigationBar高度 - TabBar高度
        wh: 0,
        //分类列表
        cateList: [],
        // 默认第一项被选中
        active: 0,
        // 二级分类
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50
      this.getCateList() 
    },
    methods: {
      async getCateList() {
        const { data: res } = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i
        this.cateLevel2 = this.cateList[i].children
        
        //切换scrollTop 
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转分包的商品列表页面
      gotoGoodsList(item3) {
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      // 跳转分包中的搜素页面
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  
  .left-scroll-view {
    width: 120px;
    
    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;
      
      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;
        
        &::before {
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #707070;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  // 二级目录
  .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }
    
  // 三级目录  
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
    
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      
      image {
        width: 30px;
        height: 60px;
      }
      
      text {
        font-size: 12px;
      }
    }
  }
}
</style>
