/**
 * ﻿//设置全局变量
 * @type {null}
 */
var map = null;
var heatmapOverlay;
var t = 500;

// 全局数据对象 污染物浓度数据
var aqiData;
var aqi2Data;
var pm25Data;
var pm10Data;
var coData;
var so2Data;
var o3Data;
var no2Data;

var tempData;
var humData;
var windPowerData;
var windDirectData;
var pressData;

var rankDataForSortTemp = null; // 用于排序使用的临时对象
// end
var currentPolutionType = "pm25";
var currentSort = "asc";

var sTechType = "-1"; //默认过滤条件

/////////////////////////
var currentSortWZ01 = "WZ01"; //微站top 排序的
var currentSortKH01 = "KH01"; //考核top 排序的
var currentSortYC01 = "YC01"; //扬尘top  排序的
var currentSortWZ24 = "WZ24"; //微站top 排序的
var currentSortKH24 = "KH24"; //考核top 排序的
var currentSortYC24 = "YC24"; //扬尘top  排序的
var currentSortPos = currentSortWZ01; //初始默认值为微站
var currentSortTop10Data = null;
/////////////////////////////

var POLUTION_TYPE_AQI = 'aqi';
var POLUTION_TYPE_AQI2 = 'aqi2';
var POLUTION_TYPE_PM25 = 'pm25';
var POLUTION_TYPE_PM10 = 'pm10';
var POLUTION_TYPE_CO = 'co';
var POLUTION_TYPE_SO2 = 'so2';
var POLUTION_TYPE_O3 = 'o3';
var POLUTION_TYPE_NO2 = 'no2';

var RANKINGLIST_ASC = "asc"; // 从小到大
var RANKINGLIST_DESC = "desc"; // 从大到小

var RANKINGLIST_ALL = "ALL";
var RANKINGLIST_G = "G";
var RANKINGLIST_LOST = "LOST";
var RANKINGLIST_WZ = "WZ";
var RANKINGLIST_BG = "BG";
var RANKINGLIST_OTHER = "OTHER";

var currentRankingListType = RANKINGLIST_WZ;

// 框选全局变量
var slt_overlays = []; // 框选 选择的自定义marker
var slt_stations_name = []; // 选择所有的站点名称
var slt_stations_id = []; // 选择所有的站点ID
var slt_stations_data = []; // 选择所有的站点浓度数据
var slt_time_data = []; // 时间数据

var showMapType = "distribution" // 显示地图类型 默认分布图
var showMapType_distribution = "distribution";
var showMapType_hots = "hots";


$(function () {

    Geo.init();

    Geo.btns();
    // 左上导航 菜单点击事件开始
    switchTab($("#polutionTab b"));
    switchRankingList($("#rankingFilter div"));
    //initWarnMsg();//暂时注释掉  by tanlin at 20170526
    initTopTableStyle();
    initPollutions();

    /////////top10 点击后的展开与伸缩////////
    $(".updown-toggle").click(function () {
        $(".top-copyleft").slideToggle(function () {
            $(".updown-toggle").text($(this).is(":visible") ? "点击收起TOP10" : "点击展开TOP10");
        }); //slideToggle 垂直方向切换  ，toggle，左右方向上切换
    });

});
var cityId = "";
var Geo = {
    init: function () {
        $("#city").val(CommonUtil.getCookie("cityId"));
        $("#province").val(CommonUtil.getCookie("provinceId"));
        $("#mapCenter").val(decodeURI(CommonUtil.getCookie("cityName")));
        $("#divCityName").text(decodeURI(CommonUtil.getCookie("cityName")));

        cityId = $("#city").val();

        var userId = CommonUtil.getCookie("userId");
        if (!userId) {
            //默认济宁用户
            CommonUtil.setCookie("userId", "2c9280dc5b12d305015b18aa7a570047", "/");
        }

        if (undefined == cityId || cityId == '') {
            $("#city").val(370800);
            $("#province").val(370000);
            $("#mapCenter").val('济宁市');
            $("#divCityName").text('济宁市');
        }
        initMap();

        init_station_type(function () {
            _after_map_init();
            clkNowTab(); //top10
        });

        initDistrict(cityId);

        initDraw();
        initDistanceTool(); // 初始化测距

    },
    ditu: function () {
        map.setMapType(BMAP_NORMAL_MAP);
    },
    weixing: function () {
        map.setMapType(BMAP_SATELLITE_MAP);
    },
    hotmap: function () {
        showMapType = showMapType_hots;
        changeData(currentPolutionType, RANKINGLIST_ALL, RANKINGLIST_ASC);
    },
    distribution: function () {
        showMapType = showMapType_distribution;
        if (heatmapOverlay) {
            map.removeOverlay(heatmapOverlay);
        }
        var data = getDataByPolutionType(currentPolutionType, currentRankingListType);
        addData2Marker(data);
    },
    btns: function () {
        $("#ditu").click(function () {
            Geo.ditu();
        });

        $("#btn-hotmap").click(function () {
            Geo.hotmap();
        });
        $("#btn-distribution").click(function () {
            Geo.distribution();
        });

        // 切换浓度曲线
        $('#polutionSelect').on('change', function () {
            var polutionType = $('#polutionSelect').val();
            showChart(polutionType);
        });

        // 测距点击事件
        $("#click_distance").click(function () {
            if (wwDis) {
                wwDis.open();
            }
        });

        /**
         * 小手显示 关闭所有工具
         */

        $("#click_hander").click(function () {
            drawingManager.close();
            wwDis.close();
        });

        // 获取行政区
        $('#district1').change(function () {
            requestRealData();
        });
        // 站点类别
        $('#district2').change(function () {
            requestRealData();
        });

        // 站点搜索
        $("#searchBtn").click(function () {
            var value = $("#search_content").val();
            showStationInfo(value);
        });

    }

};

/**
 * 初始化告警数据
 */
function initWarnMsg() {
    var cityId = $("#city").val();
    getWarnMsg(cityId);
    window.setInterval(function () {
        getWarnMsg(cityId);
    }, 5000000);
}

var initialize_point;

function initMap() {
    var mapCenter = $("#mapCenter").val();
    // 初始化请求
    if (null == map) {
        map = new BMap.Map("WMMAP", {
            minZoom: 10,
            maxZoom: 18,
            enableMapClick: false
        });
        map.setMapType(BMAP_SATELLITE_MAP);
        areaMap($("#city").val());
    }
    var NavigationControl = new BMap.NavigationControl({
        offset: new BMap.Size(70, 600),
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
    });
    map.addControl(NavigationControl);

    // var bottom_left_control = new BMap.NavigationControl();// 左下角，添加比例尺
    // map.addControl(bottom_left_control);
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(mapCenter, function (point) {
        if (point) {
            initialize_point = point;
            map.centerAndZoom(initialize_point, 12);
            map.enableScrollWheelZoom(); // 允许滚轮缩放
        } else {
            layer.msg("您选择地址没有解析到结果!");
        }
    }, mapCenter);
    // 初始化请求
    // setTimeout(function() {
    // 	if(_is_exits_function(_after_map_init)) {
    // 		_after_map_init(map);
    // 	}
    // }, 600);
}

var heatmapOverlay;

var switchCity = function (a) {
    a.click(function () {
        var cityName = $("#cityList span").text();
        // changeData(currentPolutionType,RANKINGLIST_ALL,RANKINGLIST_ASC);
    });
}

/**
 * 框选+搜索+汇总
 */
function initDraw() {
    var options = {
        renderOptions: {
            map: map,
            selectFirstResult: false
        },
        onSearchComplete: function (results) {
            /*
             * $('#slt_tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) { });
             */
            $('#slt_tabs a[href="#pollution"]').tab('show');
            $("#concentration_charts").empty();
            initDataCharts(results);
            //getAirData();
            localSearch.clearResults();
            openDrawAndInitTab(results);
        }
    };
    localSearch = new BMap.LocalSearch(map, options);
    localSearch.disableAutoViewport();
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: false, // 是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_LEFT, // 位置
            offset: new BMap.Size(570, 5), // 偏离值
            scale: 0.8, // 工具栏缩放比例
            drawingModes: [BMAP_DRAWING_RECTANGLE]
        }
    });
    drawingManager.addEventListener('rectanglecomplete', function (e, d_overlay) {
        slt_stations_name = [];
        slt_stations_id = [];
        d_overlay.hide();
        drawingManager.close();
        slt_overlays = [];
        var overlays = map.getOverlays();
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            if (d_overlay.containPoint(overlay.point)) {
                slt_overlays.push(overlay);
                if (overlay.obj) {
                    slt_stations_name.push(overlay.obj.stationName);
                    slt_stations_id.push(overlay.obj.stationId + "@" + overlay.obj.stationName + "@" + overlay.obj.stationType);
                }
            }
        }
        if (slt_overlays.length > 10) {
            layer.msg("请选择10个站点以内！");
            return;
        }
        var myKeys = ["餐馆", "加油站", "电厂", "钢厂", "汽车站"];
        localSearch.searchInBounds(myKeys, d_overlay.getBounds());
    });
}

// 初始化污染源列表
function openDrawAndInitTab(results) {
    var data = [];
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i].getCurrentNumPois(); j++) {
            var r = results[i].getPoi(j);
            data.push({
                "title": r.title,
                "address": r.address,
                "keyword": results[i].keyword,
                "lng": r.point.lng,
                "lat": r.point.lat
            });
        }
    }
    $('#rectangle_tab').DataTable({
        data: data,
        "bAutoWidth": false, // 是否自适应宽度
        "lengthMenu": [10],
        "destroy": true,
        "retrieve": false,
        "searching": true, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": true, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": 'ftp',
        columns: [{
            "title": "名称",
            "data": "title",
            "width": "34%"
        }, {
            "title": "地址",
            "data": "address",
            "width": "40%"
        }, {
            "title": "类别",
            "data": "keyword",
            "width": "10%"
        }, {
            "title": "经度",
            "data": "lng",
            "width": "10%"
        }, {
            "title": "纬度",
            "data": "lat",
            "width": "10%"
        }]
    });
    $("#rectangleWin").modal('show');
}

/**
 * 初始化数据图
 *
 * @param results
 */
function initDataCharts(results) {
    $.ajax({
        type: "POST",
        url: $.coreApiPath + "/realtime/getStationsData",
        data: {
            stationIds: slt_stations_id,
            type: currentPolutionType
        },
        datatype: "json",
        success: function (data) {
            if (null != data && data != 'null')
                concentration(data);
        },
        error: function () {
        }
    });
}

/**
 * 初始化温度湿度和风力风向
 *
 * @param type
 */
function getAirData(type) {
    var city = $("#city").val();
    $.ajax({
        type: "POST",
        url: $.coreApiPath + "/realtime/getAirData",
        data: {
            city: city,
            type: type
        },
        datatype: "json",
        success: function (data) {
            initAirCharts(data);
        },
        error: function () {
        }
    });
}

/**
 * 浓度曲线
 */
function concentration(data) {
    var concentrationChart = echarts.init(document.getElementById('concentration_charts'));
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: slt_stations_name,
            itemWidth: 120,
            itemHeight: 70
        },
        axisLabel: {
            margin: 20
        },
        toolbox: {
            itemSize: 50,
            right: "1%",
            show: true,
            showTitle: false,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        grid: {
            left: '1%',
            right: '90px',
            top: '150px',
            bottom: '100px',
            containLabel: true
        },
        xAxis: {
            data: data.xAxis
        },
        yAxis: {},
        series: data.series
    };
    setLineFontSize(option, 40);
    concentrationChart.setOption(option, true, false);
}

// 加载天气图表数据
function initAirCharts(data) {
    $("#temperate_charts").empty();
    $("#humidity_charts").empty();
    $("#wind_charts").empty();
    tempHumidityCharts(data);
    windCharts(data);
}

// 温度-湿度 曲线
function tempHumidityCharts(data) {
    var temperateChart = echarts.init(document.getElementById('temp_humidity_charts'));
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        title: {},
        legend: {
            data: ['温度', '湿度']
        },
        xAxis: {
            data: data.xAxis
        },
        yAxis: [{
            name: '温度',
            type: 'value'
        }, {
            name: '湿度',
            type: 'value'
        }],
        series: data.tempHumiditySerie
    };
    temperateChart.setOption(option);
}

// 风力
function windCharts(data) {
    var windChart = echarts.init(document.getElementById('wind_charts'));
    var option = {
        tooltip: {},
        legend: {},
        xAxis: {
            data: data.xAxis
        },
        yAxis: {
            type: 'value'
        },
        series: data.windSerie
    };
    windChart.setOption(option);
}

function _is_exits_function(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch (e) {
    }
    return false;
}

function _after_map_init() {
    requestRealData();
}

function clkMapType() {
    var type = $("#weixing").attr("data");
    if (type == '1') {
        Geo.weixing();
        $("#weixing").removeClass("wxpic");
        $("#weixing").addClass("mappic");
        $("#weixing").attr("data", "0");
    } else {
        Geo.ditu();
        $("#weixing").removeClass("mappic");
        $("#weixing").addClass("wxpic");
        $("#weixing").attr("data", "1");
    }
}

// 左上导航 菜单点击事件
function switchTab(a) {
    a.click(function (event) {
        event.stopPropagation();
        var fg = true;
        $("#polutionTab b").removeClass("btn-info");
        $(this).addClass("btn-info");
        currentPolutionType = this.id;
        var PolutionTypeStr = currentPolutionType.toUpperCase(),
            Polutionvalnum = PolutionTypeStr.replace(/[^0-9]/ig, ""),
            pollutionV = PolutionTypeStr.replace(/\d+/g, '');
        if (Polutionvalnum == "25") {
            Polutionvalnum = "2.5";
        }
        if (pollutionV == "VOCS") {
            pollutionV = "TVOC";
            clkWZ();
            fg = false;
        }

        var polutiontiphtm = pollutionV + '<sub>' + Polutionvalnum + '</sub>';
        $("#polutionLabel").html(polutiontiphtm);
        if ("aqi2" == currentPolutionType) {
            $("#polutionLabel").html("AQI");
        }
        else if ("aqi" == currentPolutionType) {
            $("#polutionLabel").html("标准AQI");
        }
        var lendType = currentPolutionType == "aqi2" ? "aqi" : currentPolutionType;
        var src = "../resources/img/legend/legend-" + lendType + ".png";
        $(".Legend img").attr("src", src);

        if (fg) {
            var is_now_24 = $("#is_now_24").val();
            if (is_now_24 == "aqi_24") {
                get24HourTP10AqiData(top_station_type);
            } else if (is_now_24 == "aqi_now") {
                getNowHourTP10AqiData(top_station_type);
            }
            // _TIMMER.Refresh();
            changeData(currentPolutionType, currentRankingListType, RANKINGLIST_ASC);
        }
    });


    // a.click(function () {
    //     $("#polutionTab a").removeClass("btn-info");
    //     $(this).addClass("btn-info");
    //     currentPolutionType = this.id;
    //     var PolutionTypeStr = currentPolutionType.toUpperCase(),
    //         Polutionvalnum = PolutionTypeStr.replace(/[^0-9]/ig, ""),
    //         pollutionV = PolutionTypeStr.replace(/\d+/g, '');
    //     if (Polutionvalnum == "25") {
    //         Polutionvalnum = "2.5";
    //     }
    //
    //     var polutiontiphtm = pollutionV + '<sub>' + Polutionvalnum + '</sub>';
    //     $("#polutionLabel").html(polutiontiphtm);
    //
    //     if ("aqi2" == currentPolutionType) {
    //         $("#polutionLabel").html("AQI");
    //     } else if ("aqi" == currentPolutionType) {
    //         $("#polutionLabel").html("标准AQI");
    //     }
    //
    //     var lendType = currentPolutionType == "aqi2" ? "aqi" : currentPolutionType;
    //     var src = "../resources/img/legend/legend-" + lendType + ".png";
    //     $(".Legend img").attr("src", src);
    //
    //     var is_now_24 = $("#is_now_24").val();
    //     if (is_now_24 == "aqi_24") {
    //         get24HourTP10AqiData(top_station_type);
    //     } else if (is_now_24 == "aqi_now") {
    //         getNowHourTP10AqiData(top_station_type);
    //     }
    //
    //     // _TIMMER.Refresh();
    //     changeData(currentPolutionType, currentRankingListType, RANKINGLIST_ASC);
    //
    // });
}

// 改变数据
var changeData = function (polutionType, currentRankingListType, sort) {
    map.closeInfoWindow();
    if (showMapType == showMapType_distribution) {
        var data = getDataByPolutionType(polutionType, currentRankingListType);
        // 改变站点点位信息
        addData2Marker(data);
        // 根据实时数据创建排行榜
        genRankList(data, sort);
        rankDataForSortTemp = data;
    } else if (showMapType == showMapType_hots) {
        map.clearOverlays();
        heatmapOverlay = new BMapLib.HeatmapOverlay({
            radius: 30,
            maxOpacity: .6,
            minOpacity: 0,
            blur: .80
        });
        var cp_data = getDataByPolutionType(currentPolutionType, currentRankingListType);
        var heatmapData = [];
        $.each(cp_data, function (index, data) {
            heatmapData.push({
                "lng": data.lng,
                "lat": data.lat,
                "count": data.value
            })
        });
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({
            data: heatmapData,
            max: 100
        });
    }
};

var getDataByPolutionType = function (polutionType, rankingType) {
    if (polutionType == POLUTION_TYPE_AQI) {
        return filterData(aqiData, rankingType, polutionType);
    } else if (polutionType == POLUTION_TYPE_AQI2) {
        return filterData(aqi2Data, rankingType, polutionType);
    } else if (polutionType == POLUTION_TYPE_PM25) {
        return filterData(pm25Data, rankingType, polutionType);
    } else if (polutionType == POLUTION_TYPE_PM10) {
        return filterData(pm10Data, rankingType, polutionType);
    } else if (polutionType == POLUTION_TYPE_CO) {
        return filterData(coData, rankingType);
    } else if (polutionType == POLUTION_TYPE_SO2) {
        return filterData(so2Data, rankingType);
    } else if (polutionType == POLUTION_TYPE_O3) {
        return filterData(o3Data, rankingType);
    } else if (polutionType == POLUTION_TYPE_NO2) {
        return filterData(no2Data, rankingType);
    } else if (polutionType == POLUTION_TYPE_VOCS) {
        return filterData(vocsData, rankingType);
    }
    return null;
}
// 获取AQIPM25数据只需要排除扬尘站点
var getAqiPm25 = function (dataArr) {
    var data = new Array();
    for (var i = 0; dataArr != null && i < dataArr.length; i++) {
        if (dataArr[i].stechType != 101) {
            data.push(dataArr[i]);
        }
    }
    return data;
}
// 获取气态数据，只有多主分才有气态数据 国控，市控省控有其他数据
var getGas = function (dataArr) {
    var data = new Array();
    for (var i = 0; dataArr != null && i < dataArr.length; i++) {
        if ((dataArr[i].stechType == 6010 || dataArr[i].stechType == 99 || dataArr[i].stechType == 98) && dataArr[i].stechType != 101) {
            data.push(dataArr[i]);
        }
    }
    return data;
}
// 多组分，国控，市控，省控，扬尘站都有pm10数据
var getPm10 = function (dataArr) {
    var data = new Array();
    for (var i = 0; dataArr != null && i < dataArr.length; i++) {
        // stechType=99时为国控点，dataArr[i].stechType>2000为临时使用，作为判断6组分设备的依据
        if (dataArr[i].stechType == 6010 || dataArr[i].stechType == 99 || dataArr[i].stechType == 98 || dataArr[i].stechType == 101) {
            data.push(dataArr[i]);
        }
    }
    return data;
}
//判断所有类别站点有哪些
function isAllItem(data, polutionType) {
    if (data.monitorTime != null &&
        (((data.stechType == 1010 || data.stechType == 6010) && $("#WZ").length > 0) ||
            (data.stechType == 99 && $("#G").length > 0) ||
            (data.stechType == 98 && $("#BG").length > 0) ||
            ((data.stechType == 101 && polutionType == POLUTION_TYPE_PM10) && $("#OTHER").length > 0)
        )) {
        return true;
    }
    return false;
}

var filterData = function (dataArr, rankingType, polutionType) {
    var data = new Array();
    // 根据S-TECH-Type过滤掉一部分数据，aqi和排名25显示全部分数据，气态的只显示6组分站点数据
    if (polutionType == POLUTION_TYPE_AQI2 || polutionType == POLUTION_TYPE_AQI || polutionType == POLUTION_TYPE_PM25) {
        data = getAqiPm25(dataArr);
    } else if (polutionType == POLUTION_TYPE_PM10) {
        // POLUTION_TYPE 为PM10时需要加上扬尘站点，其他浓度时需要去掉扬尘站点
        data = getPm10(dataArr);
    } else {
        data = getGas(dataArr);
    }
    var objectList = new Array();
    if (rankingType == RANKINGLIST_ALL) {
        // objectList = data;
        for (var i = 0; i < data.length; i++) {
            //if(data[i].monitorTime != '' && data[i].monitorTime != null && data[i].stechType != 99) { //排除国控与考核重复数据
            if (isAllItem(data[i], polutionType)) {
                objectList.push(data[i]);
            }
        }
    } else if (rankingType == RANKINGLIST_LOST) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].monitorTime == null || data[i].monitorTime == '') {
                objectList.push(data[i]);
            }
        }
    } else if (rankingType == RANKINGLIST_WZ) { // 微站
        for (var i = 0; i < data.length; i++) {
            if (data[i].monitorTime != null && (data[i].stechType == 1010 || data[i].stechType == 6010)) {
                objectList.push(data[i]);
            }
        }
    } else if (rankingType == RANKINGLIST_G) { // 国控站
        for (var i = 0; data != null && i < data.length; i++) {
            if (data[i].monitorTime != null && data[i].stechType == 99) {
                objectList.push(data[i]);
            }
        }
    } else if (rankingType == RANKINGLIST_BG) {
        for (var i = 0; data != null && i < data.length; i++) { // 济宁考核大站
            if (data[i].monitorTime != null && data[i].stechType == 98) {
                objectList.push(data[i]);
            }
        }
    } else if (rankingType == RANKINGLIST_OTHER) {
        for (var i = 0; data != null && i < data.length; i++) { // 堆场
            if (polutionType == POLUTION_TYPE_PM10 && (data[i].monitorTime != null && data[i].stechType == 101)) {
                objectList.push(data[i]);
            }
        }
    }
    return objectList;
}

function rankingFilterClick(obj) {
    var t = $("#rankingFilter div");
    for (var i = 0; i < t.length; i++) {
        t[i].className = '';
    }
    $(obj).addClass("active");
    currentRankingListType = $(obj).prop("id");
    //改变站点类别下拉菜单
    init_station_type(function () {
        requestRealData(); //从后台获取数据
    });
    // changeData(currentPolutionType, currentRankingListType, RANKINGLIST_ASC);
}

function switchRankingList(a) {
    a.click(function () {
        var t = $("#rankingFilter div");
        for (var i = 0; i < t.length; i++) {
            t[i].className = '';
        }
        $(this).addClass("active");
        currentRankingListType = $(this).prop("id");

        if (currentRankingListType == RANKINGLIST_WZ) { // 微站
            clkWZ();
        } else if (currentRankingListType == RANKINGLIST_BG) {
            clkKH();
        } else if (currentRankingListType == RANKINGLIST_OTHER) {
            clkYC();
        } else {
            //改变站点类别下拉菜单
            init_station_type(function () {
                requestRealData(); //从后台获取数据
            });
        }
    });

    // a.click(function () {
    //     var t = document.getElementById("rankingFilter").getElementsByTagName("div");
    //     for (var i = 0; i < t.length; i++) {
    //         t[i].className = '';
    //     }
    //     $(this).addClass("active");
    //     currentRankingListType = $(this).prop("id");
    //
    //     if (currentRankingListType == RANKINGLIST_WZ) { // 微站
    //         clkWZ();
    //     } else if (currentRankingListType == RANKINGLIST_BG) {
    //         clkKH();
    //     } else if (currentRankingListType == RANKINGLIST_OTHER) {
    //         clkYC();
    //     } else {
    //         init_station_type(function () {
    //             requestRealData(); //从后台获取数据
    //         });
    //     }
    // });
}

// ///////////////////////地图操作开始
function setAYlineList(station_hour_data) {
    var pm10DList = [],
        pm25DList = [],
        coDList = [],
        no2DList = [],
        so2DList = [],
        o3DList = [],
        aqiDlist = [],
        timeDlist = [],
        label_list = [];
    for (var i in station_hour_data) {
        for (var j in station_hour_data[i]) {
            if (station_hour_data[i][j] == 0) {
                station_hour_data[i][j] = '';
            }
            switch (j) {
                case 'gridTime': {
                    station_hour_data[i][j] = FormatDate(station_hour_data[i][j]);
                    timeDlist.push(station_hour_data[i][j]);
                }
                    break;
                case 'pm10': {
                    pm10DList.push(station_hour_data[i][j]);
                }
                    break;
                case 'pm25': {
                    pm25DList.push(station_hour_data[i][j]);
                }
                    break;
                case 'co': {
                    coDList.push(station_hour_data[i][j]);
                }
                    break;
                case 'no2': {
                    no2DList.push(station_hour_data[i][j]);
                }
                    break;
                case 'so2': {
                    so2DList.push(station_hour_data[i][j]);
                }
                    break;
                case 'o3': {
                    o3DList.push(station_hour_data[i][j]);
                }
                    break;
                case 'aqi': {
                    aqiDlist.push(station_hour_data[i][j]);
                }
                    break;
            }
        }
    }
    //倒序数据源
    timeDlist = perArr(timeDlist);
    pm10DList = perArr(pm10DList);
    pm25DList = perArr(pm25DList);
    aqiDlist = perArr(aqiDlist);
    coDList = perArr(coDList);
    no2DList = perArr(no2DList);
    so2DList = perArr(so2DList);
    o3DList = perArr(o3DList);
    particulateChartFun(timeDlist, pm10DList, pm25DList, aqiDlist); //颗粒物曲线绘制
    gaseousChartFun(timeDlist, coDList, no2DList, so2DList, o3DList, aqiDlist); //气态曲线绘制
}

/**
 * 地图上插入点位信息，的站点信息
 *
 * @param data插入前先清除原来存在
 */
function addData2Marker(data) {
    _clear_map_markers();
    if (data != null) {
        $.each(data, function (n, sub_data) {
            if (sub_data.lat != null && sub_data.lng != null) {
                _add_map_markers(sub_data, function (e) {
                    var target = e.currentTarget;
                    var obj_data = target.obj;
                    var stationType = obj_data.stationType;
                    request_station_data(obj_data.stationId, stationType, obj_data.stechType, obj_data.addr);
                    $("#polutionSelect").val(currentPolutionType);
                    //$("#popupWin").draggable();//为模态对话框添加拖拽

                    var self = currentPolutionType;
                    if (currentPolutionType == 'vocs') {
                        self = 'tvoc';
                    }
                    var opts = {};
                    opts.objID = "polutionSelect";
                    opts.type = "9";
                    opts.parentID = "";
                    opts.cityID = $("#city").val();
                    opts.proID = $("#province").val();
                    opts.isAll = false;
                    opts.selected = self;
                    opts.callBack = null;
                    opts.selected = currentPolutionType;
                    realtime_select_option(opts);

                    $("#popupWin").modal("show");
                });
            }
        });
    }
}

function realtime_select_option(opts) { //更改select的option 选项值，并将pm2.5改为pm25
    var id = opts.objID;
    var type = opts.type;
    var city = opts.cityID;
    var hideAQI = opts.hideAQI;
    var pro = opts.proID;
    var isAll = opts.isAll;
    var callBack = opts.callBack;
    var url = $.coreApiPath + "/dictionary/diviceType";
    var param = {
        type: type,
        city: city,
        pro: pro
    };
    opts.selected = opts.selected.toUpperCase();
    opts.selected = (opts.selected == 'TVOC') ? "tvoc" : opts.selected;
    var opt = document.getElementById(id);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            if (isAll) {
                opt.options.add(new Option("全部", "-1_1"));
            }
            for (var i = 0; i < data.length; i++) {

                var text = data[i].name;
                var value = data[i].code;
                var y = document.createElement('option');
                y.text = text;
                y.value = value;

                if (opts.selected == text) {
                    y.selected = true;
                }
                opt.options.add(y);

            }
            if (callBack != null) {
                callBack(data);
            }
            $("#polutionSelect").find("option[value='" + opts.selected.toLowerCase() + "']").attr("selected", true);
        });
    }
}

// 添加标识(每个站点一个标识)
var markers = [];

function _add_map_markers(data, onclickFunc) {
    // 创建地图标注
    var icon_path,
        markIcon,
        size = 180,
        City_icon_url = '',
        icon_path = "../resources/img/cityimage/";
    switch (city) {
        case '370800':
        case '510100': {
            City_icon_url = city;
        }
            break;
        default: {
            City_icon_url = "default";
        }
            break;
    }
    icon_path += City_icon_url + "/";
    if (data.stationType == '99' || data.stechType == '99') {
        icon_path += "mark_sprite_gk_" + data.baseLevel + ".png";
        size = size + size * 0.4;
    } else if (data.stationType == '98' && data.stechType == '98') {
        icon_path += "mark_sprite_sk_" + data.baseLevel + ".png";
        size = size + size * 0.2;
    } else if (data.stationType == '97' || data.stechType == '97') {
        icon_path += "mark_sprite_s_" + data.baseLevel + ".png";
    } else if (data.stationType == '101') {
        icon_path += "mark_sprite_yc_" + data.baseLevel + ".png";
    } else if (data.stationType < 90 && data.stechType == 1010) {
        icon_path += "mark_sprite_d_" + data.baseLevel + ".png";
    } else if (data.stationType < 90 && data.stechType == 6010) {
        icon_path += "mark_sprite_six_" + data.baseLevel + ".png";
    }

    markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
        imageSize: new BMap.Size(size, size)
    });

    var point = new BMap.Point(data.lng, data.lat);
    var marker = new BMap.Marker(point, {
        icon: markIcon
    }); // 创建标注
    marker.obj = data;

    var stationId = data.stationId;
    marker.onclick = onclickFunc;
    marker.title = stationId;
    // 将标注添加到地图中
    map.addOverlay(marker);
    var flicker = isFlicker(stationId);
    if (flicker)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    markers.push(marker);
}

//top10 节点需要跳动
function isFlicker(stationId) {
    if (currentSortTop10Data != null && currentSortTop10Data.length > 0) {
        var length = currentSortTop10Data.length;
        for (var i = 0; i < length; i++) {
            var currentStationId = currentSortTop10Data[i].stationId;
            if (stationId == currentStationId) {
                return true;
            }
        }
    }
    return false;
}

// clear markers
function _clear_map_markers() {
    $.each(markers, function (n, marker) {
        map.removeOverlay(marker);
    });
}

// 判断浏览区是否支持canvas
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function openStationWin(lat, lng, stationId) {
    var info = initInfowindow(stationId);
    var point = new BMap.Point(lng, lat);
    map.openInfoWindow(info, point);
}

function initInfowindow(content) {
    content = '<font size=45>' + content + '<font>';
    var infowindow = new BMap.InfoWindow(content, {
        enableAutoPan: true, // 自动平移
        disableAutoPan: true,
        enableMessage: false,
        enableCloseOnClick: true,
        enableMessage: true,
        width: 220 * 4, // 信息窗口宽度
        height: 60 * 4 // 信息窗口高度
    });
    return infowindow;
}

// //////////////////地图操作结束
var minuteHourDataToggle = 'HOUR';

function getTypeData(datatype, _this) {
    minuteHourDataToggle = datatype;
    $("#title_top .btn-xxl").removeClass("btn-info");
    $("#title_top .btn-xxl").addClass("btn-white");
    $(_this).removeClass("btn-white");
    $(_this).addClass("btn-info");
    if (minuteHourDataToggle == 'MINUTE') {
        $("#minuteHoutText").text('分钟数据');
    } else {
        $("#minuteHoutText").text('小时数据');
    }
    requestRealData();
}

function requestRealData() {
    var reqURL = $.coreApiPath + "/realtimePC/realtimeData",
        province = $("#province").val(),
        city = $("#city").val(),
        district = $("#district1").val(),
        stationTypeTemp = $("#district2").val(),
        dateType = minuteHourDataToggle;

    var stationType = stationTypeTemp.split("_")[0];
    $.ajax({
        url: reqURL,
        async: true, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
        type: "POST",
        dataType: "json",
        data: {
            polutionType: currentPolutionType,
            province: province,
            city: city,
            district: district,
            stationType: stationType,
            sTechType: sTechType,
            dateType: dateType
        },
        success: function (data) {
            aqiData = data.dataListAqi;
            aqi2Data = data.dataListAqi2;
            pm25Data = data.dataListPm25;
            pm10Data = data.dataListPm10;
            coData = data.dataListCo;
            so2Data = data.dataListSo2;
            o3Data = data.dataListO3;
            no2Data = data.dataListNo2;
            vocsData = data.dataListVocs;
            tempData = data.dataListTemperatureOut;
            humData = data.dataListHumidityOut;
            windPowerData = data.dataListWindPower;
            windDirectData = data.dataListWindDirection;
            pressData = data.dataListPressure;

            var cityAqiData = data.cityAqiData;
            // 创建城市AQI信息
            genCityAqiInfo(cityAqiData);
            // 改变数据
            changeData(currentPolutionType, currentRankingListType, currentSort)
        }
    });
}


var station_hour_data = {};
var levelTextArr = ["暂未运行", "优", "良", "轻度污染", "中度污染", "重度污染", "严重污染", "异常数据"];
var aqiFirstTextArr = ['PM<span class="f-s-8">2.5</span>', 'PM<span class="f-s-8">10</span>', 'CO', 'SO<span class="f-s-8">2</span>', 'O<span class="f-s-8">3</span>', 'NO<span class="f-s-8">2</span>'];
var setPollutionbg = '';

function request_station_data(stationId, stationType, stechType, addr) {
    // 从实时数据对象中直接获取指定站点信息
    var dataAqi = getDataById(stationId, aqiData);
    var dataAqi2 = getDataById(stationId, aqi2Data);
    var dataPm25 = getDataById(stationId, pm25Data);
    var dataPm10 = getDataById(stationId, pm10Data);
    var dataCo = getDataById(stationId, coData);
    var dataSo2 = getDataById(stationId, so2Data);
    var dataO3 = getDataById(stationId, o3Data);
    var dataNo2 = getDataById(stationId, no2Data);

    var dataTemp = getDataById(stationId, tempData);
    var dataHum = getDataById(stationId, humData);
    var dataWindPower = getDataById(stationId, windPowerData);
    var dataWindDirect = getDataById(stationId, windDirectData);
    var dataPress = getDataById(stationId, pressData);

    var pm25 = dataPm25.value == null ? "-" : dataPm25.value;
    var pm10 = dataPm10.value == null ? "-" : dataPm10.value;
    var co = dataCo.value == null ? "-" : dataCo.value;
    var so2 = dataSo2.value == null ? "-" : dataSo2.value;
    var o3 = dataO3.value == null ? "-" : dataO3.value;
    var no2 = dataNo2.value == null ? "-" : dataNo2.value;

    if (stechType != 1010) {
        pm25 = dataPm25.value < 0 ? "0" : dataPm25.value;
        pm10 = dataPm10.value < 0 ? "0" : dataPm10.value;
        co = dataCo.value < 0 ? "0" : dataCo.value;
        so2 = dataSo2.value < null ? "0" : dataSo2.value;
        o3 = dataO3.value < null ? "0" : dataO3.value;
        no2 = dataNo2.value < null ? "0" : dataNo2.value;
    } else {
        pm10 = co = so2 = o3 = no2 = '-';
    }
    var temp = dataTemp.value == null ? "-" : dataTemp.value + "℃";
    var hum = dataHum.value == null ? "-" : dataHum.value + "%";
    var windPower = dataWindPower.value == null ? "-" : dataWindPower.value;
    var windDirect = dataWindDirect.value == null ? "-" : dataWindDirect.value;
    var press = dataPress.value == null ? "-" : dataPress.value + "Pa";

    var level = '-';
    var levelText = '-';
    var aqi = '-';
    var aqiFirst = '-';
    var stationName = dataPm25.stationName;
    var monitorTime = dataPm25.monitorTime;
    var aqiDataHour, validComment, validCommentRt;
    if (stationType == '99' || stationType == '98' || stationType == '97') {
        aqiDataHour = {
            aqi: dataPm25.aqi,
            level: dataPm25.aqiLevel,
            polution: dataPm25.aqiFirst,
            aqiFirstNew: dataPm25.aqiFirstNew
        };
    } else {
        aqiDataHour = getAqiInfo(stationId);
    }

    if (aqiDataHour != null && aqiDataHour != '' && aqiDataHour.aqi != 0) {
        // aqiFirst = aqiFirstTextArr[aqiDataHour.polution - 1];

        aqiFirst = replaceSubscript(aqiDataHour.aqiFirstNew);

        levelText = levelTextArr[aqiDataHour.level];

        if (!levelText) {
            levelText = '--';
        }
        level = aqiDataHour.level + "级";
        if (!aqiDataHour.level) {
            level = '--';
        }
        if (aqiDataHour.level == 1) {
            aqiFirst = '--';
        }
        aqi = aqiDataHour.aqi;
        validComment = aqiDataHour.validComment;
        validCommentRt = aqiDataHour.validCommentRt;
    }
    var dataTypeFlag = ""; // [分钟数据]
    // 采集时间为空的记录，整个信息都为没有查找到数据
    if (monitorTime == null || (typeof(monitorTime) == 'undefined')) {
        monitorTime = '-';
        stationName = stationName + "(暂无实时数据)";
    } else {

        stationName = dataPm25.stationName;
        // $("#divStationName1").html(stationName);

        // $("#monitorTimeText").text(monitorTime + dataTypeFlag);
        if (minuteHourDataToggle == 'HOUR') {
            dataTypeFlag = new Date(monitorTime).Format("yyyy年MM月dd日 HH时");
        } else if (minuteHourDataToggle == 'MINUTE') {
            dataTypeFlag = new Date(monitorTime).Format("yyyy年MM月dd日 HH时mm分");
        }

    }

    $("#divStationName1").html(stationName);
    stationDetailTitle("divStationName2", stationId);
    $("#PolutionTimeAdd").text(dataTypeFlag);
    $("#tdPm25").text(pm25);
    $("#tdPm10").text(pm10);
    if (co % 1 == 0) {
        co = co + '.0';
    }
    $("#tdCo").text(co);
    $("#tdSo2").text(so2);
    $("#tdO3").text(o3);
    $("#tdNo2").text(no2);

    $("#tdTemp").text(temp);
    $("#tdHum").text(hum);
    $("#tdWindPower").text(windPower);
    $("#tdWindDirect").text(windDirect);
    $("#tdPress").text(press);
    var bgColor = '00E500';
    if (levelText == '重度污染') {
        bgColor = '9A004C';
    } else if (levelText == '中度污染') {
        bgColor = 'ff0000';
    } else if (levelText == '优') {
        bgColor = '00E500';
    } else if (levelText == '良') {
        bgColor = 'FFFF00';
    } else if (levelText == '轻度污染') {
        bgColor = 'FF7E00';
    } else if (levelText == '严重污染') {
        bgColor = '7F0022';
    }
    setPollutionbg = bgColor;
    var scrrenW = document.body.clientWidth,
        dimension = 100;

    if (scrrenW >= 2000) {
        dimension = 400;
    }
    var levelHtml = '<div id="myStat" data-dimension="' + dimension + '" data-text="" data-info="' + levelText + '" data-width="30" data-fontsize="12" data-percent="100" data-fgcolor="#' + bgColor + '" data-bgcolor="#eee" data-type="half"></div>';
    $("#divPolutionLevelText").css("opacity", '0.5');
    $("#divPolutionLevelText").html(levelHtml);

    $('#myStat').circliful(); // 让椭圆进度条动起来

    // $("#divPolutionLevelText").text(levelText);// 污染物级别（中度污染）
    $("#divFirstPolution").text("").append(aqiFirst); // 首要污染物 PM<span class="f-s-8">2.5</span>
    // $("#divAqi").text(aqi); // 空气质量指数 999

    if (validComment != undefined && validComment != null && validComment != "" && minuteHourDataToggle == 'HOUR' && currentRankingListType == RANKINGLIST_WZ) {
        var divAqihtml = "<span  onmouseover=\"showT('" + validComment + "',this)\" onmouseout=\"hideTip()\"  class=\"difcolorb\">" + aqi + "*</span>";
        $("#divAqi").html(divAqihtml);
    } else {
        $("#divAqi").html(aqi);
    }

    $("#divAqiLevel").text(level); // 空气质量级别 二级

    var url = $.coreApiPath + "/realtime/getStationData";
    var postData = {
        stationId: stationId,
        stationType: stationType,
        cityCode: $("#city").val()
    };
    ajax(url, postData, function (data) {
        station_hour_data = data;
        setAYlineList(station_hour_data); //调用初始化曲线
        showChart(currentPolutionType);
    });

}


function replaceSubscript(firstAqi) {
    var aqiFirstTextArr = ['<span class="f-s-8">2.5</span>', '<span class="f-s-8">10</span>', 'SO<span class="f-s-8">2</span>', 'O<span class="f-s-8">3</span>', 'NO<span class="f-s-8">2</span>'];
    var rtnFirstAqi = firstAqi.replace("25", aqiFirstTextArr[0])
        .replace("10", aqiFirstTextArr[1])
        .replace("SO2", aqiFirstTextArr[2])
        .replace("O3", aqiFirstTextArr[3])
        .replace("NO2", aqiFirstTextArr[4])
    return rtnFirstAqi;
}

/**
 * 获取AQI数据，如果stationId==null?则查询整个城市的AQI信息，否则查询当前端站AQI信息
 *
 * @param stationId
 */
function getAqiInfo(stationId) {
    var province = $("#province").val();
    var city = $("#city").val();
    var aqiData = null;

    var reqURL = $.coreApiPath + "/realtimePC/stationAqiData";
    $.ajax({
        type: "POST",
        url: reqURL,
        async: false,
        data: {
            domainId: city,
            stationId: stationId
        },
        datatype: "json",
        // 成功返回之后调用的函数
        success: function (data) {
            aqiData = data;
        },
        error: function () {
            aqiData = null;
        }
    });
    return aqiData;
}

/**
 * 获取国控AQI数据
 */
function getPriAqiInfo(pm25, pm10, co, so2, o3, no2) {
    var reqURL = "../realtime/priStationAqiData";
    var aqiData;
    $.ajax({
        type: "POST",
        url: reqURL,
        async: false,
        data: {
            pm25: pm25,
            pm10: pm10,
            co: co,
            so2: so2,
            o3: o3,
            no2: no2
        },
        datatype: "json",
        // 成功返回之后调用的函数
        success: function (data) {
            aqiData = data;
        },
        error: function () {
            aqiData = null;
        }
    });
    return aqiData;
}

/**
 * 整个城市的AQI数据
 *
 * @param cityAqiData
 */
function genCityAqiInfo(cityAqiData) {
    var cityAqiFirst = "-";
    var cityLevelText = "-";
    var cityLevel = "-";
    var cityAqi = "-";
    var cityMonitorTime = "-";
    var Apitime;
    if (cityAqiData != null && cityAqiData.aqi != 0) {
        // cityAqiFirst = aqiFirstTextArr[cityAqiData.polution - 1];
        cityAqiFirst = replaceSubscript(cityAqiData.aqiFirstNew);

        cityLevelText = levelTextArr[cityAqiData.level];
        cityLevel = cityAqiData.level + "级";
        cityAqi = cityAqiData.aqi;
        Apitime = cityAqiData.monitorTime;

        if (Apitime != null && typeof(Apitime) != 'undefined' && Apitime.indexOf(".") != -1) {
            Apitime = Apitime.slice(0, Apitime.indexOf("."));
        }
        cityMonitorTime = Apitime;
    }
    console.log("cityMonitorTime  " + cityMonitorTime);
    var bgColor = '00E500';
    if (cityLevelText == '重度污染') {
        bgColor = '9A004C'; // 深紫
    } else if (cityLevelText == '中度污染') {
        bgColor = 'ff0000'; // 红色
    } else if (cityLevelText == '优') {
        bgColor = '00E500'; // 绿色
    } else if (cityLevelText == '良') {
        bgColor = 'FFFF00'; // 黄色
    } else if (cityLevelText == '轻度污染') {
        bgColor = 'FF7E00'; // 橘黄
    } else if (cityLevelText == '严重污染') {
        bgColor = '7F0022'; // 酱紫
    }
    var scrrenW = document.body.clientWidth,
        dimension = 90;
    if (scrrenW >= 2000) {
        dimension = 400;
    }
    var levelHtml = '<div id="myStathalf" data-dimension="' + dimension + '" data-text="" data-info="' + cityLevelText + '" data-width="30" data-fontsize="12" data-percent="100" data-fgcolor="#' + bgColor + '" data-bgcolor="#eee" data-type="half"></div>';
    $("#divCityPolutionLevelText").css("opacity", '0.5');
    $("#divCityPolutionLevelText").html(levelHtml);
    $('#myStathalf').circliful(); // 让椭圆进度条动起来

    $("#divCityFirstPolution").text("").append(cityAqiFirst); // 首要污染物 PM<span class="f-s-8">2.5</span>
    $("#divCityAqi").text(cityAqi); // 空气质量指数 999

    $("#cityMonitorTimeText").text(cityMonitorTime); //

}

/**
 * 根据站点ID找到整个站点数据
 *
 * @param stationId
 * @param data
 * @returns
 */

function getDataById(stationId, data) {
    var data;
    $.each(data, function (n, sub_data) {
        if (sub_data.stationId == stationId) {
            data = sub_data;
            return false;
        }
    });
    return data;
}

/**
 * 根据浓度类型展示小时曲线
 *
 * @param polutionType
 */
function perArr(arr) {
    var arr_1 = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        arr_1.push(arr[i]);
    }
    return arr_1;
}

function showChart(pollutionType) {

    var chart_data = station_hour_data;
    var label_list = [];
    var data_sets = [];
    for (var i = chart_data.length - 1; i >= 0; i--) {

        var strdate = chart_data[i].gridTime,
            d = strdate;
        label_list.push(d);
        if (chart_data[i][pollutionType] == 0) {
            chart_data[i][pollutionType] = '';
        }
        data_sets.push(chart_data[i][pollutionType]);
    }
    hourlyChartFun(label_list, data_sets, pollutionType); //浓度曲线绘制
    $("#polutionSelect").find("option[value='" + pollutionType.toLowerCase() + "']").attr("selected", true);
}

function FormatDate(strTime) {

    var d = new Date(Date.parse(strTime.replace(/-/g, "/")));
    var date = new Date(d);
    return date.getDate() + "日" + date.getHours() + "时";
}

function hourlyChartFun(label_list, data_sets, polutionType) {
    $("#hourlyChart").empty();
    polutionType = polutionType.toUpperCase();
    var myChart = echarts.init(document.getElementById('hourlyChart'));
    var colors = ['#008acd', '#b6a2de', '#2ec7c9', '#f7f7f7', '#eae6f2', '#65c2e7'],
        polutionLevel,
        ColorsLevel = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023'];
    switch (polutionType) {
        case 'PM10': {
            polutionLevel = [{
                gt: 0,
                lte: 50,
                color: ColorsLevel[0]
            }, {
                gt: 50,
                lte: 150,
                color: ColorsLevel[1]
            }, {
                gt: 150,
                lte: 250,
                color: ColorsLevel[2]
            }, {
                gt: 250,
                lte: 350,
                color: ColorsLevel[3]
            }, {
                gt: 350,
                lte: 420,
                color: ColorsLevel[4]
            }, {
                gt: 420,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'PM25': {
            polutionLevel = [{
                gt: 0,
                lte: 35,
                color: ColorsLevel[0]
            }, {
                gt: 35,
                lte: 75,
                color: ColorsLevel[1]
            }, {
                gt: 75,
                lte: 115,
                color: ColorsLevel[2]
            }, {
                gt: 115,
                lte: 150,
                color: ColorsLevel[3]
            }, {
                gt: 150,
                lte: 250,
                color: ColorsLevel[4]
            }, {
                gt: 250,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'O3': {
            polutionLevel = [{
                gt: 0,
                lte: 160,
                color: ColorsLevel[0]
            }, {
                gt: 160,
                lte: 200,
                color: ColorsLevel[1]
            }, {
                gt: 200,
                lte: 300,
                color: ColorsLevel[2]
            }, {
                gt: 300,
                lte: 400,
                color: ColorsLevel[3]
            }, {
                gt: 400,
                lte: 800,
                color: ColorsLevel[4]
            }, {
                gt: 800,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'SO2': {
            polutionLevel = [{
                gt: 0,
                lte: 150,
                color: ColorsLevel[0]
            }, {
                gt: 150,
                lte: 500,
                color: ColorsLevel[1]
            }, {
                gt: 500,
                lte: 650,
                color: ColorsLevel[2]
            }, {
                gt: 650,
                lte: 800,
                color: ColorsLevel[3]
            }, {
                gt: 800,
                lte: 1600,
                color: ColorsLevel[4]
            }, {
                gt: 1600,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'CO': {
            polutionLevel = [{
                gt: 0,
                lte: 5,
                color: ColorsLevel[0]
            }, {
                gt: 5,
                lte: 10,
                color: ColorsLevel[1]
            }, {
                gt: 10,
                lte: 35,
                color: ColorsLevel[2]
            }, {
                gt: 35,
                lte: 60,
                color: ColorsLevel[3]
            }, {
                gt: 60,
                lte: 90,
                color: ColorsLevel[4]
            }, {
                gt: 90,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'AQI':
        case 'AQI2': {
            polutionLevel = [{
                gt: 0,
                lte: 50,
                color: ColorsLevel[0]
            }, {
                gt: 50,
                lte: 100,
                color: ColorsLevel[1]
            }, {
                gt: 100,
                lte: 150,
                color: ColorsLevel[2]
            }, {
                gt: 150,
                lte: 200,
                color: ColorsLevel[3]
            }, {
                gt: 200,
                lte: 300,
                color: ColorsLevel[4]
            }, {
                gt: 300,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'NO2': {
            polutionLevel = [{
                gt: 0,
                lte: 100,
                color: ColorsLevel[0]
            }, {
                gt: 100,
                lte: 200,
                color: ColorsLevel[1]
            }, {
                gt: 200,
                lte: 700,
                color: ColorsLevel[2]
            }, {
                gt: 700,
                lte: 1200,
                color: ColorsLevel[3]
            }, {
                gt: 1200,
                lte: 2340,
                color: ColorsLevel[4]
            }, {
                gt: 2340,
                color: ColorsLevel[5]
            }];
        }
            break;
    }


    option = {
        color: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    textStyle: {
                        fontSize: 30 //鼠标浮动到线时，坐标轴显示的文字大小
                    }
                }
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    fsize = 40,
                    str = '<div class="tooltip-tit" style="font-size:' + fsize + '">' + obj[0].name + '</div>',
                    changeWid = "220px";
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    if (polutionType == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data clear\" style=\"width:" + changeWid + "\"><b style=\"color: " + obj[i].color + ";font-size:70px; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        toolbox: {
            itemSize: 50,
            right: 100,
            show: true,
            showTitle: false,
            feature: {
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        xAxis: {
            splitLine: {
                show: false
            },
            data: label_list,
            axisLabel: {
                margin: 20,
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return value;
                }
            },
            axisTick: {
                alignWithLabel: true
            }

        },
        yAxis: {
            splitLine: {
                show: false,
                color: "#e7e7e7"
            },
            axisLine: {
                lineStyle: {
                    width: 5
                }
            }
        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: colors[3], // 底色
            fillerColor: colors[4], // 选中的颜色
            handleColor: colors[5], // 滑块颜色
            height: "75px",
            width: "97%",
            x: "0%",
            y: "89%"
        }],
        grid: {
            top: '15%',
            left: '1%',
            right: '100px',
            bottom: '20%',
            containLabel: true
        },
        visualMap: {
            top: 10,
            left: 100,
            itemWidth: 50,
            itemHeight: 40,
            orient: 'horizontal',
            pieces: polutionLevel,
            outOfRange: {
                color: '#000'
            },
            textStyle: {
                fontSize: 40
            },
        },
        series: [{
            name: '浓度',
            type: 'line',
            data: data_sets,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 10
                    }
                }
            }
        }]
    };
    setLineFontSize(option, 40);
    myChart.setOption(option);
}

function particulateChartFun(label_list, pm10, pm25, aqi) {
    $("#particulateChart").empty();
    var myChart = echarts.init(document.getElementById('particulateChart')),
        colors = ['#4c4c4c', '#4046f8', '#489f48'],
        dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    textStyle: {
                        fontSize: 30 //鼠标浮动到线时，坐标轴显示的文字大小
                    }
                }
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    changeWid = "290px",
                    fsize = 40
                str = '<div class="tooltip-tit" style="font-size:' + fsize + '">' + obj[0].name + '</div>';
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    str += "<div class=\"tooltip-data clear\" style=\"width:" + changeWid + "\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: dataZoomcolors[0], // 底色
            fillerColor: dataZoomcolors[1], // 选中的颜色
            handleColor: dataZoomcolors[2], // 滑块颜色
            height: "75px",
            width: "96%",
            x: "0%",
            y: "93%"
        }],
        grid: {
            top: '9%',
            left: '1%',
            right: '6%',
            bottom: '10%',
            containLabel: true
        },
        legend: {
            left: 600,
            data: ['AQI', 'PM2.5', 'PM10'],
            itemWidth: 120,
            itemHeight: 70
        },
        toolbox: {
            show: true,
            itemSize: 50,
            showTitle: false,
            top: 10,
            right: 650,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        xAxis: [{
            type: 'category',
            data: label_list,
            axisLabel: {
                //				margin: 10,
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return value;
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            name: 'AQI',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            splitNumber: 2,
            position: 'left',
            axisLabel: {
                textStyle: {
                    fontSize: 30
                }
            },
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[0],
                    width: 5
                }
            }
        }, {
            name: 'PM2.5',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            offset: 140,
            position: 'right',
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[1],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 30
                },
                formatter: '{value}'
            }
        }, {
            name: 'PM10',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            position: 'right',
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[2],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 30
                },
                formatter: '{value}'
            }
        }],
        series: [{
            name: 'AQI',
            type: 'bar',
            data: aqi,
            yAxisIndex: 0,
            itemStyle: {
                normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
                    color: function (params) {
                        var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
                        if (params.data == 0) {
                            return '#f7f7f7';
                        } else if (params.data > 0 && params.data <= 50) {
                            return colorList[0];
                        } else if (params.data > 50 && params.data <= 100) {
                            return colorList[1];
                        } else if (params.data > 100 && params.data <= 150) {
                            return colorList[2];
                        } else if (params.data > 150 && params.data <= 200) {
                            return colorList[3];
                        } else if (params.data > 200 && params.data <= 300) {
                            return colorList[4];
                        } else if (params.data > 300) {
                            return colorList[5];
                        }
                    }
                }
            }
        }, {
            name: 'PM2.5',
            type: 'line',
            yAxisIndex: 1,
            data: pm25,
            itemStyle: {
                normal: {
                    color: colors[1], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }, {
            name: 'PM10',
            type: 'line',
            data: pm10,
            yAxisIndex: 2,
            itemStyle: {
                normal: {
                    color: colors[2], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }]
    };
    setLineFontSize(option, 40);
    myChart.setOption(option);
}

function gaseousChartFun(label_list, co, no2, so2, o3, aqi) {
    $("#gaseousChart").empty();
    var myChart = echarts.init(document.getElementById('gaseousChart'), 'macarons'),
        colors = ['#4c4c4c', '#278e27', '#3636ff', '#ff4040', '#323232'],
        dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    textStyle: {
                        fontSize: 30 //鼠标浮动到线时，坐标轴显示的文字大小
                    }
                }
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    changeWid = "290px",
                    fsize = 40,
                    str = '<div class="tooltip-tit" style="font-size:' + fsize + '">' + obj[0].name + '</div>';

                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    if (obj[i].seriesName == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data clear\" style=\"width:" + changeWid + "\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        legend: {
            left: 300,
            data: ['AQI', 'CO', 'NO2', 'SO2', 'O3'],
            itemWidth: 120,
            itemHeight: 70
        },
        toolbox: {
            showTitle: false,
            right: 620,
            top: 10,
            itemSize: 50,
            show: true,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: dataZoomcolors[0], // 底色
            fillerColor: dataZoomcolors[1], // 选中的颜色
            handleColor: dataZoomcolors[2], // 滑块颜色
            height: "75px",
            width: "96%",
            x: "0%",
            y: "93%"
        }],
        grid: {
            top: '9%',
            left: '1%',
            right: '10%',
            bottom: '17%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: label_list,
            axisLabel: {
                textStyle: {
                    fontSize: 40
                },
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return value;
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            name: 'AQI',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            position: 'left',
            splitLine: {
                show: false //不显示网格线
            },
            axisLabel: {
                textStyle: {
                    fontSize: 40
                }
            },
            axisLine: {
                lineStyle: {
                    color: colors[0],
                    width: 5
                },
                formatter: '{value}'
            }
        }, {
            name: 'CO',
            nameTextStyle: {
                fontSize: 40 //刻度线上单位的 颜色
            },
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 0,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[1],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 30
                }
            }
        }, {
            name: 'NO2',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            offset: 120,
            position: 'right',
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[2],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 30
                },
                formatter: '{value}'
            }
        }, {
            name: 'SO2',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 240,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[3],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 5
                },
                formatter: '{value}'
            }
        }, {
            name: 'O3',
            nameTextStyle: {
                fontSize: 40
            },
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 360,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[4],
                    width: 5
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 5
                },
                formatter: '{value}'
            }
        }],
        series: [{
            name: 'AQI',
            type: 'bar',
            data: aqi,
            yAxisIndex: 0,
            itemStyle: {
                normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
                    color: function (params) {
                        var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
                        if (params.data == 0) {
                            return '#f7f7f7';
                        } else if (params.data > 0 && params.data <= 50) {
                            return colorList[0];
                        } else if (params.data > 50 && params.data <= 100) {
                            return colorList[1];
                        } else if (params.data > 100 && params.data <= 150) {
                            return colorList[2];
                        } else if (params.data > 150 && params.data <= 200) {
                            return colorList[3];
                        } else if (params.data > 200 && params.data <= 300) {
                            return colorList[4];
                        } else if (params.data > 300) {
                            return colorList[5];
                        }
                    }
                }
            }
        }, {
            name: 'CO',
            type: 'line',
            yAxisIndex: 1,
            data: co,
            itemStyle: {
                normal: {
                    color: colors[1], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }, {
            name: 'NO2',
            type: 'line',
            data: no2,
            yAxisIndex: 2,
            itemStyle: {
                normal: {
                    color: colors[2], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }, {
            name: 'SO2',
            type: 'line',
            data: so2,
            yAxisIndex: 3,
            itemStyle: {
                normal: {
                    color: colors[3], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }, {
            name: 'O3',
            type: 'line',
            data: o3,
            yAxisIndex: 4,
            itemStyle: {
                normal: {
                    color: colors[4], //自定义设置线条颜色
                    lineStyle: {

                        width: 10
                    }
                }
            }
        }]
    };
    setLineFontSize(option, 40);
    myChart.setOption(option);
}

// 定时器/////////////////////////////////
var _TIMMER = [];
var last_change_time = 0;
var is_change = false;
_TIMMER._auto_get = true;
_TIMMER.Refresh = function () {
    last_change_time = new Date().getTime();
    is_change = true;
    _TIMMER.To_DO();
}

window.setInterval(_TIMMER_TRIGER_, 60000);

function _TIMMER_TRIGER_() {
    var cur_time = new Date().getTime();
    if (is_change || cur_time - last_change_time >= 60) {
        _TIMMER.To_DO();
        // refresh state
        last_change_time = cur_time;
        is_change = false;
    }
}

_TIMMER.To_DO = function () {
    // 触发函数
    requestRealData();
}

/**
 * 根据不同的类型,排序方式返回排行榜数据,
 *
 * @param data
 * @param type
 *            [ALL,G,LOST,ERROR]
 * @param asc
 */
function genRankList(data, sort) {
    var dataArr = sortFun(data, sort);

    $("#rankTab").html('');
    var rankHtml = '';
    var index = 1;
    if (dataArr != null && dataArr.length > 0) {
        $.each(dataArr, function (n, sub_data) {
            // 控制颜色
            var style = _get_color_style(sub_data.baseLevel);
            var lat = sub_data.lat;
            var lng = sub_data.lng;
            var stationId = sub_data.stationId;
            var trId = lat + "|" + lng + "|" + stationId;
            var value = '-';
            if (sub_data.value != null && typeof(sub_data.value) != 'undefined' && sub_data.value != 0)
                value = sub_data.value;
            var style = _get_color_style(sub_data.baseLevel, value);
            // 排行榜
            var td2 = "<td  width='35%' class='text-center' ><span class=\"difcolorb\" style='" + style + "'>" + value + "</span></td>";

            if ("aqi" == currentPolutionType && minuteHourDataToggle == 'HOUR' && ( currentRankingListType == RANKINGLIST_WZ || currentRankingListType == RANKINGLIST_ALL)) {
                var id = "rank_aqi_" + index;
                var validComment = sub_data.validComment;
                if (validComment != "undefined" && validComment != null && validComment != "") {
                    td2 = "<td  width='35%' id='" + id + "' class='text-center' onmouseover=\"showTip('" + validComment + "','" + id + "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style='" + style + "'>" + value + "*</span></td>";
                }
            }
            else if ("aqi2" == currentPolutionType && minuteHourDataToggle == 'HOUR' && (  currentRankingListType == RANKINGLIST_WZ || currentRankingListType == RANKINGLIST_ALL)) {
                var id = "rank_aqi2_" + index;
                var validCommentRt = sub_data.validCommentRt;
                if (validCommentRt != "undefined" && validCommentRt != null && validCommentRt != "") {
                    td2 = "<td  width='35%' id='" + id + "' class='text-center' onmouseover=\"showTip('" + validCommentRt + "','" + id + "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style='" + style + "'>" + value + "*</span></td>";
                }
            }
            // 排行榜
            rankHtml += "<tr id='" + trId + "'><td width='20%' class='text-center'>" + index + "</td>" +
                "<td width='45%'>" + sub_data.stationName + "</td>" + td2 + "</tr>";
            // rankHtml += "<tr id='" + trId + "'><td width='20%' class='text-center'>" + index + "</td><td width='45%'>" + sub_data.stationName + "</td><td  width='35%' class='text-center' ><span style='" + style + "'>" + value + "</span></td></tr>";
            index++;
        });
        $("#rankTab").html(rankHtml);
        $('#rankTab tr').click(function (event) {
            var trId = $(this).attr("id");
            var strArr = trId.split("|");
            var lat = strArr[0];
            var lng = strArr[1];
            var stationId = strArr[2];
            // openStationWin(lat, lng, stationId);
            showStationInfo(stationId);
        });
    }
}

// 获取颜色 样式
function _get_color_style(level, value) {
    var style = "";
    if (level == 1 && value != '-') {
        style = "background:#01e400;"
    } else if (level == 2) {
        style = "background:#ffff00;"
    } else if (level == 3) {
        style = "background:#ff7e00;"
    } else if (level == 4) {
        style = "background:#ff0000;"
    } else if (level == 5) {
        style = "background:#99004c;"
    } else if (level == 6) {
        style = "background:#7e0023;"
    } else {
        style = "background:#cfcfcf;"
    }
    return style;
}

function sortFun(data, sort) {
    var objectList = new Array();
    var objectList0 = new Array();

    for (var i = 0; data != null && i < data.length; i++) {
        if (data[i].value < 0 || data[i].value == null || data[i].value == '' || typeof(data[i].value) == 'undefined') {
            data[i].value = 0;
            objectList0.push(data[i]);
        } else {
            objectList.push(data[i]);
        }
    }
    // 按Value从小到大排序
    objectList.sort(function (a, b) {
        var inta = a.value,
            intb = b.value;
        if (sort == RANKINGLIST_ASC)
            return inta - intb;
        else
            return intb - inta;
    });
    for (var j = 0; objectList0 != null && j < objectList0.length; j++) {
        objectList.push(objectList0[j]);
    }

    return objectList;
}

// 改变排序
function changeRankSort() {
    if (rankDataForSortTemp != null) {
        var sort = "asc";
        if (currentSort == "asc") {
            currentSort = "desc";
            sort = "desc";
        } else {
            currentSort = "asc";
            sort = "asc";
        }
        genRankList(rankDataForSortTemp, sort);
    }
}

// 站点搜索
function searchBtn() {
    $("#searchBtn").click(function () {
        var value = $("#search_content").val();
        showStationInfo(value);
    });
}

/**
 * 根据站点ID 名称显示该站点的相关信息
 *
 * @param {Object}
 *            value
 */

function showStationInfo(value) {
    if (!isNull(value)) {
        var city = $("#city").val();
        $.ajax({
            type: "POST",
            url: $.coreApiPath + "/station/getStationPoint",
            data: {
                searchKey: value,
                domainId: city
            },
            datatype: "json",
            success: function (data) {
                $.each(data, function (index, obj) {
                    var type = obj.stationType == null ? "" : obj.stationType;
                    var address = obj.addr == null || 'null' == obj.addr ? "" : obj.addr;
                    var district = obj.district == null || 'null' == obj.district ? "" : obj.district;
                    var content = type + ' ' + obj.stationName + ' [' + obj.stationId + '] ' + district + '<br>' + address;
                    openStationWin(obj.lat, obj.lng, content);
                });
            },
            error: function () {
            }
        });
    }
}

/**
 * 初始化实时信息下拉框
 */
function initRealTimeInfo() {
    initDistrict($("#city").val());
    //initStationType("district2", 4);

    // 获取行政区
    $('#district1').change(function () {
        requestRealData();
    });
    init_station_type();
    // 站点类别
    $('#district2').change(function () {
        requestRealData();
    });
}

/**
 * 站点类型
 * @param codeId code数据的ID
 */
function init_station_type(callBack) {
    var codeID = -1;
    if (currentRankingListType == RANKINGLIST_ALL) {
        codeID = -1;
        sTechType = "-1"
    } else if (currentRankingListType == RANKINGLIST_G) { //国控
        codeID = 75;
        sTechType = "99"
    } else if (currentRankingListType == RANKINGLIST_LOST) { //断线
        codeID = -1;
        sTechType = "-1"
    } else if (currentRankingListType == RANKINGLIST_WZ) { //微站
        codeID = 74;
        sTechType = "6010,1010"
    } else if (currentRankingListType == RANKINGLIST_BG) { //考核
        codeID = 76;
        sTechType = "98"
    } else if (currentRankingListType == RANKINGLIST_OTHER) { //扬尘
        codeID = 101;
        sTechType = "101"
    }

    var cityId = $("#city").val();
    var province = $("#province").val();

    var opts = {};
    opts.objID = "district2";
    opts.type = "-1";
    opts.parentID = codeID;
    opts.cityID = cityId;
    opts.proID = province;
    opts.isAll = true;
    opts.callBack = callBack;
    realtime_init_station_type_option(opts);
}

function realtime_init_station_type_option(opts) {

    var id = opts.objID;
    var parent = opts.parentID;
    var isAll = opts.isAll;
    var callBack = opts.callBack;

    var url = $.coreApiPath + "/dictionary/stationType";
    var param = {
        parent: parent
    };
    var opt = document.getElementById(id);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.ajax({
            url: url,
            async: true, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
            type: "POST",
            dataType: "json",
            data: param,
            success: function (data) {
                if (isAll) {
                    opt.options.add(new Option("全部", "-1_1"));
                }

                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        opt.options.add(new Option(data[i].name, data[i].code + "_" + data[i].id));
                    }
                    if (callBack) {
                        callBack(data);
                    }
                }
            }
        });
    }
}