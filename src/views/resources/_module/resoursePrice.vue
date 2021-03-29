<template>
    <div class="resourse-flag">
        <div class="flag-topright"></div>
        <div class="coin"><span>{{price}}</span>
            <br>{{unit}}
        </div>
    </div>
</template>

<script>
import { resourseConfig } from '@/utils/baseConfig'
export default {
    props: {
        /*资源类型 1:近日申请,2:异议分析,3:商标续展,4:代理注销,5:商标变更,6:疑似驳回,7:商标求购,8:企业白名单,9:送达公告,10:到期未续展*/
        resourcesModule: {
            type: String | Number
        },
        // 0 是企业，1 是个人
        applicationType: {
            type: String | Number,
            default: undefined
        }
    },
    data() {
        return {
            ids: [
                { 'person': '13', 'com': '5' }, { 'person': '14', 'com': '6' }, { 'person': '15', 'com': '7' }, { 'person': '16', 'com': '8' },
                { 'person': '17', 'com': '9' }, { 'person': '18', 'com': '10' }, { 'person': '19', 'com': '11' }, { 'person': '20', 'com': '12' },
                { 'person': '22', 'com': '21' }, { 'person': '32', 'com': '31' }
            ],
            price: '', //价格
            unit: '', //单位
        }
    },
    watch: {
        applicationType() {
            this.isShowData()
        }
    },
    created() {
        // this.isShowData()
    },
    methods: {
        // 包年扣次（写死 每个都扣1次） ，特殊资源扣星（ 星是配置的 ）； 次数用完了，用星数解决

        isShowData() {

            let itemObj = resourseConfig[this.resourcesModule - 1]

            if (itemObj.id) {

                this.$store.dispatch('getYearResourse').then(res => {

                    // console.log('222', res)

                    let arr2 = res.filter(i => i.id == itemObj.id)

                    //获取到相对应的资源，并且是false,则是特殊资源
                    if (arr2.length && !arr2[0].supportYearPay) {

                        this.getPrice()
                    }
                    else {
                        //判断用户有没有次数
                        this.$store.dispatch('getOrgMsg', this.companyId).then(res => {



                            //有次数
                            if (res.num > 0) {
                                // this.getPrice()
                                this.price = 1 //价格
                                this.unit = '次' //单位
                                return
                            }
                            //无次数
                            this.getPrice()
                        })

                    }

                })
            }
        },
        //获取配置的资源扣星数
        getPrice() {

            let types = this.ids[this.resourcesModule - 1]

            this.$store.dispatch('getResoursePrice', this.applicationType == 1 ? types.person : types.com).then(res => {

                // console.log('111', res, types)

                this.price = res.value / 10 //价格
                this.unit = '星' //单位
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.resourse-flag {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 2;
    .flag-topright {
        width: 0;
        height: 0;
        border-bottom: 70px solid #2d8cf0;
        border-left: 70px solid transparent;
    }
    .coin {
        position: absolute;
        right: 0px;
        bottom: 6px;
        text-align: center;
        width: 42px;
        line-height: 1.2;
        font-size: 12px;
        color: #fff;
        span {
            font-size: 18px;
            font-weight: bold;
        }
        // line-height: 70px;
        // transform: rotate(45deg);
    }
}
</style>