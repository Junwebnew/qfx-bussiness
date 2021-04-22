<template>
    <div class="app-container">
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="17" :xs="24">
                    <div class="back-fff pad20 custom-box posRelative">
                        <resoursePrice :resourcesModule='5' :applicationType='json.applicationType' />
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">申请人信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请人名称：</span>
                                <div class="custom-r">
                                    {{json.companyName || '--'}}
                                </div>
                            </el-col>

                            <el-col :lg="12" :sm="24" :xs="24">
                                <span class="custom-label">社会信用代码：</span>
                                <div class="custom-r">
                                    {{json.creditCode || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="12" :xs="24">
                                <span class="custom-label">申请人地址：</span>
                                <div class="custom-r">
                                    {{json.companyAddress || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="mt10 back-fff pad20 custom-box">
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">变更信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">

                                <div class="text-center">名称变更记录</div>
                                <div v-if="json.changeNameVoList" class="mt20 timeList">
                                    <el-timeline>
                                        <el-timeline-item v-for="(activity, index) in json.changeNameVoList" :key="index" :timestamp="splitTimes(activity.createTime) " placement="top">
                                            {{activity.companyName}}
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                                <p v-else class="text-center">(暂无)</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <div class="text-center">地址变更记录</div>
                                <div v-if="json.changeAddressVoList" class="mt20 timeList">
                                    <el-timeline>
                                        <el-timeline-item v-for="(activity, index) in json.changeAddressVoList" :key="index" :timestamp="splitTimes(activity.createTime)" placement="top">
                                            {{activity.companyAddress}}
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                                <p v-else class="text-center">(暂无)</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="7" :xs="24">
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='5' :resourceId='json.id' @reload='initPage' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { changeDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'
export default {
    name: 'change-detail',
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: [],
            price: ""
        }
    },
    // watch: {
    //     $route(now) {

    //         if ('change' == now.name && this.$route.query.id != now.query.id) {
    //             this.initPage(now.query.id)
    //         }
    //     }
    // },
    created() {
        // this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {

        initPage(id) {

            id = id || this.json.id

            changeDetail(id)
                .then(res => {

                    this.title = (res.data.companyName || '') + ' 变更详情'
                    this.json = res.data
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
        splitTimes(times) {

            return (times || '').split(' ')[0]
        }
    }
}
</script>
<style lang="scss" scoped>
.timeList {
    padding: 0 30px;
    ::v-deep .el-image-viewer__close .el-icon-circle-close {
        color: #ffffff;
    }
    ::v-deep .el-timeline-item__timestamp {
        font-size: 14px;
        color: #2d8cf0;
        font-weight: bold;
    }
    ::v-deep .el-timeline-item__content {
        color: #515a6e;
    }
}
</style>