<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="10">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名" prop="tmName" class="el-form-item-none">
                            <el-input v-model="queryParams.tmName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="代理机构" prop="agency" class="el-form-item-none">
                            <el-input v-model="queryParams.agency" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="注册号" prop="regNum" class="el-form-item-none">
                            <el-input v-model="queryParams.regNum" placeholder="精准:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="国际分类" prop="intClass" class="el-form-item-none">
                            <el-input v-model="queryParams.intClass" placeholder="精准:请输入1-45" clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请人" prop="applicationName" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请人地址" prop="applicationAddress" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationAddress" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请日期" prop="applydateRange" class="el-form-item-none">
                            <el-date-picker v-model="applydateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="驳回日期" prop="rejectdateRange" class="el-form-item-none">
                            <el-date-picker v-model="rejectdateRange" size="small" :picker-options="pickerOptions" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="号码类型" prop="phoneType" class="el-form-item-none">
                            <el-select v-model="queryParams.phoneType" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in phoneTypeArr" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" align='right' class="el-form-item-none mt2">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <SwitchForm :showSwitch.sync="showSwitch" />

                    </el-col>
                </el-row>

                <!-- <el-form-item label="申请/共有人" prop="applicationNameAndGyr" class="el-form-item-none">
                    <el-input v-model="queryParams.applicationNameAndGyr" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item> -->

            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="20" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                    <small class="ml10 col-warn">(疑似驳回数据是通过大数据技术进行分析预测，智能监测、比对、预测的驳回数据，数据存在一定误差。)</small>
                </el-col>
                <el-col :span="4" align='right'>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id">
                <el-table-column label="商标名" width='100' prop='tmName'>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.tmName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册号" width='90px' prop='regNum'> </el-table-column>
                <el-table-column label="国际分类" width='90px' prop='intClass'> </el-table-column>
                <el-table-column label="申请人" prop='applicationName'> </el-table-column>
                <!-- <el-table-column label="申请人地址" prop='applicationAddress' show-overflow-tooltip> </el-table-column> -->
                <el-table-column label="代理机构" prop='agency' show-overflow-tooltip> </el-table-column>
                <el-table-column label="注册日期" width='120px' prop='trademarkApplicationDate' />
                <el-table-column label="驳回日期" width='120px' prop='rejectDate' />
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
            <detail ref='myDetail' @reload='getList' />
        </draw>
    </div>
</template>

<script>
import { rejectList } from "@/api/resources";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
export default {
    name: "recentApply",
    mixins: [resourseMixin],
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
            //驳回日期范围
            rejectdateRange: [],
            //申请日期
            applydateRange: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasPhone: true,
                tmName: undefined,
                agency: undefined,
                regNum: undefined,
                intClass: undefined,
                applicationName: undefined,
                applicationAddress: undefined,
                phoneType: undefined
            },
            //初始日期
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
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
                        text: '最近三天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近五天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近七天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ],
                disabledDate: time => {
                    let _now = Date.now()
                    return time.getTime() > _now
                }
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

            let params = this.queryParams
            if (this.rejectdateRange && this.rejectdateRange.length > 0) {
                let arr = this.rejectdateRange
                params = Object.assign({ 'startRejectDate': arr[0], 'endRejectDate': arr[1] }, params)
            }
            if (this.applydateRange && this.applydateRange.length > 0) {
                let arr = this.applydateRange
                params = Object.assign({ 'startTademarkApplicationDate': arr[0], 'endTademarkApplicationDate': arr[1] }, params)
            }
            this.loading = true;
            rejectList(params).then(response => {
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

            this.rejectdateRange = []
            this.applydateRange = []

            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.tmName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        }
        // checkDetail(obj) {

        //     this.$router.push('/resources/reject/detail?id=' + obj.id)
        // }
    },
    beforeDestroy() {
    }
}


</script>