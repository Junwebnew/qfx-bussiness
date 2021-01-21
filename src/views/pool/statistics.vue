<template>
    <div class="app-container" id='box'>
        <div class="full-height">
            <!-- 搜索框 -->
            <div class="back-fff pad20-20-10 mb10">
                <el-row :gutter="10">
                    <el-form ref="form" :model="{}" label-width="90px">
                        <el-row :gutter="10">
                            <el-col :lg='6' :md='10' :sm="24" :xs="24">
                                <el-form-item label="时间段：">
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
                <el-col :md='17' :sm="18" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class=" f16 mb20 part-tit"> <i class="el-icon-info col"></i> 资源领取比例统计</p>
                        <div ref="myChart1" style="width:100%;height:500px"></div>
                    </div>
                </el-col>
                <el-col :md='7' :sm="6" :xs="24">
                    <div class="back-fff pad20 mb10">
                        <p class="f16 mb20 part-tit"> <i class="el-icon-info col"></i> 资源领取排名</p>
                        <el-table :data="transSortArr" style="width: 100%" height='500'>
                            <el-table-column align='center' label="序号" width='50'>
                                <div slot-scope="scope" class="sellList">
                                    <span v-if=" scope.$index " :class="'circle cir'+ scope.$index">{{scope.$index}}</span>
                                    <span v-else class="circle c0">总</span>
                                </div>
                            </el-table-column>
                            <el-table-column prop="name" label="资源类型">
                            </el-table-column>
                            <el-table-column prop="totalNum" align='center' width='70' label="资源数">
                            </el-table-column>
                            <el-table-column prop="receiveNum" align='center' width='70' label="已领取">
                            </el-table-column>
                            <el-table-column prop="per" align='center' width='70' label="百分比">
                                <div slot-scope="scope" class="sellList">
                                    <span class="num">{{scope.row.per}}%</span>
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
import { receiveResourceTotalCount, resourceTotalCount } from "@/api/center";
import { deepClone } from '@/utils/index'

export default {
    components: {},
    data() {
        return {
            queryParams: {},
            //时间段
            dateRange: [],
            chartData: [],
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
            transSortArr: [],
            myChartObj: {},
            //排序后的人员销售
            sellerSortArr: [],
            sellerNum: 0
        }
    },
    created() {

    },
    mounted() {

        this.myChartObj.a = echarts.init(this.$refs.myChart1, null, { devicePixelRatio: 2.5 });

        window.addEventListener("resize", () => {
            for (let key in this.myChartObj) {
                this.myChartObj[key].resize()
            }

        });

        this.handleQuery()
    },
    methods: {

        handleQuery() {   //获取table表单的数据**************************************

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            Promise.all([
                resourceTotalCount(this.addDateRange(this.queryParams, this.dateRange)),
                receiveResourceTotalCount(this.addDateRange(this.queryParams, this.dateRange))
            ]).then(res => {


                this.transSortArr = this.asstransSortArr(res[0].data, res[1].data)

                // console.log('00000', transSortArr)

                this.initHistogram(this.myChartObj.a, deepClone(this.transSortArr).splice(1), this.transSortArr[0])

                loading.close()
            }).catch(res => {
                console.log('获取报错', res)
                loading.close()
            })
        },
        //两个合并
        asstransSortArr(totalArr, receiverArr) {
            let totalNum = 0,
                receiveNum = 0;
            let transSortArr = totalArr.map(mo => {

                mo.value = Number(mo.value)
                totalNum += mo.value

                let bussItem = receiverArr.filter(i => {

                    i.value = Number(i.totalCount)

                    return i.id == mo.id
                })[0]

                receiveNum += bussItem.value

                return {
                    name: mo.name,
                    totalNum: mo.value,
                    receiveNum: bussItem.value,
                    per: parseFloat((bussItem.value / (mo.value || 10) * 100).toFixed(2))
                }
            })

            transSortArr = transSortArr.sort((a, b) => b.per - a.per)

            transSortArr.unshift({
                name: '总数',
                totalNum: totalNum,
                receiveNum: receiveNum,
                per: parseFloat((receiveNum / (totalNum || 10) * 100).toFixed(2))
            })

            return transSortArr

        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.handleQuery();
        },
        initHistogram(myChart, chartData, totalObj) {
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
                    data: ['资源数', '领取数'],
                    // icon: "triangle",
                    // formatter: function (name) {
                    //     return '总' + name + ' ' + (name == '资源数' ? totalObj.totalNum : totalObj.receiveNum) + '条';
                    // }
                },
                xAxis: [
                    {
                        // type: 'category',
                        axisLabel: {
                            interval: 0
                        },
                        data: chartData.map(i => i.name),
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
                        name: '资源数',
                        type: 'bar',
                        data: chartData.map(i => i.totalNum)
                    },
                    {
                        name: '领取数',
                        type: 'bar',
                        data: chartData.map(i => i.receiveNum)
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
    color: #333;
    .circle {
        display: inline-block;
        line-height: 20px;
        height: 20px;
        text-align: center;
        width: 20px;
        font-size: 12px;
        border-radius: 50%;
        margin-right: 10px;
        &.c0 {
            background-color: #fa541c;
            color: #fff;
        }
        &.cir1 {
            background-color: #3aa1ff;
            color: #fff;
        }
        &.cir2 {
            background-color: #36cbcb;
            color: #fff;
        }
        &.cir3 {
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
        // color: #000;
    }
}
.chartBox ::v-deep table tr:nth-child(1) td {
    font-weight: bolder;
    color: #fa541c;
    .num {
        color: #fa541c;
    }
}
</style>