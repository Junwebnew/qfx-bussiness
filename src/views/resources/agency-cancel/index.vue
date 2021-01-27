<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="110px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="userName" class="el-form-item-none">
                            <el-input v-model="queryParams.userName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="注册号" prop="regNum" class="el-form-item-none">
                            <el-input v-model="queryParams.regNum" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="国际分类" prop="intClass" class="el-form-item-none">
                            <el-input v-model="queryParams.intClass" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="代理机构" prop="agency" class="el-form-item-none">
                            <el-input v-model="queryParams.agency" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人地址" prop="userAddress" class="el-form-item-none">
                            <el-input v-model="queryParams.userAddress" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="专用权结束日期" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :sm="12" :xs="24" align='right'>
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

            <el-table v-loading="loading" :data="tableData" row-key="id">
                <el-table-column label="商标名" prop='tmName' width='100' show-overflow-tooltip> </el-table-column>
                <el-table-column label="注册号" prop='regNum' width='90'> </el-table-column>
                <el-table-column label="国际分类" prop='intClass' width='90'> </el-table-column>
                <el-table-column label="申请人" prop='userName' show-overflow-tooltip> </el-table-column>
                <el-table-column label="申请人地址" prop='userAddress' show-overflow-tooltip> </el-table-column>
                <el-table-column label="代理机构" prop='agency' show-overflow-tooltip> </el-table-column>
                <el-table-column label="专用权结束日期" width='120px' prop='annDate' />
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
</template>

<script>
import { agencyCancelList } from "@/api/resources";
export default {
    name: "recentApply",
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
                applicationType: ""
            },
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            userList: []
        }
    },
    created() {

    },
    mounted() {

        // recentApplyList(this.queryParams).then(res => {
        //     console.log(1123, res)
        // })

        // let time = [this.$getFulldate(new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000)).date, this.$getFulldate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).date]

        // this.initDate = time
        // this.queryParams.time = time

        this.getList()
        // this.getUserList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            agencyCancelList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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

            let key = this.$route.name + obj.id
            this.$router.push('/resources/agency-cancel/detail?id=' + obj.id)
        }
    },
    beforeDestroy() {
    }
}


</script>