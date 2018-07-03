const httputil = require('../../utils/HttpUtils.js')
const stringutil = require('../../utils/String.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Manhour:null,
    TaskDatas:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.manhour))
    this.setData({
      Manhour: JSON.parse(options.manhour)
    })
    this.getTaskDatas();
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
  // 年份选择变化
  bindYearPickerChange: function (e) {
    console.log(e.detail.value)
    this.jsWeek(this.data.YearData[e.detail.value])//初始化周数据
    this.setData({
      YearIndex: e.detail.value
    })
  },
  bindWeekPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      WeekTimeIndex: e.detail.value
    })
  },
  taskStatusChange: function (e) {
    console.log(e.detail.value)
    console.log(e.target.dataset.pj_index)
    var taskstatus = this.data.taskStatus
    taskstatus[parseInt(e.target.dataset.pj_index)] = parseInt(e.detail.value)
    this.setData({
      taskIndex: e.detail.value,
      taskStatus: taskstatus
    })
  },
  //获取任务报名
  getTaskData: function () {
    var that = this;
    if (that.data.YearData.length > 0) {
      return
    }

    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    datas["PERIODCODE"] = '';
    dataMap["ZCCM_PJ_PROJECT"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "MEMBERS like '%" + app.globalData.userInfo.USERID+"%'";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_PROJECT";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "manhourYearData";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);

    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        console.log(res)
        // var data = new Array();
        // for(var i ; i<res.length ; i++){
        //   data.push(data[i])
        // }
        that.setData({
          YearData: res,
        })
        that.jsWeek(res[that.data.WeekIndex])//初始化周数据
      }
    })
    
  },
  //获取任务数据
  getTaskDatas: function () {
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();

    dataMap["V_APP_PJ_TASK"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "TSRPT_ID ='" + that.data.Manhour.TSRPT_ID +"'";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "V_APP_PJ_TASK";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";
    parametersMap["TSRPT_ID"] = that.data.Manhour.TSRPT_ID ;

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "manhourDetail";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);

    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        that.setData({
          TaskDatas: res,
        })
      }
    })
  },
  addManHour: function () {
    var that = this;
    var taskstatus = this.data.taskStatus;
    taskstatus.push(0);
    console.log(this.data.taskStatus)
    var list = this.data.ManHourList;
    list.push(list.length + 1);
    var taskchoicedata = this.data.taskChoiceData;
    taskchoicedata.push([0, 0, 0]);
    that.setData({
      ManHourList: list,
      taskStatus: taskstatus,
      taskChoiceData: taskchoicedata
    })
  },
  saveManHour: function () {
    console.log("saveManHour");
  },
  deleteManHour: function (event) {
    var that = this;
    var list = this.data.ManHourList;
    var taskstatus = this.data.taskStatus;
    var taskchoicedata = this.data.taskChoiceData;
    if (list.length <= 1) {
      console.log("sss" + list)
      return
    }
    var i = parseInt(event.target.dataset.index);
    taskstatus.splice(i, 1);
    list.splice(i, 1)
    taskchoicedata.splice(i, 1)
    console.log(taskstatus);
    that.setData({
      ManHourList: list,
      taskStatus: taskstatus,
      taskChoiceData: taskchoicedata
    })
  },
  textInput: function (e) {
    console.log(e.target.dataset.pj_index)
    console.log(e.detail.value)
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    var datas = e.detail.value;
    var size = this.data.ManHourList.length;
    datas.size = this.data.ManHourList.length;
    // datas.DEPT_ID = getApp().globalData.userInfo.departmentid
    // datas.USER_ID = getApp().globalData.userInfo.userid
    // datas.USER_NAME = getApp().globalData.userInfo.username
    // datas.SYSCREATORID = getApp().globalData.userInfo.userid
    // datas.SYSDEPTID = getApp().globalData.userInfo.departmentid
    var obj = JSON.stringify(datas)
    console.log(obj)
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    // datas["DEPT_ID"] = getApp().globalData.userInfo.departmentid;
    // datas["USER_ID"] = getApp().globalData.userInfo.userid;
    // datas["USER_NAME"]= getApp().globalData.userInfo.username;
    // datas["SYSCREATORID"]= getApp().globalData.userInfo.userid;
    // datas["SYSDEPTID"] = getApp().globalData.userInfo.departmentid;
    // datas["PERIODYEAR"] = ;
    // datas["PERIODWEEK"] = ;
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);
    //从表数据
    for (var i = 0; i < size; i++) {
      var dataMap1 = new Map();
      var data1 = new Map()
      var gshj
      for (var j; j < 7; j++) {

      }
      dataMap1["ZCCM_PJ_TS_TASK"] = data1;
      dataList.push(dataMap1);
    }

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
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
    console.log("第二段" + json)
    // httputil.post({
    // url: app.globalData.commonaction,
    // data: json,
    // success: function (res) {
    // var list = that.data.work_time_list;
    // list[e.currentTarget.dataset.index].STATUS = 1;
    // that.setData({
    //   work_time_list: list
    // })
    // }
    // }) 
  },
  jsWeek: function (res) {
    var year = parseInt(res.PERIODCODE);
    var d = new Date(year, 0, 1);
    var to = new Date(year + 1, 0, 1);
    var i = 1;
    var weekData = new Array();
    var weekBeginData = new Array();
    var weekEndData = new Array();
    for (var from = d; from.getFullYear() < to.getFullYear();) {
      weekData.push(i + "");
      weekBeginData.push(year + "-" + (from.getMonth() + 1) + "-" + from.getDate());
      // console.log(year + "年第" + i + "周 " + (from.getMonth() + 1) + "月" + from.getDate() + "日 - ");
      from.setDate(from.getDate() + 6);
      if (from < to) {
        weekEndData.push(year + "-" + (from.getMonth() + 1) + "-" + from.getDate());
        // console.log((from.getMonth() + 1) + "月" + from.getDate() + "日")
      }
      from.setDate(from.getDate() + 1);
      i++;
    }
    this.setData({
      WeekData: weekData,//周次数据
      WeekBeginData: weekBeginData,
      WeekEndData: weekEndData
    })
  },
  bindTreeChange: function (res) {
    var i = res.detail.value[0];
    var j = 0;
    console.log(res.detail.value);
    var data = this.data.taskData
    if (data[i].phaseEntities.length > res.detail.value[1]) {
      j = res.detail.value[1];
    }
    this.setData({
      value: res.detail.value,
      one: data,
      two: data[i].phaseEntities,
      three: data[i].phaseEntities[j].projectTaskEntities,
    })
  },
  openThree: function (res) {
    console.log(res.target.dataset.index)
    var b = !this.data.condition
    this.setData({
      condition: b,
      taskChoiceIndex: res.target.dataset.index
    })
  },
  // 关闭三
  saveThree: function () {
    var choiceData = this.data.taskChoiceData;
    choiceData[this.data.taskChoiceIndex] = this.data.value
    this.setData({
      taskChoiceData: choiceData,
      condition: false
    })
  },
  saveThreeChoice: function () {

  }
})