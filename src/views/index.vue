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
                        <p>{{orgInfo.orgName}} <span v-if=" orgInfo.orgName != orgInfo.deptName"> - {{orgInfo.deptName}}</span></p>
                    </div>
                </el-col>
                <el-col :sm="16" :xs="24">
                    <ul class="showInfo">
                        <li v-if="mainAccount">
                            <span>剩余次数</span>
                            <p class="num" :class="{'col-red':accountNumber < 100}">{{accountNumber || 0}}</p>
                        </li>
                        <li>
                            <span>线索总数</span>
                            <p class="num">{{countObj.clueCount}}</p>
                        </li>
                        <li>
                            <span>商机总数</span>
                            <p class="num">{{countObj.oppCount}}</p>
                        </li>
                        <li>
                            <span>成单总数</span>
                            <p class="num">{{countObj.orderFormCount}}</p>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <!-- //图标 -->
        <el-row :gutter="10" class="chartBox">
            <el-col :md='12' :sm="24" :xs="24" class="l">
                <div class="back-fff pad20  mb10">
                    <p class=" f16 mb20 part-tit"> 成单金额统计</p>
                    <div ref="myChart1" class="myChart"></div>
                </div>
            </el-col>
            <el-col :md='12' :sm="24" :xs="24" class='r'>
                <div class="back-fff pad20  mb10">
                    <p class="f16 mb20 part-tit"> 今日待跟进商机</p>
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
import { getDataStatic, finishOppsStatisticsMoney, bussTodayeList } from "@/api/center";
import { rechargeAccountList } from "@/api/account";

export default {
    name: "index",
    data() {
        return {
            //机构职位
            orgInfo: {},
            countObj: {},
            bussTodayArr: [],
            myChart: {},
            accountNumber: ''
        };
    },
    computed: {
        ...mapGetters([
            'avatar',
            'name',
            'mainAccount',
            'companyId'
        ]),
    },
    created() {
        this.$store.dispatch('getUserOrgAndDep').then(res => {
            this.orgInfo = res
        })
        getDataStatic({}).then(res => {
            this.countObj = res.data
        })
        if (this.mainAccount) {
            rechargeAccountList({ pageNum: 1, pageSize: 1, orgId: '' }).then(res => {
                this.accountNumber = res.data[0].accountNumber
                // this.accountNumber = 9
            })
                .catch(error => {
                    console.log('获取数量失败', error)
                })
        }

    },
    mounted() {

        this.myChart.a = echarts.init(this.$refs.myChart1, null, { devicePixelRatio: 2.5 });
        this.handleQuery()


    },
    methods: {
        handleQuery() {

            Promise.all([
                bussTodayeList({ pageNum: 1, pageSize: 10 }),
                finishOppsStatisticsMoney({}),
            ]).then(res => {

                this.bussTodayArr = res[0].data


                // console.log('99', res[1])
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
            padding: 0 32px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5;
            text-align: center;
            .num {
                color: rgba(0, 0, 0, 0.85);
                font-size: 24px;
                margin-top: 10px;
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
</style>

