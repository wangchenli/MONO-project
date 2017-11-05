<template>
	<scroll ref="contentWrapper" :data="this.$store.state.navData.subjects">
		<div>        
			<MovieItem v-for="item,index in this.$store.state.navData.subjects" :key="index" :item="item"></MovieItem>                                       
		</div>
	</scroll>
</template>

<script>
import Jsonp from "jsonp";
import MovieItem from "@/views/recommend/movie/movie-item";
import Scroll from "@/components/scroll/index";
export default {
  // props: ["nav_data"],
  components: {
    // FooterNav,
    // PubNav,
    MovieItem,
    Scroll
  },
  mounted() {
    this.$refs.contentWrapper.$el.style.height = window.innerHeight + "px";
    this.getMovieData();
  },
  methods: {
    getMovieData() {
      let _this = this;
      Jsonp(
        `https://api.douban.com/v2/movie/in_theaters`,
        {
          //param:'jsonpCallback'
        },
        function(err, data) {
          console.log(data);
          _this.$store.commit("changeNavData", data);
        }
      );
    }
  }
};
</script>

