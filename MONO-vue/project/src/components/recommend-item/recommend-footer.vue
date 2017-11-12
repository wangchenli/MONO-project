<template>
	<div>
		<ul class="function clearfix">
			<li class="fl fa fa-share-square-o" aria-hidden="true" @click="fn">                             
			</li>
			<li @touchstart="collect()" :class="['fa','fa-heart-o',{'red':itemData.actionBar.isCollect}]" aria-hidden="true"></li>
			<li @touchstart="liked()" :class="['fa','fa-thumbs-o-up',{'blue':itemData.actionBar.thumbsUp}]" aria-hidden="true">
					<span>{{itemData.actionBar.fabulous}}</span>
			</li>
			<li class="fa fa-commenting-o" aria-hidden="true" @touchstart="showPosition('bottom')">
					<span>{{itemData.actionBar.comment}}</span>
			</li>
			<li class="fa fa-ellipsis-h fr lastone" aria-hidden="true" @touchstart="showPosition('bottom')"></li>
		</ul>        
	</div>    
</template>
<script>
  import {Actionsheet,Toast} from 'vux'
	export default {
		components: {
			Actionsheet,
			Toast
		},
		data() {
			return {
				isChecked: false,
				isThumbsUp: false
			}
		},
		props: ['itemData', 'index', 'type'],
		methods: {
			// 提示信息的显示和隐藏
			showPosition (position) {
				this.$store.commit('changeToastTipPosition',position)
				this.$store.commit('changeToastShowPositionValue',true)
			},
			liked() {
				this.$store.commit('changeHeartState', this.itemData)
				if (this.$store.state.SecondData) {
						this.$store.commit('changeHeartStateSecond', this.$store.state.ActionBarId)
				}
			},
			collect() {
				this.$store.commit('changeCollectState', this.itemData)
				if (this.$store.state.SecondData) {
						this.$store.commit('changeCollectStateSecond', this.$store.state.CollectId)
				}
			},
			fn(){
				this.$store.commit('changeAlertTipShow',true)
			}
		}
	}
</script>

<style>

</style>


