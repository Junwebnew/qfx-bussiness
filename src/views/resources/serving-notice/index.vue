<template>
    <div class="app-container">
        <div class="back-fff form-box mb10">

            <div class="notice-box scroll-box">
                <div class="clear num-conut">
                    <div class="num_i" v-for='(item,idx) in noticeNUm' :key='idx' @click="selectNum(item.annNum)">
                        <div class="box" :class="{active: activeNum == item.annNum }">
                            <h3 class="col">{{item.annNum}}期</h3>
                            <p>{{parseTime(item.startTime,'{y}-{m}-{d}')}}</p>
                            <p>异议剩余<span class="text-danger">{{lastTime(item.endTime)}}</span>天</p>
                        </div>
                    </div>
                </div>
            </div>
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名称" prop="tmName" class="el-form-item-none">
                            <el-input v-model="queryParams.tmName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="国际分类" prop="intclass" class="el-form-item-none">
                            <el-select v-model="queryParams.intclass" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in intclassArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="申请人" prop="applicationNameCn" class="el-form-item-none">
                            <el-input v-model="queryParams.applicationNameCn" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请人地址" prop="userAddress" class="el-form-item-none">
                            <el-input v-model="queryParams.userAddress" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="代理机构" prop="agency" class="el-form-item-none">
                            <el-input v-model="queryParams.agency" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
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
            <!-- <el-row :gutter="10" class="mb8">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row> -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="20" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                    <span class="page_recourse_desc">{{$route.meta.desc}}</span>
                </el-col>
                <el-col :span="4" align='right'>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" empty-text='数据处理中，请稍候'>
                <!-- <el-table-column prop="name" label="商标图样">
                    <template slot-scope="scope">
                        <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col">
                            <img class="table-img" :src="$getImg(scope.row.noticeFile,2) || ''">
                        </a>
                    </template>
                </el-table-column> -->
                <el-table-column label="商标名称" width='100px' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.tmName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册号" prop="regNum" width='90px'>
                </el-table-column>
                <el-table-column label="国际分类" width='90px'>
                    <template slot-scope="scope">
                        <span>{{scope.row.intClass}}类</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.applicationNameCn}}</span>
                    </template>
                </el-table-column>
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
import { noticeArriveList } from "@/api/resources";
import { noticeNumList } from "@/api";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
export default {
    components: {
        draw, detail
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
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasPhone: true,
                tmName: undefined,
                intclass: undefined,
                applicationNameCn: undefined,
                userAddress: undefined,
                agency: undefined,
                phoneTypeArr: undefined
            },
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            noticeNUm: [], //************* */
            activeNum: 0, //第多少期
        }
    },
    computed: {
        intclassArr() {
            let arr = [], idx = 1;
            while (idx <= 45) {
                arr.push({
                    name: idx + '类',
                    value: idx
                })
                idx++
            }
            return arr
        }
    },
    created() {

    },
    mounted() {

        this.initNoticeNum()
    },
    methods: {

        initNoticeNum() {

            this.loading = true;

            noticeNumList(8).then(res => {
                this.noticeNUm = res.data.data
                this.activeNum = res.data.data[0].annNum
                this.getList()
            })
                .catch(() => {
                    this.loading = false;
                })
        },
        getList() {   //获取table表单的数据**************************************

            this.loading = true;

            this.queryParams.noticeNumber = this.activeNum

            noticeArriveList(this.queryParams).then(response => {
                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        /*获取选中的期号**/
        selectNum(num) {
            this.activeNum = num
            this.getList()
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
        // checkDetail(obj) {

        //     let key = this.$route.name + obj.preliNoticeTrademarkId
        //     this.$router.push('/resources/serving-notice/detail?id=' + obj.id + "&num=" + this.activeNum)

        // },
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.tmName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id, this.activeNum)
            })
        },
        lastTime(e) {
            if (!e) return 0
            let now = (new Date()).getTime();

            if (e > now) {
                return Math.ceil((e - now) / (24 * 60 * 60 * 1000))
            } else {
                return 0
            }
        }
    },
    beforeDestroy() {
    }
}
</script>
<style lang="scss" scoped>
.notice-box {
    overflow: auto;
    font-size: 0;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    margin-bottom: 16px;
    text-align: center;
    .num-conut {
        margin: 0 auto;
        // min-width: 1200px;
        white-space: nowrap;
    }
    .num_i {
        display: inline-block;
        text-align: center;
        width: 8.33%;
        min-width: 100px;
        padding: 4px;
        box-sizing: border-box;
        .box {
            font-size: 12px;
            border: 1px solid #eeeeee;
            border-radius: 2px;
            width: 100%;
            padding: 6px 0;
            cursor: pointer;
            transition: all 0.2s;
            line-height: 1.5;
            &:hover {
                background: #ebf6ff;
                border-color: #08f;
            }

            &.active {
                color: #ffffff;
                background: #08f;

                h3,
                span {
                    color: #ffffff !important;
                }
            }
        }
        h3 {
            margin: 0;
            font-weight: 600;
        }
    }
}
</style>