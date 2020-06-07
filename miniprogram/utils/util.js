//格式化 当前时间
/*
use:
FormatTime(new Date)
*/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/*返回日期 2019-12-12 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  return [year, month, day].map(formatNumber).join('-');
}
// 传入时间戳 返回时间 
const parseTime = function (date){
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  return [hour, minute].map(formatNumber).join(':')
}

//获取当前的token
function getToken() {
  let token = wx.getStorageSync('token') || null;
  if (token) {
    return token;
  } else {
    new Error('获取token失败')
    return ''
  }
}


/*
基于Promise封装的wx.request

使用方法，在app.js中引入：

```
import request from './request.js'
App({
  myRequest(){
    return new request();
  }
})
```

然后在要使用的页面里引入使用即可：
```
const app = getApp();//新建页面时 默认引入
const ajax = app.myRequest();//初始化一个的request() 实例

Page({
  data:{},
  onLoad(){
    this.getData();  
  },
  getData(){
    ajax.getRequest('/getList',{id: 1024}).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
  }
})
```
使用方法也是异常简单
比如Get请求就是：`ajax.getRequest(url: String, data: Object);`
比如Post请求就是：`ajax.postRequest(url: String, data: Object);`
...

*/
class Request {
  constructor() {
    this._baseUrl = 'https://track.huiur.com/api';
    // this._token = wx.getStorageSync('token');
    this._header = {
      'content-type': 'application/json'
    }
  }

  /**
   * 设置统一的异常处理 暂未开放
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * GET类型的网络请求
   */
  getRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'GET')
  }

  /**
   * DELETE类型的网络请求
   */
  deleteRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'DELETE')
  }

  /**
   * PUT类型的网络请求
   */
  putRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'PUT')
  }

  /**
   * POST类型的网络请求
   */
  postRequest(url, data, header = this._header) {
    return this.requestAll(url, data, header, 'POST')
  }

  /**
   * 网络请求
   */
  requestAll(url, data, header, method) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this._baseUrl + url,
        data: data,
        header: header,
        method: method,
        success: (res => {
          if (res.statusCode === 200 || res.statusCode == 201) {
            //200: 服务端业务处理正常结束
            resolve(res)
          } else {
            //其它错误，提示用户错误信息
            // if (this._errorHandler != null) {
            //   //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
            //   this._errorHandler(res)
            // }
            reject(res)
          }
        }),
        fail: (res => {
          // if (this._errorHandler != null) {
          //   this._errorHandler(res)
          // }
          reject(res)
        })
      })
    })
  }
}


/*
Toast弹窗

useed：
const Toast = require('./utils/util.js').Toast;
var toast = new Toast();
toast.successToast('succ');

 */
class Toast {
  constructor() {
    this.duration = 1500
    this.mask = false
  }
  successToast(title) {
    return this.allToast(title, 'success')
  }
  noneToast(title) {
    return this.allToast(title, 'none')
  }
  loadingToast(title) {
    return this.allToast(title, 'loading')
  }
  allToast(title, icon) {
    wx.showToast({
      title: title,
      icon: icon
    })
  }
}
// 判断数据类型
function myTypeOf(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

//节流函数 默认 3 秒内连续调用 只执行一次
//作用如：监听页面事件，做节流每隔一段时间 才执行一次
//https://github.com/yygmind/blog/issues/38
const throttle = (fn, wait = 50) => { // fn 是需要执行的函数  wait 是时间间隔
  // 上一次执行 fn 的时间
  let previous = 0
  // 将 throttle 处理结果当作函数返回
  return function(...args) {
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = +new Date()
    // 将当前时间和上一次执行函数的时间进行对比
    // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
    if (now - previous > wait) {
      previous = now
      fn.apply(this, args)
    }
  }
}

//防抖 函数
//https://juejin.im/post/5cfe66fa6fb9a07ee1691ddb
//默认 3 秒内无论调用了多少次函数，都只执行最后一次调用。
//如果 3 秒内又遇到函数调用，则重新计算 3 秒。
//直至新的 3 秒内没有函数调用请求，此时才执行函数，不然以此类推重新计时。
//应用：input 搜索地址， textarea 自动保存。在最后一次输入的时候执行的函数
function debounce(fn, awit = 3000) {
  var timer = null;
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, awit)
  }
}

// 为防止页面栈爆栈，封装的navigateTo 方法
function myNavigateTo(obj) {
  const url = obj.url;
  if (getCurrentPages().length >= 10) {
    wx.redirectTo({
      url: url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
}

module.exports = {
  Toast,
  Request,
  throttle,
  debounce,
  myNavigateTo,
  getToken,
  myTypeOf,
  formatTime,
  formatDate,
  parseTime
}