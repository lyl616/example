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
    },
    btn: function () {
        initSwitchBtn(requestStationTable);

        $('#conType').change(function () {
            type = $(this).children('option:selected').val();
            var startTime = $("#startTime").val();
            if (startTime == "" || null == startTime)
                return false;
            requestStationTable();
        });
    }

};

function initStartTime() {
    var date = new Date().Format("yyyy-MM-dd");
    $("#startTime").val(date);
}

/**
 * 查询
 */
function requestStationTable() {
    var startTime = $("#startTime").val()
    endTime = startTime + " 23:59:59",
        type = $("#conType").val(),
        tl = new Date(startTime).Format("yyyy年MM月dd日"),
        city = parent.cityId,
        cityName = parent.cityName,
        stechType = '', station_type = '';
    if ($("#s_stech_type").val()) {
        stechType = $("#s_stech_type").val().split("_")[0];
    }
    if ($("#station_type").val()) {
        station_type = $("#station_type").val().split("_")[0];
    }
    var params = {
        cityId: city,
        start: startTime,
        end: endTime,
        conType: type,
        stationType: station_type,
        intervalType: "hour",
        stechType: stechType
    };


    var tmp = showUpper(type);

    if (show_type == "1") {
        $("#level_table_title").html(cityName + "监测点" + tl + " " + tmp + " 24小时分布图");
        $("#level_table").html("");
        var url = "../../json/station/station_day_queryCityCharts.json";
        ajax_post(url, params, function (data) {
            initTableCharts(data);
        });
    } else if (show_type == "2") {
        $("#level_table_title").html(cityName + "监测点" + tl + " " + tmp + " 24小时贡献率 (单位:%)");
        $("#level_table").html("");
        var url = "../../json/station/station_day_queryConRateCharts.json";
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
    ltab.html("");
    var html = "";
    //head row
    html += '<tr><td class="level-hour">站号</td><td class="level-hour">名称</td>';
    for (var h = 0; h <= 23; h++) {
        html += '<td class="level-hour">' + h + '</td>';
    }
    html += '</tr>';

    for (var key in data) {
        html += '<tr id="' + key.split("$")[0] + '">';

        html += '<td class="fixed-td-nbd level-hour">' + key.split("$")[0] + '</td>';
        html += '<td class="fixed-td-nbd level-hour">' + key.split("$")[1] + '</td>';

        for (var h = 0; h <= 23; h++) {
            if ('aqi2' != type && 'aqi' != type && "97" != stationType && "98" != stationType && "99" != stationType && "100" != stationType) {
                html += '<td id="h_' + h + '" class="level-hour" style="text-align:center;font-size:12px;"></td>';
            } else {
                html += '<td id="h_' + h + '" class="level-hour" style="text-align:center;font-size:12px;"></td>';
            }
        }
        html += '</tr>';
    }
    //last row
    html += '<tr><td class="level-hour">站号</td><td class="level-hour">名称</td>';
    for (var h = 0; h <= 23; h++) {
        html += '<td class="level-hour">' + h + '</td>';
    }
    html += '</tr>';
    ltab.html(html);
    insertTableColor(data);
}

function insertTableColor(data) {
    for (var key in data) {
        var arrData = data[key];

        for (var stationKey in arrData) {

            var rowDate = new Date(stationKey),
                h = rowDate.getHours(),
                id = key.split("$")[0] + " #h_" + rowDate.getHours(),
                colorLab = '',
                value = '',
                stechType = '';

            var tdId = $("#" + id);
            var
                tdData = arrData[stationKey].split("$");

            var validComment = tdData[2];

            if (arrData[stationKey]) {
                colorLab = tdData[0];
                value = tdData[1];
            }

            if ($("#s_stech_type").val()) {
                stechType = $("#s_stech_type").val().split("_")[0];
            }

            if (true) {
                // if (stechType == "6010" || stechType == "1010") {

                // if ('aqi2' != type && 'aqi' != type && "97" != stationType && "98" != stationType && "99" != stationType && "100" != stationType) {
                //     tdId.css('cursor', 'pointer');
                //     addEventVal(tdId, h, key.split("$")[0], key.split("$")[1]);
                // }else{
                //     tdId.css('cursor', 'default');
                // }


                tdId.css('cursor', 'pointer');
                addEventVal(tdId, h, key.split("$")[0], key.split("$")[1]);

                if (type == "aqi" || type == "aqi2") {
                    if (validComment != null && validComment != "") {
                        var tdh = "<span onmouseover=\"showTip('" + validComment + "','" + id + "')\" onmouseout=\"hideTip()\">" + value + "*</span>";
                        tdId.html(tdh);
                    } else {
                        tdId.html(value);
                    }
                } else {
                    tdId.html(value);
                }

            } else {
                tdId.html(value);
            }

            tdId.css('background-color', colorLab);


        }
    }
}

function showT(msg, that) {
    layer.tips(msg, that, {tips: 1, time: 0}); //在元素的事件回调体中，follow直接赋予this即可
}


function addEventVal(obj, day, stationId, stationName) {
    obj.bind('click', function () {
        shouTableLine(day, stationId, stationName);
    });
}

function shouTableLine(hour, stationId, stationName) {
    var cityID = parent.cityId;
    var time = $("#startTime").val() + " ";
    if (Number(hour) <= 9) {
        time += "0";
    }
    time += hour;

    $("#span1").html(type + '小时趋势图');

    $("#cellModal").modal('show');
    var stationParams = {};
    stationParams.cityId = cityID;
    stationParams.nowDate = time;
    stationParams.conType = type;
    stationParams.stations = stationId;
    stationParams.cellTooltipTitle = "分钟";
    $("#cell_charts").empty();
    ajax_get('../../json/station/station_day_hourdata.json', stationParams, function (data) {
        showCellLine(data, stationParams, stationName, hour);
    });
}

function showCellLine(data, param, stationName, hour) {
    var hourDate = new Date($("#startTime").val());
    hourDate.setHours(hour);
    var myChart = echarts.init(document.getElementById('cell_charts')),
        titleHtml = stationName + "（" + hourDate.Format('yyyy年MM月dd日 hh时') + "）";
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
        grid: {
            left: '5%',
            right: '5%',
            top: '50px',
            bottom: '20px',
            containLabel: true
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

/**
 * 贡献率表格
 * @param data
 * @private
 */
function _init_contribution_table(data) {
    var ltab = $("#level_table");
    var html = "";
    //head row
    html += '<tr><td class="level-hour">站号</td><td class="level-hour">名称</td>';
    for (var h = 0; h <= 23; h++) {
        html += '<td class="level-hour">' + h + '</td>';
    }
    html += '</tr>';

    for (var key in data) {
        html += '<tr id="' + key.split("$")[0] + '">';

        html += '<td class="fixed-td-nbd level-hour">' + key.split("$")[0] + '</td>';
        html += '<td class="fixed-td-nbd level-hour">' + key.split("$")[1] + '</td>';

        for (var h = 0; h <= 23; h++) {
            if ('aqi' != type && "97" != stationType && "98" != stationType && "99" != stationType && "100" != stationType) {
                html += '<td id="h_' + h + '" class="level-hour" style="text-align:center;font-size:12px;"></td>';
            } else {
                html += '<td id="h_' + h + '" class="level-hour" style="text-align:center;font-size:12px;"></td>';
            }
        }
        html += '</tr>';
    }
    //last row
    html += '<tr><td class="level-hour">站号</td><td class="level-hour">名称</td>';
    for (var h = 0; h <= 23; h++) {
        html += '<td class="level-hour">' + h + '</td>';
    }
    html += '</tr>';
    ltab.html(html);
    insertTableVal(data);
}

/**
 * 填充贡献率
 * @param data
 */
function insertTableVal(data) {
    for (var key in data) {
        var arrData = data[key];
        for (var stationKey in arrData) {
            var rowDate = new Date(stationKey);
            var h = rowDate.getHours();
            var tdId = $("#" + key.split("$")[0] + " #h_" + rowDate.getHours());
            var value = arrData[stationKey].split("$")[1];
            tdId.text(value);
            // var f_color = value < 0 ? "#00FF00" : "#FF0000";
            var f_color = value <= 0 ? "#029642" : "#B21200";
            tdId.css('color', f_color);
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

        var _html_all = '<option value="aqi2">AQI</option><option value="aqi">标准AQI</option><option value="pm25" selected>PM25</option><option value="pm10">PM10</option><option value="co">CO</option><option value="so2">SO2</option><option value="o3">O3</option><option value="no2">NO2</option>';
        var _html_1 = '<option value="aqi2">AQI</option><option value="aqi">标准AQI</option><option value="pm25" selected>PM25</option>';
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