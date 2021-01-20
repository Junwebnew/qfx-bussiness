<template>
    <div class="app-container">
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24">
                    <div class="back-fff pad20 posRelative" id='detail'>
                        <resoursePrice :resourcesModule='9' :applicationType='json.applicationType' />
                        <el-row :gutter="20" class="mb16">
                            <el-col :span="24">
                                <p class="tit">基本信息</p>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="12" :xs="24">
                                <el-row :gutter="20">
                                    <el-col :sm="24" :xs="24" class="mb16">
                                        <span class="custom-label">公告期号：</span>
                                        <div class="custom-r">
                                            {{json.noticeNumber || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :sm="24" :xs="24" class="mb16">
                                        <span class="custom-label">商标名称：</span>
                                        <div class="custom-r">
                                            {{json.tmName || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">注&nbsp;&nbsp;册&nbsp;&nbsp;号&nbsp;&nbsp;：</span>
                                        <div class="custom-r">
                                            {{json.regNum || '--'}}
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" class="mb16">
                                        <span class="custom-label">国际分类：</span>
                                        <div class="custom-r">
                                            {{json.intClass}}类
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label"> 公告文件：</span>
                                <div class="custom-r">
                                    <div class="imgBox">
                                        <el-image :src="$getImg(json.noticeFile) ||  ''" :alt="'商标图样'" :preview-src-list="[$getImg(json.noticeFile,1)]"></el-image>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label">申请日期：</span>
                                <div class="custom-r">
                                    {{json.tmApplicationDate || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label">代理机构：</span>
                                <div class="custom-r">
                                    {{json.agency || '--'}}
                                </div>
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
                                    {{json.applicationNameCn || '--'}}
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
                <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='3' :resourceId='json.id' @reload='initPage' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { noticeArriveDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'

export default {
    name: 'objection-analysis-detail',
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            title: '详情页',
            noticeNum: '',
            json: {},
            loading: false,
            tableData: [],
            selectItem: {},
        }
    },
    // watch: {
    //     $route(now) {
    //         if ('objection-analysis-detail' == now.name && this.$route.query.id != now.query.id) {
    //             this.initPage(now.query.id, now.query.num)
    //         }
    //     }
    // },
    created() {
        this.noticeNum = this.$route.query.num
        this.initPage(this.$route.query.id)
    },
    methods: {

        initPage(id, num) {

            id = id || this.json.id

            this.selectItem = {}

            const loading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)',
                target: "#detail"
            });

            noticeArriveDetail(id)
                .then(res => {
                    this.json = res.data || {}
                    loading.close()
                })
            // this.initList(id)
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
        lastTime(e) {
            if (!e) return 0
            else {
                e = (new Date(e)).getTime();
            }
            let now = (new Date()).getTime();

            if (e > now) {
                return Math.ceil((e - now) / (24 * 60 * 60 * 1000))
            } else {
                return 0
            }
        },
        getResourseTel(row) {
            this.selectItem = row
        },
        contrastFunc(row) {
            this.$refs.contrast.getDetail(this.json.preliNoticeTrademarkId, row.trademarkId)
        }
    }
}
</script>
<style lang="scss" scoped>
.selectItem {
    margin-bottom: 20px;
    line-height: 1.5;
    > div {
        margin-bottom: 6px;
    }
    label {
        float: left;
        width: 60px;
    }
    p {
        overflow: hidden;
        color: #515a6e;
    }
}
</style>