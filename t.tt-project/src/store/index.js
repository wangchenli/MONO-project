import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        smallCarList: []
    },
    mutations:{
        changeSmallCarList(state,payload){
            state.smallCarList = payload.car_list
        }            
    }
})

export default store