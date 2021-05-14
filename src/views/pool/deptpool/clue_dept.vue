<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="80px">
                <el-row :gutter="10">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="客户名称" prop="customerName" class="el-form-item-none">
                            <el-input v-model="queryParams.customerName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="contactPhone" class="el-form-item-none">
                            <el-input v-model="queryParams.contactPhone" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
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

                    <el-col :lg=" showSwitch ? 24 : 7 " :sm="24" :xs="24" align='right' class="mb20">

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
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id">
                <el-table-column type='index'></el-table-column>
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="联系人" prop="contactName" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="联系方式" prop='contactPhone' width='130'> </el-table-column>
                <el-table-column label="线索状态" prop="followStatusName" width='110'></el-table-column>
                <!-- <el-table-column label="资源来源"  prop="resourceId" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="资源类型" prop="resName" width='120'></el-table-column>
                <!-- <el-table-column label="申请人名称"  prop="applicantName" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="说明" prop="busexplain" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新备注" prop="remarkContent">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <span class="f12">{{scope.row.remarkDate}}_{{scope.row.remarkContent}}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="left" width="80" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>

                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                            <!-- <template v-if="isReve( scope.row.followStatus )">
                                <el-button size="mini" class="col-other" type="text" v-hasPermi="['receive']" @click="handleDistribution(scope.row)">领取</el-button>
                            </template> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            <!-- 分配 -->

        </div>
    </div>
</template>

<script>
import { depPoolList, depPoolReceive } from "@/api/center";

import SwitchForm from "@/components/SwitchForm";

export default {
    components: { SwitchForm },
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
                pageSize: 10
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
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            userList: [],
            //可领取状态集合
            clueStatueArr: [],
        }
    },
    created() {
        this.$store.dispatch('getBussStatus', 2).then(res => {
            this.clueStatueArr = res
        })
    },
    mounted() {
        this.getList()

        this.$store.dispatch('getCenterType', 1).then(res => {
            this.vocIdArr = res
        })
        this.$store.dispatch('getCenterType', 2).then(res => {
            this.resourceTypeArr = res
        })
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

            depPoolList(this.queryParams).then(response => {

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
            this.resourceType = []
            this.vocId = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/clueManage/clue/detail?id=' + obj.id + '&btn=none')
        },
        //领取
        handleDistribution(obj) {

            this.$confirm('是否领取 ' + obj.customerName + ' 此条资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return depPoolReceive({ id: obj.id });

            }).then(() => {

                this.getList();
                this.msgSuccess("领取成功");

            }).catch(msg => {
                console.log(11111, msg)
            })
        },
        //分配
        handleDistribution(obj) {

            this.$confirm('是否领取 ' + obj.customerName + ' 此条资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return depPoolReceive({ id: obj.id });

            }).then(() => {

                this.getList();
                this.msgSuccess("领取成功");

            }).catch(msg => {
                console.log(11111, msg)
            })
        },
        //是否可领取
        isReve(status) {

            return this.clueStatueArr.filter(i => i.id == status).length != 0
        }
    },
    beforeDestroy() {
    }
}


</script>