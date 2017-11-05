<template>
	<transition name="fade">
		<div class="music-player" v-show="this.$store.state.mPlayerScreen" ref="musicPlayer" @touchmove="preventFn($event)"> 
			<div class="music-player-cont">
				<div class="filterbg"></div>  
				<h2 class="clearfix music-title">
					<!-- <router-link to="/latalyList" tag="i" class=" fl fa fa-flip-horizontal fa-clock-o" aria-hidden="true">
					</router-link>  -->
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
      musicBoxP: 0
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
    // 左右滑屏切换cd图片和歌词
    middleTouchStart(e) {
      this.touch.initiated = true; // 初始为true
      // 用来判断是否是一次移动
      this.touch.moved = false; // 没有拖动
      const touch = e.touches[0]; // 获取手指的信息
      this.touch.startX = touch.pageX; // 手指按下时的位置
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      // 没有touchstart 返回
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX; // 手指横向滑动的距离，如果向左滑动，这个值是负的；如果向右滑动，那么这个值是正的
      const deltaY = touch.pageY - this.touch.startY; // 手指纵向滑动的距离
      // y轴距离大于x轴距离 => 纵向滚动 => 返回
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cdImg" ? 0 : -window.innerWidth; // 记录距离当前展示的小盒子距离屏幕左边的距离
      // 如果当前展示的是cd，left在手指拖动过程中一直是0
      // 否则如果当前展示的是歌词，那么left在手指拖动过程中一直是屏幕的宽度
      // 滑动过程中不断地计算"music-box的最左边距离页面的最左边的距离
      /* 计算偏移的距离：
				如果当前展示的是cd图片，那么left+ deltaX就是手指横向滑动的距离
						如果是向左滑动，那么left+ deltaX是负的，随着往左滑动，left+ deltaX不断减小，a是负的，偏移距离offsetWidth是a
						如果是向右滑动，那么left+ deltaX是正的，随着往右滑动，left+ deltaX不断减小，a是正的，偏移距离offsetWidth是0
				如果当前展示的是歌词，那么left是负的屏幕宽度。加上横向滑动的距离deltaX
			*/
      const a = Math.max(-window.innerWidth, left + deltaX); // a是 手指横向滑动的距离 和 屏幕宽度 的最大值
      // console.log(a,'a') // 如果当前展示的是cd图片，那么向左滑动，从0到-window.innerWidth；向右滑动，从0到~
      // 如果当前展示的是歌词，那么向左滑动，a一直是-window.innerWidth；向右滑动，从-window.innerWidth到正数~
      const offsetWidth = Math.min(0, a);
      // console.log(offsetWidth,'offsetWidth') // 最小是-window.innerWidth，最大是0
      // 计算拖动的百分比：偏移距离除以屏幕宽度
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyriclist.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyriclist.$el.style["transitionDuration"] = 0; // 先把transition的时间清零，以免干扰运动
      this.$refs.musicCd.style.opacity = 1 - this.touch.percent; // 拖动的百分比越大，cd图片越透明，当完全展示歌词时，cd图片全透明
      this.$refs.musicCd.style["transitionDuration"] = 0; // 把transition的时间清零，以免干扰运动
    },
    // 手指松开时执行
    middleTouchEnd() {
      // 如果正在运动，那么return
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth; // 偏移量，也就是歌词界面要通过translate运动的距离（为负，那么歌词向左运动，为正那么歌词向右运动）
      let opacity; // cd界面的透明度
      if (this.currentShow === "cdImg") {
        // 如果当前展示cd
        if (this.touch.percent > 0.5) {
          // 如果当前拖动比例大于0.5（说明拖到了歌词界面）
          offsetWidth = -window.innerWidth + 2 * parseFloat(this.musicBoxP); // 偏移量设置为-window.innerWidth，展示歌词界面
          opacity = 0; // cd界面完全透明
          this.currentShow = "lyric"; // 更改当前展示的状态，以便下次拖动时使用
        } else {
          // 如果当前拖动比例小于0.5（说明没有拖到歌词界面）
          offsetWidth = 0 + parseFloat(this.musicBoxP); // 偏移量设置为0，依然展示cd界面
          opacity = 1; // cd界面完全不透明
        }
      } else {
        if (this.touch.percent < 0.5) {
          offsetWidth = 0;
          this.currentShow = "cdImg";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth + 2 * parseFloat(this.musicBoxP);
          opacity = 0;
        }
      }
      // 设置动画缓冲时间
      let time = 300;
      // 歌词界面移动到计算好的位置
      this.$refs.lyriclist.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyriclist.$el.style["transitionDuration"] = `${time}ms`;
      this.$refs.musicCd.style.opacity = opacity;
      this.$refs.musicCd.style["transitionDuration"] = `${time}ms`;
      this.touch.initiated = false;
    },
    // 点击播放按钮
    play() {
      if (this.$store.state.playState === true) {
        // 如果当前是播放状态，就提交暂停
        this.$store.commit("pause");
        this.$store.commit("changeListIsplay", {
          isPlay: false,
          index: this.$store.state.currentListItemId
        });
        // this.currentLyric.stop()
      } else {
        // 如果当前是暂停状态，，就提交播放
        this.$store.commit("play");
        // 要修改数据里的isPlay的值，使上次正在播放的小播放条播放，所以要知道其在listdata里的下标
        this.$store.commit("changeListIsplay", {
          isPlay: true,
          index: this.$store.state.currentListItemId
        });
      }
      // 切换播放/暂停状态
      this.currentLyric = this.$store.state.currentLyric;
      this.currentLyric.togglePlay();
    },
    ...mapMutations({
      setMPlayerScreen: "setMPlayerScreen",
      setLatalyListShow: "setLatalyListShow"
    }),
    // 将歌曲时间转换成xx:xx格式
    timerFomart(time) {
      if (isNaN(time)) return "00:00";
      let min =
        time / 60 > 9 ? Math.floor(time / 60) : "0" + Math.floor(time / 60);
      let miao =
        time % 60 > 9 ? Math.floor(time % 60) : "0" + Math.floor(time % 60);
      return min + ":" + miao;
    },
    // 进度条的拖拽
    touchStart() {
      // 开始拖拽，设置状态为true
      this.canDrag = true;
    },
    touchMove(event) {
      // 如果可以拖拽
      if (this.canDrag) {
        let mouseX = event.touches[0].pageX;
        let offsetLeft = this.$refs.duration.offsetLeft;
        this.persentWidth = Math.floor(
          (mouseX - offsetLeft) / this.$refs.duration.offsetWidth * 100
        );
        this.persentWidth = this.persentWidth > 100 ? 100 : this.persentWidth;
        this.persentWidth = this.persentWidth < 0 ? 0 : this.persentWidth;
        // this.$store.getters.getAudioElement.currentTime = this.duration * this.persentWidth / 100
        this.$refs.currentProgress.style.width = `calc(${this.persentWidth}%`;
      } else {
        return;
      }
    },
    touchEnd(event) {
      // canDrag状态改为不可拖拽
      if (this.canDrag !== false) {
        this.canDrag = false;
        // duration 属性返回当前音频/视频的长度，以秒计。如果未设置音频/视频，则返回
        if (isNaN(this.$store.state.audioDom.duration)) return; // 如果持续时间为NaN，就不执行下面
        // 计算当前播放到的时刻：
        this.$store.state.audioDom.currentTime =
          this.$store.state.audioDom.duration * this.persentWidth / 100;
      }
      // 歌词滚动到对应的位置
      if (this.currentLyric) {
        this.$store.state.currentLyric.seek(
          this.$store.state.audioDom.currentTime * 1000
        );
      }
    },
    // 参考源码https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js，这个回调函数接收两个参数，一个是行的索引值，一个是对应的歌词文本

    handleLyric({ lineNum, txt }) {
      // 当前播放到的行的下标是lineNum
      this.currentLine = lineNum;

      // console.log(this.$refs.lyricLine[lineNum])
      if (lineNum > 5) {
        // 如果下标大于5
        // 获取到所有li，通过下标 找到当前播放到的歌词对应的li
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        // 把滚动的容器滚动到“当前li”的位置
        this.$refs.lyriclist.scrollToElement(lineEl, 1000);
      } else {
        // 如果没有大于
        this.$refs.lyriclist.scrollTo(0, 0, 1000);
      }
      this.sentenceLyric = txt;
    },
    getLyric() {
      let _this = this;
      let id = _this.$store.state.currentSong.data[0].id; // 当前播放歌曲的id
      // lyricData时一个对象，key值是歌曲的id，value值是歌词（转码后的），
      // 每次getLyric被调用时都从state里拿歌词数据，如果歌词里已经有这首歌的歌词，就不再重复请求
      if (this.$store.state.lyricData[id]) {
        this.currentLyric = new LyricParser(
          this.$store.state.lyricData[id],
          this.handleLyric
        );
        // 把包装过的歌词设置为当前播放的歌词
        this.$store.commit("setCurrentLyric", this.currentLyric);
        // 使歌词播放
        this.$store.state.currentLyric.play();
        return;
      }
      api.getLyricData(id, this.getLyricCallBack);
    },
    getLyricCallBack(err, data) {
      let id = this.$store.state.currentSong.data[0].id; // 当前播放歌曲的id
      let oneSongLyric = data.lyric;
      let base = new Base64();
      let result = base.decode(oneSongLyric);
      // 把请求到的歌词存进lyricData里
      this.$store.commit("setLyric", { id: id, lyric: result });
      // 使用lyric-parser模块，参考源码https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js，
      this.currentLyric = new LyricParser(result, this.handleLyric);
      // 把包装过的歌词设置为当前播放的歌词
      this.$store.commit("setCurrentLyric", this.currentLyric);
      if (this.$store.state.playState) {
        this.$store.state.currentLyric.play();
      }
    },
    // 播放上一首歌曲
    goPrev() {
      // this.currentLyric.stop()
      if (this.$store.state.musicList.length === 1) {
        // 如果列表里只有一首歌曲，那么点击上一首时就循环播放这一首歌曲
        this.loop();
      }

      let index = this.$store.state.currentMusicIndex - 1;
      if (index === -1) {
        index = this.$store.state.musicList.length - 1;
      }
      // 提交setCurrentMusicIndex修改CurrentMusicIndex，立刻切换歌曲并播放
      this.$store.commit("setCurrentMusicIndex", index);
      // this.getLyric()
      // 切换播放/暂停状态
      // this.currentLyric = this.$store.state.currentLyric
      // this.currentLyric.play()
    },
    // 播放下一首歌曲
    goNext() {
      // this.currentLyric.stop()
      if (this.$store.state.musicList.length === 1) {
        // 如果列表里只有一首歌曲，那么点击上一首时就循环播放这一首歌曲
        this.loop();
      }
      // 通过修改公共的currentMusicIndex（当前音乐的下标）来切换歌曲
      let index = this.$store.state.currentMusicIndex + 1;

      if (index === this.$store.state.musicList.length) {
        // 如果下标超过了列表的最大下标
        index = 0; // 从0开始
      }
      // 提交setCurrentMusicIndex修改CurrentMusicIndex，立刻切换歌曲并播放
      this.$store.commit("setCurrentMusicIndex", index);
      // this.getLyric()
      // this.currentLyric = this.$store.state.currentLyric
      // this.currentLyric.play()
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
      }, 3000);
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
    musicCurrentTime() {
      return this.getCurrentTime ? this.getCurrentTime : "00:00";
    },
    musicDuration() {
      return this.getMusicDuration ? this.getMusicDuration : "00:00";
    },
    // 进度条的宽度
    progressWidth() {
      return {
        width: `calc(${(this.getCurrentTime /
          this.getMusicDuration *
          100
        ).toFixed(2)}%`
      };
    },
    // 根据播放状态来计算cd图片是否旋转
    animationPlayState() {
      if (this.$store.state.playState === true) {
        return {
          "animation-play-state": "running"
        };
      } else {
        return {
          "animation-play-state": "paused"
        };
      }
    },
    // 根据状态计算播放模式的类名
    // playModeIcon(){
    //     if(this.playMode === 0){
    //         return 'icon-sequence'
    //     }else if(this.playMode === 1){
    //         return 'icon-loop'
    //     }else if(this.playMode === 2){
    //         return 'icon-random'
    //     }
    // },
    songImg() {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.$store
        .state.currentSong.data[0].album.mid}.jpg?max_age=2592000`;
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
  width: 34rem;
  height: 0.6rem;
  border-radius: 0.5rem;
  /* border-bottom: 0.5rem solid #666666; */
  background-color: #666666;
  /* background: hsla(0,0%,96%,.3); */
  margin: 1.85185185rem auto 0;
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
