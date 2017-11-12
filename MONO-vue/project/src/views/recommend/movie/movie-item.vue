<template>
  <div>
    <section class="searchList clearfix">
      <div class="_interesting fl">
        <dl class="interest fl">
          <dt class="picture fl">
            <img src="/static/img/error.jpg">
          </dt>
          <dd class="details fl">
            <div class="title clearfix">
              <h2 class="fl">{{item.title.slice(0,8)}}</h2>
            </div>
            <div class="doc">
              <p>别名：<span>{{item.original_title.slice(0,10)}}</span></p>
              <p>导演：<span>{{item.casts[0].name}}</span></p>
              <p>年份：<span>{{item.year}}</span></p>						
              <p>类型：<span v-for = "item1,index1 in item.genres" :key = "index1">{{item1}}</span></p>
              <p>评分：<span>{{item.rating.average}}</span>分</p>
            </div>
          </dd>
        </dl>
      </div>
    </section>  
   </div>
</template>

<script>
export default {
  props: ["item"]
};
</script>
<style>

</style>

