<template>
    <div class="app-container">
        <div class="mb10 custom-box" id='detail'>
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24">
                    <div class="full-height-auto">
                        <div class="back-fff pad20 posRelative">
                            <resoursePrice :resourcesModule='2' :applicationType='json.applicationType' />
                            <el-row :gutter="10" class="mb16">
                                <el-col :span="24">
                                    <p class="tit">基本信息</p>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :sm="12" :xs="24">
                                    <el-row :gutter="10">
                                        <el-col :sm="24" :xs="24" class="mb16">
                                            <span class="custom-label">商标名称：</span>
                                            <div class="custom-r">
                                                {{json.preliNoticeTrademarkName || '--'}}
                                            </div>
                                        </el-col>
                                        <el-col :sm="24" :xs="24" class="mb16">
                                            <span class="custom-label">异议截止：</span>
                                            <div class="custom-r">
                                                第{{json.preliminaryNoticeNumber}}期 <span class="f14">剩余 <b class="col-red">{{lastTime(json.preliminaryObjectionClosingDate)}}</b> 天</span>
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" class="mb16">
                                            <span class="custom-label">注&nbsp;&nbsp;册&nbsp;&nbsp;号&nbsp;&nbsp;：</span>
                                            <div class="custom-r">
                                                {{json.preliNoticeApplicationNumber || '--'}}
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" class="mb16">
                                            <span class="custom-label">国际分类：</span>
                                            <div class="custom-r">
                                                {{json.preliNoticeTypeOfTrademarkCode}}类-{{json.preliNoticeTypeOfTrademarkName || '--'}}
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :sm="12" :xs="24" class="mb16">
                                    <span class="custom-label"> 商标图样：</span>
                                    <div class="custom-r">
                                        <div class="imgBox pointer">
                                            <img :src="$getImg(json.preliNoticeTrademarkPic,2)" @click="$openNewView( $getImg(json.preliNoticeTrademarkPic,1) ) ">
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :sm="12" :xs="24" class="mb16">
                                    <span class="custom-label">申请日期：</span>
                                    <div class="custom-r">
                                        {{json.preliNoticeTrademarkApplicationDate || '--'}}
                                    </div>
                                </el-col>
                                <el-col :sm="12" :xs="24" class="mb16">
                                    <span class="custom-label">代理机构：</span>
                                    <div class="custom-r">
                                        {{json.preliNoticeAgencyName || '--'}}
                                    </div>
                                </el-col>
                                <el-col :sm="12" :xs="24">
                                    <span class="custom-label">申请人名称：</span>
                                    <div class="custom-r">
                                        {{json.preliNoticeApplicationNameCn || '--'}}
                                    </div>
                                </el-col>
                                <el-col :sm="12" :xs="24">
                                    <span class="custom-label">申请人地址：</span>
                                    <div class="custom-r">
                                        {{json.preliNoticeApplicationDddrCn || '--'}}
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="mt10 back-fff pad20 custom-box">
                            <el-row :gutter="10">
                                <el-col :span="24" class="mb16">
                                    <p class="tit">相似列表</p>
                                </el-col>
                                <el-col :span="24">
                                    <el-table v-loading="loading" :data="tableData" row-key="id">
                                        <el-table-column label="商标图样" align='center' width='100'>
                                            <template slot-scope="scope">
                                                <a :href="$getImg(scope.row.trademarkPic,2) || 'javascript:void(0)'" target="_blank" class="imgBox">
                                                    <img :src="$getImg(scope.row.trademarkPic,2)">
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="商标名称" prop='trademarkName' show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="资源类型" width='90' show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{scope.row.resourceType == 1 ? '商标名相同' : '商标名近似' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="国际分类" width='100' show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{scope.row.typeOfTrademarkCode}}类-{{scope.row.typeOfTrademarkName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="注册号" width='86' prop="applicationNumber">
                                        </el-table-column>
                                        <el-table-column label="申请日期" width='100' show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{scope.row.trademarkApplicationDate}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="申请人" prop="applicationNameCn" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="最新领取记录" prop='bestNewRemark'>
                                            <template slot-scope="scope">
                                                <div class='operation'>
                                                    <span class="f12">{{scope.row.bestNewRemark || '--'}}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width='140' align='center' class-name="small-padding fixed-width" fixed="right">
                                            <template slot-scope="scope">
                                                <div class='operation'>
                                                    <el-button size="mini" type="text" @click="getResourseTel(scope.row)">获取电话</el-button>
                                                    <el-button size="mini" type="text" @click="contrastFunc(scope.row)">对比分析</el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height full-height2">
                        <p class="tit mb16">联系信息</p>
                        <div class="selectItem" v-show="selectItem.applicationNameCn">
                            <div>
                                <label>商标名：</label>
                                <p>{{selectItem.trademarkName}}</p>
                            </div>
                            <div>
                                <label>注册号：</label>
                                <p>{{selectItem.applicationNumber}}</p>
                            </div>
                            <div>
                                <label>申请人：</label>
                                <p>{{selectItem.applicationNameCn}}</p>
                            </div>
                        </div>
                        <phoneList :phoneList=" selectItem.phoneList " resourcesModule='2' :resourceId='selectItem.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
        <contrast ref='contrast' />
    </div>
</template>

<script>
import { objectionAnalysisDetail, objectionAnalysisDetailList } from "@/api/resources";

import { phoneList, contrast, resoursePrice } from '../_module'

export default {
    name: 'objection-analysis-detail',
    components: {
        phoneList, contrast, resoursePrice
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
        // this.noticeNum = this.$route.query.num
        // this.initPage(this.$route.query.id)
    },
    methods: {

        initPage(id, num) {

            this.noticeNum = num

            id = id || this.json.id

            this.selectItem = {}

            const loading = this.$loading({
                lock: true,
                target: "#detail"
            });

            objectionAnalysisDetail(id)
                .then(res => {
                    this.json = res.data || {}
                    loading.close()
                })
            this.initList(id)
        },
        //领取后
        receiveAfter(type) {
            //拨打领取，只需要刷新列表页
            if (type == 'all') {
                this.initPage()
            }
            this.$emit('reload')
        },
        initList(id) {
            //获取的是列表
            this.loading = true
            objectionAnalysisDetailList({ analysisPreliId: id, noticeNumber: this.noticeNum })
                .then(res => {
                    this.tableData = res.data
                    this.loading = false
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
.imgBox {
    display: block;
    width: 70px;
    height: 70px;
    text-align: center;
    line-height: 70px;
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>