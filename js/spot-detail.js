document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initNavigation();
    initScrollAnimations();
    initSpotDetail();
});

function initSpotDetail() {
    const params = new URLSearchParams(window.location.search);
    const spotId = params.get('id');
    const from = params.get('from') || 'index';
    
    let spotData = null;
    
    if (from === 'may4th' && typeof getSpotData === 'function') {
        spotData = getSpotData(spotId);
    } else if (from === 'dec9th' && typeof getSpotData === 'function') {
        spotData = getSpotData(spotId);
    } else {
        spotData = getGeneralSpotData(spotId);
    }
    
    if (spotData) {
        displaySpotData(spotData);
        if (spotData.amap && spotData.amap.position) {
            initAmap(spotData.amap.position);
        }
    }
}

function getGeneralSpotData(spotId) {
    const generalSpots = {
        'tiananmen-gate': {
            name: '天安门',
            image: '../images/tiananmen.jpg',
            description: '天安门坐落在中华人民共和国首都北京市的中心、故宫的南端，与天安门广场以及人民英雄纪念碑、毛主席纪念堂、人民大会堂、中国国家博物馆隔长安街相望，占地面积4800平方米，以杰出的建筑艺术和特殊的政治地位为世人所瞩目。',
            sentiment: {
                positive: 95,
                tags: ['庄严肃穆', '历史厚重', '必去之地', '交通便利']
            },
            amap: {
                position: [116.397428, 39.908744]
            }
        },
        'guobo': {
            name: '中国国家博物馆',
            image: '../images/guobo.jpg',
            description: '中国国家博物馆位于北京市中心天安门广场东侧，东长安街南侧，与人民大会堂东西相对称，是历史与艺术并重，集收藏、展览、研究、考古、公共教育、文化交流于一体的综合性博物馆。',
            sentiment: {
                positive: 93,
                tags: ['馆藏丰富', '免费参观', '文化殿堂', '增长知识']
            },
            amap: {
                position: [116.400593, 39.905958]
            }
        },
        'renmin': {
            name: '人民大会堂',
            image: '../images/renmin.jpg',
            description: '人民大会堂坐落在北京市中心天安门广场西侧，西长安街南侧。是中国全国人民代表大会开会的地方，是全国人民代表大会常务委员会的办公场所。',
            sentiment: {
                positive: 91,
                tags: ['建筑宏伟', '政治象征', '庄严大气', '值得一看']
            },
            amap: {
                position: [116.393865, 39.906884]
            }
        }
    };
    return generalSpots[spotId] || null;
}

function displaySpotData(data) {
    document.getElementById('spot-name').textContent = data.name;
    document.getElementById('spot-description').textContent = data.description;
    document.getElementById('spot-image').src = data.image;
    document.getElementById('spot-image').onerror = function() {
        this.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23c84038%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22160%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22>' + data.name + '</text></svg>';
    };
    
    document.getElementById('score-number').textContent = data.sentiment.positive;
    
    const sentimentTagsContainer = document.getElementById('sentiment-tags');
    sentimentTagsContainer.innerHTML = '';
    data.sentiment.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'sentiment-tag';
        tagEl.textContent = tag;
        sentimentTagsContainer.appendChild(tagEl);
    });
}

function initAmap(position) {
    if (typeof AMap !== 'undefined') {
        const map = new AMap.Map('spot-map', {
            zoom: 15,
            center: position
        });
        
        const marker = new AMap.Marker({
            position: position,
            title: '景点位置'
        });
        map.add(marker);
    } else {
        const mapContainer = document.getElementById('spot-map');
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666;">
                <p>请配置高德地图API Key以查看地图</p>
                <p style="font-size: 0.9em; margin-top: 10px;">位置: ${position[0]}, ${position[1]}</p>
            </div>
        `;
    }
}
