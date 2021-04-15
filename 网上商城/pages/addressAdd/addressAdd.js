// pages/addressAdd/addressAdd.js
const app = getApp()
const db = wx.cloud.database()
let addressDetailed = ''
let check = false
Page({
  data: {
    region: ['广东省', '广州市', '全部'],
    area: '',
    name: '',
    mobile: '',
    detailed: '',
    addressIs: true,
    _id: null,
    checked:null,
  },
  delsubmit:function(e){
    var that = this
    db.collection('addressList').doc(that.data._id).remove({
      success(res){
        wx.showToast({
          title: '删除地址成功。',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/addressList/addressList',
        })
        // console.log("删除地址成功",res)
      },
      fail(res){
        console.log("删除地址失败",res)
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value,
      area: e.detail.value.join('')
    })
  },
  bindKeyName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  checked: function (e) {
    // console.log(e.detail.value)
    var that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value)) {
      check = false
    } else {
      check = true
    }
  },
  bindKeyDetailed: function (e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  submitFun: function () {
    var that = this
    addressDetailed = that.data.area + that.data.detailed
    console.log(addressDetailed)
    if (check) {
      if (that.data.area != '') {
        db.collection('addressList').add({
          data: {
            username: that.data.name,
            mobilephone: that.data.mobile,
            address: addressDetailed,
            region:that.data.region,
            detailed:that.data.detailed
          },
          success: res => {
            // console.log("添加成功",res)
            wx.showToast({
              title: '添加地址成功。',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
              url: '/pages/addressList/addressList'
            })
          },
          fail(res) {
            // console.log("添加失败",res)
            wx.showToast({
              title: '添加地址失败，请重新填写信息。',
              icon: 'none',
              duration: 2000
            })
          }

        })
      } else {
        wx.showToast({
          title: '地区未选择。',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '手机号有误，请重新填写！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.checked == 1){
      this.setData({
        checked:options.checked,
        name:options.name,
        mobile:options.mobile,
        region:options.city.split(','),
        detailed:options.detailed,
        _id:options.id
      })
    }
    // console.log(this.data.region)
  },
})