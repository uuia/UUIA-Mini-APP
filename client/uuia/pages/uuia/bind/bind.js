const config = require("../../../config.js");
const request = require("../../../request.js");
var app = getApp();

Page({
  data: {
    // 小程序信息
    appInfo: config.config.appInfo,
    // 帮助栏状态
    help_status: false,
    // 输入栏状态
    username_focus: false,
    password_focus: false,
    // 输入栏信息
    username: '',
    password: '',
    // 正在激活状态
    isActivating: false,
    // 提示信息
    message: '',
    // 激活码输入框个数
    Length: 6,
    // 聚焦
    isFocus: true,
    // 激活码
    Value: "",
    // 是否密文显示 true为密文， false为明文。
    ispassword: false, 
  },

  onLoad: function() {

  },

  /* 请求绑定 */
  bind: function() {
    var that = this;
    if (!that.data.username || !that.data.password) {
      app.showErrorModal('邮箱及密码均不能为空。', '请检查输入');
      return false;
    }

    // 请求体数据
    var data = {};
    data.email = this.data.username;

    const res = request.uuia("/general/account/bind/email", data, true,
      successData => {
        console.log(successData)
        if(successData.code == 200) {
          this.setData({
            isActivating: true,
            message: successData.msg
          })
        } else {
          app.showErrorModal(successData.msg, '注册失败');
        }
        
      },
      failRes => {
        request.fail("绑定UUIA", failRes)
      });
  },

  /* 请求激活 */
  activate() {
    var that = this;
    if (!that.data.Value) {
      app.showErrorModal('激活码不能为空。', '请检查输入');
      return false;
    }

    // 请求体数据
    var data = {};
    data.activationCode = this.data.Value;
    data.password = this.data.password;

    const res = request.uuia("/general/account/bind/activate", data, true,
      successData => {
        console.log(successData)
        this.setData({
          message: successData.msg
        })
        if (successData.msg == "激活完成并已设置密码") {
          wx.setStorageSync('isBind', true)
          wx.switchTab({
            url: '../../me/me',
          })
        } else {
          app.showErrorModal(successData.msg, '激活失败');
        }
      },
      failRes => {
        app.showErrorModal(failRes.msg, '激活失败');
      });
  },

  /* 输入监听 */
  usernameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  inputFocus: function(e) {
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

  inputBlur: function(e) {
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
  tapHelp: function(e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },

  showHelp: function(e) {
    this.setData({
      'help_status': true
    });
  },

  hideHelp: function(e) {
    this.setData({
      'help_status': false
    });
  },

  /* 激活码输入监听 */
  Focus(e) {
    var inputValue = e.detail.value;
    this.setData({
      Value: inputValue,
    })
  },

  Tap() {
    this.setData({
      isFocus: true,
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
});