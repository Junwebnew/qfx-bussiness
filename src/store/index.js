import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import statusAA from './modules/status'
import otherData from './modules/other'
import getters from './getters'


Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tagsView,
        permission,
        settings,
        statusAA,
        otherData
    },
    getters
})

export default store
