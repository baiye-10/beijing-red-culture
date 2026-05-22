document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initNavigation();
    initScrollAnimations();
});

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.summary-card, .dimension, .map-container, .yixiang-content, .manyou-cards, .xingzou-grid');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initAmap(apiKey, containerId, locations) {
    if (!window.AMap) {
        console.error('高德地图API未加载');
        return;
    }
    
    const map = new AMap.Map(containerId, {
        zoom: 12,
        center: [116.397428, 39.90923],
        mapStyle: 'amap://styles/light'
    });
    
    locations.forEach(loc => {
        const marker = new AMap.Marker({
            position: loc.position,
            title: loc.name,
            clickable: true
        });
        
        marker.on('click', function() {
            const infoWindow = new AMap.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h3 style="margin: 0 0 8px 0;">${loc.name}</h3>
                        ${loc.description ? `<p style="margin: 0;">${loc.description}</p>` : ''}
                    </div>
                `
            });
            infoWindow.open(map, loc.position);
        });
        
        map.add(marker);
    });
    
    if (locations.length > 1) {
        const path = locations.map(loc => loc.position);
        const polyline = new AMap.Polyline({
            path: path,
            borderWeight: 2,
            strokeColor: '#c84038',
            lineJoin: 'round'
        });
        map.add(polyline);
        
        map.setFitView();
    }
}

function initEChartsMap(containerId, geoData, routeData) {
    const chartDom = document.getElementById(containerId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: routeData.title,
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
        geo: {
            map: 'beijing',
            roam: true,
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
                name: '路线',
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
                    width: 2,
                    opacity: 0.6,
                    curveness: 0.2
                },
                data: routeData.lines
            },
            {
                name: '景点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: routeData.points,
                symbolSize: 15,
                itemStyle: {
                    color: '#c84038'
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    position: 'right'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', function() {
        chart.resize();
    });
    
    return chart;
}

function showSpotDetail(spotId) {
    const spotData = getSpotData(spotId);
    if (spotData) {
        const modal = document.createElement('div');
        modal.className = 'spot-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeSpotDetail()"></div>
            <div class="modal-content">
                <span class="modal-close" onclick="closeSpotDetail()">&times;</span>
                <h2>${spotData.name}</h2>
                <div class="modal-image">
                    <img src="${spotData.image}" alt="${spotData.name}">
                </div>
                <div class="modal-info">
                    <div class="info-section">
                        <h3>介绍</h3>
                        <p>${spotData.description}</p>
                    </div>
                    ${spotData.sentiment ? `
                    <div class="info-section">
                        <h3>游客评价分析</h3>
                        <div class="sentiment-bar">
                            <div class="sentiment-positive" style="width: ${spotData.sentiment.positive}%">
                                正面 ${spotData.sentiment.positive}%
                            </div>
                        </div>
                        <div class="sentiment-tags">
                            ${spotData.sentiment.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                    ${spotData.amap ? `
                    <div class="info-section">
                        <h3>位置</h3>
                        <div id="spot-map-${spotId}" style="height: 300px;"></div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        if (spotData.amap) {
            setTimeout(() => {
                initAmap('your-api-key', `spot-map-${spotId}`, [{
                    position: spotData.amap.position,
                    name: spotData.name,
                    description: spotData.description
                }]);
            }, 300);
        }
    }
}

function closeSpotDetail() {
    const modal = document.querySelector('.spot-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function getSpotData(spotId) {
    const spots = {
        'tiananmen': {
            name: '天安门广场',
            image: 'images/tiananmen.jpg',
            description: '天安门广场位于北京市中心，是世界上最大的城市广场。这里是新中国成立的见证，也是许多重要历史事件的发生地。',
            sentiment: {
                positive: 92,
                tags: ['庄严肃穆', '历史厚重', '交通便利', '值得一去']
            },
            amap: {
                position: [116.397428, 39.90923]
            }
        },
        'may4th': {
            name: '五四运动纪念馆',
            image: 'images/may4th.jpg',
            description: '纪念1919年五四运动的重要场所，展示了那段爱国运动的历史资料。',
            sentiment: {
                positive: 88,
                tags: ['教育意义', '历史回顾', '免费参观']
            },
            amap: {
                position: [116.403874, 39.915168]
            }
        }
    };
    
    return spots[spotId] || null;
}

const spotModalStyles = document.createElement('style');
spotModalStyles.textContent = `
.spot-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.spot-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
}

.modal-content {
    position: relative;
    background: white;
    max-width: 800px;
    margin: 3rem auto;
    border-radius: 1rem;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
    transform: translateY(30px);
    transition: transform 0.3s ease;
}

.spot-modal.active .modal-content {
    transform: translateY(0);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    z-index: 10;
}

.modal-content h2 {
    font-family: 'Noto Serif SC', serif;
    padding: 2rem 2rem 1rem;
    color: #2c3e50;
}

.modal-image img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.modal-info {
    padding: 2rem;
}

.info-section {
    margin-bottom: 2rem;
}

.info-section h3 {
    font-family: 'Noto Serif SC', serif;
    font-size: 1.25rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #c84038;
}

.sentiment-bar {
    background: #f0f0f0;
    border-radius: 1rem;
    overflow: hidden;
    height: 2rem;
    margin-bottom: 1rem;
}

.sentiment-positive {
    background: linear-gradient(90deg, #c84038, #d4af37);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
}

.sentiment-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tag {
    background: #faf7f0;
    color: #2c3e50;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
}
`;
document.head.appendChild(spotModalStyles);
