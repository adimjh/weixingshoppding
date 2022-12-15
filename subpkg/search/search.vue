<!-- 搜素框页面 -->
<template>
  <view>
    <!-- 搜素框 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"/>
    </view>
    
    
    
    <!-- 搜素列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 历史记录 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜素历史</text>
        <uni-icons type="trash" size="17" @click="ClearHistory()"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" :customStyle="'display: inline-block; margin: 5px 5px 0 0;'" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器
        timer: null,
        // 输入框写出的关键词
        kw: '',
        // 搜素到的商品列表
        searchResults: [],
        // 储存历史记录
        historyList: []
      }
    },
    onLoad() {
      // 获取本地存储的数据, 没有的话就给一个空的数据
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 把之前的先关掉   防抖
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e.trim()
          this.getSearchList()
        },  500)
      },
      // 输入框输入内容
      async getSearchList() {
        // 输入框判断
        if(this.kw === '') {
          this.searchResults = []
          return
        }
        // 请求数据
        const {
          data: res
          } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        
        // 调用保存关键词的方法
        this.saveSearchHistory()
      },
      // 点击商品跳转到对应的页面
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 搜素的历史记录加入进去
      saveSearchHistory() {
        // 这里去重加入数据
        // 先把数组转化成set对象
        const set = new Set(this.historyList)
        // 调用删除相关元素的代码
        set.delete(this.kw)
        // 在把相关的元素调到前面去
        set.add(this.kw)
        // 然后把处理过的set转化成History
        this.historyList = Array.from(set)
        
        // 本地存储
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 垃圾桶清空数据
      ClearHistory() {
        // 先把页面的数据清空
        this.historyList = []
        // 把本地存储的清空
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    computed: {
      // 把历史记录里面的数据调转过来
      historys() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  // 搜素框
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
// 搜素列表
.sugg-list {
  padding: 0 10px;
  
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    
    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}

// 搜素历史
.history-box {
  padding: 0 10px;
  
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
    
    .history-list {
      display: flex;
      flex-wrap: wrap;
      
    }
  }
}
</style>
