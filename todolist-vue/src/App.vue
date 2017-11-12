<template>
  <div id="app">
    <section class="todoapp">
      <custom-header @add-list="addListListener"></custom-header>
      <custom-content 
        :st="list"
        @remove="removeHandel"
        :checkAll="selectedAll"
        v-show="list.length"
        @all-select='allHandel'
      ></custom-content>
      <custom-footer :num="unselectedList" :st="list"></custom-footer> 
    </section>
  </div>
</template>

<script>
  import Header from './components/header'
  import Content from './components/content'
  import Footer from './components/footer'

  let data = [
    {
      title: '天气很好',
      selected: false
    },
    {
      title: '嗯嗯',
      selected: true
    }
  ]
  export default {
    name: 'app',
    data () {
      return{
        list: data
      }
    },
    components: {
      'custom-header': Header,
      'custom-content': Content,
      'custom-footer': Footer
    },
    methods:{
      addListListener(value){
        this.list.push({
          title:value,
          selected: false
        })
      },
      removeHandel(index){
        this.list.splice(index,1)
      },
      allHandel(val){
        this.list.forEach(item => {
          item.selected = val
        })
      }
    },
    computed:{
      selectedList(){
        return this.list.filter(item => item.selected)
      },
      unselectedList(){
        return this.list.length - this.selectedList.length
      },
      selectedAll(){
        return this.selectedList.length === this.list.length
      }
    }
  }
</script>