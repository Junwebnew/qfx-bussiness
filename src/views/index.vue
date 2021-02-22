<template>
    <div class="app-container home">
        <div class="back-fff">
            <el-row :gutter="10" class="pad20 userInfoBox mb10">
                <el-col :sm="8" :xs="24" class="">
                    <div class="user-avatar">
                        <img :src="avatar">
                    </div>
                    <div class="avaterContent">
                        <h2>{{timeFix()}},{{name}}</h2>
                        <p>
                            {{orgInfo.orgName}}
                            <span v-if=" orgInfo.orgName != orgInfo.deptName"> - {{orgInfo.deptName}}</span>
                            <span v-if="!rolesId" class="col-red">用户未授予角色权限</span>
                        </p>

                    </div>
                </el-col>
                <el-col :sm="16" :xs="24">
                    <ul class="showInfo">
                        <li v-if="mainAccount">
                            <span>剩余星数</span>
                            <p class="num" :class="{'col-red':accountNumber < 100}">{{accountNumber || 0}}</p>
                        </li>
                        <li>
                            <span>我的线索数</span>
                            <p class="num">
                                <router-link class="col" to="/center/clueManage/clue">{{clueNum}}</router-link>
                            </p>
                        </li>
                        <li>
                            <span>我的商机数</span>
                            <p class="num">
                                <router-link class="col" to="/center/bussManage/buss">{{bussNum}}</router-link>
                            </p>
                        </li>
                        <li v-if="whetherAdmin">
                            <span>线索总数</span>
                            <p class="num">
                                <router-link class="col" to="/center/clueManage/clue-all">{{countObj.clueCount}}</router-link>
                            </p>
                        </li>
                        <li v-if="whetherAdmin">
                            <span>商机总数</span>
                            <p class="num">
                                <router-link class="col" to="/center/bussManage/buss-all">{{countObj.oppCount}}</router-link>
                            </p>
                        </li>
                        <li>
                            <span>成单总数</span>
                            <p class="num">
                                <router-link class="col" to="/center/finishManage/finishList">{{countObj.orderFormCount}}</router-link>
                            </p>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <!-- 新增资源 -->
        <div class="back-fff">
            <el-row :gutter="10" class="pad20  mb10">
                <el-col>
                    <p class=" f16 mb20 part-tit">
                        今日资源新增
                        <!-- <router-link class="col fr f14" to="/center/finishManage/finishStatistics">详情></router-link> -->
                    </p>
                </el-col>
                <ul class="reourseBox">
                    <li v-for="(item,idx) in resourceTotal" :key='idx' class="pointer" @click="goPage( item.id )">
                        <p class="mb5">{{item.name}}</p>
                        <span class="b col">{{item.value}}</span>
                    </li>
                </ul>
                <!-- <template v-for="(item,idx) in resourceTotal">
                    <el-col :md='4' :sm="6" :xs="12" :key='idx' v-show='item.value != 0 '>
                        <p class="mb10 pointer" @click="goPage( item.id )">
                            <label>{{item.name}}：</label>
                            <span class="b col ml5">{{item.value}}</span> 条
                        </p>
                    </el-col>
                </template> -->
            </el-row>
        </div>
        <!-- //图标 -->
        <el-row :gutter="10" class="chartBox">
            <el-col :md='12' :sm="24" :xs="24" class="l">
                <div class="back-fff pad20  mb10">
                    <p class=" f16 mb20 part-tit">
                        成单金额统计 <small class="col-hui f12">(默认查询当月 {{timer.orderformTimeStart}} ~ {{timer.orderformTimeEnd}} )</small>
                        <router-link class="col fr f14" to="/center/finishManage/finishStatistics">更多></router-link>
                    </p>
                    <div ref="myChart1" class="myChart"></div>
                </div>
            </el-col>
            <el-col :md='12' :sm="24" :xs="24" class='r'>
                <div class="back-fff pad20  mb10">
                    <p class="f16 mb20 part-tit"> 今日待跟进商机
                        <router-link class="col fr f14" to="/center/bussManage/today">更多></router-link>
                    </p>
                    <el-table :data="bussTodayArr" style="width: 100%" height='360'>
                        <el-table-column type='index' label="序号" width='50'></el-table-column>
                        <el-table-column label="客户名称" prop="customerName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="最新备注" prop="remarkContent">
                            <template slot-scope="scope">
                                <div>
                                    <span class="f12">{{scope.row.remarkDate}}_{{scope.row.remarkContent}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="60" class-name="small-padding fixed-width" fixed="right">
                            <template slot-scope="scope">
                                <div class='operation'>
                                    <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import echarts from "echarts";
import { mapGetters } from 'vuex'
import { getDataStatic, finishOppsStatisticsMoney, bussTodayeList, clueMyList, bussMyList } from "@/api/center";
import { costSetAccountList } from "@/api/account";
import { totalCountResourse } from "@/api/resources";

export default {
    name: "index",
    data() {
        return {
            //机构职位
            orgInfo: {},
            //总数统计
            countObj: {},
            //线索数
            clueNum: '',
            //商机数
            bussNum: '',
            bussTodayArr: [],
            myChart: {},
            accountNumber: '',
            resourceTotal: [],
            //统计时间段
            timer: { 'orderformTimeStart': '', 'orderformTimeEnd': '' }
        };
    },
    computed: {
        ...mapGetters([
            'avatar',
            'name',
            'mainAccount',
            'companyId',
            'rolesId',
            'whetherAdmin'
        ]),
    },
    created() {
        this.$store.dispatch('getUserOrgAndDep').then(res => {
            this.orgInfo = res
        })

        if (this.mainAccount) {
            costSetAccountList({ pageNum: 1, pageSize: 2, orgId: this.companyId }).then(res => {

                this.accountNumber = res.data[0].num
                // this.accountNumber = 9
            })
                .catch(error => {
                    console.log('获取数量失败', error)
                })
        }

        getDataStatic({}).then(res => {
            this.countObj = res.data
        })
        //我的线索数
        clueMyList({ pageNum: 1, pageSize: 1 }).then(response => {
            this.clueNum = response.total
        })
        //我的商机数
        bussMyList({ pageNum: 1, pageSize: 1 }).then(response => {
            this.bussNum = response.total
        })
    },
    mounted() {
        //防止canvas 动画未停止
        window.CanvasStop && window.CanvasStop()

        this.myChart.a = echarts.init(this.$refs.myChart1, null, { devicePixelRatio: 2.5 });
        this.handleQuery()

        totalCountResourse().then(res => {
            // console.log(111, res)
            this.resourceTotal = res.data

        })
    },
    methods: {
        handleQuery() {

            let timer = this.timer = { 'orderformTimeStart': this.parseTime(new Date(), '{y}-{m}-') + '01', 'orderformTimeEnd': this.parseTime(new Date(), '{y}-{m}-{d}') }

            Promise.all([
                bussTodayeList({ pageNum: 1, pageSize: 10 }),
                finishOppsStatisticsMoney(timer),
            ]).then(res => {

                this.bussTodayArr = res[0].data

                this.initCharts(this.myChart.a, '总金额', res[1].data.businessTypeCountList, this.assTotal(res[1].data.businessTypeCountList))
            })

        },
        //商机详情
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/bussManage/buss/detail?id=' + obj.id)
        },
        //统计总数
        assTotal(arr, keyObj) {

            let total = 0
            arr.map(item => {
                if (keyObj && keyObj.k1) {
                    item.name = item[keyObj.k1]
                    item.value = item[keyObj.k2]
                }
                item.value = Number(item.value || 0)
                if (item) {
                    total += Number(item.value || 0)
                }
            })
            return total
        },
        initCharts(myChart, titStr, chartData, total) {

            myChart.setOption({
                title: {
                    text: titStr,
                    subtext: "￥" + total,
                    left: '27%',
                    top: '40%',
                    textAlign: 'center',
                    padding: [5, 0],
                    textStyle: {
                        color: '#888',
                        fontSize: 16,
                        lineHeight: 32,
                        fontWeight: 400
                    },
                    subtextStyle: {
                        color: '#1890ff',
                        fontSize: 20,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : ￥{c} ({d}%)'
                },
                color: ['#3aa1ff', '#36cbcb', '#4ecb73', '#fbd437', '#f2637b', '#975fe5', '#2f54eb', '#fa541c'],
                legend: {
                    orient: 'vertical', //布局方式，默认水平布局，另可选vertical
                    top: '50',
                    left: '57%',
                    itemWidth: 8,　　　　　　　//图例大小  我这里用的是圆
                    itemGap: 16,　　　　　　　　//图例之间的间隔
                    y: '80%',　　　　　　　　　　//垂直放的位置，可以写top，center，bottom，也可以写px或者百分比。x轴方向同理，默认center
                    icon: "circle",　　　　　　//图例的形状，选择类型有："circle"（圆形）、"rectangle"（长方形）、"triangle"（三角形）、"diamond"（菱形）、"emptyCircle"（空心圆）、
                    //　　　　"emptyRectangle"（空心长方形）、"emptyTriangle"（空心三角形）、"emptyDiamon"（空心菱形），还可以放自定义图片，格式为"image://path",
                    //　　　path为图片路径

                    selectedMode: true,　　　　//选中哪个图例 false后图例不可点击
                    textStyle: {
                        fontSize: 12,
                        fontFamily: "Microsoft YaHei",

                    },
                    data: chartData,
                    formatter: function (name) {
                        let target;
                        for (let i = 0; i < chartData.length; i++) {
                            if (chartData[i].name === name) {
                                target = chartData[i].value
                            }
                        }
                        // return " {a|" + name + "}{b||}{c|" + target + "条}"
                        return " {a|" + name + "}{b||}{c|" + parseFloat((target / (total || 10) * 100).toFixed(2)) + "% }{d| ￥" + target + "}"
                    },
                    textStyle: {
                        fontWeight: 400,
                        rich: {
                            a: {
                                fontSize: 12,
                                color: '#000000d9',
                                padding: 0,
                                width: 80,
                                fontWeight: 400,
                            },
                            b: {
                                fontSize: 12,
                                color: '#0000000f',
                                padding: [0, 4, 0, 4],
                                fontWeight: 400,
                            },
                            c: {
                                fontSize: 12,
                                color: '#00000073',
                                padding: [0, 4, 0, 4],
                                width: 40,
                                fontWeight: 400,
                            },
                            d: {
                                fontSize: 12,
                                color: '#000000d9',
                                padding: 0,
                                fontWeight: 400,
                            },
                        },
                    }
                },
                series: [
                    {
                        name: '成单金额统计',
                        type: 'pie',
                        radius: ['45%', '65%'],
                        avoidLabelOverlap: false,
                        center: ['27%', '50%'],
                        data: chartData,
                        label: {
                            formatter: '{b} : {c} ',
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        itemStyle: {
                            borderWidth: 2, //设置border的宽度有多大
                            borderColor: '#ffffff',
                        },
                        // emphasis: {
                        //     itemStyle: {
                        //         shadowBlur: 10,
                        //         shadowOffsetX: 0,
                        //         shadowColor: 'rgba(0, 0, 0, 0.5)',
                        //         borderWidth: 0
                        //     }
                        // }
                    }
                ]
            });
        },
        //页面跳转
        goPage(id) {
            var resoursesPage = [
                { id: "1344173032301821954", url: '/resources/recent-apply' }, { id: "1344241701388201986", url: '/resources/objection-analysis' },
                { id: "1344173049066455042", url: '/resources/renewal' }, { id: "1344173216280772609", url: '/resources/agency-cancel' },
                { id: "1344173201047060482", url: '/resources/change' }, { id: "1344241701266567170", url: '/resources/reject' },
                { id: "1344241701547585538", url: '/resources/resource-buy' }, { id: "1344241701484670977", url: '/resources/white-list' },
                { id: "1344241701484670978", url: '/resources/serving-notice' }
            ]
            let goItem = resoursesPage.filter(i => i.id == id)
            this.$router.push(goItem[0].url)
        },
        goTarget(href) {
            window.open(href, "_blank");
        },
        timeFix() {
            const time = new Date();
            const hour = time.getHours();
            return hour < 9
                ? "早上好"
                : hour <= 11
                    ? "上午好"
                    : hour <= 13
                        ? "中午好"
                        : hour < 20
                            ? "下午好"
                            : "晚上好";
        }
    },
};
</script>

<style scoped lang="scss">
.userInfoBox {
    .user-avatar {
        float: left;
        width: 72px;
        height: 72px;
        margin-right: 24px;
        overflow: hidden;
        border-radius: 50%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .avaterContent {
        position: relative;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        padding-top: 6px;
        overflow: h;
        h2 {
            margin-bottom: 8px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
        }
        p {
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
        }
    }
    .showInfo {
        text-align: right;
        li {
            position: relative;
            display: inline-block;
            padding: 0 4px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5;
            text-align: center;
            width: 16.66%;
            max-width: 130px;
            vertical-align: top;
            .num {
                color: rgba(0, 0, 0, 0.85);
                font-size: 24px;
                margin-top: 10px;
                height: 36px;
            }
            & + li {
                &::after {
                    position: absolute;
                    top: 8px;
                    left: 0;
                    width: 1px;
                    height: 40px;
                    background-color: #e8e8e8;
                    content: "";
                }
            }
        }
    }
}
.myChart {
    height: 360px;
    width: 530px;
    margin: 0 auto;
    // border: 1px solid #eaeaea;
}
.sellList {
    .circle {
        display: inline-block;
        line-height: 20px;
        height: 20px;
        text-align: center;
        width: 20px;
        font-size: 12px;
        border-radius: 50%;
        margin-right: 10px;
        &.cir0 {
            background-color: #3aa1ff;
            color: #fff;
        }
        &.cir1 {
            background-color: #36cbcb;
            color: #fff;
        }
        &.cir2 {
            background-color: #4ecb73;
            color: #fff;
        }
    }
    .name {
        display: inline-block;
        min-width: 80px;
        font-weight: 500;
        color: #000;
        margin-right: 10px;
    }

    .per {
        display: inline-block;
        padding-left: 10px;
        border-left: 1px solid #f1f1f1;
    }
    .num {
        font-weight: 600;
        color: #000;
    }
}
.reourseBox {
    li {
        display: inline-block;
        text-align: center;
        width: 11.11%;
        & + li {
            border-left: 1px solid #f0f0f0;
        }
        .b {
            font-size: 20px;
            font-weight: normal;
        }
    }
}
</style>

