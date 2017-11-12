<template>
	<div>
		<PubNav @alertTipShowPubNav="alertTipShowReco"></PubNav>
		<FooterNav></FooterNav>
	</div>
</template>

<script>
import PubNav from "@/views/recommend/pub-nav/pub-nav";
import FooterNav from "@/components/footer/footer";
export default {
  components: {
    PubNav,
    FooterNav
  },
  methods: {
    alertTipShowReco(flag) {
      console.log(flag, "我reco执行了");
      this.$emit("alertTipShowReco", flag);
    }
  }
};
</script>

