import Vue from 'vue'

import Cookies from 'js-cookie'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/qmx.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './utils/qmx' //挂载一起全局组件

import http from './utils/http' //引入封装的请求

import './assets/icons' // icon
import './permission' // permission control
import { getDicts, qmxDataKey } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import TakePhone from "@/components/TakePhone";
import SwitchForm from "@/components/SwitchForm";

//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.$axios = http
Vue.prototype.qmxDataKey = qmxDataKey

Vue.prototype.msgSuccess = function (msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
    this.$message.info(msg);
}

Vue.prototype.$eleLoading = function (ele) {
    return this.$loading({
        lock: true,
        target: ele
    });
}

//过滤器（缩小10倍）
Vue.filter('narrowTen', function (value) {

    if (isNaN(Number(value))) {
        return value
    } else {

        return (value / 10)
    }

})


// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('TakePhone', TakePhone)
Vue.component('SwitchForm', SwitchForm)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
