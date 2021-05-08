<template>
    <div class="app-container">
        <div class="head-parts mb10">
            <div class="words">{{title}}</div>
        </div>

        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="17" :xs="24">
                    <div class="back-fff pad20 custom-box full-height2 posRelative">
                        <resoursePrice :resourcesModule='8' :applicationType='json.applicationType' />
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">企业信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">企业名称：</span>
                                <div class="custom-r">
                                    {{json.applicantName || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">经营状态：</span>
                                <div class="custom-r">
                                    {{json.businessState || '--'}}
                                </div>
                            </el-col>

                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">企业法人：</span>
                                <div class="custom-r">
                                    {{json.legalPerson || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">社会信用代码：</span>
                                <div class="custom-r">
                                    {{json.creditCode || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">所属行业：</span>
                                <div class="custom-r">
                                    {{json.industry || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">注册时间：</span>
                                <div class="custom-r">
                                    {{json.regDate || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">企业地址：</span>
                                <div class="custom-r">
                                    {{json.address || '--'}}
                                </div>
                            </el-col>

                            <el-col :lg="24" :sm="24" :xs="24">
                                <span class="custom-label">经营范围：</span>
                                <div class="custom-r">
                                    {{json.bsinessScope || '--'}}
                                </div>
                            </el-col>

                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="7" :xs="24">
                    <div class="back-fff pad20 full-height full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='7' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { companyWhiteDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'

export default {
    name: 'recent-apply-detail',
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: []
        }
    },
    created() {
        this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {
        initPage(id) {

            id = id || this.json.id

            companyWhiteDetail(id)
                .then(res => {

                    this.title = (res.data.applicantName || '')

                    this.json = res.data
                })
        },
        //领取后
        receiveAfter(type) {
            //拨打领取，只需要刷新列表页
            if (type == 'all') {
                this.initPage()
            }
            this.$emit('reload')
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