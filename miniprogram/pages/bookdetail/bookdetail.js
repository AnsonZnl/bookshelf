// pages/bookdetail/bookdetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    if(id){
      this.getBookDetail(options.id)
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  },
  getBookDetail(id){
    db.collection('doubanbooks').where({
      _id: id
    })
    .get()
    .then(res=>{
      console.log(res)
      let data = res.data[0];
      data.rate = this.start(data.rate);
      this.setData({
        detail: data
      })
    }).catch(err=>{
      console.log(err)
    })
  }, start(n) {
    n = Math.round(n);
    let s = '★★★★★';
    let s2 = '☆☆☆☆☆';
    let c = n / 2
    let st = s.slice(0, Math.round(c));
    let st2 = s2.slice(0, Math.round(5 - c))
    return st + st2;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})