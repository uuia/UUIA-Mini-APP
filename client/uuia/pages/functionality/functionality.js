const app = getApp();
const uuia = require("../../config.js");

Page({
  data: {
    // 登录状态
    isLoggedIn: false,
    // 功能列表
    functionList: [
      {
        title: "学习在" + uuia.config.appInfo.schoolAbbr,
        eng: "Study",
        functions: [
          {
            icon: "icon-calendar",
            name: "课表",
            url: "../table/table"
          },
          {
            icon: "icon-selection",
            name: "成绩",
            url: "../grade/grade"
          },
          {
            icon: "icon-edit",
            name: "考试",
            url: "../exam/exam"
          }
        ]
      },
      {
        title: "生活在" + uuia.config.appInfo.schoolAbbr,
        eng: "Life",
        functions: [
          {
            icon: "icon-vipcard",
            name: "校园卡",
            url: "../card/card"
          },
          {
            icon: "icon-time",
            name: "校历",
            url: "../calendar/calendar"
          },
          {
            icon: "icon-phone",
            name: "通讯录",
            url: "../contact/contact"
          }
        ]
      },
      {
        title: "精彩在" + uuia.config.appInfo.schoolAbbr,
        eng: "Leisure",
        functions: [
          {
            icon: "icon-more",
            name: "更多",
            url: ""
          }
        ]
      }  
    ]
  },

  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    if (app.isLoggedIn()) {
      this.setData({
        isLoggedIn: true
      });
    } else {
      this.setData({
        isLoggedIn: false
      });
    }
  },

  /* 跳转至对应功能页 */
  navigate(e) {
    wx.navigateTo({
      url: this.data.isLoggedIn ? e.currentTarget.dataset.url : '../login/login',
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