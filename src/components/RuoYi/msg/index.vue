<template>

    <el-popover placement="bottom-end" trigger="click" @show='initList' v-model="visibleShow">
        <div class="messBox">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="noticeStr" name="n1">
                    <div class="listBox">
                        <ul v-show='noticeNum > 0 '>
                            <li v-for="(item,idx) in noticeArr" :key='idx' @click="readFunc(item,'noticeNum')">
                                <h3 :class="{'read':item.isRead}">{{item.title}}</h3>
                                <div class="text-delic2" :class="{'show':item.show}" v-html="item.content"></div>
                                <small>{{item.createTime}}</small>
                            </li>
                        </ul>
                        <div v-show='noticeNum == 0 ' class="noneMsg">
                            暂无未读公告
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
                            <li v-for="(item,idx) in messageArr" :key='idx' @click="readFunc(item,'messageNum')">
                                <h3 :class="{'read':item.isRead}"> {{item.title}}</h3>
                                <div class="text-delic2" :class="{'show':item.show}" v-html="item.content"></div>
                                <small>{{item.createTime}}</small>
                            </li>
                        </ul>
                        <div v-show='messageNum == 0 ' class="noneMsg">
                            暂无未读消息
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

import { qmxMsgListRead, qmxMsgRead, conMsgListRead, conMsgRead } from '@/api/system/msg.js'
import { mapGetters } from 'vuex'


export default {
    name: 'msbBox',

    data() {
        return {
            visibleShow: false,
            activeName: 'n1',
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
        // qmxMsgListRead({})

        this.initList(true)
    },
    methods: {
        initList(bool) {


            let params = {
                // companyId: this.organizationId,
                // userId: this.userId,
                isRead: 0, //0 未读 1已读
                isRelease: 1,
                pageSize: 10,
                pageNum: 1,
            }

            Promise.all([
                qmxMsgListRead(params),
                conMsgListRead(Object.assign({ params }))
            ]).then(res => {


                this.noticeArr = res[0].notReadData.data
                this.noticeNum = res[0].notReadData.total

                this.messageArr = res[1].notReadData.data
                this.messageNum = res[1].notReadData.total

                this.setMsgMum(res[0].notReadData.total + res[1].notReadData.total)
            })
        },
        readFunc(item, key) {

            this.$set(item, 'show', !item.show)
            // console.log(11111, item)


            if (item.isRead != 1) {
                this.$set(item, 'isRead', 1)
                if (key == 'noticeNum') {
                    qmxMsgRead({ ids: [item.id], status: 1 })
                        .then(res => {

                            this[key] -= 1

                            this.setMsgMum(this.msgNum - 1)
                        })
                }
                else {
                    conMsgRead({ ids: [item.id], status: 1 })
                        .then(res => {

                            this[key] -= 1

                            this.setMsgMum(this.msgNum - 1)
                        })
                }

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



            let that = this

            function redNotice() {
                if (that.noticeArr && that.noticeArr.length) {
                    let ids = that.noticeArr.map(i => i.id)
                    return qmxMsgRead({ ids: ids, status: 1 })
                }
                return {}
            }

            function redComMsg() {
                if (that.messageArr && that.messageArr.length) {

                    let ids = that.messageArr.map(i => i.id)
                    return conMsgRead({ ids: ids, status: 1 })
                }

                return {}
            }

            Promise.all([
                redNotice(),
                redComMsg()
            ]).then(res => {
                that.initList()
            })
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
        h3 {
            margin: 4px 0;
            font-size: 14px;
            position: relative;
            padding-left: 10px;
            color: #333;
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
            &.read {
                color: #888;
                padding-left: 0;
                &::before {
                    content: "";
                    display: none;
                }
            }
        }
        div {
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