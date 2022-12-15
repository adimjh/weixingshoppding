<!-- 登录组件 -->
<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">点击我登录~</button>
    <view class="tips-text">
      登录后享更多优惠
    </view>
  </view>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
  export default {
    name:"my_login",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 点击登录功能
      getUserInfo(e) {
        // 用户取消了登录授权
        if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('你取消了登录授权')
        // console.log(e.detail.userInfo);
        // 把数据存储进来
        this.updateUserInfo(e.detail.userInfo)
        // 调用请求
        this.getToken(e.detail)
      },
      // 发起登录请求
      async getToken(info) {
        const [err, res] = await uni.login().catch(err => err)
        // 这个是获取失败的
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('获取失败！')
        // 否侧登录成功也是需要获取token 的 ，这是我们在发起请求的时候传递一些参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        
        // console.log(query);
        // 获取一些token
        const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败')
        uni.$showMsg('登录成功')
        
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o")
        
        // 判断redirectInfo中的值是否是null,有值的话就直接调用这个值
        this.navigateBack() 
      },
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            // 不管成功与否都会执行的一个回调
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    border-radius: 100%;
    transform: translateY(50%);
    background-color: white;
  }
  
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #464646;
  }
  
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>