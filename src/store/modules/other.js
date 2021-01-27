
const otherData = {
    state: {
        msgNum: '',
    },
    mutations: {
        SET_MSGNUM: (state, num) => {
            state.msgNum = num
        },
        SET_REDUCE_MSGNUM: (state) => {
            state.msgNum = (state.msgNum - 1) || ''
        }
    },
    actions: {

    }
}

export default otherData
