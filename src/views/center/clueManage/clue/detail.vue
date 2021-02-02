<template>
    <div class="app-container">
        <div class="head-parts mb10">
            <div class="words">{{title}}</div>
        </div>
        <div class="mb10 custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col>
                    <div class="back-fff pad20 ">
                        <el-row :gutter="20" class="mb16">
                            <el-col :span="24" class="mb16 tit">
                                <el-row :gutter="20">
                                    <el-col :lg="3" :sm="3" :xs="12">
                                        <span>基本信息</span>
                                    </el-col>
                                    <el-col :lg="21" :sm="21" :xs="12" v-if='showBtns'>
                                        <el-button type="text" size='mini' @click="handleAddTips()">新增提醒</el-button>
                                        <el-button v-if='isShowHandle' type="text" size='mini' @click="vocTpyeChange()">转为商机</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label">客户名称：</span>
                                <div class="custom-r">
                                    {{json.customerName || '--'}}
                                </div>
                            </el-col>

                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系人：</span>
                                <div class="custom-r">
                                    {{json.contactName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系电话：</span>
                                <div class="custom-r">
                                    {{json.contactPhone || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :sm="12" :xs="24" class="mb16">
                                <span class="custom-label">申请人名称：</span>
                                <div class="custom-r">
                                    {{json.applicantName || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系微信：</span>
                                <div class="custom-r">
                                    {{json.contactWx || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">联系QQ：</span>
                                <div class="custom-r">
                                    {{json.contactQq || '--'}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">线索状态：</span>
                                <div class="custom-r col">
                                    {{json.followStatusName}}
                                </div>
                            </el-col>
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">所属商务：</span>
                                <div class="custom-r">
                                    {{json.counselorName || '--'}}
                                </div>
                            </el-col>

                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">所属部门：</span>
                                <div class="custom-r">
                                    {{json.deptName || '--'}}
                                </div>
                            </el-col>

                            <!-- <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">资源来源：</span>
                                <div class="custom-r">
                                    {{json.resourceId || '--'}}
                                </div>
                            </el-col> -->
                            <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">资源类型：</span>
                                <div class="custom-r">
                                    {{json.resName || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">

                            <!-- <el-col :sm="6" :xs="24" class="mb16">
                                <span class="custom-label">业务类型：</span>
                                <div class="custom-r">
                                    {{json.vocName || '--'}}
                                </div>
                            </el-col> -->
                            <el-col :sm="24" :xs="24" class="mb16">
                                <span class="custom-label">线索说明：</span>
                                <div class="custom-r">
                                    {{json.busexplain || '--'}}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="mt10 back-fff pad20 custom-box">
                        <el-row :gutter="20">
                            <el-col :span="24" class="mb16 tit">
                                <el-row :gutter="20">
                                    <el-col :lg="3" :sm="3" :xs="12">
                                        <span>备注信息</span>
                                    </el-col>
                                    <el-col :lg="21" :sm="21" :xs="12" v-if='showBtns'>
                                        <el-button type="text" v-if='isShowHandle' size='mini' @click="handleChange()">状态变更</el-button>
                                        <el-button type="text" size='mini' @click="handleAddMarks()">新增备注</el-button>
                                        <el-button type="text" size='mini' @click="getmarks()">刷新</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col>
                                <ul class="marksBox" id='maskloading'>
                                    <li v-for="(item,idx) in marksList" :key='idx'>
                                        <h3 class="head">
                                            <img :src="$getImg(item.headImg)" :onerror='$headImg.error' alt="头像">
                                        </h3>
                                        <div class="r-box">
                                            <p class="top">
                                                <small>{{item.remarkDate}}</small>
                                            </p>
                                            <div class="desc">
                                                <small class="b">{{item.userName}}</small>
                                                <small class="col">{{returnType(item.operationValue)}}</small>
                                                <small>{{item.remarkContent}}</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <!-- 分页 -->
                                <pagination v-show="total>0" :total="total" :page.sync="marksQuery.pageNum" :limit.sync="marksQuery.pageSize" layout='total, prev, pager, next' @pagination="getmarks" :autoScroll='false' />
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 修改状态 -->
        <changeStatus ref='changeStatus' :clueStatueArr='clueStatueArr' @finish='initPage' />
        <!-- 新增备注 -->
        <addMarks ref='addMarks' :clueStatueArr='clueStatueArr' @finish='getmarks' />
        <!-- 新增提醒 -->
        <addTimeTips ref='addTimeTips' @finish='getmarks' />
        <!-- 转为商机 -->
        <selectVocTpye ref='selectVocTpye' :vocIdArr='vocIdArr' @finish='initPage' />
    </div>
</template>

<script>
import { clueDetail, getClueStatusList, clueMarksList } from "@/api/center";

import { addMarks, addTimeTips, changeStatus, selectVocTpye } from '../_module'
import { deepClone } from '@/utils/index'

export default {
    components: {
        addMarks, addTimeTips, changeStatus, selectVocTpye
    },
    data() {
        return {
            title: '线索详情页',
            json: {},
            markLoading: false,
            tableData: [],
            //未变为商机的线索状态
            myClueStatueArr: [],
            //线索状态
            clueStatueArr: [],
            //资源类型
            resourceTypeArr: [],
            //业务类型
            vocIdArr: [],
            //备注查询
            marksQuery: {
                businessId: '',
                pageNum: 1,
                pageSize: 10,
                type: 1
            },
            //备注的类型
            marksTypeArr: [],
            //备注列表
            marksList: [],
            //备注总数
            total: 0,
            showBtns: true
        }
    },
    computed: {
        //是否显示页面的一些操作
        isShowHandle() {
            return this.myClueStatueArr.filter(i => i.id == this.json.followStatus).length > 0
        }
    },
    created() {

        this.marksQuery.businessId = this.$route.query.id

        this.initPage()

        this.showBtns = this.$route.query.btn ? false : true

        this.$store.dispatch('getBussStatus', 1).then(res => {
            this.clueStatueArr = res
        })

        this.$store.dispatch('getBussStatus', 2).then(res => {
            this.myClueStatueArr = res
        })

        this.$store.dispatch('getCenterType', 1).then(res => {
            this.vocIdArr = res
        })

        this.qmxDataKey().then(res => {
            // console.log('0000', res)
            this.marksTypeArr = res['followRecordOperValueEnumList']
        })

    },
    methods: {
        initPage() {

            this.marksQuery.pageNum = 1

            this.initDetail()
            this.getmarks()
        },
        initDetail() {
            clueDetail(this.marksQuery.businessId)
                .then(res => {
                    this.title = (res.data.customerName || '') + ' 线索详情页'
                    this.json = res.data


                })
        },
        getmarks() {



            var loading = this.$eleLoading('#maskloading')

            clueMarksList(this.marksQuery).then(res => {
                this.marksList = res.data
                this.total = res.total

                setTimeout(() => {
                    loading.close()
                }, 500)

            })

        },
        initServerArr(str) {
            str = (str + '').replace(/null/g, "")
            if (/;,/.test(str)) {
                return str ? str.split(";,") : ["--"];
            }
            return str ? str.split(",") : ["--"];
        },
        //操作类型
        returnType(id) {
            if (this.marksTypeArr && this.marksTypeArr.length) {
                return (this.marksTypeArr.filter(i => i.value == id))[0].key
            }

        },
        getResourse(row) {

        },
        formatterStatus(code) {

            if (typeof code == 'object') {
                code = code.businessStatusId
            }

            let item = this.clueStatueArr.filter(i => i.id == code)[0]

            return (item && item.name) || code
        },
        //状态变更
        handleChange() {
            this.$refs.changeStatus.show(deepClone(this.json))
        },
        //业务类型变更.，转为商机
        vocTpyeChange() {
            this.$refs.selectVocTpye.show(deepClone(this.json))
        },
        //增加备注
        handleAddMarks() {
            this.$refs.addMarks.show(deepClone(this.json))
        },
        //新增时间提醒
        handleAddTips() {
            this.$refs.addTimeTips.show(deepClone(this.json))
        }
    }
}
</script>
<style lang="scss" scoped>
.marksBox {
    overflow: hidden;
    li {
        padding: 10px 0;
        overflow: hidden;
        .head {
            float: left;
            width: 44px;
            height: 44px;
            margin-right: 20px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .r-box {
            font-size: 12px;
            color: #515a6e;
            .top {
                margin-bottom: 10px;
                small {
                    display: inline-block;
                    min-width: 50px;
                }
            }
            .desc {
                color: #888;
                small + small {
                    margin-left: 10px;
                }
            }
            .b {
                color: #000;
                font-weight: bolder;
            }
        }
    }
}
</style>