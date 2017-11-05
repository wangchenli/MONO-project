import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import Base64 from '@/assets/js/base64.js'
import vuexI18n from 'vuex-i18n';

// 作为vue的插件使用 整个应用要取vuex中的状态
Vue.use(Vuex)

let store = new Vuex.Store({
  modules: {  
      i18n: vuexI18n.store  
  },
  state: {
    alertTipShow:false, // 弹框的显示和隐藏
    tipPosition:'default', // 提示信息的位置（定位）
    showPositionValue:false, // 提示信息的显示和隐藏
    bookList:[],
    searchVal:"",
    navData:{},//记录点击导航跳转页面获取到的数据
    dynamicState: [],//存动态的数组
    SecondData: '',
    ActionBarId: null, // 点赞id
    CollectId: null, //收藏id
    comunityData: '',//comunity页面中的数据
    findData: '',  //find页面中存放的数据
    listdata: [], // 下拉更新数据存放数组
    currentListItemId: null,  // 上拉更多的数据存放数组
    audioDom:'', //音乐播放元素
    btnDom:'', // 当前小播放条的播放按钮
    progressDom:'', // 当前小播放条的进度条元素
    progerssWidth:0, // 当前小播放条的进度条的宽度，大播放条的进度条宽度和这个保持一致
    musicList:[/* {
      "name":"笑忘书",
      "img":"https://y.gtimg.cn/music/photo_new/T002R150x150M0000001WFLC3cqaQR.jpg?max_age=2592000",
      "songid":"14361",
      "singer":"王菲"
    } */], // 音乐的播放列表
    lyricData:{},
    musicIndex:0, // 把请求到的音乐添加到listdata里对应的音乐数据时使用，为了不重复添加，所以依次添加
    AllMusicList:[], // 所有音乐
    playState:false, //播放按钮状态
    mPlayerScreen:false, // 控制音乐播放器页的显示和隐藏，true显示，false隐藏
    currentTime:0,//音乐播放进度
    // duration:0,//音乐长度
    listState:false,//播放列表状态
    isLoadingShow:false,//是否显示loading
		musicDuration: 0,	// 音乐的总播放时长
    currentMusicIndex: 0, // 当前音乐的index索引
    latalyListShow:false, // 控制播放列表的显示和隐藏
    musicLoadFinish:false,
    currentSong:null,
    currentLyric:'',
    allPlayBtn:null,
    pullLoading:false // 是否下拉刷新
  },
  getters,
  mutations: {
    changeToastTipPosition(state,payload){
      state.tipPosition = payload
    },
    changeToastShowPositionValue(state,payload){
      state.showPositionValue = payload
    },
    changeAlertTipShow(state,payload){
      state.alertTipShow = payload      
    },
    changeSearchVal(state,payload){//记录搜索的内容
      state.searchVal = payload
    },
    changeIco(state,payload){
      payload.attentioned = true;
    },
    changeNavData(state,payload){
      state.navData = payload
      if(payload.data){
        state.bookList = payload.data.list.books
      }      
    },
    // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler),这个回调函数就是我们实际进行状态更改的地方
    // 定义事件类型changeMusicList，绑定回调函数，回调函数不会立即执行，
    // 当触发一个类型为 changeMusicList 的 mutation 时，调用此函数
    renderSecondData(state, payload){
      state.SecondData = payload
    },
    changethumbsUp(state, payload){//改变点赞的状态，有没有+1
      state.listdata[payload.i].actionBar.fabulous = payload.a
    },
    changeHeartState(state, payload){ //改变heart的状态   
      state.dynamicState.unshift(payload)  
      state.ActionBarId = payload.litleId         
      state.listdata.forEach((item) => {
        if(item.thisItem.litleId == payload.litleId){
          item.thisItem.actionBar.thumbsUp = !item.thisItem.actionBar.thumbsUp;
          if(item.thisItem.actionBar.thumbsUp === true){
            item.thisItem.actionBar.fabulous++
          }else{
            item.thisItem.actionBar.fabulous--
          }
        }
      })
    },
    changeHeartStateSecond(state,payload){      
      state.SecondData.list.forEach((item,index)=>{
        if(item.litleId == payload){
          item.actionBar.thumbsUp = !item.actionBar.thumbsUp;
          if(item.actionBar.thumbsUp === true){
            item.actionBar.fabulous++
          }else{
            item.actionBar.fabulous--
          }
        }
      })
    },
    changeCollectState(state, payload){ //改变收藏的状态
      state.CollectId = payload.litleId         
      state.listdata.forEach((item) => {
        if(item.thisItem.litleId == payload.litleId){
          item.thisItem.actionBar.isCollect = !item.thisItem.actionBar.isCollect;
        }
      })
    },
    changeCollectStateSecond(state,payload){
      state.SecondData.list.forEach((item,index)=>{
        if(item.litleId == payload){
          item.actionBar.isCollect = !item.actionBar.isCollect;
        }
      })
    },
    changeComunityData(state, payload){
      state.comunityData = payload
    },
    changeFindData(state, payload){  //find页面的数据
      state.findData = payload
    },
    changeListData(state,payload){
      for(var i=0; i<state.listdata.length; i++){
        if(state.listdata[i].id === payload[0].id){
          return
        }
      }
      state.listdata.push(...payload)      
      state.listdata.forEach((item,index)=>{
        Vue.set(item,'isPlay',false)
      }) // 给每条数据加一个isPlay状态，控制音乐的播放和暂停           
    },
    currentListItemId(state,payload){
      state.currentListItemId = payload
    },
    setListDataMusic(state,payload){
      state.listdata.forEach(function(item1){                        
        if(item1.type === '音乐'){
          if(!item1.music){ // 如果item1.music不存在，走到这里
            // 这里遇到一个问题，Vue.set()的问题
            Vue.set(item1,'music',[])
            // item1.music = []
          }
          if(item1.music.includes((state.AllMusicList[state.musicIndex]))){
            return
          }
          item1.music.push(state.AllMusicList[state.musicIndex]);                                     
          state.musicIndex++;
        }
      })
    },
    RefreshListData(state,payload){
      // state.listdata = payload;
      let arr = []
      state.listdata = payload.concat(arr)
      state.listdata.forEach((item,index)=>{
        Vue.set(item,'isPlay',false)
      }) // 给每条数据加一个isPlay状态，控制音乐的播放和暂停     
    },
    changeListIsplay(state,payload){
      // state.listdata[payload.index].isPlay = payload.isPlay;
      state.listdata.forEach((item)=>{
        if(item.id === payload.index ){
          item.isPlay = payload.isPlay;
        }
      })
    },
    sendAudio(state,obj){
      state.audioDom = obj;      
    },
    pause(state){
      state.playState=false;
      state.audioDom.pause();
      state.listdata.forEach((item,index)=>{
        Vue.set(item,'isPlay',false)
      }) // 使数据里的isPlay全部改为false
      
    },
    play(state){
      state.playState=true; // 公共状态设置为true（大播放器要根据它决定是播放还是暂停）
      state.audioDom.play() // 公共的audio元素开始播放
      // 先使所有的小播放条的播放按钮显示“fa-play”，同时使它们对应的数据里的isPlay改为false
      state.listdata.forEach((item,index)=>{
        Vue.set(item,'isPlay',false)
      }) // 使数据里的isPlay改为false
    },
    setMPlayerScreen(state,flag){
      state.mPlayerScreen = flag;
    },
    setLatalyListShow(state,flag){
      state.latalyListShow = flag;
    },
    // 进度条元素
    sendProgressDom(state,obj){
      state.progressDom = obj;
    },
    sendMusic(state,obj){
      if(!state.musicList.includes(obj)){
        state.musicList.push(obj); // 歌曲信息放入播放列表
      } 
      state.currentMusicIndex=state.musicList.indexOf(obj);
      let oldSong = state.currentSong     
      state.currentSong = state.musicList[state.currentMusicIndex] // 当前播放的歌曲默认是最新添加到播放列表里的那首
      if(state.currentSong == oldSong) return
      state.audioDom.src= 'http://'+ state.currentSong.url[obj.data[0].id]; // 根据传进来的歌曲信息里的id拿到歌曲地址
    },
    setMusicDuration (state, obj) {
      state.musicDuration = obj.duration
    },
    // 设置音乐是否正在加载
		setMusicLoadStart (state, obj) {
      state.musicLoadStart = obj.isloadstart
    },
    setCurrentTime (state, time) {
			state.currentTime = time
    },
    setProgressWidth (state) {
			state.progressDom.style.width = `calc(${(this.getters.getCurrentTime / this.getters.getMusicDuration * 100).toFixed(2)}%)`; 
    },
    // 通过JSONP拿到数据后，设置播放列表，因为大播放器要拿到别的组件添加的音乐，所以公共的播放列表放在公共的仓库管理
    setAllMusicList(state,payload){
      state.AllMusicList.push(payload);
    },
    setCurrentMusicIndex(state,index){
      // 修改当前音乐的索引值
      state.currentMusicIndex = index
      // 当前播放的音乐根据新的索引值改变
      state.currentSong = state.musicList[state.currentMusicIndex]
      // 播放当前音乐
      state.audioDom.src= 'http://'+ state.musicList[state.currentMusicIndex].url[state.musicList[state.currentMusicIndex].data[0].id]; // 根据传进来的歌曲信息里的id拿到歌曲地址
      // 播放状态设为true
      state.playState = true;
    },
    // 设置请求到的所有歌曲的歌词
    setLyric(state,obj){
      state.lyricData[obj.id] = obj.lyric
    },
    // 设置当前播放的歌词
    setCurrentLyric(state,payload){
      state.currentLyric = payload
    },
    setPullLoading(state,payload){
      state.pullLoading = payload
    }
  },
  actions:{
    sendAudio({commit,state},obj){//添加音乐播放元素，在App.vue里在模板编译完成后把audio元素发送给action
      commit('sendAudio',obj)
    },
    // 
    sendAudio({commit,state},obj){//添加音乐播放元素，在App.vue里在模板编译完成后把audio元素发送给action
      commit('sendAudio',obj)
    },
    set_MusicDuration ({commit}, obj) {
			commit('setMusicDuration', obj)
    }
  }
})
export default store
