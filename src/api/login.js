import request from '@/utils/request'

import $axios from '@/utils/http'

import qs from "qs";

// 登录方法
export function login(username, password, code, uuid) {
    const data = {
        username,
        password,
        code,
        uuid
    }
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/captchaImage',
        method: 'get'
    })
}

//************************QMX************************ */

// 登录方法
export function qmxLogin(userName, password) {
    const data = {
        userName,
        password
    }
    return $axios.post('common/back/login', data)
}

// 获取用户详细信息和权限
export function qmxgetInfo() {

    return $axios.post('back/user/get/current')
}

//获取用户所在部门、所在机构
export function qmxgetOrgAndDep() {

    return $axios.post('back/user/getUserOrgAndDeptId')
}

// 获取用户角色 列表
export function qmxgetRoleList(key) {

    return $axios.post('back/userRole/current/list').then(res => {

        let list = res.data,
            roleId = null;
        for (let item of list) {
            if (item.isCheck == 1) {
                roleId = item.roleId
                break
            }
        }

        return {
            list, roleId
        }
    })
}


// 退出方法
export function qmxLogout() {
    return $axios.post('common/loginout')
}

//获取短信
export function sendMsg(phone) {
    return $axios.post('sms/sendSmsVerificationCode?token?form', qs.stringify({ belongSystem: 2, phone: phone }))
}

//-用户注册

export function userReg(data) {
    return $axios.post('front/user/reg?token', data)
}


//判断用户是否已经存在 电话或者登录名
export function checkExists(name) {
    return $axios.post('front/user/checkExists?token?form', qs.stringify({ username: name }))
}
