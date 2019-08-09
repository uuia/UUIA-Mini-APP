const config = require("../../config.js");
const request = require("../../request.js");
var date = require('../../utils/date.js');

Page({
  data: {
    // 当前学期
    current: config.config.semester.current,
    // 所展示周课表
    listData: [],
    // 今日颜色
    colorList: ["#262626", "#262626", "#262626", "#262626", "#262626", "#262626", "#262626"],
    // 课程分节
    sections: ["1\n2", "3\n4", "5\n6", "7\n8", "9\n10", "11\n12"],
    // 下拉选项
    weeks: ['1 (7.7-7.13)', '2 (7.14-7.20)', '3 (7.21-7.27)', '4 (7.28-8.3)', '5 (8.4-8.10)'],
    // 选中周
    index: 0,
    // 每周七天
    dateList: [1, 2, 3, 4, 5, 6, 7]
  },

  // 计算日期
  getNewData(days) {
    var nDate = new Date("07" + '/' + "08" + '/' + "2019");
    var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    return (month + "-" + date);
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function () {
    // 计算周数与星期数
    this.showWeek();
  },

  /* 计算周数与星期数 */
  showWeek: function () {
    var formatTime = new Date(date.formatDateByH(new Date())).getDay();
    var formatTime1 = new Date(date.formatDateByH(new Date())).getTime();
    var formatTimeS = new Date(this.data.current.firstDay).getTime();
    var formatTimeS1 = new Date(this.data.current.secondDay).getTime();
    var days = (formatTime1 - formatTimeS) / (formatTimeS1 - formatTimeS);
    var week = (days / 7) + 1;

    var someday = "colorList[" + formatTime + "]";
    this.setData({
      week: parseInt(week),
      originWeek: parseInt(week),
      index: parseInt(week) - 1,
      days: days,
      formatTime: formatTime,
      [someday]: "#0081ff"
    });

    this.showCourse();
  },

  /* 展示课表 */
  showCourse: function () {
    var that = this;
    var value = wx.getStorageSync('courseTableInfo');
    var days = this.data.days; originWeek
    var formatTime = this.data.formatTime;
    var originWeek = this.data.originWeek;
    var week = this.data.week;
    that.setData({
      listData: value[this.data.week - 1],
    });

    for (var i = 0; i < 7; i++) {
      var date = "dateList[" + i + "]";
      that.setData({
        [date]: that.getNewData(days - (formatTime - i + 1) + 7 * (week - originWeek))
      })
    }

    var someday = "colorList[" + formatTime + "]";
    if (week == originWeek) {
      that.setData({
        [someday]: "#0081ff"
      })
    } else {
      that.setData({
        [someday]: "#262626"
      })
    }
  },

  /* 上一周 */
  last: function () {
    var that = this
    var number = this.data.week - 1;
    if (number >= 1) {
      that.setData({
        week: number,
        index: number
      });
      wx.removeStorageSync('listData')
      this.showCourse();
    }
  },

  /* 下一周 */
  next: function () {
    var that = this
    var number = this.data.week + 1;
    if (number <= 25) {
      that.setData({
        week: number,
        index: number
      });
      wx.removeStorageSync('listData')
      this.showCourse();
    }
  },

  /* 切换周 */
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    var that = this
    var number = parseInt(e.detail.value) + parseInt(1);
    that.setData({
      week: number
    });
    wx.removeStorageSync('listData')
    this.showCourse();
  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.removeStorageSync('listData')
    this.courseTable();
    wx.stopPullDownRefresh();
    this.showCourse();
  },

  /* 获取课表信息 */
  courseTable() {
    var data = {}
    data.semester = this.data.current.term

    const res = request.base("courseTable", data, false,
      successData => {
        request.success("课表加载", successData.data)
        this.setData({
          courseTableInfo: successData.data.data
        })
        var courseArray = this.courseTranslater(successData.data.data.courses);
        wx.setStorageSync('courseTableInfo', courseArray);
      },
      failRes => {
        request.fail("课表加载", failRes)
      });
  },

  /* 将标准12课时课表转化为6节课课表 */
  sectionTranslater: function (sectionArry) {
    var res = [];
    for (let i = 0; i < sectionArry.length; i++) {
      if (sectionArry[i] % 2 == 0) {
        res.push(sectionArry[i] / 2);
      }
    }
    return res;
  },

  /* 将UUIA格式课表转化为多维数组 */
  courseTranslater: function (uuiaCourseData) {
    // 初始化数组
    var courses = [];
    for (let i = 0; i < 24; i++) {
      var weekArray = [];
      for (let j = 0; j < 7; j++) {
        var dateArray = [];
        for (let k = 0; k < 6; k++) {
          dateArray.push([null, null, null]);
        }
        weekArray.push(dateArray);
      }
      courses.push(weekArray);
    }
    for (let i = 0; i < uuiaCourseData.length; i++) {

      for (let j = 0; j < uuiaCourseData[i].schedules.length; j++) {
        for (let l = 0; l < uuiaCourseData[i].schedules[j].weeks.length; l++) {
          var weNeusectionArray = this.sectionTranslater(uuiaCourseData[i].schedules[j].sections);
          for (let k = 0; k < weNeusectionArray.length; k++) {
            courses[uuiaCourseData[i].schedules[j].weeks[l]][uuiaCourseData[i].schedules[j].day - 1][weNeusectionArray[k] - 1][0] = uuiaCourseData[i].name;
            courses[uuiaCourseData[i].schedules[j].weeks[l]][uuiaCourseData[i].schedules[j].day - 1][weNeusectionArray[k] - 1][2] = uuiaCourseData[i].schedules[j].classroom;
            courses[uuiaCourseData[i].schedules[j].weeks[l]][uuiaCourseData[i].schedules[j].day - 1][weNeusectionArray[k] - 1][1] = uuiaCourseData[i].teachers[0];
          }
        }

      }
    }
    return courses;
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
