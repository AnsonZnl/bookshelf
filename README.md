# 书架小程序

## 注册微信小程序
- 在 [微信公众平台](https://mp.weixin.qq.com/) 注册一个小程序，得到小程序的appid。
- 下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 打开微信开发者工具，创建小程序，输入appid，选择使用云开发，创建小程序。
- 删除demo中的代码，创建一个云环境。

## 小程序登录
- 使用`<button open-type="getUserInfo" bindgetuserinfo="onGetUserInfo">登录</button>`获取个人信息，
- 使用`ogin`云函数获取openid.
- 使用`wx.setStorage()`把信息存在本地
- 使用`wx:if/else`做登录判断

## 添加图书
- 使用`wx.scanCode`扫码功能，扫描图书背后的条形，获取isbn号。
- 调用`getBookInfo`云函数，爬取这本书在豆瓣的简介和评论。
- 获得简介和评论后存到云数据库，并返回给前端。
- 添加到数据成功！

## 书架列表
- 获取云函数的书架列表
- 下拉刷新
- 滚动加载

## 图书详情
- 点击书籍拿到id,跳转到详情页。
- 根据id获取云数据库中对应的书籍详情并展示
