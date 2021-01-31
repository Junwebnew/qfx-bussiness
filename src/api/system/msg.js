
import $axios from '@/utils/http'

//***************************************系统公告和通知 (公告)*******************************************


//获取消息 (不含未读数量)
export function qmxMsgList(data) {
    return $axios.post('msg/msgConfigInstationNews/page/list', data)
}

//获取消息 (含未读数量)
export function qmxMsgListRead(data) {
    return $axios.post('msg/msgConfigInstationNews/page/list/all', data)
}

//批量更新是否已读

export function qmxMsgRead(data) {
    return $axios.post('msg/msgConfigInstationNews/batch/isRead', data)
}

//批量删除公司站内消息管理

export function qmxMsgDel(data) {
    return $axios.post('msg/msgConfigInstationNews/batch/del', data)
}

//添加或更新公司站内消息管理

export function qmxMsgUpdate(data) {
    return $axios.post('msg/msgConfigInstationNews/saveorupdate', data)
}

//********************************************站内信（消息）**************************************************** */


//获取消息 (不含未读数量)
export function conMsgList(data) {
    return $axios.post('msg/msgOrgInstationNews/page/list', data)
}

//获取消息 (含未读数量)
export function conMsgListRead(data) {
    return $axios.post('msg/msgOrgInstationNews/page/list/all', data)
}

//批量更新是否已读

export function conMsgRead(data) {
    return $axios.post('msg/msgOrgInstationNews/batch/isRead', data)
}

//批量删除公司站内消息管理

export function conMsgDel(data) {
    return $axios.post('msg/msgOrgInstationNews/batch/del', data)
}

//添加或更新公司站内消息管理

export function conMsgUpdate(data) {
    return $axios.post('msg/msgOrgInstationNews/saveorupdate', data)
}