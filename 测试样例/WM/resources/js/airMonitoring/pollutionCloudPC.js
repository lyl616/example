//设置全局变量
var map;
var smallMap;
var imageLayer;
var imageLayer2;
var heatmapOverlay;
var polution_type = 'pm25'; // 全局变量 污染类型
var t = 500;
var clt;
var airDataMap = "undefined"; // 保存风力风向的map
var cloudImg = "";

var stationtype = "wz"; // 站点类型 默认为 微站
var stationFlag = 1; //站点标识，-1所有，1微站、2考核站、3微站考核站

var arithmetic = "Neareast_RBF"; // 默认算法1

var addStation = false; //是否添加站点
var addKaoHe = false; //是否添加考核
var addWz = true; //是否添加微站
var scrollCont = 0;//滚动加载次数
var showMsg = true;

$(function () {
    Geo.initMap();
    Geo.init();
    Geo.btn();
    Geo.GetPoint();
    switchTab($("#polution_type a"));

});

/** ****************************全局变量****************************** */

var province = "";
var city = "";

var dateVal = 7; // 默认开始时间与当前时间间隔

/** ****************************全局变量****************************** */
var Geo = {
    initMap: function () {
        province = parent.provinceId;
        city = parent.cityId;
        cityName = parent.cityName;
        map = initMyBMapWithMaxMin("WMMAP", parent.cityName, 10, 7, 14);
        // smallMap = initMyBMapWithMaxMin("smallMap", "全国", 3, 2, 4);

        var NavigationControl = new BMap.NavigationControl({
            offset: new BMap.Size(40, 90),
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        });
        map.addControl(NavigationControl);

        $("#progressbar").progressbar({
            value: 0
        });

        $.get($.backendApiPath + "/domain/citybound/" + city, function (data) {
            if (data.erroCode == 2000) {
                var h = new BMap.Point(data.result.lowLng, data.result.lowLat),
                    m = new BMap.Point(data.result.highLng, data.result.highLat);
                imageLayer = new BMap.GroundOverlay(new BMap.Bounds(h, m), {
                    opacity: 0.9
                });
                map.addOverlay(imageLayer);
            } else {
                layer.msg("网络错误", function () {
                });
            }
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
        initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
        getCloudImg();
        resetTimerParams();
        getStationsByType();

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
                initStartEndTimeByMonth(new Date(), "startTime", "endTime", dateVal);
            } else if (interval == "4") {
                reg = "yyyy";
                interval_type = "year";
                picFmt = "yyyy";
                initStartEndTimeByYear(new Date(), "startTime", "endTime", dateVal);
            }
            $("#97DateTimeFmt").val(reg);
            initWateStyle("startTime", "endTime");
            showImg();
            _TIMMER.Refresh();
        });

    },
    btn: function () {
        $("#wz").click(function () {
            if ($("#wz").hasClass("btn-info")) {
                addWz = false;
                $("#wz").removeClass("btn-info").addClass("btn-white");
            } else {
                addWz = true;
                $("#wz").removeClass("btn-white").addClass("btn-info");
            }
            initStationFlag();
        });

        $("#kaohe").click(function () {
            if ($("#kaohe").hasClass("btn-info")) {
                addKaoHe = false;
                $("#kaohe").removeClass("btn-info").addClass("btn-white");
            } else {
                addKaoHe = true;
                $("#kaohe").removeClass("btn-white").addClass("btn-info");
            }
            initStationFlag();
        });

        $("#station").click(function () {
            if ($("#station").hasClass("btn-info")) {
                $("#station").removeClass("btn-info").addClass("btn-white");
                addStation = false;
            } else {
                $("#station").removeClass("btn-white").addClass("btn-info");
                addStation = true;
            }
            getStationsByType();

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
            go_pre();
            showGraph(); // 显示污染溯源图
            show_tipbar(); // 显示进度条

        });
        // 点击下一帧
        $("#btn-next").click(function () {
            go_next();
            show_tipbar(); // 显示进度条
            showGraph(); // 显示污染溯源图

        });
    },
    GetPoint: function () {
        function showInfo(e) {
            console.log("{ \"lng\":" + e.point.lng + ",\"lat\": " + e.point.lat, ",\"count\":" + parseInt(100 * Math.random()) + " },");
        }

        // smallMap.addEventListener("click", showInfo);
    },
    envents: function () {
        //查看差值图,监听滚动条
        $("#pic_scroll").scroll(function (event) {
            var viewH = $(this).height(), //可见高度
                contentH = $(this).get(0).scrollHeight, //内容高度
                scrollTop = $(this).scrollTop(); //滚动高度
            if (scrollTop / (contentH - viewH) >= 1) {
                var cnt = totalCount - 24 - 12 * scrollCont;//判断是否还有图片加载
                if (cnt > 0) {
                    if (cnt < 12) {
                        appendrealTable(cnt);
                    } else {
                        appendrealTable(12);
                    }
                    scrollCont++;
                } else {
                    if (showMsg) {
                        layer.msg("没有了哦！");
                        showMsg = false;
                    }
                    return false;
                }
            }
        });
    }
};


function initStationFlag() {
    //stationFlag 站点标识，-1所有，1微站、2考核站、3微站考核站
    if (addKaoHe && addWz) {
        stationFlag = 3;
        stationtype = "wz-kh";
    } else if (!addKaoHe && addWz) {
        stationFlag = 1;
        stationtype = "wz";
    } else if (addKaoHe && !addWz) {
        stationFlag = 2;
        stationtype = "kaohe";
    } else {
        is_change = false;
        stationtype = "0";
    }

    if (stationtype != "0") {
        map.removeOverlay(imageLayer);
        map.addOverlay(imageLayer);
        _TIMMER.Refresh();
        getStationsByType(); //叠加站点
    } else {
        _clear_markers_map(map, markers);
        map.removeOverlay(imageLayer);
    }

}

var markers = [];

/**
 * 加载站点信息
 */
function getStationsByType() {
    if (addStation) {
        _clear_markers_map(map, markers);
        var url = $.backendApiPath + "/wmstation/latlng";
        var postData = {
            domainId: city,
            stationFlag: stationFlag
        };
        ajax(url, postData, function (data) {
            if (data.erroCode == 2000) {
                add_cloud_staion_markers(data.result);
            }
        });
    } else {
        _clear_markers_map(map, markers);
    }

}


/**
 * 添加污染站点marker
 * @param data
 */
function add_cloud_staion_markers(data) {
    for (var i = 0; i < data.length; i++) {
        var station = data[i];
        if (station.lat != null && station.lng != null) {
            var point = new BMap.Point(station.lng, station.lat);
            var marker = new BMap.Marker(point, {
                icon: new BMap.Icon(ctx + '/resources/img/cloud/station-point.png', new BMap.Size(5, 5))
            });
            map.addOverlay(marker);
            markers.push(marker);
        }
    }
}

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

var interval = 2; // 时间间隔 默认小时 1 小时 2天 3 月 4 年
var interval_type = "day"; // 时间间隔 默认小时 1 小时 2天 3 月 4 年
// var interval_type = "hour";// 时间间隔 默认小时 1 小时 2天 3 月 4 年

var reg = "yyyy-MM-dd";
var picFmt = "yyyyMMdd";

var is_change = true; // 是否启定时器
var startTime = ""; // 开始时间
var endTime = ""; // 结束时间
var currentTime = ""; // 当前帧循环时间

var start_index = 0; // 开始下标
var totalCount = 0; // 循环的总次数

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
        // go_pre();
        showGraph(); // 显示污染溯源图
        show_tipbar(); // 显示进度条
    } else {
        getCloudImg();
    }
}

_TIMMER.Refresh = function () {
    resetTimerParams();
    start_index = 0;
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

    showWindinfo(); // 后台查询风力风向
    if (interval == 1) {
        currentTime = currentTime.substring(0, 13) + ":00:00";
    }
    var seltime = converTimeFormat(currentTime);
    var picTimeTime = seltime.Format(picFmt);

    var imgurl = cloudImg + city + "/" + stationtype + "/" + polution_type + "/" + arithmetic + "/" + interval_type + "/" + picTimeTime + ".png";
    // var imgurl = "http://120.92.44.141/370800/wz/pm25/Neareast_RBF/day/20170828.png";

    // console.log(imgurl);
    imageLayer.setImageURL(imgurl);
    initZIndex();
    //全国地图
    // var imgurl2 = $.cloud_base_img_ip + "country/999999/gkqg/" + polution_type + "/" + arithmetic + "/" + interval_type + "/" + picTimeTime + ".png";
    // imageLayer2.setImageURL(imgurl2);
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
            city: city,
            interval: interval,
            insTime: insTime
        };
        var url = $.backendApiPath + "/airdata/cloudimg/last";
        ajax(url, postData, function (json) {
            if (json.erroCode == 2000) {
                airDataMap = json.result;
                showAirdate(airDataMap, currentTime);
            }
        });
    }
}

function showAirdate(airDataMap, insTime) {
    var airData = airDataMap;
    if (typeof(airData) != "undefined") {
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
        showImg();
        _TIMMER.Refresh();
    });
}

/**
 * 底图切换
 */
function showImg() {

    var lendType = polution_type == "aqi2" ? "aqi" : polution_type;

    var src = "../resources/img/cloud/wm-legend-" + lendType + ".png";
    if (interval == 2 && polution_type == "o3") {
        src = "../resources/img/cloud/wm-legend-o3-8h.png";
    }
    $(".lend-cloud img").attr("src", src);
}

function initZIndex() {
    var divs = $("#WMMAP div");
    for (var i = 0; i < divs.length; i++) {
        var dv = divs[i];
        if (dv.style.zIndex == 500) {
            $(dv).css({
                "z-index": "-1"
            });

        }
    }
}

/***********************************查看下载污染云图**************************8********/


var showTime = "";
var isPlay = false;

/**
 * 打开差值图预览窗口
 */
function viewPics() {
    clearPicsModal();
    clearPicsModal();
    isPlay = is_change;//记录上一次播放状态
    is_change = false;//先暂停播放

    var start = $("#startTime").val();
    var end = $("#endTime").val();
    showTime = start;

    var title_type = polution_type.toUpperCase(),
        num = polution_type.replace(/[^0-9]/ig, ""),
        vl = title_type.replace(/\d+/g, '');
    if (num == "25") {
        num = "2.5";
    }
    var title = "";
    if (interval == 1) {
        var end2 = end.substring(0, 13) + ":00:00";
        var start2 = start.substring(0, 13) + ":00:00";
        showTime = start2;
        totalCount = GetHourDiff(end2, start2);
        title = start2 + " 至 " + end2 + " " + vl + "<sub>" + num + "</sub> 浓度空间分布图";
        $("#zipName").val(new Date(start2).Format("yyyy-MM-dd HH") + "时至" + new Date(end2).Format("yyyy-MM-dd HH") + "时" + vl + num + "浓度空间分布图");
    } else {
        if (interval == 2) {
            totalCount = GetDateDiff(endTime, startTime);
        } else if (interval == 3) {
            totalCount = getMonthsDiff(endTime, startTime);
        } else if (interval == 4) {
            totalCount = getYearDiff(endTime, startTime);
        }
        title = startTime + " 至 " + endTime + " " + vl + "<sub>" + num + "</sub> 浓度空间分布图";
        $("#zipName").val(startTime + "至" + endTime + vl + num + "浓度空间分布图");
    }
    $("#picsTitle").html(title);

    $("#dvalueModal").modal('show');

    var firstShowCount = 24;
    if (totalCount < firstShowCount) {
        firstShowCount = totalCount;
    }
    appendrealTable(firstShowCount);
    Geo.envents();
}


/**
 * 创建显示图片
 * @param showCount
 */
function appendrealTable(showCount) {

    var bodytd_limit = '',
        body_html = '';
    for (var i = 0; i < showCount; i++) {
        var seltime = converTimeFormat(showTime);
        var picTimeTime = seltime.Format(picFmt);

        var imgId = city + "/" + stationtype + "/" + polution_type + "/" + arithmetic + "/" + interval_type + "/" + picTimeTime + ".png";

        body_html += '<div class = "pic_selt pic_seltfffbor" > ';

        // body_html += '<input type = "checkbox"  name="pic" id="' + showTime + '" / > ';
        body_html += '<input type = "hidden"  name="pic" id="' + imgId + '" value="-1" / > ';

        if (interval == 1) {
            body_html += '<span class="f-s-12" >' + seltime.Format("yyyy-MM-dd HH时") + '</span> ';
            showTime = hourIncre(showTime, 1);
        } else {
            body_html += '<span class="f-s-12">' + showTime + '</span> ';
            if (interval == 2) {
                showTime = dayIncre(showTime, 1);
            } else if (interval == 3) {
                showTime = monthIncre(showTime, 1);
            } else if (interval == 4) {
                showTime = yearIncre(showTime, 1);
            }
        }
        body_html += '<img src = "' + cloudImg + imgId + '"  onerror="notfind(\'' + imgId + '\');" / > ';

        body_html += '</div>';


    }
    $("#pic_scroll").append(body_html);
    picClk();
}


function notfind(imgId) {
    var img = event.srcElement;
    img.src = $.ctx + "/resources/img/cloud/none.png";
    img.onerror = null;//控制不要一直跳动
    document.getElementById(imgId).value = "0";
    showSelectCnt();
}

/**
 * 全选/取消
 */
function selAll_pic() {
    var selAll = $("#selAll").val();
    if (selAll == "全部选中") {
        // $(" .pic_selt input[name='pic']").val("1");
        $(".pic_selt input[name='pic']").each(function () {
            if ($(this).val() != "0") {
                $(this).val("1");
                $(this).parent('.pic_selt').removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
            }
        });
        $("#selAll").val("取消全部选中");
        // $(".pic_selt").removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
    } else {
        // $(" .pic_selt input[name='pic']").val("-1");
        $(".pic_selt input[name='pic']").each(function () {
            if ($(this).val() != "0") {
                $(this).val("-1");
                // $(this).parent('.pic_selt').removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
            }
        });
        $("#selAll").val("全部选中");
        $(".pic_selt").removeClass("pic_selta4dbor").addClass("pic_seltfffbor");
    }
    showSelectCnt();
}


/**
 * 展示选中的个数
 */
function showSelectCnt() {
    var i = 0;
    var ids = "";
    $(".pic_selt input[name='pic']").each(function () {
        if ($(this).val() == "1") {
            i++;
            ids += this.id + ",";
        }
    });
    if (ids.length > 0) {
        ids = ids.substring(0, ids.length - 1);
    }
    $("#select_ids").val(ids);
    $("#selCnt").html("已选中" + i + "张");
}

/**
 * 差值弹窗 图片选中效果
 */
function picClk() {
    $(".pic_selt").click(function () {
        if ($($(this).children("input").get(0)).val() != "0") {
            if ($(this).hasClass("pic_seltfffbor")) {
                $(this).removeClass("pic_seltfffbor");
                $(this).addClass("pic_selta4dbor");
                $(this).children('input').val("1");
            } else {
                $(this).addClass("pic_seltfffbor");
                $(this).removeClass("pic_selta4dbor");
                $(this).children('input').val("-1");
            }

        } else {
            $(this).addClass("pic_seltfffbor");
            $(this).removeClass("pic_selta4dbor");
            $(this).children('input').val("0");
        }
        showSelectCnt();
    });

}


/**
 * 关闭图片窗口
 */
function closePicsModal() {
    clearPicsModal();
    scrollCont = 0;
    showMsg = true;
    $("#dvalueModal").modal('hide');

    if (isPlay) {
        is_change = true;
    } else {
        isPlay = false;
    }
}

function clearPicsModal() {
    $("#pic_scroll").html("");//清空所有图片
    $("#picsTitle").html("");//标题
    $("#zipName").val("");//下载文件名称
    $("#select_ids").val("");//所有选中的id
    $("#selCnt").html("");//展示选中的张数
    $("#selAll").val("全部选中");
}

/**
 * 污染云图图片下载
 */
function downLoadPics() {
    var files = $("#select_ids").val();
    if (files == "" || files.left < 1) {
        layer.msg("请选择下进行下载的图片");
    } else {
        // var downUrl = $.coreApiPath+"/file/download/cloudImg/zip?files=370800/wz/pm25/Neareast_RBF/day/20170906.png,370800/wz/pm25/Neareast_RBF/day/20170905.png&zipName=test"
        // window.open(downUrl);

        document.getElementById("picDownForm").submit();
    }

}