
import $axios from '@/utils/http'

/**
 * 近日申请商标分页查询 关联电话分页查询
 */
export function recentApplyList(data) {
    return $axios.post('resource/trademark/page/listForPhone', data)
}

/**
 * 近日申请商标详情
 */
export function recentApplyDetail(id) {
    return $axios.post('resource/trademark/get', '"' + id + '"')
}


/**
 * 续展 关联电话分页查询
 */
export function renewalList(data) {
    return $axios.post('resource/continues/page/listForPhone', data)
}

/**
 * 续展商标详情
 */
export function renewalrDetail(id) {
    return $axios.post('resource/continues/get', '"' + id + '"')
}


/**
 * 申请人变更 关联电话分页查询
 */
export function changeList(data) {
    return $axios.post('resource/change/page/listForPhone', data)
}

/**
 * 申请人变更 详情
 */
export function changeDetail(id) {
    return $axios.post('resource/change/get', '"' + id + '"')
}


/**
 * 代理结构注销 关联电话分页查询
 */
export function agencyCancelList(data) {
    return $axios.post('resource/agencyCancel/page/listForPhone', data)
}

/**
 * 代理结构注销 详情
 */
export function agencyCancelDetail(id) {
    return $axios.post('resource/agencyCancel/get', '"' + id + '"')
}

/**
 * 异议分析 关联电话分页查询
 */
export function objectionAnalysisList(data) {
    return $axios.post('resource/objectionAnalysis/page/listForPhone', data)
}

/**
 * 异议分析  详情
 */
export function objectionAnalysisDetail(id) {
    return $axios.post('resource/objectionAnalysis/get', '"' + id + '"')
}
/**
 * 
 * 异议分析相似列表
*/
export function objectionAnalysisDetailList(data) {
    return $axios.post('resource/objectionAnalysis/page/listForPhoneDetail', data)
}

/**
 * 商标驳回 关联电话分页查询
 */
export function rejectList(data) {
    return $axios.post('resource/reject/page/listForPhone', data)
}

/**
 * 商标驳回  详情
 */
export function rejectDetail(id) {
    return $axios.post('resource/reject/get', '"' + id + '"')
}