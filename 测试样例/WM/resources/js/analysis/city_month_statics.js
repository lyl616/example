/**
 *
 */
var type = "pm25";
var stationType = "-1";
var s_stech_type_global = "6010";
var city_id_g = ""; //全局cityid
var pro_id_g = ""; //全局proid
var city_name_g = ""; //全局cityName
var show_type = "1"; //1 默认  污染浓度   2  贡献率
parent.cityName = "济宁";
parent.cityId = 370800;


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
        clickStationType();
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

function clickStationType() {
    $("#station_type").change(function () {
        var type = $(this).val().split("_")[0];
        var cityId = parent.cityId;
        initSelect({
            id: "stations",
            all: false,
            url: "station/query/station/type/" + type + "/" + cityId,
            value: "stationId",
            text: "stationId"
        });
    });
}

function initStartTime() {
    var date = new Date().Format("yyyy");
    $("#startTime").val(date);
}

function queryCalendar() {
    clearTabColr();
    var startTime = $("#startTime").val();

    var tl = new Date(startTime).Format("yyyy年");
    var city = parent.cityName;

    var st = "";
    var stationIds = $("#stationIds").val();

    var stechType = $("#s_stech_type").val().split("_")[0];
    var station_type = $("#station_type").val().split("_")[0];
    type = $("#pollution_type").val();
    if (stationIds != null && stationIds.trim() != "") {
        st = stationIds + "在";
    }

    stationType = $("#station_type").val().split("_")[0];
    type = $("#pollution_type").val();
    var postData = {
        stationIds: $("#stationIds").val(),
        startTime: startTime,
        stationType: station_type,
        city: parent.cityId,
        type: type,
        stechType: stechType
    };
    if (show_type == "1") {
        $("#tab-title").html(city + "监测点" + st + tl + " " + (type.toUpperCase()) + " 按天分布图");
        var url = "../../json/citydata/citydata_queryMonthCalendar.json";
        ajax_post(url, postData, function (r) {
            if (r.result) {
                _init_table_concentration(r.data);
            }
        });
    } else if (show_type == "2") {
        $("#tab-title").html(city + "监测点" + st + tl + " " + (type.toUpperCase()) + " 按天贡献率 (单位:%)");
        var url = "../../json/citydata/citydata_queryConRateMonthCalendar.json";
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

    var startTime = $("#startTime").val();
    var dataMap = data.dataMap;
    var month = data.month;
    var start = data.start;
    var currentDate = start;
    for (var i = 1; i <= month; i++) {
        var trDay = $("#tr" + i); // 循环月份
        var tdHour = trDay.children("td"); // 获取当前行的所有td 默认31
        var days = getDayOfMonth(startTime, i); // 计算当前月有多少天
        for (var j = 0; j < days; j++) {
            var val = dataMap[currentDate];
            if (typeof(val) != "undefined") {
                if (val[0] != null) {
                    if (type == "co") {
                        tdHour.eq(j).html(val[0].toFixed(2));
                    } else {
                        tdHour.eq(j).html(val[0].toFixed(0));
                    }
                    var clor = getColorByLevel(val[1]);
                    tdHour.eq(j).css('background-color', clor);
                    tdHour.eq(j).css('cursor', 'pointer');
                    addEventVal(tdHour.eq(j), i, j + 1);
                } else {
                    tdHour.eq(j).html("");
                    tdHour.eq(j).css('background-color', "#FFFFFF");
                }
            }

            currentDate = dayIncre(currentDate, 1);
        }
    }
}

/**
 * 贡献率表格
 * @param data
 * @private
 */
function _init_table_contribution(data) {
    var startTime = $("#startTime").val();
    var dataMap = data.dataMap;
    var month = data.month;
    var start = data.start;
    var currentDate = start;
    for (var i = 1; i <= month; i++) {
        var trDay = $("#tr" + i); // 循环月份
        var tdHour = trDay.children("td"); // 获取当前行的所有td 默认31
        var days = getDayOfMonth(startTime, i); // 计算当前月有多少天
        for (var j = 0; j < days; j++) {
            var val = dataMap[currentDate];
            if (typeof(val) != "undefined") {
                tdHour.eq(j).html(val[0]);
                // var f_color = val[0] < 0 ? "#00FF00" : "#FF0000";
                var f_color = val[0] <= 0 ? "#029642" : "#B21200";
                tdHour.eq(j).css('color', f_color);
                tdHour.eq(j).css('font-weight', "normal");
            }
            currentDate = dayIncre(currentDate, 1);
        }
    }
}

function addEventVal(obj, a, b) {
    obj.bind('click', function () {
        shouTableLine(a, b);
    });
}

function removeEventVal(obj) {
    obj.unbind("click");
}

function shouTableLine(month, day) {
    var cityID = parent.cityId;
    var time = $("#startTime").val() + "-";
    if (Number(month) <= 9) {
        time += "0";
    }
    time += month + "-";
    if (Number(day) <= 9) {
        time += "0";
    }
    time += day;
    var conType = $("#pollution_type").val();
    stationType = $("#station_type").val().split("_")[0];

    $("#cellModal").modal('show');
    $("#span1").html(conType + '小时趋势图');

    var stationParams = {
        cityId: cityID,
        nowDate: time,
        conType: conType,
        cellTooltipTitle: "小时",
        stationType: stationType
    };
    clearChar("cell_charts");
    var url =  "../../json/citydata/citydata_allStationsDaydata.json";
    ajax_post(url, stationParams, function (data) {
        showCellLine(data, stationParams, time);
    });
}

//显示折线图
function showCellLine(data, param, time) {
    var hourDate = new Date(time);
    var myChart = echarts.init(document.getElementById('cell_charts')),
        titleHtml = hourDate.Format('yyyy年MM月dd日');
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

        var _html_all = '<option value="aqi">AQI</option><option value="pm25" selected>PM25</option><option value="pm10">PM10</option><option value="co">CO</option><option value="so2">SO2</option><option value="o3">O3</option><option value="no2">NO2</option>';
        var _html_1 = '<option value="aqi">AQI</option><option value="pm25" selected>PM25</option>';
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