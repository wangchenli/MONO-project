<template>
    <li :class="{completed:option.selected}">
        <div class="view">
            <input class="toggle" type="checkbox" v-model="option.selected">
            <label>{{option.title}}</label>
            <button class="destroy" @click="removeList"></button>
        </div>
        <input class="edit" value="多多对对对">
    </li>
</template>

<script>
   export default {
       props:['option','index'],
       methods:{
           removeList(){
                this.$emit('remove-item',this.index)
           }
       }
   }
</script>