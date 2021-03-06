import store from '@/store'

export default {

    data() {
        return {
            //申请人类型
            applicantTypeEnum: [],
            //电话类型
            phoneTypeArr: [],
            showSwitch: false, //展开与关闭
        }
    },
    mounted() {
        this.qmxDataKey().then(res => {
            // console.log('0000', res)
            this.phoneTypeArr = res['phoneTypeEnumList']
            this.applicantTypeEnum = res['applicantTypeEnumList']
        })
    },
    methods: {

    }
}
