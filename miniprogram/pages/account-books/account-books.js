const ft = require('./../../utils/util');
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: ['支出','收入'],
    stateIndex: 0,
    type: ['餐饮', '交通','娱乐', '服装', '日用', '交际', '旅游', '住房', '通讯', '医疗' ,'学习'],
    typeIndex: 0,
    date: ft.formatDate(new Date()),
    money: '',
    remark: ''
  },
 onShow(){
  let userInfo = wx.getStorageSync('userInfo');
  if(!userInfo){
    wx.showModal({
      title: '提示',
      content: '请先登录',
      showCancel: false,
      success (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/me/me',
          })
        }
      }
    })
  }
 },
 typeChange: function (e) {
  this.setData({
    typeIndex: e.detail.value
  })
},
stateChange: function (e) {
 this.setData({
   stateIndex: e.detail.value
 })
},
dateChange: function (e) {
 this.setData({
   date: e.detail.value
 })
},
submit(e){
  let data = e.detail.value
  data.year = data.date.slice(0,4);
  data.month = data.date.slice(0,7);
  data.day = data.date.slice(-2);
  console.log(data)
  // return false
  db.collection('accountbooks').add({
    data
  }).then(res=>{
    console.log(res)
    wx.showToast({
      title: '记账成功！',
    })
    this.reset()
  }).catch(err=>{
    console.log(err)
    wx.showToast({
      title: err.errMes,
      icon: 'none'
    })
  })
},
reset(){
 this.setData({
  stateIndex: 0,
  typeIndex: 0,
  date: ft.formatDate(new Date()),
  money: '',
  remark: ''
 })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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