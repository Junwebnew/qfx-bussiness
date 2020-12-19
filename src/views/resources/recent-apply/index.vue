<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
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
                        <el-form-item label="商标大类" prop="typeOfTrademarkCode" class="el-form-item-none">
                            <el-input v-model="queryParams.typeOfTrademarkCode" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请人地址" prop="applicationDddrCn" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationDddrCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请人类型" prop="applicationType" class="el-form-item-none">
                            <el-select v-model="queryParams.applicationType" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in aplicationTypeArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="申请时间段" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' align='right'>
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
import { recentApplyList } from "@/api/resources";
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
            // 日期范围
            dateRange: [],
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

        // recentApplyList(this.queryParams).then(res => {
        //     console.log(1123, res)
        // })

        // let time = [this.$getFulldate(new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000)).date, this.$getFulldate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).date]

        // this.initDate = time
        // this.queryParams.time = time

        this.getList()
        // this.getUserList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            recentApplyList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
            this.dateRange = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id
            this.$router.push('/resources/renewal/detail')
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