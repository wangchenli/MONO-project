<template>
  <div class="clearfix">
    <div class="_books fl">
			<dl class="book_i fl">				
				<dd class="details fl">
					<div class="title clearfix">
						<h2 class="fl"><a :href = "item.alt" class = "fl"></a><h3>{{item.title}}</h3></h2>
					</div>
					<div class="doc">
						<p>名字：<span>{{item.author[0]}}/{{item.pubdate}}</span></p>
						<p>出版社：<span>{{item.publisher}}</span></p>
						<p>简介：<span>{{item.summary.slice(0,50)+'......'}}</span></p>
					</div>
				</dd>
				<dt class="picture fl">
					<a :href = "item.alt"><img :src="item.image" :alt="item.alt" class = "fl"></a> 					
				</dt>
			</dl>
		</div>
   </div>
</template>
<script>
export default {
  props: ["item", "index"]
};
</script>
