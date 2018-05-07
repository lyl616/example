var type = "pm25";
var stationType = "-1";
var s_stech_type_global = "6010";
var city_id_g = ""; //全局cityid
var pro_id_g = ""; //全局proid
var city_name_g = ""; //全局cityName
var show_type = "1";//1 默认  污染浓度   2  贡献率


$(function () {
    Geo.init();
    Geo.btn();

});


var Geo = {
    init: function () {
        city_id_g = parent.cityId;
        pro_id_g = parent.provinceId;
        city_name_g = parent.cityName;

        initStartTime();
        initS_stechType();
    },
    btn: function () {
        initSwitchBtn(queryCalendar);

        $('#pollution_type').change(function () {
            type = $(this).children('option:selected').val();
            var startTime = $("#startTime").val();
            if (startTime == "" || null == startTime)
                return false;
            queryCalendar();
        })
    }
};


function initStartTime() {
    var date = new Date().Format("yyyy-MM");
    $("#startTime").val(date);
}


/**
 * 查询日历
 */
function queryCalendar() {
    clearTabColr();
    var startTime = $("#startTime").val();

    var tl = new Date(startTime).Format("yyyy年MM月");
    var city = parent.cityName;

    var st = "";
    var stationIds = parent.cityName;
    var stechType = $("#s_stech_type").val().split("_")[0];
    var station_type = $("#station_type").val().split("_")[0];
    type = $("#pollution_type").val();
    if (stationIds != null && stationIds.trim() != "") {
        st = stationIds + "在";
    }


    var postData = {
        stationIds: $("#stationIds").val(),
        startTime: startTime,
        stationType: station_type,
        type: type,
        city: parent.cityId,
        stechType: stechType
    };


    var tmp = showUpper(type);

    if (show_type == "1") {
        $("#tab-title").html(city + "监测点" + st + tl + " " + tmp + " 24小时分布图");
        var url = $.backendApiPath + "/analysis/history/queryDayCalendar";
        ajax_post(url, postData, function (r) {
            if (r.result) {
                _init_table_concentration(r.data);
            }
        });
    } else if (show_type == "2") {
        $("#tab-title").html(city + "监测点" + st + tl + " " + tmp + " 24小时贡献率 (单位:%)");
        var url = $.backendApiPath + "/analysis/history/queryConRateDayCalendar";
        ajax_post(url, postData, function (r) {
            if (r.result) {
                _init_table_contribution(r.data);
            }
        });
    }


}

/**
 * 渲染污染浓度表格
 * @param data
 * @private
 */
function _init_table_concentration(data) {
    var dataMap = data.dataMap;
    var days = data.days;
    var start = data.start;
    var currentDate = start;
    stationType = $("#station_type").val().split("_")[0];
    for (var i = 1; i <= days; i++) {
        var trDay = $("#tr" + i); // 保存天数
        var tdHour = trDay.children("td");
        for (var j = 0; j < 24; j++) {
            var val = dataMap[currentDate];
            if (typeof(val) != "undefined") {
                if (val[0] != null) {

                    if (type == "co") {
                        if (val[0])
                            tdHour.eq(j).html(val[0].toFixed(2));
                    } else {
                        tdHour.eq(j).html(val[0].toFixed(0));
                    }
                    var clor = getColorByLevel(val[1]);
                    tdHour.eq(j).css('background-color', clor);
                    if ('aqi2' != type && 'aqi' != type && stationType != "97" && stationType != "98" && stationType != "99" && stationType != "100" && stationType != "101") {
                        addEventVal(tdHour.eq(j), i, j);
                        tdHour.eq(j).css('cursor', 'pointer');
                    } else {
                        tdHour.eq(j).css('cursor', 'default');
                    }
                } else {
                    tdHour.eq(j).html("");
                    tdHour.eq(j).css('background-color', "#FFFFFF");
                    tdHour.eq(j).css('cursor', 'default');
                }
            }

            currentDate = hourIncreWithReg(currentDate, 1, "yyyy-MM-dd HH:mm:ss");
        }
    }
}


/**
 * 贡献率表格
 * @param data
 * @private
 */
function _init_table_contribution(data) {
    var dataMap = data.dataMap;
    var days = data.days;
    var start = data.start;
    var currentDate = start;
    stationType = $("#station_type").val().split("_")[0];
    for (var i = 1; i <= days; i++) {
        var trDay = $("#tr" + i); // 保存天数
        var tdHour = trDay.children("td");
        for (var j = 0; j < 24; j++) {
            tdHour.eq(j).css('cursor', 'default');
            var val = dataMap[currentDate];
            if (typeof(val) != "undefined") {
                tdHour.eq(j).html(val[0]);
                // var f_color = val[0] < 0 ? "#00FF00" : "#FF0000";
                // tdHour.eq(j).css('color', f_color);
                var f_color = val[0] <= 0 ? "#029642" : "#B21200";
                tdHour.eq(j).css('color', f_color);
                tdHour.eq(j).css('font-weight', "normal");
            }
            currentDate = hourIncreWithReg(currentDate, 1, "yyyy-MM-dd HH:mm:ss");
        }
    }
}

// 为表格添加点击事件
function addEventVal(obj, a, b) {
    obj.bind('click', function () {
        shouTableLine(a, b);
    });
}

/**
 * 移除表格点击事件
 * @param obj
 */
function removeEventVal(obj) {
    obj.unbind("click");
}

/**
 * 点击表格td 显示小时拆线图
 * @param day
 * @param hour
 */
function shouTableLine(day, hour) {
    var cityID = parent.cityId;
    var time = $("#startTime").val() + "-";
    if (Number(day) <= 9) {
        time += "0";
    }
    time += day;
    time += " ";
    if (Number(hour) <= 9) {
        time += "0";
    }
    time += hour;

    $("#cellModal").modal('show');

    $("#span1").html( showUpper(type) + '分钟趋势图');
    var stationParams = {
        cityId: cityID,
        nowDate: time,
        conType: type,
        cellTooltipTitle: "分钟",
        stationType: stationType
    };
    clearChar("cell_charts");

    var url = $.backendApiPath + "/analysis/history/table/allStationsHourdata";

    ajax_post(url, stationParams, function (data) {
        showCellLine(data, stationParams, hour);
    });
}

function showCellLine(data, param, hour) {

    var hourDate = new Date($("#startTime").val());
    hourDate.setHours(hour);
    var myChart = echarts.init(document.getElementById('cell_charts')),
        titleHtml = hourDate.Format('yyyy年MM月dd日 hh时');
    var option = {
        title: {
            left: 'center',
            textStyle: {
                fontSize: 12
            },
            text: titleHtml
        },
        tooltip: {
            trigger: 'axis',
            formatter: param.cellTooltipTitle + '：{b}<br/>' + param.conType + '：{c}'
        },
        toolbox: {
            right: "25px",
            show: true,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '50px',
            bottom: '20px',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: data.xAxis
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            type: 'line',
            data: data.datas
        }]
    };
    myChart.setOption(option);
}

/*******************************************************/

/**
 * 设备类型
 */
function initS_stechType() {
    var opts = {};
    opts.objID = "s_stech_type";
    opts.type = "11";
    opts.parentID = "";
    opts.cityID = city_id_g;
    opts.proID = pro_id_g;
    opts.isAll = false;
    opts.callBack = init_station_type;

    init_s_stech_type_option(opts);

    $('#s_stech_type').change(function () {
        s_stech_type_global = $(this).children('option:selected').val().split("_")[0];
        var codeId = $(this).children('option:selected').val().split("_")[1];

        var _html_all = '<option value="aqi2">AQI</option><option value="aqi">标准AQI</option><option value="pm25" selected>PM25</option><option value="pm10">PM10</option><option value="co">CO</option><option value="so2">SO2</option><option value="o3">O3</option><option value="no2">NO2</option>';
        var _html_1 = '<option value="aqi2">AQI</option><option value="aqi">标准AQI</option><option value="pm25" selected>PM25</option>';
        var _html_2 = '<option value="pm10" selected>PM10</option>';
        $("#pollution_type").empty();
        if (s_stech_type_global == "1010") {
            $("#pollution_type").append(_html_1);
        } else if (s_stech_type_global == "101") {
            $("#pollution_type").append(_html_2);
        } else {
            $("#pollution_type").append(_html_all);
        }
        type = $("#pollution_type").val();
        init_station_type();
    });
}

/**
 * 站点类型
 * @param codeId code数据的ID
 */
function init_station_type() {
    var codeID = $("#s_stech_type").val().split("_")[1];
    var opts = {};
    opts.objID = "station_type";
    opts.type = "4";
    opts.parentID = codeID;
    opts.cityID = city_id_g;
    opts.proID = pro_id_g;
    opts.isAll = true;
    opts.callBack = queryCalendar;
    init_station_type_option(opts);

    $('#station_type').change(function () {
        stationType = $(this).children('option:selected').val().split("_")[0];
        var startTime = $("#startTime").val();
        if (startTime == "" || null == startTime)
            return false;
        queryCalendar();
    });
}