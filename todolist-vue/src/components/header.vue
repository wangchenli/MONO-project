<template>
  <header class="header" >
    <h1>todos</h1>
    <input 
        class="new-todo" 
        placeholder="请输入内容"
        @keydown.13="addToDo"
        v-model="val"
        
    />
  </header>
</template>

<script>
    export default {
        data(){
            return{
                val:''
            }
        },
        methods:{
            addToDo(){
                this.$emit('add-list',this.val)
                this.val = ''
            }
        }
    }
</script>