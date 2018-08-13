// pages/worktimelist/worktimelist.js
var base64 = require("../../images/base64");
const httputil = require('../../utils/HttpUtils.js')
const stringutil = require('../../utils/String.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    share_btn: { imgUrl: '../../images/manhour_icon.png', zhName: '工时填报', url: "../workhour/workhour" },
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    hasMore: true,
    work_time_list: [

    ],
    color: ['#B0C4DE', "#DDA0DD", "#EEAD0E"],
    start_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon: base64.icon20
    });
    this.manHourDatas();
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
    if (app.globalData.worklistneedrefresh){
       this.manHourDatas(true);
       app.globalData.worklistneedrefresh=false;
    }
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
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    this.manHourDatas(true)
    // setTimeout(function () {
    //   // complete
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 5500);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.manHourDatas();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  manhourDetail: function () {//跳转工时详情
    wx.navigateTo({
      url: '../manhourdetail/manhourdetail',
    })
  },
  WorkTimeAdd: function () {//跳转工时添加页面
    wx.navigateTo({
      url: '../worktimeadd/worktimeadd',
    })
  },
  bindDetail: function (e) {
    // console.log(e.currentTarget.dataset.item);
    var data = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      // url: '../manhourdetail/manhourdetail?manhour=' + data,
      url: '../workhour/workhour?manhour=' + data,
    })
  },
  statusOperation: function (e) {
    var e = e;
    var that = this;
    if (e.currentTarget.dataset.manhour.STATUS == 0 || e.currentTarget.dataset.manhour.STATUS == 4) {
      wx.showActionSheet({
        itemList: ['提交', '删除'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 1) {
            that.deleteManHour(e);
          }
          if (res.tapIndex == 0) {
            that.commitManHour(e);
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }

  },
  deleteManHour: function (e) {//删除工时
    console.log(e.currentTarget.dataset.index);
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();
    var dataMap = new Map();
    var datas = new Map();
    datas["TSRPT_ID"] = e.currentTarget.dataset.manhour.TSRPT_ID;
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "delete";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "ZCCM_PJ_TS_TASK";
    parametersMap["MASTERFIELD"] = "TSRPT_ID";
    parametersMap["DETAILFIELD"] = "TSRPT_ID";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";
    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    console.log(json)
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        var list = that.data.work_time_list;
        list.splice(e.currentTarget.dataset.index, 1)
        console.log(list);
        that.setData({
          work_time_list: list
        })
      }
    })
  },
  commitManHour: function (e) {//提交工时
    // console.log(e.currentTarget.dataset.index);
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();
    var dataMap = new Map();
    var datas = new Map();
    datas["TSRPT_ID"] = e.currentTarget.dataset.manhour.TSRPT_ID;
    datas["STATUS"] = 1;
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;

    // var dataMap1 = new Map();
    // var data1 = new Map()
    // data1["AUDIT_STATUS"] = 1;
    // dataMap1["ZCCM_PJ_TS_TASK"] = data1;

    // dataList.push(dataMap1);

    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "updateSave";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "";
    parametersMap["ORDERSQL"] = "";
    parametersMap["ZCCM_PJ_TS_REPORTING.TSRPT_ID"] = e.currentTarget.dataset.manhour.TSRPT_ID;
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "tsrpt_id";
    parametersMap["DETAILFIELD"] = "tsrpt_id";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";
    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "commitManhour";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    console.log(json)
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        var list = that.data.work_time_list;
        list[e.currentTarget.dataset.index].STATUS = 1;
        that.setData({
          work_time_list: list
        })
      }
    })
  },
  manHourDatas: function (isfresh) {//获取工时数据
    var that = this;
    var index = that.data.start_index;
    if (isfresh) {
      that.setData({
        star_index: 0
      })
      index = 0;
    }

    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();
    var dataMap = new Map();
    var datas = new Map();
    dataMap["V_APP_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "user_id ='" + app.globalData.userInfo.USERID + "'";
    parametersMap["ORDERSQL"] = "periodweek DESC";
    parametersMap["MASTERTABLE"] = "V_APP_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "SEQKEY";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = index;
    parametersMap["limit"] = "10";


    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "manhourlist";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        var datas = that.data.work_time_list;
        var index = that.data.start_index;
        console.log(res)
        for (var j = 0; j < res.length; j++) {//处理时间格式
        //调用方法处理ios 有new Date("2017-04-28 23:59:59")需要换成new Date("2017/04/28 23:59:59")
          // res[j].WEEK_BEGINDATE = stringutil.dateFtt("yyyy-MM-dd", new Date(res[j].WEEK_BEGINDATE));
          // res[j].WEEK_ENDDATE = stringutil.dateFtt("yyyy-MM-dd", new Date(res[j].WEEK_ENDDATE));
          res[j].WEEK_BEGINDATE = res[j].WEEK_BEGINDATE.substr(0, 10);
          res[j].WEEK_ENDDATE = res[j].WEEK_ENDDATE.substr(0, 10);
        }
        if (isfresh) {
          datas = res;
        } else {
          datas = datas.concat(res)
        }
        index = datas.length
        that.setData({
          work_time_list: datas,
          start_index: index
        })
      },
      complete: function () {
        if (isfresh) {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      }
    })
  }
})