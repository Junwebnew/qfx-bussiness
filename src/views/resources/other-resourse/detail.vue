<template>
    <div class="app-container">
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24">
                    <div class="back-fff pad20 custom-box full-height2 posRelative">
                        <el-row :gutter="10">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">资源信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">企业名称：</span>
                                <div class="custom-r">
                                    {{json.companyName || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">企业地址：</span>
                                <div class="custom-r">
                                    {{json.companyAddress || '--'}}
                                </div>
                            </el-col>

                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">联系人：</span>
                                <div class="custom-r">
                                    {{json.contactPeople || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">手机号：</span>
                                <div class="custom-r">
                                    {{json.contactPhone || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">联系情况：</span>
                                <div class="custom-r">
                                    {{json.contactSituation || '--'}}
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
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList.sync='phoneList' resourcesModule='10' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { externalResourceDetail } from "@/api/resources";
import { phoneList } from '../_module'

export default {
    name: 'recent-apply-detail',
    components: {
        phoneList
    },
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: [],
            phoneList: []
        }
    },
    created() {
        // this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {
        initPage(id) {

            // console.log('8888', id)

            id = id || this.json.id

            externalResourceDetail(id)
                .then(res => {

                    this.title = (res.data.companyName || '')

                    this.json = res.data

                    this.phoneList = [{ id: id, phone: res.data.contactPhone }]

                })
        },
        initServerArr(str) {
            str = (str + '').replace(/null/g, "")
            if (/;,/.test(str)) {
                return str ? str.split(";,") : ["--"];
            }
            return str ? str.split(",") : ["--"];
        },
        //领取后
        receiveAfter(type) {

            if (type == 'all') {
                this.finishReceive()
            }
            this.$emit('reload')
        },
        //替换del标签
        replaceDel(item) {
            if (item) {
                return item.replace(/<(del|\/del).*?>/g, '')
            }
            return ''
        },
        finishReceive() {
            this.phoneList = []
        },
        getResourse(row) {

        }
    }
}
</script>
<style lang="scss" scoped>
.mb16 {
    margin-bottom: 16px;
}
.product-list {
    // border: 1px solid #edf0f4;
    // padding: 10px 10px 0;
    li {
        display: inline-block;
        // height: 32px;
        // line-height: 32px;
        line-height: 1.5em;
        min-width: 32%;
        margin-right: 1.3%;
    }
}
</style>