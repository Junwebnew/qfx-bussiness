<template>
    <div class="app-container">
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24">
                    <div class="back-fff pad20 custom-box full-height-auto posRelative">
                        <!-- <resoursePrice :resourcesModule='8' :applicationType='json.applicationType' /> -->
                        <el-row :gutter="10">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">任务信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">商标名称：</span>
                                <div class="custom-r">
                                    {{json.trademarkName || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请号：</span>
                                <div class="custom-r">
                                    {{json.regNum || '--'}}
                                </div>
                            </el-col>

                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">国际分类：</span>
                                <div class="custom-r">
                                    {{json.bigTypeCode}}-{{json.bigTypeName}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请人名称：</span>
                                <div class="custom-r">
                                    {{json.applicationNameCn || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">结果：</span>
                                <div class="custom-r">
                                    <el-tag v-if="json.taskResult == 1" type="success" size="mini">成功</el-tag>
                                    <el-tag v-else-if="json.taskResult == -1" type="danger" size="mini">失败</el-tag>
                                    <el-tag v-else type="info" size="mini">处理中</el-tag>
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">状态：</span>
                                <div class="custom-r">
                                    <el-tag v-if="json.taskStatus == 1" type='info' size="mini">已新建</el-tag>
                                    <el-tag v-else-if="json.taskStatus == 2" type="success" size="mini">处理中</el-tag>
                                    <el-tag v-else-if="json.taskStatus == 3" type="danger" size="mini">已结束</el-tag>
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">代理机构：</span>
                                <div class="custom-r">
                                    {{json.agency || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">备注：</span>
                                <div class="custom-r">
                                    {{json.remark || '--'}}
                                </div>
                            </el-col>

                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height full-height2">
                        <p class="tit mb16">联系信息</p>
                        <el-table :data="json.phoneList" row-key="id" class="table" v-loading='loading'>
                            <el-table-column label="联系方式" prop="phone" width='134'></el-table-column>
                            <el-table-column label="操作" align='center'>
                                <template slot-scope="scope">
                                    <div class='operation'>
                                        <el-button size="mini" type="text" @click="getNewNumber(scope.row,1)">拨打</el-button>
                                        <el-button size="mini" type="text" @click="getNewNumber(scope.row,2)">复制</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </div>
        <span ref='copy' style="display:none" @click="testCopy($event)">复制</span>
    </div>
</template>

<script>
import { holderDetail, getResourcePhoneNumber } from "@/api/resources";

import Global from "@/layout/components/global.js";
import { $CliCopy } from '@/utils/installTools.js'

export default {
    name: 'recent-apply-detail',
    components: {

    },
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: [],
            selsectedPhone: false,
        }
    },
    created() {

    },
    methods: {
        initPage(id) {

            id = id || this.json.id

            holderDetail(id)
                .then(res => {

                    this.title = (res.data.trademarkName || '')

                    this.json = res.data
                })
        },
        getNewNumber(row, type) {


            if (row.isGet) {
                this.nextHandle(type)
                return
            }
            getResourcePhoneNumber(row.id)
                .then(res => {

                    let phone = res.data.phone

                    this.$set(row, 'isGet', true)
                    this.$set(row, 'phone', phone)

                    this.selsectedPhone = phone

                    this.nextHandle(type)

                }).catch(msg => {
                    console.log('999', msg)
                })
        },
        nextHandle(type) {
            //拨打电话
            if (type == 1) {

                Global.$emit("takePhone", this.selsectedPhone)
            }
            //复制电话
            else if (type == 2) {
                this.$refs.copy.click()
                // $CliCopy(e, phone)
            }
        },
        testCopy(e) {
            $CliCopy(e, this.selsectedPhone)
        }
    }
}

</script>
<style lang="scss" scoped>
.mb16 {
    margin-bottom: 16px;
}
</style>