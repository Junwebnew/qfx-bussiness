<template>
    <div class="app-container">
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="17" :xs="24">
                    <div class="back-fff pad20 posRelative">
                        <resoursePrice :resourcesModule='4' :applicationType='json.applicationType' />
                        <el-row :gutter="20" class="mb16">
                            <el-col :span="24">
                                <p class="tit">基本信息</p>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :xs="24">
                                <el-row :gutter="20">
                                    <el-col :sm="12" :xs="24" class="mb16">
                                        <span class="custom-label">商标名称：</span>
                                        <div class="custom-r">
                                            {{json.tmName || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :sm="12" :xs="24" class="mb16">
                                        <span class="custom-label">注册号：</span>
                                        <div class="custom-r">
                                            {{json.regNum || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :sm="12" :xs="24" class="mb16">
                                        <span class="custom-label">国际分类：</span>
                                        <div class="custom-r">
                                            {{json.intClass}}类
                                        </div>
                                    </el-col>
                                    <el-col :sm="12" :xs="24" class="mb16">
                                        <span class="custom-label">专用权结束日期：</span>
                                        <div class="custom-r">
                                            {{json.annDate || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :sm="12" :xs="24" class="mb16">
                                        <span class="custom-label">代理机构：</span>
                                        <div class="custom-r">
                                            {{json.agency || '--'}}
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="mt10 back-fff pad20 custom-box">
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">申请人信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请人主体：</span>
                                <div class="custom-r">
                                    {{json.userName || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请人地址：</span>
                                <div class="custom-r">
                                    {{json.userAddress || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="7" :xs="24">
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='4' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { agencyCancelDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'

export default {
    name: 'renewal-detail',
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
    created() {

        // this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {
        initPage(id) {

            id = id || this.json.id

            agencyCancelDetail(id)
                .then(res => {
                    this.title = (res.data.tmName || '') + ' 机构注销详情'
                    this.json = res.data
                    // if (type != 'second') {
                    //     this.getPrice(res.data.applicationType)
                    // }

                })
        },
        //领取后
        receiveAfter() {
            this.initPage()
            this.$emit('reload')
        },
        //获取扣费
        getPrice(applicationType) {
            //续展  企业9，个人 17
            this.$store.dispatch('getResoursePrice', applicationType ? '17' : '9').then(res => {
                // console.log('0000', res)
                this.price = res.value
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

        }
    }
}
</script>
<style lang="scss" scoped>
</style>