// pages/workhour/workhour.js
const WorkBean = require('../../utils/Beans.js');
const log = require('../../utils/LogUtils.js');
const dateutil = require('../../utils/DateUtil.js');
const httputil = require('../../utils/HttpUtils.js')
const uiutil = require('../../utils/UiUtils.js')
const stringutil = require('../../utils/String.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    YearData: [],//年份数据
    WeekData: [],//周次数据
    taskstatus: ["未开始", "进行中", "已完成"],
    workhour: { PERIODYEAR: null, PERIODWEEK: null, WEEK_BEGINDATE: null, WEEK_ENDDATE: null, YearIndex: 0, WeekTimeIndex: 0, STATUS: 0, TSRPT_ID: null },
    list: [],//工作任务相的数据
    input: [true, false, false, false, false, false, true],//控制周填报  数据显隐 周日～周六

    IsData: false,//判断是否是从列表直接点进来
    condition: false,
    taskData: [],//任务数据
    taskDataStatus: true,
    taskIndex: [0, 0, 0],
    taskChoiceIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.manhour != undefined) {
      // { "DEPT_ID":1005, "STATUS":"0", "PERIODWEEK":29, "TSRPT_ID":2562, "ORGNAME":"互联网开发部", "USER_ID":4008, "USER_NAME":"陈斌", "WEEK_BEGINDATE":"2018-07-16", "PERIODYEAR":2018, "WEEK_ENDDATE":"2018-07-22", "GSHJ":0 }
     var manhour =  JSON.parse(options.manhour)
      this.data.IsData = true;
      this.data.workhour.PERIODYEAR = manhour.PERIODYEAR;
      this.data.workhour.PERIODWEEK = manhour.PERIODWEEK;
      this.data.workhour.WEEK_BEGINDATE = manhour.WEEK_BEGINDATE;
      this.data.workhour.WEEK_ENDDATE = manhour.WEEK_ENDDATE;
      this.data.workhour.TSRPT_ID = manhour.TSRPT_ID;
      this.data.workhour.WeekTimeIndex = manhour.PERIODWEEK-1;
      console.log(this.data.workhour)
      this.setData({
        workhour: this.data.workhour
      })
      console.log(options.manhour)
    } else {
      console.log("options.manhour")
    }
    this.getYearData();
    // this.setData({
    //   Manhour: JSON.parse(options.manhour)
    // })
    this.getTaskData();
    this.addItem();
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
  /**
   * 更新工作相数据
   */
  updateListData: function () {
    this.setData({
      list: this.data.list
    })
  },
  /**
   * 更新周次年份数据
   */
  updateManhourData: function () {
    this.setData({
      workhour: this.data.workhour
    })
    this.getBeginDateAndEndDate();
  }
  ,
  /**
   * 添加任务条目
   */
  addItem: function () {
    var list = this.data.list;
    var newData = WorkBean.createWorkHourBean();
    log.log(newData)
    list.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.updateListData();
    this.scrollToBottom();
  },
  /**
   * 删除任务条目
   */
  delItem: function (e) {
    log.log(e)
    var list = this.data.list;
    if (list.length <= 1) {
      console.log("工作任务项" + list.length)
      return;
    };
    var i = parseInt(e.currentTarget.id);
    list.splice(i, 1);
    this.updateListData();
  },
  /**
   * 监听填报工作任务工时填报变化
   */
  dayInput: function (e) {
    log.log(e.currentTarget.id + "," + e.currentTarget.dataset.name)
    var data = this.data.list[e.currentTarget.id];
    var name = e.currentTarget.dataset.name;
    data[name] = e.detail.value
    this.updateListData();
  },
  /**
   * 工作任务完成状态选择
   */
  bindTaskStatusChange: function (e) {
    log.log(e.currentTarget.id + "," + e.detail.value)
    this.data.list[e.currentTarget.id].TASK_STATUS = e.detail.value;
    this.updateListData();
  },
  /**
   * 任务名称
   */
  taskNameInput: function (e) {
    this.data.list[e.currentTarget.id].TASK_NAME = e.detail.value;
    this.updateListData();
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
        that.setData({
          YearData: res,
        })
        if (res[0].PERIODCODE != null && res[0] != '') {
          if (!that.data.IsData) {
            that.getYearWeekNum(res[0].PERIODCODE)
            that.searchLastPJReporting();
          }else{
            that.getYearWeekNum(that.data.workhour.PERIODYEAR);
            that.manHourDatas();
          }
        }
      }
    })
  },

  /**
   * 计算年份的周次数 并更年份选择器数据
   */
  getYearWeekNum: function (year) {
    this.setData({
      WeekData: dateutil.getWeekNumArray(year)
    })
    this.setChoiceYearData(this.data.YearData[this.data.workhour.YearIndex].PERIODCODE);
    this.setChoiceWeekData(this.data.WeekData[this.data.workhour.WeekTimeIndex]);
    this.updateManhourData();
  },
  setChoiceYearData: function (periodeyear) {
    this.data.workhour.PERIODYEAR = periodeyear;
  },
  setChoiceWeekData: function (periodeweek) {
    this.data.workhour.PERIODWEEK = periodeweek;
  },
  /**
   * 年份选择变化
   */
  bindYearPickerChange: function (e) {
    log.log("年份变化" + e.detail.value)
    this.getYearWeekNum(this.data.YearData[e.detail.value].PERIODCODE)//初始化周数据
    this.data.workhour.YearIndex = e.detail.value
    this.data.workhour.PERIODYEAR = this.data.YearData[e.detail.value].PERIODCODE
    this.updateManhourData();
    this.manHourDatas();
  },
  /**
   * 周次选择变化
   */
  bindWeekPickerChange: function (e) {
    log.log("周次变化" + e.detail.value)
    this.data.workhour.WeekTimeIndex = e.detail.value
    this.data.workhour.PERIODWEEK = this.data.WeekData[e.detail.value]
    this.updateManhourData();
    this.manHourDatas()
  },
  /**
   * 更新周次起止日期
   */
  getBeginDateAndEndDate: function () {
    var year = this.data.workhour.PERIODYEAR;
    var week = this.data.workhour.PERIODWEEK;
    log.log("获取周次起止" + year + "," + week)
    this.data.workhour.WEEK_BEGINDATE = dateutil.getBeginDateOfWeek(year, week)
    this.data.workhour.WEEK_ENDDATE = dateutil.getEndDateOfWeek(year, week)
    this.setData({
      workhour: this.data.workhour
    })
    this.getSpecialDate(dateutil.getBeginDateOfWeek(year, week), dateutil.getEndDateOfWeek(year, week));
  },
  scrollToBottom: function () {//页面滑动底部
    wx.createSelectorQuery().select('#s_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },
  /**
   * 查询特殊日子并初始化输入框
   */
  getSpecialDate: function (date1, date2) {//查询特殊日子
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
        log.log("特殊日子" + inputs)
        that.setData({
          input: inputs
        })
      }
    })
  },
  /**
   * 查询最后一条工时报告记录
   */
  searchLastPJReporting: function () {
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
    console.log(json);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        console.log("最后一条工时记录" + res)
        var i = 0;
        if (res.length > 0) {
          i = res[0].PERIODWEEK;
        }
        that.data.workhour.WeekTimeIndex = i;
        that.data.workhour.PERIODWEEK = i + 1;
        that.updateManhourData();
      }
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
      fail: function (res) {
        that.setData({
          taskDataStatus: false
        })
      }
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
      },
      fail: function (res) {
        that.setData({
          taskDataStatus: false
        })
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
        })
      },
      fail: function (res) {
        that.setData({
          taskDataStatus: false
        })

      },
    })
  },
  /**
   * 操作选任务
   */
  openThree: function (res) {
    log.log("打开工作任务选择id" + JSON.stringify(res.target.id))
    if (!this.data.taskDataStatus) {
      this.getTaskData();
      this.data.taskDataStatus = true;
    } else {
      var b = !this.data.condition
      this.setData({
        condition: b,
        taskChoiceIndex: res.target.id
      })
    }

  },
  closeThree: function () {
    var b = !this.data.condition
    this.setData({
      condition: b
    })
  },
  // 关闭三
  saveThree: function () {
    log.log("baocun" + this.data.taskIndex + "," + this.data.list[this.data.taskChoiceIndex].taskIndex)
    var id = this.data.taskChoiceIndex;
    var index = this.data.taskIndex;
    this.data.list[this.data.taskChoiceIndex].PROJECT_NAME = this.data.taskData[index[0]].PROJECT_NAME;
    this.data.list[this.data.taskChoiceIndex].TASKPKG_NAME = this.data.taskData[index[0]].phaseEntities[index[1]].projectTaskEntities[index[2]].TASKPKG_NAME;
    this.data.list[this.data.taskChoiceIndex].PROJECT_ID = this.data.taskData[index[0]].phaseEntities[index[1]].projectTaskEntities[index[2]].PROJECT_ID;
    this.data.list[this.data.taskChoiceIndex].TASKPKG_ID = this.data.taskData[index[0]].phaseEntities[index[1]].projectTaskEntities[index[2]].TASKPKG_ID;
    this.setData({
      list: this.data.list,
      condition: false
    })
  },
  bindTreeChange: function (res) {
    log.log("任务选择变化" + res.detail.value);
    var i = res.detail.value[0];
    var j = 0;
    var data = this.data.taskData;
    if (data[i].phaseEntities.length > res.detail.value[1]) {
      j = res.detail.value[1];
    }
    this.setData({
      taskIndex: res.detail.value
    })
  },


  /**
   * 提交数据
   */
  commitWorkData: function (e) {//工时提交
    // log.log("提交数据" + JSON.stringify(e))
    var list = this.data.list;
    var workhour = this.data.workhour;
    var status = 0;
    var canSubmit = true;
    if (e.target.id == "commit") {
      status = 1;
      canSubmit = this.checkHourData()
    }


    var that = this;
    var dataList = new Array();
    var parametersMap = new Map();
    var commandMap = new Map();

    //主表数据
    var dataMap = new Map();
    var datas = new Map();

    datas["DEPT_ID"] = getApp().globalData.userInfo.DEPARTMENTID;
    datas["STATUS"] = status;
    datas["SUITUNIT"] = "HZZC";
    datas["USER_ID"] = getApp().globalData.userInfo.USERID;
    datas["USER_NAME"] = getApp().globalData.userInfo.USERNAME;
    datas["SYSCREATORID"] = getApp().globalData.userInfo.USERID;
    datas["SYSDEPTID"] = getApp().globalData.userInfo.DEPARTMENTID;
    datas["PERIODYEAR"] = workhour.PERIODYEAR;
    datas["PERIODWEEK"] = workhour.PERIODWEEK;
    datas["WEEK_BEGINDATE"] = workhour.WEEK_BEGINDATE;
    datas["WEEK_ENDDATE"] = workhour.WEEK_ENDDATE;


    var GSHJ = 0;


    //从表数据
    var size = this.data.list.length;
    for (var i = 0; i < size; i++) {
      var dataMap1 = new Map();
      var data1 = new Map()

      var zy = list[i].MON_HOUR == '' ? "0" : list[i].MON_HOUR + "";
      var ze = list[i].TUE_HOUR == '' ? "0" : list[i].TUE_HOUR + "";
      var zs = list[i].WED_HOUR == '' ? "0" : list[i].WED_HOUR + "";
      var zsi = list[i].THU_HOUR == '' ? "0" : list[i].THU_HOUR + "";
      var zw = list[i].FRI_HOUR == '' ? "0" : list[i].FRI_HOUR + "";
      var zl = list[i].SAT_HOUR == '' ? "0" : list[i].SAT_HOUR + "";
      var zq = list[i].SUN_HOUR == '' ? "0" : list[i].SUN_HOUR + "";
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

      // if (list[i].TSRPT_ID != null) {
      //   data1["TSRPT_ID"] = list[i].TSRPT_ID;
      // }
      data1["TASK_NAME"] = list[i].TASK_NAME;
      data1["TASK_STATUS"] = list[i].TASK_STATUS;
      data1["PERIODWEEK"] = workhour.PERIODWEEK;
      data1["PERIODYEAR"] = workhour.PERIODYEAR;
      data1["SYSCREATORID"] = getApp().globalData.userInfo.USERID;
      data1["SYSDEPTID"] = getApp().globalData.userInfo.DEPARTMENTID;
      data1["SUITUNIT"] = "HZZC";
      data1["WEEK_BEGINDATE"] = workhour.WEEK_BEGINDATE;
      data1["WEEK_ENDDATE"] = workhour.WEEK_ENDDATE;
      data1["DEPT_ID"] = getApp().globalData.userInfo.DEPARTMENTID;
      data1["USER_ID"] = getApp().globalData.userInfo.USERID;
      data1["USER_NAME"] = getApp().globalData.userInfo.USERNAME;

      if (list[i].PROJECT_ID != null) {
        data1["PROJECT_ID"] = list[i].PROJECT_ID;
      } else {
        uiutil.Toast('请选择项目名称');
        return
      }
      if (list[i].TASKPKG_ID != null) {
        data1["TASKPKG_ID"] = list[i].TASKPKG_ID;
      } else {
        uiutil.Toast('请选择工作任务');
        return
      }
      if (list[i].TASK_NAME == null || list[i].TASK_NAME == "") {
        uiutil.Toast('请填写任务说明');
        return
      }
      // if (list[i].TSTASK_ID!=null){
      //   data1["TSTASK_ID"] = list[i].TSTASK_ID;
      // }
      data1["AUDIT_STATUS"] = status;
      dataMap1["ZCCM_PJ_TS_TASK"] = data1;
      dataList.push(dataMap1);
    }
    datas["GSHJ"] = GSHJ + "";
    // if (list[0].TSRPT_ID != null) {
    //   datas["TSRPT_ID"] = list[0].TSRPT_ID+"";
    // }
    dataMap["ZCCM_PJ_TS_REPORTING"] = datas;
    dataList.push(dataMap);

    parametersMap["CLASSNAME"] = app.globalData.APP_BIZ_OPERATION;

    parametersMap["METHOD"] = "addSave";//updateSave,delete,search
    // if (list[0].TSRPT_ID != null){
    //   parametersMap["METHOD"] = "updateSave";
    // }
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
    console.log("提交数据" + json)
    if (canSubmit) {
      if (this.data.workhour.TSRPT_ID != null) {
        var that = this;
        var dataList = new Array();
        var parametersMap = new Map();
        var commandMap = new Map();
        var dataMap = new Map();
        var datas = new Map();
        datas["TSRPT_ID"] = this.data.workhour.TSRPT_ID;
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
        var json1 = stringutil.datasToJson(dataList, parametersMap, commandMap);
        console.log(json1)
        httputil.post({
          url: app.globalData.commonaction,
          data: json1,
          success: function (res) {
            log.log("删除成功")
            that.data.workhour.TSRPT_ID = null;
            that.setData({
              workhour: that.data.workhour
            })
            httputil.post({
              url: app.globalData.commonaction,
              data: json,
              success: function (res) {
                app.globalData.worklistneedrefresh = true;//通知列表更新
                uiutil.Toast('操作成功!');
                wx.navigateBack({
                  delta: -1
                });
              }
            })
          }
        })
      } else {
        httputil.post({
          url: app.globalData.commonaction,
          data: json,
          success: function (res) {
            uiutil.Toast('操作成功!');
            app.globalData.worklistneedrefresh = true;
            wx.navigateBack({
              delta: -1
            });
          }
        })
      }

    } else {
      // uiutil.Toast('请检查填写数据');
    }
  },
  checkHourData: function () {
    var input = this.data.input;//[true, false, false, false, false, false, true]
    var list = this.data.list;
    var size = this.data.list.length;
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

      var zy = list[i].MON_HOUR == '' ? "0" : list[i].MON_HOUR;
      var ze = list[i].TUE_HOUR == '' ? "0" : list[i].TUE_HOUR;
      var zs = list[i].WED_HOUR == '' ? "0" : list[i].WED_HOUR;
      var zsi = list[i].THU_HOUR == '' ? "0" : list[i].THU_HOUR;
      var zw = list[i].FRI_HOUR == '' ? "0" : list[i].FRI_HOUR;
      var zl = list[i].SAT_HOUR == '' ? "0" : list[i].SAT_HOUR;
      var zq = list[i].SUN_HOUR == '' ? "0" : list[i].SUN_HOUR;

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
  },
  //获取任务数据
  getTaskDatas: function (TSRPT_ID) {
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
    parametersMap["WHERESQL"] = "TSRPT_ID = '" + TSRPT_ID + "'";
    // (select TSRPT_ID from V_APP_PJ_TS_REPORTING where PERIODYEAR=" + this.data.workhour.PERIODYEAR + " and PERIODWEEK=" + this.data.workhour.PERIODWEEK + " and user_id ='" + app.globalData.userInfo.USERID + "')";
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
          list: res,
        })
      }
    })
  },
  /**
   * 获取指定周
   */
  manHourDatas: function () {//获取工时数据
    var that = this;
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
    parametersMap["WHERESQL"] = "user_id ='" + app.globalData.userInfo.USERID + "'" + "and PERIODYEAR= '" + this.data.workhour.PERIODYEAR + "' and PERIODWEEK='" + this.data.workhour.PERIODWEEK + "'";
    parametersMap["ORDERSQL"] = "periodweek DESC";
    parametersMap["MASTERTABLE"] = "V_APP_PJ_TS_REPORTING";
    parametersMap["DETAILTABLE"] = "";
    parametersMap["MASTERFIELD"] = "SEQKEY";
    parametersMap["DETAILFIELD"] = "";
    parametersMap["start"] = "0";
    parametersMap["limit"] = "1";


    commandMap["mobileapp"] = "true";
    commandMap["actionflag"] = "manhourlist";
    var json = stringutil.datasToJson(dataList, parametersMap, commandMap);
    httputil.post({
      url: app.globalData.commonaction,
      data: json,
      success: function (res) {
        if (res.length > 0) {
          that.getTaskDatas(res[0].TSRPT_ID);
          that.data.workhour.STATUS = res[0].STATUS;
          that.data.workhour.TSRPT_ID = res[0].TSRPT_ID;
          that.setData({
            workhour: that.data.workhour
          })
        } else {
          that.data.workhour.STATUS = 0;
          that.data.list = [];
          that.addItem();
          that.setData({
            workhour: that.data.workhour
          })
        }
      },
    })
  }
})