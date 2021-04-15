// pages/goodsManagement/goodsManagement.js
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    hiddeNewGoods: true,
    hiddenmodalput: true,
    isEdit: false,
    list: [],
    totalNum: 0,
    sortList: [],
    imgSrc: '../../images/default_pic.png',
    goodsName: '请输入商品名称',
    goodsPrice: '请输入商品价格',
    goodsSpec: '请输入商品描述',
    sortSelect: '请选择商品分类',
    sortId: '',
    updGoodsId: ''
  },
  updGoods: function (e) { //修改商品信息
    var that = this
    // console.log(that.data.updGoodsId)
    wx.showModal({
      title: '确定修改该商品信息吗？',
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击了确定")
          db.collection("goodsList").doc(that.data.updGoodsId).update({
            data: {
              classify_id: that.data.sortId,
              img: that.data.imgSrc,
              price: that.data.goodsPrice,
              sort: that.data.sortSelect,
              spec: that.data.goodsSpec,
              title: that.data.goodsName
            },
            success: res => {
              that.onLoad()
              that.setData({
                hiddenmodalput: true,
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
  },
  addGoods: function (e) { //新增商品到数据库
    var that = this
    wx.showModal({
      title: '确定新增该商品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击了确定")
          // console.log(that.data.goodsPrice)
          if (that.data.goodsName != '' && that.data.imgSrc != '../../images/default_pic.png' && that.data.goodsPrice != '请输入商品价格' && that.data.sortSelect != '请选择商品分类' && that.data.goodsSpec != '' && that.data.goodsName != '') {
            db.collection("goodsList").add({
              data: {
                classify_id: that.data.sortId,
                img: that.data.imgSrc,
                num: 1,
                price: that.data.goodsPrice,
                selected: false,
                sort: that.data.sortSelect,
                spec: that.data.goodsSpec,
                title: that.data.goodsName
              },
              success: res => {
                that.onLoad()
                that.setData({
                  hiddeNewGoods: true
                })
                // console.log(that.data.goodsPrice)
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showModal({
              title: '商品信息不能为空',
            })
          }
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },
  newImgInput() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("选择成功", res)
        that.uploadImg(res.tempFilePaths[0])
      }
    })
  },
  uploadImg(fileUrl) { //上传图片
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.png',
      filePath: fileUrl,
      success: res => {
        console.log("上传成功", res)
        this.setData({
          imgSrc: res.fileID
        })
      },
      fail: console.error
    })
  },
  newSpecInput: function (e) { //获取商品描述
    this.setData({
      goodsSpec: e.detail.value
    })
  },
  newPriceInput: function (e) { //获取商品价格
    this.setData({
      goodsPrice: parseInt(e.detail.value)
    })
  },
  newTitleInput: function (e) { //获取商品名称
    this.setData({
      goodsName: e.detail.value
    })
  },
  bindPickerSelectSort: function (e) {
    var that = this
    // var sortId = that.data.sortList[e.detail.value]._id
    console.log(that.data.sortList[e.detail.value]._id)
    that.setData({
      sortSelect: that.data.sortList[e.detail.value].title,
      sortId: that.data.sortList[e.detail.value]._id
    })
  },
  selectSortFun: function (e) {
    var that = this
    console.log(that.data.sortList)
    wx.showActionSheet({
      itemList: [that.data.sortList],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex) //这里是点击了那个按钮的下标
        }
      }
    })
  },
  delGoodsFun: function (e) { //删除商品 
    var that = this
    wx.showModal({
      title: '确定删除该商品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击了确定")
          db.collection("goodsList").doc(e.currentTarget.dataset.id).remove({
            success: res => {
              that.data.list.map((v, k) => {
                if (v._id == e.currentTarget.dataset.id) {
                  that.data.list.splice(k, 1)
                }
              })
              that.setData({
                list: that.data.list,
                totalNum: that.data.totalNum - 1
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },
  modalinput: function (e) {
    this.setData({
      hiddeNewGoods: true,
      hiddenmodalput: true,
    })
  },
  addGoodsFun: function (e) { //增加商品
    this.setData({
      hiddeNewGoods: false,
      imgSrc: '../../images/default_pic.png',
      goodsName: '请输入商品名称',
      goodsPrice: '请输入商品价格',
      goodsSpec: '请输入商品描述',
      sortSelect: '请选择商品分类',
      sortId: '',
    })
  },
  updGoodsFun: function (e) { //修改商品
    var that = this
    // console.log(e.currentTarget.dataset.id)
    db.collection("goodsList").doc(e.currentTarget.dataset.id).get({
      success: res => {
        that.setData({
          hiddenmodalput: false,
          imgSrc: res.data.img,
          goodsName: res.data.title,
          goodsPrice: res.data.price,
          goodsSpec: res.data.spec,
          sortSelect: res.data.sort,
          updGoodsId: e.currentTarget.dataset.id
        })
      }
    })
  },
  editFun: function (e) { //编辑
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  onLoad: function (options) {
    db.collection("goodsList").get({
      success: res => {
        this.setData({
          list: res.data,
          totalNum: res.data.length
        })
      }
    })
    db.collection("classifyList").get({
      success: res => {
        this.setData({
          sortList: res.data
        })
      }
    })
  },
})