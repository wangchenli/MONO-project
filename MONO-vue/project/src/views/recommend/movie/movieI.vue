<template>
	<scroll ref="contentWrapper" :data="movieList">
		<div>        
			<MovieItem 
        v-if = "movieList"
        v-for="item,index in movieList" 
        :key="index" 
        :item="item" 
        :index="index"
      ></MovieItem> 
		</div>
	</scroll>
</template>

<script>
import Jsonp from "jsonp";
import api from "@/api/api.js"; // 请求数据的文件
import MovieItem from "@/views/recommend/movie/movie-item";
import Scroll from "@/components/scroll/index";
export default {
  // props: ["nav_data"],
  components: {
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
      api.getMovieData().then(data => {
        console.log(data.data.data.list.subjects,"get-movie");
        _this.$store.commit("changeMovieData", data.data);
      });
    }
  },
  computed:{
    movieList() {
      return this.$store.state.movieList; 
    }
  }
};
</script>

