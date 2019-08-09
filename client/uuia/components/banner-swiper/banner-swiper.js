// components/banner-swiper/banner-swiper.js
const config = require("../../config.js");

Component({
  lifetimes: {
    attached() {
      this.showBanner();
    }
  },
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    cardCur: 0,
    banners: [], //首页广告位滚动条幅
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取banner信息
    showBanner() {
      this.setData({
        banners: config.config.banners
      })
    },
    // 点击banner跳转
    bannerTo(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    // 处理高光卡片滑动事件
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    }
  }
})