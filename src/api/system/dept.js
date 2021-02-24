import request from '@/utils/request'

import $axios from '@/utils/http'
import qs from "qs";
// 查询部门列表
export function listDept(query) {
    return request({
        url: '/system/dept/list',
        method: 'get',
        params: query
    })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
    return request({
        url: '/system/dept/list/exclude/' + deptId,
        method: 'get'
    })
}

// 查询部门详细
export function getDept(deptId) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'get'
    })
}

// 查询部门下拉树结构
export function treeselect() {
    return request({
        url: '/system/dept/treeselect',
        method: 'get'
    })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
    return request({
        url: '/system/dept/roleDeptTreeselect/' + roleId,
        method: 'get'
    })
}

// 新增部门
export function addDept(data) {
    return request({
        url: '/system/dept',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/system/dept',
        method: 'put',
        data: data
    })
}

// 删除部门
export function delDept(deptId) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'delete'
    })
}

//************************QMX************************ */

//获取组织机构树

export function qmxDept(data) {
    return $axios.post('baseData/organization/query/company/tree', data)
}

//新增机构

export function qmxAddDept(data) {
    return $axios.post('baseData/organization/saveSubOrg', data)
}

//修改机构

export function qmxUpdateDept(data) {
    return $axios.post('baseData/organization/update', data)
}

//机构详情

export function qmxDetailDept(id) {
    return $axios.post('baseData/organization/get', '"' + id + '"')
}

//删除机构

export function qmxDelDept(id) {
    return $axios.post('baseData/organization/update', { commonStatus: -999, id })
}


//添加或更新公司企业微信帐号配置

export function qmxdDeptMsgSet(data) {
    return $axios.post('msg/msgConfigWechat/saveorupdate', data)
}

//获取公司企业微信帐号配置

export function getQmxdDeptMsgSet(companyId) {
    return $axios.post('msg/msgConfigWechat/getByOrgId', '"' + companyId + '"')
}

//获取公司列表分页和名字查询
export function qmxCompanyList(data) {
    data = data || {
        pageNum: 1,
        pageSize: 1000,
        level: 2
    }
    return $axios.post('baseData/organization/queryCompanyPageList', data)
}

//设置添加或更新公司帐号次数，天数配置
export function setDeptDaysAndNum(data) {
    return $axios.post('cost/orgTimes/costOrgTimes/saveorupdate', data)
}

//公司开通关闭包年
export function openYearFee(str) {
    return $axios.get('cost/orgTimes/costOrgTimes/open/year/fee' + str)
}