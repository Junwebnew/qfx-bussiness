<template>
    <div class="app-container">
        <div class="content">
            <div class="back-fff pad20">

                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="公告" name="n1">

                        <el-card class="box-card">
                            <div class="listBox">
                                <div v-show='total.n1 > 0 '>
                                    <ul>
                                        <li v-for="(item,idx) in noticeArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item)">
                                            <h3 class="head"> {{item.title}}</h3>
                                            <p class="desc">{{item.content}}</p>
                                            <small>{{item.createTime}}</small>
                                        </li>
                                    </ul>
                                    <p @click="getMore('n1')" class="col more text-center mt20" v-if='pageNum.n1 * pageSize < total.n1'>加载更多 <i class="el-icon-more"></i></p>
                                    <p class="more text-center" v-else>加载完毕</p>
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
                                        <li v-for="(item,idx) in messageArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item)">
                                            <h3 class="head"> {{item.title}}</h3>
                                            <p class="desc">{{item.content}}</p>
                                            <small>{{item.createTime}}</small>
                                        </li>
                                    </ul>
                                    <p @click="getMore('n2')" class="col more text-center mt20" v-if='pageNum.n2 * pageSize < total.n2'>加载更多 <i class="el-icon-more"></i> </p>
                                    <p class="more text-center" v-else>加载完毕</p>
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
import { qmxMsgList, qmxMsgRead, qmxMsgUpdate } from '@/api/system/msg.js'
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
        this.initList('n1', () => {
            this.initList('n2')
        })
    },
    methods: {

        initList(key, cb) {

            let params = {
                // companyId: this.organizationId,
                //userId: this.userId,
                isRelease: 1,
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
        readFunc(obj) {

            if (obj.isRead == 0) {
                obj.isRead = 1
                qmxMsgRead({ ids: [obj.id], status: 1 }).then(res => {
                    this.$store.commit('SET_REDUCE_MSGNUM')
                })
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
        },
        setMsgMum(num) {
            this.$store.commit('SET_MSGNUM', num)
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    // width: 1000px;
    // max-width: 80%;
    margin: 10px auto;
    min-height: 100px;
    padding: 10px 30px;
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
        }
        .head {
            width: 100%;
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            font-weight: normal;
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