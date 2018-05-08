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
    },
    btn: function () {
        initSwitchBtn(requestStationTable);
        $('#conType').change(function () {
            type = $(this).children('option:selected').val();
            var startTime = $("#startTime").val();
            if (startTime == "" || null == startTime) {
                return false;
            }
            requestStationTable();
        });
    }
};

function initStartTime() {
    var date = new Date().Format("yyyy-MM");
    $("#startTime").val(date);
}

function requestStationTable() {
    var startTime = $("#startTime").val();
    var endTime = startTime + "-31 23:59:59";
    startTime = startTime + "-01"
    var type = $("#conType").val();
    var tl = new Date(startTime).Format("yyyy年MM月");
    var city = parent.cityId;
    var cityName = parent.cityName;
    var stechType = $("#s_stech_type").val().split("_")[0];
    var station_type = $("#station_type").val().split("_")[0];
    var params = {
        cityId: city,
        start: startTime,
        end: endTime,
        conType: type,
        stationType: station_type,
        intervalType: "day",
        stechType: stechType
    };
    if (show_type == "1") {
        $("#level_table_title").html(cityName + "所有监测点" + tl + " " + (type.toUpperCase()) + " 按天分布图");
        $("#level_table").html("");
        var url ="../../json/station/station_month_queryCityCharts.json";
        ajax_post(url, params, function (data) {
            initTableCharts(data);
        });
    } else if (show_type == "2") {
        $("#level_table_title").html(cityName + "所有监测点" + tl + " " + (type.toUpperCase()) + " 按天贡献率 (单位:%)");
        $("#level_table").html("");
        var url = "../../json/station/station_month_queryConRateCharts.json";
        ajax_post(url, params, function (data) {
            _init_contribution_table(data);
        });
    }
}

/**
 * 渲染污染浓度表格
 * @param data
 */
function initTableCharts(data) {
    var ltab = $("#level_table");
    var html = "";
    // first row
    html += '<tr><td>站号</td><td>名称</td>';
    for (var h = 1; h <= 31; h++) {
        html += '<td>' + h + '</td>';
    }
    html += '</tr>';
    for (var key in data) {
        html += '<tr id="' + key.split("$")[0] + '">';
        html += '<td>' + key.split("$")[0] + '</td>';
        html += '<td>' + key.split("$")[1] + '</td>';
        for (var h = 1; h <= 31; h++) {
            // html += '<td id="h_' + h + '" class="level-hour" style="text-align:center;font-size:12px;" onclick="shouTableLine(' + h + ',' + key + ')"></td>';
            html += '<td id="h_' + h + '"></td>';
        }
        html += '</tr>';
    }
    // last row
    html += '<tr><td>站号</td><td>名称</td>';
    for (var h = 1; h <= 31; h++) {
        html += '<td>' + h + '</td>';
    }
    html += '</tr>';
    ltab.html(html);
    insertTableColor(data);
}

/**
 * 为污染尝试表格填充值
 * @param data
 */
function insertTableColor(data) {
    for (var key in data) {
        var arrData = data[key];
        for (var stationKey in arrData) {
            var rowDate = new Date(stationKey);
            var h = rowDate.getDate();
            var tdId = $("#" + key.split("$")[0] + " #h_" + h);
            addEventVal(tdId, h, key.split("$")[0], key.split("$")[1]);
            var colorLab = arrData[stationKey].split("$")[0];
            var value = arrData[stationKey].split("$")[1];
            tdId.css('background-color', colorLab);
            tdId.text(value);
        }
    }
}

function addEventVal(obj, day, stationId, stationName) {
    obj.bind('click', function () {
        shouTableLine(day, stationId, stationName);
    });
}

function shouTableLine(day, stationId, stationName) {
    var cityID = parent.cityId;
    var time = $("#startTime").val() + "-";
    if (Number(day) <= 9) {
        time += "0";
    }
    time += day;
    var conType = $("#conType").val();
    $("#cellModal").modal('show');
    $("#span1").html(conType + '天趋势图');
    var stechType = $("#s_stech_type").val().split("_")[0];
    var stationParams = {
        cityId: cityID,
        nowDate: time,
        conType: conType,
        stations: stationId,
        stationType: stationType,
        cellTooltipTitle: "小时",
        stechType: stechType
    };
    clearChar("cell_charts");
    // ajax_post($.coreApiPath + "/analysis/realtime/table/daydata", stationParams, function (data) {
    ajax_post("../../json/station/station_month_daydata.json", stationParams, function (data) {
        showCellLine(data, stationParams, stationId, time);
    });
}

function showCellLine(data, param, stationName, time) {
    var hourDate = new Date(time);
    var myChart = echarts.init(document.getElementById('cell_charts')),
        titleHtml = stationName + "（" + hourDate.Format('yyyy年MM月dd日') + "）";
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

function _init_contribution_table(data) {
    var ltab = $("#level_table");
    var html = "";
    // first row
    html += '<tr><td>站号</td><td>名称</td>';
    for (var h = 1; h <= 31; h++) {
        html += '<td>' + h + '</td>';
    }
    html += '</tr>';
    for (var key in data) {
        html += '<tr id="' + key.split("$")[0] + '">';
        html += '<td>' + key.split("$")[0] + '</td>';
        html += '<td>' + key.split("$")[1] + '</td>';
        for (var h = 1; h <= 31; h++) {
            html += '<td id="h_' + h + '"></td>';
        }
        html += '</tr>';
    }
    // last row
    html += '<tr><td>站号</td><td>名称</td>';
    for (var h = 1; h <= 31; h++) {
        html += '<td>' + h + '</td>';
    }
    html += '</tr>';
    ltab.html(html);
    insertTablPercent(data);
}

/**
 * 填充贡献率
 * @param data
 */
function insertTablPercent(data) {
    for (var key in data) {
        var arrData = data[key];
        for (var stationKey in arrData) {
            var rowDate = new Date(stationKey);
            var h = rowDate.getDate();
            var tdId = $("#" + key.split("$")[0] + " #h_" + h);
            var value = arrData[stationKey].split("$")[1];
            tdId.text(value);
            // var f_color = value < 0 ? "#00FF00" : "#FF0000";
            var f_color = value <= 0 ? "#029642" : "#B21200";
            tdId.css('color', f_color);
            tdId.css('font-weight', "normal");
        }
    }
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
        $("#conType").empty();
        if (s_stech_type_global == "1010") {
            $("#conType").append(_html_1);
        } else if (s_stech_type_global == "101") {
            $("#conType").append(_html_2);
        } else {
            $("#conType").append(_html_all);
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
    opts.callBack = requestStationTable;
    init_station_type_option(opts);
    $('#station_type').change(function () {
        stationType = $(this).children('option:selected').val().split("_")[0];
        var startTime = $("#startTime").val();
        if (startTime == "" || null == startTime)
            return false;
        requestStationTable();
    });
}