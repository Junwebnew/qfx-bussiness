import $axios from '@/utils/http'
import Cookies from 'js-cookie'


//获取线索状态列表 （1：线索 2：商机）

export function getClueStatusList(data, type) {

    let statusArr = Cookies.get('clueStatusList')
    return new Promise(resolve => {
        if (statusArr && !data) {
            resolve(JSON.parse(statusArr))
            return
        }
        else {
            data = data || { pageNum: 1, pageSize: 1000 }

            data.type = 1

            $axios.post('clueopp/businessClueoppFollowStatus/page/list', data)
                .then(res => {

                    Cookies.set('clueStatusList', res.data)
                    resolve(res.data)
                })
        }
    })
}

//获取商机状态列表 （1：线索 2：商机）
export function getBussStatusList(data) {

    let statusArr = Cookies.get('bussStatusList')
    return new Promise(resolve => {
        if (statusArr && !data) {
            resolve(JSON.parse(statusArr))
            return
        }
        else {

            data = data || { pageNum: 1, pageSize: 1000 }

            data.type = 2

            $axios.post('clueopp/businessClueoppFollowStatus/page/list', data)
                .then(res => {

                    Cookies.set('bussStatusList', res.data)
                    resolve(res.data)
                })
        }
    })
}

/**
 * 我的线索-分页查询
 */
export function clueMyList(data) {
    return $axios.post('clue/clue/page/list/me', data)
}


/**
 * 所有线索-分页查询
 * */

export function clueList(data) {
    return $axios.post('clue/clue/page/list/all', data)
}


//批量删除线索管理

export function clueDel(arr) {
    return $axios.post('clue/clue/batch/del', arr)
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