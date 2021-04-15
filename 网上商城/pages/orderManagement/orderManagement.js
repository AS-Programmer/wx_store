const db = wx.cloud.database()
const app = getApp()
const charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const random = function generateMixed(n) { //模拟生成随机订单编号
  var res = '';
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += charts[id];
  }
  return res;
}
Page({
  data: {
    tabIndex: 1,
    list: [],
    // totalPrice:0,
    goodsNum: 0,
    goodsCount: 0,
    goods: '',
    send: true,
  },

  tabFun(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    // console.log(this.data.tabIndex)
    this.tabIndexFun()
  },
  getList: function (e) {
    db.collection('orderList').get({
      success: res => {
        // console.log("查询成功",res)
        this.setData({
          list: res.data,
          goodsNum: res.data.length,
          send: true
        })
      }
    })
  },
  tabIndexFun: function (e) { //查询订单
    if (this.data.tabIndex == 1) {
      this.getList()
    } else if (this.data.tabIndex == 2) {
      db.collection('shippedList').get({
        success: res => {
          // console.log("查询成功",res)
          this.setData({
            list: res.data,
            goodsCount: res.data.length,
            send: false
          })
        }
      })
    }
  },
  sendGoodsFun: function (e) { //立即发货
    var that = this
    // console.log(e.currentTarget.dataset.id)
    db.collection("orderList").doc(e.currentTarget.dataset.id).get({
      success: res => {
        // console.log(res.data)
        // var orderNo = Math.floor(Math.random() * 100000000)
        that.setData({
          goods: res.data
        })
        wx.showModal({
          title: '收货地址信息',
          content: res.data.address + "\n" + res.data.username + ' 收' + res.data.mobilePhone,
          success: function (res) {
            if (res.confirm) { //这里是点击了确定以后
              console.log('用户点击确定')
              wx.showModal({
                title: '发货确认',
                content: '是否已经发货',
                success: function (res) {
                  if (res.confirm) { //这里是点击了确定以后
                    console.log('用户点击确定')
                    db.collection("shippedList").add({
                      data: {
                        img: that.data.goods.img,
                        title: that.data.goods.title,
                        num: that.data.goods.num,
                        goods_id:that.data.goods.goods_id,
                        orderNo: random(16)
                      },
                      success: res => {
                        db.collection("orderList").doc(that.data.goods._id).remove({
                          success: res => {
                            that.data.list.map((v, k) => {
                              if (v._id == e.currentTarget.dataset.id) {
                                that.data.list.splice(k, 1)
                              }
                            })
                            that.setData({
                              list: that.data.list,
                              goodsNum: --that.data.goodsNum
                            })
                          }
                        })
                        console.log("发货成功")
                        wx.showToast({
                          title: '发货成功',
                          icon: 'success',
                          duration: 2000
                        })
                      }
                    })
                  } else { //这里是点击了取消以后
                    console.log('用户点击取消')
                  }
                }
              })
            } else { //这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type
    })
    this.tabIndexFun()
  },
})