//获取
function getWeekNumber() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth()
  var days = now.getDate();
  // 那一天是那一年中的第多少天
  for (var i = 0; i < month; i++) {
    days += getMonthDays(year, i);
  }
  // 那一年第一天是星期几
  var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
  var week = null;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / 7);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7) + 1;
  }
  
  return week;
}

function getDateWeekNumber(now) {
  year = now.getFullYear(), month = now.getMonth(), days = now.getDate();
  // 那一天是那一年中的第多少天
  for (var i = 0; i < month; i++) {
    days += getMonthDays(year, i);
  }
  // 那一年第一天是星期几
  var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
  var week = null;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / 7);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7) + 1;
  }
  return week;
}

/**
 * 判断年份是否为润年
 * 
 * @param {Number}
 *            year
 */
function isLeapYear(year) {
  return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

/**
 * 获取某一年份的某一月份的天数
 * 
 */
function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

// 获取某年的第一天
function GetFirstWeekBegDay(year) {
  var tempdate = new Date(year, 0, 1);
  var temp = tempdate.getDay();
  if (temp == 1) {
    return tempdate;
  }
  if (temp == 0) {
    temp = 7;
  }
  tempdate = tempdate.setDate(tempdate.getDate() + (1 - temp));
  return new Date(tempdate);
}
// 获取某年某周的开始日期
function getBeginDateOfWeek(paraYear, weekIndex) {
  var firstDay = GetFirstWeekBegDay(paraYear);
  // 7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
  var time = (weekIndex - 1) * 7 * 24 * 3600000;
  var beginDay = firstDay;
  // 为日期对象 date 重新设置成时间 time
  beginDay.setTime(firstDay.valueOf() + time);
  return formatDate(beginDay);
}

　　// 获取某年某周的结束日期
function getEndDateOfWeek(paraYear, weekIndex) {
  var firstDay = GetFirstWeekBegDay(paraYear);
  // 7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
  var time = (weekIndex - 1) * 7 * 24 * 3600000;
  var weekTime = 6 * 24 * 3600000;
  var endDay = firstDay;
  // 为日期对象 date 重新设置成时间 time
  endDay.setTime(firstDay.valueOf() + weekTime + time);
  return formatDate(endDay);
}
// 格式化日期：yyyy-MM-dd

function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}
function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;
  // return d.getFullYear()+'-'+m+'-'+d.getDate();
  return m + '-' + d.getDate();
} 
/**
 * 获取指定年份周列表数据
 */
function getWeekNumArray(yearcode) {
  var year = parseInt(yearcode);
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
  return weekData
  // this.setData({
  //   WeekData: weekData,//周次数据
  //   WeekBeginData: weekBeginData,
  //   WeekEndData: weekEndData
  // })
}
module.exports = {
  getWeekNumber: getWeekNumber,
  getBeginDateOfWeek:getBeginDateOfWeek,
  getEndDateOfWeek: getEndDateOfWeek,
  getWeekNumArray: getWeekNumArray
};
