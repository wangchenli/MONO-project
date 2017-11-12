<template>
	<div>
		<x-header></x-header>    
		<div v-transfer-dom>
			<actionsheet  v-model="showMenus" show-cancel></actionsheet>
		</div>
    <div class = "search-content">
			<div>
				<section class="searchList">
					<ul id = 'movielist' class="clearfix">
						<search-item 
							v-for = "item,index in this.$store.state.navData" 
							:key = "index" 
							:item = "item" :index = "index">								
						</search-item>  
					</ul>
				</section>  
			</div> 
		</div>
		<Footer-nav></Footer-nav> 
	</div>
</template>

<script>
import Axios from "axios";
import FooterNav from "@/components/footer/footer";
import PubNav from "@/views/recommend/pub-nav/pub-nav";
import SearchItem from "@/views/recommend/search/search-item";
import api from "@/api/api.js"; // 请求数据的文件
import Jsonp from "jsonp";
import { XHeader, Actionsheet, TransferDom } from "vux";

export default {
  data() {
    return {
      showMenus: false
    };
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet,
    FooterNav,
    PubNav,
    SearchItem
  },
  mounted() {
    let _this = this;
    setTimeout(function() {
      _this.getSearchData();
    });
  },
  methods: {
    getSearchData() {
      //肖申克的救赎
      if (this.$store.state.searchVal === "") {
        this.$store.state.searchVal = "肖申克的救赎";
      }
      let currentSearchVal = this.$store.state.searchVal;
      let _this = this;

      Jsonp(
        `https://api.douban.com/v2/book/search?q=${currentSearchVal}&start=0&count=15`,
        {
          //param:'jsonpCallback'
        },
        function(err, data) {
          _this.$store.commit("changeNavData", data.books);
        }
      );
    }
  }
};
</script>
<style>
#movielist {
  margin-top: 4rem;
}
.search-content {
  padding: 0;
}
</style>
