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
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商机状态" prop="followStatusList" class="el-form-item-none">
                            <el-select v-model="queryParams.followStatusList" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
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
                        <el-form-item label="创建时间" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch && whetherAdmin">
                        <el-form-item label="所属商务" prop="time" class="el-form-item-none">
                            <el-select v-model="queryParams.counselorId" clearable size="small" style="width: 100%">
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
                    <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button> -->
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData">
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop='contactPhone' width="130"> </el-table-column>
                <el-table-column label="商机状态" prop="followStatusName" width="110"></el-table-column>
                <el-table-column label="提醒时间" prop="remindDate" show-overflow-tooltip></el-table-column>
                <el-table-column label="说明" prop="busexplain" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新备注" prop="remarkContent">
                    <template slot-scope="scope">
                        <div>
                            <span class="f12">{{scope.row.remarkDate}}_{{scope.row.remarkContent}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="120" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button class="col-update" size="mini" type="text" v-hasPermi="['update']" @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 新增和修改    -->
            <bussModule ref='bussModule' :clueStatueArr='clueStatueArr' :resourceTypeArr='resourceTypeArr' :vocIdArr='vocIdArr' @backGetList='handleQuery' />
        </div>
    </div>
</template>

<script>
import { bussTodayeList } from "@/api/center";
import SwitchForm from "@/components/SwitchForm";
import { bussModule } from '../_module'
import { deepClone } from '@/utils/index'
export default {
    components: { SwitchForm, bussModule },
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
                followStatusList: ''
            },
            seProps: { value: 'id', label: "name" },
            //商机状态
            clueStatueArr: [],
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
            whetherAdmin: false
        }
    },
    created() {

    },
    mounted() {
        this.getList()

        this.$store.dispatch('getBussStatus', 2).then(res => {
            this.clueStatueArr = res
        })
        this.$store.dispatch('getCenterType', 1).then(res => {
            this.vocIdArr = res
            console.log(1111, res)
        })
        this.$store.dispatch('getCenterType', 2).then(res => {
            this.resourceTypeArr = res
        })
        if (this.$store.state.user.userInfo.whetherAdmin) {
            this.whetherAdmin = true

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

            bussTodayeList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

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
            this.dateRange = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/bussManage/buss/detail?id=' + obj.id)
        },
        //新增商机
        handleAdd() {
            this.$refs.clubModule.showFunc({}, '新增商机')
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$refs.bussModule.showFunc(deepClone(row), '修改商机')
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id
            this.$confirm('是否删除客户"' + row.customerName + '"的商机?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return clueDel([ids]);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },

    },
    beforeDestroy() {
    }
}


</script>