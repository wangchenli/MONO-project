<template>
  <div id="app">
    <router-view @alertTipShowReco="alertTipShowApp"></router-view>
    <!--播放器全局组件-->
    <music-player></music-player>
    <!-- 最近播放的音乐列表 -->
    <lataly-list></lataly-list>
    <!-- 音频标签 -->
    <audio src="" ref="audio" autoplay="autoplay" @canplay="musicCanPlay"  @timeupdate="musicTimeUpdate" preload @ended="musicEnded">
    </audio>
    <!-- VUX弹框组件 -->
    <actionsheet v-model="show7" :menus="menu7" theme="android" @on-click-menu="click"></actionsheet>
    <!-- VUX提示组件 -->
    <toast ref="w" v-model="showPositionValue" type="text" :time="5000" text="师傅，数据被妖怪抓走了" :position="position">{{ $t('Basic Usage') }}</toast>
  </div>
</template>

<script>
import FooterNav from "@/components/footer/footer";
import Jsonp from "jsonp";
import MusicPlayer from "@/views/musicPlayer/musicPlayer";
import LatalyList from "@/views/musicPlayer/latalyList";
import Axios from "axios";
import Base64 from "@/assets/js/base64.js";
import { Actionsheet, Toast } from "vux";
import { mapGetters } from "vuex";
let nav_data = [
  {
    title: "早午茶",
    touched: false,
    url: "http://localhost:3100/api/users",
    path: "/"
  },
  {
    title: "音乐",
    touched: false,
    url: "http://localhost:3100/api/music",
    path: "/music"
  },
  {
    title: "电影",
    touched: false,
    url: "http://localhost:3100/api/movie",
    // url:"https://api.douban.com/v2/movie/in_theaters",
    path: "/movie"
  },
  {
    title: "图书",
    touched: false,
    url: "http://localhost:3100/api/books",
    //url:"https://api.douban.com/v2/book/search?q=JavaScript权威指南&start=0&count=6",
    path: "/books"
  }
];

export default {
  name: "app",
  data() {
    return {
      // show7:false,
      s: false,
      // 弹框的内容
      menu7: {
        menu1: this.$t("朋友圈"),
        menu2: this.$t("微信"),
        menu3: this.$t("QQ/空间"),
        menu4: this.$t("新浪微博"),
        menu5: this.$t("复制链接"),
        menu6: this.$t("更多分享")
      },
      nav_data: nav_data
    };
  },
  components: {
    MusicPlayer,
    LatalyList,
    Actionsheet,
    Toast
  },
  computed: {
    showPositionValue: {
      get() {
        return this.$store.state.showPositionValue;
      },
      set(val) {
        // 打印出来看，发现val值被组件内置的行为设置为false，但是this.$store.state.showPositionValue仍然为原来设置的true，并没有同步，所以下次点击时不会走get
        // 因此把设置的val值同步给this.$store.state.showPositionValue
        this.$store.commit("changeToastShowPositionValue", val);
      }
    },
    position() {
      // 不是双向绑定，不用设置set
      return this.$store.state.tipPosition;
    },
    // 遇到的问题：第一次点击，获取值，true，设置值true；点击遮罩后，再点击，弹框不出现了
    show7: {
      get() {
        this.s = this.$store.state.alertTipShow;
        return this.s;
      },
      set(val) {
        // 打印出来看，发现点击遮罩，走设置值设置为false，但是this.$store.state.showPositionValue仍然为原来设置的true，并没有同步，所以下次点击时不会走get了
        // 因此把设置的val值同步给this.$store.state.alertTipShow
        this.$store.commit("changeAlertTipShow", val);
      }
    }
  },
  methods: {
    click() {},
    // 音乐播放
    alertTipShowApp(flag) {
      this.show7 = flag;
    },
    musicCanPlay() {
      this.$store.dispatch({
        type: "set_MusicDuration",
        duration: Math.floor(this.$refs.audio.duration)
      });
    },
    // 音乐播放时间更新事件
    musicTimeUpdate() {
      // 实时更新公共的currentTime状态
      this.$store.commit(
        "setCurrentTime",
        Math.floor(this.$refs.audio.currentTime)
      );
      // 修改进度条宽度
      this.$store.commit("setProgressWidth");
    },
    // 音乐播放结束后触发
    musicEnded() {}
  },
  mounted() {
    // 把audio元素发送给公共的audioDom状态
    this.$store.dispatch("sendAudio", this.$refs.audio);
  }
};
</script>



<style>
[v-cloak] {
  display: none;
}
.kind3 {
  padding: 0;
}
.kind3 .banner img {
  width: 100%;
}
.tagClient ul img {
  height: 100%;
}
.special,
.subject-term {
  width: 100%;
  overflow: hidden;
}
.find {
  width: 100%;
  overflow: hidden;
}
#app .vux-toast-bottom,
#app .vux-toast-middle,
#app .vux-toast-top {
  width: 29.63rem !important;
  height: 5.19rem;
  line-height: 5.19rem;
  border-radius: 3.7rem;
  background: rgba(22, 165, 175, 1);
  bottom: 5.56rem;
  padding: 0;
}
#app .weui-toast__content {
  text-align: center;
  -width: 29.63rem !important;
  height: 8.19rem;
  line-height: 4.19rem;
  color: #ffffff;
  font-size: 1.85rem;
}
#app .vux-toast-middle {
  background: lightcoral;
}
#app .vux-toast-top {
  top: 7.41rem;
  background: lightblue;
}
._404 {
  width: 100%;
  height: 81.78rem;
}
#app .vux-header {
  position: absolute;
  left: 0;
  top: 0;
  height: 5.19rem !important;
  background: transparent;
}
#app .vux-header-left {
  width: 14.81rem;
  height: 5.19rem;
  line-height: 5.19rem;
  font-size: 1.85rem;
  padding-left: 3.33rem;
}
.vux-header .vux-header-left .left-arrow:before {
  margin: 1.48rem 1.48rem 0;
  width: 1.85rem !important;
  height: 1.85rem !important;
}

#app .weui-mask_transparent {
  background: rgba(0, 0, 0, 0.8);
}
#app .weui-skin_android .weui-actionsheet {
  transform: translate(-50%, -50%) translateZ(0);
}
#app .weui-actionsheet__menu,
#app .weui-actionsheet {
  width: 46rem;
}
#app .weui-skin_android .weui-actionsheet__menu div {
  float: left;
  width: 33.33%;
  height: 11.11rem;
  line-height: 14.81rem;
  font-size: 1.85rem;
  letter-spacing: 0.15rem;
  color: #ffffff;
  text-align: center;
  background-size:5.61rem 5.61rem!important;
}
#app .weui-actionsheet__cell:before {
  border-top: 0;
}
#app .weui-actionsheet__menu div:nth-child(1) {
  background: url("/static/img/circleOfFriends.png") no-repeat center 0;
}
#app .weui-actionsheet__menu div:nth-child(2) {
  background: url("/static/img/WeChat.png") no-repeat center 0;
}
#app .weui-actionsheet__menu div:nth-child(3) {
  background: url("/static/img/QQ-Zone.png") no-repeat center 0;
}
#app .weui-actionsheet__menu div:nth-child(4) {
  background: url("/static/img/sinamicro-blog.png") no-repeat center 0;
}
#app .weui-actionsheet__menu div:nth-child(5) {
  background: url("/static/img/Copy-link.png") no-repeat center 0;
}
#app .weui-actionsheet__menu div:nth-child(6) {
  background: url("/static/img/More-share.png") no-repeat center 0;
}
</style>