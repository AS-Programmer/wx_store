// pages/addressList/addressList.js
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    list: [],
    id: null,
    state:null
  },
  defaultFun: function (e) {
    var that = this
    app.globalData.address = e.currentTarget.dataset.item.region.join('')
    app.globalData.addressDetail = e.currentTarget.dataset.item.region.join('') + e.currentTarget.dataset.item.detailed
    app.globalData.mobilePhone = e.currentTarget.dataset.item.mobilephone
    app.globalData.username = e.currentTarget.dataset.item.username
    // console.log(app.globalData.username+"2")
    that.setData({
      id: e.currentTarget.dataset.item._id
    })
    if (that.data.state == 1) {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  onLoad: function (options) {
    // console.log("获取的openid="+app.globalData.openid)
    db.collection('addressList').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // console.log("查询成功",res)
        this.setData({
          id: res.data[0]._id,
          list: res.data,
          state: options.state
        })
      }
    })
  },
})