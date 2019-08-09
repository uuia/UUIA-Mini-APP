const config = require("../../config.js");

Page({
  data: {
    // TODO: 校历图片地址列表(建议将高清图裁剪成多部分以供查看)
    url: [
      "https://ws1.sinaimg.cn/large/006tNbRwly1fxsg7z2588j310c0604f1.jpg",
      "https://ws1.sinaimg.cn/large/006tNbRwly1fxsg5rqhdzj30l81587wi.jpg",
      "https://ws1.sinaimg.cn/large/006tNbRwly1fxsg8x7o28j30l60qie81.jpg"
      ]
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