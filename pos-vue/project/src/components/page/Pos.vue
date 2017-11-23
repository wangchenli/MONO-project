<template>
  <div class="pos">
    <el-row>
      <el-col :span="7" class="pos-order" id="order-list">
        <el-tabs tabPosition="top">
          <el-tab-pane label="点餐">
            <el-table :data="tableData" border style="width:100%;">
              <el-table-column label="商品名称" prop="goodsName"></el-table-column>
              <el-table-column label="数量" prop="count"></el-table-column>
              <el-table-column label="金额" prop="price"></el-table-column>
              <el-table-column label="操作" fixed="right">
                <template scope="scope">
                  <el-button type="text" size="small">删除</el-button>
                  <el-button type="text" size="small">增加</el-button>       
                </template>
              </el-table-column>
            </el-table>  
            <div class="totle"> 
              <span>数量：{{totalCount}}</span>
              <span>金额：{{totalMoney}}</span>
            </div> 
            <div class="div-btn">
              <el-button type="warning">挂单</el-button>
              <el-button type="danger">删除</el-button>
              <el-button type="success">结账</el-button>
            </div>         
          </el-tab-pane>
          <el-tab-pane label="挂单">
            挂单
          </el-tab-pane>
          <el-tab-pane label="外卖">
            外卖
          </el-tab-pane>
        </el-tabs>  
      </el-col>
      <el-col :span="17">
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list">      
            <ul>
              <li v-for="item in oftenGoods" @click="addOrderList(item)">
                  <span>{{item.goodsName}}</span>
                  <span class="o-price">￥{{item.price}}元</span>
              </li>    
            </ul>
          </div>
        </div>

        <div class="goods-type">
          <el-tabs>
            <el-tab-pane label="汉堡">
              <ul class='cookList'>
                <li v-for="item in type0Goods" @click="addOrderList(item)">
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">￥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
              <ul class='cookList'>
                <li v-for="item in type1Goods" @click="addOrderList(item)">
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">￥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="饮料">
              <ul class='cookList'>
                <li v-for="item in type2Goods" @click="addOrderList(item)">
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">￥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="套餐">
              <ul class='cookList'>
                <li v-for="item in type3Goods" @click="addOrderList(item)">
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <span class="foodName">{{item.goodsName}}</span>
                  <span class="foodPrice">￥{{item.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>        
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'pos',
    data(){
      return{
        tableData: [],
        oftenGoods:[],
        type0Goods:[],
        type1Goods:[],
        type2Goods:[],
        type3Goods:[],
        totalCount:0,
        totalMoney:0
      }
    },
    created(){
      axios.get('http://jspang.com/DemoApi/oftenGoods.php')
      .then(response => {
        //console.log(response)
        this.oftenGoods=response.data;
      })
      .catch(error => {
        // console.log(error)
      })
      axios.get('http://jspang.com/DemoApi/typeGoods.php')
      .then(response => {
        // console.log(response)
        this.type0Goods=response.data[0];
        this.type1Goods=response.data[1];
        this.type2Goods=response.data[2];
        this.type3Goods=response.data[3];
      })
      .catch(error => {
        // console.log(error)
      })
    },
    mounted(){
      var orderHeight = document.body.clientHeight;
      document.getElementById('order-list').style.height = orderHeight + 'px';
    },
    methods:{
      addOrderList(item){
        this.totalCount=0; //汇总数量清0
        this.totalMoney=0;
        let isHave = false;
        //判断是否这个商品已经存在于订单列表
        for(var i=0; i<this.tableData.length; i++){
          if(this.tableData[i].goodsId === item.goodsId){
            isHave = true;
          }
        }
        if(isHave){
          let arr = this.tableData.filter(o => o.goodsId === item.goodsId)
          arr[0].count++
        }else{
          let newGoods = {
            goodsId:item.goodsId,
            goodsName:item.goodsName,
            price:item.price,
            count:1
          };
          this.tableData.push(newGoods)
        }
        this.tableData.forEach((i) => {
          this.totalCount += i.count; //汇总数量清0
          this.totalMoney += i.price*i.count;
        })
      }
    }
  }
</script>

<style>
  .pos .el-tabs__nav .el-tabs__item{
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
  }
  .totle{
    padding: 15px;
    font-size: 24px;
    color: #58B7FF;
  }
  .pos-order{
    background-color: #F9FAFC;
    border-right: 1px solid #C0CCDA;
  }
  .div-btn{
    margin-top: 10px; 
    text-align: center;
  }
  .title{
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    border-bottom:1px solid #D3DCE6;
    background-color: #F9FAFC;
   }
   .often-goods-list ul li{
    list-style: none;
    float:left;
    border:1px solid #E5E9F2;
    padding:20px;
    margin:20px;
    background-color:#fff;
   }
  .o-price{
    color:#58B7FF; 
   }
   .goods-type{
     clear: both;
   }
   .cookList li{
    list-style: none;
    width:21%;
    border:1px solid #E5E9F2;
    height: auto;
    overflow: hidden;
    background-color:#fff;
    padding: 10px;
    float:left;
    margin: 10px 20px; 
   }
   .cookList li span{       
      display: block;
      float:left;
   }
   .foodImg{
    width: 40%;
   }
   .foodName{
       font-size: 24px;
       padding-left: 10px;
       color:brown; 
   }
   .foodPrice{
       font-size: 24px;
       padding-left: 10px;
       padding-top:10px;
   }
</style>
