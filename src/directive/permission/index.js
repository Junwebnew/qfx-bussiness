import hasRole from './hasRole'
import hasPermi from './hasPermi'
import drag from './drag'

const install = function (Vue) {
    Vue.directive('hasRole', hasRole)
    Vue.directive('hasPermi', hasPermi)
    Vue.directive('drag', drag)
}

if (window.Vue) {
    window['hasRole'] = hasRole
    window['hasPermi'] = hasPermi
    window['drag'] = drag
    Vue.use(install); // eslint-disable-line
}

export default install
