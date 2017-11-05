<template>
  <div>
    <div id="wrapper" ref="contentWrapper">
      <div class="content" ref="content" @touchend="touchEnd.call(this)">
        <div class="loading">
          <span v-if="gif">下拉刷新</span>
          <img v-else src="/static/img/pullLoding.gif" width="120" alt="">
        </div>
        <div class="morningtea">
          <p>
              <img src="../../assets/img/mortea.png" /> 
              <span>{{morningteaTime}}</span>
          </p>
          <p><span>MONO今日编辑精选</span></p>
          <div class="border"></div>
        </div>
          
        <recommend-item 
            v-for="item,index in listdata" 
            key="index"
            :itemData="item"
            :index="index"
        >                                      
        </recommend-item>
        <div class="floading" v-if="reloading">
          <img src="/static/img/pullLoding.gif" width="120" alt="">
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import BScroll from "better-scroll"; // 用来滚动的
import recommendItem from "@/components/recommend-item/recommendItem";
import Jsonp from "jsonp";
import Base64 from "@/assets/js/base64.js";
import Axios from "axios";
import api from "@/api/api.js"; // 请求数据的文件
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      y: 0,
      gif: true, // 控制“下拉刷新”提示的显示和隐藏
      reloading: false // 控制底部gif的显示隐藏
    };
  },
  props: ["nav_data"],
  components: {
    recommendItem
  },
  created() {
    if (this.$store.state.listdata.length !== 0) {
      return;
    } // 如果数组里已经有数据，不再重复获取，只在发生特定行为（比如下拉刷新和上滑加载时）去获取
    this.getList(); // 第一次一上来获取数据
  },
  mounted() {
    this.$refs.contentWrapper.style.height = window.innerHeight + "px";
    this.nextTick(); // 每次页面渲染完毕，都重新获取better-scroll要滚动的对象
  },
  methods: {
    touchEnd() {
      if (this.pullLoadingStart && this.y > 100) {
        setTimeout(function() {
          this.$refs.content.style.marginTop = 0;
        }, 30);
        // 下拉刷新
        this.loadingHandler();
        this.pullLoading = true;
        this.gif = false;
      }
    },
    // 下拉刷新，把向后端请求过来的数据 截取出前几条，提交mutaion，插入listdata的前面，以使刷新出来的数据显示在最前面
    loadingHandler() {
      api.getListData().then(data => {
        let d1 = data.data.data.list.slice(0, data.data.data.list.length - 3);

        // 循环当前的listdata数组，
        for (var i = 0; i < this.$store.state.listdata.length; i++) {
          if (this.$store.state.listdata[i].id === d1[0].id) {
            // 如果数组里已经有相同的数据，就不再插入，重新初始化better-scroll要滚动的对象
            setTimeout(() => {
              this.nextTick();
            }, 1000);
            return;
          }
        }
        this.$store.commit("RefreshListData", d1);
        api.getAllMusicListData(this.getAllMusicListDataCallBack.bind(this));
        setTimeout(() => {
          this.nextTick(); // 获取到新的数据并渲染新的结构之后再重新初始化better-scroll
        }, 1000);
      });
    },
    // 初始化better-scroll以及一些操作的函数
    nextTick() {
      var _this = this;
      _this.$nextTick(() => {
        var content = this.$refs.content;

        setTimeout(function() {
          if (_this.myScroll) {
            _this.myScroll.refresh();
            _this.floading = false;
            _this.reloading = false;
            _this.pullLoading = false;
            _this.gif = true;
            content.style.marginTop = "-5.65217391rem";
          } else {
            var wrapper = document.getElementById("wrapper");
            _this.myScroll = new BScroll(wrapper, {
              startX: 0,
              startY: 0,
              click: true,
              probeType: 3
            });
            _this.myScroll.on("scroll", pos => {
              _this.y = pos.y;
              if (pos.y > 100) {
                _this.pullLoadingStart = true;
              }
              if (
                !_this.floading &&
                pos.y < 0 &&
                -1 * pos.y + wrapper.offsetHeight - content.offsetHeight > 30
              ) {
                // 上拉加载
                api.getListData().then(data => {
                  let d1 = data.data.data.list.slice(
                    data.data.data.list.length - 3,
                    data.data.data.list.length
                  );
                  for (var i = 0; i < _this.$store.state.listdata.length; i++) {
                    if (_this.$store.state.listdata[i].id === d1[0].id) {
                      setTimeout(() => {
                        _this.nextTick();
                      }, 1000);
                      return;
                    }
                  }
                  _this.$store.commit("changeListData", d1);
                  api.getAllMusicListData(
                    _this.getAllMusicListDataCallBack.bind(_this)
                  );
                  setTimeout(() => {
                    _this.nextTick();
                  }, 1000);
                });
                _this.floading = true;
                _this.reloading = true;
              }
            });
          }
        });
      });
    },
    // 初始显示中间几条条数据
    getList() {
      api.getListData().then(data => {
        // 截取中间几条条数据
        let d1 = data.data.data.list.slice(4, data.data.data.list.length - 3);
        this.$store.commit("changeListData", d1);
        // 获取音乐数据
        api.getAllMusicListData(this.getAllMusicListDataCallBack.bind(this));
      });
    },
    getAllMusicListDataCallBack(err, data) {
      // 这里获取的是排行榜的众多音乐,data.songlist是想要的列表（数组）
      let _this = this;
      // 循环拿到的列表
      data.songlist.forEach(function(item) {
        api.getOneSongData(item.data.songmid, _this.getOneSongDataCallBack);
      });
      // if(this.$store.state.AllMusicList.length === 10){
      setTimeout(function() {
        _this.$store.commit("setListDataMusic");
      }, 1000);
    },
    getOneSongDataCallBack(err, data) {
      // 这里获取的data是单个歌曲的数据，包括url和id
      this.$store.commit("setAllMusicList", data); // 把拿到的每首歌曲的信息存放到公共的AllMusicList数组里
      this.nextTick();
    },
    ...mapMutations({
      setMPlayerScreen: "setMPlayerScreen"
    })
  },
  computed: {
    morningteaTime() {
      let d = new Date();
      let y = "" + d.getFullYear();
      return y.slice(2) + "." + (d.getMonth() + 1) + "." + d.getDate();
    },
    listdata() {
      return this.$store.state.listdata; // 下拉更新数据存放数组
    },
    downdata() {
      return this.$store.state.downdata; // 上拉更多的数据存放数组
    }
  }
};
</script>
<style>
#wrapper {
  float: left;
}
.morningtea p:nth-child(1) span {
  font-size: 3.96rem;
}
.content {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: -5.65217391rem;
}

/* 下拉刷新的loading */
.loading {
  width: 100%;
  height: 5.65217391rem;
  text-align: center;
  line-height: 5.65217391rem;
}

.floading {
  text-align: center;
  height: 3.7rem;
}
.function .red {
  color: #d95f57;
}

.function .blue {
  color: #a1dfe4;
}
</style>

