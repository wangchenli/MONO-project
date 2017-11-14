<template>
	<scroll ref="contentWrapper" :data="this.$store.state.AllMusicList">
		<div>
			<div class="kink4 same" v-for="item,index in this.$store.state.AllMusicList " :key="index">
				<!-- 这里是每个推荐模块的头部 -->
				<div class="clearfix creater" @touchstart="showPosition('bottom')">
					<img src="/static/img/5001.png" class="fl"/>
					<h2 class="fl" >不听歌会死</h2>
					<span class="fr" @click="showPosition('bottom')">
						<i class="fa fa-link fa-rotate-90" aria-hidden="true"></i>
						音乐
					</span>
					<!-- <toast ref="w" v-model="showPositionValue" type="text" :time="500" text="雾霾太大，连页面都看不到了" :position="position">{{ $t('Basic Usage') }}</toast> -->
				</div>
				<!-- 这里是每个推荐模块的中间部分，结构进行定制，在这里放一个插槽 -->
				<!-- <slot name="middle-slot">
					<div class="sign">
						<img src="../assets/img/riqian.png" />
					</div>
				</slot> -->
				<!-- <div id="m" ref="m"></div> -->
				<div class="category">
					<div class="topic" @click="showPosition('middle')">
						<!-- <preview :list="[{'src':'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.data[0].album.mid+'.jpg?max_age=2592000',w:1000,h:1000}]"> -->
						<img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.data[0].album.mid+'.jpg?max_age=2592000'"/>
						<!-- </preview> -->
											
					</div>
					<div class="clearfix" @click="showPosition('bottom')">
						<h2 class="fl" style="margin-right:5rem;font-size:2rem;">{{item.data[0].name}}</h2>
						<p class="article fl" style="font-size:2rem;  line-height:3.7037037rem;padding-top: 1.48148148rem;">{{item.data[0].singer[0].title}}</p>
						<p class="fr"  style="margin-right:0.5rem; line-height:3.7037037rem;font-size:1.7rem;padding-top: 1.48148148rem;">{{item.data[0].album.time_public}}</p>
					</div>
					
				</div>
			</div>
		</div>
	</scroll>
</template>

<script>
import Axios from "axios";
import Jsonp from "jsonp";
import MusiItem from "@/views/recommend/music/music-item";
import FooterNav from "@/components/footer/footer";
import PubNav from "@/views/recommend/pub-nav/pub-nav";

import api from "@/api/api.js"; // 请求数据的文件
import { Toast } from "vux";
import rePlayBar from "@/views/musicPlayer/re-playbar";
import Scroll from "@/components/scroll/index";

export default {
  data() {
    return {
      position: "default",
      showPositionValue: false
    };
  },
  props: ["nav_data"],
  components: {
    FooterNav,
    MusiItem,
    PubNav,
    Toast,
    rePlayBar,
    Scroll
  },
  mounted() {
    this.$refs.contentWrapper.$el.style.height = window.innerHeight + "px";
    this.getdatalist();
  },
  methods: {
    // showPosition(position) {
    //   this.position = position;
    //   this.showPositionValue = true;
    // },
    // 提示信息的显示和隐藏
    showPosition (position) {
      this.$store.commit('changeToastTipPosition',position)
      this.$store.commit('changeToastShowPositionValue',true)
    },
    getdatalist() {
      api.getAllMusicListData(this.getAllMusicListDataCallBack.bind(this));
    },
    getAllMusicListDataCallBack(err, data) {
      // 这里获取的是排行榜的众多音乐,data.songlist是想要的列表（数组）
      // 转成数组，循环数组，分别拿到每首歌曲的详细信息
      // let arr = []
      // _this.$store.commit('setAllMusicList',data); // 把拿到的每首歌曲的信息存放到公共的AllMusicList数组里
      // let _this = this;
      // console.log(this, 'this')
      let _this = this;
      data.songlist.forEach(function(item) {
        // console.log(_this, 'this')
        api.getOneSongData(item.data.songmid, _this.getOneSongDataCallBack);
        // console.log(item.data.songmid,'songmid')
      });
    },
    getOneSongDataCallBack(err, data) {
      // 这里获取的data是单个歌曲的数据，包括url和id
      // let id = data.data[0].id; // 在每首歌曲的详细信息里可以拿到该歌曲的id，通过id拿歌曲地址和歌词

      // let d2 = data; // 每首歌的信息是一个对象，存一下
      this.$store.commit("setAllMusicList", data); // 把拿到的每首歌曲的信息存放到公共的AllMusicList数组里
      // console.log('我请求道首页歌曲数据了')
    }
  }
};
</script>
<style scoped="scoped">
.topic {
  height: 24rem;
}
.category h2 {
  font-size: 2.2rem;
}
.category .article {
  font-size: 1.8rem;
}
.border-bottom {
  font-size: 1.3rem;
}
</style>	
