const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    page: 0,
    more: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getBooksList()
    this.getList(true)
  },
  getBooksList: function () {
    let that = this;
    db.collection('doubanbooks')
      .field({
        images: true,
        title: true,
        author: true,
        rate: true,
        publisher: true
      })
      .limit(10)
      .orderBy('create_time', 'desc')
      .get()
      .then(res => {
        // console.log(res);
        let arr = res.data;
        arr.map(e => {
          e.rate = that.start(Number(e.rate))
        })
        this.setData({
          booksList: arr
        })
      }).catch(err => {
        console.log(err)
      })
  },
  getList(init) {
    const that = this;
    if (init) {
      this.setData({
        page:0,
        more:true
      })
      // 初始化
    }
    wx.showNavigationBarLoading()
    wx.showLoading({ title: '加载中' })
    const PAGE = 6;
    const offset = this.data.page * PAGE
    console.log(offset)
    let ret = db.collection('doubanbooks') .orderBy('create_time', 'desc')
    if(offset>0){
      ret = ret.skip(offset)
    }
    ret = ret.limit(PAGE).get().then(books=>{
      console.log(books)
      let arr = books.data;
      arr.map(e => {
        e.rate = that.start(Number(e.rate))
      })
        if (arr.length < Page && this.data.page > 0) {
          this.setData({
            more:false
          })
        }
        // books.data.length = PAGE
        if (init) {
          this.setData({
            books: arr
          })
          wx.stopPullDownRefresh()
        } else {
          this.setData({
            books: [...this.data.books, ...arr]
          })
          // 下拉刷新，不能直接覆盖books 而是累加
        }
        wx.hideLoading()
        wx.hideNavigationBarLoading()
    })
  },
  start(n) {
    n = Math.round(n);
    let s = '★★★★★';
    let s2 = '☆☆☆☆☆';
    let c = n / 2
    let st = s.slice(0, Math.round(c));
    let st2 = s2.slice(0, Math.round(5 - c))
    return st + st2;
  },
  toDetail(e) {
    console.log(e)
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/bookdetail/bookdetail?id=${id}`
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('触底了')
    this.setData({
      page: this.data.page+1
    },()=>{
      console.log(this.data.page)
      this.getList()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getBooksList();
    wx.stopPullDownRefresh()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})