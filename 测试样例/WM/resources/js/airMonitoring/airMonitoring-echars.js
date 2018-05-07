/**
 * 大气监测新版 生成 echars 的公用 文件
 */

var hasAirMonitoring = false;


function realHisTop10Char() {
    var _self = airMonitoringVM;
    $.getJSON('../../json/airMonitoring/wzTop10.json', {
        domainId: _self.currentCity,
        rtcTime: _self.siteParam.result.hour.wzCalcEndTime,
        pollutionType: _self.currentPollutionType
    }, function (json) {
        if (json.erroCode == 2000) {
            var maxValue = getMaxDataByType(_self.currentPollutionType);
            var html = "";
            //生成canvas矩形
            $.each(json.result, function (i, val) {
                if (i >= 7) {
                    var scrrenHeight = $(window).height();
                    if (scrrenHeight <= 673) {
                        _self.judgeSscreen = true;
                        return;
                    }
                }
                var pvalue = val.pvalue > maxValue ? maxValue : val.pvalue;
                html += '<div class="toptenTitle" onclick="showSearchStationInfo(' + val.stationId + ')">' + val.stationName + '<span class="pull-right">' + pvalue + '</span></div>' +
                    '<canvas height="3" width="290" id="topten-' + val.stationId + '"></canvas></div>';
            });
            var toptenObject = $("#topten");
            toptenObject.html(html);
            //颜色填充处理
            $.each(json.result, function (i, val) {
                // if (i >= 7) {
                //     var scrrenHeight = $(window).height();
                //     if (scrrenHeight <= 675) {
                //         _self.judgeSscreen = true;
                //         return;
                //     }
                // }
                var data = {};
                data.pvalue = val.pvalue > maxValue ? maxValue : val.pvalue;
                data.baseLevel = val.baseLevel == null ? 0 : val.baseLevel;
                data.canvasId = 'topten-' + val.stationId;
                data.rectWidth = 290;
                data.gradientWidth = (data.pvalue / maxValue) * data.rectWidth;
                data.gradientColorStart = top10CanvasLevelColor[2 * (data.baseLevel - 1)];
                data.gradientColorStop = top10CanvasLevelColor[2 * (data.baseLevel - 1) + 1];
                data.rectHeight = 3;
                initTop10CanvasChar(data);
            });
        } else {
            layer.msg('网络错误', function () {
            });
        }
    });
}


function realHistInitsamePolltuionbar(data) {
    var result = [
        {
            name: 'aqi',
            value: data.aqi
        }, {
            name: 'aqi2',
            value: data.aqi2
        }, {
            name: 'pm25',
            value: data.pm25
        }, {
            name: 'pm10',
            value: data.pm10
        }, {
            name: 'co',
            value: data.co
        }, {
            name: 'no2',
            value: data.no2
        }, {
            name: 'o3',
            value: data.o3
        },
        {
            name: 'so2',
            value: data.so2
        }
    ];
    $.each(result, function (i, val) {
        var name = val.name;
        var value = val.value;
        var max = getMaxDataByType(name);
        if (value >= max)
            max = value;
        if (name != "aqi") {
            var data = [{name: name, value: value == null ? "--" : value}];
            initPictorialBarChar(name, data, [name], max, getLevalByValAndType(value, name));
        }
    });
}

//站点排名不同污染等级颜色渐变范围level1-6 colorStart-colorStop
var top10CanvasLevelColor = ['#38852A', '#7EF055', '#D2D138', '#FFFE45', '#CC6824', '#FF7C27',
    '#9F1E37', '#FE3249', '#880049', '#C9006F', '#63000A', '#931221'
];

/**
 * 站点Top10排名(canvas)
 * @param data
 */
function initTop10CanvasChar(data) {
    var canvas = document.getElementById(data.canvasId);
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, data.rectWidth, data.rectHeight); ////绘制指定宽高的矩形

    //指定渐变区域
    var grad = ctx.createLinearGradient(0, 0, data.gradientWidth, data.rectHeight);
    grad.addColorStop(0.5, data.gradientColorStart); //紫
    grad.addColorStop(1, data.gradientColorStop); //蓝
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, data.gradientWidth, data.rectWidth);

    //未值显示区域填充颜色
    ctx.fillStyle = '#182651';
    ctx.fillRect(data.gradientWidth, 0, data.rectWidth, data.rectHeight);

    //挖空显示间隔
    for (var index = 0; index < 11; index++) {
        ctx.clearRect(23 + index * 24, 0, 1, data.rectHeight);
    }
}

/**
 * //区县Top10排名(echarts)
 * @param domId
 * @param result
 */
function initTop10Char(domId, result) {
    var top10Char = echarts.init(document.getElementById(domId));
    var top10Data = result;
    var data = []; //算百分比
    var titlename = []; //保存类目
    var valdata = []; //右侧展示数据
    var fullData = [];

    var windowHeight = $(window).height();
    //显示几条
    var showSize = 9;
    if (windowHeight > 700) {
        showSize = 10;
    }
    if (showSize > top10Data.length) {
        showSize = top10Data.length;
    }
    for (var i = 0; i < showSize; i++) {
        data.push((top10Data[i].aqi2 / 500).toFixed(2) * 100);
        fullData.push(100);
        titlename.push(top10Data[i].districtName);
        valdata.push(top10Data[i].aqi2);
    }

    var option = {
        xAxis: {
            show: false
        },
        grid: {
            left: '5%',
            right: '4%',
            bottom: '-18px',
            top: '1%',
            containLabel: true
        },
        yAxis: [{
            show: true,
            color: '#fff',
            data: titlename,
            inverse: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff',
                textStyle: {
                    fontSize: 11,
                    color: '#fff',
                }
            }

        }, {
            show: true,
            inverse: true,
            data: valdata,
            axisLabel: {
                color: '#fff',
                textStyle: {
                    fontSize: 11,
                    color: '#fff',
                },
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },

        }],
        series: [{
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: data,
            zlevel: -1,
            z: -1,
            barWidth: 5,
            itemStyle: {
                normal: {
                    barBorderRadius: 10,
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,
                            getClors(top10Data[params.dataIndex].aqiLevel2)
                        )


                    }
                }
            },
            label: {
                normal: {
                    show: false,
                    color: '#fff'
                }
            },
        },
            {
                name: '框',
                type: 'bar',
                yAxisIndex: 1,
                barGap: '-100%',
                data: fullData,
                zlevel: 10,
                z: 10,
                barWidth: 8,
                itemStyle: {
                    normal: {
                        color: '#111f41',
                        opacity: .2,
                        barBorderRadius: 5,
                    }
                }
            }

        ]
    };
    top10Char.setOption(option);
    return top10Char;
}

var levelColor = ["#00E500", "#FFFF00", "#FF7E00", "#FF0000", "#99004C", "#7E0023"];

/**
 *    //优良天数占比
 * @param domId
 * @param result
 */
function initBestBaddayChar(domId, result) {
    var date = new Date();
    date.getFullYear();
    date.getMonth();
    var mychar = echarts.init(document.getElementById(domId));
    // var mapChar = echarts.init(document.getElementById('bestBadday'));
    var data = result;

    var total = data.total;
    var legend = [];
    var data2 = [];

    for (var key in data) {
        var value = data[key];
        if (value > 0 && key != 'total') {
            var percent = ((value / total) * 100).toFixed(1);
            var name = '';
            var color = levelColor[0];
            switch (key) {
                case 'g01Num':
                    name += '优 ' + value + '天（' + percent + "%)";
                    color = levelColor[0];
                    break;
                case 'g02Num':
                    name += '良 ' + value + '天（' + percent + "%)";
                    color = levelColor[1];
                    break;
                case 'g03Num':
                    name += '轻度 ' + value + '天（' + percent + "%)";
                    color = levelColor[2];
                    break;
                case 'g04Num':
                    name += '中度 ' + value + '天（' + percent + "%)";
                    color = levelColor[3];
                    break;
                case 'g05Num':
                    name += '重度 ' + value + '天（' + percent + "%)";
                    color = levelColor[4];
                    break;
                case 'g06Num':
                    name += '严重 ' + value + '天（' + percent + "%)";
                    color = levelColor[5];
                    break;
            }
            legend.push({name: name, icon: 'circle'})
            data2.push({
                    value: value,
                    name: name,
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            shadowBlur: 50,
                            color: color,
                            shadowColor: 'rgba(142, 152, 241, 0.6)'
                        }
                    }
                },
                {
                    value: 0.25,
                    name: 'sp',
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            tooltip: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                            color: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 0, 0)',
                            borderWidth: 3
                        }
                    }
                });
        }

    }


    var radius = [45, 40], center = ['30%', '50%'], fontSize = 11, top = '1px', right = '5%';
    if (airMonitoringVM.height.scrrenHeight >= 768) {
        radius = [55, 50], center = ['28%', '45%'], fontSize = 12, top = '15%', right = '5%';
    }
    var option = {
        tooltip: {
            position: 'bottom',
            trigger: 'item',
            formatter: function (params) {
                if (params.name != "sp") {
                    return date.getFullYear() + '年' + date.getMonth() + '月<br />' +
                        '<b style="color: ' + params.color + ';"> &bull;</b> ' + params.name;
                }
            }
        },
        legend: {
            orient: 'vertical',
            top: top,
            right: right,
            data: legend,
            textStyle: {
                color: "#E5E6EA",
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: fontSize,
                padding: -1
            },
            itemWidth: 8,
            itemHeight: 8
        },
        toolbox: {
            show: false
        },
        color: levelColor,
        series: [{
            name: '',
            type: 'pie',
            clockWise: true,
            radius: radius,
            center: center,
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            data: data2
        }]
    }
    mychar.setOption(option);
}

/**
 *
 *     //城市月份对比
 * @param domId
 * @param result
 */
function initCityMonthCompareChar(domId, result) {
    var mapChar = echarts.init(document.getElementById(domId));
    var option = {

        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 12,
                lineHeight: 20,
                width: 20
            },
            formatter: function (params) {
                var html = "";
                if (params.length > 0) {
                    html += "<div  >" + showUpper('pm25') + "<br>";
                    for (var i = 0; i < params.length; i++) {
                        var seriesIndex = params[i].seriesIndex;
                        var value = params[i].value;
                        var year = result.thisYear[params[i].dataIndex];

                        if (seriesIndex == 1) {
                            year = result.preYear[params[i].dataIndex];
                        }
                        html += "<b style='color: " + params[i].color + ";'> &bull;</b> " + year + "年" + params[i].name + ":" + value + "<br/>";
                    }
                    return html += "</div>";
                }

            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 5,
            itemHeight: 5,
            itemGap: 13,
            data: ["近12月", "同期"],
            right: '4%',
            textStyle: {
                fontSize: 12,
                color: '#E5E6EA'
            }
        },
        grid: {
            left: '10px',
            top: '15px',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisTick: {
                interval: 0
            },
            axisLabel: {
                formatter: function (value) {
                    return value.replace("月", "");
                },
                interval: 0
            },
            data: result.xaxis
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    show: false,
                    color: '#fff'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 11
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    show: false
                }
            }
        }],
        series: [{
            name: '近12月',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(137, 189, 27, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(137, 189, 27, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(137,189,27)',
                    borderColor: 'rgba(137,189,2,0.27)',
                    borderWidth: 12

                }
            },
            data: result.thisYearValue
        },
            {
                name: '同期',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: result.preYearValue
            }
        ]
    };
    mapChar.setOption(option);
    mapChar.resize();
}

function initWindyroseEchart(domId, result) {
    var mapChar = echarts.init(document.getElementById(domId));
    var maxValue = result.maxValue;
    var data = result.data;
    var values = [];
    var rose = [];
    var indicators = [];
    $.each(data, function (i, val) {
        values.push(val.windDays);
        rose.push(val.windDirection)
        indicators.push({
            name: val.windDirectionShort,
            max: maxValue
        });
    });
    var radius = 40;
    var scrrenHeight = $(window).height();
    if (scrrenHeight >= 768) {
        radius = 65;
    }

    var option = {
        tooltip: {
            trigger: 'item',
            position: ['-50', '30'],
            formatter: function (params) {
                if (!(params.value.length > 0)) return "";
                var html = "<table style='font-size: 8px;color: #ffffff'>";
                $.each(data, function (i, val) {
                    html += '<tr align="right">' +
                        '<td>' + rose[i] + '</td>' +
                        '<td width="45">' + val.windRate + '%</td>' +
                        '<td width="45">' + val.windSpeed + 'm/s</td>' +
                        '</tr>';
                });
                html += "</table>";
                return html;
            },
            textStyle: {
                fontSize: 8
            }
        },
        legend: {
            show: false
        },
        radar: {
            splitArea: {
                areaStyle: {
                    color: ['#1B2B5D', '#29396A']
                }
            },
            radius: radius,
            indicator: indicators,
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#e3432d',
                    fontSize: 12
                }
            }
        },
        series: [{
            type: 'radar',
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    }
                }
            },
            data: [{
                value: values,
            }],
            areaStyle: {
                normal: {
                    color: '#1258A0',
                    opacity: 0.77
                }
            },
            lineStyle: {
                normal: {
                    // type: 'solid',
                    color: "#1783E2",
                    width: 2,
                    opacity: 0.6
                }
            },
            color: '#1258A0',
            symbolSize: 1,
        }]
    };
    mapChar.setOption(option);
}

/**
 * 站点详情页面 声波柱图
 * @param id 初始化id
 * @param data 数据
 * @param xAxis x轴刻度
 * @param max 最大值
 * @param level
 */
function initPictorialBarChar(id, data, xAxis, max, level) {
    var myChart = echarts.init(document.getElementById('pollutionChar-' + id));
    var picUrl = "image://../../resources/img/chars/l" + level + ".png";
    var maxData = [];
    var maxNumArray = [];
    data.forEach(function (value, index) {
        maxNumArray.push(max);
        maxData.push({
            name: value.name,
            value: Math.max.apply(null, maxNumArray)
        });
    });
    var scale = 1;
    //富文本配置
    var rich = {
        white: {
            color: "#fff",
            align: 'left',
            fontSize: 12,
            padding: [0, 0]
        },
    };
    var option = {
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [{
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
        }],
        xAxis: [{
            type: 'category',
            data: xAxis,
            grid: {
                top: '0'
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff',
                formatter: function (val) {
                    if ('aqi2' == val) {
                        return "AQI";
                    } else if ('aqi' == val) {
                        return "标A"
                    } else {
                        return val.toUpperCase();
                    }
                },
                textStyle: {
                    fontSize: 12,
                    color: '#fff',
                },
                padding: [3, 0, 0, 0]
            },
            interval: 0
        }],
        series: [{
            name: '100',
            type: 'pictorialBar',
            stack: '总量',
            z: 3,
            data: data,
            symbol: picUrl,
            symbolClip: true,
            symbolSize: [9, 100]
        },
            {
                name: '占位',
                type: 'pictorialBar',
                barGap: '-100%',
                silent: true,
                label: {
                    normal: {
                        show: true,
                        position: "top",
                        distance: -20 * scale,
                        color: '#fff',
                        textStyle: {
                            fontSize: 11,
                            color: '#fff',
                        },
                        formatter: function (params) {
                            var stuNum = 0;
                            data.forEach(function (value, index, array) {
                                if (params.name == value.name) {
                                    stuNum = value.value;
                                }
                            })
                            return stuNum;
                        },
                        rich: rich
                    }
                },
                symbol: 'image://../../resources/img/chars//bg.png',
                symbolClip: true,
                symbolSize: [9, 100],
                data: maxData
            }
        ]
    };
    myChart.setOption(option);
}

/**
 * 三合一 站点详情 AQI48小时趋势拆线图
 */
function initAQI48HoursChar(domId, xAxis, data, ptype) {
    var mapChar = echarts.init(document.getElementById(domId));
    var option = {
        title: {
            text: '近48小时浓度',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 11,
                color: '#F1F1F3'
            },
            left: '15px',
            top: '5px'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    fsize = 12,
                    itemName = obj[0].name;
                var str = '<div class="tooltip-tit">' + (itemName == "" ? "" : new Date(itemName).Format("dd日HH时")) + '</div>';
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined || obj[i].value == 0) {
                        obj[i].value = '--';
                    }

                    var seriesName = obj[i].seriesName;
                    var color = "#ffffff";
                    if (seriesName == "AQI") {
                        color = "#498FFC";
                    }

                    str += "<div class=\"tooltip-data clear\"><b style=\"color: " + color + "; \"> &bull;</b><i>" + showUpper(seriesName) + " : " + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        grid: {
            left: '5%',
            right: '5px',
            bottom: '5%',
            top: '35px',
            containLabel: true
        },
        xAxis: {
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    if (!value) {
                        return "";
                    }
                    return new Date(value).Format("HH");
                }, interval: 5
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                color: '#162232',
                lineStyle: {
                    color: '#162232'
                }
            },
            axisTick: {
                show: false
            },
            type: 'category',
            data: xAxis
        },
        yAxis: {
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#162232'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff',
                textStyle: {
                    fontSize: 11,
                    color: '#fff',
                }
            },
            type: 'value'
        },
        series: [{
            data: data,
            type: 'line',
            name: ptype,
            itemStyle: {
                normal: {
                    color: '#1678D2'
                }
            }, symbolSize: 0,
            areaStyle: {}
        }]
    };
    mapChar.setOption(option);
    mapChar.resize();
}

/**
 * user三合一  //48小时颗粒物浓度曲线
 * @param domId
 */
function initParticulates48Char(domId, result) {

    var myChar = echarts.init(document.getElementById(domId));

    var xAxis = result.rtcTime;
    var aqi = result.aqi2;
    var pm25 = result.pm25;
    var pm10 = result.pm10;

    var legend = ['AQI', 'PM25', 'PM10']

    var colors = [
        '#498FFC',
        '#5CD17C',
        '#167BDB'
    ];
    var option = {
        title: {
            text: '颗粒物浓度',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 11,
                color: '#F1F1F3'
            },
            left: '15px',
            top: '5px'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    fsize = 12,
                    itemName = obj[0].name;
                var str = '<div class="tooltip-tit w70">' + (itemName == "" ? "" : new Date(itemName).Format("dd日HH时")) + '</div>';
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    var seriesName = obj[i].seriesName;


                    str += "<div class=\"tooltip-data clear\"><i>" + showUpper(seriesName) + " : " + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        legend: {
            left: 'right',
            data: legend,
            itemWidth: 10,
            itemHeight: 5,
            textStyle: {
                color: "#ffffff"
            }
        },
        grid: {
            left: '10px',
            right: '5px',
            bottom: '10px',
            top: '35px',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: xAxis,
            axisLabel: {
                textStyle: {
                    fontSize: 11,
                    color: "#FFFFFF"
                },
                formatter: function (value) {
                    if (!value) {
                        return "";
                    }
                    return new Date(value).Format("HH")

                }, interval: 5
            },
            splitLine: {
                show: true,
                color: '#162232',
                lineStyle: {
                    color: '#162232'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            splitLine: {
                show: true,
                color: '#162232',
                lineStyle: {
                    color: '#162232'
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 11,
                    color: "#FFFFFF"
                },
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        }],
        series: [{
            name: 'AQI',
            type: 'bar',
            data: aqi,
            itemStyle: {
                normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
                    color: function (params) {
                        var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
                        if (params.data == 0) {
                            return '#f7f7f7';
                        } else if (params.data > 0 && params.data <= 50) {
                            return colorList[0];
                        } else if (params.data > 50 && params.data <= 100) {
                            return colorList[1];
                        } else if (params.data > 100 && params.data <= 150) {
                            return colorList[2];
                        } else if (params.data > 150 && params.data <= 200) {
                            return colorList[3];
                        } else if (params.data > 200 && params.data <= 300) {
                            return colorList[4];
                        } else if (params.data > 300) {
                            return colorList[5];
                        }
                    }
                }
            }
        },
            {
                name: 'PM25',
                type: 'line',
                data: pm25, symbolSize: 0,
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                }
            },
            {
                name: 'PM10',
                type: 'line',
                data: pm10, symbolSize: 0,
                itemStyle: {
                    normal: {
                        color: colors[2]
                    }
                }
            }
        ]
    };
    myChar.setOption(option);
}

/**
 * 气象预报
 * @param domId
 * @param result
 */
function initWeatherForecastChar(domId, result) {
    var weekTitleList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var numList = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九'];
    //标题
    var dayList = ['今天', '明天', '后天'];
    if (result.length > 3) {
        var day = result[3].forecastDate.split('-');
        var date = new Date(day[0], day[1] - 1, day[2], 0, 0, 0);
        var weekDay = date.getDay();
        dayList.push(weekTitleList[weekDay]);
    }
    //湿度
    var humidityList = [];
    for (var i = 0; i < result.length; ++i) {
        humidityList.push(result[i].humidity + '%');
        if (i == 3) {
            break;
        }
    }
    //风力
    var windPowerList = [];
    for (var i = 0; i < result.length; ++i) {
        windPowerList.push(numList[result[i].windPower] + '级')
        if (i == 3) {
            break;
        }
    }
    //温度
    var tempMaxList = [],
        tempMinList = [];
    for (var i = 0; i < result.length; ++i) {
        tempMaxList.push(result[i].temperatureMax);
        tempMinList.push(result[i].temperatureMin);
        if (i == 3) {
            break;
        }
    }
    //天气
    var renderWeather = function (param, api) {
        var weatherImg = 'cloudy';
        if (result[param.dataIndex].phenomenaDay) {
            var weather = result[param.dataIndex].phenomenaDay;
            if (weather.indexOf('晴') > -1) {
                weatherImg = 'sunny';
            }
            if (weather.indexOf('多云') > -1) {
                weatherImg = 'cloudy';
            }
            if (weather.indexOf('阴') > -1) {
                weatherImg = 'overcast';
            }
            if (weather.indexOf('阵雨') > -1) {
                weatherImg = 'shower';
            }
            if (weather.indexOf('雷阵雨') > -1) {
                weatherImg = 'thundershower1';
            }
            if (weather.indexOf('雷阵雨伴有冰雹') > -1) {
                weatherImg = 'thundershower2';
            }
            if (weather.indexOf('雨夹雪') > -1) {
                weatherImg = 'sleet';
            }
            if (weather.indexOf('小雨') > -1) {
                weatherImg = 'lightrain';
            }
            if (weather.indexOf('中雨') > -1) {
                weatherImg = 'moderaterain';
            }
            if (weather.indexOf('冻雨') > -1) {
                weatherImg = 'hail';
            }
            if (weather.indexOf('大雨') > -1) {
                weatherImg = 'heavyrain';
            }
            if (weather.indexOf('暴雨') > -1) {
                weatherImg = 'storm1';
            }
            if (weather.indexOf('大暴雨') > -1) {
                weatherImg = 'storm2';
            }
            if (weather.indexOf('特大暴雨') > -1) {
                weatherImg = 'storm3';
            }
            if (weather.indexOf('阵雪') > -1) {
                weatherImg = 'snowflurry';
            }
            if (weather.indexOf('小雪') > -1) {
                weatherImg = 'lightsnow';
            }
            if (weather.indexOf('中雪') > -1) {
                weatherImg = 'moderatesnow';
            }
            if (weather.indexOf('大雪') > -1) {
                weatherImg = 'heavysnow';
            }
            if (weather.indexOf('暴雪') > -1) {
                weatherImg = 'blizzard';
            }
            if (weather.indexOf('雾') > -1) {
                weatherImg = 'foggy';
            }
            if (weather.indexOf('浮尘') > -1) {
                weatherImg = 'dust';
            }
            if (weather.indexOf('扬沙') > -1) {
                weatherImg = 'sand';
            }
            if (weather.indexOf('沙尘暴') > -1) {
                weatherImg = 'duststorm';
            }
            if (weather.indexOf('霾') > -1) {
                weatherImg = 'haze';
            }
            if (weather.indexOf('暴风雪') > -1) {
                weatherImg = 'blizzardWind';
            }
            if (weather.indexOf('冰雹') > -1) {
                weatherImg = 'haily';
            }
            if (weather.indexOf('台风') > -1) {
                weatherImg = 'typhoon';
            }
        }
        return {
            type: 'group',
            children: [{
                type: 'image',
                style: {
                    image: '../../resources/img/realtime/' + weatherImg + '.png',
                    x: -16 / 2,
                    y: -6 / 2,
                    width: 18,
                    height: 18
                },
                position: [70 * param.dataIndex + 55, 10] //天气图标显示位置
            }, {
                type: 'text',
                style: {
                    text: dayList[param.dataIndex],
                    textFont: api.font({
                        fontSize: 12
                    }),
                    fill: '#fff',
                    textAlign: 'left',
                    textVerticalAlign: 'top'
                },
                position: [70 * param.dataIndex + 15, 10] //今天、明天、后天显示的x/y轴的位置
            }]
        };
    };
    //风和湿度
    var renderWind = function (param, api) {
        return {
            type: 'group',
            children: [{
                type: 'image',
                style: {
                    image:  '../../resources/img/realtime/humidity.png',
                    x: -14 / 2,
                    y: -2 / 2,
                    width: 14,
                    height: 14
                },
                position: [70 * param.dataIndex + 20, 150]
            }, {
                type: 'text',
                style: {
                    text: humidityList[param.dataIndex],
                    textFont: api.font({
                        fontSize: 12
                    }),
                    fill: '#fff',
                    textAlign: 'left',
                    textVerticalAlign: 'top'
                },
                position: [70 * param.dataIndex + 28, 150]
            }, {
                type: 'image',
                style: {
                    image:  '../../resources/img/realtime/' + result[param.dataIndex].windDirection + '.png',
                    x: -14 / 2,
                    y: -2 / 2,
                    width: 14,
                    height: 14
                },
                position: [70 * param.dataIndex + 20, 170]
            }, {
                type: 'text',
                style: {
                    text: windPowerList[param.dataIndex],
                    textFont: api.font({
                        fontSize: 12
                    }),
                    fill: '#fff',
                    textAlign: 'left',
                    textVerticalAlign: 'top'
                },
                position: [70 * param.dataIndex + 28, 170]
            }]
        };
    };
    var mapChar = echarts.init(document.getElementById(domId));
    var option = {
        grid: {
            left: '-8px',
            top: '55px',
            right: '0px',
            bottom: '50px',
            containLabel: false
        },
        tooltip: {
            trigger: 'axis',
            show: false,
            formatter: function (params) {
                return '';
            }
        },
        xAxis: [{
            show: false,
            type: 'category',
            data: dayList
        }],
        yAxis: [{
            show: false,
            type: 'value'
        }, {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            }
        }],
        series: [{
            name: '最高气温',
            yAxisIndex: 0,
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(137,189,27)'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#fff',
                    fontSize: 12,
                    formatter: function (param) {
                        return param.data + '℃';
                    }
                }
            },
            data: tempMaxList
        }, {
            name: '最低气温',
            yAxisIndex: 0,
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(0,136,212)'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    color: '#fff',
                    fontSize: 12,
                    formatter: function (param) {
                        return param.data + '℃';
                    }
                }
            },
            data: tempMinList
        }, {
            type: 'custom',
            renderItem: renderWeather,
            data: dayList,
            tooltip: {
                trigger: 'item',
                formatter: function (param) {
                    return result[param.dataIndex].phenomenaDay;
                }
            },
            itemStyle: {
                normal: {
                    color: '#fff'
                }
            },
            yAxisIndex: 1,
            z: 11
        }, {
            type: 'custom',
            renderItem: renderWind,
            data: dayList,
            itemStyle: {
                normal: {
                    color: '#fff'
                }
            },
            yAxisIndex: 1,
            z: 11
        }]
    };

    mapChar.setOption(option);
    mapChar.resize();
}