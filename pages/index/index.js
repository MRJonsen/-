//index.js 脚本逻辑文件
//获取应用实例
const app = getApp()
const updateManager = wx.getUpdateManager();
Page({

  data: {
    gridList: [
      { enName: '../../images/manhour_list.png', zhName: '工时管理', url: "../worktimelist/worktimelist" }
      // ,{ enName: '../../images/manhour_icon.png', zhName: '工时填报', url: "../worktimeadd/worktimeadd" }
      , { enName: '../../images/index_setting.png', zhName: '设置', url: "../setting/setting" }
      // , { enName: '../../images/index_setting.png', zhName: '设置', url: "../workhour/workhour" }
    ]
  },
  onLoad: function (cb) {
    var that = this
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.getUserInfo()
    }
    typeof cb == 'function' && cb()
  },
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function (res) {
        if (res.data == "") {
          that.setData({
            skin: config.skinList[0].imgUrl
          })
        } else {
          that.setData({
            skin: res.data
          })
        }
      }
    })
  },
  onReady:function(){
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("更新" + res.hasUpdate)
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      })
    });
  },
  onPullDownRefresh: function () {
    this.onLoad(function () {
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function (e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../" + data.url + '/' + data.url
    })
  }
})
