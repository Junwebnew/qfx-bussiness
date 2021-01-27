
/**
 * myChart canvas实例
 * 
 * titStr : 甜甜圈中心标题
 * chartData：数据， key,value
 * total:总数
 * 
 */

export var initChartsDonut = (myChart, titStr, chartData, total) => {
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
                fontFamily: "Microsoft YaHei"
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
                return " {a|" + name + "}{b||}{c|" + parseFloat((target / (total || 10) * 100).toFixed(2)) + "% }{d|" + target + "条}"
            },
            textStyle: {
                fontWeight: 400,
                rich: {
                    a: {
                        fontSize: 12,
                        color: '#000000d9',
                        padding: 0,
                        width: 74,
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
                // name: '成单金额统计',
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
}