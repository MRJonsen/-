// const Toast = require('../ui/zanui/toast/toast.js');
function Toast(msg) {
  if(msg==null){
    msg = '未知错误'
  }
  wx.showToast({
    title: msg,
    icon: "none",
    duration: 2000,
    mask: true,
    fail:function(){
      wx.showToast({
        title: msg,
      })
    }
  })
}

function showLoading(msg){
  // console.error(msg)
  // Toast({
  //   message: msg,
  //   selector: '#zan-toast-test',
  //   image: 'https://b.yzcdn.cn/v2/image/dashboard/secured_transaction/suc_green@2x.png'
  // });
    wx.showLoading({
      title: msg,
    })
}

function hideLoading(){
  wx.hideLoading();
}
module.exports = {
  Toast: Toast,
  showLoading: showLoading,
  hideLoading: hideLoading
}