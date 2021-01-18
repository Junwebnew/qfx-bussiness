import $axios from '@/utils/http'

//获取电话列表
export function resourcePhoneList(data) {
    return $axios.post('resource/phone/page/list', data)
}

//启用|禁用电话
export function swicthPhoneStatus(data) {
    return $axios.post('resource/phone/enableOrDisable', data)
}

//号码与企业或个人关联关系分页查询
export function phoneRelationList(data) {
    return $axios.post('resource/phoneRelation/page/list', data)
}

//添加或更新号码与企业或个人关联关系
export function phoneRelationUpdate(data) {
    return $axios.post('resource/phoneRelation/saveorupdate', data)
}