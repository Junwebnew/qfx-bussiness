<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" @submit.native.prevent>
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入部门名称" maxLength='100' clearable size="small" @keyup.enter.native="handleQuery" />
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

            <el-table v-loading="loading" :data="deptList">
                <el-table-column prop="name" label="公司名称"></el-table-column>
                <el-table-column prop="status" label="状态" width='80'>
                    <div slot-scope="scope">
                        <el-tag v-if="scope.row.commonStatus" type="success" size='mini'>正常</el-tag>
                        <el-tag v-else type="danger" size='mini'>取消</el-tag>
                    </div>
                </el-table-column>
                <el-table-column label="剩余次数" prop="accountNum" width="200">
                    <div slot-scope="scope">
                        <span>{{scope.row.accountNum || '--'}}次</span>
                    </div>
                </el-table-column>
                <el-table-column label="最近充值时间" prop="rechargeTime" width="200"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width='220px' fixed="right">
                    <template slot-scope="scope">
                        <el-button class="col-del" size="mini" type="text" @click="costDetail(scope.row)">账号充值</el-button>
                        <el-button class="col-del" size="mini" type="text" @click="costDetail(scope.row)">充值详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        </div>
    </div>
</template>

<script>
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
            deptList: [],
            //总数
            total: 1,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                name: undefined,
                level: 2
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
        /** 查询部门列表 */
        getList() {
            this.loading = true;

            console.log(1114444444)

            qmxCompanyList(this.queryParams).then(res => {


                this.deptList = res.data

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
            this.$router.push('/cost/accountRecharge?id=' + row.id)
        }
    }
};
</script>