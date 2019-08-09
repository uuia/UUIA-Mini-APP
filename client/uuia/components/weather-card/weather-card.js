// components/weather-card/weather-card.js
const uuia = require("../../config.js");

Component({
  lifetimes: {
    attached() {
      this.getWeather()
    }
  },

  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 所在城市
    city: "",
    // 获取到的天气信息
    weather: null,
    // 默认天气类别
    weatherClass: '',
    // 未来五日天气显示boolean
    showMoreForecast: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 显示未来五日预报 */
    showMoreForecast() {
      this.setData({
        showMoreForecast: !this.data.showMoreForecast
      })
    },
    /* 获取天气信息 */
    getWeather: function() {
      var that = this;
      this.setData({
        city: uuia.config.appInfo.city
      })

      wx.request({
        url: 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp477295126&url=http://wthrcdn.etouch.cn/weather_mini?city=' + that.data.city,
        method: 'GET',
        dataType: 'json',
        success: function(res) {
          console.log(res.data.data);
          that.setData({
            weather: res.data.data
          });

          /* 设置弹出框内容 */
          for (var i = 0; i < 5; i++) {
            var str1 = 'actions[' + i + '].subname';
            var str2 = 'actions[' + i + '].name';
            that.setData({
              [str1]: that.data.weather.forecast[i].date,
              [str2]: '「' + that.data.weather.forecast[i].type + '」' + that.data.weather.forecast[i].low + ' ' + that.data.weather.forecast[i].high
            });
          }

          if (that.data.weather.forecast[0].type.indexOf('晴') != -1) {
            let now = new Date();
            let hour = now.getHours();
            let seconds = now.getSeconds();
            if (hour > 6 && hour < 19) {
              that.setData({
                weatherClass: seconds % 2 == 0 ? 'sunny' : 'rainbow'
              });
            } else {
              that.setData({
                weatherClass: 'starry'
              });
            }
          } else if (that.data.weather.forecast[0].type.indexOf('雷') != -1 || that.data.weather.forecast[0].type.indexOf('电') != -1 || that.data.weather.forecast[0].type.indexOf('暴') != -1) {
            that.setData({
              weatherClass: 'stormy'
            });
          } else if (that.data.weather.forecast[0].type.indexOf('雪') != -1 || that.data.weather.forecast[0].type.indexOf('霜') != -1 || that.data.weather.forecast[0].type.indexOf('冰') != -1) {
            that.setData({
              weatherClass: 'snowy'
            });
          } else if (that.data.weather.forecast[0].type.indexOf('雨') != -1) {
            that.setData({
              weatherClass: 'rainy'
            });
          } else if (that.data.weather.forecast[0].type.indexOf('阴') != -1 || that.data.weather.forecast[0].type.indexOf('云') != -1) {
            that.setData({
              weatherClass: 'cloudy'
            });
          }
        }
      })
    },
  }
})