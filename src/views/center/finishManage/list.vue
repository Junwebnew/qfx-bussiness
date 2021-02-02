<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="客户名称" prop="customerName" class="el-form-item-none">
                            <el-input v-model="queryParams.customerName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="contactPhone" class="el-form-item-none">
                            <el-input v-model="queryParams.contactPhone" placeholder="精准:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="线索状态" prop="followStatusList" class="el-form-item-none">
                            <el-select v-model="queryParams.followStatusList" multiple clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="资源类型" prop="resourceType" class="el-form-item-none">
                            <el-cascader :props="seProps" :options="resourceTypeArr" style="width:100%;" :size='"small"' v-model='resourceType' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="业务类型" prop="vocId" class="el-form-item-none">
                            <el-cascader :props="seProps" :options="vocIdArr" style="width:100%;" :size='"small"' v-model='vocId' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="成单时间" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch && whetherAdmin">
                        <el-form-item label="所属商务" prop="orderformUserId" class="el-form-item-none">
                            <el-select v-model="queryParams.orderformUserId" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in depUserList" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg=" 6 " :sm="24" :xs="24" align='right' class="mb20">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <SwitchForm :showSwitch.sync="showSwitch" />
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
                    <!-- <el-button type="warning" size="mini" @click="handleDiscard()" v-hasPermi="['discard']" :disabled="!ids.length">批量作废</el-button> -->
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type='index'></el-table-column>
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop='contactPhone' width='130'> </el-table-column>
                <el-table-column label="资源类型" prop="resName" width='120'></el-table-column>
                <el-table-column label="业务类型" prop="vocName" width='120'></el-table-column>
                <el-table-column label="所属商务" prop="orderformUserName" width='100' show-overflow-tooltip></el-table-column>
                <el-table-column label="所属部门" prop="deptName" width='100' show-overflow-tooltip></el-table-column>
                <el-table-column label="成单金额" width="120" prop="orderformPrice" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            <span>￥{{scope.row.orderformPrice}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="成单合同" width="120" prop="orderformPrice" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            <el-button v-if='scope.row.orderformContract' icon="el-icon-download" class="col-other" size="mini" type="text" @click="downLoadFile(scope.row)">下载</el-button>
                            <p v-else>--</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="成单时间" prop="orderformTime" width='150' show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" width='60'>
                    <template slot-scope="scope">
                        <div>
                            <el-tag v-if="scope.row.commonStatus" type="success" size='mini'>正常</el-tag>
                            <el-tag v-else type="danger" size='mini'>作废</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="160" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button class="col-other" size="mini" type="text" v-hasPermi="['edit']" @click="finishOrderEdit(scope.row)">编辑</el-button>
                            <el-button class="col-other" size="mini" type="text" @click="finishOrderAgain(scope.row)">再次成单</el-button>
                            <el-button v-if="scope.row.commonStatus" class="col-del" size="mini" type="text" v-hasPermi="['discard']" @click="handleDiscard(scope.row)">作废</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            <!-- 再次成单 -->
            <finishModule ref='finishModule' :resourceTypeArr='resourceTypeArr' :vocIdArr='vocIdArr' @finish='getList' />
        </div>
    </div>
</template>

<script>
import { bussFinishDiscard, bussFinishList } from "@/api/center";
import { qmxOnlineUrl } from '@/utils/baseConfig'
import SwitchForm from "@/components/SwitchForm";
import { deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'
import { finishModule } from './_module'

export default {
    components: { SwitchForm, finishModule },
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
            // 日期范围
            dateRange: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                customerName: undefined,
                contactPhone: undefined,
                orderformUserId: undefined,
            },
            seProps: { value: 'id', label: "name" },
            //业务类型
            vocIdArr: [],
            vocId: '',
            //资源类型
            resourceTypeArr: [],
            resourceType: '',
            //初始时间
            initDate: [],
            //所属部门人员
            depUserList: [],
            //下载地址
            qmxOnlineUrl: qmxOnlineUrl,
        }
    },
    computed: {
        ...mapGetters([
            'whetherAdmin'
        ])
    },
    created() {


    },
    mounted() {
        this.getList()

        //业务类型
        this.$store.dispatch('getCenterType', 1).then(res => {
            this.vocIdArr = res
        })
        //资源类型
        this.$store.dispatch('getCenterType', 2).then(res => {
            this.resourceTypeArr = res
        })
        if (this.whetherAdmin) {
            this.$store.dispatch('getDepUser').then(res => {
                this.depUserList = res
            })
        }
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;

            if (this.resourceType && this.resourceType.length) {
                this.queryParams.resourceType = this.resourceType[this.resourceType.length - 1]
            }

            if (this.vocId && this.vocId.length) {
                this.queryParams.vocId = this.vocId[this.vocId.length - 1]
            }
            /**
             * deptIdList 所属部门ID    applicantId 申请人ID
             * 
             * 两个都不传，获取当前登录人的数据
             * 传部门不传申请人 获取部门所有人数据
             * 
             * **/
            if (this.whetherAdmin) {

            }
            else {
                this.queryParams.deptIdList = ''
                this.queryParams.applicantId = ''
            }

            bussFinishList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

                this.tableData = response.pageList.data;
                this.total = response.pageList.total;
                this.totalMoney = response.totalMoney
                this.loading = false;
            })
        },
        formatterStatus(row) {

            let item = this.clueStatueArr.filter(i => i.code == row.followStatus)[0]

            return (item && item.name) || row.followStatus
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.resourceType = []
            this.vocId = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/bussManage/buss/detail?id=' + obj.id)
        },
        /** 再次成单按钮操作 */
        finishOrderAgain(row) {

            let newObj = deepClone(row)

            delete newObj.id

            delete newObj.orderformPrice

            this.$refs.finishModule.showFunc(newObj, '再次成单')
        },
        /**编辑成单**/
        finishOrderEdit(row) {

            this.$refs.finishModule.showFunc(deepClone(row), '编辑成单')
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //分配
        handleDistribution(obj) {
            let tit = '线索批量分配'
            if (obj) {
                this.ids = [obj.id]
                tit = obj.customerName + "线索分配"
            }
            this.$refs.distribution.show({}, tit)
        },
        //剔除
        handleDiscard(obj) {

            let tit = '确定作废 ' + obj.customerName + " ？"
            let that = this

            this.$confirm(tit, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return bussFinishDiscard(obj.id);

            }).then(() => {

                this.getList();
                this.msgSuccess("作废成功");

            })
                .catch(msg => {
                    console.log(11111, msg)
                })
        },
        //下载文件
        downLoadFile(row) {
            location.href = qmxOnlineUrl + 'api-f/files/downloadFile?fileSource=ALIYUN&id=' + row.orderformContract
        }
    },
    beforeDestroy() {
    }
}


</script>