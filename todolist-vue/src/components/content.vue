<template>
    <section class="main">
        <input 
            class="toggle-all" 
            type="checkbox" 
            v-model="checkAllList"
        />
        <ul class="todo-list">
            <item 
                v-for="item,index in st"
                :key="index"
                :option='item'
                :index="index"
                @remove-item="removelist"
            ></item>
        </ul>
      </section>
</template>

<script>
    import item from './item'
    export default {
        components:{
            item
        },
        props:['st','checkAll'],
        methods:{
            removelist(index){
                this.$emit('remove',index)
            }
        },
        computed:{
            checkAllList:{
                get(){
                    return this.checkAll
                },
                set(val){
                    this.$emit('all-select',val)
                }
            }
        }
    }
</script>