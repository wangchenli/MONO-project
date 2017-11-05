<template>
	<div>
		<scroll ref="contentWrapper">
			<div class="cummunity">
				<div class="club">
					<h2 class="fl">社区</h2>
					<i class="fa fr fa-plus" aria-hidden="true"></i>
				</div>
				<div class="seek">
					<input type="text" value="搜索你感兴趣的内容"/>
					<i class="fa fa-search" aria-hidden="true"></i>					
				</div>
				<div class="special">
					<h2 class="clearfix more">
							<span class="fl">热门小组、活动</span>
							<span class="fr">
									<router-link tag="a" to="/Un">查看全部</router-link>
							</span>
					</h2>
					<scroll>
						<div class="theme clearfix">
							<div v-for="item in this.$store.state.comunityData.hotActive" @click="showPosition('top')">
									<img :src="item" />
									<!-- <p class="same-title">24小时电影院</p>
									<p class="person-num"><span>1234</span>人</p> -->
							</div>                
						</div>
					</scroll>
					<toast v-model="showPositionValue" type="text" :time="800" text="玩脱了，页面找不到了" :position="position"></toast>
				</div>
				<div class="more-groups">
					<h3>我参加的小组和活动</h3>
					<p @click="showPosition('middle')">还美参加任何小组和活动，点我发现更多<br>/^-^/</p>
				</div>
				<div class="slideshow">
					<slide-show :imgList="imgList"></slide-show>
				</div>
				<div class="diff-theme">
					<scroll>
						<div class="theme clearfix">
							<div  v-for="(item,index) in this.$store.state.comunityData.comunityTheme" @click="showPosition('bottom')" :key="index">
								<img :src="item" />
							</div>
						</div>
					</scroll>
				</div>	            		
			</div>
		</scroll>
		<Footer-nav></Footer-nav>
	</div>	
</template>

<script>
	import {Toast} from 'vux'
	import FooterNav from '@/components/footer/footer'
	import SlideShow from '@/components/slide-show/slide-show'
	import Axios from 'axios'
	import api from '@/api/api.js' // 请求数据的文件
	import Scroll from '@/components/scroll/index' // 经过处理的better-scroll的可定制组件

	export default {
		components:{
			FooterNav,
			SlideShow,
			Toast,
			Scroll
		},
		data () {
			return {
				position: 'default',
				showPositionValue: false
			}
		},
		methods:{
			showPosition (position) {
				this.position = position
				this.showPositionValue = true
			},
			getComunityData(){
				api.getComunityData().then((data) => {
					this.$store.commit('changeComunityData',data.data.data.list)
				})
			}
		},
		mounted() { 
			this.$refs.contentWrapper.$el.style.height = window.innerHeight + "px";
			this.getComunityData()
		},
		computed: {
			// 轮播图的图片数组
			imgList(){
				// 请求数据需要时间，所以一上来判断一下有没有数据，有的话再截取并返回
				return this.$store.state.comunityData.hotActive?this.$store.state.comunityData.hotActive.slice(0,6):''
			}
		}
	}
</script>
<style scoped="scoped">
#app .special .theme {
  width: 290rem;
}
</style>

