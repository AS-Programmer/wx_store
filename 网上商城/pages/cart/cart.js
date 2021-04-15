const app = getApp()
const db = wx.cloud.database()
let select_list = []
let changeNum = 0
Page({
  data: {
    total: false, //是否全选
    totalPrice: 0, //总价
    list: [],
    isEdit: false,
    address: '',
    userName:'',
    mobilePhone:0,
    addressDetail:''
  },
  bindNum: function (event) {
    changeNum = event.detail.value
  },
  bindblur: function (e) {
    var id = e.target.dataset.item._id
    if (parseInt(changeNum) == 0) {
      wx.showToast({
        title: '该宝贝不能再减少了哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      db.collection("cartList").doc(id).update({
        data: {
          num: parseInt(changeNum)
        },
        success: res => {
          console.log("更新成功", res)
        },
        fail: res => {
          console.log("更新失败", res)
        }
      })
    }
  },
  selectLocation: function (e) { //选中地址
    wx.navigateTo({
      url: '/pages/addressList/addressList?state=1',
    })
  },
  totalFun: function (e) { //全选
    this.data.total = !this.data.total
    // for (let i = 0; i < this.data.list.length; i++) {
    //   if (this.data.total) {
    //     this.data.list[i].select = true
    //   } else {
    //     this.data.list[i].select = false
    //   }
    // }
    this.data.list.map((v, k) => {
      if (this.data.total) {
        v.select = true
        select_list.push(v._id)
      } else {
        v.select = false
      }
    })
    this.setData({
      list: this.data.list,
      total: this.data.total
    })
    this.totalPrice()
  },
  totalPrice: function (e) { //计算总价
    var that = this
    let price = 0
    for (var i = 0; i < that.data.list.length; i++) {
      if (that.data.list[i].select) {
        price = price + that.data.list[i].price * that.data.list[i].num
      }
    }
    that.setData({
      totalPrice: price.toFixed(2)
    })
    // console.log(that.data.totalPrice)
  },
  editFun: function (e) { //编辑按钮
    var that = this
    that.setData({
      isEdit: !that.data.isEdit
    })
  },
  labelFun: function (e) { //单选
    let that = this
    let num = 0
    select_list.push(e.currentTarget.dataset.id)
    for (let i = 0; i < that.data.list.length; i++) {
      if (that.data.list[i]._id == e.currentTarget.dataset.id) {
        if (!that.data.list[i].select) {
          that.data.list[i].select = true
        } else {
          that.data.list[i].select = !that.data.list[i].select
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
    this.totalPrice()
  },
  upNum: function (id, num) {
    // console.log(id, num)
    db.collection("cartList").doc(id).update({
      data: {
        num: num
      },
      success: res => {
        console.log("更新成功", res)
      },
      fail: res => {
        console.log("更新失败", res)
      }
    })
  },
  reduceFun: function (e) { //减少商品数量
    this.data.list.map((v, k) => {
      // console.log(v._id)
      // console.log(e.target.dataset.item._id)
      if (v._id == e.target.dataset.item._id) {
        if (this.data.list[k].num > 1) {
          // this.data.list[k].num--
          this.upNum(e.target.dataset.item._id, --this.data.list[k].num)
        }else{
          wx.showToast({
            title: '该宝贝不能再减少了哦~',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      list: this.data.list
    })
    // console.log(this.data.list)
    // this.upNum(e.target.dataset.item._id,)
    // this.totalPrice()
  },
  plusFun: function (e) { //增加商品数量
    this.data.list.map((v, k) => {
      if (v._id == e.target.dataset.item._id) {
        // var num = this.data.list[k].num++
        this.upNum(e.target.dataset.item._id, ++this.data.list[k].num)
      }
    })
    this.setData({
      list: this.data.list
    })
  },
  delItemFun: function (e) { //删除单商品
    var id = e.target ? e.target.dataset.item._id : e._id
    // console.log(id)
    this.data.list.map((v, k) => {
      if (v._id == id) {
        this.data.list.splice(k, 1)
        db.collection("cartList").doc(id).remove({
          success(res) {
            console.log("删除成功", res)
          },
          fail(res) {
            console.log("删除失败", res)
          }
        })
      }
    })
    this.setData({
      list: this.data.list
    })
  },
  addSelect: function (e) {
    for (var i = 0; i < select_list.length; i++) {
      this.data.list.map((v, k) => {
        if (v._id == select_list[i]) {
          db.collection("orderList").add({
            data: {
              goods_id: v.goods_id,
              // _openid: v._openid,
              img: v.img,
              num: v.num,
              price: v.price,
              spec: v.spec,
              title: v.title,
              address:this.data.addressDetail,
              mobilePhone: this.data.mobilePhone,
              username:this.data.userName
            },
            success(res) {
              console.log("添加成功", res)
            },
            fail(res) {
              console.log("添加失败", res)
            }
          })
        }
      })
    }
  },
  deleteSelect: function (e) { //删除选中商品函数
    // console.log(select_list.length)
    for (var i = 0; i < select_list.length; i++) {
      db.collection("cartList").doc(select_list[i]).remove({
        success(res) {
          console.log("删除成功", res)
          select_list = []
        },
        fail(res) {
          console.log("删除失败", res)
        }
      })
    }
  },
  closeFun: function (e) { //结算   
    var list = []
    var listTotal = []
    var that = this
    wx.showModal({
      title: '模拟支付功能',
      content: '需要支付：' + this.data.totalPrice,
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          that.addSelect()
          that.data.list.map((v, k) => {
            if (v.select) {
              list.push(v)
            } else {
              listTotal.push(v)
            }
          })
          that.setData({
            list: listTotal,
            totalPrice: 0.00,
            total: false
          })
          that.deleteSelect()
          wx.navigateTo({
            url: '/pages/orderDetails/orderDetails?type=2',
          })
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  delFun: function (e) { //删除选中商品
    var list = []
    this.deleteSelect()
    // console.log(select_list)
    this.data.list.map((v, k) => {
      if (!v.select) {
        list.push(v)
      }
    })
    this.setData({
      list: list
    })
  },
  onShow: function (options) {
    // console.log(options+"2")
    this.onLoad()
    if (app.globalData.address == null) {
      db.collection('addressList').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          this.setData({
            address: res.data[0].region.join(''),
            mobilePhone:res.data[0].mobilephone,
            userName:res.data[0].username
          })
          // console.log(this.data.userName)
        }
      })
    } else {
      // console.log(app.globalData.address)
      this.setData({
        address:app.globalData.address,
        addressDetail: app.globalData.addressDetail,
        mobilePhone:app.globalData.mobilePhone,
        userName:app.globalData.username
      })
      // console.log(this.data.mobilePhone)
    }
  },
  onLoad: function (options) {
    console.log(app.globalData.addressDetail)
    var that = this
    db.collection('cartList').get({
      success(res) {
        // console.log("查询成功",res)
        that.setData({
          list: res.data
        })
        // console.log("查询成功", res.data)
      },
      fail: res => {
        console.log("查询失败", res)
      }
    })
  },
})