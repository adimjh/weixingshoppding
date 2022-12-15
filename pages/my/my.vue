<template>
  <view class="my-container">
    <!-- 未登录 -->
    <my-login v-if="!token"></my-login>
    
    <!-- 登录上去 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        
      };
    },
    computed: {
      // 把token 拿进来之后就可以进入判断展示了
      ...mapState('m_user', ['token'])
    }
  }
</script>

<style lang="scss">
  page,
  .my-container {
    height: 100%;
  }
</style>
