<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="10">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请号" prop="regNum" class="el-form-item-none">
                            <el-input v-model="queryParams.regNum" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="任务状态" prop="bigTypeCode" class="el-form-item-none">
                            <el-select v-model="queryParams.taskStatus" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in taskStatusArr" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名称" prop="trademarkName" class="el-form-item-none">
                            <el-input v-model="queryParams.trademarkName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="applicationNameCn" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationNameCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" class="el-form-item-none mt2 text-right">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <SwitchForm :showSwitch.sync="showSwitch" />
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="12" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                    <span class="page_recourse_desc">{{$route.meta.desc}}</span>
                </el-col>
                <el-col :span="12" align='right'>
                    <el-button type="primary" size="mini" class="mr10" @click="handleAdd()" v-hasPermi="['add-btn']">新增任务</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData">
                <el-table-column label="商标名称" prop="trademarkName" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.trademarkName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请号" prop="regNum" width='100' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.regNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="国际分类" prop="trademarkName" width='100' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.bigTypeCode}}-{{scope.row.bigTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人名称" prop="applicationNameCn" show-overflow-tooltip></el-table-column>
                <el-table-column label="代理机构" prop="agency" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="regDate" width='70'>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.taskStatus == 1" type='info' size="mini">已新建</el-tag>
                        <el-tag v-else-if="scope.row.taskStatus == 2" type="success" size="mini">处理中</el-tag>
                        <el-tag v-else-if="scope.row.taskStatus == 3" type="danger" size="mini">已结束</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="结果" prop='bestNewRemark' width='70'>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.taskResult == 1" type="success" size="mini">成功</el-tag>
                        <el-tag v-else-if="scope.row.taskResult == -1" type="danger" size="mini">失败</el-tag>
                        <el-tag v-else type="info" size="mini">处理中</el-tag>
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
        <!-- 新增资源 -->
        <addResourse ref='addResourse' @finish='getList' />
        <!-- ****************************************详情弹窗************************************** -->
        <draw ref='myDraw'>
            <detail ref='myDetail' @reload='getList' />
        </draw>
    </div>
</template>

<script>
import { holderList, holderCancel } from "@/api/resources";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
import addResourse from './_module/addResourse'
export default {
    name: "recentApply",
    mixins: [resourseMixin],
    components: {
        draw, detail, addResourse
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
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                trademarkName: undefined,
                agency: undefined,
                applicationNameCn: undefined,
                bigTypeCode: undefined,
                bigTypeName: undefined,
                regNum: undefined
            },
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            taskStatusArr: [
                { key: '已创建', value: "1" },
                { key: '处理中', value: "2" },
                { key: '已结束', value: "3" },
            ]
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
            holderList(this.queryParams).then(response => {

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
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.regNum + ' 详情' })
            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        },
        //新增任务
        handleAdd() {
            this.$refs.addResourse.showFunc({}, '新建任务')
        },
    },
    beforeDestroy() {
    }
}


</script>