const app = getApp()
const db = wx.cloud.database()
let select_list = []
let goodsId_list = []
Page({
  data: {
    total: false, //是否全选
    totalNum: 0, //商品总数
    list: [],
    isEdit: false,
  },
  delCollectionItemFun: function (e) { //单个取消收藏
    var that = this
    var list = []
    var listTotal = []
    var id = e.target ? e.target.dataset.item._id : e._id
    var goodsId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确定取消收藏？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.data.list.map((v, k) => {
            if (v._id == id) {
              that.data.list.splice(k, 1)
              db.collection("collectList").doc(id).remove({
                success(res) {
                  console.log("删除成功", res)
                  db.collection("goodsList").doc(goodsId).update({
                    data: {
                      selected: false,
                    },
                    success(res) {
                      console.log("更新成功", res)
                    },
                    fail(res) {
                      console.log("更新失败", res)
                    }
                  })
                  wx.showToast({
                    title: '取消收藏成功！',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail(res) {
                  console.log("删除失败", res)
                }
              })
            }
          })
          that.setData({
            list: that.data.list,
            totalNum:--that.data.totalNum
          })
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  delCollectionFun: function (e) { // 取消选中收藏
    var that = this
    let count = that.data.totalNum
    console.log(select_list)
    if (select_list.length == 0) {
      console.log("请选择一个商品再进行操作哦~")
    } else {
      wx.showModal({
        title: '确定取消收藏？',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
            // console.log(select_list)
            for (var i = 0; i < select_list.length; i++) {
              db.collection("collectList").where({
                goods_id: select_list[i]
              }).remove({
                success(res) {
                  count--
                  // console.log("删除成功", select_list)
                  console.log(count)
                  that.setData({
                    totalNum:count
                  })
                  for (var i = 0; i < select_list.length; i++) {
                    db.collection("goodsList").doc(select_list[i]).update({
                      data: {
                        selected: false
                      },
                      success(res) {
                        // console.log("更新成功", res)
                        select_list = []
                      },
                      fail(res) {
                        console.log("更新失败", res)
                      }
                    })
                    wx.showToast({
                      title: '取消收藏成功！',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                },
                fail(res) {
                  console.log("删除失败", res)
                }
              })
            }
            var list = []
            // console.log(select_list)
            that.data.list.map((v, k) => {
              if (!v.select) {
                list.push(v)
              }
            })
            that.setData({
              list: list,
            })
          } else { //这里是点击了取消以后
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  labelFun: function (e) { //单选
    var that = this
    var num = 0  
    for (var i = 0; i < that.data.list.length; i++) {
      if (that.data.list[i].goods_id == e.currentTarget.dataset.id) {
        if (!that.data.list[i].select) {
          that.data.list[i].select = true
          select_list.push(e.currentTarget.dataset.id)
        } else {
          that.data.list[i].select = !that.data.list[i].select
          select_list.splice(select_list.findIndex( index => index === e.currentTarget.dataset.id), 1)
          // for(var i = 0;i < select_list.length;i++){
          // if(select_list[i] == e.currentTarget.dataset.id){
          // select_list.splice(i,1)
          // }
          // }
        }
        that.setData({
          list: that.data.list
        })
      }
      if (that.data.list[i].select) {
        num++
        if (num == that.data.list.length) {
          that.setData({
            total: true
          })
        } else {
          that.setData({
            total: false
          })
        }
      }
    }
  },
  totalFun: function (e) { //全选
    select_list.splice(select_list.findIndex( index => index === e.currentTarget.dataset.id), 1)
    this.data.total = !this.data.total
    this.data.list.map((v, k) => {
      if (this.data.total) {
        v.select = true
        select_list.push(v.goods_id)
      } else {
        v.select = false
        select_list = []
      }
    })
    this.setData({
      list: this.data.list,
      total: this.data.total
    })
  },
  editFun: function (e) { //编辑按钮
    var that = this
    that.setData({
      isEdit: !that.data.isEdit
    })
  },
  onLoad: function (options) {
    var that = this
    var totalnum = 0
    db.collection('collectList').get({
      success(res) {
        for(var i = 0;i < res.data.length;i++){
          if(res.data[i].selected){
            totalnum++
          }
        }
        // console.log("查询成功",res)
        that.setData({
          list: res.data,
          totalNum: totalnum
        })
        // console.log("查询成功", res.data)
      },
      fail: res => {
        console.log("查询失败", res)
      }
    })
  },
})