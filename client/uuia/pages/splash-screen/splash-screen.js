const config = require("../../config.js");

Page({

  data: {
    appInfo: config.config.appInfo
  },

  onLoad: function () {
    
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