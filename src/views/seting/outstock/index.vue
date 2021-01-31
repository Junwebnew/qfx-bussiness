<template>
    <div class="app-container">
        <div class="content back-fff">
            <div class="l navBox">
                <div class="item" :class="{'active':active == 0}" @click="active = 0">
                    <span>线索掉库设置</span>
                </div>
                <div class="item" :class="{'active':active == 1}" @click="active = 1">
                    <span>商机掉库设置</span>
                </div>
            </div>
            <div class="r">
                <div v-show='active == 1'>
                    <outstock :outType='2' :assObj='bussObj' ref='bussTem' :openId='bussObj.openId' :daysId='bussObj.daysId' @finish='initPage' />
                </div>
                <div v-show='active != 1'>
                    <outstock :outType='1' :assObj='clueObj' ref='clueTem' :openId='clueObj.openId' :daysId='clueObj.daysId' @finish='initPage' />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { outOfStockSet, getOutOfStockSet } from '@/api/system/set.js'
import outstock from './module/outstock'
export default {
    components: { outstock },
    data() {
        return {
            active: 0,
            clueObj: {
                isOpen: false,
                days: 1,
                openId: '',
                daysId: ""
            },
            bussObj: {
                isOpen: false,
                days: 1,
                openId: '',
                daysId: ""
            },
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId',
            'mainAccount',
            'companyId'
        ])
    },
    created() {

        this.initPage()
    },
    methods: {
        initPage() {

            Promise.all([
                getOutOfStockSet({ orgId: this.companyId, type: 1 }),
                getOutOfStockSet({ orgId: this.companyId, type: 2 })
            ])
                .then(res => {


                    this.clueObj.isOpen = this.assObj('no_follow_up_reminder', res[0].data).value
                    this.clueObj.openId = this.assObj('no_follow_up_reminder', res[0].data).uodateId
                    this.clueObj.days = this.assObj('days_not_followed_up', res[0].data).value
                    this.clueObj.daysId = this.assObj('days_not_followed_up', res[0].data).uodateId


                    this.bussObj.isOpen = this.assObj('no_follow_up_reminder', res[1].data).value
                    this.bussObj.openId = this.assObj('no_follow_up_reminder', res[1].data).uodateId
                    this.bussObj.days = this.assObj('days_not_followed_up', res[1].data).value
                    this.bussObj.daysId = this.assObj('days_not_followed_up', res[1].data).uodateId

                    this.$refs.bussTem.initDate(this.bussObj)
                    this.$refs.clueTem.initDate(this.clueObj)

                })
        },
        assObj(key, oldarr) {

            let arr = oldarr.filter(i => i.code == key)

            let value = arr.length ? Number(arr[0].value) : ''
            let uodateId = arr.length ? arr[0].id : ''

            if (key == 'no_follow_up_reminder') {
                return { uodateId, value: value == 1 }
            }

            return { uodateId, value: value || 1 }
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    min-height: 500px;
    overflow: hidden;
    display: flex;
    padding: 10px 0;
    .l {
        width: 224px;
        border-right: 1px solid #f0f0f0;
        font-size: 14px;
        min-height: 200px;
        .item {
            height: 40px;
            line-height: 40px;
            margin: 8px 0;
            border-right: 3px solid #fff;
            padding-left: 24px;
            cursor: pointer;
            &.active {
                background-color: #e6f7ff;
                font-weight: 700;
                border-color: #1890ff;
                color: #1890ff;
            }
        }
    }
    .r {
        flex: 1;
        padding: 8px 40px;
    }
}
</style>