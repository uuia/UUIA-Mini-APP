const config = require("../../../config.js");
const request = require("../../../request.js");

Page({
  data: {
    // UUIA信息
    uuia: config.config.uuia,
    // 联系方式
    contactList: [{
      title: "UUIA 官方网站",
      content: "https://uuia.info"
    }, {
      title: "UUIA 开源Github仓库",
      content: "https://github.com/uuia"
    }, {
      title: "UUIA 开发者交流QQ群",
      content: "985877354"
    }, ]
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    // const res = request.uuia("/general/account/bind/activate", data, true,
    //   successData => {
    //     console.log(successData)
    //     this.setData({
    //       message: successData.msg
    //     })
    //   },
    //   failRes => {});
  },

  /* 切换开源/简介显示 */
  toggleLog() {
    this.setData({
      showLog: !this.data.showLog
    });
  },

  /* 复制文本 */
  copyText: function(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /* 预览图片 */
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: [e.currentTarget.dataset.url]
    })
  },

  /* 分享 */
  onShareAppMessage: function() {
    var that = this;
    var shareObj = {
      title: config.config.appInfo.name + " | " + config.config.appInfo.slogan,
      path: '../../index/index',
      imageUrl: config.config.appInfo.logo,
    };
    return shareObj;
  },
})