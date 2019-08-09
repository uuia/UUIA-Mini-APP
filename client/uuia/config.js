const config = {
  // UUIA AppID(在UUIA官网注册后所得)
  uuiaAppId: "",
  // 小程序信息
  appInfo: {
    // 小程序名称
    name: "UUIA",
    // 小程序AppID(来源于微信小程序或QQ小程序后台)
    appId: "",
    // 小程序logo图片地址
    logo: "/uuia/assets/images/node/logo.png",
    // 启动屏背景图片地址
    background: "/uuia/assets/images/node/background.png",
    // 登录页背景视频
    video: "http://qiniu.weneu.xyz/NEU-BG-Video.mp4",
    // topbar logo图片地址
    topbar: "/uuia/assets/images/node/topbar.png",

    // 小程序官网
    offical: "www.weneu.xyz",
    // 小程序版本号
    version: "1.0.0",
    // 小程序状态
    status: "内测",
    // 运营年份区间
    year: "2019",
    // 口号
    slogan: "你想要的，都在这里",

    // 学校名称
    schoolName: "中国大学",
    // 学校简称
    schoolAbbr: "国大",
    // 学校所在城市
    city: "北京"
  },
  // 登录页
  loginPage: {
    // 背景类型(IOS强制为图片，安卓可选 image-图片, video-视频)
    backgroundType: "image",
    // 图片背景地址(请到/uuia/login/login.wxss里的page background-image再次使用您的图片链接替换url('')的内容)
    imageUrl: "",
    // 视频背景地址
    videoUrl: ""
  },
  // 学期信息
  semester: {
    // 学期名称
    title: ['2018-2019学年夏季学期', '2018-2019学年春季学期', '2018-2019学年秋季学期'],
    // 学期索引序列
    term: ['49', '30', '11'],
    // 当前学期
    current: {
      // 学期名称
      title: '2018-2019学年夏季学期',
      // 学期索引
      term: '30',
      // 学期第一天
      firstDay: "2019/03/03",
      // 学期第二天
      secondDay: "2019/03/04",
      // 每周第一天是周日(1)还是周一(2)
      startDay: 1
    },
  }
  ,
  // 服务器信息
  serverInfo: {
    // UUIA中央服务器地址
    centerServer: "https://uuia-center.cheelem.com:8891",
    // 你的(子节点)服务器地址
    nodeServer: ""
  },
  // UUIA信息: 
  uuia: {
    // UUIA logo
    logo: "/uuia/assets/images/core/uuia.png",
    // Powered By UUIA
    poweredBy: "http://ww1.sinaimg.cn/large/006tNc79ly1g5pa9ghbwcj30rs0b440e.jpg",
    // 紫金葫芦二维码
    hulu: "http://ww1.sinaimg.cn/large/006tNc79ly1g5p9yptbdbj31580bsjtc.jpg",
    // 基础库版本
    base: "0.9.0",
    // 官网
    offical: "www.uuia.info"
  },
  // 开发者信息
  developers: [
    {
      // 开发者姓名
      name: 'UUIA开发组',
      // 开发者简介
      description: '依托开源社群之力用技术推动国内高校信息统合化发展建设，并用创意让每位高校师生感到快乐。',
      // 开发者座右铭
      slogan: '你想要的，都在这里',
      // 赞赏码图片地址
      rewardCodeUrl: 'http://ww4.sinaimg.cn/large/006tNc79ly1g490tkuji2j30sg0sggn4.jpg'
    }
  ],
  // banner信息
  banners: [
    {
      // 图片地址
      image: "https://ws4.sinaimg.cn/large/006tNc79ly1g2rr43ph0ej30sg0d7dh1.jpg",
      // 点击banner跳转地址(可跳转至微信公众号文章地址)
      nav: "../about/about",
      // banner备注
      comment: "UUIA 欢迎你！"
    }
  ]
}

module.exports = {
  config: config,
}