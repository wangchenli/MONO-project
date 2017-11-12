<template>
	<!-- 最外层div的类名不能确定，需要根据数据来判断添加哪个类名，在外面计算好属性传进来 -->
	<div>
		<div class="sign" v-if="this.itemData.type === '阅读'">
			<preview :list="[{'src':this.itemData.img_json.src,w:1000,h:1000}]" v-lazy="this.itemData.img_json.src">							
			</preview>
    </div>
		<div class="category" v-if="this.itemData.type === 'OWSPACE' || this.itemData.type === '微信'">
			<div class="topic">
				<preview :list="[{'src':this.itemData.img_json.src,w:1200,h:1200}]" v-lazy="this.itemData.img_json.src">
						<!-- <img v-lazy="this.itemData.img_json.src" /> -->
				</preview>
				<div>
						<i class="fa fa-quote-left" aria-hidden="true"></i>
				</div>							
			</div>
			<h2>{{this.itemData.img_json.img_title}}</h2>
			<p class="article">{{this.itemData.img_json.img_describe}}</p>
			<p class="border-bottom"></p>
		</div>
		<div class="banner" v-if="this.itemData.type === '创意'">
			<preview :list="[{'src':this.itemData.img_json.src,w:1000,h:1000}]" v-lazy="this.itemData.img_json.src" >
			</preview>
			<recommend-footer :itemData="this.itemData.thisItem" :index="this.index" :type="type"></recommend-footer>
		</div>
		<div class="category" v-if="this.itemData.type === '音乐'">
			<div class="topic">
				<preview :list="[{'src':songImg,w:1000,h:1000}]" v-if="this.itemData.music" v-lazy="songImg">						
				</preview>
				<re-play-bar :index="this.index" :itemData="this.itemData" :type="type"></re-play-bar>						
			</div>
			<h2>{{this.itemData.img_json.img_title}}</h2>
			<p class="article">{{this.itemData.img_json.img_describe}}</p>
			<p class="border-bottom"></p>
		</div>
	</div>
</template>
<script>
import recommendHeader from '@/components/recommend-item/recommend-header'
import recommendFooter from '@/components/recommend-item/recommend-footer'
import rePlayBar from '@/views/musicPlayer/re-playbar'
import Axios from 'axios'
import Preview from '@/components/preview/preview'  // 图片预览效果

export default {
	data(){
		return {
				// songImg:''
		}
	},
	components: {
		recommendHeader,
		recommendFooter,
		rePlayBar,
		Preview
	},
	props:['itemData','index','type'],
	computed: {
		songImg(){
				return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.itemData.music[0].data[0].album.mid}.jpg?max_age=2592000`
		}
	}
}
</script>
<style>
#app .content .topic {
  height: 25rem;
}
</style>

