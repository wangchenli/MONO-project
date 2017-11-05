<template>
    <div>
        <x-header></x-header>    
        <div v-transfer-dom>
            <actionsheet  v-model="showMenus" show-cancel></actionsheet>
        </div>
        <img class="_404" src="../../../static/img/undefined.png"/>
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

