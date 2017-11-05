<template>
	<div :style="{'width': pinWidth+'px','overflow': 'hidden','float': 'left','background':'#fff'}">
		<div style="width: 100%;line-height: 500px;text-align: center;">
			<MusicI></MusicI>
		</div>
	</div>
</template>

<script>
import MusicI from "./musicI";
import Axios from "axios";
import Jsonp from "jsonp";
import MusiItem from "@/views/recommend/music/music-item";
import FooterNav from "@/components/footer/footer";
import PubNav from "@/views/recommend/pub-nav/pub-nav";

import api from "@/api/api.js"; // 请求数据的文件

export default {
  data() {
    return {
      pinWidth: window.innerWidth
    };
  },
  components: {
    MusicI
  }
};
</script>

<style>
.music-page {
  width: 46rem;
  overflow: hidden;
  float: left;
}
</style>
