import { login, logout, getInfo, qmxLogin, qmxgetInfo, qmxgetRoleList } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

import { assRouter } from '@/api/menu.js'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        userInfo: {},
        rolesId: null,
        superAdmin: false,
        menuList: [],
        userId: ''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_ROLEID: (state, rolesId) => {
            state.rolesId = rolesId
            state.superAdmin = rolesId == 1
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        },
        SET_USER: (state, msgObj) => {
            state.userInfo = msgObj
        },
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList
        },
        SET_USERID: (state, userId) => {
            state.userId = userId
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password

            return new Promise((resolve, reject) => {
                qmxLogin(username, password).then(res => {

                    setToken(res.data)
                    commit('SET_TOKEN', res.data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息 //使用id区分角色， id：1  超级角色  id:2 主账号  角色  
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                qmxgetInfo(state.token).then(res => {

                    Promise.all([
                        qmxgetInfo(),
                        qmxgetRoleList()
                    ])
                        .then(res => {

                            const user = res[0].data

                            commit('SET_ROLEID', res[1].roleId) //角色

                            const avatar = user.avatar ? process.env.VUE_APP_BASE_API + user.avatar : require("@/assets/images/profile.jpg");


                            // commit('SET_PERMISSIONS', ["*:*:*"])
                            commit('SET_ROLES', [user.id])
                            commit('SET_USERID', user.id)

                            let menuList = assRouter(user.menuList)

                            commit('SET_MENULIST', menuList)

                            //超级管理员
                            if (res[1].roleId == 1) {
                                res.menuList = false
                            }
                            else {
                                res.menuList = menuList
                            }

                            commit('SET_NAME', user.name)
                            commit('SET_AVATAR', avatar)
                            commit('SET_USER', user)

                            resolve(res)

                            return




                            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                                commit('SET_ROLES', res.roles)
                                commit('SET_PERMISSIONS', res.permissions)
                            }

                            else {
                                commit('SET_PERMISSIONS', ["*:*:*"])
                                commit('SET_ROLES', [user.id])

                                let menuList = assRouter(user.menuList)

                                commit('SET_MENULIST', menuList)

                                if (res[1].roleId < 10) {
                                    res.menuList = false
                                }
                                else {
                                    res.menuList = menuList
                                }
                            }
                            commit('SET_NAME', user.name)
                            commit('SET_AVATAR', avatar)
                            commit('SET_USER', user)

                            resolve(res)
                            return
                        })


                    //   const user = res.user
                    //   const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
                    //   if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    //     commit('SET_ROLES', res.roles)
                    //     commit('SET_PERMISSIONS', res.permissions)
                    //   } else {
                    //     commit('SET_ROLES', ['ROLE_DEFAULT'])
                    //   }
                    //   commit('SET_NAME', user.userName)
                    //   commit('SET_AVATAR', avatar)
                    //   resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
