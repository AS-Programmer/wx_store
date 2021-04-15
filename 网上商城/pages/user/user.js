// pages/user/user.js
const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
  },
  contact:function(e){
    wx.makePhoneCall({
      phoneNumber: '13800000000'
    })
  },
  turnAdmin:function(e){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
})