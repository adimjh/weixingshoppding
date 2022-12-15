// 封装徽标的功能
import {mapGetters} from 'vuex'

export default {
  
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  watch: {
    // 监听，当它发生变化的时候会自己调用
    total() {
      this.setBadge()
    }
  },
  onShow() {
    this.setBadge()
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index:2,
        text: this.total + ''
      })
    }
  }
}