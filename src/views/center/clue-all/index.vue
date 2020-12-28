<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="联系人" prop=" contactName" class="el-form-item-none">
                            <el-input v-model="queryParams.contactName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="contactPhone" class="el-form-item-none">
                            <el-input v-model="queryParams.contactPhone" placeholder="精准:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="客户名称" prop="customerName" class="el-form-item-none">
                            <el-input v-model="queryParams.customerName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="线索状态" prop="followStatusList" class="el-form-item-none">
                            <el-select v-model="queryParams.vocId" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="资源类型" prop="resourceType" class="el-form-item-none">
                            <el-select v-model="queryParams.resourceType" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in resourceTypeArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="业务类型" prop="vocId" class="el-form-item-none">
                            <el-select v-model="queryParams.vocId" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in vocIdArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="创建时间" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span: 8, offset: 0}" :sm="12" :xs="24" align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
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
                <el-table-column prop="name" label="商标图样">
                    <template slot-scope="scope">
                        <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col">
                            <img :src="$getImg(scope.row.graphicStyle,2) || scope.row.originalGraphicStyle || ''">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="注册号" align='center' prop="trademarkNumber"></el-table-column>
                <el-table-column label="商标大类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.typeOfTrademarkCode}}类-{{scope.row.typeOfTrademarkName || '暂无'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="申请日期" align='center' prop="trademarkApplicationDate"></el-table-column>
                <el-table-column label="代理机构" prop="agency" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请人" prop="applicationNameCn" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新备注" prop='bestNewCallPhoneLog' align='center' show-overflow-tooltip> </el-table-column>
                <el-table-column label="相关操作" width='220' align='center'>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)" v-hasPermi="['t-detail']">详情</el-button>
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
import { getClueStatusList, clueMyList } from "@/api/center";
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
            },
            //资源类型
            clueStatueArr: [],
            //资源类型
            resourceTypeArr: [],
            //业务类型
            vocIdArr: [],
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

        getClueStatusList().then(res => {
            console.log('0909', res)
            this.clueStatueArr = res
        })
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            clueMyList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                console.log(123, response)
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

            this.$router.push('/resources/recent-apply/detail?id=' + obj.id)
        }
    },
    beforeDestroy() {
    }
}


</script>