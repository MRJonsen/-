function datasToJson(dataList, parametersMap, commandMap) {
  var DATAS = new Array;
  for (var i = 0; i < dataList.length; i++) { //arraylist<map<String,map<string,string>>>
    var datasTemp = {};
    var dataMap = dataList[i];
    for (var key1 in dataMap) { //map<String,map<string,string>>
      var fields = new Array;
      var datas = dataMap[key1];
      for (var ss in datas) { //map<string,string>
        var tempJson = {};
        tempJson['name'] = ss;
        tempJson['value'] = datas[ss];
        fields.push(tempJson);
      }
      datasTemp['name'] = key1;
      datasTemp['fields'] = fields;
    }
    DATAS.push(datasTemp);
  }
  //参数区域
  var parameters = {};
  var para = new Array;
  for (var j in parametersMap) { //map<string,string>
    var tempJson = {};
    tempJson['name'] = j;
    tempJson['value'] = parametersMap[j];
    para.push(tempJson);
  }
  parameters['PARA'] = para;

  //commad区域
  var command = {};
  command['mobileapp'] = 'true';
  if(commandMap!=null){
    for (var k in commandMap) {
      command[k] = commandMap[k];
    }
  }
  var nci = {};
  nci['DATAS'] = DATAS;
  nci['PARAMETERS'] = parameters;
  nci['COMMAND'] = command;
  var jsonobject = {};
  jsonobject['NCI'] = nci;
  return JSON.stringify(jsonobject);
}

function responseToDatas(res,tablename){
   var data = res.data.DATAS
   var data2 = null;
   for (var key in data){
      data2 = data[key] 
   }
  return data2.datas;
}

function dateFtt(fmt, date) { //author: meizz   
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

module.exports = {
  datasToJson: datasToJson,
  responseToDatas: responseToDatas,
  dateFtt: dateFtt
}