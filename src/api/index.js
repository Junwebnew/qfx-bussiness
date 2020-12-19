
import $axios from '@/utils/http'


/**
 * 根据上级Id获取下级省市区
 */
export function recentApplyList(data) {
    return $axios.post('api-org/sycsarea/query/childlist?cityId=' + id)
}


/**
 * 获取公告期号 默认12期
 * */

export function noticeNumList(num = 12) {
    return $axios.post('/API/api-cs/cycle/web/list', { pageSize: num, pageNum: 1 })
}
