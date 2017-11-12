<template>
  <div class="footer_nav">
		<ul class="clearfix">            
			<router-link tag="li" class="trans" to="/recommend">
					<b>M</b>
					<span>推荐</span>
			</router-link> 
			<router-link tag="li" class="trans" to="/find">
					<b>O</b>
					<span>发现</span>
			</router-link>
			<router-link tag="li" class="trans" to="/alert">
					<b>N</b>
					<span>社区</span>
			</router-link>
			<router-link tag="li" style="margin: 0;" class="trans" to="/mine">
					<b>O</b>
					<span>我的</span>
			</router-link>
		</ul>
  </div>
</template>

<script>
export default {
		
}
</script>

<style>
.footer_nav li b {
  font-size: 2.03703704rem;
  display: block;
}
.footer_nav .router-link-active,
.footer_nav .blue {
  color: #16a5af;
}
</style>
