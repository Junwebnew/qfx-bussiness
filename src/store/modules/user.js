import { login, logout, getInfo, qmxLogin, qmxgetInfo, qmxgetRoleList, qmxgetOrgAndDep, qmxLogout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { $getImg } from '@/utils/qmx'
import { qmxUserList } from "@/api/system/user"
import { assRouter } from '@/api/menu.js'
import Cookies from 'js-cookie'

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
        userId: '',
        depUser: [],
        orgAndDep: {}
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
        },
        SET_SUPER: (state, accountType) => {
            state.superAdmin = accountType == 99
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
        },
        SET_DEPUSER(state, arr) {
            state.depUser = arr
        },
        SET_ORGANDDEP(state, obj) {
            state.orgAndDep = obj
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


                Promise.all([
                    qmxgetInfo(),
                    qmxgetRoleList()
                ])
                    .then(res => {

                        const user = res[0].data


                        setInfoMsg(commit, user)

                        commit('SET_ROLEID', res[1].roleId) //角色

                        let menuList = assRouter(user.menuList)

                        commit('SET_MENULIST', menuList)

                        //超级管理员
                        if (res[1].roleId == 1 || user.accountType == 99) {
                            res.menuList = false
                        }
                        else {
                            res.menuList = menuList
                        }

                        resolve(res)
                    })
            }).catch(error => {
                reject(error)
            })
        },
        //更新用户信息后再次拉取
        GetInfoAgain({ commit }) {
            return new Promise((resolve, reject) => {
                qmxgetInfo().then(res => {
                    const user = res.data
                    setInfoMsg(commit, user)
                    resolve({})
                })
            })
        },
        //获取用户所在的部门和机构
        getUserOrgAndDep({ commit, state }) {
            return new Promise((resolve, reject) => {

                if (state.orgAndDep.orgId) {
                    resolve(state.orgAndDep)
                    return
                }
                qmxgetOrgAndDep().then(res => {

                    commit('SET_ORGANDDEP', res.data)

                    resolve(res.data)
                })
            })
        },
        //获取部门人员
        getDepUser({ commit, state }) {
            return new Promise((resolve, reject) => {

                if (state.depUser.length) {
                    resolve(state.depUser)
                    return
                }
                qmxUserList({
                    pageNum: 1,
                    pageSize: 1000,
                    name: undefined,
                    orgId: state.userInfo.organizationId
                }).then(res => {

                    commit('SET_DEPUSER', res.data)

                    resolve(res.data)
                })
            })
        },
        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                qmxLogout(state.token).then(() => {
                    Cookies.remove('tagsList')
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

//公共更新用户方法
function setInfoMsg(commit, user) {
    const avatar = user.headImg ? $getImg(user.headImg) : require("@/assets/images/profile.jpg");

    // commit('SET_PERMISSIONS', ["*:*:*"])
    commit('SET_ROLES', [user.id])
    commit('SET_USERID', user.id)
    commit('SET_SUPER', user.accountType)
    commit('SET_NAME', user.name)
    commit('SET_AVATAR', avatar)

    //坐席号 开发模式下  没有坐席号 就默认一个
    if (process.env.NODE_ENV != 'production') {
        user.seatNumber = user.seatNumber || '8008'
    }

    commit('SET_USER', user)

}

export default user
