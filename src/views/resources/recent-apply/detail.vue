<template>
    <div class="app-container">

        <div class="mb10 custom-box" id='detail'>
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24" class="full-height-auto">
                    <div class="back-fff pad20 posRelative">
                        <resoursePrice :resourcesModule='1' :applicationType='json.applicationType' />
                        <el-row :gutter="10" class="mb16">
                            <el-col :span="24">

                                <p class="tit">基本信息</p>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :sm="12" :xs="24">
                                <el-row :gutter="10">
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">注册号：</span>
                                        <div class="custom-r">
                                            {{json.trademarkNumber || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">国际分类：</span>
                                        <div class="custom-r">
                                            {{json.typeOfTrademarkCode}}类-{{json.typeOfTrademarkName || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">申请日期：</span>
                                        <div class="custom-r">
                                            {{json.trademarkApplicationDate || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">代理机构：</span>
                                        <div class="custom-r">
                                            {{json.agency || '--'}}
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label"> 商标图样：</span>
                                <div class="custom-r">
                                    <div class="imgBox pointer">

                                        <img :src="$getImg(json.graphicStyle,2)" @click="$openNewView( $getImg(json.graphicStyle,1) ) ">
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24" class="mb16">
                                <span class="custom-label">已选择类似群：</span>
                                <div class="custom-r">
                                    {{json.similarGroup || '--'}}
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <span class="custom-label">已选择商品项：</span>
                                <div class="custom-r">
                                    <ul class="product-list">
                                        <li class="list" v-for='(item,idx) in initServerArr(json.goodsServices)' :key='idx' :title=" replaceDel(item) " v-html="item"></li>
                                    </ul>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="mt10 back-fff pad20 custom-box">
                        <el-row :gutter="10">
                            <el-col :span="24" class="mb16">
                                <p class=" tit">申请人信息</p>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label">申请人主体：</span>
                                <div class="custom-r">
                                    {{json.applicationNameCn || '--'}}
                                </div>
                            </el-col>
                            <el-col :lg="12" :sm="12" :xs="24">
                                <span class="custom-label"> 申请人地址：</span>
                                <div class="custom-r">
                                    {{json.applicationDddrCn || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='1' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { recentApplyDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'

export default {
    name: 'recent-apply-detail',
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            json: {},
            loading: false,
            tableData: [],
            price: ''
        }
    },
    // watch: {
    //     $route(now) {
    //         if ('recent-apply-detail' == now.name && this.$route.query.id != now.query.id) {
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

            const loading = this.$eleLoading("#detail");


            recentApplyDetail(id)
                .then(res => {
                    this.json = res.data

                    loading.close()
                }).catch(() => {
                    loading.close()
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