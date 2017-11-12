<template>
	<div :style="{'width': pinWidth+'px','overflow': 'hidden','float': 'left','background':'#fff'}">
		<div  style="width: 100%;height: 500px;line-height: 500px;text-align: center;">
			<BooksI></BooksI>
		</div>
	</div>
</template>

<script>
import BooksI from "./booksI";

export default {
  data() {
    return {
      pinWidth: window.innerWidth
    };
  },
  components: {
    BooksI
  }
};
</script>

<style>
.books-page {
  width: 46rem;
  overflow: hidden;
  float: left;
}
</style>

