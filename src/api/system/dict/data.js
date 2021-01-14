
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