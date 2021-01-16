
import $axios from '@/utils/http'


//获取商标详情
export function getTmDetail(id) {
    return $axios.get('/API/api-e/trademarkdetail/get/' + id)
}

//获取公告详情
export function getTmNoticeDetail(id) {
    return $axios.get(`/API/api-e/preliminarynotice/getNewList?tradeMarkId=${id}&pc=pc`)
}


// ********************************************近日申请************************************

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

// ********************************************续展 ************************************

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

// ********************************************申请人变更 ************************************
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

// ********************************************代理结构注销 ************************************
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

// ********************************************商标驳回 ************************************
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


// ********************************************异议分析 ************************************

/**
 * 异议分析 关联电话分页查询
 */
export function objectionAnalysisList(data) {
    return $axios.post('objectionanalysis/preli/page/pageListForPhone', data)
}

/**
 * 异议分析  详情
 */
export function objectionAnalysisDetail(id) {
    return $axios.post('objectionanalysis/preli/get', '"' + id + '"')
}

/**
 * 
 * 异议分析相似列表
*/
export function objectionAnalysisDetailList(data) {
    return $axios.post('objectionanalysis/page/list', data)
}


// ********************************************企业白名单 ************************************


/**
 * 企业白名单 详情
 */
export function companyWhiteDetail(id) {
    return $axios.post('resource/whiteList/get', '"' + id + '"')
}

/**
 * 
 * 白名单列表
*/
export function companyWhiteList(data) {
    return $axios.post('resource/whiteList/page/list', data)
}


// ******************************************** 客户求购 ************************************


/**
 * 客户求购 详情
 */
export function resourceBuyDetail(id) {
    return $axios.post('resource/buy/resourceBuy/get', '"' + id + '"')
}

/**
 * 客户求购 列表
*/
export function resourceBuyList(data) {
    return $axios.post('resource/buy/resourceBuy/page/list', data)
}


// ******************************************** 资源领取 ************************************

//资源领取为线索
export function receiveResource(typeStr, data) {
    return $axios.post(`${typeStr}/receive`, data)
}
