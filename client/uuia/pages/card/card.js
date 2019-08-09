const config = require("../../config.js");
const request = require("../../request.js");

Page({

  data: {
    balance: '--.--',
    subsidy: '-.-元',
    status: '查询中',
    name: '',
    record: [],
    page: '',
    // 校园卡信息
    cardInfo: {},
    // 校园卡加载状态
    loading: false
  },
  
  onLoad: function() {
    const res = request.base("campusCard", null, true,
      successData => {
        request.success("校园卡加载", successData.data)
        this.setData({
          cardInfo: successData.data.data,
          loading: true
        })
      },
      failRes => {
        request.fail("校园卡加载", failRes)
      });
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