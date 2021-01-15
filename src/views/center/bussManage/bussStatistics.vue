<template>
    <div class="app-container" id='box'>
        <div class="full-height">
            <!-- 搜索框 -->
            <div class="back-fff pad20 mb10">
                <el-row :gutter="10" class="mb20">
                    <el-form ref="form" :model="{}" label-width="90px">
                        <el-row :gutter="10">

                            <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                                <el-form-item label="部门名称：">
                                    <treeselect v-model="orgAndDept" :options="deptListTree" :normalizer="normalizer" placeholder="选择上级部门" noResultsText="暂无结果" :searchable="true" @select='depTtreeChange' />
                                </el-form-item>
                            </el-col>

                            <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                                <el-form-item label="商务名称：">
                                    <el-select v-model="queryParams.counselorId" clearable filterable size='small' style="width:100%">
                                        <el-option v-for="item in depUserList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg='6' :md='10' :sm="24" :xs="24">
                                <el-form-item label="时间筛选：">
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
                <el-col :md='12' :sm="24" :xs="24" class="l">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20"><i class="el-icon-info col"></i> 商机状态统计</p>
                        <div ref="myChart1" class="myChart"></div>
                    </div>
                </el-col>
                <el-col :md='12' :sm="24" :xs="24" class='r'>
                    <div class="back-fff pad20 mb10">
                        <p class="f16 mb20"><i class="el-icon-info col"></i> 资源类型统计</p>
                        <div ref="myChart2" class="myChart"></div>
                    </div>
                </el-col>
            </el-row>
            <!-- 柱状图 -->
            <div class="back-fff pad20 mb10">
                <el-row :gutter="10" class="chartBox">
                    <el-col :md='16' :sm="24" :xs="24">
                        <p class=" f16 mb20"> <i class="el-icon-info col"></i> 转化率统计</p>
                        <div ref="myChart3" style="width:100%;height:500px"></div>
                    </el-col>
                    <el-col :md='8' :sm="24" :xs="24">
                        <p class="f16 mb20" style="margin-bottom:66px"> <i class="el-icon-info col"></i> 转化率排名</p>

                        <el-table :data="transSortArr" style="width: 100%">
                            <el-table-column align='center' label="序号" width='50'>
                                <div slot-scope="scope" class="sellList">
                                    <span :class="'circle cir'+ scope.$index">{{scope.$index + 1}}</span>
                                </div>
                            </el-table-column>
                            <el-table-column prop="name" label="类型">
                            </el-table-column>
                            <el-table-column prop="bussNum" align='center' width='70' label="商机数">
                            </el-table-column>
                            <el-table-column prop="finishNum" align='center' width='70' label="成单数">
                            </el-table-column>
                            <el-table-column prop="per" align='center' width='70' label="转化率">
                                <div slot-scope="scope" class="sellList">
                                    <span class="num">{{scope.row.per}}%</span>
                                </div>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import { bussStatistics, bussResourseStatistics, finishResourseStatistics } from "@/api/center";
import { mapGetters } from 'vuex'
import { qmxDept } from "@/api/system/dept";
import { qmxUserList } from "@/api/system/user";
import { deepClone } from '@/utils/index'

// import walden from '../_module/walden.js'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    components: { Treeselect },
    data() {
        return {
            //组织机构树
            deptListTree: [],
            orgAndDept: undefined,
            //用户列表
            depUserList: [],
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
            dateRange: [],
            chartData: [],
            myChart: {},
            transSortArr: []
        }
    },
    computed: {
        ...mapGetters([
            'whetherAdmin'
        ])
    },
    watch: {
        orgAndDept(key) {
            if (!key) {
                this.queryParams.deptId = ''
                this.queryParams.orgId = ''
            }
        }
    },
    created() {

        //管理员可以选择机构，选择人员
        if (this.whetherAdmin) {

            qmxDept({}).then(res => {

                this.deptListTree = this.changeDate(res.data)
            })

            this.$store.dispatch('getDepUser').then(res => {
                this.depUserList = res
            })
        }

    },
    mounted() {

        // echarts.registerTheme('walden', walden)
        this.myChart.a = echarts.init(this.$refs.myChart1, null, { devicePixelRatio: 2.5 });
        this.myChart.b = echarts.init(this.$refs.myChart2, null, { devicePixelRatio: 2.5 });
        this.myChart.c = echarts.init(this.$refs.myChart3, null, { devicePixelRatio: 2.5 });

        this.handleQuery()
    },
    methods: {

        handleQuery() {   //获取table表单的数据**************************************

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            bussStatistics(this.addDateRange(this.queryParams, this.dateRange, { start: 'startFollowTime', end: 'endFollowTime' })).then(response => {

                let chartData = response.data;


                this.initCharts(this.myChart.a, '商机总数', chartData, this.assTotal(chartData, { 'k1': 'followStatusName', 'k2': 'totalNum' }))
                loading.close()
            })
                .catch(res => {
                    console.log(123, res)
                    loading.close()
                })

            this.getbussResourseStatistics()
        },
        //资源类型的统计
        getbussResourseStatistics() {

            let requre = this.addDateRange(this.queryParams, this.dateRange, { start: 'startFollowTime', end: 'endFollowTime' }),
                finishObj = deepClone(requre);

            finishObj.orderformUserId = finishObj.orderformUserId
            finishObj.orderformTimeStart = finishObj.startFollowTime
            finishObj.orderformTimeEnd = finishObj.endFollowTime

            if (finishObj.deptId) {
                finishObj.deptIdList = [finishObj.deptId]
            }


            Promise.all([
                bussResourseStatistics(requre),
                finishResourseStatistics(finishObj),
            ]).then(response => {


                this.initCharts(this.myChart.b, '资源总数', response[0].data, this.assTotal(response[0].data))

                this.transSortArr = this.asstransSortArr(response[0].data, response[1].data.reourceTypeCountList)

                this.initHistogram(this.myChart.c, this.transSortArr)
            })
                .catch(res => {
                    console.log('出我', res)
                })
        },
        //线索转化率的统计
        asstransSortArr(clueArr, bussArr) {
            let transSortArr = clueArr.map(mo => {
                mo.value = Number(mo.value)
                let bussItem = bussArr.filter(i => {
                    i.value = Number(i.value)
                    return i.name == mo.name
                })[0]
                return {
                    name: mo.name,
                    bussNum: mo.value,
                    finishNum: bussItem.value,
                    per: parseFloat((bussItem.value / (mo.value || 10) * 100).toFixed(2))
                }
            })

            return transSortArr.sort((a, b) => b.per - a.per)
        },
        //统计总数
        assTotal(arr, keyObj) {

            let total = 0
            arr.map(item => {
                if (keyObj && keyObj.k1) {
                    item.name = item[keyObj.k1]
                    item.value = item[keyObj.k2]
                }
                item.value = Number(item.value)
                if (item) {
                    total += Number(item.value || 0)
                }
            })
            return total
        },
        depTtreeChange(e) {

            this.queryParams.counselorId = ''
            this.depUserList = []

            if (e.level <= 2) {
                this.queryParams.orgId = e.id
                this.queryParams.deptId = ''
            } else {
                this.queryParams.orgId = ''
                this.queryParams.deptId = e.id
            }
            this.getUserList(e.id)
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
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.orgAndDept = undefined
            this.handleQuery();
        },
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
                    formatter: '{a} <br/>{b} : {c}条 ({d}%)'
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
                        name: '商机状态统计',
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
        initHistogram(myChart, assData) {
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                //画布的大小，位置
                grid: {
                    top: "100px",
                    left: "50px",
                    right: "10px",
                    bottom: "50px",
                    width: "auto", //图例宽度
                },
                toolbox: {
                    feature: {
                        // dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        // restore: { show: true },
                        // saveAsImage: { show: true }
                    }
                },
                color: ['#3aa1ff', '#36cbcb', '#4ecb73', '#fbd437', '#f2637b', '#975fe5', '#2f54eb', '#fa541c'],
                legend: {
                    data: ['商机数', '成单数']
                },
                xAxis: [
                    {
                        // type: 'category',
                        axisLabel: {
                            interval: 0
                        },
                        data: assData.map(i => i.name),
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                        min: 0,
                        max: function (value) {
                            return value.max > 10 ? (value.max + 6) : (value.max + 1);
                        },
                        axisLabel: {
                            formatter: '{value}条'
                        }
                    }
                ],
                series: [
                    {
                        name: '商机数',
                        type: 'bar',
                        data: assData.map(i => i.bussNum)
                    },
                    {
                        name: '成单数',
                        type: 'bar',
                        data: assData.map(i => i.finishNum)
                    }
                ]
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
        font-weight: 600;
        color: #000;
    }
}
</style>