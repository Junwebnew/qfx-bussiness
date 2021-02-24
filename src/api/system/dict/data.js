
import $axios from '@/utils/http'

import Cookies from 'js-cookie'

//************************QMX************************ */

//获取数据字典
export function qmxListData() {

    return $axios.post('common/get/enums')
        .then(res => {

            Cookies.set('dictData', res.data)
            return res.data
        })

}
//获取数据字典Key
export function qmxDataKey(key) {

    return new Promise((resolve) => {

        let dataObj = Cookies.get('dictData')

        if (dataObj && dataObj != 'undefined') {

            if (key) {
                resolve(dataObj[key])
            }
            else {
                resolve(dataObj)
            }
        }
        else {
            qmxListData().then(res => {
                if (key) {
                    resolve(res[key])
                }
                else {
                    resolve(res)
                }
            })
        }
    })

}

//获取字典
export function getDictData(data) {
    data = data || { "pageNum": 1, "pageSize": 50 }
    return $axios.post(`back/dict/page/list`, data)
}

//设置字典
export function setDictData(data) {
    return $axios.post(`back/dict/saveorupdate`, data)
}

// 获取包年开启资源的设置
export function setYearResourse(data) {

    data = data || {
        "pageNum": 1,
        "pageSize": 30
    }
    return $axios.post(`resourceModuleYearCostConfig/page/list`, data)
}

// 添加或更新资源模块年费配置
export function updateYearResourse(data) {

    return $axios.post(`resourceModuleYearCostConfig/saveorupdate`, data)
}