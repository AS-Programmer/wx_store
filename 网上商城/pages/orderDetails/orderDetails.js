const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    tabIndex: 1,
    list: [],
    // totalPrice:0,
  },
  // totalPrice:function(e){
  //   var that = this
  //   var price = 0
  //   for (var i = 0; i < that.data.list.length; i++) {
  //     if (that.data.list[i].select) {
  //       price = price + that.data.list[i].price * that.data.list[i].num
  //     }
  //   }
  //   that.setData({
  //     totalPrice: price.toFixed(2)
  //   })
  //   console.log(that.data.totalPrice)
  // },
  tabFun(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    // console.log(this.data.tabIndex)
    this.tabIndexFun()
  },
  // getList() {

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  tabIndexFun: function (e) {
    if (this.data.tabIndex == 2) {
      db.collection('orderList').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          // console.log("查询成功",res)
          this.setData({
            list: res.data,
          })
        }
      })
    } else if (this.data.tabIndex == 3) {
      db.collection('shippedList').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          // console.log("查询成功",res)
          this.setData({
            list: res.data,
          })
        }
      })
    } else {
      this.setData({
        list: []
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type
    })
    // this.getList()
    this.tabIndexFun()
  },

})