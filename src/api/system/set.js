import $axios from '@/utils/http'

// 添加或更新线索商机掉库
/**
 * code:  1.days_not_followed_up 多少天未跟进配置  2.no_follow_up_reminder 是否发送消息 
 * value: 1.天数   2. 1开启，2关闭
 * orgId： 机构（公司）ID
 * type (1：线索 2：商机)
 * 
 */
export function outOfStockSet(data) {
    return $axios.post('clueopp/businessClueoppOutOfStock/saveorupdate', data)
}

//公告数据清洗
export function clearNoticeData(num) {
    return $axios.get('/API/api-qfxpdc/resourceManagement/cleaningPreliminaryNotice?noticeNum=' + num)
}

//获取调库设置
export function getOutOfStockSet(data) {
    return $axios.post('clueopp/businessClueoppOutOfStock/getOrgConfig', data)
}