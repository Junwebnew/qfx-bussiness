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
                                    <el-col :lg="21" :sm="21" :xs="12">
                                        <el-tooltip class="item" effect="dark" content="新增提醒" placement="top">
                                            <el-button size="mini" type='warning' circle icon="el-icon-bell" @click="handleAddTips()" />
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">客户名称：</span>
                                <div class="custom-r">
                                    {{json.customerName || '--'}}
                                </div>
                            </el-col>

                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">联系人：</span>
                                <div class="custom-r">
                                    {{json.contactName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">联系电话：</span>
                                <div class="custom-r">
                                    {{json.contactPhone}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">联系QQ：</span>
                                <div class="custom-r">
                                    {{json.contactQq || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">联系微信：</span>
                                <div class="custom-r">
                                    {{json.contactWx || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">所属商务：</span>
                                <div class="custom-r">
                                    {{json.counselorId || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">申请人名称：</span>
                                <div class="custom-r">
                                    {{json.applicantName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">所属部门：</span>
                                <div class="custom-r">
                                    {{json.deptId || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">线索状态：</span>
                                <div class="custom-r">
                                    {{formatterStatus(json.followStatus)}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">资源来源：</span>
                                <div class="custom-r">
                                    {{json.resourceId || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">资源类型：</span>
                                <div class="custom-r">
                                    {{json.resourceType || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">业务类型：</span>
                                <div class="custom-r">
                                    {{json.vocId || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="8" :xs="24" class="mb16">
                                <span class="custom-label">线索说明：</span>
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
                                    <el-col :lg="21" :sm="21" :xs="12">
                                        <el-tooltip class="item" effect="dark" content="新增" placement="top">
                                            <el-button size="mini" type='primary' circle icon="el-icon-plus" @click="handleAddMarks()" />
                                        </el-tooltip>

                                        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                                            <el-button size="mini" circle icon="el-icon-refresh" @click="getmarks()" />
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col>
                                <el-table :data="marksList" row-key="id" class="table" v-loading='markLoading'>
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column label="跟进用户" prop="userName"></el-table-column>
                                    <el-table-column label="线索状态" :formatter='formatterStatus' prop="businessStatusId"></el-table-column>
                                    <el-table-column label="备注时间" prop="remarkDate"></el-table-column>
                                    <el-table-column label="备注内容" prop="remarkContent"></el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <!-- <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' />
                    </div>
                </el-col> -->
            </el-row>
        </div>
        <!-- 新增备注 -->
        <addMarks ref='addMarks' :clueStatueArr='clueStatueArr' @finish='getmarks' />
        <!-- 新增提醒 -->
        <addTimeTips ref='addTimeTips' />
    </div>
</template>

<script>
import { clueDetail, getClueStatusList, clueMarksList } from "@/api/center";

import { addMarks, addTimeTips } from '../_module'

export default {
    components: {
        addMarks, addTimeTips
    },
    data() {
        return {
            title: '线索详情页',
            json: {},
            markLoading: false,
            tableData: [],
            //线索状态
            clueStatueArr: [],
            //资源类型
            resourceTypeArr: [],
            //业务类型
            vocIdArr: [],
            marksList: []
        }
    },
    created() {
        this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')

        getClueStatusList().then(res => {
            this.clueStatueArr = res
        })

    },
    methods: {
        initPage(id) {
            clueDetail(id)
                .then(res => {
                    this.title = (res.data.customerName || '') + ' 线索详情页'
                    this.json = res.data
                })
            this.getmarks(id)
        },
        getmarks(id) {
            id = id || this.json.id
            this.markLoading = true
            clueMarksList({ businessId: id, pageNum: 1, pageSize: 100, type: 1 }).then(res => {
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

            let item = this.clueStatueArr.filter(i => i.code == code)[0]

            return (item && item.name) || code
        },
        //增加备注
        handleAddMarks() {
            this.$refs.addMarks.show(this.json)
        },
        //新增时间提醒
        handleAddTips() {
            this.$refs.addTimeTips.show(this.json)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>