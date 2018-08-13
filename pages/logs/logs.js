Page({
  data: {
    dataModel:{name:"",input:""},
    lists: [],
  },
  addList: function () {
    var lists = this.data.lists;
    var newData = this.data.dataModel;
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      lists: lists,
    })
  },
  delList: function () {
    var lists = this.data.lists;
    lists.pop();      //实质是删除lists数组内容，使for循环少一次
    this.setData({
      lists: lists,
    })
  },
  bindKeyInput:function(e){
      console.log(e)
      var data = this.data.lists[e.currentTarget.id];
      data.input = e.detail.value;
      this.setData({
        lists: this.data.lists
      })
  },
  bindKeyInput2: function (e) {
    console.log(e)
    var data = this.data.lists[e.currentTarget.id];
    data.name = e.detail.value;
    this.setData({
        lists: this.data.lists
    })
  }
})
