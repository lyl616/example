//初始化地图的控制
//颜色配置

var windydataVal = '',
    mapType = 'ditu', //用来标识卫星和地图切换的时候颜色的判断
    windyfg = false, //风场开关:true 关，false 开
    markers = null,
    map_grade = "country", //country 全国  city  城市
    markers = null,
    overlayFlag = 0, //叠加标识，0为城市叠加，1为站点叠加
    dateHour, //请求时间
    polutionType = "aqi", //获取请求污染物类型(aqi、pm25,pm10,so2,no2,co,o3)，默认为aqi
    mapFlag = 0, //地图标识，0为google地图（默认），1为百度地图
    mapZoom = 5, //地图初始化级别
    isAddStation = true; //是否叠加站点/城市点

//用于保存所有城市/站点信息
var station_data = {
    country: {
        "no2": null,
        "pm25": null,
        "pm10": null,
        "o3": null,
        "aqi": null,
        "co": null,
        "so2": null
    },
    city: {
        "no2": null,
        "pm25": null,
        "pm10": null,
        "o3": null,
        "aqi": null,
        "co": null,
        "so2": null
    }
};

var palettes = {
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    light: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
    black: ['#7B94DC', '#778FD6', '#728AD0', '#6D85C9', '#6980C3', '#647BBD', '#5F76B6', '#5A71B0', '#566CAA']
}
var topLeft = L.latLng(52.388343, 67.810317), //设置左上角经纬度
    bottomRight = L.latLng(20.098867, 140.797959), //设置右下点经纬度
    bounds = L.latLngBounds(topLeft, bottomRight); //构建视图限制范围
var map = L.map('leaflet-map-canvas', {
    center: [37.088752, 110.1260082],
    zoom: 5,
    minZoom: 3,
    maxBounds: bounds
});
var windMapLayer = L.CanvasLayer.extend({
    render: function () {
    }
});
var layer_formap = new windMapLayer();
var element = document.getElementById('leaflet-map-canvas');
var windMap = new WindMap({
    canvas: layer_formap.getCanvas(),
    extent: function () {
        var bounds = map.getBounds();
        return {
            width: element.clientWidth,
            height: element.clientHeight,
            latlng: [
                [bounds._southWest.lng, bounds._southWest.lat],
                [bounds._northEast.lng, bounds._northEast.lat]
            ]
        };
    }
});

/**
 * 页面初始化加载
 */
$(function () {
    var initMapUrl = 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}';
    initMap(map, initMapUrl);
    initWebPage.initAll();
    var dateNow = new Date();
    dateHour = hourDecre(getCurDateDay(dateNow), 1);

    addStationMarkers();
    createWindMap(map, palettes.black); //创建wind 风向图

    //添加地图开始缩放事件
    L.DomEvent.addListener(map, 'zoomstart', function (e) {
        clearMarkers();
    });
    //添加地图缩放线束事件
    L.DomEvent.addListener(map, 'zoomend', function (e) {
        var zoom = map.getZoom(); //获取地图的缩放级别
        mapZoom = zoom;
        if (mapZoom <= 7) {
            map_grade = "country";
            overlayFlag = 0;
        } else {
            map_grade = "city";
            overlayFlag = 1;
        }
        if (isAddStation) {
            addStationMarkers();
        } else {
            clearMarkers();
        }
    });

});

/**
 * 叠加城市/站点信息
 */
function addStationMarkers() {
    clearMarkers();


    $.ajax({
        type: "GET",
        url: "data/country-city-co.json",
        dataType: "json",
        success: function (data) {
            if (data.erroCode == 2000) {
                var list = data.result;
                station_data[map_grade][polutionType] = list;
                markers = new L.FeatureGroup();
                for (var i = 0; i < list.length; i++) {
                    var station = list[i];
                    var mk = createMarker(station);
                    markers.addLayer(mk);
                }
                map.addLayer(markers);
            }
        }
    });

    // ajax_post_msg("../data/country-city-co.json", '', "加载", function (data) {
    //
    //     if (data.erroCode == 2000) {
    //         var list = data.result;
    //         station_data[map_grade][polutionType] = list;
    //         markers = new L.FeatureGroup();
    //         for (var i = 0; i < list.length; i++) {
    //             var station = list[i];
    //             var mk = createMarker(station);
    //             markers.addLayer(mk);
    //         }
    //         map.addLayer(markers);
    //     }
    // })
}

function iconByName(station, map_grade, level, mapZoom) {
    if (level == "-1" || level.indexOf("-") != -1) {
        level = 0;
    }
    var iconSize = map_grade == "country" ? 'iconSize20' : 'iconSize30',
        iconUrl = '../images/country/' + map_grade + level + '.png',
        html = '';
    if (mapZoom <= 5) {
        html = '<b class="iconSize ' + iconSize + '" style="background-image: url(' + iconUrl + ');"><div class="tooltip_country_name">' + station.name + '<span></span></div></b></div>'
    } else {
        iconSize = 'iconSize30',
            iconUrl = '../images/country/city' + level + '.png';
        var defaultWidth = 16,
            marginLeft = 0;
        if (station.value == null) {
            station.value = '-';
        }
        var calcWidth = defaultWidth * (station.name.length),
            calcLeft = -(((station.name.length / 2 - 1) * defaultWidth) - 6);
        html = '<div class="marker_container">' +
            '<b class="iconSize ' + iconSize + '" style="background-image: url(' + iconUrl + ');">' + station.value + '</b>' +
            '<div class="marker_tip" style="width:' + calcWidth + 'px; margin-left:' + calcLeft + 'px">' + station.name + '</div></div>';
    }
    return html;
}

var xAxis, no2_lst,
    pm25_lst,
    pm10_lst,
    o3_lst,
    aqi_lst,
    co_lst,
    so2_lst;

function popWindowset(station, map_grade) {
    layer.open({
        skin: 'leafletLay-popup-contianer',
        type: 1,
        title: false, //不显示标题栏
        closeBtn: true,
        area: ['620px', '500px'],
        shade: 0.3,
        id: 'LAY_layuipro', //设定一个id，防止重复弹出
        resize: false,
        btnAlign: 'c',
        moveType: 1, //拖拽模式，0或者1
        content: '<div class="leaflet-popup-content"><div class="loading_popup_msg">加载中...</div></div>',
        success: function (layero) {
            // console.log("点击成功按钮执行的事件！");
        }
    });
    var stationId = station.id,
        cityCode = station.id,
        insTime = station.insTime;
    if (map_grade == "country") {
        stationId = "-1";
        cityCode = station.id
    } else {
        stationId = station.id;
        cityCode = "-1";
    }
    var pop_url = $.ctx + '/realtimePC/getPriStationData';
    var param = {
        stationId: stationId,
        cityCode: cityCode,
        insTime: insTime,
        total: 72
    };
    $.ajax({
        type: 'POST',
        url: pop_url,
        dataType: 'json',
        data: param,
        success: function (data) {
            if (data.erroCode == 2000) {
                var station_city_fg = true,
                    html = '';
                html = restStatiion_html(data.result.topic);
                $('.leaflet-popup-content').html(html);
                var detail = data.result.detail;
                xAxis = detail.insTime;
                no2_lst = detail.no2;
                pm25_lst = detail.pm25;
                pm10_lst = detail.pm10;
                o3_lst = detail.o3;
                aqi_lst = detail.aqi;
                co_lst = detail.co;
                so2_lst = detail.so2;

                hourlyChartFun(xAxis, aqi_lst, 'AQI'); //加载浓度曲线
                particulateChartFun(xAxis, pm10_lst, pm25_lst, aqi_lst); //加载颗粒物曲线
                gaseousChartFun(xAxis, co_lst, no2_lst, so2_lst, o3_lst, aqi_lst); //加载气曲线
            } else {
                $('.loading_popup_msg').html("暂无数据！");
            }
        }
    });

}

function createMarker(station) {
    var myIcon = L.divIcon({
        className: 'icon-resize',
        html: iconByName(station, map_grade, station.level + "", mapZoom)
    });
    var mk = L.marker([station.lat, station.lng], {
        icon: myIcon,
        keepInView: false,
        riseOnHover: true
    }).on('click', function () {
        popWindowset(station, map_grade);
    });
    return mk;
}

function clearMarkers() {
    if (markers != null) {
        map.removeLayer(markers);
        markers = null;
    }
}

// 初始化地图
function initMap(map, url) { //地图的版权信息
    L.tileLayer(url, {
        zoom: 11,
        //attribution: '版权所有&copy;leaflef技术支持 ',
        maxZoom: 18
    }).addTo(map);
    layer_formap.addTo(map);
}

/**
 * 叠加风场
 * @param map
 * @param windycolor
 */
function judge_windyShowHide() { //判断风场是否开启，风场在卫星图和地图的情况下显示的颜色
    if (windyfg) {
        windMap.stop();
    } else {
        if (mapType == 'ditu') {
            windMap.stop().start({
                data: windydataVal,
                colorScheme: palettes.black //风向为蓝色
            });
        } else {
            windMap.stop().start({
                data: windydataVal,
                colorScheme: palettes.light //风向为白色
            });
        }
    }
}

function createWindMap(map, windycolor) {
    var yearV, monthV, dayV, hourV;

    function getTimeVal() {
        var date = new Date();
        yearV = date.getFullYear();
        monthV = date.getMonth() + 1;
        dayV = date.getDate();
        hourV = date.getHours() - 1;
        monthV = (monthV < 10) ? '0' + monthV : monthV;
        dayV = (dayV < 10) ? '0' + dayV : dayV;
        hourV = (hourV < 10) ? '0' + hourV : hourV;
    }

    ['bounds_changed', 'movestart', 'move'].forEach(function (listener) { //当地土缩放的时候重新绘制风向图
        map.on(listener, function () {
            judge_windyShowHide();
        });
    });
    getTimeVal();
    timeval = yearV + '' + monthV + "" + dayV + '' + hourV;
    var mapDataUrl = 'https://raw.githubusercontent.com/dannycochran/windable/master/data/2016040900_700.json'
    // var mapDataUrl = 'data/2017072700-china-ugrd-vgrd.json';
    // var mapDataUrl = 'http://58.83.189.155/' + yearV + '/' + monthV + '/' + dayV + '/wind/' + timeval + '-w-0p25-10m.json';
    d3.json(mapDataUrl, function (err, windData) {
        windydataVal = windData;
        windMap.update({
            particleFadeOpacity: 0.97, //值越小,风从屏幕上消失的越快.
            velocityScale: 1 / 200000, // 风速的量 (值越小速度越低).
            particleWidth: 0.5, // 风速线config宽.
            particleReduction: 0.1, // 风速每秒减少的帧数
            data: windData,
            colorScheme: windycolor //风向的颜色设置
        });
    });
}

function getnumber(value) { //获取数字
    var num = value.replace(/[^0-9]/ig, "");
    return num;
}

function getletter(value) { //获取字母
    var letter = value.replace(/[^a-z]+/ig, "");
    return letter;
}

function other_click_hide() {
    $(document).bind('click', function (e) {
        var e = e || window.event; //浏览器兼容性
        var elem = e.target || e.srcElement;
        while (elem) { //循环判断至跟节点，防止点击的是div子元素
            if (elem.id && elem.id == 'pollution_type') {
                return;
            }
            elem = elem.parentNode;
        }
        $('.select_down').hide(); //点击的不是div或其子元素
    });
}

function selectdown_click(obj) {

    var selVle = obj.id,
        num_pollution = getnumber(selVle),
        str_pollution = getletter(selVle);
    if (num_pollution == 25) {
        num_pollution = 2.5;
    }
    var html = str_pollution.toUpperCase() + "<sub>" + num_pollution + "</sub>  ";
    $('#pollution_val').html(html);

    var imgurl = '../resources/img/legend/wm-legend-' + selVle + '.png';
    $('#img_polltype').prop('src', imgurl);
    $('.select_down').hide();
    clearMarkers();
    polutionType = selVle;
    if (isAddStation) {
        addStationMarkers();
    }

}
//////////////////////添加左下角菜单///////////////////////
var initWebPage = {
    initLegend: function () {
        var legend = L.control({
            position: 'bottomright'
        });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML = '<img id="img_polltype" src="../images/legend/wm-legend-aqi.png" />';
            return div;
        };
        legend.addTo(map);
    },

    InitRightMenu: function () {
        function toggleMenuClass(id) {
            var obj = document.getElementById(id),
                firstNode = obj.parentNode.firstChild;
            var flag = false;
            if (obj.className.indexOf('white') != -1) {
                obj.className = "btn_div bg_gray";
                firstNode.className += '_hide';
                flag = true;
            } else {
                obj.className = "btn_div bg_white";
                firstNode.className = firstNode.className.substr(0, firstNode.className.length - 5);
                flag = false
            }
            return flag;
        }

        function windy_cut(id) { //相关风场的操作
            windyfg = toggleMenuClass(id);
            judge_windyShowHide();
        }

        function station_cut(id) { //相关站点的操作
            var fg = toggleMenuClass(id);
            if (fg) {
                clearMarkers();
                isAddStation = false;
            } else {
                isAddStation = true;
            }
            if (isAddStation) {
                addStationMarkers();
            }
        }

        function pollution_cut(value) {
            other_click_hide();
            //相关站点的操作
            $('.select_down').show();
            $('.select_down div').removeClass('active');
            var nlue = value.toLowerCase();
            nlue = nlue.trim();
            if (nlue == 'pm2.5') {
                nlue = 'pm25';
            }
            $('.select_down div' + '#' + nlue).addClass('active');
        }

        L.control.custom({
            position: 'bottomleft',
            content: '<div class="menu_btn"><i class="menu_icon menu_wrw_hide"></i>' +
            '<div class="btn_div bg_gray" id="pollution_type"><span id="pollution_val">AQI</span><i class="icon_react"></i></div>' +
            '<div class="select_down" id="select_down">' +
            '<div id="aqi" class="select_down-selector" onclick="selectdown_click(this)">AQI</div>' +
            '<div id="pm25" class="select_down-selector" onclick="selectdown_click(this)">PM<sub>2.5</sub></div>' +
            '<div id="pm10" class="select_down-selector" onclick="selectdown_click(this)">PM<sub>10</sub></div>' +
            '<div id="so2" class="select_down-selector" onclick="selectdown_click(this)">SO<sub>2</sub></div>' +
            '<div id="no2" class="select_down-selector" onclick="selectdown_click(this)">NO<sub>2</sub></div>' +
            '<div id="co" class="select_down-selector" onclick="selectdown_click(this)">CO</div>' +
            '<div id="o3" class="select_down-selector" onclick="selectdown_click(this)">O<sub>3</sub></div>' +
            '</div>' +
            '</div>' +
            '<div class="menu_btn"><i class="menu_icon menu_zd"></i>' +
            '<div class="btn_div bg_white" id="station_info">站点</div>' +
            '</div>' +
            '<div class="menu_btn"><i class="menu_icon menu_wry_hide"></i>' +
            '<div class="btn_div bg_gray" id="pollution_source">污染源</div>' +
            '<div class="tip_msg">该功能即将上线</div>' +
            '</div>' +
            '<div class="menu_btn"><i class="menu_icon menu_fc"></i>' +
            '<div class="btn_div bg_white" id="windy_field">风场</div>' +
            '</div>' +
            '<div class="menu_btn"><i class="menu_icon menu_cz_hide"></i>' +
            '<div class="btn_div bg_gray" id="d_value">差值图</div>' +
            '<div class="tip_msg">该功能即将上线</div>' +
            '</div>',
            classes: 'btn-group-menuView',
            id: 'btn-group-menuView',
            events: {
                click: function (data) {
                    $('.select_down').hide();
                    $('.tip_msg').hide();
                    if (data.target.id == 'pollution_source') { //污染源
                        data.target.nextSibling.style.display = 'block';
                    } else if (data.target.id == 'd_value') { //差值
                        data.target.nextSibling.style.display = 'block';
                    } else if (data.target.id == 'pollution_type' || data.target.id == 'pollution_val' || data.target.className == 'icon_react' || data.target.tagName == 'SUB') { //污染物
                        var lue = $('#pollution_val').text();
                        pollution_cut(lue);
                    } else if (data.target.id == 'windy_field') { //风场
                        windy_cut(data.target.id);
                    } else if (data.target.id == 'station_info') { //站点
                        station_cut(data.target.id);
                    }
                }
            }
        }).addTo(map);
    },
    initRightTopNav: function () {
        function toggleNavClass(id) {
            var fg = false;
            var obj = document.getElementById(id),
                firstNode = obj.firstChild;
            obj.className = "active nav_btn";
            if (firstNode.className.indexOf('hide') != -1) {
                firstNode.className = firstNode.className.substr(0, firstNode.className.length - 5);
                fg = true;
            } else {
                firstNode.className += '_hide';
            }
            return fg;
        }

        function clearNavBtnClass() {
            var objParentNode = document.getElementsByClassName('nav_btn');
            for (var j = 0; j < objParentNode.length; j++) {
                var hasClass = objParentNode[j].className;
                if (hasClass.indexOf('active') != -1) {
                    objParentNode[j].className = "nav_btn";
                }
            }
            var obj = document.getElementsByClassName('nav_icon');
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].className.indexOf('hide') == -1) {
                    obj[i].className += '_hide';
                }
            }
        }

        function showbtnTooltip(id, fg) {
            var obj = document.getElementById(id);
            var a = obj.lastChild;
            if (fg) {
                a.style.display = 'block';
            } else {
                a.style.display = 'none';
            }
        }

        L.control.custom({
            position: 'topright',
            content: '<button type="button" class="nav_btn active" id="nav-map"><i class="nav_icon icon_dt"></i><b>地图</b>' +
            '    <i class="nav-sline"></i>' +
            '</button>' +
            '<button type="button" class="nav_btn" id="nav-moons"><i class="nav_icon icon_wx_hide"></i><b>卫星</b>' +
            '    <i class="nav-sline"></i>' +
            '</button>' +
            '<button type="button" class="nav_btn" id="nav-range"><i class="nav_icon icon_cj_hide"></i><b>测距</b>' +
            '    <i class="nav-sline"></i>' +
            '    <div class="btn-tooltip">该功能即将上线</div>' +
            '</button>' +
            '<button type="button" class="nav_btn" id="nav-screenshot"><i class="nav_icon icon_jt_hide"></i><b>截图</b>' +
            '    <div class="btn-tooltip">该功能即将上线</div>' +
            '</button>',
            classes: 'btn-group-vertical info',
            events: {
                click: function (data) {
                    if (data.target.parentNode.id == 'nav-map') {
                        clearNavBtnClass();
                        var fg = toggleNavClass('nav-map');
                        if (fg) {
                            mapType = 'ditu';
                            judge_windyShowHide();
                            initMap(map, "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}");
                            ///////////////隐藏tooltip弹窗提示信息/////////////////////
                            showbtnTooltip('nav-screenshot', 0);
                            showbtnTooltip('nav-range', 0);
                        }
                    } else if (data.target.parentNode.id == 'nav-moons') {
                        mapType = 'weixing';
                        clearNavBtnClass();
                        var fg = toggleNavClass('nav-moons');
                        if (fg) {
                            judge_windyShowHide();
                            initMap(map, "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}");
                            ///////////////隐藏tooltip弹窗提示信息/////////////////////
                            showbtnTooltip('nav-screenshot', 0);
                            showbtnTooltip('nav-range', 0);
                        }
                    } else if (data.target.parentNode.id == 'nav-range') {
                        showbtnTooltip('nav-range', 1);
                        showbtnTooltip('nav-screenshot', 0);
                    } else if (data.target.parentNode.id == 'nav-screenshot') {
                        showbtnTooltip('nav-screenshot', 1);
                        showbtnTooltip('nav-range', 0);
                    }
                },
                contextmenu: function (data) {
                    //console.log('右键菜单');
                }
            }
        })
            .addTo(map);
    },
    initLeftTopSearch: function () {
        function button2_click() {
            alert('button 2 clicked !!!');
        }

        var searchboxControl = createSearchboxControl();
        var control = new searchboxControl({
            sidebarTitleText: 'Header'
        });

        control._searchfunctionCallBack = function (searchkeywords) {
            if (!searchkeywords) {
                searchkeywords = "The search call back is clicked !!"
            }
            alert(searchkeywords);
        }

        map.addControl(control);
    },
    initAll: function () {
        this.initLegend(); //初始化图例
        this.InitRightMenu(); //添加左下角菜单
        this.initRightTopNav(); //添加右上角菜单
        this.initLeftTopSearch(); //添加左上角搜索内容
    }
}

////////////////////卫星和地图的切换////////////////////////
function restStatiion_html(data) {

    var level = data.level + '';
    if (level == "-1" || level.indexOf("-") != -1) {
        level = "--";
    } else {
        level = level + "级";
    }

    var aqiFirst = data.aqiFirst + "";
    if (aqiFirst.indexOf("-") == -1) {
        var num_pollution = getnumber(aqiFirst),
            str_pollution = getletter(aqiFirst);

        if (num_pollution == 25) {
            num_pollution = 2.5;
        }
        aqiFirst = str_pollution.toUpperCase() + '<sub>' + num_pollution + '</sub>';
    }
    var html = '';
    html += '<div class="pop_st_baseinfo" style="width:600px;">';
    html += '	<div class=\'pop_st_tit\'>';
    if (map_grade == "country") {
        html += data.proName + '        ' + data.cityName;
    } else {
        html += data.proName + '		' + data.cityName + '		' + data.stationType + '        ' + data.stationName + '    【' + data.stationId + '】';
    }
    html += '	</div>';
    html += '<div class="pop_st_baseinfo" style="width:600px;">';
    html += '	<ol class="pop_st_ol">';
    html += '		<li>空气质量等级：' + data.grade + '</li>';
    html += '		<li>空气质量级别： ' + level + '</li>';
    html += '		<li>首要污染物：' + aqiFirst + '</li>';
    html += '		<li class="text-right">最后时间：' + data.insTime + '</li>';
    html += '	</ol>';
    html += '	<table cellpadding="0" cellspacing="0" class="pop_st_table">';
    html += '		<tr class="even">';
    html += '			<td>AQI</td>';
    html += '			<td>PM<sub>2.5</sub></td>';
    html += '			<td>PM<sub>10</sub></td>';
    html += '			<td>SO<sub>2</sub></td>';
    html += '			<td>NO<sub>2</sub></td>';
    html += '			<td>CO</td>';
    html += '			<td>O<sub>3</sub></td>';
    html += '			<td>温度</td>';
    html += '			<td>湿度</td>';
    html += '			<td>风力</td>';
    html += '			<td>风向</td>';
    html += '			<td>气压</td>';
    html += '		</tr>';
    html += '		<tr class="odd">';
    html += '			<td>' + data.aqi + '</td>';
    html += '			<td>' + data.pm25 + '</td>';
    html += '			<td>' + data.pm10 + '</td>';
    html += '			<td>' + data.so2 + '</td>';
    html += '			<td>' + data.no2 + '</td>';
    html += '			<td>' + data.co + '</td>';
    html += '			<td>' + data.o3 + '</td>';
    html += '			<td>' + data.temperature + '</td>';
    html += '			<td>' + data.humidity + '</td>';
    html += '			<td>' + data.windPowerValue + '</td>';
    html += '			<td>' + data.windDirection + '</td>';
    html += '			<td>' + data.pressure + '</td>';
    html += '		</tr>';
    html += '	</table>';
    html += '	<div class="pop_st_echarts">';
    html += '		近72小时浓度曲线（小时数据）';
    html += '		<div class="pull-right" >';
    html += '           <select id="pollution_type_char"  onchange="changeChar()">';
    html += '               <option value="aqi" selected>AQI</option>';
    html += '               <option value="pm25">PM2.5</option>';
    html += '               <option value="pm10">PM10</option>';
    html += '               <option value="co">CO</option>';
    html += '               <option value="so2">SO2</option>';
    html += '               <option value="o3">O3</option>';
    html += '               <option value="no2">NO2</option>';
    html += '           </select>';
    html += '			<button  class="btn btn-xs btn-default m-l-10 bf08a" onclick="showEcharts(1,this,\'hourlyChart\')">浓度</button>';
    html += '			<button class="btn btn-xs btn-default" onclick="showEcharts(2,this,\'particulateChart\')">颗粒物</button>';
    html += '			<button class="btn btn-xs btn-default" onclick="showEcharts(3,this,\'gaseousChart\')">气体</button>';
    html += '		</div>';
    html += '	</div>';
    html += '	<div class="pop_st_echarts_detail">';
    html += '		<div id="hourlyChart" class="positionAbs opacity1 zindex1" style="width: 600px; height: 300px;"></div>';
    html += '		<div id="particulateChart" class="positionAbs opacity0 zindex0" style="width: 600px; height: 300px;"></div>';
    html += '		<div id="gaseousChart" class="positionAbs opacity0 zindex0" style="width: 600px; height: 300px;"></div>';
    html += '	</div>';
    html += '</div>';
    return html;
}

function changeChar() {
    var p_type = $("#pollution_type_char").val();
    var obj = getShowData(p_type);
    hourlyChartFun(xAxis, obj[0], obj[1]); //加载浓度曲线
}

function getShowData(p_type) {
    switch (p_type) {
        case 'aqi':
            return [aqi_lst, "AQI"]
        case 'pm25':
            return [pm25_lst, "PM25"]
        case 'pm10':
            return [pm10_lst, "PM10"]
        case 'co':
            return [co_lst, "CO"]
        case 'so2':
            return [so2_lst, "SO2"]
        case 'o3':
            return [o3_lst, "O3"]
        case 'no2':
            return [no2_lst, "NO2"]

    }
}