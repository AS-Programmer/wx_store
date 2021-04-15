
Page({
  data: {
    no: null, // 运单号
    company: ['sfexpress', 'sto', 'yto', 'yunda', 'ttkdex','HTKY'], // 传递给快递查询接口的值
    com: ['顺丰', '申通', '圆通', '韵达', '天天','百世'], // 用于显示在页面中的快递名称
    index: 0, // 用户选择的快递公司的数组索引
    expressInfo: null, // 查询到的物流信息
  },
  search: function() {
    wx.showLoading({
      title: '加载中',
    })
    var key = 'a90ea313f83a93a2'
    wx.request({
      url: 'https://api.jisuapi.com/express/query?appkey=' + key + '&type=' + this.data.company[this.data.index] + '&number=' + this.data.no,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
        this.setData({
          expressInfo: res.data
        })
        wx.hideLoading()
      }
    })
  },
  // 获取运单号的值
  noInput: function(e) {
    this.setData({
      no: e.detail.value
    })
  },
  // 获取快递公司的索引
  companyInput: function(e) {
    this.setData({
      index: e.detail.value
    })
  }
})