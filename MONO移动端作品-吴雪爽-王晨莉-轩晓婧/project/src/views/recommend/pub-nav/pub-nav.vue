<template>
	<div class="nav">		
		<ul  class="clearfix" id = "navAs">
			<li class="nav-li">
				<a href="javascript:;" @click="jump(0)" :class="{'blue': index==0}">早午茶</a>
			</li>
			<li class="nav-li">
				<a href="javascript:;" @click="jump(1)" :class="{'blue': index==1}">音乐</a>
			</li>
			<li class="nav-li">
				<a href="javascript:;" @click="jump(2)" :class="{'blue': index==2}">电影</a>
			</li>
			<li class="nav-li">
				<a href="javascript:;" @click="jump(3)" :class="{'blue': index==3}">图书</a>
			</li>
		</ul>
		<div class="music" @click="setMPlayerScreen(true)"><img src="../../../assets/img/music.png" /></div>
        <!-- 是否滑动 
             boxNum：代表有几个路由组件
             marginLeft：偏移量
        -->
		<div :class="[{'shift': isMove},'clearfix']" :style="{width: boxNum * pinWidth + 'px', marginLeft: marginLeft + 'px'}"
			@touchstart="start($event)"
			@touchmove="move($event)"
			@touchend="end($event)"	
		>
			<!-- 四个路由组件放置的地方 -->
			<Tea></Tea>			
			<Music></Music>
			<Movie></Movie>
			<Books></Books>
		</div>
	</div>
</template>

<script>
import Tea from "@/views/recommend/tea";
import Books from "@/views/recommend/books/books";
import Music from "@/views/recommend/music/music";
import Movie from "@/views/recommend/movie/movie";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      pinWidth: window.innerWidth,
      tabNum: 1, // tab 切换的页面宽度 ( 通过接口的数据计算 )
      index: 0, // 选中了第几个选项卡
      boxNum: 1, // 容器宽度
      marginLeft: 0, // 偏移量
      isMove: true, // 是否在滑动
      startX: 0,
      startY: 0,
      moveX: 0,
      movrY: 0,
      endX: 0,
      endY: 0,
      m_sX: 0,
      m_sY: 0,
      e_sX: 0,
      e_xY: 0,
      sML: 0
    };
  },
  methods: {
    ...mapMutations({
      setMPlayerScreen: "setMPlayerScreen"
    }),
    jump(index) {
      this.index = index;
    },
    start(ev) {
      // ev.stopPropagation();
      this.isMove = false;
      this.startX = ev.changedTouches[0].clientX;
      this.startY = ev.changedTouches[0].clientY;
      this.sML = this.marginLeft;
    },
    move(ev) {
      // ev.stopPropagation();
      this.moveX = ev.changedTouches[0].clientX;
      this.moveY = ev.changedTouches[0].clientY;
      this.m_sX = this.moveX - this.startX;
      this.m_sY = this.moveY - this.startY;
      var marginLeft = this.sML + this.m_sX;

      marginLeft = marginLeft > 0 ? 0 : marginLeft;
      marginLeft =
        marginLeft < this.pinWidth - this.boxNum * this.pinWidth
          ? this.pinWidth - this.boxNum * this.pinWidth
          : marginLeft;
      this.marginLeft = marginLeft;
    },
    end(ev) {
      this.isMove = true;
      if (
        Math.abs(this.m_sX) > Math.abs(this.m_sY) &&
        Math.abs(this.m_sX) > 60
      ) {
        var multiple = this.m_sX > 0 ? -1 : 1;
        var index = this.index + multiple;
        index = index < 0 ? 0 : index;
        index = index > this.boxNum - 1 ? this.boxNum - 1 : index;
        this.index = index;
      } else {
        this.marginLeft = 0 - this.index * this.pinWidth;
      }
    }
  },
  mounted() {
    //路由组件的数量
    this.boxNum = 4;
  },
  components: {
    //组件的名称
    Tea,
    Music,
    Movie,
    Books
  },
  watch: {
    index: function(newValue, oldValue) {
      this.marginLeft = 0 - this.index * this.pinWidth;
    }
  }
};
</script>

<style scoped="scoped">
.nav {
  padding: 0;
  /* position: relative;
		z-index: 99; */
}
.nav ul {
  position: relative;
  z-index: 102;
  background: #000;
  /* width:100%; */
}
.nav .nav-li {
  float: left;
  padding: 0 2rem;
  height: 5.18518519rem;
}

.nav .blue {
  color: #16a5af;
}
.nav .music {
  z-index: 102;
}
/* #headed{
		width: this.pinWidthpx;
		overflow: hidden;
	} */
.shift {
  transition-property: margin-left;
  transition-duration: 1s;
  position: relative;
  z-index: 100;
}
.content {
  padding: 0;
}
</style>