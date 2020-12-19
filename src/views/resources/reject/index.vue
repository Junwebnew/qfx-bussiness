<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="商标名" prop="tmName" class="el-form-item-none">
                            <el-input v-model="queryParams.tmName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="代理机构" prop="agency" class="el-form-item-none">
                            <el-input v-model="queryParams.agency" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="注册号" prop="trademarkNumber" class="el-form-item-none">
                            <el-input v-model="queryParams.trademarkNumber" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="商标大类" prop="intClass" class="el-form-item-none">
                            <el-input v-model="queryParams.intClass" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="applicationName" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请人地址" prop="applicationAddress" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationAddress" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="驳回时间" prop="rejectdateRange" class="el-form-item-none">
                            <el-date-picker v-model="rejectdateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请时间" prop="applydateRange" class="el-form-item-none">
                            <el-date-picker v-model="applydateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="24" :xs="24" align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-form-item label="申请/共有人" prop="applicationNameAndGyr" class="el-form-item-none">
                    <el-input v-model="queryParams.applicationNameAndGyr" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item> -->

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
                <el-table-column label="商标名" prop='tmName' align='center'> </el-table-column>
                <el-table-column label="代理机构" prop='agency' align='center' show-overflow-tooltip> </el-table-column>
                <el-table-column label="申请人" prop='applicationName' align='center'> </el-table-column>
                <el-table-column label="申请人地址" prop='applicationAddress' show-overflow-tooltip> </el-table-column>
                <el-table-column label="商标大类" prop='intClass' align='center'> </el-table-column>

                <el-table-column label="驳回日期" width='200px' align='center' prop='rejectDate' />

                <el-table-column label="注册日期" width='200px' align='center' prop='trademarkApplicationDate' />

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
import { rejectList } from "@/api/resources";
export default {
    name: "recentApply",
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
                applicationType: ""
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
            this.queryParams.page = 1;
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

            let key = this.$route.name + obj.id
            this.$router.push('/resources/reject/detail')
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageNo = 1;
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageNo = val || 1;
            this.getList()
        },
        //判断是否已领过
        isReceive(id) {
            return this.$axios.get(`api-qfx/opportunity/ifCollectioned?id=${id}`)
        },
        //分配资源
        allotBussindess(bussId, userId) {
            //参数userId，领取时不传,分配需要 
            let str = userId ? `&userId=${userId}` : ''
            this.isReceive(bussId)
                .then(isMsg => {
                    if (isMsg.code == 200) {
                        return this.$axios.get(`api-qfx/opportunity/distributionAndCollection?id=${bussId}` + str)
                    }
                    else {
                        this.$message.warning(isMsg.message)
                    }
                })
                .then(res => {
                    if (res && res.code == 200) {
                        this.$message.success(str ? '分配成功！' : '领取成功！');
                        this.initTable()
                    }
                })
        },
        //发送邮件
        sendEmailFunc(id) {

            this.$confirm(`是否发送邮件?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((btn) => {

                this.$axios.get(`api-qfx/trademark/sendRecentApplicationEmail?id=${id}`)
                    .then(res => {
                        console.log(111, res)
                        if (res.code == 200) {
                            this.$message.success('发送成功！');
                        }
                        else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(res => {
                        this.$message.error('发送失败');
                    })

            })
                .catch(() => { })
        },
        /** 查询用户列表 */
        getUserList() {
            // console.log(111,this.blongDepartment)
            this.$axios.get(`api-qfx/org/user/pageList?loading?pageNum=1&pageSize=10&orgCode=${this.blongDepartment.orgCode}`)
                .then(res => {
                    this.userList = res.data;
                })
        },
        returnSendResult(obj) {
            if (obj.sendEmailResult === '1') {
                return '成功'
            }
            else if (obj.sendEmailResult === '0') {
                return '失败：' + obj.sendEmailFaileureReason
            }
            return ''
        },
        //表格用户选中
        initTable() {
            this.pageNo = 1;
            this.getList()
        }
    },
    beforeDestroy() {
    }
}


</script>