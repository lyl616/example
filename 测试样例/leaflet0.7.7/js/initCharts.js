function hourlyChartFun(label_list, data_sets, polutionType) {
    $("#hourlyChart").empty();
    polutionType = polutionType.toUpperCase();
    var myChart = echarts.init(document.getElementById('hourlyChart'));
    var colors = ['#008acd', '#b6a2de', '#2ec7c9', '#f7f7f7', '#eae6f2', '#65c2e7'],
        polutionLevel,
        ColorsLevel = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023'];
    switch (polutionType) {
        case 'PM10': {
            polutionLevel = [{
                gt: 0,
                lte: 50,
                color: ColorsLevel[0]
            }, {
                gt: 50,
                lte: 150,
                color: ColorsLevel[1]
            }, {
                gt: 150,
                lte: 250,
                color: ColorsLevel[2]
            }, {
                gt: 250,
                lte: 350,
                color: ColorsLevel[3]
            }, {
                gt: 350,
                lte: 420,
                color: ColorsLevel[4]
            }, {
                gt: 420,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'PM25': {
            polutionLevel = [{
                gt: 0,
                lte: 35,
                color: ColorsLevel[0]
            }, {
                gt: 35,
                lte: 75,
                color: ColorsLevel[1]
            }, {
                gt: 75,
                lte: 115,
                color: ColorsLevel[2]
            }, {
                gt: 115,
                lte: 150,
                color: ColorsLevel[3]
            }, {
                gt: 150,
                lte: 250,
                color: ColorsLevel[4]
            }, {
                gt: 250,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'O3': {
            polutionLevel = [{
                gt: 0,
                lte: 160,
                color: ColorsLevel[0]
            }, {
                gt: 160,
                lte: 200,
                color: ColorsLevel[1]
            }, {
                gt: 200,
                lte: 300,
                color: ColorsLevel[2]
            }, {
                gt: 300,
                lte: 400,
                color: ColorsLevel[3]
            }, {
                gt: 400,
                lte: 800,
                color: ColorsLevel[4]
            }, {
                gt: 800,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'SO2': {
            polutionLevel = [{
                gt: 0,
                lte: 150,
                color: ColorsLevel[0]
            }, {
                gt: 150,
                lte: 500,
                color: ColorsLevel[1]
            }, {
                gt: 500,
                lte: 650,
                color: ColorsLevel[2]
            }, {
                gt: 650,
                lte: 800,
                color: ColorsLevel[3]
            }, {
                gt: 800,
                lte: 1600,
                color: ColorsLevel[4]
            }, {
                gt: 1600,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'CO': {
            polutionLevel = [{
                gt: 0,
                lte: 5,
                color: ColorsLevel[0]
            }, {
                gt: 5,
                lte: 10,
                color: ColorsLevel[1]
            }, {
                gt: 10,
                lte: 35,
                color: ColorsLevel[2]
            }, {
                gt: 35,
                lte: 60,
                color: ColorsLevel[3]
            }, {
                gt: 60,
                lte: 90,
                color: ColorsLevel[4]
            }, {
                gt: 90,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'AQI': {
            polutionLevel = [{
                gt: 0,
                lte: 50,
                color: ColorsLevel[0]
            }, {
                gt: 50,
                lte: 100,
                color: ColorsLevel[1]
            }, {
                gt: 100,
                lte: 150,
                color: ColorsLevel[2]
            }, {
                gt: 150,
                lte: 200,
                color: ColorsLevel[3]
            }, {
                gt: 200,
                lte: 300,
                color: ColorsLevel[4]
            }, {
                gt: 300,
                color: ColorsLevel[5]
            }];
        }
            break;
        case 'NO2': {
            polutionLevel = [{
                gt: 0,
                lte: 100,
                color: ColorsLevel[0]
            }, {
                gt: 100,
                lte: 200,
                color: ColorsLevel[1]
            }, {
                gt: 200,
                lte: 700,
                color: ColorsLevel[2]
            }, {
                gt: 700,
                lte: 1200,
                color: ColorsLevel[3]
            }, {
                gt: 1200,
                lte: 2340,
                color: ColorsLevel[4]
            }, {
                gt: 2340,
                color: ColorsLevel[5]
            }];
        }
            break;
    }
    ;
    option = {
        color: colors,
        tooltip: {
            trigger: 'axis',
            shadowColor: "#000",
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)), fsize = 12, itemName = obj[0].name;

                var str = '<div class="tooltip-tit">' + (itemName == "" ? "" : new Date(itemName).Format("dd日HH时")) + '</div>';

                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    if (polutionType == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data clear\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        toolbox: {
            right: "0px",
            show: true,
            feature: {
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        xAxis: {
            splitLine: {
                show: false
            },
            data: label_list,
            axisLabel: {
                margin: 20,
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return new Date(value).Format("dd日HH时");
                }
            }
        },
        yAxis: {
            splitLine: {
                show: false,
                color: "#e7e7e7"
            }

        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: colors[3], // 底色
            fillerColor: colors[4], // 选中的颜色
            handleColor: colors[5], // 滑块颜色
            height: "30px",
            width: "99%",
            x: "0%",
            y: "88%"
        }],
        grid: {
            top: '35px',
            left: '0%',
            right: '0', //190px ok
            bottom: '15%',
            containLabel: true
        },
        visualMap: {
            left: 0,
            top: 0,
            right: 0,
            orient: 'horizontal',
            pieces: polutionLevel,
            outOfRange: {
                color: '#000'
            },
            textStyle: {
                fontSize: 12
            },
        },
        series: {
            name: '浓度',
            type: 'line',
            data: data_sets
        }
    };
    //setLineFontSize(option, '');
    myChart.setOption(option);
}


/**
 * 颗粒物
 * @param label_list
 * @param pm10
 * @param pm25
 * @param aqi
 */
function particulateChartFun(label_list, pm10, pm25, aqi) {
    $("#particulateChart").empty();
    var myChart = echarts.init(document.getElementById('particulateChart')),
        colors = ['#4c4c4c', '#4046f8', '#489f48'],
        dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)), fsize = 12, itemName = obj[0].name;

                var str = '<div class="tooltip-tit">' + (itemName == "" ? "" : new Date(itemName).Format("dd日HH时")) + '</div>';

                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    str += "<div class=\"tooltip-data clear\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        toolbox: {
            show: true,
            right: 220,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: dataZoomcolors[0], // 底色
            fillerColor: dataZoomcolors[1], // 选中的颜色
            handleColor: dataZoomcolors[2], // 滑块颜色
            height: "30px",
            width: "96%",
            x: "0%",
            y: "88%"
        }],
        grid: {
            top: '12%',
            left: '0%',
            right: '6%',
            bottom: '15%',
            containLabel: true
        },
        legend: {
            data: ['AQI', 'PM2.5', 'PM10'],
            left: 130,
        },
        xAxis: [{
            type: 'category',
            data: label_list,
            axisLabel: {
                margin: 20,
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return new Date(value).Format("dd日HH时");
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            name: 'AQI',
            type: 'value',
            splitNumber: 2,
            position: 'left',
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            },
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            }
        },
            {
                name: 'PM2.5',
                type: 'value',
                offset: 50,
                position: 'right',
                splitLine: {
                    show: false //不显示网格线
                },
                axisLine: {
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: '{value}'
                }
            },
            {
                name: 'PM10',
                type: 'value',
                position: 'right',
                splitLine: {
                    show: false //不显示网格线
                },
                axisLine: {
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: '{value}'
                }
            }
        ],
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
                name: 'PM2.5',
                type: 'line',
                yAxisIndex: 1,
                data: pm25,
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                }
            },
            {
                name: 'PM10',
                type: 'line',
                data: pm10,
                yAxisIndex: 2,
                itemStyle: {
                    normal: {
                        color: colors[2]
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
}

function gaseousChartFun(label_list, co, no2, so2, o3, aqi) {

    $("#gaseousChart").empty();
    var myChart = echarts.init(document.getElementById('gaseousChart'), 'macarons'),
        colors = ['#4c4c4c', '#278e27', '#3636ff', '#ff4040', '#323232'],
        dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)), fsize = 12, itemName = obj[0].name;

                var str = '<div class="tooltip-tit">' + (itemName == "" ? "" : new Date(itemName).Format("dd日HH时")) + '</div>';

                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '-';
                    }
                    if (obj[i].seriesName == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data clear\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        legend: {
            left: 60,
            data: ['AQI', 'CO', 'NO2', 'SO2', 'O3']
        },
        toolbox: {
            show: true,
            right: 205,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: [{
            type: 'slider',
            showDetail: false,
            dataBackgroundColor: dataZoomcolors[0], // 底色
            fillerColor: dataZoomcolors[1], // 选中的颜色
            handleColor: dataZoomcolors[2], // 滑块颜色
            height: "30px",
            width: "96%",
            x: "0%",
            y: "88%"
        }],
        grid: {
            top: '12%',
            left: '0%',
            right: '10%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: label_list,
            axisLabel: {
                //rotate: 60,
                textStyle: {
                    fontSize: 10
                },
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    return new Date(value).Format("dd日HH时");
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],

        yAxis: [{
            name: 'AQI',
            type: 'value',
            position: 'left',
            splitLine: {
                show: false
            },
            splitLine: {
                show: false //不显示网格线
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            },
            axisLine: {
                lineStyle: {
                    color: colors[0]
                },
                // formatter: '{value}'
                formatter: function (value, idx) {
                    if (!value) {
                        return "";
                    }
                    return new Date(value).Format("dd日HH时");
                }
            }
        }, {
            name: 'CO',
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 0,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            }
        }, {
            name: 'NO2',
            type: 'value',
            offset: 40,
            position: 'right',
            splitLine: {
                show: false //不显示网格线
            },
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                },
                formatter: '{value}'
            }
        }, {
            name: 'SO2',
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 80,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[3]
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                },
                formatter: '{value}'
            }
        }, {
            name: 'O3',
            type: 'value',
            splitLine: {
                show: false //不显示网格线
            },
            offset: 120,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[4]
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                },
                formatter: '{value}'
            }
        }],
        series: [{
            name: 'AQI',
            type: 'bar',
            data: aqi,
            yAxisIndex: 0,
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
        }, {
            name: 'CO',
            type: 'line',
            yAxisIndex: 1,
            data: co,
            itemStyle: {
                normal: {

                    color: colors[1] //自定义设置线条颜色

                }
            }
        }, {
            name: 'NO2',
            type: 'line',
            data: no2,
            yAxisIndex: 2,
            itemStyle: {
                normal: {

                    color: colors[2] //自定义设置线条颜色

                }
            }
        }, {
            name: 'SO2',
            type: 'line',
            data: so2,
            yAxisIndex: 3,
            itemStyle: {
                normal: {

                    color: colors[3] //自定义设置线条颜色

                }
            }
        }, {
            name: 'O3',
            type: 'line',
            data: o3,
            yAxisIndex: 4,
            itemStyle: {
                normal: {

                    color: colors[4] //自定义设置线条颜色

                }
            }
        }]
    };
    myChart.setOption(option);
}

function showEcharts(flag, obj, id) {
    if (flag == 1) {
        $("#pollution_type_char").show();
    } else {
        $("#pollution_type_char").hide();
    }
    $('.pop_st_echarts button').removeClass('bf08a');
    $(obj).addClass('bf08a');
    $('.pop_st_echarts_detail .positionAbs').removeClass('zindex1');
    $('.pop_st_echarts_detail .positionAbs').addClass('zindex0');
    $('.pop_st_echarts_detail .positionAbs').removeClass('opacity1');
    $('.pop_st_echarts_detail .positionAbs').addClass('opacity0');
    $('#' + id).removeClass('opacity0');
    $('#' + id).removeClass('zindex0');
    $('#' + id).addClass('opacity1');
    $('#' + id).addClass('zindex1');
}

var datax1 = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
var datay1 = [120, 132, 101, 134, 90, 230, 210];
var datay2 = [220, 182, 191, 234, 290, 330, 310];
var datay3 = [220, 182, 191, 234, 290, 330, 310];
var datay4 = [220, 182, 191, 234, 290, 330, 310];
var datay5 = [220, 182, 191, 234, 290, 330, 310];
var datay6 = [220, 182, 191, 234, 290, 330, 310];

