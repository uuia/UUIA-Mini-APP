const setStatusBarHeight = (app, that) => {
  if (typeof app.globalData.statusBarHeight != 'undefined') {
    that.setData({
      topStatus: app.globalData.statusBarHeight,
      capsuleHeight: app.globalData.capsuleHeight,
    })
  } 
}

function formatTime(date, t) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if (t === 'h:m') { return [hour, minute].map(formatNumber).join(':'); }
  else { return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'); }
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

module.exports = {
  setStatusBarHeight: setStatusBarHeight,
  formatTime: formatTime
}