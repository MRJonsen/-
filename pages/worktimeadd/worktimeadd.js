// pages/worktimeadd/worktimeadd.js
const httputil = require('../../utils/HttpUtils.js')
const uiutil = require('../../utils/UiUtils.js')
const stringutil = require('../../utils/String.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    YearData: [],//年份数据
    WeekData: [],//周次数据
    WeekBeginData: [],
    WeekEndData: [],
    YearIndex: 0,//选择的下拉列表下标
    WeekIndex: 0,
    WeekTimeIndex: 0,
    ManHourList: [1],//年份数据
    taskstatus: ["未开始", "进行中", "已完成"],
    taskIndex: 0,
    taskData: [],//任务数据
    taskStatus: [0],//任务状态 一开始默认有一条
    condition: true,
    value: [0, 0, 0],
    hasInput:false,
    one: [],
    two: [],
    three: [],
    condition: false,
    taskChoiceData: [[-1, -1, -1]],
    taskChoiceIndex: 0,
    TaskDatas: null,
    stepper3: {
      stepper: 0,
      min: 0,
      max: 7.5,
      step: 0.5
    },
    input: [true, false, false, false, false, false, true]
  },
  handleZanStepperChange({
    detail: stepper,
    target: {
      dataset: {
        componentId
      }
    }
  }) {
    this.setData({

      [`${componentId}.stepper`]: stepper
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getYearData();
    this.getTaskData();
    this.searchLastPJReporting();
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
    this.setWeekIndex(e.detail.value)
    this.getTaskDatas()
    // this.setData({
    //   WeekTimeIndex: e.detail.value
    // })
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
    if (that.data.taskData.length > 0) {
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
    parametersMap["WHERESQL"] = "MEMBERS like '%" + app.globalData.userInfo.USERID + "%'" + "or   PMP_ID='" + app.globalData.userInfo.USERID + "'";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_PROJECT";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "taskProject";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        that.setData({
          taskData: res,
        })
        for (var i = 0; i < res.length; i++) {
          that.getPhaseData(res[i], i);
        }
      },

    })
  }
  ,
  getPhaseData: function (res, index) {
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    dataMap["ZCCM_PJ_PHASE"] = datas;
    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "PROJECT_ID = '" + res.PROJECT_ID + "' and status = '1'";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_PHASE";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res1) {
        var taskres = that.data.taskData
        taskres[index].phaseEntities = res1;
        console.log(taskres);
        that.setData({
          taskData: taskres
        })
        for (var j = 0; j < res1.length; j++) {
          that.getProjectTaskEntities(res1[j], j, index);
        }
      }
    })
  },

  getProjectTaskEntities: function (res, index, firstIndex) {
    // for (var i = 0; i < res.length; i++) {
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    dataMap["ZCCM_PJ_TASKPKG"] = datas;
    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = " PHASE_ID = '" + res.PHASE_ID + "'";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_TASKPKG";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res1) {
        var taskres = that.data.taskData
        taskres[firstIndex].phaseEntities[index].projectTaskEntities = res1;
        console.log(taskres)
        that.setData({
          taskData: taskres,
          one: taskres,
          two: taskres[0].phaseEntities,
          three: taskres[0].phaseEntities[0].projectTaskEntities
        })
      }
    })
  },
  //获取年份数据
  getYearData: function () {
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
    dataMap["APP_EPM_BASE_PERIOD"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "APP_EPM_BASE_PERIOD";
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
  addManHour: function () {
    var that = this;
    var taskstatus = this.data.taskStatus;
    taskstatus.push(0);
    console.log(this.data.taskStatus)
    var list = this.data.ManHourList;
    list.push(list.length + 1);
    var taskchoicedata = this.data.taskChoiceData;
    taskchoicedata.push([-1, -1, -1]);
    that.setData({
      ManHourList: list,
      taskStatus: taskstatus,
      taskChoiceData: taskchoicedata
    })
    this.scrollToBottom()
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
  formSubmit: function (e) {//工时提交
    console.log(e.detail.target.id)
    var status = 0;
    if (e.detail.target.id == "commit") {
      status = 1;
    }
    console.log(status)
    console.log(e.detail.value)
    var datas = e.detail.value;
    var size = this.data.ManHourList.length;
    datas.size = this.data.ManHourList.length;
    // datas.DEPT_ID = getApp().globalData.userInfo.departmentid
    // datas.USER_ID = getApp().globalData.userInfo.userid
    // datas.USER_NAME = getApp().globalData.userInfo.username
    // datas.SYSCREATORID = getApp().globalData.userInfo.userid
    // datas.SYSDEPTID = getApp().globalData.userInfo.departmentid
    // var obj = JSON.stringify(datas)
    // console.log(obj)
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    // datas["TSRPT_ID"] = "s_PJ_TS_REPORTING.nextval";
    datas["DEPT_ID"] = getApp().globalData.userInfo.DEPARTMENTID;

    datas["STATUS"] = status;
    datas["SUITUNIT"] = "HZZC";
    console.log(datas)
    datas["USER_ID"] = getApp().globalData.userInfo.USERID;
    datas["USER_NAME"] = getApp().globalData.userInfo.USERNAME;
    datas["SYSCREATORID"] = getApp().globalData.userInfo.USERID;
    datas["SYSDEPTID"] = getApp().globalData.userInfo.DEPARTMENTID;
    datas["PERIODYEAR"] = e.detail.value.PERIODYEAR;
    datas["PERIODWEEK"] = e.detail.value.PERIODWEEK;
    datas["WEEK_BEGINDATE"] = e.detail.value.WEEK_BEGINDATE;
    datas["WEEK_ENDDATE"] = e.detail.value.WEEK_ENDDATE;

    var canSubmit = true;
    var GSHJ = 0;
    canSubmit = this.checkHourData(e)
    //从表数据
    for (var i = 0; i < size; i++) {
      var day1 = i + "day1";
      var day2 = i + "day2";
      var day3 = i + "day3";
      var day4 = i + "day4";
      var day5 = i + "day5";
      var day6 = i + "day6";
      var day7 = i + "day7";
      var task_status = "task_status" + i;
      var taskname = "TASK_NAME" + i;
      var dataMap1 = new Map();
      var data1 = new Map()

      var zy = e.detail.value[day1] == '' ? "0" : e.detail.value[day1];
      var ze = e.detail.value[day2] == '' ? "0" : e.detail.value[day2];
      var zs = e.detail.value[day3] == '' ? "0" : e.detail.value[day3];
      var zsi = e.detail.value[day4] == '' ? "0" : e.detail.value[day4];
      var zw = e.detail.value[day5] == '' ? "0" : e.detail.value[day5];
      var zl = e.detail.value[day6] == '' ? "0" : e.detail.value[day6];
      var zq = e.detail.value[day7] == '' ? "0" : e.detail.value[day7];
      console.log("zy" + zy + "ze" + ze + "zs" + zs + "zsi" + zsi + "zw" + zw + "zl" + zl + "zq" + zq)
      var gshj = parseFloat(zy) + parseFloat(ze) + parseFloat(zs) + parseFloat(zsi) + parseFloat(zw) + parseFloat(zl) + parseFloat(zq);
      GSHJ = GSHJ + gshj;
      // PHASE_ID =,  DEPT_ID = 1005,  TSRPT_ID = 1282, TASKPKG_ID = 90, 
      data1["SUM_HOUR"] = gshj;

      if (!this.data.input[1]) {
        data1["MON_HOUR"] = zy;
      }
      if (!this.data.input[2]) {
        data1["TUE_HOUR"] = ze;
      }
      if (!this.data.input[3]) {
        data1["WED_HOUR"] = zs;
      }
      if (!this.data.input[4]) {
        data1["THU_HOUR"] = zsi;
      }
      if (!this.data.input[5]) {
        data1["FRI_HOUR"] = zw;
      }
      if (!this.data.input[6]) {
        data1["SAT_HOUR"] = zl;
      }
      if (!this.data.input[0]) {
        data1["SUN_HOUR"] = zq;
      }







      if (this.data.taskChoiceData[i][0] == -1 || this.data.taskChoiceData[i][2] == -1) {
        canSubmit = false;
        uiutil.Toast('请选择工作任务');
      } else if (e.detail.value[taskname].length === 0) {
        canSubmit = false;
        uiutil.Toast('请填写工作任务说明');

      } else {
        data1["TASK_NAME"] = e.detail.value[taskname];
        data1["TASK_STATUS"] = e.detail.value[task_status];
        data1["PERIODWEEK"] = e.detail.value.PERIODWEEK;
        data1["PERIODYEAR"] = e.detail.value.PERIODYEAR;
        data1["SYSCREATORID"] = getApp().globalData.userInfo.USERID;
        data1["SYSDEPTID"] = getApp().globalData.userInfo.DEPARTMENTID;
        data1["SUITUNIT"] = "HZZC";
        data1["WEEK_BEGINDATE"] = e.detail.value.WEEK_BEGINDATE;
        data1["WEEK_ENDDATE"] = e.detail.value.WEEK_ENDDATE;
        data1["DEPT_ID"] = getApp().globalData.userInfo.DEPARTMENTID;
        data1["USER_ID"] = getApp().globalData.userInfo.USERID;
        data1["USER_NAME"] = getApp().globalData.userInfo.USERNAME;
        console.log("hahah" + this.data.taskChoiceData[i][0])
        if (this.data.taskChoiceData[i][0] == -1 || this.data.taskChoiceData[i][2] == -1) {
          uiutil.Toast('请填写工作任务说明');
          canSubmit = false;
        }
        data1["PROJECT_ID"] = this.data.taskData[this.data.taskChoiceData[i][0]].PROJECT_ID;
        data1["TASKPKG_ID"] = this.data.taskData[this.data.taskChoiceData[i][0]].phaseEntities[this.data.taskChoiceData[i][1]].projectTaskEntities[this.data.taskChoiceData[i][2]].TASKPKG_ID;

        data1["AUDIT_STATUS"] = status;
        dataMap1["ZCCM_PJ_TS_TASK"] = data1;
        dataList.push(dataMap1);
      }

    }
    datas["GSHJ"] = GSHJ;
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "addSave";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = "";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "ZCCM_PJ_TS_TASK";
    parametersMap["MASTERFIELD"] = "tsrpt_id";
    parametersMap["DETAILFIELD"] = "tsrpt_id";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";
    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "insert";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    console.log(json)
    if (canSubmit) {
      httputil.post({
        url: app.globalData.commonaction,
        data: json,
        success: function (res) {
          uiutil.Toast('操作成功!');
          wx.navigateBack({
            delta: -1
          });
        }
      })
    } else {
      // uiutil.Toast('请检查填写数据');
    }

  },
  getOneWeekData: function () {

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
  ,
  searchLastPJReporting: function () {//查询最后一条工时报告记录
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();
    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = " USER_ID='" + app.globalData.userInfo.USERID + "'";
    parametersMap["ORDERSQL"] = "TSRPT_ID desc";
    parametersMap["MASTERTABLE"] = "ZCCM_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        console.log("最后一条记录" + res)
        var i = 0;
        if (res.length > 0) {
          i = res[0].PERIODWEEK;
        }
        that.setWeekIndex(i)
        // that.setData({
        //   WeekTimeIndex: i
        // })
      }
    })
  }

  , getSpecialDate: function (date1, date2) {//查询特殊日子
    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();
    //主表数据
    var dataMap = new Map();
    var datas = new Map();
    dataMap["V_JFW_BASE_SPECIALDAY"] = datas;
    dataList.push(dataMap);
    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;
    parametersMap["METHOD"] = "search";//updateSave,delete,search
    parametersMap["MENUAPP"] = "EMARK_APP";
    parametersMap["WHERESQL"] = " to_date(specialdate,'yyyy-mm-dd')>=to_date('" + date1 + "','yyyy-mm-dd') and  to_date(specialdate,'yyyy-mm-dd')<=to_date('" + date2 + "','yyyy-mm-dd')";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "V_JFW_BASE_SPECIALDAY";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        var inputs = [true, false, false, false, false, false, true]
        for (var i = 0; i < inputs.length; i++) {
          for (var j = 0; j < res.length; j++) {
            var k = new Date(res[j].SPECIALDATE).getDay();
            inputs[k] = !inputs[k]
          }
        }
        console.log(inputs)
        that.setData({
          input: inputs
        })
      }
    })
  }
  , setWeekIndex: function (index) {
    this.setData({
      WeekTimeIndex: index
    })
    this.getSpecialDate(this.data.WeekBeginData[index], this.data.WeekEndData[index])
  },
  scrollToBottom: function () {//页面滑动底部
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  checkHourData: function (e) {
    var input = this.data.input;//[true, false, false, false, false, false, true]
    var size = this.data.ManHourList.length;
    var gshj_1 = 0;
    var gshj_2 = 0;
    var gshj_3 = 0;
    var gshj_4 = 0;
    var gshj_5 = 0;
    var gshj_6 = 0;
    var gshj_0 = 0;
    for (var i = 0; i < size; i++) {
      var day1 = i + "day1";
      var day2 = i + "day2";
      var day3 = i + "day3";
      var day4 = i + "day4";
      var day5 = i + "day5";
      var day6 = i + "day6";
      var day7 = i + "day7";

      var zy = e.detail.value[day1] == '' ? "0" : e.detail.value[day1];
      var ze = e.detail.value[day2] == '' ? "0" : e.detail.value[day2];
      var zs = e.detail.value[day3] == '' ? "0" : e.detail.value[day3];
      var zsi = e.detail.value[day4] == '' ? "0" : e.detail.value[day4];
      var zw = e.detail.value[day5] == '' ? "0" : e.detail.value[day5];
      var zl = e.detail.value[day6] == '' ? "0" : e.detail.value[day6];
      var zq = e.detail.value[day7] == '' ? "0" : e.detail.value[day7];

      gshj_1 = parseFloat(zy) + gshj_1;
      gshj_2 = gshj_2 + parseFloat(ze);
      gshj_3 = gshj_3 + parseFloat(zs);
      gshj_4 = gshj_4 + parseFloat(zsi);
      gshj_5 = gshj_5 + parseFloat(zw);
      gshj_6 = gshj_6 + parseFloat(zl);
      gshj_0 = gshj_0 + parseFloat(zq);
    }
    if (!input[1]) {
      if (gshj_1 > 7.5) {
        uiutil.Toast('周一工时大于7.5小时');
        return false;
      } else if (gshj_1 < 7.5) {
        uiutil.Toast('周一工时小于7.5小时');
        return false;
      }
    }
    if (!input[2]) {
      if (gshj_2 > 7.5) {
        uiutil.Toast('周二工时大于7.5小时');
        return false;
      } else if (gshj_2 < 7.5) {
        uiutil.Toast('周二工时小于7.5小时');
        return false;
      }
    }
    if (!input[3]) {
      if (gshj_3 > 7.5) {
        uiutil.Toast('周三工时大于7.5小时');
        return false;
      } else if (gshj_3 < 7.5) {
        uiutil.Toast('周三工时小于7.5小时');
        return false;
      }

    }
    if (!input[4]) {
      if (gshj_4 > 7.5) {
        uiutil.Toast('周四工时大于7.5小时');
        return false;
      } else if (gshj_4 < 7.5) {
        uiutil.Toast('周四工时小于7.5小时');
        return false;
      }

    }
    if (!input[5]) {
      if (gshj_5 > 7.5) {
        uiutil.Toast('周五工时大于7.5小时');
        return false;
      } else if (gshj_5 < 7.5) {
        uiutil.Toast('周五工时小于7.5小时');
        return false;
      }

    }
    if (!input[6]) {
      if (gshj_6 > 7.5) {
        uiutil.Toast('周六工时大于7.5小时');
        return false;
      } else if (gshj_6 < 7.5) {
        uiutil.Toast('周六工时小于7.5小时');
        return false;
      }

    }
    if (!input[0]) {
      if (gshj_0 > 7.5) {
        uiutil.Toast('周日工时大于7.5小时');
        return false;
      } else if (gshj_0 < 7.5) {
        uiutil.Toast('周日工时小于7.5小时');
        return false;
      }

    }
    return true;
  }
  ,
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
    parametersMap["WHERESQL"] = "TSRPT_ID = (select TSRPT_ID from V_APP_PJ_TS_REPORTING where PERIODYEAR=" + this.data.YearData[this.data.YearIndex].PERIODCODE + " and PERIODWEEK=" + this.data.WeekData[this.data.WeekTimeIndex] + " and user_id ='" + app.globalData.userInfo.USERID + "')";
    parametersMap["ORDERSQL"] = "";
    parametersMap["MASTERTABLE"] = "V_APP_PJ_TASK";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "-1";
    // parametersMap["TSRPT_ID"] = that.data.Manhour.TSRPT_ID;

    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "select";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);

    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        that.setData({
          TaskDatas: res,
        })
        if (res.length > 0) {
          that.setData({
            hasInput: true,
          })
          // uiutil.Toast(that.data.WeekData[that.data.WeekTimeIndex] + '周工时已填');
        }else{
          that.setData({
            hasInput: false,
          })
        }
      }
    })
  }
})