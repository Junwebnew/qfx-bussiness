
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

/**
 * 申请人变更 详情
 */
export function changeApplicationList(id) {
    return $axios.post('resource/changeDetail/getDetail', '"' + id + '"')
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

// ********************************************疑似驳回 ************************************
/**
 * 疑似驳回 关联电话分页查询
 */
export function rejectList(data) {
    return $axios.post('resource/reject/page/listForPhone', data)
}

/**
 * 疑似驳回  详情
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
    return $axios.post('resource/whiteList/page/listForPhone', data)
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

// ******************************************** 送达公告 ************************************


/**
 * 送达公告 详情
 */
export function noticeArriveDetail(id) {
    return $axios.post('notice/arrive/noticeArrive/get', '"' + id + '"')
}

/**
 * 送达公告分页查询
*/
export function noticeArriveList(data) {
    return $axios.post('notice/arrive/noticeArrive/page/listForPhone', data)
}

// ******************************************** 到期未续展 ************************************
/**
 * 到期未续展 详情
 */
export function notContinuesDetaiil(id) {
    return $axios.post('resource/notContinues/get', '"' + id + '"')
}

/**
 * 到期未续展 分页查询
*/
export function notContinuesList(data) {
    return $axios.post('resource/notContinues/page/listForPhone', data)
}

// ******************************************** 外部资源 ************************************


/**
 * 分页查询
 */
export function externalResourceList(data) {
    return $axios.post('externalResourceInput/page/list', data)
}
/**
 * 批量删除外部资源导入
*/
export function externalResourceDel(arr) {
    return $axios.post('externalResourceInput/batch/del', arr)
}

/* 根据ID查询外部资源导入 */

export function externalResourceDetail(arr) {
    return $axios.post('externalResourceInput/get', arr)
}
/* 添加或更新外部资源导入 */
export function externalResourceManage(data) {
    return $axios.post('externalResourceInput/saveorupdate', data)
}


// ******************************************** 资源领取 ************************************

//资源领取为线索
export function receiveResource(typeStr, data) {
    return $axios.post(`${typeStr}/receive`, data)
}


// ******************************************** 资源总数 ************************************

//新增资源总数统计，统计某时间段新增的各个资源总数，不传参数，默认为今天

export function totalCountResourse(data = {}) {
    return $axios.post('resource/statistic/alanalysis/resource/newadd/totalCount', data)
}

//根据ID查询号码
export function getResourcePhoneNumber(id) {
    return $axios.post(`resource/phone/get`, '"' + id + '"')
}
