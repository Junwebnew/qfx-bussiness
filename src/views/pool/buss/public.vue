<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="80px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="客户名称" prop="customerName" class="el-form-item-none">
                            <el-input v-model="queryParams.customerName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="contactPhone" class="el-form-item-none">
                            <el-input v-model="queryParams.contactPhone" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="7 " :sm="24" :xs="24" align='right' class="mb20">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id">
                <el-table-column type='index'></el-table-column>
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop='contactPhone' width='130' :formatter='formatterPhone'> </el-table-column>
                <!-- <el-table-column label="业务类型"  prop="vocName"></el-table-column> -->
                <!-- <el-table-column label="申请人名称"  prop="applicantName" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="资源类型" prop="resName" width='120'></el-table-column>
                <el-table-column label="业务类型" prop="vocName" width='120'></el-table-column>
                <el-table-column label="说明" prop="busexplain" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新备注" prop="remarkContent" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <span class="f12">{{scope.row.createTime}}_{{scope.row.remarkContent}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="70" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" class="col-other" type="text" v-hasPermi="['receive']" @click="handleDistribution(scope.row)">领取</el-button>
                            <!-- <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button> -->
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
import { publicPoolList, publicPoolReceive } from "@/api/center";

import SwitchForm from "@/components/SwitchForm";

import { phoneStartCode } from "@/utils";

export default {
    components: { SwitchForm },
    data() {
        return {
            //显示搜索框
            showSearch: true,
            //展示完整搜索框
            showSwitch: false,
            //显示loading
            loading: false,
            //数据列表 
            tableData: [],
            //总数
            total: 0,
            //id集合
            ids: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
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
            // this.queryParam.type = 2
            this.$set(this.queryParams, 'type', 2)
            publicPoolList(this.queryParams).then(response => {

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
            this.resetForm("queryForm");
            this.handleQuery();
        },
        //电话加码
        formatterPhone(row) {

            return phoneStartCode(row.contactPhone)
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/clueManage/clue/detail?id=' + obj.id + '&btn=none')
        },
        //分配
        handleDistribution(obj) {

            this.$confirm('是否领取 ' + obj.customerName + ' 此条资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return publicPoolReceive({ ids: [obj.id], type: 2 });

            }).then(() => {

                this.getList();
                this.msgSuccess("领取成功");

            }).catch(msg => {
                console.log(11111, msg)
            })
        },
    },
    beforeDestroy() {
    }
}


</script>