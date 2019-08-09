const config = require("../../config.js");
const request = require("../../request.js");

Page({
  data: {
    // 学期信息
    semester: config.config.semester,
    // 考试日程
    examInfo: [],
    // 考试日程加载状态
    loading: false
  },

  onLoad: function() {
    // 获取考试信息
    this.exam();
  },

  /* 获取考试信息 */
  exam: function() {
    var data = {}
    data.semester = this.data.semester.current.term

    const res = request.base("exam", data, true,
      successData => {
        request.success("考试加载", successData.data)
        this.setData({
          examInfo: successData.data.data,
          loading: true
        })
      },
      failRes => {
        request.fail("考试加载", failRes)
      });
  },

  /* 查看考试详情 */
  slideDetail: function(e) {
    var id = e.currentTarget.dataset.id,
    list = this.data.examInfo.courses;
    // 每次点击都将当前open换为相反的状态并更新到视图，视图根据open的值来切换css
    for (var i = 0, len = this.data.examInfo.courses.length; i < len; ++i) {
      if (i == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    var isOpen = "examInfo.courses"
    this.setData({
      [isOpen]: list
    });
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