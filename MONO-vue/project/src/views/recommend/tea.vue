<template>
	<div :style="{'width': pinWidth+'px','overflow': 'hidden','float': 'left'}">
		<div style="width: 100%">
			<Home></Home>
		</div>
	</div>        
</template>

<script>
import Home from "@/views/recommend/home";

export default {
  data() {
    return {
      pinWidth: window.innerWidth
    };
  },
  components: {
    Home
  }
};
</script>

<style>

</style>