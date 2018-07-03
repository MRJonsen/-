//index.js 脚本逻辑文件
//获取应用实例
const app = getApp()

Page({

  data: {
    gridList: [
      { enName: 'favorite', zhName: '工时列表', url: "../worktimelist/worktimelist" },
      { enName: 'favorite', zhName: '工时填报', url:"../worktimeadd/worktimeadd"},
      // {enName:'shake', zhName:'摇一摇'},
      // {enName:'gallery', zhName:'相册'},
      {enName:'setting', zhName:'设置',url:"../setting/setting"}
    ]
  },
 onLoad:function(cb){
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
  onShow:function(){
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function(res){
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
  onPullDownRefresh: function() {
    this.onLoad(function(){
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../" + data.url + '/' + data.url
    })
  }
})
