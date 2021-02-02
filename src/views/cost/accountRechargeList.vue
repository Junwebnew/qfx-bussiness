<template>
    <div class="app-container">
        <div class="back-fff pad20-20-0 mb10" v-show="showSearch && superAdmin">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" @submit.native.prevent label-width="90px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="公司名称" prop="orgId">
                            <el-select v-model="queryParams.orgId" style="width:100%" clearable placeholder="请选择" size="small" @keyup.enter.native="handleQuery">
                                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="充值时间" prop="dateRange">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="24" :xs="24" align='right'>
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
                <el-table-column prop="orgName" label="公司名称"></el-table-column>
                <el-table-column label="充值金额" prop="money" width="150">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.money}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="充值人员" prop="userName" width="150"></el-table-column>
                <el-table-column label="充值星数" prop="number" width="150"></el-table-column>
                <el-table-column label="剩余星数" prop="accountNumber" width="150"></el-table-column>
                <el-table-column label="充值时间" prop="createTime" width="150"></el-table-column>
                <el-table-column label="充值备注" prop="remark"></el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

    </div>
</template>

<script>
import { rechargeAccountList } from "@/api/account";
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
            //时间段
            dateRange: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                orgId: '',
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '本周',
                        onClick(picker) {

                            const end = new Date();
                            const start = new Date();

                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDay() - 1));
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getDate() - 1));
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '本年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            let day = Math.ceil((new Date() - new Date(new Date().getFullYear().toString())) / (24 * 60 * 60 * 1000)) - 1;
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ],
                disabledDate: time => {
                    let _now = Date.now()
                    return time.getTime() > _now
                }
            }
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

            rechargeAccountList(this.addDateRange(this.queryParams, this.dateRange)).then(res => {

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
            this.dateRange = ''
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