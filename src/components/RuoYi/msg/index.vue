<template>

    <el-popover placement="bottom-end" trigger="click" @show='initList' v-model="visibleShow">
        <div class="messBox">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="noticeStr" name="n1">
                    <div class="listBox">
                        <ul v-show='noticeNum > 0 '>
                            <li v-for="(item,idx) in noticeArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item,'noticeNum')">
                                <h3>{{item.title}}</h3>
                                <p class="text-delic2" :class="{'show':item.show}">{{item.content}}</p>
                                <small>{{item.createTime}}</small>
                            </li>
                        </ul>
                        <div v-show='noticeNum == 0 ' class="noneMsg">
                            暂无相关公告
                        </div>
                    </div>

                    <div class="btns">
                        <div @click="readAllfunc">全部已读</div>
                        <div class='col' @click='goNotice'>
                            查看全部
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="messageStr" name="n2">
                    <div class="listBox">
                        <ul v-show='messageNum > 0 '>
                            <li v-for="(item,idx) in messageArr" :key='idx' :class="{'read':item.isRead}" @click="readFunc(item,'messageNum')">
                                <h3> {{item.title}}</h3>
                                <p class="text-delic2" :class="{'show':item.show}">{{item.content}}</p>
                                <small>{{item.createTime}}</small>
                            </li>
                        </ul>
                        <div v-show='messageNum == 0 ' class="noneMsg">
                            暂无相关消息
                        </div>
                    </div>

                    <div class="btns">
                        <div @click="readAllfunc">全部已读</div>
                        <div class='col' @click='goNotice'>
                            查看全部
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-badge :value="msgNum || '' " class="item-num" slot="reference">
            <!-- <svg-icon icon-class="email" /> -->
            <!-- <i class="el-icon-message"></i> -->
            <i class="el-icon-chat-dot-round"></i>
        </el-badge>
    </el-popover>

</template>

<script>

import { qmxMsgList, qmxMsgRead } from '@/api/system/msg.js'
import { mapGetters } from 'vuex'


export default {
    name: 'msbBox',

    data() {
        return {
            visibleShow: false,
            activeName: 'n1',
            data: [
                {
                    title: '灭霸来信',
                    content: '一起吧，来为宇宙转身就ask成绩拔尖删除绝爱是把见死不救啊好暗杀计划阿斯顿啊是巨大安徽省氨甲环酸v氨基酸的',
                    createTime: "2020.10.10 10:10"
                },
                {
                    title: '灭霸来信',
                    content: '一起吧，来为宇宙转身就ask成绩拔尖删除绝爱是把见死不救啊好暗杀计划阿斯顿啊是巨大安徽省氨甲环酸v氨基酸的',
                    createTime: "2020.10.10 10:10"
                },
            ],
            noticeArr: [],
            noticeNum: 0,
            messageArr: [],
            messageNum: 0,
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ]),
        noticeStr() {
            return this.noticeNum == 0 ? '公告' : ('公告(' + this.noticeNum + ')')
        },
        messageStr() {
            return this.messageNum == 0 ? '消息' : ('消息(' + this.messageNum + ')')
        },
        msgNum() {
            return this.$store.state.otherData.msgNum
        }

    },
    mounted() {
        // qmxMsgList({})

        this.initList(true)
    },
    methods: {
        initList(bool) {


            let params = {
                // companyId: this.organizationId,
                // userId: this.userId,
                isRead: 0, //0 未读 1已读
                pageSize: 10,
                pageNum: 1,
            }

            Promise.all([
                qmxMsgList(Object.assign({ type: 1 }, params)),
                qmxMsgList(Object.assign({ type: 0 }, params))
            ]).then(res => {

                this.noticeArr = res[0].data
                this.noticeNum = res[0].total

                this.messageArr = res[1].data
                this.messageNum = res[1].total

                this.setMsgMum(res[0].total + res[1].total)
            })
        },
        readFunc(item, key) {

            this.$set(item, 'show', !item.show)

            if (item.isRead == 0) {
                item.isRead = 1
                qmxMsgRead({ ids: [item.id], status: 1 })
                    .then(res => {

                        this[key] -= 1

                        this.setMsgMum(this.msgNum - 1)
                    })

            }
        },
        goto() {
            window.open(this.url)
        },
        handleClick() {

        },
        goNotice() {
            this.$router.push('/center/notice')
            this.visibleShow = false
        },
        readAllfunc() {

            if (this.noticeArr && this.noticeArr.length) {
                let a = this.noticeArr.map(i => i.id)
                let ids = this.messageArr.map(i => i.id).concat(a)
                qmxMsgRead({ ids: ids, status: 1 })
                    .then(res => {
                        this.initList()
                    })
            }
        },
        setMsgMum(num) {
            this.$store.commit('SET_MSGNUM', num)
        }
    }
}
</script>
<style lang="scss" scoped>
.item-num {
    // line-height: 1.5em;
    vertical-align: inherit;
    line-height: 1.5;
}
.messBox {
    width: 300px;
    ::v-deep .el-tabs__header {
        margin: 0;
    }
}
.listBox {
    height: 400px;
    overflow: auto;
    padding: 0;
    margin: 0;
    ul {
        padding: 0;
        margin: 0;
    }
    li {
        padding: 10px;
        border-bottom: 1px solid #eaeaea;
        cursor: pointer;
        &:hover {
            background-color: #f0faff;
        }
        &:last-child {
            border-bottom: none;
        }
        &.read {
            background: #f8f8f9;
        }
        h3 {
            margin: 4px 0;
            font-size: 12px;
            position: relative;
        }
        p {
            color: #888;
            font-size: 12px;
            margin: 4px 0;
            &.show {
                overflow: auto;
                display: block;
            }
        }
        small {
            color: #999;
        }
    }
}
.btns {
    padding-top: 10px;
    text-align: center;
    border-top: 1px solid #eaeaea;
    font-size: 12px;
    > div {
        width: 50%;
        height: 24px;
        line-height: 24px;
        display: inline-block;
        position: relative;
        color: #888;
        cursor: pointer;
        &:first-child {
            border-right: 1px solid #eaeaea;
        }
    }
}
.noneMsg {
    line-height: 100px;
    text-align: center;
}
</style>