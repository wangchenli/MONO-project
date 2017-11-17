<template>
	<transition name="fade">
		<div class="music-player" v-show="this.$store.state.mPlayerScreen" ref="musicPlayer" @touchmove="preventFn($event)"> 
			<div class="music-player-cont">
				<div class="filterbg"></div>  
				<h2 class="clearfix music-title">
					<i class="fl fa fa-flip-horizontal fa-clock-o" aria-hidden="true" @touchstart="setLatalyListShow(true)"></i>
					<span class="fl">音乐播放器</span>
					<i class="fr fa fa-chevron-up" aria-hidden="true" @touchstart="setMPlayerScreen(false)"></i>
				</h2>
				<div class="music-b" ref="musicBox">
					<p class="clearfix">
						<span class="fl">我的收藏</span>
						<i class="fr fa fa-angle-right" aria-hidden="true"></i>
					</p>
					<p class="clearfix">
						<span class="fl">正在播放</span>
						<i class="fr fa fa-angle-right" aria-hidden="true"></i>
					</p>
					<div 
							class="music-box"
              ref="musicBoxCont"
							@touchstart.prevent="middleTouchStart"
							@touchmove.prevent="middleTouchMove"
							@touchend="middleTouchEnd"
					>
						<div class="music-left" ref="musicCd">
							<b>来自<strong>不听歌会死</strong>主题站</b><br/>
							<b v-if="getCurrentSong">{{getCurrentSong.data[0].name}}</b><br/>
							<div class="play-box" ref="playBox" :style="animationPlayState">
								<!-- <img src="../../assets/img/play.png" /> -->
								<img :src="songImg" v-if="this.$store.state.currentSong"/>                        
							</div>		
							<div class="sentence-lyric-wrapper">
								<div class="sentence-lyric">
									{{sentenceLyric}}
								</div>
							</div>											
						</div>
						<scroll class="music-right" ref="lyriclist" :data="currentLyric && currentLyric.lines">
							<div class="lyric" ref="lyricCont">
								<ul class="lyric-box" v-if="currentLyric" ref="lyricBox">
									<li 
										ref="lyricLine"
										v-for="(val,index) in currentLyric.lines"
										:key="index"
										:class="{'currentlyc': currentLine === index}"                              
									>{{val.txt}}</li>
									<!-- 根据歌词生成li，根据li的下标和currentLine状态来确定哪句歌词是“当前歌词” -->
								</ul>						
							</div>
						</scroll>
						<div class="qiehuan" ref="switchBtn">
							<em :class="{'active':currentShow === 'cdImg'}"></em>
							<em :class="{'active':currentShow === 'lyric'}"></em>
						</div>				
					</div>
					<div class="music-box-bottom">	
						<!-- 进度条 -->
						<div class="schedule">
								<!-- 实时播放时间 -->
								<span class="fl">{{timerFomart(musicCurrentTime)}}</span>
								<!-- <div class="fl progress-bar">
										<div class="quan"></div>
								</div> -->
								<!-- 进度条 -->
								<div class="fl progress-bar" ref="duration">
										<span class="currentProgress" :style="progressWidth" ref="currentProgress" ></span>
										<span class="ball" ref="ball" @touchstart="touchStart" @touchmove="touchMove($event)" @touchend="touchEnd($event)"></span>
								</div>
								<!-- 歌曲的总时长 -->
								<span class="fr">{{timerFomart(musicDuration)}}</span>
						</div>	
						<!-- 底部播放条 -->
						<div class="music-func">
								<!--  播放模式按钮 -->
								<i class="fl fa fa-random" aria-hidden="true"></i>
								<!-- 上一首按钮 -->
								<i class="fl fa fa-backward" aria-hidden="true" @touchstart="goPrev"></i>
								<!--  播放/暂停 按钮 -->
								<i :class="playBtnCls" aria-hidden="true" @touchstart="play"></i>
								<!-- 下一首按钮 -->
								<i class="fl fa fa-forward" aria-hidden="true"  @touchstart="goNext"></i>
								<!-- 分享按钮 -->
								<i class="fr fa fa-share-square-o" aria-hidden="true"></i>
						</div>		
					</div>	
				</div>
				<ul class="m-bottom">
					<li aria-hidden="true" class="fa fa-thumbs-o-up"><span>111</span></li>
					<li aria-hidden="true" class="fa fa-heart-o"></li>
					<li aria-hidden="true" class="fa fa-commenting-o"><span>111</span></li>
				</ul>
			</div>
		</div>
	</transition>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
// import lyricparser from '@/assets/js/lyricparser.js'
// import BScroll from 'better-scroll'
import Scroll from "@/components/scroll/index";
import Axios from "axios";
import Jsonp from "jsonp";
import LyricParser from "lyric-parser";
import Base64 from "@/assets/js/base64.js";
import api from "@/api/api.js";

export default {
  data() {
    return {
      mPlayerScreen: false,
      canDrag: false,
      persentWidth: 0,
      currentLyric: null,
      currentLine: 0,
      sentenceLyric: "",
      currentShow: "cdImg", // 表示当前展示的是cd图片还是歌词，cd代表目前展示的是cd
      playMode: 0,
      musicBoxP: 0,
      musicWidth:0
    };
  },
  components: {
    Scroll
  },
  // 滑动touch
  created() {
    this.touch = {}; // 自定义touch属性，值为对象
  },
  mounted() {
    // this.$refs.lyriclist.$el.style.height = this.$refs.lyricCont.offsetHeight;
    this.$refs.musicPlayer.style.height = window.innerHeight;
    this.musicBoxP = getComputedStyle(this.$refs.musicBox)["paddingLeft"];
    this.$refs.playBox.style.animationPlayState = "paused"; // 一上来先使旋转的cd图片停止旋转
  },
  methods: {
    preventFn(event) {
      event.preventDefault();
    },
    // 左右滑屏切换cd图片和歌词，手指按下
    middleTouchStart(e) {
      // initiated判断手指是否按下，按下时设为true，抬起时设为false
      this.touch.initiated = true; 
      // 用来判断是否是 一次移动，每次手指按下时都把moved设为false，拖动时设为true，抬起时根据move的值判断要不要切换cd界面和歌词界面
      this.touch.moved = false; // 没有拖动
      const touch = e.touches[0]; // 获取手指的信息
      this.touch.startX = touch.pageX; // 手指按下时的位置
      this.touch.startY = touch.pageY; // 手指按下时的位置
      this.musicWidth = parseFloat(getComputedStyle(this.$refs.musicBoxCont)["width"]); // musicBoxCont的宽度
    },
    // 手指拖动
    middleTouchMove(e) {
      // 没有touchstart 返回
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX; // 手指横向滑动的距离，如果向左滑动，这个值是负的；如果向右滑动，那么这个值是正的
      const deltaY = touch.pageY - this.touch.startY; // 手指纵向滑动的距离，如果向上滑动，这个值是负的；如果向下滑动，那么这个值是正的
      // y轴距离大于x轴距离 => 纵向滚动 => 返回
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      // 在这判断一下，如果move的为false，设为true，设置一次即可，不要在移动过程中不断地设置
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cdImg" ? 0 : -this.musicWidth; // 记录距离当前展示的小盒子距离屏幕左边的距离
      // 如果当前展示的是cd，left在手指拖动过程中一直是0
      // 如果当前展示的是歌词，那么left在手指拖动过程中一直是负的屏幕的宽度
      // 滑动过程中不断地计算left+ deltaX
      const a = Math.max(-this.musicWidth, left + deltaX) 
      // console.log(a,'a') // 如果当前展示的是cd图片，那么向左滑动，从0到-this.musicWidth；向右滑动，从0到~
      // 如果当前展示的是歌词，那么向左滑动，a一直是-this.musicWidth；向右滑动，从-this.musicWidth到正数~
      /* 滑动过程中不断地计算offsetWidth----歌词界面要通过translate移动到的位置：
				如果当前展示的是cd图片，那么left+ deltaX就是手指横向滑动的距离
          如果是向左滑动，那么left+ deltaX是负的，随着往左滑动，left+ deltaX不断减小（从0到-this.musicWidth），a是left + deltaX，offsetWidth是a，歌词界面往左运动
          如果是向右滑动，那么left+ deltaX是正的，随着往右滑动，left+ deltaX不断减小（从0到+...），a是left + deltaX，offsetWidth是0，歌词界面不动
				如果当前展示的是歌词，那么left一开始是-this.musicWidth
          如果是向左滑动，那么left+ deltaX是负的，随着往左滑动，left+ deltaX不断减小（从-this.musicWidth到-...），a是-this.musicWidth，offsetWidth是a，歌词界面往左运动
          如果是向右滑动，那么left+ deltaX是负的，随着往右滑动，left+ deltaX不断增大（从-this.musicWidth到+...），a是left+ deltaX，offsetWidth是a，歌词界面往右运动
			*/
      const offsetWidth = Math.min(0, a);
      // console.log(offsetWidth,'offsetWidth') // 最小是-this.musicWidth，最大是0
      // 计算拖动的百分比：歌词界面要移动到的目标位置除以屏幕宽度，
      // 
      this.touch.percent = Math.abs(offsetWidth / this.musicWidth);
      // console.log(this.touch.percent)
      // 歌词界面通过translate运动,translate不脱离文档流
      this.$refs.lyriclist.$el.style["transform"] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyriclist.$el.style["transitionDuration"] = 0; // 先把transition的时间清零，以免干扰运动
      this.$refs.musicCd.style.opacity = 1 - this.touch.percent; // 拖动的百分比越大，cd图片越透明，当完全展示歌词时，cd图片全透明
      this.$refs.musicCd.style["transitionDuration"] = 0; // 把transition的时间清零，以免干扰运动
    },
    // 手指松开时执行
    middleTouchEnd() {
      // 如果没有移动，那么return
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth; // 偏移量，也就是歌词界面要通过translate运动的距离（为负，那么歌词向左运动，为正那么歌词向右运动）
      let opacity; // cd界面的透明度
      // console.log(this.touch.percent,'this.touch.percent')
      if (this.currentShow === "cdImg") {
        // 如果当前展示cd
        if (this.touch.percent > 0.5) {
          // 如果当前拖动比例大于0.5（说明拖到了歌词界面）
          offsetWidth = -this.musicWidth; // 歌词界面的偏移量设置为-this.musicWidth，展示歌词界面
          opacity = 0; // cd界面完全透明
          this.currentShow = "lyric"; // 更改当前展示的状态，以便下次拖动时使用
        } else {
          // 如果当前拖动比例小于0.5（说明没有拖到歌词界面）
          offsetWidth = 0; // 歌词界面的偏移量设置为0，依然展示cd界面
          opacity = 1; // cd界面完全不透明
        }
      } else { // 如果当前展示的是歌词界面
        if (this.touch.percent < 0.5) { // 如果比例小于0.5，说明要回到cd图片界面了
          offsetWidth = 0; // 歌词界面的偏移量设为0，依然展示cd界面
          this.currentShow = "cdImg";
          opacity = 1; // cd界面完全不透明
        } else {
          offsetWidth = -this.musicWidth; // 歌词界面的偏移量设置为-this.musicWidth，展示歌词界面
          opacity = 0; // cd界面完全透明
        }
      }
      // 设置动画缓冲时间
      let time = 100;
      // 歌词界面移动到计算好的位置
      this.$refs.lyriclist.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
      // 设置transition，渐变效果
      this.$refs.lyriclist.$el.style["transitionDuration"] = `${time}ms`;
      // cd界面的透明度变化
      this.$refs.musicCd.style.opacity = opacity;
      this.$refs.musicCd.style["transitionDuration"] = `${time}ms`;
      // initiated改为false，表示手指抬起了，结束了一次拖动
      this.touch.initiated = false;
    },
    // 点击播放按钮
    play() {      
      if (this.$store.state.playState === true) {
        // 如果当前是播放状态，就提交暂停
        this.$store.commit("pause");
        // 同步当前所播放的音乐在listdata数据里的isPlay状态
        this.$store.commit("changeListIsplay", {
          isPlay: false,
          index: this.$store.state.currentListItemId
        });
      }else {
        // 如果当前是暂停状态，就提交播放
        // 如果暂无“当前音乐”，说明是一上来第一次点击播放器的播放按钮，就默认播放列表里的第一首歌
        if(!this.getCurrentSong){
          this.$store.commit("setCurrentMusicIndex", 0);
        }          
        // 提交播放
        this.$store.commit("play");
        // 同步当前所播放的音乐在listdata数据里的isPlay状态
        this.$store.commit("changeListIsplay", {
          isPlay: true,
          index: this.$store.state.currentListItemId
        });
      }
      // 切换当前歌词的播放/暂停状态
      if(this.getCurrentLyric){
        this.getCurrentLyric.togglePlay();
      }            
    },
    // 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用
    ...mapMutations({
      setMPlayerScreen: "setMPlayerScreen", // 将this.setMPlayerScreen() 映射为 this.$store.commit('setMPlayerScreen')
      setLatalyListShow: "setLatalyListShow" // 将this.setLatalyListShow() 映射为 this.$store.commit('setLatalyListShow')
    }),
    // 将歌曲时间转换成xx:xx格式
    timerFomart(time) {
      // 如果time为NaN，返回"00:00"
      if (isNaN(time)) return "00:00";
      // 分：time/60是分，如果分大于9，就直接向下取整得到分位的数值；否则就在取整得到的结果前面加0（比如11和01）
      let min = time / 60 > 9 ? Math.floor(time / 60) : "0" + Math.floor(time / 60);
      // 秒：%取余，如果秒数大于9，就直接向下取整得到秒位的数值；否则就在取整得到的结果前面加0（比如11和01）
      let miao = time % 60 > 9 ? Math.floor(time % 60) : "0" + Math.floor(time % 60);
      // 比如280s => 04:04
      return min + ":" + miao;
    },
    // 进度条的拖拽
    touchStart() {
      // 开始拖拽，设置状态为true，目的是记录一次完整的拖拽
      this.canDrag = true;
    },
    // 手指移动时
    touchMove(event) {
      // 如果可以拖拽
      if (this.canDrag) {   
        let mouseX = event.touches[0].pageX; // 手指在页面的当前坐标
        /*
          touches是一个 TouchList，其会列出所有当前在与触摸表面接触的  Touch 对象，单指操作取touches[0]即可
        */
        let offsetLeft = this.$refs.duration.offsetLeft; // offsetLeft =  left + marginLeft
        // 计算persentWidth 也就是当前的进度占总进度的百分比：（当前手指的x轴坐标 - 总进度条的offsetLeft） / 总进度条的宽度
        this.persentWidth = (mouseX - offsetLeft) / this.$refs.duration.offsetWidth; // 0~1
        // console.log(this.persentWidth,'this.persentWidth')
        // 下面对persentWidth做一些限制
        // 如果当前宽度大于100，说明已经走到头，当前进度条的宽度为100；否则说明没有走到头
        this.persentWidth = this.persentWidth > 1 ? 1 : this.persentWidth;
        // 如果当前宽度小于0，说明是手指向左拖动的，就赋值为0，不能是负的。如果不小于0，那么就是正常的persentWidth
        this.persentWidth = this.persentWidth < 0 ? 0 : this.persentWidth;
        // 设置当前进度条的宽度
        this.$refs.currentProgress.style.width = `calc(${this.persentWidth*100}%`;
      } else { // 如果不能拖拽，就终止此函数
        return;
      }
    },
    // 手指抬起时
    touchEnd(event) {
      // canDrag状态改为不可拖拽
      if (this.canDrag !== false) {
        this.canDrag = false;
        // duration 属性返回当前音频/视频的长度，以秒计。如果未设置音频/视频，则返回 NaN
        if (isNaN(this.$store.state.audioDom.duration)) return; // 如果持续时间为NaN，就不执行下面，防止一开始没有音乐拖动进度条时报错
        // 跳至当前播放到的时刻：把公共的audio的currentTime设置为 当前音频的总长度*当前的进度占总进度的百分比
        this.$store.state.audioDom.currentTime = this.$store.state.audioDom.duration * this.persentWidth; // 单位是秒
      }
      // 歌词滚动到对应的位置
      if (this.getCurrentLyric) {
        // seek是lyric-parser内置的方法
        this.getCurrentLyric.seek( this.$store.state.audioDom.currentTime * 1000 );
      }
      // 如果当前处在暂停状态，那么拖拽结束后歌词暂停
      if(!this.$store.state.playState){
        getCurrentLyric.stop()
      }      
    },
    // 参考源码https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js，
    // handleLyric这个回调函数接收两个参数，一个是行的索引值，一个是对应的歌词文本
    handleLyric({ lineNum, txt }) {
      // 当前播放到的行的下标是lineNum
      this.currentLine = lineNum;
      // console.log(this.$refs.lyricLine[lineNum])
      if (lineNum > 5) {
        // 如果下标大于5
        // 获取到所有li，通过下标 找到当前播放到的歌词对应的li
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        // 把滚动的容器滚动到“当前li”的位置
        /*
        scrollToElement的参数：
          1. 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
          2. 滚动动画执行的时长（单位 ms）
          3. offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
          4. offsetX 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
        */
        this.$refs.lyriclist.scrollToElement(lineEl, 1000);
      } else {
        // 如果lineNum没有大于5，就不滚动
        // scrollTo(x, y, time, easing)，参数分别是x 横轴坐标（单位 px）；y 横轴坐标（单位 px）；滚动动画执行的时长（单位 ms）；缓动函数，一般不建议修改
        this.$refs.lyriclist.scrollTo(0, 0, 1000);
      }
      // sentenceLyric设为txt（当前播放到的那句歌词）
      this.sentenceLyric = txt;
    },
    // 获取歌词
    getLyric() {
      let _this = this;
      let id = _this.$store.state.currentSong.data[0].id; // 当前播放歌曲的id
      // lyricData时一个对象，key值是歌曲的id，value值是歌词（转码后的），
      // 每次getLyric被调用时都从state里拿歌词数据，如果歌词里已经有这首歌的歌词，就不再重复请求
      if (this.$store.state.lyricData[id]) {
        this.currentLyric = new LyricParser( this.$store.state.lyricData[id], this.handleLyric );
        // 把包装过的歌词设置为当前播放的歌词
        this.$store.commit("setCurrentLyric", this.currentLyric);
        // 使歌词播放
        this.$store.state.currentLyric.play();
        return;
      }
      // 根据id请求歌词
      api.getLyricData(id, this.getLyricCallBack);
    },
    // jsonp的回调函数getLyricCallBack
    getLyricCallBack(err, data) {
      let id = this.$store.state.currentSong.data[0].id; // 当前播放歌曲的id
      let oneSongLyric = data.lyric; // 拿到歌词
      let base = new Base64(); // 实例化Base64对象，用来转码
      let result = base.decode(oneSongLyric); // 得到转码后的歌词
      // 把请求到的歌词根据id存进lyricData里
      this.$store.commit("setLyric", { id: id, lyric: result });
      // 使用lyric-parser模块，参考源码https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js，
      this.currentLyric = new LyricParser(result, this.handleLyric);
      // 把包装过的歌词设置为当前播放的歌词
      this.$store.commit("setCurrentLyric", this.currentLyric);
      // 如果当前处在播放状态，拿到歌词就直接滚动
      if (this.$store.state.playState) {
        this.$store.state.currentLyric.play();
      }
    },
    // 播放上一首歌曲，目前的功能是切换歌曲直接播放
    goPrev() {
      if (this.$store.state.musicList.length === 1) {
        // 如果列表里只有一首歌曲，那么点击上一首时就循环播放这一首歌曲
        this.loop();
      }
      // 通过修改公共的currentMusicIndex（当前音乐的下标）来切换歌曲
      let index = this.$store.state.currentMusicIndex - 1;      
      if (index === -1) { // 如果走到这里，说明 当前当前播放的是列表里的第一首歌
        index = this.$store.state.musicList.length - 1; // 准备跳到最后一首歌
      }
      // 提交setCurrentMusicIndex修改CurrentMusicIndex，立刻切换歌曲并播放
      this.$store.commit("setCurrentMusicIndex", index);
    },
    // 播放下一首歌曲
    goNext() {
      if (this.$store.state.musicList.length === 1) {
        // 如果列表里只有一首歌曲，那么点击上一首时就循环播放这一首歌曲
        this.loop();
      }
      // 通过修改公共的currentMusicIndex（当前音乐的下标）来切换歌曲
      let index = this.$store.state.currentMusicIndex + 1;
      if (index === this.$store.state.musicList.length) {
        // 如果走到这里，说明下标超过了列表的最大下标
        index = 0; // 从0开始，也就是准备跳到第一首歌
      }
      // 提交setCurrentMusicIndex修改CurrentMusicIndex，立刻切换歌曲并播放
      this.$store.commit("setCurrentMusicIndex", index);
    },
    // 单曲循环
    loop() {
      this.$store.commit("setCurrentTime", 0); // 时间设置为0，从0开始播放
      this.$store.commit("play"); // 提交mutation开始播放
      if (this.currentLyric) {
        // 如果有歌词，歌词回到开头重新滚动
        this.currentLyric.seek(0);
      }
    }
  },
  // vue官网：https://cn.vuejs.org/v2/guide/computed.html，
  //使用 watch 选项允许我们执行异步操作 (访问一个 API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态
  watch: {
    // getCurrentSong是从公共的state里拿到的当前歌曲，如果当前歌曲变化，就执行这个函数
    getCurrentSong(newSong, prevSong) {
      if (!newSong.data[0].id) return; // 如果没有当前歌曲，就不执行下面的
      // 防止歌词切换跳动，监测到歌曲变化时，如果当前已经有歌词，就先使歌词停止播放，再去获取新的歌词
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      // 如果不设置延迟，会发现歌词无法滚动
      setTimeout(() => {
        this.getLyric(); // 获取歌词
      }, 1000);
    }
  },
  computed: {
    // 播放按钮的类名
    playBtnCls() {
      if (this.$store.state.playState === true) {
        return "fl fa fa-pause-circle";
      } else {
        return "fl fa fa-play-circle";
      }
    },
    // 当前音频播放到的位置
    musicCurrentTime() {
      return this.getCurrentTime ? this.getCurrentTime : "00:00";
    },
    // 当前音频的时长
    musicDuration() {
      return this.getMusicDuration ? this.getMusicDuration : "00:00";
    },
    // 进度条的宽度
    progressWidth() {
      return {
        width: `calc(${(this.getCurrentTime / this.getMusicDuration * 100 ).toFixed(2)}%` // 四舍五入，保留两位小数
      };
    },
    // 根据播放状态来计算cd图片是否旋转
    animationPlayState() {
      if (this.$store.state.playState === true) {
        return {
          "animation-play-state": "running"
        }
      } else {
        return {
          "animation-play-state": "paused"
        }
      }
    },
    // 当前歌曲的图片
    songImg() {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.$store.state.currentSong.data[0].album.mid}.jpg?max_age=2592000`;
    },
    // 用mapGetters辅助函数，使用对象展开运算符将getter混入computed对象中
    ...mapGetters([
      "getCurrentSong",
      "getMusicDuration",
      "getCurrentTime",
      "getCurrentLyric"
    ])
  }
};
</script>


<style>
.music-player {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  transform-style: preserve-3d;
  overflow: hidden;
}
.music-player .music-box {
  width: 100%;
  white-space: nowrap;
}
/* 显示播放列表的按钮 */
.music-title i:nth-child(1) {
  padding-left: 3rem;
  margin-right: 11.55555556rem;
}
.music-title .fa-chevron-up {
  padding-left: 2rem;
}
.music-left b {
  font-size: 4rem;
}
/* 播放器旋转的cd图片 */
#app .music-player .music-box .play-box {
  width: 18rem;
  height: 18rem;
  top: 12rem;
  left: 50%;
  margin-left: -9rem;
}
#app .music-box .play-box img {
  border-radius: 50%;
}
.music-player .music-box .play-box img {
  width: 100%;
  height: 100%;
}
.fade-enter-active {
  animation: fade-in 0.8s;
}
.fade-leave-active {
  animation: fade-out 0.8s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translate3d(0, -74rem, 0);
  }
  50% {
    opacity: 0.5;
    transform: translate3d(0, -37rem, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0px, 0);
  }
}
@keyframes fade-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
    transform: translate3d(0, -37rem, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(0, -74rem, 0);
  }
}
.music-player .music-left,
.music-player .music-right {
  width: 100%;
  display: inline-block;
  vertical-align: top;
  height: 40rem;
  color: #fff;
  /* margin: 0.95rem; */
  font-size: 1.7rem;
  overflow: hidden;
  text-align: center;
}
.music-player .music-box .lyric .lyric-box {
  height: 100%;
}
.music-player .currentlyc {
  color: seagreen;
  /* animation: lyric 0.5s; */
  transform: scale(1.5, 1.5);
}
@keyframes lyric {
  0% {
    transform: scale(1, 1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5, 1.5);
  }
}
.sentence-lyric-wrapper {
  width: 100%;
  margin: 1.2rem auto 0 auto;
  position: absolute;
  top: 34rem;
  text-align: center;
}
.sentence-lyric {
  height: 2.4rem;
  line-height: 2.4rem;
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 切换图片和歌词时小圆圈的高亮 */
.music-player .music-box .qiehuan .active {
  background-color: salmon;
}
.music-player .schedule .progress-bar {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 32.6rem;
  height: 0.6rem;
  border-radius: 0.5rem;
  /* border-bottom: 0.5rem solid #666666; */
  background-color: #666666;
  /* background: hsla(0,0%,96%,.3); */
  margin: 1.85185185rem 0 0 0.8rem;
  padding-top: 0;
  font-size: 0;
  cursor: pointer;
  position: relative;
}
.music-player .schedule .currentProgress {
  display: inline-block;
  width: 0;
  height: 0.6rem;
  background: red;
  float: left;
  background: #c62f2f;
}
.music-player .schedule .ball {
  width: 1.6rem;
  height: 1.6rem;
  margin-top: -0.35rem;
  position: absolute;
  background: #fff;
  border-radius: 50%;
  float: left;
  cursor: pointer;
}
.music-player .schedule span {
  font-size: 1.4rem;
  line-height: 4.4rem;
}
</style>
