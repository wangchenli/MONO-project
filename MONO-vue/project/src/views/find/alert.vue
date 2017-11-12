<template>
  <div>
    <search
        @result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="value"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"
    ></search>
    <div style="padding:0px;">
      <x-button @click.native="setFocus" type="primary">set focus</x-button>
    </div>
     <group>
      <cell title="static position demo" is-link link="/component/search-static"></cell>
    </group> 
  </div>
</template>

<script>
import { Search, Group, Cell, XButton } from 'vux'

export default {
  components: {
    Search,
    Group,
    Cell,
    XButton
  },
  methods: {
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    getResult (val) {
      this.results = val ? getResult(this.value) : []
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    onFocus () {
      console.log('on focus')
    },
    onCancel () {
      console.log('on cancel')
    }
  },
  data () {
    return {
      results: [],
      value: 'test'
    }
  }
}

function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>

<style>
.seek input{
    width: 44rem;
    height: 3.40740741rem;
    background: #ffffff;
    border-radius: 0.37037037rem;
    text-indent: 16.07407407rem;
    font-size: 1.48148148rem;
    color: #7f7f7f;
}
#app .weui-search-bar{
  width: 46rem;
  height: 4.81481481rem;
  padding: 0.74074074rem 1rem;
  background: #232427;
  position: relative;
}
#app .weui-search-bar__form{
   border-radius: 0.37037037rem;
}
#app .weui-icon-search{
    font-size: 1.85rem;
    line-height: 3.41481481rem;
}
#app .weui-search-bar__box{
    padding-left: 80px;
}
#app .weui-search-bar__input{
    width: 36rem;
    height: 2.81481481rem;
    line-height: 3.81481481rem;
    background: #ffffff;
    -text-indent: 16.07407407rem;
    font-size: 1.48148148rem;
    color: #7f7f7f;
}
#app .weui-icon-clear{
    font-size: 1.85rem;
    line-height: 3.41481481rem;
}
#app .weui-search-bar__cancel-btn{
    font-size: 1.25rem;
    line-height: 3.41481481rem;
    color: #ffffff;
}
#app .weui-cell{
    height: 80px;
    font-size: 30px;
}
</style>
