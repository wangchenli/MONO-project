<template>
  <div>
		<scroll ref="contentWrapper" style="padding-top:4.81481481rem;">
			<div class="find findWrapper">
				<div class="slideshow">
					<slide-show :imgList="this.$store.state.findData['Carousel-figure']"></slide-show>
				</div>

				<div class="subject-term">
					<h2>分类查看主题站</h2>
					<scroll>
						<div class="theme clearfix">
							<div v-for="item in this.$store.state.findData.Theme" @click="showPosition('middle')">
								<img :src="item" />
							</div>
						</div>
					</scroll>
					<!-- <toast v-model="showPositionValue" type="text" :time="800" text="2012，您要访问的页面已上船！" :position="position"></toast> -->
				</div>
				<div class="recommend-edit">
					<h2 class="clearfix more">
						<span class="fl">编辑推荐</span>
						<span class="fr">
							<router-link tag="b" to="/Un">更多</router-link>
							<i class="fa fa-angle-right" aria-hidden="true"></i>
						</span>
					</h2>
					<ul class="list">
						<li class="border" v-for="item,index in this.$store.state.findData.Recommend">
							<h3 class="clearfix">
								<span class="fl" @click="showPosition('middle')">{{item.title}}</span>
								<strong class="fr" :style="{background:!item.attentioned ? '#16a5af' : '#d7d7d7' }">
									<i :class="[{'fa fa-plus':!item.attentioned,'fa fa-check':item.attentioned}]" aria-hidden="true" @click="changeIco(item)"></i>
								</strong>
							</h3>
							<dl @click="showPosition('middle')">
								<dt class="fl">
									<img :src="item.src" />
									<span class="v">V</span>
								</dt>
								<dd class="fr">
									<p>{{item.describe}}</p>
									<div>
										<span>{{item.flow}}</span>/
										<i>{{item.type}}</i>
									</div>
								</dd>
							</dl>
						</li>
					</ul>
				</div>
				<div class="ranking-list">
					<h2>排行榜与反馈</h2>
					<scroll>
						<div class="theme clearfix">
							<div v-for="item in this.$store.state.findData.rankingTheme" @click="showPosition('top')">
								<img :src="item" />
								<!-- <p class="same-title">排行榜</p> -->
							</div>
						</div>
					</scroll>
				</div>
				<div class="slideshow show2">
					<slide-show :imgList="this.$store.state.findData['Carousel-figure']"></slide-show>
				</div>

				<div class="special">
						<h2 class="clearfix more">
								<span class="fl">编辑推荐</span>
								<span class="fr">
										<!-- <b></b> -->
										<router-link tag="b" to="/Un">更多</router-link>
										<i class="fa fa-angle-right" aria-hidden="true"></i>
								</span>
						</h2>
						<scroll>
								<div class="theme clearfix">
										<div v-for="item in this.$store.state.findData.specialTheme" @click="showPosition('middle')">
												<img :src="item" />
												<!-- <p class="same-title">24小时电影院</p> -->
										</div>
								</div>
						</scroll>
				</div>
				<div class="recommend-edit more-theme">
					<h2 class="clearfix more">
						<span class="fl">更多主题站</span>
					</h2>
					<ul class="list">
						<li class="border" v-for="item in this.$store.state.findData.MoreTheme">
							<h3 class="clearfix">
								<span class="fl" @click="showPosition('middle')">{{item.title}}</span>
								<strong class="fr" :style="{background:!item.attentioned ? '#16a5af' : '#d7d7d7' }">
									<i :class="[{'fa fa-plus':!item.attentioned,'fa fa-check':item.attentioned}]" aria-hidden="true" @click="changeIco(item)"></i>
								</strong>
							</h3>
							<dl @click="showPosition('middle')">
								<dt class="fl">
									<img :src="item.src" />
									<span class="v">V</span>
								</dt>
								<dd class="fr">
									<p>{{item.describe}}</p>
									<div>
											<span>{{item.flow}}</span>/
											<i>{{item.type}}</i>
									</div>
								</dd>
							</dl>
						</li>
					</ul>
					<p class="show-all">已显示全部内容</p>
				</div>            
			</div>            
		</scroll>
		<div class="seek">
			<input 
				type="text"
				placeholder="搜索你感兴趣的内容"
				@result-click="resultClick" i
				@on-change="getResult" 
				:results="results" 
				v-model="value" 
				position="absolute" 
				auto-scroll-to-top top="46px" 
				@input="onFocus" 
				@on-cancel="onCancel"
				@on-submit="onSubmit" 
				ref="search"
			/>
			<router-link to="/search">
					<i 
						class="fa fa-search" 
						aria-hidden="true"
						@touchstart.native="setFocus" type="primary"
					></i>
			</router-link>					
		</div>
		<Footer-nav></Footer-nav>
	</div>
</template>

<script>
import FooterNav from '@/components/footer/footer'
import SlideShow from '@/components/slide-show/slide-show'
import Scroll from '@/components/scroll/index' // 经过处理的better-scroll的可定制组件
import Axios from 'axios'
import api from '@/api/api.js' // 请求数据的文件
import {Toast, Search, Group, Cell, XButton } from 'vux'
export default {
	data() {
		return {
			position: 'default',
			showPositionValue: false,
			results: [],
			value: ''
		}
	},
	components: {
		FooterNav,
		SlideShow,
		Toast,
		Search,
		Group,
		Cell,
		XButton,
		Scroll
	},
	methods: {
		onCancel(){

		},
			// 提示信息的显示和隐藏
		showPosition (position) {
			this.$store.commit('changeToastTipPosition',position)
			this.$store.commit('changeToastShowPositionValue',true)
		},
		//发现搜索功能
		setFocus() {
			this.$refs.search.setFocus()
		},
		resultClick(item) {
			window.alert('you click the result item: ' + JSON.stringify(item))
		},
		getResult(val) {
			this.results = val ? getResult(this.value) : []
		},
		onSubmit() {
			this.$refs.search.setBlur()
			this.$vux.toast.show({
				type: 'text',
				position: 'top',
				text: 'on submit'
			})
		},
		onFocus() {
			if (this.value !== "") {                
				this.$store.commit("changeSearchVal", this.value);
			}
		},
		getSubjectTerm() {
			api.getSubjectTerm().then((data) => {
				this.$store.commit('changeFindData', data.data.data.list)
			})
		},
		changeIco(item) {
			this.$store.commit('changeIco', item)
		}
	},
	mounted() {
		this.$refs.contentWrapper.$el.style.height = window.innerHeight + "px";
		this.getSubjectTerm()
	}
}
function getResult(val) {
	let rs = []
	for (let i = 0; i < 20; i++) {
		rs.push({
			title: val,
			other: i
		})
	}
	return rs
}
</script>
<style>
.seek{
    position: absolute;
    top:0;
    left:0;
}
.vux-search_show {
    display: none;
}
.subject-term .theme{
    width:70rem;
}
.special .theme{
    width:114rem;
}
</style>