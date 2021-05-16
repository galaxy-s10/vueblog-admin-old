import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import app from './modules/app'
import user from './modules/user'


Vue.use(Vuex)

const store = new Vuex.Store({
    // namespaced:true, //在这里加命名空间是没用的。
    modules: {
        app,
        auth,
        user
    },


})

export default store