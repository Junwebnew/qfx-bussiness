<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch && superAdmin">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" @submit.native.prevent>
                <el-form-item label="公司名称" prop="name">
                    <el-select v-model="queryParams.orgId" clearable placeholder="请选择" @keyup.enter.native="handleQuery">
                        <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
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
                <el-table-column prop="orgName" label="公司名称"></el-table-column>
                <el-table-column label="模块名称" prop="moduleName" width="200"></el-table-column>
                <el-table-column label="电话号码" prop="phone" width="200"></el-table-column>
                <el-table-column label="用户名称" prop="userId" width="200"></el-table-column>
                <el-table-column label="抵扣次数" prop="deductionNumber" width="200"></el-table-column>
                <el-table-column label="剩余次数" prop="createTime" width="200"></el-table-column>
                <el-table-column label="抵扣时间" prop="createTime" width="200"></el-table-column>
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
            //机构列表
            deptList: [],
            //总数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                orgId: '',
            },
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin',
        ])
    },
    created() {

        let optId = this.$route.query.id

        if (optId) {
            this.queryParams.orgId = optId
        }

        /** 查询所有机构列表 */
        qmxCompanyList().then(res => {
            this.deptList = res.data

        })


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

            this.getList();
        },
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** selectTree 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            };
        },
        //前端进行名称搜索
        depArrfilter(arr, name) {

            if (!name || name == '') {

                return arr
            }

            return arr.filter(i => {

                if (i.children && i.children.length > 0) {
                    i.children = this.depArrfilter(i.children, name)
                }

                return (i.name.indexOf(name) != -1 || (i.children && i.children.length != 0))
            })

        },
        /** 修改按钮操作 */
        costDetail(row) {
            this.$route.push('/cost/accountRecharge?id=' + row.id)
        }
    }
};
</script>