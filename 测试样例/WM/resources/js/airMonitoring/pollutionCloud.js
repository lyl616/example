//设置全局变量
var map;
var smallMap;
var imageLayer;
var imageLayer2;
var airDataMap = "undefined";// 保存风力风向的map
var cloudImg = "";//保存图片服务器的ip地址


$(function () {
    Geo.initMap();
    Geo.init();
    Geo.btn();
    switchTab($("#polution_type a"));
});

/** ****************************全局变量****************************** */

var province = "370000";
var city = "370800";
var cityName = "济宁市";

var dateVal = 7; // 默认开始时间与当前时间间隔
/** ****************************全局变量****************************** */
var Geo = {
    initMap: function () {
        map = initMyBMapWithMaxMin("WMMAP", cityName, 10, 8, 14);
        $("#progressbar").progressbar({
            value: 0
        });
        var NavigationControl = new BMap.NavigationControl({
            offset: new BMap.Size(70, 600),
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_LARGE
        });
        map.addControl(NavigationControl);
        $.get($.backendApiPath + '/domain/citybound/' + city, function (data) {
            var h = new BMap.Point(data.result.lowLng, data.result.lowLat), m = new BMap.Point(data.result.highLng, data.result.highLat);
            groundOverlayOptions = {
                opacity: 1
            };
            imageLayer = new BMap.GroundOverlay(new BMap.Bounds(h, m), groundOverlayOptions);
            map.addOverlay(imageLayer);
        });
    },
    ditu: function () {
        map.setMapType(BMAP_NORMAL_MAP);
    },
    weixing: function () {
        map.setMapType(BMAP_SATELLITE_MAP);
    },
    init: function () {
        // 初始化开始结束时间
        initWateStyle("startTime", "endTime", reg);
        initStartEndDateWithReg(new Date(), dateVal, reg);
        resetTimerParams();
        // 查询间隔发生改变
        $('#interval').change(function () {
            interval = $(this).children('option:selected').val();
            if (interval == "1") {
                reg = "yyyy-MM-dd HH";
                interval_type = "hour";
                picFmt = "yyyyMMddHH";
                initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
            } else if (interval == "2") {
                reg = "yyyy-MM-dd";
                interval_type = "day";
                picFmt = "yyyyMMdd";
                initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
            } else if (interval == "3") {
                reg = "yyyy-MM";
                interval_type = "month";
                picFmt = "yyyyMM";
                dpicFmt = "yyyyMM";
                initStartEndTimeByMonth(new Date(), "startTime", "endTime", dateVal);
            } else if (interval == "4") {
                reg = "yyyy";
                interval_type = "year";
                picFmt = "yyyy";
                initStartEndTimeByYear(new Date(), "startTime", "endTime", dateVal);
            }
            $("#97DateTimeFmt").val(reg);
            initWateStyle("startTime", "endTime");
            _TIMMER.Refresh();
        });

    },
    btn: function () {
        // 站点类型
        $("#wz").click(function () {
            $("#wz-gk").removeClass("btn-info");
            $("#wz").addClass("btn-info");
            stationtype = this.id;
            _TIMMER.Refresh();
        });

        $("#wz-gk").click(function () {
            $("#wz").removeClass("btn-info");
            $("#wz-gk").addClass("btn-info");
            stationtype = this.id;
            _TIMMER.Refresh();
        });

        // 算法
        $(":input[name='arithmetic']").click(function () {
            arithmetic = $(this).val();
            _TIMMER.Refresh();
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


        // 点击上一帧
        $("#btn-pre").click(function () {
            showGraph();// 显示污染溯源图
            show_tipbar();// 显示进度条
            go_pre();

        });
        // 点击下一帧
        $("#btn-next").click(function () {


            showGraph();// 显示污染溯源图
            show_tipbar();// 显示进度条
            go_next();


        });

    }
};


function getCloudImg() {
    ajax_get($.backendApiPath + "/config/cloudimg", {}, function (data) {
        if (data.erroCode == 2000) {
            cloudImg = data.result;
        } else {
            cloudImg = "url_error"
        }
    });
}


/** *****************************定时器播放开始************************************************* */

var interval = 1;// 时间间隔 默认小时 1 小时 2天 3 月 4 年
var interval_type = "hour";// 时间间隔 默认小时 1 小时 2天 3 月 4 年
var reg = "yyyy-MM-dd HH";
var picFmt = "yyyyMMddHH";


var stationtype = "wz-gk";// 站点类型 默认为 微站
var polution_type = 'pm25';// 全局变量 污染类型
var arithmetic = "Neareast_RBF";// 默认算法1

var is_change = true;// 是否启定时器
var startTime = "";// 开始时间
var endTime = "";// 结束时间
var currentTime = "";// 当前帧循环时间

var start_index = 1;// 开始下标
var totalCount = 0;// 循环的总次数

var _TIMMER = [];

// 启动定时器
window.setInterval(_TIMMER_TRIGER_, 1000);

function _TIMMER_TRIGER_() {
    if (is_change) {
        _TIMMER.To_DO();
    }
}

// 触发函数
_TIMMER.To_DO = function () {
    timerCheck();
    if (cloudImg != "") {
        go_next();
        showGraph(); // 显示污染溯源图
        show_tipbar(); // 显示进度条

    } else {
        getCloudImg();
    }
}

_TIMMER.Refresh = function () {
    resetTimerParams();
    start_index = 1;
    currentTime = startTime;
    showGraph();
    show_tipbar(); // 显示进度条
    clear_tipbar();
    is_change = true;
    if ($("#btn-play").hasClass("glyphicon-play")) {
        $("#btn-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }
    airDataMap = "undefined";
}

function showGraph() {
    showWindinfo();// 后台查询风力风向

    var seltime = converTimeFormat(currentTime);
    if (interval == 1) {
        seltime = converTimeFormat(currentTime.substring(0, 13) + ":00:00");
    }
    var picTimeTime = seltime.Format(picFmt);
    // 图片地址拼接 正式 http://58.83.189.155/370800/wz/aqi/Linear/hour/2017030107.png
    // var imgurl = $.cloud_base_img_ip + city + "/" + stationtype + "/" + polution_type + "/" + arithmetic + "/" + interval_type + "/" + picTimeTime + ".png";
    var imgurl = cloudImg + city + "/" + stationtype + "/" + polution_type + "/" + arithmetic + "/" + interval_type + "/" + picTimeTime + ".png";

    imageLayer.setImageURL(imgurl);
}

/**
 * 后台查询风力风向
 */

function showWindinfo() {

    var insTime = currentTime;
    if (interval == 1) {
        insTime = insTime.substring(0, 13) + ":00:00";
    }
    if (airDataMap != "undefined") {
        showAirdate(airDataMap, currentTime);
    } else {
        var stTime = $("#startTime").val();
        var edTime = $("#endTime").val();
        var postData = {
            pro: province,
            city: city,
            polution_type: polution_type,
            interval: interval,
            startTime: stTime,
            endTime: edTime,
            insTime: insTime
        };
        var url = $.coreApiPath + "/pollutionSource/getWWAirData";
        ajax(url, postData, function (r) {
            if (r.result) {
                var charData = r.data;
                if (typeof (charData.otherMap) != "undefined") {
                    airDataMap = charData.otherMap;
                    showAirdate(airDataMap, currentTime);
                }
            }
        });
    }
}

function showAirdate(airDataMap, insTime) {
    var airData = airDataMap[insTime];
    if (typeof (airData) != "undefined") {
        var power = airData.power;
        $("#power").html(power);
        var direction = airData.direction;
        var level = airData.level;
        var src = $.ctx + "/resources/img/airdata/" + direction + level + ".png";
        $("#direction img").attr("src", src);
    }
}

function converTimeFormat(time) {
    if (time != null) {
        time = time.replace("-", "/");
        time = time.replace("-", "/");
        return new Date(time);
    }
    return null;
}

/** *****************************定时器播放结束************************************************* */

// 左上导航 菜单点击事件
function switchTab(a) {
    a.click(function () {
        $("#polution_type a").removeClass("btn-info");
        $(this).addClass("btn-info");

        polution_type = this.id;
        var src = "../resources/img/legend/legend-" + polution_type + ".png";
        $(".Legend img").attr("src", src);
        _TIMMER.Refresh();
    });
}
