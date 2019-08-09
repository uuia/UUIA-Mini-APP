const config = require("../../../config.js");

Page({
  data: {
    // 选中部门名称
    placename: "",
    // TODO: 全部部门通讯录
    places: {
      "教务处": [{
          department: "教学管理科",
          tele: "024-83681251"
        },
        {
          department: "考试考务管理科",
          tele: "024-83689990"
        },
        {
          department: "学籍学位管理科",
          tele: "024-83680898"
        },
        {
          department: "实践教学管理科",
          tele: "024-83684833"
        },
        {
          department: "教学研究科",
          tele: "024-83687368"
        }
      ],
      "校长办公室": [{
          department: "秘书科",
          tele: "83687328"
        },
        {
          department: "信访科",
          tele: "83687700"
        }
      ],
      "公安处": [
        {
          department: "保卫科",
          tele: "024-83671407"
        },
        {
          department: "北门",
          tele: "024-83678351"
        },
        {
          department: "户籍管理",
          tele: "024-83678262"
        },
        {
          department: "交警科",
          tele: "024-83671409"
        },
      ]
    }
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      placename: options.place,
      place: that.data.places[options.place]
    });
  },

  /* 拨打电话 */
  call: function(e) {
    var that = this;
    var count = e.target.id;
    wx.makePhoneCall({
      phoneNumber: that.data.place[count].tele
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
})