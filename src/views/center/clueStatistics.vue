<template>
    <div class="app-container" id='box'>
        <div style="overflow:hidden" class="mb10">
            <el-form ref="form" :model="{}" label-width="90px">
                <el-row :gutter="10">
                    <!--部门数据-->
                    <el-col :lg='6' :md='6' :sm="13" :xs="24" v-if="whetherAdmin">
                        <el-form-item label="商务名称：">
                            <el-select v-model="queryParams.counselorId" filterable size='small'>
                                <el-option v-for="item in depUserList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg='8' :md='12' :sm="24" :xs="24">
                        <el-form-item label="时间筛选：">
                            <el-date-picker v-model="dateRange" size="small" style="width:100%" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :lg='8' :md='6' :sm="10" :xs="24">
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <div ref="myChart" style="height: 420px" />
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import { clueStatistics } from "@/api/center";
import { mapGetters } from 'vuex'
import walden from './_module/walden.js'

export default {
    data() {
        return {
            depUserList: [],
            queryParams: {},
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate: time => {
                    let _now = Date.now()
                    return time.getTime() > _now
                }
            },
            dateRange: [],
            chartData: [],
            myChart: null,
        }
    },
    computed: {
        ...mapGetters([
            'whetherAdmin'
        ])
    },
    created() {
        if (this.whetherAdmin) {
            this.$store.dispatch('getDepUser').then(res => {
                this.depUserList = res
            })
        }

    },
    mounted() {

        echarts.registerTheme('walden', walden)
        this.myChart = echarts.init(this.$refs.myChart, 'walden');

        this.handleQuery()
    },
    methods: {

        handleQuery() {   //获取table表单的数据**************************************

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            clueStatistics(this.addDateRange(this.queryParams, this.dateRange, { start: 'startFollowTime', end: 'endFollowTime' })).then(response => {

                this.chartData = response.data;

                let chartData = response.data.map(item => {
                    return {
                        name: item.followStatusName,
                        value: Number(item.totalNum)
                    }
                })

                this.initCharts(chartData)
                loading.close()
            })
                .catch(res => {
                    loading.close()
                })
        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.sellerId = ''
            this.handleQuery();
        },
        initCharts(chartData) {

            this.myChart.setOption({
                title: {
                    text: '线索状态统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: chartData.map(i => i.name)
                },
                series: [
                    {
                        name: '线索状态统计',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: chartData,
                        label: {
                            formatter: '{b} : {c} '
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    },
    beforeDestroy() { }
}


</script>