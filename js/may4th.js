document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initNavigation();
    initScrollAnimations();
    initMay4thMap();
});

function initMay4thMap() {
    const chartDom = document.getElementById('may4th-map');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const may4thRoute = {
        title: '五四运动游行路线',
        points: [
            { name: '北大红楼', value: [116.403874, 39.915168] },
            { name: '天安门广场', value: [116.397428, 39.90923] },
            { name: '东交民巷', value: [116.4013, 39.9056] },
            { name: '赵家楼', value: [116.4187, 39.9072] }
        ],
        lines: [
            { coords: [[116.403874, 39.915168], [116.397428, 39.90923]] },
            { coords: [[116.397428, 39.90923], [116.4013, 39.9056]] },
            { coords: [[116.4013, 39.9056], [116.4187, 39.9072]] }
        ]
    };
    
    const option = {
        title: {
            text: may4thRoute.title,
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
            center: [116.4, 39.91],
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
                    color: '#c84038',
                    width: 3,
                    opacity: 0.8,
                    curveness: 0.2
                },
                data: may4thRoute.lines
            },
            {
                name: '关键地点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: may4thRoute.points,
                symbolSize: 15,
                itemStyle: {
                    color: '#c84038'
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

const may4thSpots = {
    'tiananmen': {
        name: '天安门广场',
        image: '../images/tiananmen.jpg',
        description: '天安门广场位于北京市中心，是世界上最大的城市广场。1919年5月4日，数千名学生在这里集会，抗议巴黎和会将山东权益转让给日本。',
        sentiment: {
            positive: 92,
            tags: ['庄严肃穆', '历史厚重', '交通便利', '值得一去']
        },
        amap: {
            position: [116.397428, 39.90923]
        }
    },
    'caofang': {
        name: '北大红楼',
        image: '../images/honglou.jpg',
        description: '北大红楼是北京大学的旧址，也是新文化运动的中心。五四运动期间，这里是爱国学生的主要活动场所。',
        sentiment: {
            positive: 90,
            tags: ['文化底蕴', '红色记忆', '教育意义']
        },
        amap: {
            position: [116.403874, 39.915168]
        }
    },
    'zhaojialou': {
        name: '赵家楼',
        image: '../images/zhaojialou.jpg',
        description: '赵家楼是五四运动期间学生游行的重要地点。1919年5月4日，学生在这里火烧赵家楼，成为五四运动的高潮。',
        sentiment: {
            positive: 85,
            tags: ['历史见证', '爱国精神', '值得铭记']
        },
        amap: {
            position: [116.4187, 39.9072]
        }
    },
    'xian': {
        name: '东交民巷',
        image: '../images/dongjiaomin.jpg',
        description: '东交民巷是北京的使馆区。五四运动期间，学生游行到这里抗议帝国主义的侵略行为。',
        sentiment: {
            positive: 88,
            tags: ['历史遗迹', '欧式建筑', '独特风貌']
        },
        amap: {
            position: [116.4013, 39.9056]
        }
    }
};

function getSpotData(spotId) {
    return may4thSpots[spotId] || null;
}
