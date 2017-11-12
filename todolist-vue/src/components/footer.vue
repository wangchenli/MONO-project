<template>
    <footer class="footer" v-show="st.length">
        <span class="todo-count">
            <strong>{{num}}</strong>
            <span>条未选中</span>
        </span>
    </footer> 
</template>

<script>
    export default {
        props:['num','st']
    }
</script>