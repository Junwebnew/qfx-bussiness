<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="10">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="客户名称" prop="customerName" class="el-form-item-none">
                            <el-input v-model="queryParams.customerName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="mobilePhone" class="el-form-item-none">
                            <el-input v-model="queryParams.mobilePhone" placeholder="精准:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="资源类型" prop="applicationType" class="el-form-item-none">
                            <el-select v-model="queryParams.applicationType" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in applicantTypeEnum" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg=" showSwitch ? 12 : 6 " :sm="24" :xs="24" align='right' class="mb20">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="10" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="14" align='right'>
                    <el-button type="primary" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">录入资源</el-button>
                    <el-button type="danger" size="mini" @click="handleEliminate()" v-hasPermi="['batch-del']" :disabled="!ids.length">批量剔除</el-button>
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type='selection'></el-table-column>
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" prop="contactsName" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop="mobilePhone" show-overflow-tooltip></el-table-column>
                <el-table-column label="分配部门" prop="allocationDept" show-overflow-tooltip></el-table-column>
                <el-table-column label="资源来源" show-overflow-tooltip :formatter='formatterResourse'></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="lastFollowContent">
                    <template slot-scope="scope">
                        <div>
                            <span class="f12">{{scope.row.remark}}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="left" width="120" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                            <el-button class="col-update" size="mini" type="text" v-hasPermi="['edit']" @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button class="col-del" size="mini" type="text" v-hasPermi="['del']" @click="handleEliminate(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- 增加修改用户框 -->
        <resourseModule ref='resourseModule' @finish='getList' />
    </div>
</template>

<script>
import { resourseList, resourseDel } from "@/api/center"
import SwitchForm from "@/components/SwitchForm";
import { deepClone } from '@/utils/index'
import resourseModule from './_module/resourseModule'

export default {
    components: { SwitchForm, resourseModule },
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
                pageSize: 10,
                customerName: undefined,
                mobilePhone: undefined,
                applicationType: undefined
            },
            //资源来源枚举
            customerSourceEnumList: [],
            //申请人类型枚举
            applicantTypeEnum: [],
        }
    },
    created() {

    },
    mounted() {
        this.getList()

        this.qmxDataKey().then(res => {
            // console.log('0000', res)
            this.customerSourceEnumList = res['customerSourceEnumList']
            this.applicantTypeEnum = res['applicantTypeEnumList']
        })
    },
    methods: {

        getList() {   //获取table表单的数据**************************************
            this.loading = true;
            resourseList(this.queryParams).then(response => {

                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        //匹配类型
        formatterType(row) {

            let item = this.applicantTypeEnum.filter(i => i.value == row.applicationType)[0]

            return (item && item.key) || '--'
        },
        //匹配来源
        formatterResourse(row) {

            let item = this.customerSourceEnumList.filter(i => i.value == row.customerSource)[0]

            return (item && item.key) || '--'
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {
            this.resourceType = []
            this.vocId = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(row) {
            this.$refs.resourseModule.showFunc(row, '详情', 'check')
        },
        //新增资源
        handleAdd() {
            this.$refs.resourseModule.showFunc({}, '新增资源')
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$refs.resourseModule.showFunc(deepClone(row), '修改资源')
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //删除
        handleEliminate(obj) {

            let tit = '是否批量删除线索？'
            let that = this

            if (obj) {
                this.ids = [obj.id]
                tit = '是否删除 ' + obj.customerName + " ？"
            }

            this.$confirm(tit, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return resourseDel(that.ids);

            }).then(() => {

                this.getList();
                this.msgSuccess("删除成功");

            })
                .catch(msg => {
                    console.log(11111, msg)
                })
        }
    },
    beforeDestroy() {
    }
}


</script>