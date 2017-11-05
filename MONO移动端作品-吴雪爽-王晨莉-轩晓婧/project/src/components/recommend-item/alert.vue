<template>
  <div>
    <x-header></x-header>    
    <div v-transfer-dom>
      <actionsheet  v-model="showMenus" show-cancel></actionsheet>
    </div>
  </div>
</template>

<script>
import { XHeader, Actionsheet, TransferDom} from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Actionsheet
  },
  data () {
    return {      
      showMenus: false
    }
  }
}
</script>

<style>
#app .vux-header{
  height: 5.185rem!important;
  background: #ffffff;
}
#app .vux-header-left{
  height: 5.185rem;
  line-height: 5.185rem;
  font-size: 1.85rem;
  padding-left: 1.85rem;
}
/* #app .vux-header-left .left-arrow{
  
} */
.overwrite-title-demo {
  margin-top: 0.185rem;
}
</style>