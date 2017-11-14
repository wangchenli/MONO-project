<template>
  <div>
    <div id="wrapper" ref="contentWrapper">
      <div class="content" ref="content" @touchend="touchEnd.call(this)" @touchstart="touchStart" @touchmove="touchMove">
        <div class="loading" ref="loading">
          <span v-if="gif">下拉刷新</span>
          <img v-else src="/static/img/pullLoding.gif" width="120" alt="">
        </div>
        <div class="morningtea">
          <p>
            <img src="../../assets/img/mortea.png" /> 
            <span>{{morningteaTime}}</span>
          </p>
          <p><span>MONO今日编辑精选</span></p>
          <div class="border"></div>
        </div>          
        <recommend-item 
            v-for="item,index in listdata" 
            key="index"
            :itemData="item"
            :index="index"
        >                                      
        </recommend-item>
        <div class="floading" v-if="reloading" ref="loadingFinish">
          <img src="/static/img/pullLoding.gif" width="120" alt="">
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import BScroll from "better-scroll"; // 用来滚动的
import recommendItem from "@/components/recommend-item/recommendItem";
import Jsonp from "jsonp";
import Base64 from "@/assets/js/base64.js";
import Axios from "axios";
import api from "@/api/api.js"; // 请求数据的文件
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      y: 0, // content滚动时实时的y轴坐标，y的值就是content的translateY的值
      gif: true, // 控制“下拉刷新”提示的显示和隐藏
      reloading: false // 控制底部gif的显示隐藏
    };
  },
  props: ["nav_data"],
  components: {
    recommendItem
  },
  created() {
    if (this.$store.state.listdata.length !== 0) {
      return;
    } // 如果数组里已经有数据，不再重复获取，只在发生特定行为（比如下拉刷新和上滑加载时）去获取
    this.getList(); // 第一次一上来获取数据
  },
  mounted(){
    // 把滚动区域的父盒子定高
    this.$refs.contentWrapper.style.height = window.innerHeight + 'px';
    this.nextTick(); // 每次页面渲染完毕，都重新获取better-scroll要滚动的对象
  },
  methods:{
    // 手指按下
    touchStart(ev){
      ev = ev.changedTouches[0]; // 触发当前事件的手指列表，取第一个即可
			this.iStartTouchY = ev.pageY; // 手指按下的坐标
    },
    // 手指移动
    touchMove(ev){
      ev = ev.changedTouches[0];
      let disY = ev.pageY - this.iStartTouchY;	 // 手指在屏幕上纵向移动的距离
      if(Math.abs(disY)>50){ // 纵向移动超过50，就禁止横向滑动
        this.$store.commit('setScrollXFlag',false)
      }else{ // 否则，横向正常滑动
        this.$store.commit('setScrollXFlag',true)
      }
    },
    // 手指抬起
    touchEnd(){
      let _this = this;      
      if (this.pullLoadingStart && this.y > 100) { // 
        // 下拉刷新
        this.loadingHandler();
        // 抬起手指，“下拉刷新”隐藏，gif图显示
        this.gif = false;        
        // 给content设置margin-top，使gif图不被pubnav遮挡
        this.$refs.content.style.marginTop = 0;                       
      }
      setTimeout(()=>{
        if(this.$refs.content){
          this.$refs.content.style.paddingBottom = '0rem' // 使“上滑加载”这个div隐藏
        }          
      },1000)
    },
    // 下拉刷新，把向后端请求过来的数据 截取出前几条，提交mutaion，插入listdata的前面，以使刷新出来的数据显示在最前面
    loadingHandler() {
      api.getListData().then(data => {
        let d1 = data.data.data.list.slice(0, data.data.data.list.length - 3);
        // 循环当前的listdata数组
        let refreshFlag = true;
        // 循环listdata数组，如果这次截取的数据已经存在于listdata里，说明数据已经加载完毕，没有新数据了
        for (var i = 0; i < this.$store.state.listdata.length; i++) {
          if (this.$store.state.listdata[i].id === d1[0].id) {
            refreshFlag = false;           
          }
        }
        if(!refreshFlag){ // 走到这里说明数组里有相同的数据
           // 如果数组里已经有相同的数据，就不再插入，把listdata打乱重新渲染结构，造成刷新的假象
            this.$store.commit('setRandomListData')
            // 重新初始化better-scroll要滚动的对象
            setTimeout(() => {
              this.nextTick();
            }, 1000);
            return;
        }
        // 提交RefreshListData，向listdata的前面插入新数据
        this.$store.commit("RefreshListData", d1);
        // 重新请求音乐数据，插入到新的listdata的数据里
        api.getAllMusicListData(this.getAllMusicListDataCallBack.bind(this));
        this.nextTick();
      });
    },
    // 初始化better-scroll以及一些操作的函数
    nextTick() {
      var _this = this;
      _this.$nextTick(() => {
        var content = _this.$refs.content; // 获取到滚动区域的父盒子
        setTimeout(function() {
          if (_this.myScroll) { // 如果已经有myScroll实例
            _this.myScroll.refresh(); // 重新计算 better-scroll，当 DOM 结构发生变化的时候，要调用refresh()确保滚动的效果正常
            _this.floading = false;
            _this.reloading = false; // 初始是false，“上滑加载”的gif隐藏
            _this.gif = true;
            content.style.marginTop = "-5.65217391rem"; // content负margin-top，使“下拉刷新”这个div隐藏
          } else { // 否则就初始化better-scroll
            var wrapper = document.getElementById("wrapper");
            _this.myScroll = new BScroll(wrapper, {
              startX: 0,
              startY: 0,
              click: true,
              probeType: 3
              //  probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum(默认是true) 滚动动画运行过程中实时派发 scroll 事件。
            });
            // better-scroll的scroll事件：参数：{x, y} 滚动的实时坐标; 触发时机：滚动过程中，具体时机取决于选项中的 probeType
            _this.myScroll.on("scroll", position => {
              // console.log(position,'position')
              _this.y = position.y; // 记录实时的y轴坐标，y的值就是content的translateY的值
              if (position.y > 100) { // 如果纵向滚动大于100，判定为开始下拉
                _this.pullLoadingStart = true;
              }
              // 滚动时怎么判断是否到上滑加载或者下拉刷新的时刻？
              // 上滑加载的特点：position.y为-wrapper.offsetHeight
              // -1 * position.y-30 > content.offsetHeigh - wrapper.offsetHeight
              // -1 * position.y是content向上移动的距离（正数），30是拉到底之后又向上滑动的距离。content.offsetHeigh - wrapper.offsetHeight是content超出wrapper的长度（在可视区下面藏着的内容的高度）
              if ( !_this.floading && position.y < 0 && -1 * position.y + wrapper.offsetHeight - content.offsetHeight > 30 ) {
                // 走到这里说明达到上拉加载的条件
                _this.floading = true; // 在这里设为true，之后滚动时就不走这里了
                _this.reloading = true; // 在这里设为true，“上滑加载”的gif显示，之后滚动时就不走这里了
                content.style.paddingBottom = '6rem' // 使“上滑加载”这个div显示
                // 请求数据
                api.getListData().then(data => {
                  // 截取数据的最后几条
                  let d1 = data.data.data.list.slice( data.data.data.list.length - 3, data.data.data.list.length );
                  // 循环当前的listdata，如果这次截取的数据已经存在于listdata里，说明没有新数据可加载了，就不再重复请求音乐的数据
                  for (var i = 0; i < _this.$store.state.listdata.length; i++) {
                    if (_this.$store.state.listdata[i].id === d1[0].id) {
                      setTimeout(() => {
                        _this.nextTick();
                      }, 1000);
                      return;
                    }
                  }
                  // 把数据push进listdata
                  _this.$store.commit("changeListData", d1);
                  // 请求音乐的数据，并存入listdata里相应的数据中
                  api.getAllMusicListData( _this.getAllMusicListDataCallBack.bind(_this) ); 
                  // 初始化better-scroll                 
                  setTimeout(() => {           
                    _this.nextTick();
                  }, 2000);
                });                              
              }
            });
          }
        });
      });
    },
    // 初始显示中间几条条数据
    getList() {
      api.getListData().then(data => {
        // 截取中间几条条数据
        let d1 = data.data.data.list.slice(4, data.data.data.list.length - 3);
        this.$store.commit("changeListData", d1);
        // 获取音乐数据
        api.getAllMusicListData(this.getAllMusicListDataCallBack.bind(this));
      });
    },
    getAllMusicListDataCallBack(err, data) {
      // 这里获取的是排行榜的众多音乐,data.songlist是想要的列表（数组）
      let _this = this;
      // 循环拿到的列表
      data.songlist.forEach(function(item) {
        api.getOneSongData(item.data.songmid, _this.getOneSongDataCallBack);
      });
      // 等拿到音乐数据之后，再提交mutation修改listdata
      setTimeout(function() {      
        _this.$store.commit("setListDataMusic");
      },1000);
    },
    getOneSongDataCallBack(err, data) {
      // 这里获取的data是单个歌曲的数据，包括url和id
      this.$store.commit("setAllMusicList", data); // 把拿到的每首歌曲的信息存放到公共的AllMusicList数组里
      setTimeout(()=>{
        this.nextTick();
      },1000)
    },
    ...mapMutations({
      setMPlayerScreen: "setMPlayerScreen"
    })
  },
  computed: {
    // 首页的早茶时间
    morningteaTime() {
      let d = new Date();
      let y = "" + d.getFullYear();
      return y.slice(2) + "." + (d.getMonth() + 1) + "." + d.getDate();
    },
    // 首页的数据
    listdata() {
      return this.$store.state.listdata; // 下拉更新数据存放数组
    }
  }
};
</script>
<style>
#wrapper {
  float: left;
}
.morningtea p:nth-child(1) span {
  font-size: 3.96rem;
}
.content {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: -5.65217391rem;
}

/* 下拉刷新的loading */
.loading {
  width: 100%;
  height: 5.65217391rem;
  text-align: center;
  line-height: 5.65217391rem;
}

.floading {
  text-align: center;
  height: 6rem;
  /* padding-bottom:10rem; */
  overflow: auto;
}
.floading img{
  height: 4rem;
}
.function .red {
  color: #d95f57;
}

.function .blue {
  color: #a1dfe4;
}
</style>

