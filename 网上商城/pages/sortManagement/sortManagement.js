const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    isEdit: false,
    list: [],
    hiddenmodalput: true,
    sort: '',
    sortId: '',
    newSortname: '',
    hiddeNewSort: true,
    addNewSortName: ''
  },
  editFun: function (e) {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  addSortFun: function (e) { //新增分类
  },
  delSortFun: function (e) { //删除分类
    var that = this
    // console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '确定删除该分类吗？',
      success: function (res) {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.id)
          db.collection("classifyList").doc(e.currentTarget.dataset.id).remove({
            success: res => {
              console.log("用户点击了确定")
              that.data.list.map((v, k) => {
                if (v._id == e.currentTarget.dataset.id) {
                  that.data.list.splice(k, 1)
                }
              })
              that.setData({
                list: that.data.list,
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: res => {
              console.log("删除失败", res)
            }
          })
        } else {
          console.log("用户点击了取消")
        }
      }
    })

  },
  updSortFun: function (e) { //更新分类
    db.collection('classifyList').doc(e.currentTarget.dataset.id).get({
      success: res => {
        this.setData({
          hiddenmodalput: false,
          sort: res.data.title,
          sortId: e.currentTarget.dataset.id
        })
      }
    })
  },
  newSortName: function (event) { //获取新分类名称
    this.setData({
      newSortname: event.detail.value
    })
  },
  confirm: function (e) { //修改
    db.collection("classifyList").doc(this.data.sortId).update({
      data: {
        title: this.data.newSortname
      },
      success: res => {
        this.onShow()
        this.setData({
          hiddenmodalput: true,
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  newsortname: function (event) {
    this.setData({
      addNewSortName: event.detail.value
    })
  },
  addSortFun: function (e) { //新增
    this.setData({
      hiddeNewSort: false
    })
  },
  addSort: function () {
    db.collection("classifyList").add({
      data: {
        title: this.data.addNewSortName
      },
      success: res => {
        this.onShow()
        this.setData({
          hiddeNewSort: true,
        })
        wx.showToast({
          title: '新增成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  modalinput: function (e) { //取消
    this.setData({
      hiddenmodalput: true,
      hiddeNewSort: true
    })
  },
  getData: function (e) {
    var that = this
    db.collection('classifyList').get({
      success: res => {
        // console.log(res.data)
        that.setData({
          list: res.data
        })
      }
    })
  },
  onShow: function (e) {
    this.getData()
  },
  onLoad: function (options) {
    this.getData()
  },
})