App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */

  onLaunch: function () {  
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo2 = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    wx.showToast({
      title: msg,
    })
  },
  /**
   * 页面不存在
   */
  onPageNotFound: function(res){
    wx.redirectTo({
      url: "pages/error/pagenotfound/error404"
    })
  },
  /* 获取微信个人信息 */
  getUserInfo: function (cb) {
    console.log('执行了')
    var that = this
    if (this.globalData.userInfo2) {
      typeof cb == "function" && cb(this.globalData.userInfo2)
    } else {
      console.log('执行了')
      //调用登陆接口
      // wx.getSetting({
      //   success(res) {
      //     if (!res.authSetting['scope.userInfo']) {
      //       wx.authorize({
      //         scope: 'scope.userInfo',
      //         success() {
      //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      //           wx.getUserInfo({
      //             success: function (res) {
      //               that.globalData.userInfo2 = res.userInfo
      //               console.log(res.userInfo)
      //               typeof cb == "function" && cb(that.globalData.userInfo2)
      //             },
      //             fail: function (res) {
      //               console.log(res)
      //             }
      //           })
      //         },
      //         fail:function(res){
      //           console.log(res)
      //         }
      //       })
      //     }
      //   }
      // })
 
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo2 = res.userInfo
              console.log(res.userInfo)
              typeof cb == "function" && cb(that.globalData.userInfo2)
            }
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    }

  },
  /**
   * 全局变量
   */
  globalData: {
    userInfo: null,
    userInfo2:null,
    cookie: '',
    loginurl: "do/app/login",//登录
    commonaction: "do/app/uiaction",//通用操作接口
    APP_BIZ_OPERATION: 'com.nci.app.zccmp.ManHour',//通用类
    updateSave: 'updateSave',
    Delete: 'delete',
    search: 'search',
    addSave: 'addSave',
    debug:true,
    worklistneedrefresh:true
  }
})