import $axios from '@/utils/http'


//充值
export function rechargeAccount(data) {
    return $axios.post('cost/recharge/costOrgRecharge/recharge', data)
}

//公司帐号充值记录分页查询
export function rechargeAccountList(data) {
    return $axios.post('cost/recharge/costOrgRecharge/page/list', data)
}

//公司帐号消费记录分页查询
export function costAccountList(id) {
    return $axios.post('cost/consume/costOrgConsume/page/list', '"' + id + '"')
}

//根据ID查询公司帐号消费记录
export function costAccountDetail(id) {
    return $axios.post('cost/consume/costOrgConsume/get', '"' + id + '"')
}

//添加或更新公司帐号消费记录
export function costAccountUnpate(data) {
    return $axios.post('cost/consume/costOrgConsume/saveorupdate', data)
}

//统计账号扣除总次数
export function costAccountStatit(data) {
    return $axios.post('cost/orgTimes/costOrgTimes/statistical/analysis', data)
}