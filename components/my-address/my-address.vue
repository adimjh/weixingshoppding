<template>
  <view>
    <!-- 收货地址： -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <!-- 收货信息 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1_left">
          <view class="username">
            收货人：<text>{{address.userName}}</text>
          </view>
        </view>
        <view class="row1_right">
          <view class="phone">
            电话：<text>{{address.telNumber}}</text>
          </view>
        </view>
      </view>
      <view class="row2">
        <view class="row2_left">
          收货地址：
        </view>
        <view class="row2_right">
          {{addstr}}
        </view>
      </view>
    </view>
    <!-- 下边框 -->
    <image src="/static/cart_border@2x.png" class="address-borde"></image>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
        // address: {}
      };
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      // 点击之后获取到官方api的这个效果  只能使用2.71的版本   需要在小程序原生中的app.josn中加入"requiredPrivateInfos": ["chooseAddress"],
      async chooseAddress() {
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        if(err === null && succ.errMsg === 'chooseAddress:ok') {
          // this.address = succ
          this.updateAddress(succ)
        }
      }
    },
    computed: {
      ...mapState('m_user', ['address']),
      // 定义一下这收货地址的详细属性
      ...mapGetters('m_user', ['addstr'])
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-info-box {
    height: 90px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1_left {
        display: flex;
        align-items: center;

        .phone {
          margin-right: 5px;
        }
      }
    }

    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .row2_left {
        white-space: nowrap;
      }
    }
  }
  
  .address-borde {
    display: block;
    width: 100%;
    height: 5px;
  }
  
</style>
