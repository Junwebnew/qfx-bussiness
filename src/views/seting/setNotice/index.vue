<template>
    <div class="app-container">
        <div class="content back-fff">
            <div class="l navBox">
                <div class="item" :class="{'active':active == 0}" @click="active = 0">
                    <span>个人企业微信号设置</span>
                </div>
                <div class="item" :class="{'active':active == 1}" @click="active = 1" v-if="mainAccount">
                    <span>企业微信设置</span>
                </div>
            </div>
            <div class="r">
                <setPerson v-show=" active == 0 " />
                <setDep v-show=" active == 1 " />
            </div>
        </div>
    </div>
</template>

<script>
import { qmxMsgList, qmxMsgRead, qmxMsgUpdate } from '@/api/system/msg.js'
import { mapGetters } from 'vuex'

import setPerson from './module/setPerson'
import setDep from './module/setDep'
export default {
    name: 'msbBox',
    components: { setPerson, setDep },
    data() {
        return {
            active: 0
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId',
            'mainAccount'
        ])
    },
    created() {
        // this.initList('n1', () => {
        //     this.initList('n2')
        // })
    },
    methods: {

        initList(key, cb) {

            let params = {
                companyId: this.organizationId,
                userId: this.userId,
                pageSize: this.pageSize,
                pageNum: this.pageNum[key],
                type: key == 'n1' ? 0 : 1
            }

            qmxMsgList(params).then(res => {

                let arrKey = key == 'n1' ? 'noticeArr' : 'messageArr'

                if (params.pageNum > 1) {
                    this[arrKey] = this[arrKey].concat(res.data)
                }
                else {

                    this[arrKey] = res.data

                }

                this.total[key] = res.total
                cb && cb()

            })

        },
        handleClick() {

        },
        handleChange(val) {

            if (val[0] || val[0] === 0) {
                let arr = this.activeName == 'n1' ? this.noticeArr : this.messageArr,
                    obj = arr[val[val.length - 1]];

                if (obj.isRead == 0) {
                    obj.isRead = 1
                    qmxMsgRead({ ids: [obj.id], status: 1 })
                }
            }
        },
        readAllfunc() {
            let a = this.noticeArr.map(i => i.id)
            let ids = this.messageArr.map(i => i.id).concat(a)
            qmxMsgRead({ ids: ids, status: 1 })
                .then(res => {
                    this.initList()
                })
        },
        getMore(key) {
            this.pageNum[key] = this.pageNum[key] + 1

            this.initList(key)
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