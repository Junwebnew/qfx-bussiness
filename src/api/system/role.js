import request from '@/utils/request'

import $axios from '@/utils/http'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}

//************************QMX************************ */

//获取角色列表
export function qmxRoleList(data){
    return $axios.post('back/role/page/list',data )
}

//删除角色,数组，可多个删除
export function qmxDelRole(arr){
    return $axios.post('back/role/del',arr )
}

//添加或更新角色
export function qmxUpdateRole(data){
    return $axios.post('back/role/saveorupdate',data )
}

//获取角色详情
export function qmxRoleDetail(data){
    return $axios.post('back/role/get',data )
}

//批量保存角色功能关系
export function qmxSaveRoleList(data){
    return $axios.post('back/role/function/batch/save',data )
}

// 批量保存一用户多角色关系
export function qmxSaveUserRole(data){
    return $axios.post('back/userRole/batch/batchSaveUser2Role',data )
}

// 根据用户查询角色列表
export function qmxUserRole(id){
    return $axios.post('back/userRole/queryUserRoleListByUserId','"'+id+'"' )
}

