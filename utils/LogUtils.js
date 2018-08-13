const app = getApp();
function Log(e) {
  if (app.globalData.debug){
    console.log(e)
  }
}

module.exports ={
    log:Log
}