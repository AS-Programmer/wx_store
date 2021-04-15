const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    swiperImage: [{
      'image': 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t24661/351/496181516/100927/6583e52f/5b726479Nf3347d8a.jpg!cr_1125x549_0_72!q70.jpg.dpg',
      'searchId': 9321
    }, {
      'image': 'https://img1.360buyimg.com/da/s750x366_jfs/t24379/52/1903452892/199422/e046bfb0/5b6d029fN5b3ba3ed.jpg!cr_1125x549_0_72.dpg',
      'searchId': 9343
    }, {
      'image': 'https://img1.360buyimg.com/da/s750x366_jfs/t25558/137/500935272/289814/fe13293c/5b723e1dN8c906f37.jpg!cr_1125x549_0_72.dpg',
      'searchId': 9512
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t20029/272/1765431541/135543/fbf22a8b/5b25a7d0Ncdb4f0f3.jpg!cr_1125x549_0_72!q70.jpg.dpg',
      'searchId': 9261
    }, {
      'image': 'https://img1.360buyimg.com/da/s750x366_jfs/t24793/126/533591245/84225/429e9cdf/5b72b1bfNd6ddd39d.jpg!cr_1125x549_0_72.dpg',
      'searchId': 9405
    }],
    activityImage: 'https://m.360buyimg.com/mobilecms/jfs/t22753/277/2084787740/138373/ef729e26/5b7143ccN9ba06ec0.gif',
    topNavImage: [{
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t16912/18/2046755333/11079/5d93a046/5ae41d1aN7c1bb190.png',
      'text': '京东超市'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t21658/347/221358098/7461/f86e6f74/5b03b170Nc9e0ec7c.png',
      'text': '全球购'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t18865/90/1804471517/14538/72c79ba/5ad87b67N1ebcb69b.png',
      'text': '京东服饰'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t17725/156/1767366877/17404/f45d418b/5ad87bf0N66c5db7c.png',
      'text': '京东生鲜'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t16990/157/2001547525/17770/a7b93378/5ae01befN2494769f.png',
      'text': '京东到家'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t18454/342/2607665324/6406/273daced/5b03b74eN3541598d.png',
      'text': '充值缴费'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t22228/270/207441984/11564/88140ab7/5b03fae3N67f78fe3.png',
      'text': '9.9元拼'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t19495/200/1823004232/14065/ca00ab2c/5ad87cf5N4ad8e6f1.png',
      'text': '领券'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t16828/63/2653634926/5662/d18f6fa1/5b03b779N5c0b196f.png',
      'text': '赚钱'
    }, {
      'image': 'https://m.360buyimg.com/mobilecms/jfs/t21481/263/412160889/15938/4246b4f8/5b0cea29N8fb2865f.png',
      'text': '全部'
    }],
    news: {
      'image': 'https://st.360buyimg.com/m/images/index/jd-news-tit.png',
      'items': [
        '为什么懂电脑的人不买i7处理器?',
        '5G手机来了，4G手机还有必要买吗？',
        '小米曝光新机参数，就剩价格没说了',
        'iphone 9九月问世，性能惊人'
      ]
    },
    searchNewsList: [
      '魅族16超级新品日 旗舰首发',
      '新品预售 满500减100',
      '小米10pro超级旗舰首发',
      'iphone12pr 九月问世 性能惊人'
    ],
    topBarOpacity: 0,
    searchKey: '',
    time: '',
    goodsList:[],
    loading:true,
    pageNum:1,
    noMore:false,
  },
  searchFun:function(e){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  ToDetailsResult:function(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  scroll: function (e) {
    var scrollTop = e.detail.scrollTop;
    scrollTop = scrollTop > 300 ? 300 : scrollTop;
    this.setData({
      topBarOpacity: scrollTop / 300
    });
  },
  onLoad:function(options){
    // db.collection("goodsList").get({
    //   success:res=>{
    //     this.setData({
    //       goodsList:res.data
    //     })
    //     // console.log(res.data)
    //   },
    // })
    this.getData()
  },

  //请求数据
  getData(isPage) {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: 6
    }
    db.collection("goodsList").get({
      success:res=>{
        this.setData({
          loading: false
        })
        if (isPage) {
          //下一页的数据拼接在原有数据后面
          this.setData({
            goodsList: this.data.goodsList.concat(res.data)
          })
        } else {
          //第一页数据直接赋值
          this.setData({
            goodsList: res.data
          })
        }
        if (res.data.length == 0) {
          this.setData({
            noMore: true
          })
        }
      },
    })
  },

  scrollToLower:function(e){
    if (!this.data.loading && !this.data.noMore){
      this.setData({
        loading: true,
        pageNo: this.data.pageNum + 1
      })
      this.getData(true);
    }
  },
})