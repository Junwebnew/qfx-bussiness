<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="5">
                    <!-- <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="企业名称" prop="applicantName" class="el-form-item-none">
                            <el-input v-model="queryParams.applicantName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="企业地址" prop="address" class="el-form-item-none">
                            <el-input v-model="queryParams.address" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="注册日期" prop="time" class="el-form-item-none">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="号码类型" prop="phoneType" class="el-form-item-none">
                            <el-select v-model="queryParams.phoneType" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in phoneTypeArr" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" align='right' class="el-form-item-none">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    </el-col> -->

                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名称">
                            <el-input v-model="queryParams.trademarkName" @keyup.enter.native="submitFunc" placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="类别">
                            <el-input v-model="queryParams.intclass" @keyup.enter.native="submitFunc" placeholder="请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="注册号">
                            <el-input v-model="queryParams.regNum" @keyup.enter.native="submitFunc" placeholder="请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="类似群组">
                            <el-input v-model="queryParams.similargroup" @keyup.enter.native="submitFunc" placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商品服务项">
                            <el-input v-model="queryParams.goods" @keyup.enter.native="submitFunc" placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="是否取证">
                            <el-input v-model="queryParams.hasCertificate" @keyup.enter.native="submitFunc" placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="同行价(元)">
                            <Count v-model="queryParams.price"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="客户价(元)">
                            <Count v-model="queryParams.customerPrice"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标字数">
                            <Count v-model="queryParams.trademarkNameWordnum"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="标源来源">
                            <el-select v-model="queryParams.sourceType" size='small' style="width:100%;">
                                <el-option v-for="item in tmresourceArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标结构">
                            <el-select v-model="queryParams.trademarkStructure" size='small' style="width:100%;">
                                <el-option v-for="item in structureArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="注册公告时间">
                            <el-select v-model="queryParams.regDateTime" size='small' style="width:100%;">
                                <el-option v-for="item in yearArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标共有类">
                            <el-select v-model="queryParams.commonCategories" multiple placeholder="请选择" size='small' style="width:100%;">
                                <el-option v-for="item in classifyArr" :key="item" :label="item +'类'" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标区域">
                            <el-select v-model="queryParams.areaName" placeholder="请选择" size='small' style="width:100%;">
                                <el-option v-for="item in tmCountry" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标状态">
                            <el-select v-model="queryParams.saleStatus" placeholder="请选择" size='small' style="width:100%;">
                                <el-option v-for="item in tmStatusArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请人类型">
                            <el-select v-model="queryParams.applicationType" placeholder="请选择" size='small' style="width:100%;">
                                <el-option v-for="item in applicantArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="图形要素">
                            <el-button :type=" eleSelected.length == 0 ? 'info' : 'success'" @click="elementShow = true" size='mini'>
                                {{ eleSelected.length == 0 ? '点击选择' : '修改选择' }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" class="el-form-item-none mt2">
                        <div class="text-right">
                            <el-button size='small' icon='el-icon-refresh' @click="resetQuery('reset')">重置</el-button>
                            <el-button type="primary" size='small' icon="el-icon-search" class="ml10" @click="handleQuery">搜索</el-button>
                            <SwitchForm :showSwitch.sync="showSwitch" />
                        </div>
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
                    <el-button type="info" icon="el-icon-upload2" size="small" @click="handleImport">导入</el-button>
                    <el-button type="info" icon="el-icon-download" class="mr10" size="small" @click="handleDownload">导出</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData">
                <el-table-column label="企业名称" prop="applicantName" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.applicantName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="企业地址" prop="address" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属行业" prop="industry" show-overflow-tooltip></el-table-column>
                <el-table-column label="经营状态" prop="businessState" show-overflow-tooltip></el-table-column>
                <el-table-column label="注册时间" prop="regDate" width='100'></el-table-column>
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
import { companyWhiteList } from "@/api/resources";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
import Count from '@/components/Count'
export default {
    name: "recentApply",
    components: {
        draw, detail, Count
    },
    mixins: [resourseMixin],
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
                applicantName: undefined,
                address: undefined,
                phoneTypeArr: undefined,
            },
            // 标源来源
            tmresourceArr: [
                { name: '全部', value: "" },
                { name: 'A类', value: "2" },
                { name: 'B类', value: "0" },
                { name: 'C类', value: "1" }
            ],
            tmresourceSelect: [
                { name: 'A类', value: "2" },
                { name: 'B类', value: "0" },
                { name: 'C类', value: "1" }
            ],
            tmStatusArr: [
                { name: '全部', value: "" },
                { name: '在售', value: "0" },
                { name: '已售', value: "1" },
                { name: '无效', value: "2" }
            ],
            applicantArr: [
                { name: '全部', value: "" },
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            structureArr: [
                { name: '全部', value: "" },
                { name: '纯中文', value: "1" },
                { name: '纯英文(拼音)', value: "2" },
                { name: '纯数字', value: "3" },
                { name: '中文+英文（拼音）', value: "4" },
                { name: '图形', value: "5" },
                { name: '中文+数字', value: "6" },
                { name: '图形+中文', value: "8" },
                { name: '图形+英文', value: "9" }
            ],
            yearArr: [
                { name: '全部', value: "" },
                { name: '一年内', value: "1" },
                { name: '1-2年内', value: "2" },
                { name: '2-3年内', value: "3" },
                { name: '3年以上', value: "4" }
            ],
            classifyArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
            tmCountry: ['全部', '中国', '美国', '日本', '欧盟', '德国', '英国', '法国', '香港', '澳大利亚'],
            eleSelected: [],
        }
    },
    created() {

    },
    mounted() {

        this.getList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************


            return

            this.loading = true;
            companyWhiteList(this.addDateRange(this.queryParams, this.dateRange, { start: 'startRegDate', end: 'endRegDate' })).then(response => {
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
        // checkDetail(obj) {
        //     this.$router.push('/resources/white-list/detail?id=' + obj.id)
        // },
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.applicantName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        },
        //导入
        handleImport() {

        },
        //导出
        handleDownload() {

        }
    },
    beforeDestroy() {
    }
}


</script>