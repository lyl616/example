/**
 * 散点图统计
 */

var type = "aqi";
var reg = "yyyy-MM-dd HH";
var startTime = "",
    endTime = "";

var equipment_type = "0"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var s_stech_type = "6010"; //： 站点数据来源（设备类型） 单传感器 6010 ６传感器 1010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var stationType = "-1"; // 站点类型 -1：表示全部

var city = "",
    province = "";

$(function () {
    city = parent.cityId;
    province = parent.provinceId;
    // 始 时间
    initWateStyle("startTime", "endTime");
    initStartEndDateWithReg(new Date(), 7, reg);
    //初始化站点信息
    initS_stechType();

    switchTab($("#charsTab button"));

    //加载散点图
    // queryWeatherScatter();

});

function switchTab(a) {
    a.click(function () {
        type = this.id;
        type = type.substring(2);
        clearChar(type + "_scatter");
        queryWeatherScatter();

        ///////////使用button 模拟一个tab 的切换效果////////////
        $('#charsTab button').removeClass("btn-info");
        $(this).addClass("btn-info");
        $(".tab-pane").removeClass('active');
        $("#" + this.value).addClass('active').removeClass('fade');
    });
}

function clickStationType() {
    $("#station_type").change(function () {
        var type = $(this).val();
        var cityId = $("#city").val();
        initSelect({
            id: "stations",
            all: false,
            url: "station/query/station/type/" + type + "/" + cityId,
            value: "stationId",
            text: "stationId"
        });
    });
}

/**
 * 初始化开始结束 时间
 */
function initParams() {
    startTime = $("#startTime").val();
    endTime = $("#endTime").val();
}

function checkTime() {
    if (endTime == "" || startTime == "") {
        layer.msg("请选择开始或结时间 ！");
        return false;
    } else {
        if (startTime == endTime) {
            layr.msg("开始和结束时间不能一致");
            return false;
        }
    }
    return true;
}

/**
 * 查询数据散点
 */
function queryWeatherScatter() {
    clearChar(type + "_scatter");
    initParams();
    if (checkTime()) {
        var postData = {
            city: city,
            startTime: startTime,
            endTime: endTime,
            equipment_type: equipment_type,
            s_stech_type: s_stech_type,
            stationType: stationType,
            type: type
        };
        var url = "../../json/analysis/city_scatter.json";
        ajax_post_msg(url, postData, "加载", function (r) {
            if (r.result) {
                intiAqiScatter(r.data.charMap, type + "_scatter");
            }
        });
    }
}


function initTabPanes() {
    $('#charsTab button').removeClass("btn-info").removeClass("btn-white");
    $('#charsTab button').attr("disabled", "disabled");
    if (s_stech_type == "101") { //设备 类型为扬尘 只有pm10能用
        equipment_type = "4";
        if (s_stech_type == '101') {
            $('.nav-tabs button:eq(2)').addClass("btn-info"); //激活 （PM10）  button
            removeAttrByDomId("t_pm10", "disabled");
            $(".tab-pane").removeClass('active');
            $("#tab_pm10").addClass('active').addClass('in');
            type = "pm10";

        }
    } else if (s_stech_type == "1010") {//单传感器
        console.log("单传感器！");
        removeAttrByDomId("t_aqi", "disabled");
        removeAttrByDomId("t_pm25", "disabled");
        $('#charsTab li #t_aqi').addClass("btn-info");
        $('#charsTab li #t_pm25').addClass("btn-white");
        $(".tab-pane").removeClass('active').removeClass('in');
        $("#tab_aqi").addClass('active').addClass('in');
        equipment_type = "0";
        type = "aqi";
    } else {
        if (s_stech_type == "6010") {
            equipment_type = "0";
        } else if (s_stech_type == "5010") {
            equipment_type = "3";
        } else if (s_stech_type == "99" || s_stech_type == "98") {
            equipment_type = "4";
        }
        $('#charsTab button').removeAttr("disabled").addClass("btn-white");
        $('#charsTab li #t_aqi').addClass("btn-info");
        $(".tab-pane").removeClass('active').removeClass('in');
        $("#tab_aqi").addClass('active').addClass('in');
        type = "aqi";
    }
    queryWeatherScatter();
}

/**
 * 渲染数据散点图
 * @param data
 * @param domId
 */
function intiAqiScatter(data, domId) {

    var worldMapContainer = document.getElementById(domId);

    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
    var resizeWorldMapContainer = function () {
        worldMapContainer.style.width = window.innerWidth + 'px';
        worldMapContainer.style.height = window.innerHeight * 80 % +'px';
    };
    //设置容器高宽
    resizeWorldMapContainer();
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(worldMapContainer);

    // var myChart = echarts.init(document.getElementById(domId));
    var hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    var days = data.days;
    var data1 = data.data.map(function (item) {
        return [item[1], item[0], item[2], item[3]];
    });

    option = {
        title: {
            text: '24小时散点分布',
            left: 'center'
        },
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return days[params.value[1]] + ' ' + hours[params.value[0]] + '  <br/>' + type + ':   ' + params.value[2];
            }
        },
        grid: {
            x: 100,
            y: 50,
            x2: '5%',
            y2: 50
        },
        xAxis: {
            type: 'category',
            data: hours,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#999',
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                rotate: '45',
                margin: 10
            }
        },
        yAxis: {
            type: 'category',
            data: days,
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 20
            }
        },
        series: [{
            // name : '北京',
            type: 'scatter',
            symbolSize: function (val) {
                return getVlByLevel(val[3]);
            },
            itemStyle: {
                normal: {
                    color: function (params) {
                        return getColorByLevel(params.data[3]);
                    }
                }
            },
            data: data1,
            animationDelay: function (idx) {
                return idx * 3;
            }
        }]
    };
    // myChart.setOption(option);

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    //用于使chart自适应高度和宽度
    window.onresize = function () {
        //重置容器高宽
        resizeWorldMapContainer();
        myChart.resize();
    };
}

/**
 * 设备类型
 */
function initS_stechType() {
    var opts = {};
    opts.objID = "s_stech_type";
    opts.type = "11";
    opts.parentID = "";
    opts.cityID = city;
    opts.proID = province;
    opts.isAll = false;
    opts.callBack = init_station_type;

    init_s_stech_type_option(opts);

    $('#s_stech_type').change(function () {
        s_stech_type = $(this).children('option:selected').val().split("_")[0];
        initTabPanes();
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
    opts.cityID = city;
    opts.proID = province;
    opts.isAll = true;
    opts.callBack = queryWeatherScatter;
    init_station_type_option(opts);


    $('#station_type').change(function () {
        stationType = $(this).children('option:selected').val().split("_")[0];
        // queryWeatherScatter();
    });
}