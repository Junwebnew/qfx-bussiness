import { costSetAccountList } from "@/api/account";
import { setYearResourse } from "@/api/system/dict/data";
const otherData = {
    state: {
        msgNum: '',
        // /所属机构信息 剩余星数，是否过期，是否包年会员等等/
        orgMsg: {},
        //资源开关是否只有包年用户才能使用
        yearResourse: [],
    },
    mutations: {
        SET_MSGNUM: (state, num) => {
            state.msgNum = num
        },
        SET_REDUCE_MSGNUM: (state) => {
            let num = (state.msgNum - 1)
            state.msgNum = num > 0 ? num : ''
        },
        SET_ORGMSG: (state, obj) => {
            state.orgMsg = obj
        },
        SET_YEARRESOURSE: (state, arr) => {
            state.yearResourse = arr
        }
    },
    actions: {
        getOrgMsg({ commit, state }, orgId) {

            return new Promise(resolve => {

                if (state.orgMsg.id) {
                    resolve(state.orgMsg)
                    return
                }
                costSetAccountList({ pageNum: 1, pageSize: 2, orgId: orgId }).then(res => {
                    commit('SET_ORGMSG', res.data[0])
                    resolve(res.data[0])
                    // this.accountNumber = 9
                })

            })
        },
        getYearResourse({ commit, state }) {
            return new Promise(resolve => {
                if (state.yearResourse.length) {
                    resolve(state.yearResourse)
                    return
                }
                setYearResourse().then(res => {
                    commit('SET_YEARRESOURSE', res.data)
                    resolve(res.data)
                })
            })
        }
    }
}

export default otherData
