const uuia = require("../../config.js");

Page({

  data: {
    developers: uuia.config.developers,
    appName: uuia.config.appInfo.appName
  },

  /* 预览图片 */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, 
      urls: [e.currentTarget.dataset.url]
    })
  },

  /* 分享 */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: config.config.appInfo.name + " | " + config.config.appInfo.slogan,
      path: '../index/index',
      imageUrl: config.config.appInfo.logo,
    };
    return shareObj;
  },
})