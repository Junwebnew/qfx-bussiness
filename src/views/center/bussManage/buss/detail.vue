<template>
    <div class="app-container">
        <div class="head-parts mb10">
            <div class="words">{{title}}</div>
        </div>
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col>
                    <div class="back-fff pad20 ">
                        <el-row :gutter="20" class="mb16">
                            <el-col :span="24" class="mb16 tit">
                                <el-row :gutter="20">
                                    <el-col :lg="3" :sm="3" :xs="12">
                                        <span>基本信息</span>
                                    </el-col>
                                    <el-col :lg="21" :sm="21" :xs="12" v-if='showBtns'>
                                        <el-button type="text" size='mini' @click="handleAddTips()">新增提醒</el-button>
                                        <el-button type="text" size='mini' @click="goComplete()">转为成单</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">客户名称：</span>
                                <div class="custom-r">
                                    {{json.customerName || '--'}}
                                </div>
                            </el-col>

                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系人：</span>
                                <div class="custom-r">
                                    {{json.contactName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系电话：</span>
                                <div class="custom-r">
                                    {{json.contactPhone}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系QQ：</span>
                                <div class="custom-r">
                                    {{json.contactQq || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系微信：</span>
                                <div class="custom-r">
                                    {{json.contactWx || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">所属商务：</span>
                                <div class="custom-r">
                                    {{json.counselorName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">申请人名称：</span>
                                <div class="custom-r">
                                    {{json.applicantName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">所属部门：</span>
                                <div class="custom-r">
                                    {{json.deptId || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">商机状态：</span>
                                <div class="custom-r">
                                    {{json.followStatusName}}
                                </div>
                            </el-col>
                            <!-- <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">资源来源：</span>
                                <div class="custom-r">
                                    {{json.resourceId || '--'}}
                                </div>
                            </el-col> -->
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">资源类型：</span>
                                <div class="custom-r">
                                    {{json.resName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">业务类型：</span>
                                <div class="custom-r">
                                    {{json.vocName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">商机说明：</span>
                                <div class="custom-r">
                                    {{json.busexplain || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="mt10 back-fff pad20 custom-box">
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16 tit">
                                <el-row :gutter="20">
                                    <el-col :lg="3" :sm="3" :xs="12">
                                        <span>备注信息</span>
                                    </el-col>
                                    <el-col :lg="21" :sm="21" :xs="12" v-if='showBtns'>
                                        <el-button type="text" size='mini' @click="handleChange()">状态变更</el-button>
                                        <el-button type="text" size='mini' @click="handleAddMarks()">新增备注</el-button>
                                        <el-button type="text" size='mini' @click="getmarks()">刷新</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col>
                                <ul class="marksBox">
                                    <li v-for="(item,idx) in marksList" :key='idx'>
                                        <h3 class="head">
                                            <img src="" :onerror='$headImg.error' alt="头像">
                                        </h3>
                                        <div class="r-box">
                                            <p class="top">
                                                <small>{{item.remarkDate}}</small>
                                            </p>
                                            <div class="desc">
                                                <small class="b">{{item.userName}}</small> <small>{{item.remarkContent}}</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 修改状态 -->
        <changeStatus ref='changeStatus' :clueStatueArr='clueStatueArr' @finish='getmarks' />
        <!-- 新增备注 -->
        <addMarks ref='addMarks' :clueStatueArr='clueStatueArr' @finish='getmarks' />
        <!-- 新增提醒 -->
        <addTimeTips ref='addTimeTips' />
        <!-- 成单 -->
        <completeBuss ref='completeBuss' @finish='getmarks' />
    </div>
</template>

<script>
import { bussDetail, getClueStatusList, clueMarksList } from "@/api/center";

import { addMarks, addTimeTips, changeStatus, completeBuss } from '../_module'

export default {
    components: {
        addMarks, addTimeTips, changeStatus, completeBuss
    },
    data() {
        return {
            title: '商机详情页',
            json: {},
            markLoading: false,
            tableData: [],
            //商机状态
            clueStatueArr: [],
            //资源类型
            resourceTypeArr: [],
            //业务类型
            vocIdArr: [],
            marksList: [],
            showBtns: true
        }
    },
    watch: {
        $route(now) {
            if ('clue-detail' == now.name && this.json.id != now.query.id) {
                this.initPage(now.query.id)
            }
        }
    },
    created() {
        this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')

        this.showBtns = this.$route.query.btn ? false : true

        this.$store.dispatch('getBussStatus', 1).then(res => {
            this.clueStatueArr = res
        })

        this.$store.dispatch('getCenterType', 1).then(res => {
            this.vocIdArr = res
        })

    },
    methods: {
        initPage(id) {

            id = id || this.json.id

            bussDetail(id)
                .then(res => {
                    this.title = (res.data.customerName || '') + ' 商机详情页'
                    this.json = res.data
                })
            this.getmarks(id)
        },
        getmarks(id) {
            id = id || this.json.id
            this.markLoading = true
            //可选type : 1商机，2商机
            clueMarksList({ businessId: id, pageNum: 1, pageSize: 100 }).then(res => {
                this.marksList = res.data
                this.markLoading = false
            })
        },
        initServerArr(str) {
            str = (str + '').replace(/null/g, "")
            if (/;,/.test(str)) {
                return str ? str.split(";,") : ["--"];
            }
            return str ? str.split(",") : ["--"];
        },
        //替换del标签
        replaceDel(item) {
            if (item) {
                return item.replace(/<(del|\/del).*?>/g, '')
            }
            return ''
        },
        getResourse(row) {

        },
        formatterStatus(code) {

            if (typeof code == 'object') {
                code = code.businessStatusId
            }

            let item = this.clueStatueArr.filter(i => i.id == code)[0]

            return (item && item.name) || code
        },
        //状态变更
        handleChange() {
            this.$refs.changeStatus.show(this.json)
        },
        //增加备注
        handleAddMarks() {
            this.$refs.addMarks.show(this.json)
        },
        //新增时间提醒
        handleAddTips() {
            this.$refs.addTimeTips.show(this.json)
        },
        //去商机成单
        goComplete(row) {
            this.$refs.completeBuss.show(this.json)
        }
    }
}
</script>
<style lang="scss" scoped>
.marksBox {
    overflow: hidden;
    li {
        padding: 10px 0;
        overflow: hidden;
        .head {
            float: left;
            width: 44px;
            height: 44px;
            margin-right: 20px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .r-box {
            font-size: 12px;
            color: #515a6e;
            .top {
                margin-bottom: 10px;
                small {
                    display: inline-block;
                    min-width: 50px;
                }
            }
            .desc {
                color: #888;
                small + small {
                    margin-left: 10px;
                }
            }
            .b {
                color: #000;
                font-weight: bolder;
            }
        }
    }
}
</style>