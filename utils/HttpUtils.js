var uiutil = require("UiUtils.js")
var stringutil = require('String.js')
const app = getApp();
/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function post(param) {
  var that = this;
  console.log("----_post--start-------");
  var mydata = {};
  // uiutil.showLoading("数据加载中")
  wx.showLoading({
    title: '数据加载中',
    mask: true,
    
  })
  mydata = param.data || {};
  wx.request({
    url: "https://www.hzzcdz.com/zccmp/"+ param.url,
    // url:"http://192.168.0.106:8080/zccmp/"+param.url,
    // url: "http://192.168.10.114:8080/zccmp/"+ param.url,
    // url: "http://192.168.0.104:8080/zccmp/" + param.url,
      // baseurl: "http://192.168.0.103:8090/api/"
    // baseurl: "http://192.168.10.114:8090/api/"
    header: {
      // 'content-type': 'application/x-www-form-urlencoded'
      'Cookie': app.globalData.cookie
    },
    method: 'POST',
    data: mydata,
    success: function (res) {
      console.log('----服务器返回-----')
      console.log(JSON.stringify(res.data))
      console.log('-----------------')
      if (param.success) {
        if (res.statusCode === 200) {
          if (res.header["Set-Cookie"]!=null){
            getApp().globalData.cookie = res.header["Set-Cookie"]//持久cookie
          }
          if (res.data.RETMSG == "null" || res.data.RETMSG == '操作成功！' ) {
            wx.hideLoading();
            if (res.data.EXCEPTIONDATA.length == 0){
              param.success(stringutil.responseToDatas(res, ''));
            }else{
              console.log("------失败--------")
              if (param.fail) {
                param.fail(res);
              }
            }
          
          } else {
            console.log("------失败--------")
            uiutil.Toast(res.data.RETMSG)
            if (param.fail) {
              param.fail(res);
            }
          }
          // if (res.data.code == "0000") {
          //   wx.hideLoading();
          //   param.success(res);
          // } else {
          //   uiutil.Toast(res.data.msg)
          //   if (param.fail) {
          //     param.fail(res);
          //   }
          // }
        } else {
          uiutil.Toast(res.data.RETMSG)
        }
      }
    },
    fail: function (res) {
      uiutil.Toast('操作失败！')
      if (param.fail) {
        param.fail(res);
      }
    },
    complete: function () {
      if (param.complete) {
        param.complete();
      }
    }
  });
  console.log("----end-----_get----");
}
module.exports = {
  post: post
}
