<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch && superAdmin">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" @submit.native.prevent label-width="90px">
                <el-row :gutter="20" class="mb20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="电话号码" prop="name" class="el-form-item-none" v-if="superAdmin">
                            <el-input v-model="queryParams.phone" placeholder="请输入电话号码" clearable size="small" style="width: 100%" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="公司名称" prop="name" class="el-form-item-none" v-if="superAdmin">
                            <el-input v-model="queryParams.phone" placeholder="请输入电话号码" clearable size="small" style="width: 100%" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="dataList">
                <el-table-column label="电话号码" prop="orgName"></el-table-column>
                <el-table-column label="公司名称" prop="moduleName" width="200"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.commonStatus" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

    </div>
</template>

<script>
import { costAccountList } from "@/api/account";
import { qmxCompanyList } from "@/api/system/dept";
import { deepClone } from '@/utils/index'

import { mapGetters } from 'vuex'
export default {
    name: "Dept",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //列表数据
            dataList: [],
            //总数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                phone: ''
            },
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin',
        ])
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;

            costAccountList(this.queryParams).then(res => {

                this.dataList = res.data
                this.total = res.total
                this.loading = false;

            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList();
        },
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 用户状态修改
        handleStatusChange(row) {
            let text = row.status === "0" ? "启用" : "停用";
            this.$confirm('确认要"' + text + '""' + row.name + '"电话吗?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return changeUserStatus(row.id, row.status);
            }).then(() => {
                this.msgSuccess(text + "成功");
            }).catch(function () {
                row.status = row.status === "0" ? "1" : "0";
            });
        },
    }
};
</script>