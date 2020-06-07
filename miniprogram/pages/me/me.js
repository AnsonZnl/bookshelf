// pages/me/me.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    myBooks:[]
  },
  onGetUserInfo(e) {
    console.log(e.detail.userInfo);
    let userInfo = e.detail.userInfo;
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log(res.result);
      userInfo.openid = res.result.openid;
      this.setData({
        userInfo
      })
      wx.setStorage({
        key: 'userInfo',
        data: userInfo
      })
      this.getMyBooks(userInfo.openid)
    }).catch(err => {
      console.log(err)
    })
  },
  // 扫码
  scanCode() {
    let that = this;
    wx.showLoading({
      title: '添加中..',
    })
    wx.scanCode({
      success(res) {
        let isbn = res.result;
        console.log(res);
        wx.cloud.callFunction({
          name: 'getBookInfo',
          data: {
            isbn
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '添加成功',
            content: `成功将"${res.result.title}"添加到书架`,
            showCancel: false
          })
          let arr = that.data.myBooks;
          arr.push(res.result);
          that.setData({
            myBooks: arr
          })
        }).catch(err => {
          console.log(err)
          wx.hideLoading()
          wx.showModal({
            title: '添加失败',
            content: err.errMsg,
            showCancel: false
          })
        })
      },
      fail(err) {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo') || {};
    console.log(userInfo)
    this.setData({
      userInfo: userInfo
    })
    if (userInfo.openid) {
      this.getMyBooks(userInfo.openid) // 得到图书列表
      this.getAccountBooks(userInfo.openid)
    }
  },
  getMyBooks(openid){
    db.collection('doubanbooks').where({
      _openid: openid
    }).get().then(res=>{
      console.log(res);
      this.setData({
        myBooks: res.data
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  getAccountBooks(openid){
    
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})