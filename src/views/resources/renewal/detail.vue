<template>
    <div class="app-container">
        <div class="head-parts mb10">
            <div class="words">{{title}}</div>
        </div>
        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">基本信息</span>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">商标名称：</span>
                    <div class="custom-r">
                        {{json.tmName || '--'}}
                    </div>

                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">国际分类：</span>
                    <div class="custom-r">
                        {{json.intClass}}类
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">申请/注册号：</span>
                    <div class="custom-r">
                        {{json.regNum || '--'}}
                    </div>
                </el-col>
                <!-- <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 商标图样：</span>
                    <div class="custom-r">
                        <el-image style="width:100px" :src="$getImg(json.graphicStyle) || json.originalGraphicStyle || ''" :alt="'营业执照'" :preview-src-list="[$getImg(json.graphicStyle,1)]"></el-image>
                    </div>
                </el-col> -->
            </el-row>
            <el-row :gutter="20">

                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 当前状态：</span>
                    <div class="custom-r">
                        {{json.commonStatus || '--'}}
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">截止日期：</span>
                    <div class="custom-r">
                        {{json.applicationNameId || '--'}}
                    </div>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">代理机构：</span>
                    <div class="custom-r">
                        {{json.agency || '--'}}
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">申请人信息</span>
                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label">申请人主体:</span>
                    <div class="custom-r">
                        {{json.userName || '--'}}
                    </div>

                </el-col>
                <el-col :lg="8" :sm="12" :xs="24">
                    <span class="custom-label"> 申请人地址：</span>
                    <div class="custom-r">
                        {{json.userAddress || '--'}}
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="mb10 back-fff pad20 custom-box">
            <el-row :gutter="20">
                <el-col :span="24" class="mb20">
                    <span class="custom-label text-left">联系信息</span>
                </el-col>
                <el-col :span='24'>
                    <el-table v-loading="loading" :data="tableData" row-key="id">
                        <el-table-column label="联系方式" align='center' prop="trademarkApplicationDate"></el-table-column>
                        <el-table-column label="最新领取" align='center' prop="trademarkApplicationDate"></el-table-column>
                        <el-table-column label="相关操作" width='220' align='center'>
                            <template slot-scope="scope">
                                <div class='operation'>
                                    <el-button size="mini" type="success " @click="getResourse(scope.row)">领取</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { renewalrDetail } from "@/api/resources";
import { mapGetters } from 'vuex'

export default {
    name: 'renewal-detail',
    data() {
        return {
            title: '详情页',
            json: {},
            loading: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    watch: {
        $route(now) {
            if ('renewal-detail' == now.name && this.$route.query.id != now.query.id) {
                this.initPage(now.query.id)
            }
        }
    },
    created() {
        // this.initList('n1', () => {
        //     this.initList('n2')
        // })

        this.initPage(this.$route.query.id || 'b88ec8e7e9d24c09a8fc916a4d69d4c5')
    },
    methods: {

        initPage(id) {
            renewalrDetail(id)
                .then(res => {
                    this.title = (res.data.tmName || '') + ' 详情页'
                    this.json = res.data
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
        getResourse(row) {

        }
    }
}
</script>
<style lang="scss" scoped>
</style>