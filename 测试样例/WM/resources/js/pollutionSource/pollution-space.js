var interval = 1;// 默认按小时查询

var start_index = 1;// 开始下标
var totalCount = 0;// 循环的总次数

var startTime = "";// 开始时间
var emdTime = "";// 结束时间
var currentTime = "";// 当前帧循环时间
var isInitMap = false;// 用于判断百度地图与ehcar结合 是不是初始化
var radius = "3000";// 检索半径
var BMapExt;
var map;
var container;

var polution_type = "aqi";
var cityId = "";
var province = "";
var cityName = "";

var stationData;
var stationValue;
var linkStation;

//定时器
var _TIMMER = [];
var is_change = false;// 定时器默认关闭

// 启动定时器
// window.setInterval(_TIMMER_TRIGER_, 1000);
window.setInterval(_TIMMER_TRIGER_, 5000);

function _TIMMER_TRIGER_() {
    if (is_change) {
        _TIMMER.To_DO();
    }
}

//触发函数
_TIMMER.To_DO = function () {
    go_next();
    show_tipbar();
    getCountryData();
    getPieData();

}

_TIMMER.Refresh = function () {
    resetTimerParams();
    start_index = 1;
    currentTime = startTime;
    is_change = true;
    if (isInitMap) {
        _clear_map_markers();
        map.clearOverlays();
    }
    clear_tipbar();
    _TIMMER.To_DO();
}

var reg = "yyyy-MM-dd HH";
$(function () {

    cityId = parent.cityId;
    province = parent.provinceId;
    cityName = parent.cityName;

    initWateStyle("startTime", "endTime");
    initStartEndDateWithReg(new Date(), 7, reg);
    $("#nowDate").html($("#startTime").val());
    initEcharBmap();
    switchTab($("#polution_type a"));

    $('#radius').change(function () {
        radius = $(this).children('option:selected').val();
        getCountryData();
    });

    resetTimerParams();// 初始化 查询参数
    $("#progressbar").progressbar({
        value: 0
    });

    getCountryData();
    getPieData();


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

    });

});

/**
 * 初始化时间
 */
function initTimeRange() {
    var date = new Date();
    $("#endTime").val(getCurDateDay(date));
    $("#startTime").val(getCurDateDayDecre(date, 7));
}

function initEcharBmap() {
    var data = [];
    require.config({
        paths: {
            echarts: $.ctx + '/resources/plugins/echarts2.0/doc/example/www/js'
        },
        packages: [{
            name: 'BMap',
            location: $.ctx + '/resources/plugins/echarts2.0/js/src',
            WMMAP: 'WMMAP'
        }]
    });

    require(['echarts', 'BMap', 'echarts/chart/map'],
        function (echarts, BMapExtension) {
            BMapExt = new BMapExtension($('#WMMAP')[0], BMap, echarts, {
                enableMapClick: false
            });

            map = BMapExt.getMap();
            container = BMapExt.getEchartsContainer();

            // 当前城市的经纬度
            // var startPoint = {
            //     x: 116.58553000,
            //     y: 35.41447000
            // };
            // var point = new BMap.Point(startPoint.x, startPoint.y);
            // map.centerAndZoom(point, 12);
            //按城市名称设置地图中心点
            map.centerAndZoom(cityName, 12);

            map.setMinZoom(10);
            map.setMaxZoom(15);
            map.enableScrollWheelZoom(true);

            option = {};
            var myChart = BMapExt.initECharts(container);
            BMapExt.setOption(option);
            isInitMap = true;
//			//点击弹出事件
//			myChart.on('click', function (params) {
//			    var city = params.name;
//			    showEchars(city); 
//			});

        })
}


// 路径配置
function getCountryData() {

    var info = "";
    var url = $.coreApiPath + "/pollutionSpace/getCountryStationData";

    var postData = {
        pro: province,
        city: cityId,
        polution_type: polution_type,
        radius: radius,
        stype: 99,
        interval: interval,
        insTime: currentTime
    };

    ajax(url, postData, function (r) {
        if (r.result) {

            var data = r.data;
            var stationData = data.geoCoordMap;
            var stationValue = data.stationValue;
            var linkStation = data.linkStation;
            if (!isInitMap) {
                initEcharBmap();
                isInitMap = true;
            } else {
                // 地图自定义样式
                var option = {
                    color: ['gold', 'aqua', 'lime'],
                    title: {
                        text: '',
                        subtext: '',
                        x: 'center',
                        textStyle: {
                            color: 'green' // #fff
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (v) {
                            return v[1].replace(':', ' > ');
                        }
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        feature: {
                            mark: {
                                show: false
                            },
                            dataView: {
                                show: false,
                                readOnly: false
                            },
                            restore: {
                                show: false
                            },
                            saveAsImage: {
                                show: false
                            }
                        }
                    },
                    dataRange: {
                        show: true,
                        min: 0,
                        max: 1,
                        x: 'right',
                        calculable: true, // #ff3333
                        // aqua
                        color: ['#99004C', '#FF0000', '#FF7E00', '#FFFF00',
                            '#00E500'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    series: [{
                        name: '',
                        type: 'map',
                        mapType: 'none',
                        data: [],
                        geoCoord: stationData,
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        if (params.data[1].value < 0.16666 && params.data[1].value >= 0) {
                                            return "#00E500";
                                        } else if (params.data[1].value < 0.33332 && params.data[1].value > 0.16666) {
                                            return "#FFFF00";
                                        } else if (params.data[1].value < 0.49998 && params.data[1].value > 0.33332) {
                                            return "#FF7E00";
                                        } else if (params.data[1].value < 0.66664 && params.data[1].value > 0.49998) {
                                            return "#FF0000";
                                        } else if (params.data[1].value < 0.8333 && params.data[1].value > 0.66664) {
                                            return "#99004C";
                                        } else if (params.data[1].value < 1 && params.data[1].value > 0.8333) {
                                            return "#7E0023";
                                        }
                                    },
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: linkStation
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function (v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: false,
                                shadowBlur: 0
                            },
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        if (params.data.value == 1) {
                                            return "#00E500";
                                        } else if (params.data.value == 2) {
                                            return "#FFFF00";
                                        } else if (params.data.value == 3) {
                                            return "#FF7E00";
                                        } else if (params.data.value == 4) {
                                            return "#FF0000";
                                        } else if (params.data.value == 5) {
                                            return "#99004C";
                                        } else if (params.data.value == 6) {
                                            return "#7E0023";
                                        } else {
                                            return 'purple';
                                        }
                                    }
                                }
                            },
                            data: stationValue
                        }

                    },]
                };

                var myChart = BMapExt.initECharts(container);
                BMapExt.setOption(option);
            }

        } else {
            initEcharBmap();
        }

    });

};

// 初始化饼状图数据
function getPieData() {

    var station_type = "";
    var info = "";
    startTime = $("#startTime").val();
    endTime = $("#endTime").val();
    var url = $.coreApiPath + "/pollutionSpace/getPieData"; // pollutionSpace/getCountryStationData";
    var postData = {
        pro: province,
        city: cityId,
        polution_type: polution_type,
        station_type: 99,
        startTime: startTime,             //  '2016-12-30 10:50:30',
        endTime: endTime                          //'2017-1-12 10:50:30'
    };
    ajax(url, postData, function (r) {
        if (r.result) {
            var data = r.data;
            var firstPieData = data.stationValue;
            var secondPieData = data.stationValue1;
            var thirdPieData = data.stationValue2;
            var stationName = data.stationValue4;

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            var myChart1 = echarts.init(document.getElementById('main1'));
            var myChart2 = echarts.init(document.getElementById('main2'));
            // 指定图表的配置项和数据
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                title: {
                    text: stationName[0] + currentTime,
                    textStyle: {
                        fontSize: 14,
                        x: 'center',
                        fontWeight: 'bolder',
                        color: '#333'
                    }
                },

                series: [{
                    name: polution_type + '污染比例',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (params.name == "优") {
                                    return "#00E500";
                                } else if (params.name == "良") {
                                    return "#FFFF00";
                                } else if (params.name == "轻度污染") {
                                    return "#FF7E00";
                                } else if (params.name == "中度污染") {
                                    return "#FF0000";
                                } else if (params.name == "重度污染") {
                                    return "#99004C";
                                } else if (params.name == "严重污染") {
                                    return "#7E0023";
                                } else {
                                    return 'purple';
                                }
                            }
                        }
                    },
                    data: firstPieData
                }]
            });
            myChart1.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                title: {
                    text: stationName[1] + currentTime,
                    textStyle: {
                        fontSize: 14,
                        x: 'right',
                        fontWeight: 'bolder',
                        color: '#333'
                    }
                },
                series: [{
                    name: polution_type + '污染比例',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (params.name == "优") {
                                    return "#00E500";
                                } else if (params.name == "良") {
                                    return "#FFFF00";
                                } else if (params.name == "轻度污染") {
                                    return "#FF7E00";
                                } else if (params.name == "中度污染") {
                                    return "#FF0000";
                                } else if (params.name == "重度污染") {
                                    return "#99004C";
                                } else if (params.name == "严重污染") {
                                    return "#7E0023";
                                } else {
                                    return 'purple';
                                }
                            }
                        }
                    },
                    data: secondPieData
                }]
            });
            myChart2.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                title: {
                    text: stationName[2] + currentTime,
                    textStyle: {
                        fontSize: 14,
                        x: 'right',
                        fontWeight: 'bolder',
                        color: '#333'
                    }
                },
                series: [{
                    name: polution_type + '污染比例',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (params.name == "优") {
                                    return "#00E500";
                                } else if (params.name == "良") {
                                    return "#FFFF00";
                                } else if (params.name == "轻度污染") {
                                    return "#FF7E00";
                                } else if (params.name == "中度污染") {
                                    return "#FF0000";
                                } else if (params.name == "重度污染") {
                                    return "#99004C";
                                } else if (params.name == "严重污染") {
                                    return "#7E0023";
                                } else {
                                    return 'purple';
                                }
                            }
                        }
                    },
                    data: thirdPieData
                }]
            })

        }
    })


}

function switchTab(a) {
    a.click(function () {
        $("#polution_type a").removeClass("btn-success");
        $(this).addClass("btn-success");
        polution_type = this.id;
//		polution_type = polution_type.substring(2);
        var src = $.ctx + "/resources/img/cloud/wm-legend-" + polution_type + ".png";
        $(".Legend img").attr("src", src);

        getCountryData();
        getPieData();
    });
}


/**
 * 站点弹出统计信息
 *
 * @param params
 */
function showEchars(params) {
    var stationId = "97567";
    var url = $.coreApiPath + "/pollutionSource/getEcharsByStationId";
    var postData = {
        stationId: stationId,
        pro: province,
        city: cityId,
        radius: radius,
        startTime: $("#startTime").val(),
        endTime: $("#endTime").val()
    };

    ajax(url, postData, function (r) {
        if (r.result) {
            intipolluBarNum(r.data.charMap);
        }
    });

    $("#echarsModal").modal("show");
}

/**
 * 国控点5公里的污染站点统计
 *
 * @param data
 */
function intipolluBarNum(data) {
    var elementById = document.getElementById('polluBarNum');

    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '60%',
                data: [10, 52, 200, 334, 390, 330, 220]
            }
        ]
    };
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(elementById);
    myChart.setOption(option);
}
