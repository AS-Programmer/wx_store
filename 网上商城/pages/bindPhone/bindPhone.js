// pages/bindPhone/index.js

const app = getApp()
Page({

  data: {
   code:'',
   mobile:''
  },
  bindKeyInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindKeyCode:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  submitFun:function(){
    app.http('v1/user/bindMobile', {
      code: this.data.code,
      mobile: this.data.mobile,
      openid: getApp().globalData.openid
    },'POST')
      .then(res => {
        if (res.code == 200) {
          wx.reLaunch({
            url: "/pages/index/index"
          });
        }
      })
  },
 
})