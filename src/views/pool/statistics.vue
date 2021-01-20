<template>
    <div class="app-container" id='box'>
        <div class="full-height">
            <!-- 搜索框 -->
            <div class="back-fff pad20-20-10 mb10">
                <el-row :gutter="10">
                    <el-form ref="form" :model="{}" label-width="90px">
                        <el-row :gutter="10">
                            <!--部门数据-->
                            <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                                <el-form-item label="部门名称：">
                                    <treeselect v-model="queryParams.orgId" :options="deptListTree" :normalizer="normalizer" placeholder="选择上级部门" noResultsText="暂无结果" :searchable="true" @select='depTtreeChange' />
                                </el-form-item>
                            </el-col>

                            <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                                <el-form-item label="商务名称：">
                                    <el-select v-model="queryParams.orderformUserId" style="width:100%" clearable filterable size='small'>
                                        <el-option v-for="item in depUserList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :lg='8' :md='12' :sm="24" :xs="24">
                            <el-form-item label="价格区间：">
                                <priceRange />
                            </el-form-item>
                        </el-col> -->
                            <el-col :lg='6' :md='10' :sm="24" :xs="24">
                                <el-form-item label="成单时间：">
                                    <el-date-picker v-model="dateRange" size="small" style="width:100%" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :lg='6' :md='10' :sm="10" :xs="24">
                                <el-form-item label="">
                                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-row>
            </div>
            <!-- //图标 -->

            <el-row :gutter="10" class="chartBox">
                <el-col :md='12' :sm="24" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20 part-tit"> <i class="el-icon-info col"></i> 新老客户比例统计</p>
                        <div ref="myChart1" class="myChart"></div>
                    </div>
                </el-col>
                <el-col :md='12' :sm="24" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20 part-tit"> <i class="el-icon-info col"></i> 资源类型比例统计</p>
                        <div ref="myChart2" class="myChart"></div>
                    </div>
                </el-col>
                <el-col :md='24' :sm="24" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20 part-tit"> <i class="el-icon-info col"></i> 业务类型比例统计</p>
                        <div ref="myChart3" class="myChart"></div>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="10" class="chartBox" v-if="whetherAdmin">
                <el-col :md='18' :sm="18" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20 part-tit"> <i class="el-icon-info col"></i> 业务人员成单比例统计</p>
                        <div ref="myChart4" style="width:100%;height:500px"></div>
                    </div>
                </el-col>
                <el-col :md='6' :sm="6" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class="f16 mb20 part-tit"> <i class="el-icon-info col"></i> 业务人员成单排名</p>
                        <el-table :data="sellerSortArr" style="width: 100%" height='500'>
                            <el-table-column align='center' label="序号" width='50'>
                                <div slot-scope="scope" class="sellList">
                                    <span :class="'circle cir'+ scope.$index">{{scope.$index + 1}}</span>
                                </div>
                            </el-table-column>
                            <el-table-column prop="name" label="人员">
                            </el-table-column>
                            <el-table-column prop="value" align='center' width='70' label="成单数">
                            </el-table-column>
                            <el-table-column prop="per" align='center' width='70' label="百分比">
                                <div slot-scope="scope" class="sellList">
                                    <span class="num">{{scope.row.percentage}}</span>
                                </div>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import { clueStatistics, bussFinishStatistics } from "@/api/center";
import { qmxUserList } from "@/api/system/user";
import { mapGetters } from 'vuex'
import { qmxDept } from "@/api/system/dept";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    components: { Treeselect },
    data() {
        return {
            //组织机构树
            deptListTree: [],
            //用户列表
            depUserList: [],
            //搜索参数
            queryParams: {},
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ],
                disabledDate: time => {
                    let _now = Date.now()
                    return time.getTime() > _now
                }
            },
            //时间段
            dateRange: [],
            chartData: [],
            myChartObj: {},
            //排序后的人员销售
            sellerSortArr: [],
            sellerNum: 0
        }
    },
    computed: {
        ...mapGetters([
            'whetherAdmin'
        ])
    },
    created() {

        //管理员可以选择机构，选择人员
        if (this.whetherAdmin) {

            qmxDept(this.queryParams).then(res => {

                this.deptListTree = this.changeDate(res.data)
            })

            this.$store.dispatch('getDepUser').then(res => {
                this.depUserList = res
            })
        }

    },
    mounted() {

        this.myChartObj.a = echarts.init(this.$refs.myChart1, null, { devicePixelRatio: 2.5 });
        this.myChartObj.b = echarts.init(this.$refs.myChart2, null, { devicePixelRatio: 2.5 });
        this.myChartObj.c = echarts.init(this.$refs.myChart3, null, { devicePixelRatio: 2.5 });

        window.addEventListener("resize", () => {
            for (let key in this.myChartObj) {
                this.myChartObj[key].resize()
            }

        });

        // this.handleQuery()
    },
    methods: {

        handleQuery() {   //获取table表单的数据**************************************

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            bussFinishStatistics(this.addDateRange(this.queryParams, this.dateRange, { start: 'orderformTimeStart', end: 'orderformTimeEnd' })).then(response => {

                let dataObj = this.chartData = response.data;

                initChartsDonut(this.myChartObj.a, '客户总数', [{ name: '新客户', value: dataObj.newCustomerNum }, { name: '老客户', value: dataObj.oldCustomerNum }], dataObj.newCustomerNum + dataObj.oldCustomerNum)
                initChartsDonut(this.myChartObj.b, '资源总数', dataObj.reourceTypeCountList, this.assTotal(dataObj.reourceTypeCountList))
                initChartsDonut(this.myChartObj.c, '业务总数', dataObj.businessTypeCountList, this.assTotal(dataObj.businessTypeCountList))

                //人员的统计,增加总数，增加百分比
                if (this.whetherAdmin) {

                    this.myChartObj.d = echarts.init(this.$refs.myChart4, null, { devicePixelRatio: 2.5 });

                    let sellerNum = this.sellerNum = this.assTotal(dataObj.businessPeopleCountList)

                    this.sellerSortArr = dataObj.businessPeopleCountList.map(i => {
                        if (sellerNum) {
                            i.percentage = parseFloat((i.value / sellerNum * 100).toFixed(2)) + '%'

                        }
                        else {
                            i.percentage = '0%'
                        }
                        return i
                    }).sort((a, b) => b.value - a.value)

                    //柱状图
                    this.initHistogram(this.myChartObj.d, dataObj.businessPeopleCountList, sellerNum)

                }
                loading.close()
            })
                .catch(res => {
                    loading.close()
                })
        },
        //统计总数
        assTotal(arr) {

            let total = 0
            arr.map(item => {
                item.value = Number(item.value)
                if (item) {
                    total += Number(item.value || 0)
                }
            })
            return total
        },
        //获取部门的人员
        getUserList(id) {

            let params = {
                pageNum: 1,
                pageSize: 1000,
                orgId: id || ''
            }

            qmxUserList(params).then(response => {
                this.depUserList = response.data;
            })

        },
        //数据子集切换和删除
        changeDate(arr) {
            arr.map(i => {
                if (i.treeVoList && i.treeVoList.length > 0) {
                    let newArr = this.changeDate(i.treeVoList)
                    i.children = newArr
                }
                delete i.treeVoList
            })
            return arr
        },
        /** selectTree 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            };
        },
        depTtreeChange(e) {
            // console.log('9999', e)
            this.queryParams.orderformUserId = ''
            this.depUserList = []
            this.getUserList(e.id)
        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.orgAndDept = undefined
            this.queryParams.counselorId = ''
            this.handleQuery();
        },
        //饼图
        initCharts(myChart, titStr, chartData, total) {

            myChart.setOption({
                title: {
                    text: titStr,
                    subtext: total + '条',
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
                    formatter: '{b} : {c}条 ({d}%)'
                },
                color: ['#3aa1ff', '#36cbcb', '#4ecb73', '#fbd437', '#f2637b', '#975fe5', '#2f54eb', '#fa541c'],
                legend: {
                    orient: 'vertical', //布局方式，默认水平布局，另可选vertical
                    top: '50',
                    left: '58%',
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
                        return " {a|" + name + "}{b||}{c|" + parseFloat((target / (total || 10) * 100).toFixed(2)) + "% }{d| " + target + "条  }"
                    },
                    textStyle: {
                        fontWeight: 400,
                        rich: {
                            a: {
                                fontSize: 12,
                                color: '#000000d9',
                                padding: 0,
                                width: 60,
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
                                width: 50,
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
                        //         shadowBlur: 0,
                        //         shadowOffsetX: 0,
                        //         shadowColor: 'rgba(0, 0, 0, 0.5)',
                        //         borderWidth: 0
                        //     }
                        // }
                    }
                ]
            });

            myChart.resize();
        },
        initHistogram(myChart, chartData, totalNum) {
            let option = {
                xAxis: {
                    data: chartData.map(i => i.name),
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        //inside: true,
                        textStyle: {
                            fontSize: '10'
                        },
                        rotate: 40
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    max: function (value) {
                        return value.max > 10 ? (value.max + 6) : (value.max + 1);
                    }
                },
                color: ['#3aa1ff', '#36cbcb', '#4ecb73', '#fbd437', '#f2637b', '#975fe5', '#2f54eb', '#fa541c'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    // formatter: function (params) {
                    //     var result = ''
                    //     var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:8px;height:8px;background-color:#1890ff"></span>'
                    //     params.forEach(function (item) {
                    //         // console.log(item) item.marker
                    //         result += dotHtml + item.name + ' : ' + item.value + '条 '
                    //     })
                    //     return result
                    // },
                    // backgroundColor: "rgba(255,255,255,0.8)", //设置背景图片 rgba格式
                    // color: "black",
                    // borderWidth: "1", //边框宽度设置1
                    // borderColor: "#f1f1f1", //设置边框颜色
                    // textStyle: {
                    //     color: "black" //设置文字颜色
                    // },
                    // shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
                series: [{
                    name: '成单数',
                    data: chartData.map(i => (i.value)),
                    type: 'bar',
                    showBackground: true,
                    barMaxWidth: 30,
                }]
            };

            myChart.setOption(option)
            myChart.resize();
        }
    },
    beforeDestroy() { }
}
</script>
<style lang="scss" scoped>
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
        float: right;
        font-weight: 600;
        color: #000;
    }
}
</style>