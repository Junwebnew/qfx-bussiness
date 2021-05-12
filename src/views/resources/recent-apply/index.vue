<template>
    <div class="app-container">
        <div class=" back-fff full-height">
            <div class="form-box " v-show="showSearch">
                <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :lg="6" :sm="12" :xs="24">
                            <el-form-item label="代理机构" prop="agency" class="el-form-item-none">
                                <el-input v-model="queryParams.agency" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24">
                            <el-form-item label="注册号" prop="trademarkNumber" class="el-form-item-none">
                                <el-input v-model="queryParams.trademarkNumber" placeholder="精准:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24">
                            <el-form-item label="国际分类" prop="typeOfTrademarkCode" class="el-form-item-none">
                                <el-input v-model="queryParams.typeOfTrademarkCode" placeholder="精准:请输入1-45" clearable size="small" @keyup.enter.native="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                            <el-form-item label="申请人地址" prop="applicationDddrCn" class="el-form-item-none">
                                <el-input v-model="queryParams.applicationDddrCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                            <el-form-item label="申请人类型" prop="applicationType" class="el-form-item-none">
                                <el-select v-model="queryParams.applicationType" clearable size="small" style="width: 100%">
                                    <el-option v-for="dict in applicantTypeEnum" :key="dict.value" :label="dict.key" :value="dict.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                            <el-form-item label="号码类型" prop="phoneType" class="el-form-item-none">
                                <el-select v-model="queryParams.phoneType" clearable size="small" style="width: 100%">
                                    <el-option v-for="dict in phoneTypeArr" :key="dict.value" :label="dict.key" :value="dict.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                            <el-form-item label="申请日期" prop="time" class="el-form-item-none">
                                <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="6" :sm="12" :xs="24" align='right' class="el-form-item-none mt2">
                            <div>
                                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                                <SwitchForm :showSwitch.sync="showSwitch" />
                            </div>
                        </el-col>
                    </el-row>

                    <!-- <el-form-item label="申请/共有人" prop="applicationNameAndGyr" class="el-form-item-none">
                    <el-input v-model="queryParams.applicationNameAndGyr" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item> -->

                </el-form>
            </div>
            <div class="backLine"></div>
            <div class="back-fff pad20">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="20" class="lin32">
                        <span class="f18">{{$route.meta.title}}</span>
                        <span class="page_recourse_desc">{{$route.meta.desc}}</span>
                    </el-col>
                    <el-col :span="4" align='right'>
                        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="tableData" row-key="id">
                    <el-table-column prop="name" label="商标图样" align='center' width='80'>
                        <template slot-scope="scope">
                            <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col imgBox">
                                <img :src="$getImg(scope.row.graphicStyle,2) || scope.row.originalGraphicStyle || ''">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="注册号" width='90' prop="trademarkNumber">
                        <template slot-scope="scope">
                            <span class="col pointer" @click="checkDetail(scope.row)">
                                {{scope.row.trademarkNumber}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="国际分类" width='120' show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.typeOfTrademarkCode}}类-{{scope.row.typeOfTrademarkName || '暂无'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请日期" width='100' prop="trademarkApplicationDate"></el-table-column>
                    <el-table-column label="代理机构" prop="agency" show-overflow-tooltip></el-table-column>
                    <el-table-column label="申请人" prop="applicationNameCn" show-overflow-tooltip></el-table-column>
                    <el-table-column label="最新领取记录" prop='bestNewRemark'>
                        <template slot-scope="scope">
                            <div class='operation'>
                                <span class="f12">{{scope.row.bestNewRemark || '--'}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width='70' align='center'>
                        <template slot-scope="scope">
                            <div class='operation'>
                                <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            </div>
        </div>
        <!-- ****************************************详情弹窗************************************** -->
        <draw ref='myDraw'>
            <detail ref='myDetail' @reload='getList' />
        </draw>
    </div>
</template>

<script>
import { recentApplyList } from "@/api/resources";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
export default {
    name: "recentApply",
    mixins: [resourseMixin],
    components: {
        draw, detail
    },
    data() {
        return {
            //显示搜索框
            showSearch: true,
            //显示loading
            loading: false,
            //数据列表 
            tableData: [],
            //总数
            total: 0,
            // 日期范围
            dateRange: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasPhone: true,
                agency: undefined,
                trademarkNumber: undefined,
                typeOfTrademarkCode: undefined,
                applicationDddrCn: undefined,
                applicationType: undefined,
            }
        }
    },
    created() {

    },
    mounted() {
        this.getList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            recentApplyList(this.addDateRange(this.queryParams, this.dateRange, { start: 'trademarkApplicationDateStart', end: 'trademarkApplicationDateEnd' })).then(response => {
                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {
            this.$refs.myDraw.openDraw({ title: obj.trademarkNumber + '详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        }
    },
    beforeDestroy() {
    }
}


</script>
<style lang="scss" scoped>
.imgBox {
    width: 60px;
    height: 60px;
    display: block;
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>