// pages/search/search.js
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    isclose: true,
    searchvalue: "",
    // searchsubmit: true,
    searchreset: false,
    hotsearch: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    falg: true,
    hotsearch1: [{ message: "短裤" }, { message: "背带裙" }, { message: "牛仔裤男" }, { message: "运动 休闲男鞋" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    hotsearch2: [{ message: "平板电脑" }, { message: "耳机" }, { message: "男鞋" }, { message: "iPhone" }, { message: "蕾丝连衣裙" }, { message: "电视" }, { message: "长裙" }, { message: "oppo" }, { message: "蓝牙耳机" }, { message: "女包" }, { message: "格力空调" }, { message: "魅族" }],
    // historydata: [],
    // historydatashow: false,
    searchresult: false,
    inputsearch: "",//输入框内的值,
    searchResult: '',//虚拟的查询结果

  },
  /*输入框输入后触发，用于联想搜索和切换取消确认*/
  inputoperation: function (e) {
    this.setData({
      // searchsubmit: false,
      // searchreset: true,
      isclose: false,
      searchvalue: e.detail.value,
      // searchvalue: this.data.searchvalue.concat(e.detail.value)
    })
  },
  //点击X
  resetinput: function () {
    var that = this
    that.setData({
      // searchsubmit: true,
      searchreset: false,
      isclose: true,
      inputsearch: "",
      // searchresult: false
    })
  },
  /*换一批操作 */
  changeother: function () {
    this.setData({
      falg: !this.data.falg
    })
  },
  /*点击搜索按钮触发*/
  searchbegin: function () {
    var that = this
    db.collection('goodsList')
    .where(_.or([{
      title: db.RegExp({
        regexp: '.*' + that.data.searchvalue,
        options: 'i',
      })
     }
    ]))
    .limit(10)
    .get({
      success:function(res){
        that.setData({
          searchresult: true,
          searchResult:res.data
        })
      }
    })
    
  },
  //点击进入详情页
  gotodetail: function(e){
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 历史搜索
    // let that = this
    // wx.getStorage({
    //   key: 'historydata',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       historydatashow: true,
    //       historydata: res.data
    //     })
    //   }
    // })
  },
})