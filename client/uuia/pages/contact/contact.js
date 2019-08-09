const config = require("../../config.js");

Page({
  data: {
    // TODO: 部门列表
    places: ["教务处", "校长办公室", "公安处"]
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
});