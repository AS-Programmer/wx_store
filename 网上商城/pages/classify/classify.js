const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    currentTab: 0, //对应样式变化
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    screenArray: '', //左侧导航栏内容
    screenId: "", //后台查询需要的字段
    childrenArray: [], //右侧内容
  },

  ToSearchResult: function (e) {
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id,
    })
  },

  navbarTap: function (e) {
    var that = this;
    // console.log(e);
    // console.log(e.currentTarget.dataset.screenid);
    // console.log(e.target.dataset.id);
    // console.log(e.currentTarget.dataset.id);
    var classifyId = e.currentTarget.dataset.id
    db.collection("goodsList").where({
      classify_id:classifyId
    }).get({
      success: res => {
        that.setData({
          childrenArray: res.data,
        })
      },
      fail: res => {
        console.log("查询失败", res)
      }
    })
    that.setData({
      currentTab: e.currentTarget.id, //按钮CSS变化
      screenId: e.currentTarget.dataset.screenid,
      scrollTop: 0, //切换导航后，控制右侧滚动视图回到顶部
    })
  },

  searchgoods: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  onLoad: function (options) {
    db.collection("classifyList").get({
      success: res => {
        // console.log(res)
        this.setData({
          screenArray: res.data
        })
        db.collection("goodsList").where({
          classify_id: res.data[0]._id
        }).get({
          success: res => {
            this.setData({
              childrenArray: res.data
            })
          },
          fail: res => {
            console.log("查询失败", res)
          }
        })
      },
    })
  },
})