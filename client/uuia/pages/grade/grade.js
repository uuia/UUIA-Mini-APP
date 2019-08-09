const config = require("../../config.js");
const request = require("../../request.js");

Page({
  data: {
    // 学期名称，与下方索引序列对应
    title: config.config.semester.title,
    // 学期索引序列
    term: config.config.semester.term,
    // 成绩信息
    gradeInfo: [],
    // 选中的学期索引值
    index: 0,
    // 成绩加载状态
    loading: false
  },

  onLoad: function() {
    // 获取成绩
    this.getInfo()
  },

  /* 获取成绩 */
  getInfo: function() {
    var data = {}
    data.semester = this.data.term[this.data.index]

    const res = request.base("score", data, true,
      successData => {
        request.success("成绩加载", successData.data)
        this.setData({
          gradeInfo: successData.data.data,
          loading: true
        })
      },
      failRes => {
        request.fail("成绩加载", failRes)
      });
  },

  /* 切换学期 */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    this.getInfo()
  },

  /* 分享 */
  onShareAppMessage: function() {
    var that = this;
    var shareObj = {
      title: config.config.appInfo.name + " | " + config.config.appInfo.slogan,
      path: '../index/index',
      imageUrl: config.config.appInfo.logo,
    };
    return shareObj;
  },
});