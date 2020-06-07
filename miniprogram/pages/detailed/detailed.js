const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '',
        page: 0,
        myAccountBooks: [],
        income: 0,
        expenditure: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let dateObj = new Date();
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1 <= 9 ? `0${dateObj.getMonth()+1}` : dateObj.getMonth() + 1
        let date = `${year}-${month}`;
        this.setData({
            date
        })
        this.getAccountBooks(date)
    },
    getAccountBooks(date) {
        wx.showLoading({
            title: '加载中..',
        })
        console.log(date)
        wx.cloud.callFunction({
            name: 'getAccountBooks',
            data: {
                month: date,
                page: this.data.page,
                limit: 100
            }
        }).then(res => {
            console.log(res)
            let data = res.result;
            this.setData({
                myAccountBooks: data.data,
                income: data.income,
                expenditure: data.expenditure
            })
            wx.hideLoading()
        }).catch(err => {
            wx.hideLoading()
            console.log(err)
        })
    },
    dateChange(e) {
        let date = e.detail.value;
        this.setData({
            date,
            page: 1
        })
        getAccountBooks(date)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('触底');
        let addpage = this.data.page+1
        // this.setData({
        //     page: addpage
        // })
        // this.getAccountBooks(this.data.date, addpage)
    },
})

// charts
// var wxCharts = require('./../../utils/wxchart');
// var app = getApp();
// var pieChart = null;
// Page({
//     data: {
//     },
//     touchHandler: function (e) {
//         console.log(pieChart.getCurrentDataIndex(e));
//     },        
//     onLoad: function (e) {
//         var windowWidth = 320;
//         try {
//             var res = wx.getSystemInfoSync();
//             windowWidth = res.windowWidth;
//         } catch (e) {
//             console.error('getSystemInfoSync failed!');
//         }

//         pieChart = new wxCharts({
//             animation: true,
//             canvasId: 'pieCanvas',
//             type: 'pie',
//             series: [{
//                 name: '成交量1',
//                 data: 15,
//             }, {
//                 name: '成交量2',
//                 data: 35,
//             }, {
//                 name: '成交量3',
//                 data: 78,
//             }, {
//                 name: '成交量4',
//                 data: 63,
//             }, {
//                 name: '成交量2',
//                 data: 35,
//             }, {
//                 name: '成交量3',
//                 data: 78,
//             }, {
//                 name: '成交量4',
//                 data: 63,
//             }, {
//                 name: '成交量2',
//                 data: 35,
//             }, {
//                 name: '成交量3',
//                 data: 78,
//             }, {
//                 name: '成交量3',
//                 data: 78,
//             }],
//             width: windowWidth,
//             height: 300,
//             dataLabel: true,
//         });
//     }
// });