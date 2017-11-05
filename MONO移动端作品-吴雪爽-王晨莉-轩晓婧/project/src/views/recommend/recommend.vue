<template>
	<div style="width: 1242px;overflow: hidden;float: left;">
		<div style="width: 100%;height: 500px;line-height: 500px;text-align: center;">
			recommend
		</div>
	</div>        
</template>

<script>
import PubNav from "@/views/recommend/pub-nav/pub-nav";
import FooterNav from "@/components/footer/footer";
import Scroll from "@/components/scroll/scroll";
import recommendItem from "@/components/recommend-item/recommendItem";
import Jsonp from "jsonp";
import Base64 from "@/assets/js/base64.js";
import Axios from "axios";
import api from "@/api/api.js"; // 请求数据的文件
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {};
</script>

