import Dialog from '../../components/vant/dialog/dialog';
const config = require("../../config.js");
const request = require("../../request.js");
var date = require('../../utils/date.js');
var app = getApp();

Page({
  data: {
    // 小程序名称
    appName: config.config.appInfo.appName,
    // 是否登录
    isLoggedIn: false,
    // 用户信息
    userInfo: {},
    // 当前学期
    current: config.config.semester.current,
    // 周数
    week: '',
    // 星期数
    weekday: '',
    // 个人信息加载状态
    loadingUserInfo: true
  },

  onShow: function(options) {
    // 判断登录状态决定显示内容
    if (app.isLoggedIn()) {
      this.setData({
        isLoggedIn: true
      });
      
      // 计算周数与星期数
      this.showWeek();

      // 判断并读取缓存
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo'),
        });
        this.showAavtar()
      } else {
        // 获取个人信息
        this.userInfo()
      }
    } else {
      this.setData({
        isLoggedIn: false
      });
    }
  },

  /* 获取个人信息 */
  userInfo: function() {
    this.setData({
      loadingUserInfo: false
    })
    const res = request.base("userInfo", null, false,
      successData => {
        request.success("用户加载", successData.data)
        this.setData({
          userInfo: successData.data.data,
          loadingUserInfo: true
        })
        wx.setStorageSync('userInfo', successData.data.data);
        this.showAavtar()
      },
      failRes => {
        request.fail("用户加载", failRes)
      });
  },

  /* 映射头像 */
  showAavtar() {
    if (this.data.userInfo.gender == '男') {
      this.setData({
        img: '../../assets/images/me/boy.png'
      });
    } else {
      this.setData({
        img: '../../assets/images/me/girl.png'
      });
    };
  },
  
  /* 计算周数与星期数 */
  showWeek: function() {
    var formatTime = new Date(date.formatDateByH(new Date())).getDay();
    var formatTime1 = new Date(date.formatDateByH(new Date())).getTime();
    var formatTimeS = new Date(this.data.current.firstDay).getTime();
    var formatTimeS1 = new Date(this.data.current.secondDay).getTime();
    var days = (formatTime1 - formatTimeS) / (formatTimeS1 - formatTimeS);
    var weekday1 = this.data.current.startDay == 1 ? ["日", "一", "二", "三", "四", "五", "六"] : ["一", "二", "三", "四", "五", "六", "日"];
    var week = (days / 7) + 1;
    this.setData({
      week: parseInt(week),
      weekday: weekday1[formatTime]
    });
  },

  /* 重新绑定 */
  login() {
    Dialog.confirm({
      title: '重新绑定',
      message: '您确定要重新绑定吗？重新绑定会切换您在该应用内的身份并删除全部本地缓存数据。'
    }).then(() => {
      console.log('[UUIA]确定重新绑定')
      app.globalData.isLoggedIn = false
      
      // 保留必要缓存
      var token = wx.getStorageSync("token")
      var isBind = wx.getStorageSync("isBind")
      wx.clearStorage()
      wx.setStorageSync('token', token)
      wx.setStorageSync('isBind', isBind)

      wx.navigateTo({
        url: '../login/login',
      })
    }).catch(() => {
      console.log('[UUIA]取消重新绑定')
    });
  },

  /* 管理 UUIA 账户 */
  manage() {
    if(wx.getStorageSync("isBind")) {
      wx.navigateTo({
        url: '../uuia/index/index',
      })
    } else {
      wx.navigateTo({
        url: '../uuia/bind/bind',
      })      
    }
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