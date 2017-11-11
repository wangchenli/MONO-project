<template>
  <div class="item">
        <div>
            <div class="item-img">
                <img :alt="items.title" :src="items.ali_image" style="opacity: 1;">
            </div>
            <h6>{{items.title}}</h6>
            <h3>{{items.sub_title}}</h3>
            <div class="params-colors">
                <ul class="colors-list">
                    <li v-for="ico,i in icos" @mouseenter="index=i">
                        <a href="javascript:;" :class="{active: i==index}">
                            <img :src="ico">
                        </a>
                    </li>
                </ul>
            </div>
            <div class="item-btns clearfix">
                <span class="item-gray-btn">
                    <a href="javascript:;" target="_blank">查看详情</a> 
                </span>
                <span v-show="items.direct_to_cart" class="item-blue-btn" @click="addList">加入购物车 </span>
            </div>
            <div class="item-price clearfix">
                <i>¥</i><span>{{itemData.price}}.00</span>
            </div>
            <div class="discount-icon">false</div>
            <div class="item-cover">
                <a href="javascript:;" target="_blank"></a>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios'
    export default {
        props:['itemData'],
        data(){
            return{
                index:0
            }
        },
        computed:{
            items(){
                return this.itemData.sku_info[this.index]
            },
            icos(){
                let arr = [];
                this.itemData.sku_info.forEach((item) => {
                    
                    arr.push('http://img01.smartisanos.cn/'+item.spec_json[0].image+'20X20.jpg')
                })
                return arr;
            }
        },
        methods:{
            addList(){
                Axios.post(
                    'http://localhost:3100/api/setShopCarList',
                    {
                        carList: JSON.stringify(this.items)
                    }
                )
                .then((data) => {
                    this.$store.commit('changeSmallCarList',data.data)
                })
                
            }
        }
    }
</script>

