<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="求购信息" prop="buyInfo" class="el-form-item-none">
                            <el-input v-model="queryParams.buyInfo" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="求购类别" prop="intclassList" class="el-form-item-none">
                            <el-select v-model="queryParams.intclassList" clearable multiple size="small" style="width: 100%">
                                <el-option v-for="dict in intclassArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id">
                <el-table-column label="求购信息" prop="buyInfo" show-overflow-tooltip>
                    <div slot-scope="scope">
                        <span v-if='scope.row.isEmergency' class='flag'>急</span> <span>{{scope.row.buyInfo}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="求购类别" width='150' prop="intclass" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" width='250' prop="contact" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" width='150' prop='createTime' show-overflow-tooltip> </el-table-column>
                <el-table-column label="操作" width='70' align='center'>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click=" showDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!-- 求购详情 -->
        <el-dialog title="求购详情" :visible.sync="detailShow" width="600px" append-to-body>
            <div class="detailBox">
                <div class="item">
                    <label>求购信息</label>
                    <p><span v-if='detailMsg.isEmergency' class='flag'>急</span> {{detailMsg.buyInfo ||'--'}}</p>
                </div>
                <div class="item">
                    <label>国际分类</label>
                    <p>{{detailMsg.intclass ||'--'}}</p>
                </div>
                <div class="item">
                    <label>联系人</label>
                    <p>{{detailMsg.contact ||'--'}}</p>
                </div>
                <div class="item">
                    <label>联系QQ</label>
                    <p>{{phoneStartCode(detailMsg.qq ||'--')}}</p>
                </div>
                <div class="item">
                    <label>资源抵扣</label>
                    <p class="col b">{{ priceStr}}</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click=" detailShow =  false">取 消</el-button>
                <el-button type="primary mr5" @click="receiveInfo">领 取</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { resourceBuyList, receiveResource } from "@/api/resources";
import { phoneStartCode } from "@/utils";
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
                buyInfo: '',
                intclassList: undefined
            },
            //扣除价格
            priceStr: '',
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            detailShow: false,
            detailMsg: {}
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
        this.getList()
        this.getPrice()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;

            // if (this.queryParams.intclassmu && this.queryParams.intclassmu.length) {
            //     this.queryParams.intclass = this.queryParams.intclassmu.join(',')
            // }

            resourceBuyList(this.queryParams).then(response => {
                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;

            })
        },
        //获取扣费次数
        getPrice() {

            this.$store.dispatch('getYearResourse').then(res => {

                let arr2 = res.filter(i => i.id == '1344241701547585538')

                //获取到相对应的资源，并且是false,则是特殊资源
                if (arr2.length && !arr2[0].supportYearPay) {

                    this.getSetResoursePrice()
                }
                else {
                    //判断用户有没有次数
                    this.$store.dispatch('getOrgMsg', this.companyId).then(res => {

                        //有次数
                        if (res.num < 0) {

                            this.priceStr = '1/次'

                            return
                        }
                        //无次数
                        this.getSetResoursePrice()
                    })

                }

            })
        },
        getSetResoursePrice() {
            this.$store.dispatch('getResoursePrice', '11').then(res => {
                // console.log('0000', res)
                this.priceStr = res.value / 10 + '星/次'
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
        showDetail(obj) {
            this.detailShow = true
            this.detailMsg = obj
        },
        //联系方式加密
        phoneStartCode(qq) {
            if (qq) {
                return qq.replace(/\d{4}/, '****')
            }
            return '****'
        },
        //领取
        receiveInfo(row) {

            let that = this
            this.$confirm('确定是否领取此资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {

                that.loading = true

                let obj = {
                    businessBelong: 1,
                    phoneId: '999', //无电话ID，不为空就行
                    phoneNumber: '999', //无电话，不为空就行
                    resourceId: this.detailMsg.id,
                    resourcesModule: '1344241701547585538',
                    type: 2
                }
                receiveResource('resource/buy/resourceBuy', obj)
                    .then(res => {

                        this.msgSuccess('领取成功')

                        this.detailShow = false

                        that.loading = false

                        this.getList()
                    })
                    .catch(res => {
                        that.loading = false
                    })

            }).catch(error => {
                console.log('4534', error)
            })

        }
    },
    beforeDestroy() {
    }
}

</script>
<style lang="scss" scoped>
.buyInfo {
    cursor: pointer;
}
.detailBox {
    width: 100%;
    .item {
        overflow: hidden;
        margin-bottom: 20px;
        label {
            float: left;
            width: 80px;
            color: #898989;
        }
        p {
            color: #333333;
            overflow: hidden;
        }
    }
}
.flag {
    padding: 1px 2px;
    background-color: #ff0000;
    color: #fff;
    font-size: 12px;
    border-radius: 2px;
}
</style>