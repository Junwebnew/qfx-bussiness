import Cookies from 'js-cookie'
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
        }
    },
    actions: {
        //生成路由
        getBussStatus({ commit, state }, params) {
            console.log('0000000000000000000', params)
            return new Promise(resolve => {
                resolve('1111')
            })
        }
    }
}


export default status
