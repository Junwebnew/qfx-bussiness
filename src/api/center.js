import $axios from '@/utils/http'

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

//公共池-批量领取
export function publicPoolReceive(data) {
    return $axios.post('clueopp/businessClueoppPool/batch/receive', data)
}

//线索跟进-统计分析
export function clueStatistics(data) {
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