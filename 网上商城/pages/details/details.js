// pages/details/details.js
const db = wx.cloud.database()
const app = getApp()
let id = ''
Page({
  data: {
    showModalStatus: false,
    isBuy: true,
    isCollect: false,
    list: [],
    num: 1,
    minusStatus: 'disabled',
    username:'',
    mobilePhone:0,
    address:''
  },
  bindBlur: function (e) {
    if (this.data.num < 1) {
      wx.showToast({
        title: '该宝贝不能再减少了哦~',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        num: 1
      })
    } else {
      // console.log(this.data.num)
    }
  },
  bindMinus: function (e) { //减少数量
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindPlus: function (e) { //增加数量
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });

  },
  bindManual(event) { //获取输入框数值 
    this.setData({
      num: parseInt(event.detail.value)
    });
  },

  successAddToCart: function (e) {
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      showModalStatus: false
    })
  },

  addCart: function (e) { //添加到购物车
    db.collection("cartList").where({
      goods_id: this.data.list._id
    }).get({
      success: res => {
        if (res.data.length === 0) {
          console.log("添加成功")
          db.collection("cartList").add({
            data: {
              goods_id: this.data.list._id,
              num: this.data.num,
              price: this.data.list.price,
              spec: this.data.list.spec,
              title: this.data.list.title,
              img: this.data.list.img,
            },
            success: res => {
              // console.log("添加成功",res)
              this.setData({
                num:1
              })
              this.successAddToCart()
              
            },
            fail(res) {
              console.log("添加失败", res)
            }
          })
        } else {
          db.collection("cartList").doc(res.data[0]._id).update({
            data: {
              num: res.data[0].num + this.data.num
            },
            success: res => {
              this.successAddToCart()
            },
            fail: res => {
              console.log(res)
            },
          })
        }
        //         wx.reLaunch({
        //           url: '../cart/cart',
        //         })
      },
      fail: res => {}
    })
  },
  getAddressFun:function(e){
    db.collection("addressList").get({
      success:res=>{
        this.setData({
          username:res.data[0].username,
          mobilePhone:res.data[0].mobilephone,
          address:res.data[0].address
        })
      }
    })
  },
  bindBuyNow: function (e) { //立即购买
    var that = this
    wx.showModal({
      title: '模拟支付功能',
      content: '需要支付：' + (this.data.list.price * this.data.num),
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          db.collection("orderList").add({
            data: {
              goods_id: that.data.list._id,
              // _openid: v._openid,
              img: that.data.list.img,
              num: that.data.num,
              price: that.data.list.price,
              spec: that.data.list.spec,
              title: that.data.list.title,
              address: that.data.address,
              mobilePhone: that.data.mobilePhone,
              username: that.data.username
            },
            success(res) {
              // console.log("添加成功", res)
              console.log(that.data.mobilePhone)
              wx.showToast({
                title: '购买成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                showModalStatus: false,
                num: 1
              })
            },
            fail(res) {
              console.log("添加失败", res)
            }
          })
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
    })
  },
  addToCartFun: function (e) {
    db.collection("cartList")
    this.setData({
      showModalStatus: true,
      isBuy: false,
    })
  },
  buyNow: function (e) {
    this.setData({
      showModalStatus: true,
      isBuy: true,
    })
  },
  collectFun: function (e) { //收藏
    if (!this.data.isCollect) {
      this.setData({
        isCollect: true,
      })
      db.collection("goodsList").doc(id).update({
        data: {
          selected: true
        },
        success(res) {},
        fail(res) {}
      })
      db.collection("collectList").add({
        data: {
          goods_id: this.data.list._id,
          img: this.data.list.img,
          // num: this.data.list.num,
          price: this.data.list.price,
          spec: this.data.list.spec,
          title: this.data.list.title,
          selected: true
        },
        success(res) {
          // console.log("添加成功", res)
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail(res) {
          console.log("添加失败", res)
        }
      })
    } else {
      this.setData({
        isCollect: false,
      })
      db.collection("goodsList").doc(id).update({
        data: {
          selected: false
        }
      })
      db.collection("collectList").where({
        goods_id: id
      }).remove({
        success(res) {
          // console.log("删除成功",res)
          wx.showToast({
            title: '取消收藏',
            icon: 'none',
            duration: 2000
          })
        },
        fail(res) {
          console.log("删除失败", res)
        }
      })
    }
  },
  onLoad: function (options) {
    this.getAddressFun()
    id = options.id
    // console.log(id)
    db.collection("goodsList").where({
      _id: id
    }).get({
      success: res => {
        // console.log("查询成功",res)
        if (res.data[0].selected) {
          this.data.isCollect = true
        } else {
          this.data.isCollect = false
        }
        // console.log(this.data.isCollect)
        this.setData({
          list: res.data[0],
          isCollect: this.data.isCollect,
        })
        // console.log(this.data.list)
      },
      fail: res => {
        console.log("查询失败", res)
      }
    })
  },
  // 开启转发到朋友圈功能
  onShareAppMessage: function (res) {
    let id = this.data.list._id
    // console.log(id)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '[好友推介]' + this.data.list.title,
      path: '/pages/details/details?id=' + id
    }
  },
  onShareTimeline: function () {
    return {
      title: '[好友推介]' + this.data.list.title,
      query: {
        key: value
      },
      imageUrl: ''
    }
  },

})