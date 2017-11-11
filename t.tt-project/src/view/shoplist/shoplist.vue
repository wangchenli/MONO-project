<template>
  <div>
      <Shop-header></Shop-header>   
      <div id="main">
			<div class="sku-box store-content">
				<div class="sort-option">
					<ul class="line clear">
						<li><a href="javascript:;" class="active">综合排序</a></li>
						<li><a href="javascript:;" class="">销量排序</a></li>
						<li><a href="javascript:;" class="">价格低到高</a></li>
						<li><a href="javascript:;" class="">价格高到低</a></li>
					</ul>
				</div>
				<div class="gray-box">
					<div class="item-box">
						<shop-item  
                            v-for="item,index in shoplist"
                            key="index"
                            :item-data="item"
                        ></shop-item>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
    import ShopHeader from '@/components/shopHead'
    import ShopItem from '@/view/shoplist/shopitem'
    import Axios from 'axios'
    export default {
        data(){
            return{
                shoplist:[]
            }
        },
        components:{
            ShopHeader,
            ShopItem
        },
        mounted(){
            Axios.get('http://localhost:3100/api/list')
            .then((data) => {
                this.shoplist = data.data.list
            })
        }
    }
</script>
