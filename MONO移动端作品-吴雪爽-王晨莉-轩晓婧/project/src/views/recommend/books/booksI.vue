<template>
	<scroll ref="contentWrapper" :data="bookList">
		<div>
			<BooksItem 
				v-if="bookList"
				v-for = "item,index in bookList"
				:key = "index"
				:item = "item" :index = "index">								
			</BooksItem> 
		</div>
	</scroll>
</template>

<script>
import BooksItem from "@/views/recommend/books/books-item";
import api from "@/api/api.js"; // 请求数据的文件
import Scroll from "@/components/scroll/index";

export default {
  components: {
    BooksItem,
    Scroll
  },
  mounted() {
    this.$refs.contentWrapper.$el.style.height = window.innerHeight + "px";
    this.getBooksData();
  },
  methods: {
    getBooksData() {
      let _this = this;
      api.getBooksData().then(data => {
        _this.$store.commit("changeNavData", data.data);
      });
    }
  },
  computed: {
    bookList() {
      return this.$store.state.bookList;
    }
  }
};
</script>

