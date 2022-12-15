<!-- 商品列表页面 -->
<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)"> 
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示数据条数
          pagesize: 10
        },
        goodsList: [],
        // 获取多少条数据到时候都存到这个里面
        total: 0,
        // 节流阀
        isloading: false
      };
    },
    onLoad(options) {
      // 把页面获取到的数据存入进去,没有数据的话给一个空的
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      
      // 请求数据
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        // 请求数据的时候先打开
        this.isloading = true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 请求完数据之后在关上
        this.isloading = false
        // 如果数据请求完了就调用这个回调
        cb && cb()
        if(res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 点击事件
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 上拉触底事件
    onReachBottom() {
      // 判断下一页是否有数据,有数据就加载,没有数据反馈没有更多数据
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('没有更多数据')
      if(this.isloading) return
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },
    // 下拉刷新事件
    onPullDownRefresh() {
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
