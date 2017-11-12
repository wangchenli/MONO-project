<template>
	<div>
		<p class="transparency"></p>
		<p class="clearfix music-test">
			<!-- <span class="currentProgress" ref="currentProgress"  :style="{width:this.$store.state.progerssWidth}"></span> -->
			<!-- 不能在公共组件里设置样式，否则所有用到的地方都会有同样的样式，样式要交给“当前的”进度条 -->
			
			<i aria-hidden="true" @touchstart="play(index)" :class="playBtnCls" ref="playBtn"></i>
			<span class="currentProgress" ref="currentProgress" :style="{'width':progressWidth}"></span>
			<span  v-if="this.itemData.music">{{this.musicName}}</span>
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
    playBtnCls() {
      if (this.itemData.isPlay == false) {
        return "fa fa-play";
      } else {
        return "fa fa-pause";
      }
    },
    musicDuration() {
      if (this.itemData.isPlay == false) {
        if (this.itemData.music) {
          return this.itemData.music[0].data[0].interval;
        }
      } else {
        return this.getCurrentTime ? this.getCurrentTime : "00:00";
      }
    },
    progressWidth() {
      if (this.itemData.isPlay == false) {
        return 0;
      } else {
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
    // 点击播放按钮，执行这个函数，
    play(i) {
      this.$store.commit("sendProgressDom", this.$refs.currentProgress);
      // 根据数据里对应的这条数据的isPlay状态判断
      this.$store.commit("currentListItemId", this.itemData.id);
      if (this.itemData.isPlay == false) {
        let id = this.itemData.music[0].data[0].id;
        // 把当前要播放的歌曲的所有信息发送给公共的audio元素
        this.$store.commit("sendMusic", this.itemData.music[0]);
        // this.$store.commit('sendMusic',this.itemData.music[0].url[id]);
        this.$store.commit("play");
        this.$store.commit("changeListIsplay", {
          isPlay: true,
          index: this.itemData.id
        });
      } else {
        this.$store.commit("pause");
        this.$store.commit("changeListIsplay", {
          isPlay: false,
          index: this.itemData.id
        });
      }
      if (this.$store.state.currentLyric) {
        this.$store.state.currentLyric.togglePlay();
      }
    },
    timerFomart(time) {
      if (isNaN(time)) return "00:00";
      let min =
        time / 60 > 9 ? Math.floor(time / 60) : "0" + Math.floor(time / 60);
      let miao =
        time % 60 > 9 ? Math.floor(time % 60) : "0" + Math.floor(time % 60);
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



