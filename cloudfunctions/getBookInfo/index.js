// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios");
const doubanbook = require('doubanbook');
const cheerio = require('cheerio');
cloud.init({
  env: "test-i01pf"
})
const db = cloud.database();

async function getDouban(isbn) {
  const url = `https://search.douban.com/book/subject_search?search_text=${isbn}`;
  let serachRes = await axios.get(url);
  // 获取window.__DATA__ = 后面的数据 解密 就是 括号里的数据
  let reg = /window\.__DATA__ = "(.*)"/;
  if (reg.test(serachRes.data)) {
    let serachData = doubanbook(RegExp.$1)[0]
    return serachData;
  }
}
async function getBookDetail(bookInfo) {
  let res = await axios.get(bookInfo.url);
  const $ = new cheerio.load(res.data);
  let profile = $('#info').text().split('\n').map(e => e.trim()).filter(e => e);
  let tag = [];
  $('#db-tags-section a.tag').each((i, e) => {
    tag.push({
      title: $(e).text()
    })
  })
  let des = $('#link-report').text().trim();
  let comments = [];
  $('#comments .comment').each((index, element) => {
    comments.push({
      author: $(element).find('.comment-info a').text(),
      content: $(element).find('.comment-content .short').text(),
      date: $(element).find(".comment-info span").text(),
      rating: $(element).find('.comment-info span').eq(0).attr().title
    })
    // console.log(
    //   index,
    //   $(element).find('.comment-info a').text(),
    //   $(element).find('.comment-content .short').text(),
    //   $(element).find(".comment-info span").text(),
    //   $(element).find('.comment-info span').eq(0).attr().title
    // )
  });
  const wxContext = cloud.getWXContext()
  console.log(wxContext,wxContext.OPENID);
  const resultData = {
    _openid: wxContext.OPENID,
    create_time: +new Date(),
    title: bookInfo.title,
    rate: bookInfo.rating.value,
    images: bookInfo.cover_url,
    url: bookInfo.url,
    summary: des,
    tag,
    author: profile[1],
    publisher: profile[2],
    price: profile[5],
    comments,
    count: 1
  }
  return resultData;
}
// 调试 
async function getBookInfo(isbn) {
  // 第一个爬虫： 通过isbn获取豆瓣书籍详情 包含：书名、出版信息、评分、详情url 
  let bookInfo = await getDouban(isbn);
  // 第二个爬虫：通过bookInfo.url爬取到书籍详情、评论等 
  let bookDetail = await getBookDetail(bookInfo);
  // 把爬取到的数据放到数据库中
  let addres = await db.collection("doubanbooks").add({ data: bookDetail});
  console.log(addres)
  return bookDetail;
  console.log(bookDetail)
}

// 本地调试入口
// console.log(getBookInfo('9787040431995'))
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    isbn
  } = event;
  console.log(isbn)
  return getBookInfo(isbn);
}