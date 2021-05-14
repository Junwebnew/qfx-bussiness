<template>
    <div class="app-container">

        <div class="mb10 custom-box" id='boxEle'>
            <el-row :gutter="10">
                <!-- //左侧 -->
                <el-col :sm="16" :xs="24">
                    <div class="full-height-auto">

                        <div class="back-fff pad20 posRelative">
                            <resoursePrice :resourcesModule='1' :applicationType='json.applicationType' />
                            <el-row :gutter="10" class="mb16">
                                <el-col :span="24">
                                    <p class="tit">基本信息</p>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :sm="12" :xs="24">
                                    <el-row :gutter="10">
                                        <el-col :xs="24" class="mb16">
                                            <span class="custom-label">商标名：</span>
                                            <div class="custom-r">
                                                {{json.trademarkName}}
                                                <div class="inlineBlock">
                                                    <el-tag v-if=' json.saleStatus === 0 ' type="success" size='mini'>在售</el-tag>
                                                    <el-tag v-else-if=' json.saleStatus == 1 ' type="warning" size='mini'>已售</el-tag>
                                                    <el-tag v-else-if=' json.saleStatus == 2 ' type="info" size='mini'>无效</el-tag>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" class="mb16">
                                            <span class="custom-label">注册号：</span>
                                            <div class="custom-r">
                                                {{json.regNum}}
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" class="mb16">
                                            <span class="custom-label">国际分类：</span>
                                            <div class="custom-r">
                                                {{json.intclass}}
                                            </div>
                                        </el-col>
                                        <el-col :span="24" class="mb16">
                                            <span class="custom-label">商标结构：</span>
                                            <div class="custom-r">
                                                {{json.trademarkStructureCn}}
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :sm="12" :xs="24" class="mb16">
                                    <span class="custom-label"> 商标图样：</span>
                                    <div class="custom-r">
                                        <div class="imgBox pointer">
                                            <img :src="$getImg(json.osmark,2)" @click="$openNewView( $getImg(json.osmark,1) ) ">

                                            <!-- <img :src="$getImg(scope.row.osmark,2) || scope.row.originalGraphicStyle || ''"> -->
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">

                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">是否下证：</span>
                                    <div class="custom-r">
                                        {{json.hasCertificate}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">拿证日期：</span>
                                    <div class="custom-r">
                                        {{json.certificateTime}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">注册日期：</span>
                                    <div class="custom-r">
                                        {{json.regTime}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">注册公告时间：</span>
                                    <div class="custom-r">
                                        {{json.regNoticeDateTime}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">指导价(元)：</span>
                                    <div class="custom-r">
                                        {{json.price == 0 ? '--' : json.price }}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">客户价(元)：</span>
                                    <div class="custom-r">
                                        {{json.customerPrice == 0 ? '--' : json.customerPrice }}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">优惠价(元)：</span>
                                    <div class="custom-r">
                                        {{json.ratePrice == 0 ? '--' : json.ratePrice }}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">联系人：</span>
                                    <div class="custom-r">
                                        {{json.contact}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">联系电话：</span>
                                    <div class="custom-r">
                                        {{json.contactTel}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">微信号：</span>
                                    <div class="custom-r">
                                        {{json.weixin}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">QQ：</span>
                                    <div class="custom-r">
                                        {{json.qq}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">标源来源：</span>
                                    <div class="custom-r">
                                        {{macthCn( json.sourceType )}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">专用期限开始时间：</span>
                                    <div class="custom-r">
                                        {{json.startAllottedTime}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="mb16">
                                    <span class="custom-label">专用期限结束时间：</span>
                                    <div class="custom-r">
                                        {{json.endAllottedTime}}
                                    </div>
                                </el-col>

                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">类似群：</span>
                                    <div class="custom-r">
                                        {{json.similargroup}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">商品项：</span>
                                    <div class="custom-r">
                                        <ul class="product-list" v-if="json.goods">
                                            <li class="list" v-for='(item,idx) in initServerArr(json.goods)' :key='idx' :title="replaceDel(item) " v-html="item"></li>
                                        </ul>
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">商品共用类:</span>
                                    <div class="custom-r">
                                        {{json.commonCategories}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">图形要素编码：</span>
                                    <div class="custom-r">
                                        {{json.imagesElementCode}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">已选择类似群：</span>
                                    <div class="custom-r">
                                        {{json.similargroup}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">图形要素内容：</span>
                                    <div class="custom-r">
                                        {{json.imagesElementContent}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">来源备注：</span>
                                    <div class="custom-r">
                                        {{json.sourceExplain}}
                                    </div>
                                </el-col>
                                <el-col :span="24" class="mb16">
                                    <span class="custom-label">备注：</span>
                                    <div class="custom-r">
                                        {{json.remark}}
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="mt10 back-fff pad20 custom-box">
                            <el-row :gutter="10">
                                <el-col :span="24" class="mb16">
                                    <p class=" tit">申请人信息</p>
                                </el-col>
                                <el-col :lg="12" :sm="12" :xs="24">
                                    <span class="custom-label">申请人主体：</span>
                                    <div class="custom-r">
                                        {{json.applicantName || '--'}}
                                    </div>
                                </el-col>
                                <el-col :lg="12" :sm="12" :xs="24">
                                    <span class="custom-label"> 申请人商标数：</span>
                                    <div class="custom-r">
                                        <div style="min-height:50px;width:200px" v-if='json.applicantId'>
                                            <el-button :loading="btnLoading" v-if='!assTmNumberStr' type="warning" plain size='mini' @click="getMoreNumber">
                                                <span v-if="!btnLoading">获 取</span>
                                                <span v-else>获 取 中...</span>
                                            </el-button>
                                            <div v-else v-html="assTmNumberStr"></div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <!-- //右侧 -->
                <el-col :sm="8" :xs="24">
                    <div class="back-fff pad20 full-height2">
                        <p class="tit mb16">联系信息</p>
                        <phoneList :phoneList='phoneList' resourcesModule='11' :resourceId='json.id' @reload='receiveAfter' />
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { sellTrademarkDetail } from "@/api/resources";
import { phoneList, resoursePrice } from '../_module'

export default {
    props: {
        tmresourceArr: {
            type: Array,
            default: () => []
        }
    },
    components: {
        phoneList, resoursePrice
    },
    data() {
        return {
            json: {},
            loading: false,
            tableData: [],
            price: '',
            assTmNumberStr: false,
            btnLoading: false,
            phoneList: []
        }
    },
    // watch: {
    //     $route(now) {
    //         if ('recent-apply-detail' == now.name && this.$route.query.id != now.query.id) {
    //             this.initPage(now.query.id)
    //         }
    //     }
    // },
    created() {
        // this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {
        initPage(id) {

            id = id || this.json.id

            this.assTmNumberStr = false

            let loading = this.$eleLoading('#boxEle')
            sellTrademarkDetail(id)
                .then(res => {
                    this.json = res.data

                    this.phoneList = [{ id: id, phone: res.data.contactTel }]

                    loading.close()
                })
                .catch(() => {
                    loading.close()
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
        initServerArr(str) {
            str = (str + '').replace(/null/g, "")
            if (/;,/.test(str)) {
                return str ? str.split(";,") : ["--"];
            }
            return str ? str.split(",") : ["--"];
        },
        //匹配标源来源中文
        macthCn(code) {
            code += ''
            for (let item of this.tmresourceArr) {
                if (item.value == code) {
                    return item.name
                }
            }
            return this.tmresourceArr[1].name
        },
        //替换del标签
        replaceDel(item) {
            if (item) {
                return item.replace(/<(del|\/del).*?>/g, '')
            }
            return ''
        },
        getResourse(row) {

        },
        //获取申请人商标的数量
        getMoreNumber() {

            if (this.btnLoading) return

            this.btnLoading = true

            let code = this.json.applicantId
            this.$axios.get('transaction/sellTrademark/getTmNumberByApplicantId?applicantId=' + code)
                .then(res => {
                    // console.log('获取数量',res)
                    if (res.code == 200) {
                        this.assTmNumberStr = `申请商标数量:<span class='col'>${res.data.trademarkNumber}</span>个。<br>注册公告商标数量:<span class='col'>${res.data.noticeNumber}</span>个`
                    }
                    else {
                        this.$message.warning("获取失败,稍后再试!")
                    }

                    this.btnLoading = false
                })
                .catch(res => {
                    this.$message.warning("获取失败,稍后再试!")
                    this.btnLoading = false
                })
        },
    }
}
</script>
<style lang="scss" scoped>
.mb16 {
    margin-bottom: 16px;
}
.product-list {
    // border: 1px solid #edf0f4;
    // padding: 10px 10px 0;
    li {
        display: inline-block;
        // height: 32px;
        // line-height: 32px;
        line-height: 1.5em;
        min-width: 32%;
        margin-right: 1.3%;
    }
}
</style>