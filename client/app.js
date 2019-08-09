const config = require("./uuia/config.js");

App({
  globalData: {
    // UUIA 中央服务器地址
    serverName: config.config.serverInfo.centerServer,
    // 微信获取的用户基本信息
    userInfo: null,
    // 返回状态码
    statusCode: {
      success: 200,
      tokenExpired: 401
    },
    // 操作系统判断
    isiOS: false,
    // 是否已绑定
    isLoggedIn: false,
    // 状态栏适配
    StatusBar: null,
    Custom: null,
    CustomBar: null
  },

  onLaunch: function () {
    var that = this

    // 获取系统显示高度信息
    wx.getSystemInfo({
      success: e => {
        if (e.system.indexOf('iOS') != -1) {
          this.globalData.isiOS = true
        }
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 开启登录提示
    wx.showLoading({
      title: '登录中',
      mask: true
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.setLoginSuccessHandler(() => {
                setTimeout(() => {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 1000)
              })
              this.loginUUIA()
            },
            fail: res => {
              this.applyForPermission()
            }
          })
        } else {
          // 未授权，跳转至授权页面
          this.applyForPermission()
        }
      }
    })
  },

  applyForPermission: function () {
    wx.hideLoading()
    // 需要登录授权
    wx.showLoading({
      title: '请授权登录',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    setTimeout(function () {
      wx.navigateTo({
        url: '../grant-permission/grant-permission',
      })
    }, 1000)
  },

  isLoggedIn() {
    return this.globalData.isLoggedIn
  },

  /* 登录 */
  loginUUIA: function () {
    let that = this
    wx.login({
      success: res => {
        this.request('POST', 'mini-program/login', {
          code: res.code,
          gender: this.globalData.userInfo == null ? 0 : this.globalData.userInfo.gender,
          name: this.globalData.userInfo == null ? null : this.globalData.userInfo.nickName,
          avatarUrl: this.globalData.userInfo == null ? null : this.globalData.userInfo.avatarUrl,
          country: this.globalData.userInfo.country,
          province: this.globalData.userInfo.province,
          city: this.globalData.userInfo.city,
          uuiaAppId: config.config.uuiaAppId
        },
          successData => {
            console.log("[UUIA]与中央服务器连接成功")
            console.log(successData)
            wx.hideLoading()
            if (successData.code == this.globalData.statusCode.success) {
              // 获取成功
              this.globalData.token = successData.token

              wx.setStorageSync('token', successData.token)
              wx.setStorageSync('isBind', successData.data.isBind)
              if (this.loginSuccessHandler) {
                this.loginSuccessHandler();
              }
            } else {
              // 登录失败
              console.log("登录获取token失败")
            }

            // 判断绑定状态
            if (successData.data.isValid) {
              that.globalData.isLoggedIn = true;
            }
          },
          failRes => {
            wx.hideLoading()
            console.log("[UUIA]与中央服务器连接失败")
            console.log(failRes)
          })
      },
      fail: res => {
        // 自动登录失败，待用户授权
        wx.hideLoading()
        console.log(res)
      }
    })
  },

  loginSuccessHandler: null,
  request: function (method, url, data, success, fail) {
    let that = this
    wx.request({
      url: that.globalData.serverName + "/" + url + that.getTokenPostfix(),
      data: data,
      header: {},
      method: method,
      dataType: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          if (success) {
            if (res.data.code == 401) {
              // token 过期处理
              console.log("token 过期")
              app.loginUUIA()
              return
            }
            success(res.data)
          }
        } else {
          if (fail) {
            fail(res)
            console.log("请求出错")
            console.log(res)
          }
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络请求出现问题，请检查您设备的网络状况',
          icon: 'none'
        })
        if (fail) {
          fail(res)
        }
      }
    })
  },

  /* 解密函数 */
  decrypt: function (encryptedData, iv, handler) {
    this.request('POST', '/customer/decrypt', {
      encryptedData: encryptedData,
      iv: iv
    },
      successData => {
        console.log(successData.data);
        handler(successData.data)
      },
      failRes => {
        console.log(failRes);
      })
  },

  /* 设置保险的登录回调函数 */
  setLoginSuccessHandler: function (loginSuccessHandler) {
    this.loginSuccessHandler = loginSuccessHandler
  },

  /* 返回用于请求的token后缀 */
  getTokenPostfix: function () {
    let token = wx.getStorageSync('token')
    if (token == null || token == '') {
      token = this.globalData.token
    }
    return token == null ? '' : ("?token=" + token);
  },

  /* 保存缓存 */
  saveCache: function (key, value) {
    if (!key || !value) {
      return;
    }
    var that = this;
    that.cache[key] = value;
    wx.setStorage({
      key: key,
      data: value
    });
  },

  /* 清除缓存 */
  removeCache: function (key) {
    if (!key) {
      return;
    }
    var that = this;
    that.cache[key] = '';
    wx.removeStorage({
      key: key
    });
  },

  /* 展示加载提示 */
  showLoadToast: function (title, duration) {
    wx.showToast({
      title: title || '玩命加载中...',
      icon: 'loading',
      mask: true,
      duration: duration || 10000
    });
  },

  /* 展示错误提示 */
  showErrorModal: function (content, title) {
    wx.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    });
  },
});