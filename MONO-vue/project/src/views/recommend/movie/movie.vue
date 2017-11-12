<template>
	<div :style="{'width': pinWidth+'px','overflow': 'hidden','float': 'left','background':'#fff'}">
		<div style="width: 100%;line-height: 500px;text-align: center;">            
			<MovieI></MovieI>            
		</div>
	</div>
</template>

<script>
import MovieI from "./movieI";
import Scroll from "@/components/scroll/index";
export default {
  data() {
    return {
      pinWidth: window.innerWidth
    };
  },
  components: {
    MovieI,
    Scroll
  }
};
</script>

<style>
.movie-page {
  width: 46rem;
  overflow: hidden;
  float: left;
}
</style>
