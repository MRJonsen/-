// pages/login/login.js
const uiutil = require('../../utils/UiUtils.js')
const httputil = require('../../utils/HttpUtils.js')
const stringutil = require('../../utils/String.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'accountinfo',
      success: function (res) {
        // console.log(res)
        that.setData({
          account: res.data.account,
          password: res.data.password
        })
      },
    })
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

  },
  phoneInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  transformRequest: function (obj) {
    var str = [];
    for (var p in obj)
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  },

  login: function () {
    var that = this;
    var postContent = {
      username: that.data.account,
      password: that.data.password,
      remember_me: true
    };
    if (that.data.account.length === 0 || that.data.password.length === 0) {
      uiutil.Toast('用户名或密码不能为空');
    } else {
      var dataList = Array();
      var datas = new Map();
      var fileds = new Map();
      fileds['USERACCOUNT'] = this.data.account;
      fileds['LOGINPWD'] = this.data.password;
      fileds["ACCOUNTSTATUS"] = "";
      datas['UUM_USER'] = fileds;
      dataList.push(datas);
      var parametersMap = new Map();
      parametersMap["NOSUITUNIT"] = 'true';
      var commandMap = new Map();
      commandMap["actionflag"] = "select";
      var json = stringutil.datasToJson(dataList, parametersMap, null);
      httputil.post({
        url: app.globalData.loginurl,
        data: json,
        success: function (res) {

          var dataList = new Array();
          var parametersMap = new Map();
          var commandMap = new Map();
          var dataMap = new Map();
          var datas = new Map();
          dataMap["UUM_USER"] = datas;
          dataList.push(dataMap);

          parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
          parametersMap["METHOD"] = "search";//updateSave,delete,search
          parametersMap["MENUAPP"] = "EMARK_APP";
          parametersMap["WHERESQL"] = "";
          parametersMap["ORDERSQL"] = "";
          parametersMap["MASTERTABLE"] = "UUM_USER";
          parametersMap["DETAILTABLE"] = "";
          parametersMap["MASTERFIELD"] = "SEQKEY";
          parametersMap["DETAILFIELD"] = "";
          parametersMap["start"] = "0";
          parametersMap["limit"] = "20";
          parametersMap["self"] = "self";

          commandMap["mobileapp"] = "true";
          commandMap["actionflag"] = "userinfo";
          var json1 = stringutil.datasToJson(dataList, parametersMap, commandMap);
          httputil.post({
            url: app.globalData.commonaction,
            data: json1,
            success: function (res) {
              app.globalData.userInfo = res[0];//设置全局用户信息变量
              wx.setStorage({
                key: 'accountinfo',
                data: {
                  account: that.data.account,
                  password: that.data.password
                }
              })
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        }
      })
    }
  }
})