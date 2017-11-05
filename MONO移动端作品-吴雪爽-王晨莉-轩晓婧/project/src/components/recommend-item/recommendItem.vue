<template>
	<!-- 最外层div的类名不能确定，需要根据数据来判断添加哪个类名，在外面计算好属性传进来 -->
	<div :class="clsName" style="position:relative;">
		<!-- 这里是每个推荐模块的头部 -->
		<recommend-header :itemData="this.itemData" :index="this.index" :type="type"></recommend-header>
		<!-- 这里是每个推荐模块的中间部分，结构进行定制-->
		<recommend-middle :itemData="this.itemData" :index="this.index" :type="type"></recommend-middle>
		<!-- 这里是每个推荐模块的底部 -->
		<recommend-footer 
			v-if="!clsName.includes('kind3')" 
			:itemData="this.itemData.thisItem" 
			:index="this.index" 
			:type="type"
		></recommend-footer>
	</div>
</template>
<script>
	import recommendHeader from '@/components/recommend-item/recommend-header'
	import recommendMiddle from '@/components/recommend-item/recommend-middle'
	import recommendFooter from '@/components/recommend-item/recommend-footer'

	export default {
		components: {
			recommendHeader,
			recommendMiddle,
			recommendFooter
		},
		props:['itemData','index','type'],
		computed: {
			clsName(){
				if(this.itemData.type === '阅读'){
					return 'kind1 same'
				}else if(this.itemData.type === 'OWSPACE' || this.itemData.type === '微信'){
					return 'kind2 same'
				}else if(this.itemData.type === '创意'){
					return 'kind3 same'
				}else if(this.itemData.type === '音乐'){
					return 'kind4 same'
				}else if(this.itemData.type === 'MV'){
					return 'kind4 kind5 same'
				}else if(this.itemData.type === '其他'){
					return 'kind1 same'
				}
			}
		}
	}
</script>



