import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";
import $axios from '@/utils/http'
// 查询用户列表
export function listUser(query) {
    return request({
        url: '/system/user/list',
        method: 'get',
        params: query
    })
}

// 查询用户详细
export function getUser(userId) {
    return request({
        url: '/system/user/' + praseStrEmpty(userId),
        method: 'get'
    })
}

// 新增用户
export function addUser(data) {
    return request({
        url: '/system/user',
        method: 'post',
        data: data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/system/user',
        method: 'put',
        data: data
    })
}

// 删除用户
export function delUser(userId) {
    return request({
        url: '/system/user/' + userId,
        method: 'delete'
    })
}

// 导出用户
export function exportUser(query) {
    return request({
        url: '/system/user/export',
        method: 'get',
        params: query
    })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password
    }
    return request({
        url: '/system/user/resetPwd',
        method: 'put',
        data: data
    })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
    const data = {
        userId,
        status
    }
    return request({
        url: '/system/user/changeStatus',
        method: 'put',
        data: data
    })
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: '/system/user/profile',
        method: 'get'
    })
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: '/system/user/profile',
        method: 'put',
        data: data
    })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword
    }
    return request({
        url: '/system/user/profile/updatePwd',
        method: 'put',
        params: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/system/user/profile/avatar',
        method: 'post',
        data: data
    })
}

// 下载用户导入模板
export function importTemplate() {
    return request({
        url: '/system/user/importTemplate',
        method: 'get'
    })
}


//************************QMX************************ */

//获取所有用户列表（包含禁用用户）
export function qmxUserListAll(data) {
    return $axios.post('back/user/page/enterpriseUserlist', data)
}

//获取用户列表
export function qmxUserList(data) {
    return $axios.post('back/user/page/pageSelectEnterpriseUserList', data)
}

//添加或更新用户
export function qmxUserUpdate(data) {
    return $axios.post('back/user/saveorupdate', data)
}
//批量删除用户
export function qmxUserDel(arr) {
    return $axios.post('back/user/del', arr)
}

//根据ID重置用户密码
export function qmxUserReset(id) {
    return $axios.post('back/user/resert', '"' + id + '"')
}

//审核用户
export function qmxUserCheck(data) {
    return $axios.post('back/user/check/user', data)
}

// 用户密码修改
export function qmxUpdateUserPwd(data) {
    return $axios.post('back/user/modify/password', data)
}


//修改当前登录用户个人信息
export function updateLoginUserInfo(data) {
    return $axios.post('back/user/modify/userInfo', data)
}