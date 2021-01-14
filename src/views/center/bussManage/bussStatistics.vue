<template>
    <div class="app-container" id='box'>
        <div class="full-height back-fff pad20">
            <!-- 搜索框 -->
            <el-row :gutter="20" class="mb20">
                <el-form ref="form" :model="{}" label-width="90px">
                    <el-row :gutter="10">
                        <!--部门数据-->
                        <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                            <el-form-item label="部门名称：">
                                <treeselect v-model="orgAndDept" :options="deptListTree" :normalizer="normalizer" placeholder="选择上级部门" noResultsText="暂无结果" :searchable="true" @select='depTtreeChange' />
                            </el-form-item>
                        </el-col>
                        <el-col :lg='6' :md='10' :sm="24" :xs="24" v-if="whetherAdmin">
                            <el-form-item label="商务名称：">
                                <el-select v-model="queryParams.counselorId" style="width:100%" clearable filterable size='small'>
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

            <!-- //图标 -->
            <el-row :gutter="20" class="chartBox">
                <el-col :md='12' :sm="24" :xs="24" class="l">
                    <p class="text-center f16 mb20">商机状态统计</p>
                    <div ref="myChart" class="myChart"></div>
                </el-col>
                <el-col :md='12' :sm="24" :xs="24" class='r'>
                    <p class="text-center f16 mb20">资源类型统计</p>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import { bussStatistics } from "@/api/center";
import { mapGetters } from 'vuex'
import { qmxDept } from "@/api/system/dept";
import { qmxUserList } from "@/api/system/user";

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
            myChart: null,
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

        this.myChart = echarts.init(this.$refs.myChart, null, { devicePixelRatio: 2.5 });

        this.handleQuery()
    },
    methods: {

        handleQuery() {   //获取table表单的数据**************************************

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            bussStatistics(this.addDateRange(this.queryParams, this.dateRange, { start: 'startFollowTime', end: 'endFollowTime' })).then(response => {

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
        depTtreeChange(e) {

            this.queryParams.orderformUserId = ''
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
            this.sellerId = ''
            this.handleQuery();
        },
        initCharts(chartData, total) {

            this.myChart.setOption({
                title: {
                    text: '商机总数',
                    subtext: total + '条',
                    left: '26%',
                    top: '40%',
                    textAlign: 'center',
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
                                fontSize: 14,
                                color: '#000000d9',
                                padding: 0,
                                width: 60,
                                fontWeight: 400,
                            },
                            b: {
                                fontSize: 14,
                                color: '#0000000f',
                                padding: [0, 4, 0, 4],
                                fontWeight: 400,
                            },
                            c: {
                                fontSize: 14,
                                color: '#00000073',
                                padding: [0, 4, 0, 4],
                                width: 50,
                                fontWeight: 400,
                            },
                            d: {
                                fontSize: 14,
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
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                borderWidth: 0
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
.myChart {
    height: 360px;
    width: 530px;
    margin: 0 auto;
    // border: 1px solid #eaeaea;
}
</style>