
const otherData = {
    state: {
        msgNum: '',
    },
    mutations: {
        SET_MSGNUM: (state, num) => {
            state.msgNum = num
        },
        SET_REDUCE_MSGNUM: (state) => {
            let num = (state.msgNum - 1)
            state.msgNum = num > 0 ? num : ''
        }
    },
    actions: {

    }
}

export default otherData
