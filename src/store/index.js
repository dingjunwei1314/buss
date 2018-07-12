import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import ticket from './modules/ticket'
import select from './modules/select'
import action from './modules/action'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        tagsView,
        ticket,
        select,
        action
    },
    getters
})

export default store