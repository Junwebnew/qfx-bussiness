<template>
    <div class="app-container">
        <div class="content">
            <div class="back-fff pad20 full-height">

                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="公告" name="n1">

                        <el-card class="box-card">
                            <div class="listBox">
                                <div v-show='total.n1 > 0 '>
                                    <ul>
                                        <li v-for="(item,idx) in noticeArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item,'n1')">
                                            <h3 class="head"> {{item.title}}</h3>
                                            <div class="desc" v-html="item.content"></div>
                                            <small>{{item.createTime}}</small>
                                        </li>
                                    </ul>
                                    <p @click="getMore('n1')" class="col more text-center mt20" v-if='pageNum.n1 * pageSize < total.n1'>加载更多 <i class="el-icon-more"></i></p>
                                    <p class="more text-center mt20" v-else>加载完毕</p>
                                </div>

                                <div v-show='total.n1 == 0 ' class="noneMsg">
                                    暂无相关消息
                                </div>

                            </div>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane label="消息" name="n2">
                        <el-card class="box-card">
                            <div class="listBox">
                                <div v-show='total.n2 > 0 '>
                                    <ul>
                                        <li v-for="(item,idx) in messageArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item,'n2')">
                                            <h3 class="head"> {{item.title}}</h3>
                                            <div class="desc" v-html="item.content"></div>
                                            <small>{{item.createTime}}</small>
                                        </li>
                                    </ul>
                                    <p @click="getMore('n2')" class="col more text-center mt20" v-if='pageNum.n2 * pageSize < total.n2'>加载更多 <i class="el-icon-more"></i> </p>
                                    <p class="more text-center mt20" v-else>加载完毕</p>
                                </div>

                                <div v-show='total.n2 == 0 ' class="noneMsg">
                                    暂无相关消息
                                </div>
                            </div>
                        </el-card>

                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { qmxMsgList, qmxMsgRead, conMsgList, conMsgRead, qmxMsgUpdate } from '@/api/system/msg.js'
import { mapGetters } from 'vuex'

export default {
    name: 'msbBox',

    data() {
        return {
            pageSize: 10,
            activeName: 'n1',
            activeNames: [],
            noticeArr: [],  //公告列表
            messageArr: [], //消息列表
            pageNum: {
                n1: 1,
                n2: 1
            },
            total: {
                n1: 0,
                n2: 0
            }
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    created() {
        // this.initList('n1', () => {
        //     this.initList('n2')
        // })
        this.initNoticeList()
        this.initMsgList()
    },
    methods: {
        //获取公告
        initNoticeList(key) {

            let params = {
                // companyId: this.organizationId,
                //userId: this.userId,
                isRelease: 1,
                pageSize: this.pageSize,
                pageNum: this.pageNum.n1
            }
            qmxMsgList(params).then(res => {

                let arrKey = 'noticeArr'

                if (params.pageNum > 1) {
                    this[arrKey] = this[arrKey].concat(res.data)
                }
                else {

                    this[arrKey] = res.data

                }
                this.total.n1 = res.total
            })

        },
        //获取消息
        initMsgList() {

            let params = {
                // companyId: this.organizationId,
                //userId: this.userId,
                isRelease: 1,
                pageSize: this.pageSize,
                pageNum: this.pageNum.n2,
            }
            conMsgList(params).then(res => {
                let arrKey = 'messageArr'
                if (params.pageNum > 1) {
                    this[arrKey] = this[arrKey].concat(res.data)
                }
                else {
                    this[arrKey] = res.data
                }
                this.total.n2 = res.total
            })

        },
        handleClick() {

        },
        readFunc(item, key) {

            if (item.isRead != 1) {
                this.$set(item, 'isRead', 1)
                if (key == 'n1') {
                    qmxMsgRead({ ids: [item.id], status: 1 })
                        .then(res => {
                            this.setMsgMum(this.msgNum)
                        })
                }
                else {
                    conMsgRead({ ids: [item.id], status: 1 })
                        .then(res => {
                            this.setMsgMum(this.msgNum)
                        })
                }

            }
        },
        getMore(key) {
            if (key == 'n1') {
                if (this.noticeArr.length < this.total.n1) {
                    this.pageNum[key] = this.pageNum[key] + 1
                    this.initNoticeList()
                }
            }
            else {
                if (this.messageArr.length < this.total.n2) {
                    this.pageNum[key] = this.pageNum[key] + 1
                    this.initMsgList()
                }
            }

        },
        setMsgMum() {
            this.$store.commit('SET_REDUCE_MSGNUM')
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    // margin: 10px auto;
    // min-height: 100px;
    // padding: 10px 30px;
    ::v-deep .el-tabs__header {
        margin: 0 0 40px;
    }
    ::v-deep .el-collapse {
        border-top: 1px solid #ffffff;
    }
    ::v-deep .el-collapse-item__header {
        height: auto;
        line-height: initial;
    }
    ul {
        padding: 0;
    }
    li {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        &.read {
            opacity: 0.8;
            .head {
                padding: 0;
                &::before {
                    content: " ";
                    display: none;
                }
            }
        }
        .head {
            width: 100%;
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            font-weight: normal;
            position: relative;
            padding-left: 10px;
            &::before {
                content: " ";
                position: absolute;
                left: 0;
                top: 50%;
                width: 6px;
                height: 6px;
                margin-top: -3px;
                border-radius: 20px;
                background-color: #ff0000;
            }
        }
        .desc {
            line-height: 22px;
            color: rgba(0, 0, 0, 0.7);
            font-size: 14px;
            margin: 10px 0;
        }
        small {
            color: rgba(0, 0, 0, 0.25);
        }
    }

    .more {
        cursor: pointer;
        color: #999;
    }
}
.noneMsg {
    line-height: 100px;
    text-align: center;
}
h1 {
    margin: 0;
    font-size: 24px;
    margin-bottom: 20px;
}
</style>