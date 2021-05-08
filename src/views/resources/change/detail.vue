<template>
    <div class="app-container">
        <div class="custom-box">
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="17" :xs="24">
                    <div class="full-height-auto">

                        <div class="back-fff pad20 custom-box posRelative">
                            <resoursePrice :resourcesModule='5' :applicationType='json.applicationType' />
                            <el-row :gutter="20">
                                <el-col :span="24" class="mb16">
                                    <p class=" tit">申请人信息</p>
                                </el-col>
                                <el-col :lg="12" :sm="12" :xs="24">
                                    <span class="custom-label">申请人名称：</span>
                                    <div class="custom-r">
                                        {{json.companyName || '--'}}
                                    </div>
                                </el-col>

                                <el-col :lg="12" :sm="24" :xs="24">
                                    <span class="custom-label">社会信用代码：</span>
                                    <div class="custom-r">
                                        {{json.creditCode || '--'}}
                                    </div>
                                </el-col>
                                <el-col :lg="24" :sm="12" :xs="24">
                                    <span class="custom-label">申请人地址：</span>
                                    <div class="custom-r">
                                        {{json.companyAddress || '--'}}
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="mt10 back-fff pad20 custom-box">
                            <el-row :gutter="20">
                                <el-col :span="24" class="mb16">
                                    <p class=" tit">变更信息</p>
                                </el-col>
                                <el-col>

                                    <table class="c-table" align="center">
                                        <thead>
                                            <tr>
                                                <td class='n' style=" width:40px">序号</td>
                                                <td class='n' style=" width:80px">变更日期</td>
                                                <td class='n' style=" width:80px">变更项目</td>
                                                <td class='n'>变更前</td>
                                                <td class='n'>变更后</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,idx) in changeVoList" :key='idx'>
                                                <td>{{idx+1}}</td>
                                                <td>{{splitTimes(item.createTime)}}</td>
                                                <td>{{matchTypeName(item.changeType)}}</td>
                                                <td>{{item.changeBefore}}</td>
                                                <td>{{item.changeAfter}}</td>
                                            </tr>
                                            <tr v-if='!changeVoList || changeVoList.length == 0'>
                                                <td colspan="5" class="text-center">暂无数据</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </el-col>
                            </el-row>
                        </div>

                        <div class="mt10 back-fff pad20 custom-box">
                            <el-row :gutter="20">
                                <el-col :span="24" class="mb16">
                                    <p class=" tit">申请人相关商标</p>
                                </el-col>
                                <el-col>
                                    <table class="c-table" align="center">
                                        <thead>
                                            <tr>
                                                <td class='n' style="width:20px">序号</td>
                                                <td class='n'>商标名</td>
                                                <td class='n'>注册号</td>
                                                <td class='n'>国际分类</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,idx) in tmList" :key='idx'>
                                                <td>{{idx+1}}</td>
                                                <td>
                                                    <a :href="'https://www.qmxip.com/tm_xq/'+item.id" target="_blank" class="col">
                                                        <span>{{item.trademarkName}}</span>
                                                    </a>
                                                </td>
                                                <td>{{item.trademarkNumber}}</td>
                                                <td>{{item.typeOfTrademarkCode}}类-{{item.typeOfTrademarkName}}</td>
                                            </tr>
                                            <tr v-if='!tmList || tmList.length == 0'>
                                                <td colspan="4" class="text-center">暂无数据</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- 分页 -->
                                    <pagination v-show="total>0" :total="total" :page.sync="pageNum" layout="prev, pager, next,total" :limit.sync="pageSize" @pagination="getApplicationList" />
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="7" :xs="24">
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='json.phoneList' resourcesModule='5' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { changeDetail, changeApplicationList } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'
export default {
    name: 'change-detail',
    props: {
        changeTypeEnum: {
            type: Array,
            default: []
        }
    },
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: [],
            price: "",
            changeVoList: [],
            //商标列表
            total: 0,
            pageNum: 1,
            pageSize: 10,
            tmList: []
        }
    },

    created() {
        // this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {

        initPage(applicationId, id) {

            applicationId = applicationId || this.json.applicationId
            id = id || this.json.id

            Promise.all([
                changeDetail(id),
                changeApplicationList(applicationId)
            ])
                .then(res => {

                    let json = res[0].data

                    this.title = (json.companyName || '') + ' 变更详情'
                    this.json = json

                    this.changeVoList = res[1].data

                    this.getApplicationList()
                })
        },
        //领取后
        receiveAfter(type) {
            //拨打领取，只需要刷新列表页
            if (type == 'all') {
                this.initPage()
            }
            this.$emit('reload')
        },
        //申请人商标列表
        getApplicationList() {

            let name = this.json.companyName
            if (!name) return {}

            let requireObj = {
                'pageNo': this.pageNum,
                'pageSize': this.pageSize,
                'keyword': name,
                "searchType": "1",
                "searchFieldDTO": {
                    "applicationNameAndGyr": "1",  //申请人名称
                }
            }
            this.$axios.post('/API/api-e/trademark/query_hit_page_newPc', requireObj)
                .then(res => {
                    // console.log('8888', res)

                    let data = res.data
                    this.total = data.total
                    this.tmList = data.businessList

                }).catch(res => {

                })
        },
        initServerArr(str) {
            str = (str + '').replace(/null/g, "")
            if (/;,/.test(str)) {
                return str ? str.split(";,") : ["--"];
            }
            return str ? str.split(",") : ["--"];
        },
        //替换del标签
        replaceDel(item) {
            if (item) {
                return item.replace(/<(del|\/del).*?>/g, '')
            }
            return ''
        },
        //匹配变更类型
        matchTypeName(type) {
            let item = this.changeTypeEnum.filter(i => i.value == type)[0]

            return (item && item.key) || '--'
        },
        splitTimes(times) {

            return (times || '').split(' ')[0]
        }
    }
}
</script>
// <style lang="scss" scoped>
// .timeList {
//     padding: 0 30px;
//     ::v-deep .el-image-viewer__close .el-icon-circle-close {
//         color: #ffffff;
//     }
//     ::v-deep .el-timeline-item__timestamp {
//         font-size: 14px;
//         color: #2d8cf0;
//         font-weight: bold;
//     }
//     ::v-deep .el-timeline-item__content {
//         color: #515a6e;
//     }
// }
//
</style>