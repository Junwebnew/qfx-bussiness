<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="companyName" class="el-form-item-none">
                            <el-input v-model="queryParams.companyName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人地址" prop="companyAddress" class="el-form-item-none">
                            <el-input v-model="queryParams.companyAddress" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="12" :sm="12" :xs="24" align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div class="back-fff pad20">
            <!-- <el-row :gutter="10" class="mb8">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row> -->
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

                <el-table-column label="申请人" prop='companyName' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人地址" prop='companyAddress' show-overflow-tooltip> </el-table-column>
                <el-table-column label="社会信用代码" width='190' prop='creditCode' show-overflow-tooltip> </el-table-column>
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
        <!-- ****************************************详情弹窗************************************** -->
        <draw ref='myDraw'>
            <detail ref='myDetail' />
        </draw>
    </div>
</template>

<script>
import { changeList } from "@/api/resources";
import { draw } from '../_module'
import detail from './detail'
export default {
    name: "change",
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
                companyAddress: "",
                companyName: ''
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
        this.getList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            changeList(this.queryParams).then(response => {
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

            this.$refs.myDraw.openDraw({ title: obj.companyName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        },
        // checkDetail(obj) {

        //     let key = this.$route.name + obj.id
        //     this.$router.push('/resources/change/detail?id=' + obj.id)
        // }
    },
    beforeDestroy() {
    }
}


</script>