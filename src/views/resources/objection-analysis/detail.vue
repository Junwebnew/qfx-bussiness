<template>
    <div class="app-container">
        <div class="head-parts mb10">
            <div class="words">{{title}}</div>
        </div>
        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">基本信息</span>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">商标名称：</span>
                    <div class="custom-r">
                        {{json.trademarkName || '--'}}
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">异议截止：</span>
                    <div class="custom-r">
                        <span class="f14">剩余: <b class="col-red">{{lastTime(json.preliminaryObjectionClosingDate)}}</b> 天</span>
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 商标图样：</span>
                    <div class="custom-r">
                        <el-image style="width:100px" :src="$getImg(json.preliNoticeTrademarkPic)  || ''" :alt="'营业执照'" :preview-src-list="[$getImg(json.preliNoticeTrademarkPic,1)]"></el-image>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">申请/注册号：</span>
                    <div class="custom-r">
                        {{json.applicationNumber || '--'}}
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">国际分类：</span>
                    <div class="custom-r">
                        {{json.typeOfTrademarkCode}}类-{{json.typeOfTrademarkName || '--'}}
                    </div>

                </el-col>
                <!-- <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 当前状态：</span>
                    <div class="custom-r">
                        {{json.legalStatusName || '--'}}
                    </div>
                </el-col> -->
            </el-row>
            <el-row :gutter="20">
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">申请日期：</span>
                    <div class="custom-r">
                        {{json.preliNoticeTrademarkApplicationDate || '--'}}
                    </div>

                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">代理机构：</span>
                    <div class="custom-r">
                        {{json.preliNoticeAgencyName || '--'}}
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">申请人信息</span>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">申请人主体:</span>
                    <div class="custom-r">
                        {{json.applicationNameCn || '--'}}
                    </div>

                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 申请人地址：</span>
                    <div class="custom-r">
                        {{json.applicationDddrCn || '--'}}
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">联系信息</span>
                </el-col>
                <el-col :span='24'>
                    <el-table v-loading="loading" :data="tableData" row-key="id">
                        <el-table-column label="商标图样" align='center'>
                            <template slot-scope="scope">
                                <a :href="$getImg(scope.row.trademarkPic,2) || 'javascript:void(0)'" target="_blank">
                                    <img :src="$getImg(scope.row.trademarkPic,2)" height="50px">
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column label="商标名称" prop='trademarkName'>
                        </el-table-column>
                        <el-table-column label="资源类型">
                            <template slot-scope="scope">
                                {{scope.row.resourceType == 1 ? '商标名相同' : '商标名近似' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="国际分类" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.typeOfTrademarkCode}}类-{{scope.row.typeOfTrademarkName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="商标注册号" prop="applicationNumber" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="商标申请日期" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.trademarkApplicationDate}}
                            </template>
                        </el-table-column>
                        <el-table-column label="商标申请人" prop="applicationNameCn" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="相关操作" width='220' align='center'>
                            <template slot-scope="scope">
                                <div class='operation'>
                                    <el-button size="mini" type="success " @click="getResourse(scope.row)">领取</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { objectionAnalysisDetail, objectionAnalysisDetailList } from "@/api/resources";
import { mapGetters } from 'vuex'

export default {
    name: 'objection-analysis-detail',
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    watch: {
        $route(now) {
            if ('objection-analysis-detail' == now.name && this.$route.query.id != now.query.id) {
                this.initPage(now.query.id, now.query.num)
            }
        }
    },
    created() {
        this.initPage(this.$route.query.id, this.$route.query.num)
    },
    methods: {

        initPage(id, num) {
            // id = '789453628768903168'
            // objectionAnalysisDetailList(id)
            //     .then(res => {
            //         this.json = res.data || {}
            //         this.initList(res.data.trademarkId)
            //     })
            this.initList(id, num)
        },
        initList(id, num) {
            //获取的是列表，包含了当前商标数据
            objectionAnalysisDetailList({ preliNoticeTrademarkId: id, preliminaryNoticeNumber: num })
                .then(res => {
                    // console.log('989888', res)
                    this.json = res.data[0]
                    this.tableData = res.data
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
        getResourse(row) {

        }
    }
}
</script>
<style lang="scss" scoped>
</style>