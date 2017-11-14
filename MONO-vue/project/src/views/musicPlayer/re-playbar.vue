<template>
	<div>
		<p class="transparency"></p>
		<p class="clearfix music-test">
			<!-- <span class="currentProgress" ref="currentProgress"  :style="{width:this.$store.state.progerssWidth}"></span> -->
			<!-- 不能在公共组件里设置样式，否则所有用到的地方都会有同样的样式，样式要交给“当前的”进度条 -->		
      	<!--播放按钮  -->
			<i aria-hidden="true" @touchstart="play(index)" :class="playBtnCls" ref="playBtn"></i>
      <!-- 进度条 -->
			<span class="currentProgress" ref="currentProgress" :style="{'width':progressWidth}"></span>
      <!-- 歌名 -->
			<span  v-if="this.itemData.music">{{this.musicName}}</span>
      <!-- 刚打开页面，显示歌曲的总时长；点击播放时，显示歌曲的“当前播放时间” -->
			<em class="fr">
				{{timerFomart(musicDuration)}}
				<i class="fa fa-music" aria-hidden="true"></i>
			</em>
		</p>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
let n = 0;
export default {
  data() {
    // playState:false
    return {
      isPlay: false, // 每个组件有一个
      listdata: [],
      downdata: [],
      musicLrcIndex: 0,
      canDrag: false
    };
  },
  computed: {
    // 播放按钮的样式，根据isPlay判断
    playBtnCls() {
      if (this.itemData.isPlay == false) {
        return "fa fa-play";
      } else {
        return "fa fa-pause";
      }
    },
    // 需求是刚打开页面，就显示歌曲的总时长，点击播放时，显示歌曲的“当前播放时间”
    musicDuration() {
      if (this.itemData.isPlay == false) {
        if (this.itemData.music) {
          // 音乐的数据里的interval，是歌曲的总时长，单位是秒
          return this.itemData.music[0].data[0].interval;
        }
      } else { // 如果当前歌曲处在播放状态，那么显示当前播放时间
        return this.getCurrentTime;
      }
    },
    // 进度条的宽度
    progressWidth() {
      // 根据数据里对应的这条数据的isPlay状态判断
      if (this.itemData.isPlay == false) { // 如果是false，进度条宽度为0
        return 0;
      } else { // 如果为true，进度条宽度是公共进度条的宽度
        return this.$store.state.progressDom.style.width;
      }
    },
    // 歌名
    musicName() {
      return this.itemData.music[0].data[0].name;
    },
    // 用mapGetters辅助函数，使用对象展开运算符将getter混入computed对象中
    ...mapGetters(["getCurrentTime"])
  },
  props: ["index", "itemData", "type"],
  methods: {
    // 点击播放按钮，执行这个函数
    play(i) {
      // 提交修改，把公共的进度条元素 设置为 当前的进度条元素
      this.$store.commit("sendProgressDom", this.$refs.currentProgress);
      // 把所点击的歌曲的id设置为currentListItemId（列表里当前播放的歌曲的id），根据id来修改listdata里对应数据的isPlay，从而控制对应音乐的播放暂停和进度条等样式
      this.$store.commit("currentListItemId", this.itemData.id);
      if (this.itemData.isPlay == false) { // 如果当前音乐正在暂停状态
        let id = this.itemData.music[0].data[0].id;
        // 把当前要播放的歌曲的所有信息发送给公共的audio元素
        this.$store.commit("sendMusic", this.itemData.music[0]);
        // this.$store.commit('sendMusic',this.itemData.music[0].url[id]);
        // 提交播放请求
        this.$store.commit("play");
        // 告诉mutation，修改“当前音乐”对应的数据的isPlay为true
        this.$store.commit("changeListIsplay", {
          isPlay: true,
          index: this.itemData.id
        });
      } else { // 如果当前音乐正在播放状态
        this.$store.commit("pause"); // 提交暂停请求
        // 告诉mutation，修改“当前音乐”对应的数据的isPlay为false
        this.$store.commit("changeListIsplay", {
          isPlay: false,
          index: this.itemData.id
        });
      }
      // 如果当前已经有歌词，就执行歌词的播放/暂停切换；
      if (this.$store.state.currentLyric) {
        this.$store.state.currentLyric.togglePlay();
      }
    },
    // 转换时间的方法，传进来的时间 单位为秒
    timerFomart(time) {
      // 如果time为NaN，返回"00:00"
      if (isNaN(time)) return "00:00";      
      // 分：time/60是分，如果分大于9，就直接向下取整得到分位的数值；否则就在取整得到的结果前面加0（比如11和01）
      let min = time / 60 > 9 ? Math.floor(time / 60) : "0" + Math.floor(time / 60);
      // 秒：%取余，如果秒数大于9，就直接向下取整得到秒位的数值；否则就在取整得到的结果前面加0（比如11和01）
      let miao = time % 60 > 9 ? Math.floor(time % 60) : "0" + Math.floor(time % 60);
      // 比如280s => 04:04
      return min + ":" + miao;
    }
  }
};
</script>
<style>
.music-test .currentProgress {
  width: 0;
  height: 100%;
  background: red;
  position: absolute;
  top: 0;
  left: 5.7rem;
  background-color: skyblue;
  z-index: -1;
}
</style>



