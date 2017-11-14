<template>
  <transition name="swing">
		<!-- latalyListShow决定播放列表的显示隐藏 -->
    <div class="lataly-play" v-show="this.$store.state.latalyListShow">
			<h2 class="clearfix music-title">
				<i class="fl fa fa-chevron-left" aria-hidden="true"  @touchstart="setLatalyListShow(false)"></i>
				<span class="fl">最近播放</span>
				<i class="fr fa fa-trash-o" aria-hidden="true"></i>
			</h2>
			<div class="play-box">
				<p class="clearfix play-all">
					<i class="fl fa fa-play-circle-o" aria-hidden="true"></i>
					<span class="fl">播放全部歌曲</span>
				</p>
				<ul class="music-list">
					<!-- 播放列表根据musicList生成 -->
					<!-- 点击li，执行selectSong切换歌曲；如果index和currentLi相等，那么这个li就高亮 -->
					<li v-for="(item,index) in this.$store.state.musicList" :key="index" @click="selectSong(item,index)" :class="{active:index === currentLi}">
							<h2>{{item.data[0].name}}</h2>
							<p><span>{{item.data[0].singer[0].name}}</span>●来自主<em>不听歌会死</em>主题站</p>
					</li>
				</ul>					
			</div>
    </div>
  </transition>
</template>
<script>
import {  mapMutations } from 'vuex'

export default {
	data(){
		return {
			currentLi:null
		}
	},	
	methods:{
		...mapMutations({
			// 根据状态控制列表的显示和隐藏
			setLatalyListShow: 'setLatalyListShow' // 将this.setLatalyListShow() 映射为 this.$store.commit('setLatalyListShow')
		}),
		// 点击列表里的歌名，切换歌曲
		selectSong(item,index){
			// 通过setCurrentMusicIndex修改当前音乐的下标，来修改当前音乐currentSong，currentSong改变，会自动获取对应的歌词
			this.$store.commit('setCurrentMusicIndex',index);
			// 设置currentLi，用来使当前被点击的li高亮
			this.currentLi = index;
		}
	}
}
</script>
<style scoped="scoped">
.fa-chevron-left{
	padding-right: 3rem;
	margin-right: 9.55555556rem
}
.lataly-play{
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100;
}
.swing-enter-active {
	animation: pulse .8s;
}
.swing-leave-active {
	animation: pulseOut .8s;
}

@keyframes pulse {
		from {
			transform: scale3d(1, 1, 1);
		}

		50% {
			transform: scale3d(1.2, 1.2, 1.2);
		}

		to {
			transform: scale3d(1, 1, 1);
		}
}

@keyframes pulseOut {
		from {
			transform: scale3d(1, 1, 1);
		}

		50% {
			transform: scale3d(1.05, 1.05, 1.05);
		}

		to {
			transform: scale3d(0, 0, 0);
		}
}

.swing {
transform-origin: top center;
animation-name: swing;
}
.music-list li.active h2{
	color:#0e7088;
}
</style>

