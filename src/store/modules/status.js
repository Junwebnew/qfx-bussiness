import Cookies from 'js-cookie'
import { getClueStatusList, getBussinessStatusList } from "@/api/center";
import { getDictData } from "@/api/system/dict/data";
const status = {
    state: {
        /*所有的线索状态*/
        allclueStatus: [],
        /*部分的线索状态*/
        partsclueStatus: [],
        /*所有的商机状态*/
        allbussStatus: [],
        /*部分的商机状态*/
        partsbussStatus: [],
        //获取业务类型
        bussinessType: [],
        //获取资源类型
        resourcesType: [],
        //资源的价格
        resoursePrice: []
    },
    mutations: {
        SET_ALLCLUESTATUS: (state, arr) => {
            state.allclueStatus = arr
        },
        SET_PARTSCLUESTATUS: (state, arr) => {
            state.partsclueStatus = arr
        },
        SET_ALLBUSSSTATUS: (state, arr) => {
            state.allbussStatus = arr
        },
        SET_PARTSBUSSSTATUS: (state, arr) => {
            state.partsbussStatus = arr
        },
        SET_BUSSSTYPE: (state, arr) => {
            state.bussinessType = arr
        },
        SET_RESOURCE: (state, arr) => {
            state.resourcesType = arr
        },
        SET_PRICE: (state, arr) => {
            state.resoursePrice = arr
        }
    },
    actions: {
        //获取线索或商机的状态
        getBussStatus({ commit, state }, type) {
            return new Promise(resolve => {

                if (type == 1) {
                    if (state.allclueStatus.length) {
                        resolve(state.allclueStatus)
                        return
                    }
                    getClueStatusList({ pageNum: 1, pageSize: 1000, type: 1 })
                        .then(res => {
                            let arr = res.data
                            commit('SET_ALLCLUESTATUS', arr)
                            resolve(arr)
                        })

                    return
                }
                if (type == 2) {
                    if (state.partsclueStatus.length) {
                        resolve(state.partsclueStatus)
                        return
                    }
                    getClueStatusList({ pageNum: 1, myClueoppIsShow: 1, pageSize: 1000, type: 1 })
                        .then(res => {
                            let arr = res.data
                            commit('SET_PARTSCLUESTATUS', arr)
                            resolve(arr)
                        })

                    return
                }
                if (type == 3) {
                    if (state.allbussStatus.length) {
                        resolve(state.allbussStatus)
                        return
                    }
                    getClueStatusList({ pageNum: 1, pageSize: 1000, type: 2 })
                        .then(res => {
                            let arr = res.data
                            commit('SET_ALLBUSSSTATUS', arr)
                            resolve(arr)
                        })

                    return
                }
                if (type == 4) {
                    if (state.partsbussStatus.length) {
                        resolve(state.partsbussStatus)
                        return
                    }
                    getClueStatusList({ pageNum: 1, myClueoppIsShow: 1, pageSize: 1000, type: 2 })
                        .then(res => {
                            let arr = res.data
                            commit('SET_PARTSBUSSSTATUS', arr)
                            resolve(arr)
                        })

                    return
                }
            })
        },
        //业务类型 分类(1-业务类型 2-资源类型)
        getCenterType({ commit, state }, type) {

            return new Promise(resolve => {
                if (type == 1) {
                    if (state.bussinessType.length) {
                        resolve(state.bussinessType)
                        return
                    }
                }
                if (type == 2) {
                    if (state.resourcesType.length) {
                        resolve(state.resourcesType)
                        return
                    }
                }

                getBussinessStatusList({ type: type || 1 })
                    .then(res => {
                        let arr = delEmpyChildren(res.data)

                        if (type == 1) {
                            commit('SET_BUSSSTYPE', arr)
                        }
                        else {
                            commit('SET_RESOURCE', arr)
                        }
                        resolve(arr)
                    })

                return
            })
        },
        //获取不同资源的扣费标准
        getResoursePrice({ commit, state }, id) {

            return new Promise(resolve => {
                if (state.resoursePrice.length) {

                    let obj = state.resoursePrice.filter(i => i.id == id)[0]
                    resolve(obj)
                    return
                }
                getDictData({ pageNum: 1, pageSize: 500 })
                    .then(res => {

                        let arr = res.data
                        let obj = arr.filter(i => i.id == id)[0]

                        commit('SET_PRICE', arr)
                        resolve(obj)
                    })
                return
            })
        }
    }
}


function delEmpyChildren(arr) {
    for (let item of arr) {
        if (item.children) {
            if (item.children.length == 0) {
                delete item.children
            }
            else {
                delEmpyChildren(item.children)
            }
        }
    }
    return arr
}


export default status
