import $axios from '@/utils/http'

//统计总线索|总商机|总成单数量

export function getDataStatic(data) {
    return $axios.post('opporderform/opportunityOrderForm/backend/orgResourceCount', data)
}

//获取线索状态列表 （1：线索 2：商机）

export function getClueStatusList(data) {
    return $axios.post('clueopp/businessClueoppFollowStatus/page/list', data)
}

//获取业务类型

export function getBussinessStatusList(data) {
    return $axios.post('clueopp/businessClueoppVocResType/tree', data)
}

/**
 * 我的线索-分页查询
 */
export function clueMyList(data) {
    return $axios.post('clue/clue/page/list/me', data)
}

//今日跟待进线索-分页查询
export function clueTodayList(data) {
    return $axios.post('clue/clue/page/list/me/today', data)
}

/*
 * 所有线索-分页查询
*/

export function clueList(data) {
    return $axios.post('clue/clue/page/list/all', data)
}

//根据ID查询线索管理

export function clueDetail(id) {
    return $axios.post('clue/clue/get', '"' + id + '"')
}


//添加或更新线索管理

export function clueUpdate(data) {
    return $axios.post('clue/clue/saveorupdate', data)
}


//线索商机备注分页查询  （1：线索 2：商机）

export function clueMarksList(data) {
    return $axios.post('clueopp/businessClueoppFollowRecord/page/list', data)
}

//添加或更新线索商机备注  共用   分类（1：线索必传 2：商机不传） 新增数据来源（dataSoure：2）  

export function clueMarksUpdate(data) {
    data.dataSoure = 2
    return $axios.post('clueopp/businessClueoppFollowRecord/saveorupdate', data)
}

//添加或更新线索商机提醒时间
export function clueTipsUpdate(data) {
    return $axios.post('clueopp/businessClueoppFollowRemind/saveorupdate', data)
}

//批量分配  clueIds 线索|商机ID     disTraUserId 分配用户ID

export function clueDistribution(data) {
    return $axios.post('clue/clue/batch/distribution', data)
}

// //批量移交 clueIds 线索|商机ID     disTraUserId 分配用户ID

export function clueTransfer(data) {
    return $axios.post('clue/clue/batch/transfer', data)
}


//批量删除线索管理

export function clueDel(arr) {
    return $axios.post('clue/clue/batch/del', arr)
}

//批量剔除 (剔除后还是线索，转到公共库，别人可领取) clueIds

export function clueEliminate(data) {
    return $axios.post('clue/clue/batch/eliminate', data)
}

//部门池-分页查询

export function depPoolList(data) {
    return $axios.post('clue/clue/page/list/dept', data)
}

//部门领取
export function depPoolReceive(data) {
    return $axios.post('clue/clue/dept/receive', data)
}

//公共池-分页查询 共用 （1：线索 2：商机）

export function publicPoolList(data) {
    return $axios.post('clueopp/businessClueoppPool/page/list', data)
}

//公共池-批量领取  共用  （ids:[] ,type 1：线索 2：商机）  
export function publicPoolReceive(data) {
    return $axios.post('clueopp/businessClueoppPool/batch/receive', data)
}

//线索跟进-统计分析
export function clueStatistics(data) {
    return $axios.post('clue/clue/statistic/analysis', data)
}
//线索资源类型-统计分析
export function clueResourseStatistics(data) {
    return $axios.post('clue/clue/statistic/analysis/resource', data)
}
//线索转化率-统计分析
export function clueTransStatistics(data) {
    return $axios.post('clue/clue/statistic/analysis', data)
}

//线索转为商机
export function clueChangToOpp(data) {
    return $axios.post('clue/clue/changToOpp', data)
}

// *****************************************************商机********************************************************************

//我的商机
export function bussMyList(data) {
    return $axios.post('opportunity/page/list/me', data)
}

//所有商机
export function bussAllList(data) {
    return $axios.post('opportunity/page/list/all', data)
}


//今日跟待进商机-分页查询
export function bussTodayeList(data) {
    return $axios.post('opportunity/page/list/me/today', data)
}


//添加修改商机
export function bussUpdate(data) {
    return $axios.post('opportunity/saveorupdate', data)
}

//批量剔除商机管理
export function bussEliminate(data) {
    return $axios.post('opportunity/batch/eliminate', data)
}

//批量分配
export function bussDistribution(data) {
    return $axios.post('opportunity/batch/distribution', data)
}

//批量移交
export function bussTransfer(data) {
    return $axios.post('opportunity/batch/transfer', data)
}

//根据ID查询商机
export function bussDetail(id) {
    return $axios.post('opportunity/get', '"' + id + '"')
}

//商机成单
export function bussFinishSuccess(data) {
    return $axios.post('opportunity/order/form', data)
}

//商机部门池
export function bussDeptPool(data) {
    return $axios.post('opportunity/page/list/dept', data)
}

//部门商机池领取调用
export function bussDeptReceive(data) {
    return $axios.post('opportunity/dept/receive', data)
}

//商机跟进-统计分析
export function bussStatistics(data) {
    return $axios.post('opportunity/statistic/analysis', data)
}

//商机资源类型-统计分析
export function bussResourseStatistics(data) {
    return $axios.post('opportunity/statistic/analysis/resource', data)
}

//商机业务类型-统计分析
export function bussOppsStatistics(data) {
    return $axios.post('opportunity/statistic/analysis/businesstype', data)
}

//商机转化率-统计分析
export function bussTransStatistics(data) {
    return $axios.post('clue/clue/statistic/analysis', data)
}


// **********************************************商机成单***************************************************

//商机成单-统计分析
export function bussFinishStatistics(data) {
    return $axios.post('opporderform/opportunityOrderForm/backend/orderFormCount', data)
}

//商机成单-资源类型统计
export function finishResourseStatistics(data) {
    return $axios.post('opporderform/opportunityOrderForm/backend/orderFormCount/resourceTypeCount', data)
}

//商机业务类型-统计分析
export function finishOppsStatistics(data) {
    return $axios.post('opporderform/opportunityOrderForm/backend/orderFormCount/businessTypeCount', data)
}

//业务类型-成单金额比例统计
export function finishOppsStatisticsMoney(data) {
    return $axios.post('opporderform/opportunityOrderForm/backend/orderFormCount/businessTypeMoneyCount', data)
}

//商机成单分页查询
export function bussFinishList(data) {
    return $axios.post('opporderform/opportunityOrderForm/page/list/all', data)
}

//根据ID查询商机成单详情
export function bussFinishDetail(id) {
    return $axios.post('opporderform/opportunityOrderForm/get', '"' + id + '"')
}

//商机再次成单
export function bussFinishAgain(data) {
    return $axios.post('opporderform/opportunityOrderForm/saveorupdate', data)
}

//作废已成单商机（ 调用更新接口）
export function bussFinishDiscard(id) {
    return $axios.post('opporderform/opportunityOrderForm/saveorupdate', { id, commonStatus: 0 })
}

//只有管理员能使用修改已成单
export function bussFinishUpdate(data) {
    return $axios.post('opporderform/opportunityOrderForm/saveorupdate', data)
}