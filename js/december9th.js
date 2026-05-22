document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initNavigation();
    initScrollAnimations();
    initDec9thMap();
});

function initDec9thMap() {
    const chartDom = document.getElementById('dec9th-map');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const dec9thRoute = {
        title: '一二九运动游行路线',
        points: [
            { name: '北京大学', value: [116.3095, 39.9925] },
            { name: '新华门', value: [116.3918, 39.9083] },
            { name: '西单', value: [116.3751, 39.9143] },
            { name: '天桥', value: [116.3966, 39.8833] }
        ],
        lines: [
            { coords: [[116.3095, 39.9925], [116.3918, 39.9083]] },
            { coords: [[116.3918, 39.9083], [116.3751, 39.9143]] },
            { coords: [[116.3751, 39.9143], [116.3966, 39.8833]] }
        ]
    };
    
    const option = {
        title: {
            text: dec9thRoute.title,
            left: 'center',
            textStyle: {
                fontFamily: 'Noto Serif SC',
                fontSize: 24,
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        visualMap: {
            show: false,
            min: 0,
            max: 100,
            inRange: {
                color: ['#50a3ba', '#eac763', '#d94e5d']
            }
        },
        geo: {
            map: 'beijing',
            roam: true,
            zoom: 1.5,
            center: [116.38, 39.92],
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#faf7f0',
                    borderColor: '#d4af37'
                },
                emphasis: {
                    areaColor: '#f0ebe0'
                }
            }
        },
        series: [
            {
                name: '游行路线',
                type: 'lines',
                coordinateSystem: 'geo',
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    symbol: 'arrow',
                    symbolSize: 8
                },
                lineStyle: {
                    color: '#2c3e50',
                    width: 3,
                    opacity: 0.8,
                    curveness: 0.2
                },
                data: dec9thRoute.lines
            },
            {
                name: '关键地点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: dec9thRoute.points,
                symbolSize: 15,
                itemStyle: {
                    color: '#2c3e50'
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    position: 'right',
                    fontSize: 12
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

const dec9thSpots = {
    'xinhua': {
        name: '新华门',
        image: '../images/xinhua.jpg',
        description: '新华门是中南海的正门。1935年12月9日，学生游行队伍在这里集会，要求抗日救国。',
        sentiment: {
            positive: 91,
            tags: ['历史见证', '庄严肃穆', '红色记忆']
        },
        amap: {
            position: [116.3918, 39.9083]
        }
    },
    'beida': {
        name: '北京大学',
        image: '../images/beida.jpg',
        description: '北京大学是一二九运动的重要发起地之一，爱国学生在这里组织了抗日救亡运动。',
        sentiment: {
            positive: 93,
            tags: ['高等学府', '文化圣地', '爱国传统']
        },
        amap: {
            position: [116.3095, 39.9925]
        }
    },
    'xidan': {
        name: '西单',
        image: '../images/xidan.jpg',
        description: '西单是一二九运动游行路线的重要节点，学生队伍在这里进行了抗日宣传活动。',
        sentiment: {
            positive: 87,
            tags: ['繁华商圈', '历史地标', '交通便利']
        },
        amap: {
            position: [116.3751, 39.9143]
        }
    },
    'tianqiao': {
        name: '天桥',
        image: '../images/tianqiao.jpg',
        description: '天桥是北京传统的市民聚集地，一二九运动中，学生在这里与市民一起举行了抗日集会。',
        sentiment: {
            positive: 86,
            tags: ['民俗文化', '历史街区', '市井风情']
        },
        amap: {
            position: [116.3966, 39.8833]
        }
    }
};

function getSpotData(spotId) {
    return dec9thSpots[spotId] || null;
}
