import { setStatusBarHeight } from "../../utils/util.js"
const config = require("../../config.js");
const request = require("../../request.js");
var date = require('../../utils/date.js');
var app = getApp();

Page({
  data: {
    // 登录状态
    isLoggedIn: false, 
    // 当前学期
    current: config.config.semester.current,
    // 校园卡信息
    cardInfo: {},
    // 课表信息
    courseTableInfo: {},
    // 课表加载状态信息
    loadingCourse: true,
    // 校园卡加载状态信息
    loadingCardInfo: false
  },

  onLoad: function (options) {
    // 检查用户版本更新
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log("[UUIA]是否有新版本: " + res.hasUpdate);
      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '有新版本更新哦，点击确定完成更新',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }

    // 获取校园卡余额信息
    this.campusCard()
  },

  onShow: function () {
    // 判断登录状态决定显示内容
    if (app.isLoggedIn()) {
      this.setData({
        isLoggedIn: true
      });
    } else {
      this.setData({
        isLoggedIn: false
      });
    }

    // 计算周数与星期数
    this.showWeek();
    // 展示课表
    this.showCourse();
  },

  showCourse() {
    // 判断是否有课表缓存
    if (wx.getStorageSync('courseTableInfo')) {
      var i = 0
      var n = 0
      var courseTableInfo = wx.getStorageSync('courseTableInfo')
      // 判断今日是否有课
      for (; i < 6; i++) {
        if (courseTableInfo[this.data.week - 1][this.data.weekday - 1][i][0] == null) {
          n = n + 1;
        }
      }
      if (n == 6) {
        this.setData({
          'index': 0,
        });
      } else {
        this.setData({
          'index': 1,
        });
      }
      this.setData({
        'todayCourse': courseTableInfo[this.data.week - 1][this.data.weekday - 1]
      });
      console.log("[UUIA]今日课表: " + this.data.todayCourse)

    } else {
      console.log("[UUIA]本地未存储课表信息，即将获取")
      // 获取课表信息
      this.courseTable();
    }
  },

  /* 计算周数与星期数 */
  showWeek: function () {
    var formatTime = new Date(date.formatDateByH(new Date())).getDay();
    var formatTime1 = new Date(date.formatDateByH(new Date())).getTime();
    var formatTimeS = new Date(this.data.current.firstDay).getTime();
    var formatTimeS1 = new Date(this.data.current.secondDay).getTime();
    var days = (formatTime1 - formatTimeS) / (formatTimeS1 - formatTimeS);
    var week = (days / 7) + 1;
    if (formatTime == 0) {
      formatTime = 7
      this.setData({
        week: parseInt(week),
        weekday: formatTime
      });
    } else {
      this.setData({
        week: parseInt(week),
        weekday: formatTime
      });
    }
  },

  /* 获取课表信息 */
  courseTable() {
    this.setData({
      loadingCourse: false
    })
    var data = {}
    data.semester = this.data.current.term

    const res = request.base("courseTable", data, false,
      successData => {
        request.success("课表加载", successData.data)
        this.setData({
          courseTableInfo: successData.data.data,
          loadingCourse: true
        })
        var courseArray = this.courseTranslater(successData.data.data.courses);
        wx.setStorageSync('courseTableInfo', courseArray);
        this.showCourse();
      },
      failRes => {
        request.fail("课表加载", failRes)
      });
  },

  /* 获取校园卡信息 */
  campusCard() {
    this.setData({
      loadingCardInfo: false
    })
    
    const res = request.base("campusCard", null, false,
      successData => {
        this.setData({
          cardInfo: successData.data.data,
          loadingCardInfo: true
        })
      },
      failRes => {
        request.fail("校园卡加载", failRes)
      });
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

  // 将标准12课时课表转化为6节课课表
  sectionTranslater: function (sectionArry) {
    var res = [];
    for (let i = 0; i < sectionArry.length; i++) {
      if (sectionArry[i] % 2 == 0) {
        res.push(sectionArry[i] / 2);
      }
    }
    return res;
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