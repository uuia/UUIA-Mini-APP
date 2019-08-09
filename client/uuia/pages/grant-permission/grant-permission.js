const app = getApp();
const config = require("../../config.js");

Page({
  data: {
    name: config.config.appInfo.name
  },

  onGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo == null) {
      wx.showToast({
        icon: 'none',
        title: '请允许获取微信账户的信息以继续使用',
      })
    } else {
      app.loginUUIA()
      setTimeout(() => {
        wx.switchTab({
          url: '../index/index',
        })
      }, 1000)
      wx.navigateBack(-1)
    }
  },
})