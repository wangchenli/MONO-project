<template>
	<div class="slide_wrap" @touchstart="preventDefaultFn($event)" @touchmove="preventDefaultFn($event)">
		<div class="tagClient" @touchstart="fnStart" @touchend="fnEnd" @touchmove="fnMove">
			<ul class="list" ref="list">
				<li v-for="(item,index) in picList" v-if="picList" :key="index">
					<img :src="item"/>
				</li>
				<li>
					<img :src="picList[0]" />
				</li>
			</ul>
		</div>
		
		<div class="circle" ref="circle">
			<div class="white" v-for="(item,index) in picList" v-if="picList" :key="index"></div>
		</div>
	</div>
</template>
<script>
// 获取当前屏幕的宽高
import Utils from "@/assets/js/utils.js"
function view(){
	return {
		w: document.documentElement.clientWidth,
		h: document.documentElement.clientHeight
	}
}
let data = ["../../../static/img/loading.gif"]
export default {
	data () {
		return {
			timer1:null,
			iStartTouchX:0,
			iStartX: 0,
			target: 0,
			iW:null,
			iNow:0,
			list:null,
			imgs:null
		}
	},
	computed: {
		// 轮播图的图片数组，因为请求数据需要时间，所以一上来判断一下有没有数据，没有的话就显示loading的gif图
		picList(){
			// 如果imgList存在，就返回
			if(this.imgList){
				return this.imgList
			}else{
				// 否则返回loading的gif图
				return data
			}			
		}
	},
	props:['imgList'],
	mounted(){
		this.autoPlay();
		this.list = this.$refs.list; // 众多图片的父容器		
		this.imgs = this.list.getElementsByTagName('img'); // 所有img
		this.iW = this.imgs[0].offsetWidth; // 获取每个图片的宽度
		this.circle = this.$refs.circle; // 小按钮的父容器
		this.circle.style.marginLeft = -this.circle.offsetWidth/2 + 'px'; // 设置margin-left为负值以使该容器居中		
		this.circles = this.circle.getElementsByTagName('div'); // 所有小按钮
		this.circles[0].classList.add('active'); // 默认第一个小按钮高亮
	},
	methods: {
		autoPlay(){
			// 因为定时器里的this指向window（严格模式下undefined），所以在这里存一下this（当前组件）
			let that = this;
			this.timer1 = setInterval(function(){
				that.iNow++; // 索引值不断自增
				that.fnTab(); // 调用轮播的函数
			},2000)
		},
		fnStart(ev){
			ev = ev.changedTouches[0]; // 触发当前事件的手指列表，取第一个即可
			this.iStartTouchX = ev.pageX; // 手指按下的坐标
			console.log(ev,'this.iStartTouchX')
			this.iStartX = this.target;
			clearInterval(this.timer1);			
		},
		fnMove(ev){
			ev = ev.changedTouches[0];
			
			let disI = ev.pageX - this.iStartTouchX;	 // 手指在屏幕上移动的距离
			
			this.target = this.iStartX + disI; // 图片移动的距离等于起始位置加上手指在屏幕上移动的距离
			Utils.mTween(this.list,"left",this.target,2,"linear");
		},
		fnEnd(ev){
			this.iNow = Math.abs(this.target/this.iW); // 手指拖动的距离除以屏幕的宽度，来判断松开手指之后，如果拖动距离比较大，就显示下一张，否则显示当前这张
			this.iNow = Math.round(this.iNow);
			if(this.iNow < 0){
				this.iNow = 0;
			}
			if(this.iNow > this.imgs.length - 1){
				this.list.style.left = '0px';  //瞬间移回第一张
				this.iNow = 0;  //把下标设置为0，重新开始 
			}
			this.fnTab();
			this.autoPlay();
		},
		// 轮播的函数
		fnTab(){
			this.target = -this.iW * this.iNow;  //按照下标的值移动图片
			let that = this;
			Utils.mTween(that.list,"left",this.target,500,"linear",function (){
				// 判断this.iNow的值是否等于最后一张图片的下标，如果等于，最后一张图片运动结束
				if(that.iNow == that.imgs.length - 1){ //如果n的值等于最后一张图片的下标，说明到了最后一张
					that.list.style.left = '0px';  //瞬间移回第一张
					that.iNow = 0;  //把下标设置为0，重新开始
				}				
				//当每张图片运动结束之后，再控制相应下标的小按钮切换				
				for(var i = 0; i < that.circles.length; i++){
					that.circles[i].classList.remove('active');  //清空所有小按钮的样式
				}
				that.circles[that.iNow].classList.add('active');  //给小按钮添加相应的样式
			})	
		},
		// 阻止浏览器的默认事件
		preventDefaultFn(ev){
			ev.preventDefault();
		}
	}
}
</script>
<style>
	#app .slideshow .circle{
		left:50%;
		padding:0;
	}
	#app .slide_wrap .list{
		width:800%;
	}
	.slideshow .circle .white:last-child{
		margin-right:0;
	}
	.slide_wrap{
		height: 100%;
	}
	.slide_wrap .list {
		list-style: none;
		margin: 0px;
		padding: 0;
		width: 600%;
		height: 100%;
		-overflow: hidden;
		position: absolute;
		left: 0;
		top:0;
	}
	.slide_wrap .list li{
		height:100%;
		float: left;
		width:46rem;
	}
	.slide_wrap .list img {
		width:46rem;
	}
	.slide_wrap .tagClient {
		width: 100%;
		height:100%;
		position: relative;
		overflow: hidden;
	}
	.slide_wrap .circle div.active{
		background-color: skyblue;
	}
</style>


