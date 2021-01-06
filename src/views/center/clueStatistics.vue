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
            <div ref="myChart" class="myChart"></div>
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
                let total = 0
                let chartData = response.data.map(item => {
                    total += Number(item.totalNum)
                    return {
                        name: item.followStatusName,
                        value: Number(item.totalNum)
                    }
                })

                this.initCharts(chartData, total)
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
        initCharts(chartData, total) {

            this.myChart.setOption({
                title: {
                    text: '线索状态统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}条 ({d}%)'
                },
                legend: {
                    orient: 'vertical', //布局方式，默认水平布局，另可选vertical
                    top: '100',
                    left: 'left',
                    itemWidth: 5,　　　　　　　//图例大小  我这里用的是圆
                    itemGap: 14,　　　　　　　　//图例之间的间隔
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
                        // let arr = ["{a|" + target + "}", "{b|" + name + "}"]
                        return "{a|" + name + "}{b||}{c|" + target + "条}{d| " + (target / total).toFixed(2) + "% }"
                    },

                    textStyle: {
                        rich: {
                            a: {
                                fontSize: 12,
                                color: '#565656',
                                padding: 0,
                                fontWeight: 600,
                                padding: [0, 2, 0, 0]
                            },
                            b: {
                                fontSize: 12,
                                color: '#f1f1f1'
                            },
                            c: {
                                fontSize: 12,
                                color: '#8888',
                                padding: [0, 2, 0, 2]
                            },
                            d: {
                                fontSize: 12,
                                color: '#000',
                                padding: 0,
                                padding: [0, 0, 0, 2]
                            }
                        },
                    }
                    /*图例旁边显示数据*/
                    // formatter: '{b} : {c}条 ({d}%)',
                    // rich: {
                    //     a: {
                    //         color: '#999',
                    //         lineHeight: 22,
                    //         align: 'center'
                    //     },
                    //     hr: {
                    //         borderColor: '#aaa',
                    //         width: '100%',
                    //         borderWidth: 0.5,
                    //         height: 0
                    //     },
                    //     b: {
                    //         fontSize: 16,
                    //         lineHeight: 33
                    //     },
                    //     per: {
                    //         color: '#eee',
                    //         backgroundColor: '#334455',
                    //         padding: [2, 4],
                    //         borderRadius: 2
                    //     }
                    // }
                },
                graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
                    type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
                    left: 'center',
                    top: '50%',
                    style: {
                        text: "总线索数",
                        textAlign: 'center',
                        fill: '#888',　　　　　　　　//文字的颜色
                        width: 30,
                        height: 30,
                        fontSize: 16,
                        fontFamily: "Microsoft YaHei"
                    }
                }, {
                    type: 'text',
                    left: 'center',
                    top: '60%',
                    style: {
                        text: total + '条',
                        textAlign: 'center',
                        fill: '#1890ff',
                        width: 30,
                        height: 30,
                        fontSize: 20,
                    }
                }],
                series: [
                    {
                        name: '线索状态统计',
                        type: 'pie',
                        radius: ['50%', '65%'],
                        avoidLabelOverlap: false,
                        center: ['50%', '60%'],
                        data: chartData,
                        label: {
                            formatter: '{b} : {c} '
                        },
                        labelLine: {
                            show: true
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
<style lang="scss" scoped>
.app-container {
    background: #ffffff;
}
.myChart {
    height: 360px;
    width: 600px;
    margin: auto;
}
</style>