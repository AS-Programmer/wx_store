// pages/login/login.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    username: '',
    password: ''
  },
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function (e) {
    let that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      db.collection('user').where({
        username: that.data.username
      }).get({
        success: res => {
          if (res.data.length != 0) {
            if (that.data.password == res.data[0].password) {
              if (res.data[0].power == 0) {
                wx.navigateTo({
                  url: '/pages/admin/admin?username=' + that.data.username
                })
                app.globalData.username = that.data.username
              } else {
                wx.showToast({
                  title: '用户权限不足，拒绝访问！',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              wx.showToast({
                title: '密码错误，请重新输入！',
                icon: 'none',
                duration: 2000
              })
            }
          }else{
            wx.showToast({
              title: '账号错误，请重新输入！',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: res => {
         console.log(res)
        }
      })
    }
  },
})