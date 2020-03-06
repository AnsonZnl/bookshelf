// pages/me/me.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  onGetUserInfo(e) {
    console.log(e.detail.userInfo);
    let userInfo = e.detail.userInfo;
    wx.cloud.callFunction({
      name: 'login',
    }).then(res=>{
      console.log(res.result);
      userInfo.openid = res.result.openid;
      this.setData({
        userInfo
      })
      wx.setStorage({
        key: 'userInfo',
        data: userInfo
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  // 扫码
  scanCode(){
    wx.scanCode({
      success(res) {
        let isbn = res.result;
        console.log(res);
        wx.cloud.callFunction({
          name: 'getBookInfo',
          data:{
            isbn
          }
        }).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
      },
      fail(err){
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    this.setData({
      userInfo: userInfo || {}
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