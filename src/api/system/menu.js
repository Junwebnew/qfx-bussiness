import request from '@/utils/request'

import $axios from '@/utils/http'

// 查询菜单列表
export function listMenu(query) {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params: query
    })
}

// 查询菜单详细
export function getMenu(menuId) {
    return request({
        url: '/system/menu/' + menuId,
        method: 'get'
    })
}

// 查询菜单下拉树结构
export function treeselect() {
    return request({
        url: '/system/menu/treeselect',
        method: 'get'
    })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
    return request({
        url: '/system/menu/roleMenuTreeselect/' + roleId,
        method: 'get'
    })
}

// 新增菜单
export function addMenu(data) {
    return request({
        url: '/system/menu',
        method: 'post',
        data: data
    })
}

// 修改菜单
export function updateMenu(data) {
    return request({
        url: '/system/menu',
        method: 'put',
        data: data
    })
}

// 删除菜单
export function delMenu(menuId) {
    return request({
        url: '/system/menu/' + menuId,
        method: 'delete'
    })
}

//************************QMX************************ */

//获取全部菜单
export function qmxTree(data) {
    return $axios.post('back/menu/page/list', data)
}

//添加或更新菜单
export function qmxUpdateTree(data) {
    return $axios.post('back/menu/saveorupdate', data)
}

//添加或更新菜单
export function qmxDelTree(arr) {
    return $axios.post('back/menu/del', arr)
}



//根据角色拉取菜单
export function qmxRoleTree(id) {
    return $axios.post('back/role/get/menuFunction/treeByRoleId', '"' + id + '"')
}

//根据菜单ID拉取按钮
export function qmxBtnList(id) {
    return $axios.post('back/function/query/functionList/menuId', '"' + id + '"')
}

//根据菜单ID 新增和修改按钮
export function qmxBtnUpdate(data) {
    return $axios.post('back/function/saveorupdate', data)
}


//根据菜单ID 删除按钮
export function qmxBtnDel(data) {
    return $axios.post('back/function/del', data)
}




