// pages/admin/admin.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    admin: '',
    hidde: true,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  oldpassword: function (event) { //获取原密码
    this.setData({
      oldPassword: event.detail.value
    })
  },
  newpassword: function (event) { //获取新密码
    this.setData({
      newPassword: event.detail.value
    })
  },
  confirmpassword: function (event) { //确认密码
    this.setData({
      confirmPassword: event.detail.value
    })
  },
  updPassWord: function (e) { //修改密码
    var that = this
    db.collection("user").where({
      username: that.data.admin
    }).get({
      success: res => {
        if (that.data.oldPassword == res.data[0].password) {
          if (that.data.newPassword != '') {
            if (that.data.newPassword == that.data.confirmPassword) {
              wx.showModal({
                title: '确认修改密码',
                success: function (res) {
                  if (res.confirm) {
                    db.collection("user").where({
                      username: that.data.admin
                    }).update({
                      data: {
                        password: that.data.newPassword
                      },
                      success: res => {
                        that.setData({
                          hidde: true,
                          oldPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        })
                        wx.showToast({
                          title: '修改成功',
                          icon: 'success',
                          duration: 2000
                        })
                      }
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '两次密码不一致',
                success: function (res) {
                  if (res.confirm) {
                    console.log("用户点击了确定")
                  }
                }
              })
            }
          } else {
            wx.showModal({
              title: '新密码不能为空',
              success: function (res) {
                if (res.confirm) {
                  console.log("用户点击了确定")
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '原密码错误',
            success: function (res) {
              if (res.confirm) {
                console.log("用户点击了确定")
              }
            }
          })
        }
      }
    })
  },
  modalinput: function (e) {
    this.setData({
      hidde: true
    })
  },
  onLoad: function (options) {
    // console.log(app.globalData.username)
    this.setData({
      admin: app.globalData.username
    })
  },
  updPassword: function (e) {
    this.setData({
      hidde: false
    })
  },
  logout: function (e) { //退出后台
    wx.switchTab({
      url: '../index/index',
    })
  },
  click: function () {
    console.log(app.globalData.username)
  },

  orderManagement: function (e) {
    wx.navigateTo({
      url: '../orderManagement/orderManagement?type=1',
    })
  },
  sortManagement: function (e) {
    wx.navigateTo({
      url: '../sortManagement/sortManagement',
    })
  },
  goodsManagement: function (e) {
    wx.navigateTo({
      url: '../goodsManagement/goodsManagement',
    })
  },
})