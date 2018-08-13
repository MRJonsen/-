function createWorkHourBean() {
  var object = {//工时对象
    "TASK_STATUS": 0,
    "TASK_NAME": null,
    "TSRPT_ID": null,
    "MON_HOUR": '',
    "TUE_HOUR": '',
    "WED_HOUR": '',
    "THU_HOUR":'',
    "FRI_HOUR": '',
    "SAT_HOUR": '',
    "SUN_HOUR": '',
    "SUM_HOUR": '',
    "PROJECT_NAME": null,
    "TASKPKG_NAME": null,
    "PROJECT_ID":null,
    "TASKPKG_ID":null,
  }
  return object;
}

module.exports = {
  createWorkHourBean: createWorkHourBean
};
