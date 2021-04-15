//app.js
App({
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env: 'qzj-81pw6'
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this
        var code = res.code; //返回code
        var appId = 'wx1ef21bc067ae646a';
        var secret = 'bb81971e4734566d301b25d3f5951ed6';
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var openid = res.data.openid //返回openid
            // console.log('openid为' + openid);
            that.globalData.openid = res.data.openid;
            // console.log(that.globalData.openid)
          }
        })

        //   if (!app.globalData.mobile) {
        //     wx.reLaunch({
        //       url: "/pages/bindPhone/bindPhone"
        //     });
        //   }
      }
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

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    username: null,
    openid:null,
    address:null,
  }
})