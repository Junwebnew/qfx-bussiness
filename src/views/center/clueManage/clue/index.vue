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
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="线索状态" prop="followStatusList" class="el-form-item-none">
                            <el-select v-model="queryParams.followStatusList" multiple clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
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
                    <el-col :lg=" showSwitch ? 12 : 6 " :sm="24" :xs="24" align='right' class="mb20">

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
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                    <el-button type="success" size="mini" @click="handleDistribution()" v-hasPermi="['distribution']" :disabled="!ids.length">批量移交</el-button>
                    <el-button type="warning" size="mini" @click="handleEliminate()" v-hasPermi="['distribution']" :disabled="!ids.length">批量剔除</el-button>
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type='selection'></el-table-column>
                <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="联系人" prop="contactName" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="联系方式" prop='contactPhone'>
                    <template slot-scope="scope">
                        <span>{{scope.row.contactPhone || scope.row.contactQq || scope.row.contactWx}}</span>
                        <take-phone :number='scope.row.contactPhone' />
                    </template>
                </el-table-column>
                <el-table-column label="线索状态" prop="followStatusName" width='110'></el-table-column>
                <!-- <el-table-column label="资源来源"  prop="resourceId" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="资源类型" prop="resName" width='120'></el-table-column>
                <!-- <el-table-column label="业务类型"  prop="vocName"></el-table-column> -->
                <!-- <el-table-column label="申请人名称"  prop="applicantName" show-overflow-tooltip></el-table-column> -->
                <el-table-column label="说明" prop="busexplain" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新备注" prop="remarkContent">
                    <template slot-scope="scope">
                        <div>
                            <span class="f12">{{scope.row.remarkDate}}_{{scope.row.remarkContent}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="230" class-name="small-padding fixed-width" fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>

                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                            <el-button size="mini" type="text" v-hasPermi="['distribution']" @click="vocTpyeChange(scope.row)">转为商机</el-button>
                            <el-dropdown class="ml10">
                                <el-button type="text" size='mini'>
                                    相关操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <el-button class="col-other" size="mini" type="text" v-hasPermi="['distribution']" @click="handleDistribution(scope.row)">移交</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button class="col-update" size="mini" type="text" v-hasPermi="['edit']" @click="handleUpdate(scope.row)">修改</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button class="col-del" size="mini" type="text" v-hasPermi="['del']" @click="handleEliminate(scope.row)">剔除</el-button>
                                    </el-dropdown-item>

                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 新增和修改    -->
            <clubModule ref='clubModule' :clueStatueArr='clueStatueArr' :resourceTypeArr='resourceTypeArr' :vocIdArr='vocIdArr' @backGetList='handleQuery' />
            <!-- 分配 -->
            <distribution ref='distribution' :ids='ids' @finish='seleceUserFinish' showStr='移交' />
            <!-- 转为商机 -->
            <selectVocTpye ref='selectVocTpye' :vocIdArr='vocIdArr' @finish='getList' />
        </div>
    </div>
</template>

<script>
import { getClueStatusList, clueMyList, clueEliminate, clueTransfer } from "@/api/center";
import { clubModule, distribution, selectVocTpye } from '../_module'
import SwitchForm from "@/components/SwitchForm";
import { deepClone } from '@/utils/index'
export default {
    components: { clubModule, SwitchForm, distribution, selectVocTpye },
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
            //线索状态
            clueStatueArr: [],
            //业务类型
            vocIdArr: [],
            vocId: '',
            //资源类型
            resourceTypeArr: [],
            resourceType: '',
            //初始时间
            initDate: []
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

            clueMyList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

                this.tableData = response.data;
                this.total = response.total;
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

            this.$router.push('/center/clueManage/clue/detail?id=' + obj.id)
        },
        //新增线索
        handleAdd() {
            this.$refs.clubModule.showFunc({}, '新增线索')
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$refs.clubModule.showFunc(deepClone(row), '修改线索')
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //移交
        handleDistribution(obj) {
            let tit = '线索批量移交'
            if (obj) {
                this.ids = [obj.id]
                tit = obj.customerName + "线索移交"
            }
            this.$refs.distribution.show({}, tit)
        },
        //剔除
        handleEliminate(obj) {

            let tit = '是否批量剔除线索？'
            let that = this

            if (obj) {
                this.ids = [obj.id]
                tit = '是否剔除 ' + obj.customerName + " ？"
            }

            this.$confirm(tit, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return clueEliminate({ clueIds: that.ids });

            }).then(() => {

                this.getList();
                this.msgSuccess("剔除成功");

            })
                .catch(msg => {
                    console.log(11111, msg)
                })
        },
        //选完用户之后
        seleceUserFinish(userId) {
            clueTransfer({ clueIds: this.ids, disTraUserId: userId }).then(res => {

                this.msgSuccess('移交成功')
                this.handleQuery()

            })
        },
        //业务类型变更.，转为商机
        vocTpyeChange(row) {
            this.$refs.selectVocTpye.show(row, '转为商机')
        }
    },
    beforeDestroy() {
    }
}


</script>