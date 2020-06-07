// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
async function getDate(data,page,limit) {
  // {_openid: 'o3Pjh5OIotVGqMZv4Jf7r8j1I93A', month: '2020-06'}
  // .skip(6).limit(20) 从第6个开始查询，查询20个
  let income = 0;
  let expenditure = 0;
  let result = await db.collection('accountbooks')
    .where(data)
    .orderBy('day', 'asc')
    .skip(page*limit)
    .limit(limit)
    .get();
  result.data.forEach((item) => {
    let money = Number(item.money)
    if (item.state == '支出') {
      expenditure = expenditure + money
    }
    if (item.state == '收入') {
      income = income + money
    }
  })
  return {
    data: result.data,
    income: income,
    expenditure: expenditure
  }
}

// 云函数入口函数
exports.main = async (event) => {
  const {
    ENV,
    OPENID,
    APPID
  } = cloud.getWXContext()
  // 获取调用者的openid
  //event.xx 是调用者的 data 参数
  let data = {
    _openid: OPENID,
    month: event.month,
  };
  let page = event.page
  let limit =  event.limit
  // return data;
  return getDate(data, page, limit)
}