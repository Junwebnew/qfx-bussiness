import $axios from '@/utils/http'
import Cookies from 'js-cookie'


//获取线索状态列表 （1：线索 2：商机）

export function getClueStatusList(data) {
    return $axios.post('clueopp/businessClueoppFollowStatus/page/list', data)
}

//获取业务类型

export function getBussinessStatusList(data) {
    return $axios.post('clueopp/businessClueoppVocResType/tree', data)
}



// clueopp/businessClueoppFollowStatus/page/list/myClueoppIsShow

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

//添加或更新线索商机备注

export function clueMarksUpdate(data) {
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

// export function clueTransfer(data) {
//     return $axios.post('clue/clue/batch/transfer', data)
// }


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

//公共池-分页查询

export function publicPoolList(data) {
    return $axios.post('clueopp/businessClueoppPool/page/list', data)
}

//公共池-批量领取
export function publicPoolReceive(data) {
    return $axios.post('clueopp/businessClueoppPool/batch/receive', data)
}