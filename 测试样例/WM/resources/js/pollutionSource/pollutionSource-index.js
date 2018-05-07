/** ********************************************************************************** */
var pro = "";
var city = "";
var polution_type = "pm25";
var bMapChar;
var map;
var isInitMap = false;// 用于判断百度地图与ehcar结合 是不是初始化
var interval = 1;// 默认按小时查询
var radius = "5000";// 检索半径
var start_index = 1;// 开始下标
var totalCount = 0;// 循环的总次数

var startTime = "";// 开始时间
var emdTime = "";// 结束时间
var currentTime = "";// 当前帧循环时间
var reg = "yyyy-MM-dd HH";
var dateVal = 7;


var equipment_type = "4"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var s_stech_type = "99"; //： 站点数据来源（设备类型） 单传感器 6010 ６传感器 1010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var station_type = "99"; // 站点类型 -1：国控点


/** ********************************************************************************** */

$(function () {

    Geo.init();
    Geo.btn();

    getPubicStatin();
    getPollutionRepoInRange();
    getAirData();// 初始化温度湿度和风力风向

});
var Geo = {
    init: function () {
        initWateStyle("startTime", "endTime");
        initStartEndDateWithReg(new Date(), dateVal, reg);
        $("#nowDate").html($("#startTime").val());
        initEcharBmap("1", []);
        switchTab($("#polution_type a"));
        resetTimerParams();// 初始化 查询参数

        $("#progressbar").progressbar({
            value: 0
        });
        pro = parent.provinceId;
        city = parent.cityId;

    },
    btn: function () {
        // 点击上一帧
        $("#btn-pre").click(function () {
            // map.clearOverlays();
            go_pre();
            show_tipbar();
            getPubicStatin();
        });
        // 点击下一帧
        $("#btn-next").click(function () {
            // map.clearOverlays();
            go_next();
            show_tipbar();
            getPubicStatin();
        });

        $('#interval').change(function () {
            interval = $(this).children('option:selected').val();
            if (interval == "1") {
                reg = "yyyy-MM-dd HH";
                initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
            } else if (interval == "2") {
                reg = "yyyy-MM-dd";
                initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
            }
            $("#97DateTimeFmt").val(reg);
            initWateStyle("startTime", "endTime");
            _TIMMER.Refresh();
        });
        $('#radius').change(function () {
            radius = $(this).children('option:selected').val();
            // _TIMMER.Refresh();
            getPollutionRepoInRange();
            // getPubicStatin();
        });
    }

};

function queryStationByTime() {
    _TIMMER.Refresh();
}

/** *****************************定时器播放开始************************************************* */

// 定时器
var _TIMMER = [];
var is_change = false;// 定时器默认关闭

// 启动定时器
// window.setInterval(_TIMMER_TRIGER_, 1000);
window.setInterval(_TIMMER_TRIGER_, 3000);

function _TIMMER_TRIGER_() {
    if (is_change) {
        _TIMMER.To_DO();
    }
}

// 触发函数
_TIMMER.To_DO = function () {
    go_next();
    show_tipbar();
    getPubicStatin();
}

_TIMMER.Refresh = function () {
    resetTimerParams();
    start_index = 1;
    currentTime = startTime;
    is_change = false;
    if (markers.length > 0) {
        _clear_map_markers();
        markers = [];
    }
    clear_tipbar();
    _TIMMER.To_DO();
}

/** *****************************定时器播放结束************************************************* */

/**
 * 初始化国控站点信息
 */
function getPubicStatin() {
    var url = $.backendApiPath + "/pollutionSource/getStatinByStechType";
    if (interval == 1) {
        currentTime = currentTime.substring(0, 13) + ":00:00";
    }
    var postData = {
        pro: parent.provinceId,
        city: parent.cityId,
        polution_type: polution_type,
        radius: radius,
        equipment_type: equipment_type,
        s_stech_type: s_stech_type,
        station_type: station_type,
        interval: interval,
        insTime: currentTime
    };
    ajax(url, postData, function (r) {
        if (r.result) {
            var charData = r.data;
            if (!isInitMap) {
                initEcharBmap("2", charData);
            } else {
                bMapChar.setOption({
                    series: [{
                        data: charData.data
                    }]
                });
                bindClick(charData);
            }
            if (charData.charMap) {
                initPolluRoseNum(charData.charMap, "tubiao");
                $("#tubiao").show();
            } else {
                clearChar("tubiao");
                $("#tubiao").hide();
            }

            if (typeof (charData.charMap1) != "undefined" && charData.charMap1 != null) {
                initPolluRoseNum(charData.charMap1, "tubiao1");
                $("#tubiao1").show();
            } else {
                clearChar("tubiao1");
                $("#tubiao1").hide();
            }

            if (typeof (charData.charMap2) != "undefined" && charData.charMap2 != null) {
                initPolluRoseNum(charData.charMap2, "tubiao2");
                $("#tubiao2").show();
            } else {
                clearChar("tubiao2");
                $("#tubiao2").hide();
            }
            if (typeof (charData.charMap3) != "undefined" && charData.charMap3 != null) {
                initPolluRoseNum(charData.charMap3, "tubiao3");
                $("#tubiao3").show();
            } else {
                clearChar("tubiao3");
                $("#tubiao3").hide();
            }
            if (typeof (charData.charMap4) != "undefined" && charData.charMap4 != null) {
                initPolluRoseNum(charData.charMap4, "tubiao4");
                $("#tubiao4").show();
            } else {
                clearChar("tubiao4");
                $("#tubiao4").hide();
            }

            if (typeof (charData.otherMap) != "undefined" && charData.otherMap != null) {
                var otherMap = charData.otherMap;
                var power = otherMap.power;
                $("#power").html(power);
                var direction = otherMap.direction;
                var level = otherMap.level;

                var src = $.ctx + "/resources/img/airdata/" + direction + level + ".png";
                $("#direction img").attr("src", src);
            }
        }
    });
}

/**
 * 初始化 地图
 *
 * @param flag
 *            1 表示 直接初始化 没有数据 2 表示有数据后填充
 * @param charData
 */
function initEcharBmap(flag, charData) {
    var data = [];
    if (flag == "1") {
        bMapChar = echarts.init(document.getElementById('WMMAP'));
    } else if (flag == "2") {
        data = charData.data;
    }
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + "<br/>" + polution_type + " : " + params.value[2];
            }
        },
        bmap: {
            center: parent.cityName,
            zoom: 11,
            roam: true,
            mapStyle: {}
        },
        series: [{
            name: '国控点',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: data,
            symbolSize: function (val) {
                return getVlByLevel2(val[5]);
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: function (params) {
                        return getColorByLevel(params.data.value[5]);
                    },
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            zlevel: 1
        }]
    };
    bMapChar.setOption(option);
    if (flag == "1") {
        // 添加卫星及混合 地图控件
        map = bMapChar.getModel().getComponent('bmap').getBMap();

        isInitMap = true;
    } else if (flag == "2") {
        // 为echars 的点绑定点击事件
        bindClick(charData);
    }
}

/**
 * 为echars 添加 绑定==点击事件
 *
 * @param charData
 */
function bindClick(charData) {
    bMapChar.off("click");
    bMapChar.on('click', function (params) {
        showEchars(params);
    });
}

/**
 * 百度地图上标污染站点
 *
 * @param lstObj
 * @param map
 */
function bMapOpt(lstObj, map) {
    if (markers.length > 0) {
        _clear_map_markers();
        markers = [];
    }
    $.each(lstObj, function (i, sub_data) {
        if (sub_data != null && sub_data.length > 0) {
            // 添加 污染站点标注
            _add_bmap_makrer(map, sub_data, function (e) {
                var target = e.currentTarget;
                var obj_data = target.obj;
                showPollutionInModal(obj_data);
            });
        }
    });
}

/**
 * 标注国控站点关联的污染站信息
 *
 * @param map
 * @param data
 * @param onclickFunc
 */
// 添加标识(每个站点一个标识)
var markers = [];

function _add_bmap_makrer(map, data, onclickFunc) {
    var point = new BMap.Point(data[3], data[2]);
    var icon_path = $.coreApiPath + "/resources/img/pollutions/" + data[4] + ".png";
    var markIcon = new BMap.Icon(icon_path, new BMap.Size(39, 28), {
        offset: new BMap.Size(0, 0),
        imageSize: new BMap.Size(18, 18),
        imageOffset: new BMap.Size(0, 0)
    });
    var marker = new BMap.Marker(point, {
        icon: markIcon
    }); // 创建标注

    marker.obj = data[0];
    marker.onclick = onclickFunc;
    // 将标注添加到地图中
    map.addOverlay(marker);
    markers.push(marker);
}

/**
 * 海量叠加点 获取指定范围内的污染站点信息
 */
function getPollutionRepoInRange() {
    var url = $.backendApiPath + "/pollutionSource/getPollutionRepoInRange";
    var postData = {
        pro: parent.provinceId,
        city: parent.cityId,
        radius: radius
    };
    ajax(url, postData, function (r) {
        if (r.result) {
            addPointCollection(r.data);
        }
    });
}

var nodeDialg;
/**
 * 站点弹出统计信息
 *
 * @param params
 */
var temp = "1";

function showEchars(params) {
    if (is_change) {// 如果正在播放，则暂停
        is_change = false;
        temp = "2";
    }
    var stationId = params.value[3];
    if (interval == 1) {
        currentTime = currentTime.substring(0, 13) + ":00:00";
    }
    var url = $.backendApiPath + "/pollutionSource/getEcharsByStationId";
    var postData = {
        pro: parent.provinceId,
        city: parent.cityId,
        stationId: stationId,
        polution_type: polution_type,
        radius: radius,
        startTime: $("#startTime").val(),
        endTime: $("#endTime").val(),
        rtcTime: currentTime,
        interval: interval
    };

    clearChar("polluBarNum");
    clearChar("polluLineNum");
    clearChar("polluRoseNum");
    initLayreLoader();
    ajax(url, postData, function (r) {
        closeLayreLoader();
        if (r.result) {
            intipolluBarNum(r.data.charMap);
            initPolluLineNum(r.data.lineMap);
            initPolluRoseNum(r.data.charMap1, "polluRoseNum");
        }
    });

    $("#echarsModal").draggable();
    $("#echarsModal").modal("show");

}

function closeEcharsMode() {
    if (temp == "2") {
        is_change = true;
        temp = "1";
    }
    $("#echarsModal").modal("hide");
}

/**
 * 国控点5公里的污染站点统计
 *
 * @param data
 */
function intipolluBarNum(data) {
    var elementById = document.getElementById('polluBarNum');
    var option = {
        title: {
            text: data.title,
            textStyle: {
                fontSize: 11,
                fontWeight: 'bolder',
                color: '#333'
            },
            x: 'center',
            y: '10%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['污染站点']
        },
        xAxis: [{
            type: 'category',
            data: data.xAxis
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '个数',
            type: 'bar',
            data: data.yAxis
        }]
    };

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(elementById);
    myChart.setOption(option);
}

function initPolluLineNum(data) {
    var myChart = echarts.init(document.getElementById('polluLineNum'));

    var option = {
        title: {
//			text : '占比趋势分析',
            text: data.title,
            x: 'center',
            textStyle: {
                fontSize: 11,
                fontWeight: 'bolder',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: "{b0}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}:{c2}%<br />{a3}: {c3}%<br />" + "{a4}: {c4}%<br />{a5}: {c5}%"

        },
        legend: {
            data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'],
            textStyle: {
                fontSize: 10,
                fontWeight: 'bolder',
                color: '#333',
                itemWidth: 10,
                itemHeight: 5
            },
            y: '10%'
        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.xAxis
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%' // 在这加%
            }
        },
        series: [{
            name: '优',
            type: 'bar',
            stack: '总量',
            data: data.data1,
            itemStyle: {
                normal: {
                    color: '#00E500'
                }
            }
        }, {
            name: '良',
            type: 'bar',
            stack: '总量',
            data: data.data2,
            itemStyle: {
                normal: {
                    color: '#FFFF00'
                }
            }
        }, {
            name: '轻度污染',
            type: 'bar',
            stack: '总量',
            data: data.data3,
            itemStyle: {
                normal: {
                    color: '#FF7E00'
                }
            }
        }, {
            name: '中度污染',
            type: 'bar',
            stack: '总量',
            data: data.data4,
            itemStyle: {
                normal: {
                    color: '#FF0000'
                }
            }
        }, {
            name: '重度污染',
            type: 'bar',
            stack: '总量',
            data: data.data5,
            itemStyle: {
                normal: {
                    color: '#99004C'
                }
            }
        }, {
            name: '严重污染',
            type: 'bar',
            stack: '总量',
            data: data.data6,
            itemStyle: {
                normal: {
                    color: '#7E0023'
                }
            }
        }]
    };

    myChart.setOption(option);
}

/**
 * 八方玫瑰图
 *
 * @param data
 * @param domId
 */
function initPolluRoseNum(data, domId) {
    var myChar = echarts.init(document.getElementById(domId));
    var option = {
        title: {
            text: data.title,
            x: 'center',
            textStyle: {
                fontSize: 10,
                fontWeight: 'bolder',
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: polution_type + "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            name: '八方均值',
            type: 'pie',
            center: ['60%', '45%'],// 圆心坐标，支持绝对值（px）和百分比，百分比计算min(width, height) * 40%
            radius: ['10%', '75%'],
            startAngle: '90',
            roseType: 'area',// 百分比计算比，min(width, height) / 2 * 75%， 传数组实现环形图，[内半径，外半径]
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    color: function (params) {
                        var val = params.data.value;
                        var rang = getRangeByType(polution_type);
                        var lev = computeLevel(val, rang);
                        return getColorByLevel(lev);
                    },
                    borderColor: "white",
                    borderWidth: 2
                },
                emphasis: {
                    label: {
                        show: false,
                        position: 'inner'
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            data: data.listObj
        }]
    };
    myChar.setOption(option);
}

function switchTab(a) {
    a.click(function () {
        $("#polution_type a").removeClass("btn-success");
        $(this).addClass("btn-success");
        polution_type = this.id;
        // polution_type = polution_type.substring(2);
        var src = "../resources/img/wm-legend-" + polution_type + ".png";
        $(".Legend img").attr("src", src);

        getPubicStatin();
    });

}

/**
 * 初始化温度湿度和风力风向
 */
function getAirData() {
    var city = parent.cityId;
    $.ajax({
        type: "POST",
        url: $.backendApiPath + "/pollutionSource/getAirData",
        data: {
            city: city,
            interval: interval,
            startTime: $("#startTime").val(),
            endTime: $("#endTime").val()
        },
        datatype: "json",
        success: function (data) {
            // tempHumidityBoxCharts(data);
            tempHumidityCharts("temp_humidity_charts", data.xAxis, data.tempHumiditySerie)
        }
    });
}

// 温度-湿度 曲线
function tempHumidityCharts(id, xdata, seriesData) {
    var temperateChart = echarts.init(document.getElementById(id));
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['温度', '湿度']
        },
        grid: {
            bottom: '20px',
            left: '20px',
            right: '25px'
        },
        xAxis: {
            data: xdata
        },
        yAxis: [{
            name: '温度',
            type: 'value'
        }, {
            name: '湿度',
            type: 'value'
        }],
        series: seriesData
    };
    // console.info(JSON.stringify(option));
    temperateChart.setOption(option);
}

/**
 * 显示温湿度箱线图
 *
 * @param {Object}
 *            data
 */
function tempHumidityBoxCharts(data) {
    var tempData = echarts.dataTool.prepareBoxplotData([data.tempData]);
    var humidityData = echarts.dataTool.prepareBoxplotData([data.humidityData]);
    var temperateChart = echarts.init(document.getElementById("temp_humidity_charts"));
    var xs = data.xAxis;
    if (xs.length == 0) {
        xs = ['无数据'];
    }
    var option = {
        backgroundColor: '#f5f5f5',
        legend: {
            data: ['温度', '湿度']
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        // grid : {
        // bottom : '5px',
        // top : '20%',
        // left : '5%',
        // right : '20px'
        // },
        xAxis: {
            type: 'category',
            data: xs,
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
                show: true
            },
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            splitArea: {
                show: false
            }
        },
        series: [{
            name: '温度',
            type: 'boxplot',
            data: tempData.boxData,
            tooltip: {
                formatter: formatterBox
            }
        }, {
            name: '湿度',
            type: 'boxplot',
            data: humidityData.boxData,
            tooltip: {
                formatter: formatterBox
            }
        }]
    };
    temperateChart.setOption(option);
}

/**
 * 温湿度箱线图 自定义显示
 *
 * @param {Object}
 *            param
 */
function formatterBox(param) {
    return [param.name + ': ',
        '最大值: ' + param.data[4], 'Q1: ' + param.data[1], 'Q2:' + param.data[2], 'Q3: ' + param.data[3],
        '最小值: ' + param.data[0]].join('<br/>')
}

function closePollution() {
    $("#pollutionInfo").hide();
    // $(".Map-All").css("margin-top","50px");
}
