const config = require("./config.js");
const centerServer = config.config.serverInfo.centerServer;

function network(group, action, data, loading, callback, failCallback) {
  if (loading) {
    wx.showLoading({
      title: '正在加载...',
    });
  }

  wx.request({
    url: centerServer + "/unified/entry",
    data: {
      'group': group,
      'action': action,
      'data': data,
      'token': wx.getStorageSync('token'),
      'uuiaAppId': config.config.uuiaAppId
    },
    method: 'POST',
    dataType: 'json',
    success(res) {
      if (callback) {
        callback(res.data)
      }
    },
    fail(res) {
      if (failCallback) {
        failCallback(res)
      }
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
}

function base(action, data, loading, callback, failCallback) {
  network("base", action, data, loading, callback, failCallback);
}

function network_uuia(action, data, loading, callback, failCallback) {
  if (loading) {
    wx.showLoading({
      title: '正在加载...',
    });
  }

  wx.request({
    url: centerServer + action,
    data: {
      'data': data,
      'email': data.email,
      'token': wx.getStorageSync('token'),
      'uuiaAppId': config.config.uuiaAppId
    },
    method: 'POST',
    dataType: 'json',
    success(res) {
      if (callback) {
        callback(res.data)
      }
    },
    fail(res) {
      if (failCallback) {
        failCallback(res)
      }
    },
    complete: function (res) {
      wx.hideLoading();
    }
  })
}

function uuia(action, data, loading, callback, failCallback) {
  network_uuia(action, data, loading, callback, failCallback);
}

function success(message, data) {
  console.log("[UUIA]" + message + "成功")
  console.log(data)
  wx.showToast({
    title: message + '成功',
    image: '/uuia/assets/images/core/success.png',
    duration: 2000
  })
}

function fail(message, data) {
  console.log("[UUIA]" + message + "失败")
  console.log(data)
  wx.showToast({
    title: message + '失败',
    image: '/uuia/assets/images/core/fail.png',
    duration: 2000
  })
}

module.exports = {
  base: base,
  uuia: uuia,
  success: success,
  fail: fail
}