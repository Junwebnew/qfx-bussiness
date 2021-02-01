<template>
    <div class="app-container">
        <div class="back-fff form-box mb10">

            <div class="notice-box scroll-box">
                <div class="clear num-conut">
                    <div class="num_i" v-for='(item,idx) in noticeNUm' :key='idx' @click="selectNum(item.annNum)">
                        <div class="box" :class="{active: activeNum == item.annNum }">
                            <h3 class="col">{{item.annNum}}期</h3>
                            <p>{{parseTime(item.startTime,'{y}-{m}-{d}')}}</p>
                            <p>异议剩余<span class="text-danger">{{lastTime(item.endTime)}}</span>天</p>
                        </div>
                    </div>
                </div>
            </div>
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名称" prop="preliNoticeTrademarkName" class="el-form-item-none">
                            <el-input v-model="queryParams.preliNoticeTrademarkName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="preliNoticeApplicationNameCn" class="el-form-item-none">
                            <el-input v-model="queryParams.preliNoticeApplicationNameCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人地址" prop="preliNoticeApplicationDddrCn" class="el-form-item-none">
                            <el-input v-model="queryParams.preliNoticeApplicationDddrCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="代理机构" prop="preliNoticeAgencyName" class="el-form-item-none">
                            <el-input v-model="queryParams.preliNoticeAgencyName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="机构地址" prop="preliNoticeAgencyNameDddrCn" class="el-form-item-none">
                            <el-input v-model="queryParams.preliNoticeAgencyNameDddrCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="18" :sm="12" :xs="24" align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-form-item label="申请/共有人" prop="applicationNameAndGyr" class="el-form-item-none">
                    <el-input v-model="queryParams.applicationNameAndGyr" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item> -->

            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" empty-text='数据处理中，请稍候'>

                <el-table-column prop="name" label="商标图样" width='120'>
                    <template slot-scope="scope">
                        <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col">
                            <img :src="$getImg(scope.row.preliNoticeTrademarkPic,2) || ''" width="110px">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="商标名称" width='200' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.preliNoticeTrademarkName || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册号" prop="preliNoticeApplicationNumber" width='100px'>
                </el-table-column>
                <el-table-column label="国际分类" width='110px'>
                    <template slot-scope="scope">
                        <span>{{scope.row.preliNoticeTypeOfTrademarkCode}}类-{{scope.row.preliNoticeTypeOfTrademarkName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.preliNoticeApplicationNameCn}}</span>
                    </template>
                </el-table-column>
                <el-table-column width='100'>
                    <template slot="header" slot-scope="scope">
                        <span class='mr5'>可异议</span>
                        <el-tooltip class="item" effect="dark" content="公告商标与以往注册商标相同+近似对比后的可异议数据结果" placement="top-start">
                            <i class="el-icon-question col f16"></i>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <span>{{scope.row.objectionCountNum || '--'}}个</span>
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
</template>

<script>
import { objectionAnalysisList } from "@/api/resources";
import { noticeNumList } from "@/api";
export default {

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
                preliNoticeTrademarkName: undefined,
                preliNoticeApplicationNameCn: undefined,
                preliNoticeApplicationDddrCn: undefined,
                preliNoticeAgencyName: undefined,
                preliNoticeAgencyNameDddrCn: undefined,
            },
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            noticeNUm: [], //************* */
            activeNum: 0, //第多少期
        }
    },
    created() {

    },
    mounted() {

        this.initNoticeNum()
    },
    methods: {

        initNoticeNum() {

            this.loading = true;

            noticeNumList().then(res => {
                this.noticeNUm = res.data.data
                this.activeNum = res.data.data[0].annNum
                this.getList()
            })
                .catch(() => {
                    this.loading = false;
                })
        },
        getList() {   //获取table表单的数据**************************************

            this.loading = true;

            this.queryParams.preliminaryNoticeNumber = this.activeNum

            objectionAnalysisList(this.queryParams).then(response => {
                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        /*获取选中的期号**/
        selectNum(num) {
            this.activeNum = num
            this.getList()
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

            let key = this.$route.name + obj.preliNoticeTrademarkId
            this.$router.push('/resources/objection-analysis/detail?id=' + obj.id + "&num=" + this.activeNum)

        },
        lastTime(e) {
            if (!e) return 0
            let now = (new Date()).getTime();

            if (e > now) {
                return Math.ceil((e - now) / (24 * 60 * 60 * 1000))
            } else {
                return 0
            }
        }
    },
    beforeDestroy() {
    }
}
</script>
<style lang="scss" scoped>
.notice-box {
    overflow: auto;
    font-size: 0;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    margin-bottom: 16px;
    text-align: center;
    .num-conut {
        margin: 0 auto;
        // min-width: 1200px;
        white-space: nowrap;
    }
    .num_i {
        display: inline-block;
        text-align: center;
        min-width: 100px;
        width: 8.33%;
        padding: 4px;
        box-sizing: border-box;
        .box {
            font-size: 12px;
            border: 1px solid #eeeeee;
            border-radius: 2px;
            width: 100%;
            padding: 6px 0;
            cursor: pointer;
            transition: all 0.2s;
            line-height: 1.5;
            &:hover {
                background: #ebf6ff;
                border-color: #08f;
            }

            &.active {
                color: #ffffff;
                background: #08f;

                h3,
                span {
                    color: #ffffff !important;
                }
            }
        }
        h3 {
            margin: 0;
            font-weight: 600;
        }
    }
}
</style>