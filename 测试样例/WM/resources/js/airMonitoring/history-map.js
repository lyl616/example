//设置全局变量

/** ****************************全局变量****************************** */
var map;
var heatmapOverlay;
var t = 500;
var polution_type = 'pm25'; // 全局变量 污染类型
var interval = 2; // 默认按天查询 1
var reg = "yyyy-MM-dd";
var show_type = "1"; // 1 代表分布图 2代表热力图

var start_index = 0; // 开始下标
var totalCount = 0; // 循环的总次数
var is_change = true; // 是否启定时器

var startTime = ""; // 开始时间
var endTime = ""; // 结束时间
var currentTime = ""; // 当前帧循环时间

// var province = "370000";
// var city = "370800";
// var cityName = "济宁市";

var city = "";
var province = "";
var cityName = "";

var current_table = "DAY"; // 当前展示的哪一个table
// DAY：最近一天、WEEK：最近一周、MONTH：最近一月、YEAR：最近一年。
var current_district = "-1"; // 行政区 -1：表示全部

var equipment_type = "0"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var s_stech_type = "-1"; //： 站点数据来源（设备类型） 单传感器 6010 ６传感器 1010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var current_type = "-1"; // 站点类型 -1：表示全部

var current_pro = ""; // 当前省
var current_city = ""; // 当前城市

var fixedDigits = 0; // 保留几位小数

/** ************************************************************** */
var Geo = {
    init: function () {

        city = parent.cityId;
        cityName = parent.cityName;
        province = parent.provinceId;

        $("#cityId").val(city);
        $("#proId").val(province);

        initComMap();        
        if (map) {
            areaMapPC(city);
        }
        // 幻灯片间隔
        $('#interval').change(function () {
            interval = $(this).children('option:selected').val();
            $("#aqi2").hide();
            if (interval == "1") {
                reg = "yyyy-MM-dd HH";
                $("#aqi2").show();
                $("#polution_type #aqi").html("标准AQI");
                initStartEndTimeByHour(new Date(), "startTime", "endTime", 7 * 24, reg);
            } else {
                $("#polution_type #aqi").html("AQI");
                if (polution_type == "aqi2") {
                    $("#polution_type #aqi").click();
                }
                if (interval == "2") {
                    reg = "yyyy-MM-dd";
                    initStartEndTimeByDay(new Date(), "startTime", "endTime", 7, reg);
                } else if (interval == "3") {
                    reg = "yyyy-MM";
                    initStartEndTimeByMonth(new Date(), "startTime", "endTime", 7);
                } else if (interval == "4") {
                    reg = "yyyy";
                    initStartEndTimeByYear(new Date(), "startTime", "endTime", 7);
                }
            }
            $("#97DateTimeFmt").val(reg);
            initWateStyle("startTime", "endTime");

            _TIMMER.Refresh();
        })

        $("#progressbar").progressbar({
            value: 0
        });

        initWateStyle("startTime", "endTime");

        initStartEndTimeByDay(new Date(), "startTime", "endTime", 7, reg);
        // initStartEndDateWithReg(new Date(), 7, reg);

        $("#nowDate").html(startTime);
        //initHisParams();
        resetTimerParams();
        switchTab($("#polution_type a"));
    },
    ditu: function () {
        map.setMapType(BMAP_NORMAL_MAP);
    },
    weixing: function () {
        map.setMapType(BMAP_SATELLITE_MAP);
    },
    GetPoint: function () {
        function showInfo(e) {
            console.log("{ \"lng\":" + e.point.lng + ",\"lat\": " + e.point.lat, ",\"count\":" + parseInt(100 * Math.random()) + " },");
        }

        map.addEventListener("click", showInfo);
    },
    btn: function () {
        // 点击上一帧
        $("#btn-pre").click(function () {
            // map.clearOverlays();
            go_pre();
            show_tipbar();
            get_history_hour();

        });
        // 点击下一帧
        $("#btn-next").click(function () {
            // map.clearOverlays();
            go_next();
            show_tipbar();
            get_history_hour();

        });

        // 热力图
        $("#btn-hotmap").click(function () {
            show_type = 2;
            // initSpatialmap();
            // initComMap();
            $("#btn-distribution").css("background-color", "#FFFFFF;");
            $("#btn-hotmap").css("background-color", "#edf0f5;");
            _TIMMER.Refresh();
        });
        // 分布图
        $("#btn-distribution").click(function () {
            show_type = 1;
            // initComMap();
            $("#btn-distribution").css("background-color", "#edf0f5;");
            $("#btn-hotmap").css("background-color", "#FFFFFF;");
            _TIMMER.Refresh();
        });

        $("#ditu").click(function () {
            Geo.ditu();
        });

        $("#weixing").click(function () {
            var type = $(this).attr("data");
            if (type == '0') {
                Geo.weixing();
                $(this).removeClass("wxpic");
                $(this).addClass("mappic");

                $(this).attr("data", "1");
            } else {
                Geo.ditu();
                $(this).removeClass("mappic");
                $(this).addClass("wxpic");
                $(this).attr("data", "0");
            }
        });

        // 获取行政区
        $('#district').change(function () {
            current_district = $(this).children('option:selected').val();
            getTableData();
        })
        // 站点类别
        $('#station_type').change(function () {
            current_type = $(this).children('option:selected').val();
            current_type = current_type.split("_")[0];
            getTableData();
        });

    }

};

$(function () {
    Geo.init();
    Geo.btn();
    //加载排行榜信息
    initHistoryTable();
});

var vm = new Vue({
    el: '#content',
    data: {
        isShow: false,
        allFunctions: {}
    },
    mounted: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;

            }
        })
    },
    methods: {
        bindclick: function (id) {
            $("#staion_type_wz").removeClass("btn-info");
            $("#staion_type_kh").removeClass("btn-info");
            $("#staion_type_yc").removeClass("btn-info");

            $("#" + id).addClass("btn-info");
            var temp_type = id.substring(12);

            if (temp_type == "wz") {
                on_switchTal();
                equipment_type = "0";
                s_stech_type = "-1";
                current_type = "-1";
                init_station_type("73");
                initDistrict(city);
            } else if (temp_type == "kh") {
                on_switchTal();
                equipment_type = "4";
                s_stech_type = "98";
                current_type = "-1";
                init_station_type("76"); //
                cleaarDistrict();
            } else if (temp_type == "yc") {
                remove_switchTab();
                equipment_type = "4";
                s_stech_type = "101";
                current_type = "-1";
                init_station_type("101"); //
                cleaarDistrict();
            } else if (temp_type == "all") {

            }
            _TIMMER.Refresh();
            getTableData();

        }

    }
});

function cleaarDistrict() {
    var opt = $("#district");
    opt.html("<option value='-1'>全部</option>");
}

function hteapMap1() {
    show_type = 2;
    // initComMap();
    _TIMMER.Refresh();
}

function disyPaleMap2() {
    show_type = 1;
    // initComMap();
    _TIMMER.Refresh();
}

/** *****************************定时器播放开始************************************************* */
var _TIMMER = [];

// 启动定时器
window.setInterval(_TIMMER_TRIGER_, 3000);

function _TIMMER_TRIGER_() {
    if (is_change) {
        _TIMMER.To_DO();
    }
}

// 触发函数
_TIMMER.To_DO = function () {
    timerCheck();
    go_next();
    show_tipbar();
    get_history_hour();
}

_TIMMER.Refresh = function () {
    resetTimerParams();
    start_index = 0;
    currentTime = startTime;
    _clear_map_markers();
    map.clearOverlays();
    areaMapPC(city);
    clear_tipbar();
    is_change = true;
    if ($("#btn-play").hasClass("glyphicon-play")) {
        $("#btn-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }
    _TIMMER.To_DO();
}

/** *****************************定时器播放开始************************************************* */
/**
 * 获取历史数据
 */
function get_history_hour() {
    var url = $.coreApiPath + "/history/getData";

    var gridTime = currentTime;
    if (interval == 1) {
        gridTime = gridTime.substring(0, 13) + ":00:00";
    }
    var postData = {
        show_type: show_type,
        province: province,
        city: city,
        interval: interval, // interval 1时 2 天 3 月 4 年 显示的类型
        polution_type: polution_type,
        gridTime: gridTime, // 当前取出时间
        district: current_district, // 行政区
        equipment_type: equipment_type,
        s_stech_type: s_stech_type,
        station_type: current_type
        // 站点类别
    };

    ajax(url, postData, function (r) {
        if (r.result) {
            var data = r.data;
            if (data != null) {
                if (show_type == "1") {
                    showInterpolation(data);
                } else if (show_type == "2") {
                    showHotmap(data);
                    // showSpatialmap(data);
                }
            }
        } else {
            _clear_map_markers();
            // map.clearOverlays();// 清除所有覆盖物
        }
    });

}

/** *****************************定时器播放结束************************************************* */
function remove_switchTab() {
    var type_a = $("#polution_type a");
    type_a.off("click");
    for (var i in type_a) {
        if (type_a[i].id == 'pm10') {
            type_a.removeClass('btn-white');
            type_a.removeClass('btn-info');
            type_a.addClass('btn-white');
            type_a.css("cursor", 'inherit');
            $(type_a[i]).addClass("btn-info");
            polution_type = type_a[i].id;
        }
    }
}

function on_switchTal() {
    $("#polution_type a").removeClass("btn-white");
    $("#polution_type a").addClass("btn-white");
    $("#polution_type a").css("cursor", 'pointer');
    switchTab($("#polution_type a"));
}

// 左上导航 菜单点击事件
function switchTab(a) {
    a.click(function () {
    	
        $("#polution_type a").removeClass("btn-info");
        $(this).addClass("btn-info");

        polution_type = this.id;
        var lendType = polution_type == "aqi2" ? "aqi" : polution_type;
        var src = "../resources/img/legend/legend-" + lendType + ".png";
        $(".Legend img").attr("src", src);
        _TIMMER.Refresh();
        getRankData();
    });
}

function show(oEvent) {
    var UserBox = document.getElementById("ShowUserBoxMain");
    if (UserBox.style.display == "block") {
        document.getElementById("ShowUserBoxMain").style.display = "none";
    } else {
        document.getElementById("ShowUserBoxMain").style.display = "block";
    }
    e = window.event || oEvent;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

function showTraffic2(target) {
    if (ctrl != null) {
        ctrl.remove();
        ctrl = null;
        $(target).css("background-color", "#FFFFFF;");
        return;
    }
    ctrl = new BMapLib.TrafficControl();
    map.addControl(ctrl);
    ctrl.showTraffic();
    $(target).css("background-color", "#edf0f5;");
}

function hide() {
    document.getElementById("ShowUserBoxMain").style.display = "none";
}

window.onload = function () {

    document.getElementById("ShowUserBoxMain").style.display = "none";
    document.body.onclick = hide;
};
$("#toolbars").click(function () {

    if ($("#xiala").css("display") == 'none') {
        $("#toolbar_icon").attr("class", "glyphicon glyphicon-chevron-down")
    } else {
        $("#toolbar_icon").attr("class", "glyphicon glyphicon-chevron-up")
    }
    $("#xiala").slideToggle();
});
$("#uu li").click(function () {

    $("#toolbar_icon").attr("class", "glyphicon glyphicon-chevron-down");

})

function reviewCity() {
    if (sessionStorage.getItem("currentCityId") != null) {
        $("#city").val(sessionStorage.getItem("currentCityId"));
    }
    if (sessionStorage.getItem("currentCityName") != null) {
        $("#city_name_span").html(sessionStorage.getItem("currentCityName"));
        $("#mapCenter").html(sessionStorage.getItem("currentCityName"));
    }
}

// 添加标识
var markers = [];

function _add_map_markers(data) {
    // 创建地图标注
    var size = 60,
        icon_path = "",
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
    if (data.stationType == '99') {
        icon_path += "mark_sprite_gk_" + data.baseLevel + ".png";
        size = size + size * 0.4;
    } else if (data.stationType == '98') {
        icon_path += "mark_sprite_sk_" + data.baseLevel + ".png";
        size = size + size * 0.2;
    } else if (data.stationType == '97') {
        size = size * 0.8;
        icon_path += "mark_sprite_s_" + data.baseLevel + ".png";
    } else if (data.stationType == '101') {
        size = size * 0.8;
        icon_path += "mark_sprite_yc_" + data.baseLevel + ".png";
    } else if (data.stationType < 90 && data.stechType == 1010) {
        size = size * 0.8;
        icon_path += "mark_sprite_d_" + data.baseLevel + ".png";
    } else if (data.stationType < 90 && data.stechType == 6010) {
        size = size * 0.8;
        icon_path += "mark_sprite_six_" + data.baseLevel + ".png";
    }
    var markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
        offset: new BMap.Size(0, 0),
        imageSize: new BMap.Size(size, size),
        imageOffset: new BMap.Size(0, 0)
    });
    var point = new BMap.Point(data.lng, data.lat);
    var marker = new BMap.Marker(point, {
        icon: markIcon
    }); // 创建标注
    marker.obj = data;
    // 将标注添加到地图中
    map.addOverlay(marker);
    markers.push(marker);
}

function _after_map_init(map) {
    request_city_static_data();

    // 初始化插值图
    heatmapOverlay = _CreateChaZhiMap(map);
}

function _after_change_pollution() {
    _TIMMER.Refresh();

    // 刷新界面
    $('.rank table thead tr td').eq(2).html(polution_name);
}

/** ******************************张春伟******************************* */
/**
 * 初始化行政区 city_id :城市的ID
 */
function initDistrict(city_id) {
    var url = $.coreApiPath + "/history/getDistrict";
    var param = {
        "cityId": city_id
    };
    var opt = document.getElementById("district");
    opt.options.length = 0;
    $.getJSON(url, param).success(function (data) {
        opt.options.add(new Option("全部", "-1"));
        for (var i = 0; i < data.length; i++) {
            opt.options.add(new Option(data[i].district, data[i].id));
        }
    });
}

/**
 * 获得历史的最大值 最小值 平均值
 */

function getTableData() {
    current_pro = $("#proId").val();
    current_city = $("#cityId").val();
    var url = $.coreApiPath + "/history/historyMaxAndMinData";
    var param = {
        district: current_district,
        equipment_type: equipment_type,
        s_stech_type: s_stech_type,
        station_type: current_type,
        timeType: current_table,
        proId: current_pro,
        cityId: current_city
    };
    ajax(url, param, function (r) {
        if (r.result) {
            var data = r.data;
            var html_ = '<tr><td class="W30">最高</td> <td class="W10">' + Number(data[0].aqi_max).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm25_max).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm10_max).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].so2_max).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].no2_max).toFixed(fixedDigits) + '</td> <td class="W10">' + (data[0].co_max == "0" ? "0" : Number(data[0].co_max).toFixed(2)) + '</td> <td class="W10">' + Number(data[0].o3_max).toFixed(fixedDigits) + '</td></tr>';
            html_ += '<tr><td class="W30">最低</td> <td class="W10">' + Number(data[0].aqi_min).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm25_min).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm10_min).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].so2_min).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].no2_min).toFixed(fixedDigits) + '</td> <td class="W10">' + (data[0].co_min == "0" ? "0" : Number(data[0].co_min).toFixed(2)) + '</td> <td class="W10">' + Number(data[0].o3_min).toFixed(fixedDigits) + '</td></tr>';
            html_ += '<tr><td class="W30">平均值</td> <td class="W10">' + Number(data[0].aqi_avg).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm25_avg).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].pm10_avg).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].so2_avg).toFixed(fixedDigits) + '</td> <td class="W10">' + Number(data[0].no2_avg).toFixed(fixedDigits) + '</td> <td class="W10">' + (data[0].co_avg == 0 ? "0" : Number(data[0].co_avg).toFixed(2)) + '</td> <td class="W10">' + Number(data[0].o3_avg).toFixed(fixedDigits) + '</td></tr>';
            $("#t_body").empty();
            $("#t_body").html(html_);
            getRankData();
        } else {
            $("#t_body").html("");
        }
    });
}

/**
 * 获得历史排行榜数据
 */
var rankData = null;
var rankType = 1; // 排序顺序 1：正序，-1：倒叙。
function getRankData() {
    current_pro = $("#proId").val();
    current_city = $("#cityId").val();
    var url = $.coreApiPath + "/history/hisrotyRankData";
    var param = {
        district: current_district,
        equipment_type: equipment_type,
        s_stech_type: s_stech_type,
        station_type: current_type,
        timeType: current_table,
        polutionType: polution_type,
        proId: current_pro,
        cityId: current_city
    };

    ajax(url, param, function (r) {
        if (r.result) {
            var data = r.data;
            rankType = 1;
            rankData = null;
            var standardRate = data.standardRate;
            $("#firstPercent").html("达到国家1级标准的：<span class=\"f-s-14\">" + standardRate.standardRate1 + "</span>");
            $("#secondPercent").html("达到国家2级标准的：<span class=\"f-s-14\">" + standardRate.standardRate2 + "</span>");
            rankData = data.rankData;
            
            if (rankData) {
                _makeRankHtml(rankData);
            }
        } else {
            $("#rank_body").html("");
            $("#firstPercent").html(" ");
            $("#secondPercent").html(" ");
        }
    });

}

/**
 * 拼接排行榜表格样式
 * @param rankData
 * @private
 */
function _makeRankHtml(rankData) {
    var _html = '';
    var tempFixed = fixedDigits;
    var updownhtml = "";
    if (polution_type == "t_co") {
        tempFixed = 2;
    }
    for (var i = 0; i < rankData.length; i++) {
        updownhtml = '';
        var PolutionTypeStr = rankData[i].polutionType.toUpperCase().replace(".", "");

        var pollutionV = PolutionTypeStr.replace(/\d+/g, '').toUpperCase();
        var PolutionvalNum = PolutionTypeStr.replace(/[^0-9]/ig, "");

        if (PolutionvalNum == "25") {
            PolutionvalNum = "2.5";
        }
        var td3 = pollutionV + '<sub>' + PolutionvalNum + '</sub>'
        if (pollutionV.indexOf("AQI") != -1) {
            if (interval == 1) {
                td3 = "标准AQI";
                if (PolutionvalNum == "2") {
                    td3 = "AQI";
                }
            } else {
                td3 = "AQI";
            }

        }
        if (rankData[i].percentage != '--') {
            if (rankData[i].percentage > 0) {
                updownhtml = '<b class="arrow-up"></b>';
            } else if (rankData[i].percentage < 0) {
                updownhtml = '<b class="arrow-down"></b>';
            }
        }

        _html += '<tr> <td class="text-center">' + (i + 1) + '</td> ' +
            '<td class="text-center">' + rankData[i].stationName + '</td> ' +
            '<td class="text-center">' + td3 + '</td> ' +
            '<td class="text-center">' + Number(rankData[i].avg1).toFixed(tempFixed) + '</td> ' +
            '<td class="text-center">' + updownhtml + rankData[i].percentage + '</td> </tr>'
    }
    $("#rank_body").empty();
    $("#rank_body").html(_html);
}

/**
 * 改变排序
 *
 * @param type
 *            需要排序的类型
 */
function changeSort(type) {
    var keysrt = function (prop, desc) {
        return function (obj1, obj2) {
            var val1 = Number(obj1[prop] != "--" ? obj1[prop] : "-100000");
            var val2 = Number(obj2[prop] != "--" ? obj2[prop] : "-100000");
            if (val1 < val2) {
                if (desc) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (val1 > val2) {
                if (desc) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return 0;
            }
        }
    }

    if (rankData != null) {
        var temp;
        if (rankType == 1) { // 当前为正序 变倒叙
            rankType = -1;
            temp = rankData.sort(keysrt(type, true));
        } else {
            rankType = 1;
            temp = rankData.sort(keysrt(type, false));
        }
        _makeRankHtml(temp);
    }
}

function initHistoryTable() {
    initDistrict($("#cityId").val());
    //站点类型
    init_station_type("73"); //
    getTableData();
}

/**
 * 默认微站站点类型
 * @param parentID
 */
function init_station_type(parentID) {
    var opts = {
        objID: "station_type",
        parentID: parentID,
        cityID: city,
        proID: province,
        isAll: true
    };
    init_station_type_option(opts);
}