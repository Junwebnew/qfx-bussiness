
import $axios from '@/utils/http'


//获取消息 
export function qmxMsgList(data) {
    return $axios.post('msg/msgConfigInstationNews/page/list', data)
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