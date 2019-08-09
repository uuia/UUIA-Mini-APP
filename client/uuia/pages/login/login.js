const config = require("../../config.js");
const request = require("../../request.js");
var app = getApp();

Page({
  data: {
    // 背景类型
    showVideo: true,
    // 小程序信息
    appInfo: config.config.appInfo,
    // 登录页背景配置
    loginPage: config.config.loginPage,
    // 绑定类型
    bindType: [],
    // 帮助栏状态
    help_status: false,
    // 输入栏状态
    username_focus: false,
    password_focus: false,
    // 输入栏信息
    username: "",
    password: "",
    // 输入顺次
    index: 0,
  },

  onLoad: function() {
    // IOS用户强制为图片（受限于IOS cover-view）
    if (app.globalData.isiOS || this.data.loginPage.backgroundType == "image") {
      this.setData({
        showVideo: false
      })
    }

    // 获取绑定信息类型
    this.bindType();
  },

  /* 跳过 */
  skip() {
    if (this.data.index + 1 == this.data.bindType.length) {
      wx.navigateBack({})
    }
    this.setData({
      index: this.data.index + 1
    })
  },

  /* 请求待绑定账户类型 */
  bindType() {
    const res = request.base("bindType", null, true, 
      successData => {
        request.success("账户类型加载", successData)
        this.setData({
          bindType: successData.data.data.accountTypes
        })
      },
      failRes => {
        request.fail("绑定信息加载", failRes)
      });
  },

  /* 请求绑定 */
  bind(e) {
    if (!this.data.username || !this.data.password) {
      app.showErrorModal('账号及密码均不能为空。', '请检查输入');
      return false;
    }

    console.log(e)
    // 请求体数据
    var data = {};
    data.account = {};
    data.account.username = this.data.username;
    data.account.password = this.data.password;
    data.account.code = this.data.bindType[this.data.index].code;

    const res = request.base("bind", data, true,
      successData => {
        console.log(successData)
        if(successData.data.data.ifSuccess == true) {
          app.globalData.isLoggedIn = true
          console.log(this.data.index + 1)
          console.log(this.data.bindType.length)
          console.log(this.data.index + 1 == this.data.bindType.length)
          if(this.data.index + 1 == this.data.bindType.length) {
            console.log("here")
            wx.navigateBack({})
          }
          this.setData({
            index: this.data.index + 1
          })
        }
      },
      failRes => {

      });
  },

  /* 输入监听 */
  usernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  passwordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  inputFocus(e) {
    if (e.target.id == 'username') {
      this.setData({
        'username_focus': true
      });
    } else if (e.target.id == 'password') {
      this.setData({
        'password_focus': true
      });
    }
  },

  inputBlur(e) {
    if (e.target.id == 'username') {
      this.setData({
        'username_focus': false
      });
    } else if (e.target.id == 'password') {
      this.setData({
        'password_focus': false
      });
    }
  },

  /* 帮助提示框监听 */
  tapHelp(e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },

  showHelp(e) {
    this.setData({
      'help_status': true
    });
  },

  hideHelp(e) {
    this.setData({
      'help_status': false
    });
  },

  /* 分享 */
  onShareAppMessage: function() {
    var shareObj = {
      title: config.config.appInfo.name + " | " + config.config.appInfo.slogan,
      path: '../index/index',
      imageUrl: config.config.appInfo.logo,
    };
    return shareObj;
  },
});