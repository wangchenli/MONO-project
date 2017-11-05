<template>
  <div class="second-page" @touchmove="touchMoveFn">
		<h2 class="clearfix music-title" ref="titleBox">
			<p ref="titleP"></p>
			<div class="clearfix title-second">
				<router-link tag="i" class="fl fa fa-chevron-left" aria-hidden="true" to="/"></router-link>
				<span class="fl">{{listObj.column}}</span> 
				<i class="fr fa fa-ellipsis-h" aria-hidden="true"></i>
			</div>					
		</h2>
		<div class="secondImg-box" ref="secondImg">
			<img class="back-pic" :src="listObj.linkImg" />  
			<p class="the-subkey">
				<mark>MONO造物主</mark><br>
				<span>MONO诗+歌</span><br>
				<em><i>34124</i>人关注</em>
			</p>
			<img class="person-pic" :src="listObj.sub_img" /> 
			<p class="clearfix tools-person">
				<i class="fl fa fa-info-circle" aria-hidden="true"></i>
				<i class="fl fa fa-paypal" aria-hidden="true"></i>
				<span class="fr">
						<i class="fa fa-comments-o" aria-hidden="true"></i>
						<em>11181</em>
						讨论
				</span>
			</p>
		</div>	
		<div class="push-title">
			<h2>{{listObj.subTitle}}</h2> 
			<div class="botton-box">
				<button>+</button>
				<p class="clearfix">
					<span class="fl">推送提醒</span>
					<span class="fr">
							已开启
							<i class="fa fa-toggle-off" aria-hidden="true"></i>
					</span>
				</p>
			</div>
		</div>
		<div class="mine-content">
			<div :class="clsName" v-for="(item,index) in listObj.list" :key="index">
					<div class="clearfix creater">							
						<h2 class="fl">{{item.time}}</h2>
						<span class="fr" @touchstart="showPosition('bottom')">
								<i class="fa fa-link fa-rotate-90" aria-hidden="true"></i>
								{{listObj.type}}
						</span>
					</div>
					<div class="sign" v-if="listObj.type === '阅读'">
						<img :src="item.src" />
					</div>
					<div class="category" v-if="listObj.type === 'OWSPACE'">
						<div class="topic">
							<img :src="item.src" />
							<div>
									<i class="fa fa-quote-left" aria-hidden="true"></i>
							</div>							
						</div>
						<h2>{{item.img_title}}</h2>
						<p class="article">{{item.img_describe}}</p>
						<p class="border-bottom"></p>
					</div>
					<div class="banner" v-if="listObj.type === '创意'">
						<img :src="item.src" />
						<recommend-footer :itemData="item" :type="type"></recommend-footer>                      
					</div>
					<div class="category" v-if="listObj.type === '微信'">
						<div class="topic">
							<img :src="item.src" />							
							<re-play-bar :index="index" :itemData="itemData" :type="type"></re-play-bar>						
						</div>
						<h2>{{item.img_title}}</h2>
						<p class="article">{{item.img_describe}}</p>
						<p class="border-bottom"></p>																
					</div>
					<recommend-footer v-if="!clsName.includes('kind3')" :itemData="item" :type="type"></recommend-footer>    
			</div>
		</div>
  </div>
</template>

<script>
import recommendFooter from '@/components/recommend-item/recommend-footer'
import rePlayBar from '@/views/musicPlayer/re-playbar'
import Axios from 'axios'
import api from '@/api/api.js' // 请求数据的文件

export default {
	components: {
			recommendFooter,
			rePlayBar
	},     
	computed:{
		listObj:{
			get(){
					return this.$store.state.SecondData
			},
			set(){

			}                
		},
		clsName(){
			if(this.itemData.type === '阅读'){
					return 'kind1 same'
			}else if(this.itemData.type === 'OWSPACE' || this.itemData.type === '微信'){
					return 'kind2 same'
			}else if(this.itemData.type === '创意'){
					return 'kind3 same'
			}else if(this.itemData.type === '音乐'){
					return 'kind4 same'
			}else if(this.itemData.type === '生活'){
					return 'kind4 kind5 same'
			}else if(this.itemData.type === '其他'){
					return 'kind1 same'
			}
		},
		itemData(){					
			return this.listObj
		},
		type(){
			return this.listObj.type
		}
	},
	methods:{
		getRect(obj){ // 封装函数getRect，获取getBoundingClientRect
			return obj.getBoundingClientRect();
		},
		touchMoveFn(){
			if(this.getRect(this.$refs.secondImg).top < (-this.$refs.titleBox.offsetHeight) ){ // 如果该图片距离可视区域顶部的距离小于可视区的高度，说明还没有被加载
				this.$refs.titleP.style.backgroundColor = 'black'
			}else{
				this.$refs.titleP.style.backgroundColor = 'transparent'
			}
		},
		showPosition (position) {
			this.$store.commit('changeToastTipPosition',position)
			this.$store.commit('changeToastShowPositionValue',true)
		},
		getSecondData(){
			// 如果一开始公共状态里的listdata数组不为空，说明已经有数据了，不用再重复请求（重复请求会覆盖之前的交互修改的数据）
			if(this.$store.state.SecondData.id == this.$route.params.id){
				this.listObj = this.$store.state.SecondData
				return
			}
			api.getSecondData().then((data) => {
				let id = this.$route.params.id
				this.$store.commit('renderSecondData',data.data.data.list[id])
				this.$store.commit('changeHeartStateSecond',this.$store.state.ActionBarId)
				this.$store.commit('changeCollectStateSecond',this.$store.state.CollectId)
			})
		}			
	},
	mounted() { 
		this.getSecondData()
	}
}
</script>
<style>

</style>

