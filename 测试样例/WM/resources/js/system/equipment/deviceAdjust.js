$(document).ready(function () {
    var date = new Date();
    $("#startTime").val(addDate(date, -1));
    $("#endTime").val(addDate(date, 0));

    //初始化下拉框数据
    var opts = {};
    opts.objID = "wrwtype";//需要写入option 的select 的id号
    opts.type = "9";  //向后台请求的接口类型名
    opts.parentID = "";
    opts.cityID = parent.cityId;//城市id
    opts.proID = parent.provinceId;//省份id
    opts.isAll = false;
    opts.hideAQI = true;
    opts.callBack = null; //如果需要写回调函数，此处为回调函数的名称。
    backwrite_select_option(opts);//调用函数


    init_station_type();
    //初始化省
    //init_pro(); 根据当前地市选择标准站
    //初始化标准站
    loadStandardStation('MINUTE')
    $("#stations").select2({
        theme: "bootstrap",
        width: 'auto',
        language: "zh-CN"
    });

    $("#dateType").change(function () {
        loadStandardStation($("#dateType").val())
        //toggleShowHideObj();
    });


});


function getChartFun() {
    var wrwtype = $("#wrwtype").val();
    var starttime = $("#startTime").val();
    var endtime = $("#endTime").val();
    if (starttime == null || endtime == "" || starttime == "" || endtime == null) {
        layer.msg("请选择开始或者结束时间");
        return false;
    }

    var stationIds = $("#stations").val();
    if (stationIds == null || stationIds == "") {
        layer.msg("标准站不能为空！");
        return false;
    }
    var stationNames = new Array()
    for (var i = 0; i < stationIds.length; i++) {
        var text = $("#stations option[value=" + stationIds[i] + "]").text();
        stationNames.push(text)
    }
    getChartData(wrwtype, starttime, endtime, stationIds, stationNames);
}

function toggleShowHideObj() {
    var dateType = $("#dateType").val();
    if (dateType == 'MINUTE') {
        $(".flg-h").hide();
    } else {
        $(".flg-h").show();
    }
}

function addDate(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var minute = d.getMinutes();
    var sec = d.getSeconds();
    var hour = d.getHours();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    var val = d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
    return val;
};

function init_station_type() {
    var codeID = 74;
    var sTechType = "6010,1010"

    var province = parent.provinceId;
    var cityId = parent.cityId;

    var opts = {};
    opts.objID = "idStationType";
    opts.type = "-1";
    opts.parentID = codeID;
    opts.cityID = cityId;
    opts.proID = province;
    opts.isAll = true;
    init_station_type_option(opts);
}

function show_layer() {
    layer.open({
        type: 1,
        title: false, //不显示标题栏
        closeBtn: false,
        area: '176px;', //设置宽度
        shade: 0.5, //设置透明度
        id: 'lay_layuipro', //设定一个id，防止重复弹出
        //		btn: ['火速围观', '残忍拒绝'],
        moveType: 1, //拖拽模式，0或者1
        content: '<div style="padding:20px; line-height: 22px; background-color: #fff; color: #000; font-weight: 300;">加载中，请稍后... ^_^</div>'
    });
}

function getChartData(wrwtype, starttime, endtime, standardIds, standardNames) {
    show_layer();
    $("#allCharts").html("");
    //    var province = "110000";
    //    var city = "110100";

    var dateType = $("#dateType").val();
    var province = parent.provinceId;
    var city = parent.cityId;
    var stationTypeTemp = $("#idStationType").val();
    var stationType = stationTypeTemp.split("_")[0];
    if (stationType == '-1') stationType = "";
    var startT = starttime.replace(/-/g, "/");
    var endT = endtime.replace(/-/g, "/");
    var dateS = new Date(startT);
    var dateE = new Date(endT);
    var dayTime = (Math.abs(dateE - dateS)) / 1000 / 60 / 60 / 24;
    if (dateType == 'MINUTE' && dayTime > 1) {
        layer.closeAll();
        layer.alert("最多查询一天的数据!");
        return;
    }

    var param = {
        type: wrwtype,
        startTime: starttime,
        endTime: endtime,
        province: province,
        city: city,
        dateType: dateType,
        stationType: stationType,
        stationIds: standardIds == null ? "" : standardIds.join(",")
    };

    var reqURL = $.coreApiPath + "/weather/deviceAdjust";
    $.ajax({
        type: "post",
        async: true,
        //同步执行
        url: reqURL,
        data: param,
        dataType: "json",
        //返回数据形式为json
        success: function (data) {
            layer.closeAll();
            if (data.length > 0) {
                var j = 0;
                for (var pos in data) {
                    var result = data[pos];

                    var a = {
                    	backgroundColor:'#fff',
                        tooltip: {
                            trigger: "axis",
                            formatter: function (params) {
                                var obj = JSON.parse(JSON.stringify(params))
                                var itemName = obj[0].name;
                                var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
                                var fsize = 12,
                                    changeWid;
                                switch (obj.length) {
                                    case(obj.length > 0 && obj.length <= 20): {
                                        changeWid = "120px";
                                        fsize = 14;
                                    }
                                        break;
                                    case(obj.length > 30 && obj.length <= 50): {
                                        changeWid = "120px";
                                        fsize = 14;
                                    }
                                        break;
                                    case(obj.length > 50 && obj.length <= 100): {
                                        changeWid = "100px";
                                        fsize = 12;
                                    }
                                        break;
                                    case(obj.length > 100 && obj.length <= 150): {
                                        changeWid = "100px";
                                        fsize = 12;
                                    }
                                        break;
                                    case(obj.length > 150 && obj.length <= 200): {
                                        changeWid = "100px";
                                        fsize = 12;
                                    }
                                        break;
                                    default: {
                                        changeWid = "120px";
                                    }
                                        break;
                                }

                                for (var i = 0; i < obj.length; i++) {
                                    if (obj[i].value == undefined) {
                                        obj[i].value = '-';
                                    }
                                    str = str + "<div class=\"tooltip-data\" style=\"width:" + changeWid + "\"><b style=\"color: " + obj[i].color + ";\"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                                    str += "</div>";

                                }
                                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
                            },
                            position: ['7%', '5%']

                        },
                        legend: {
                            data: []
                        },
                        grid: {
                            x: 40,
                            x2: 40,
                            y2: 24
                        },
                        xAxis: [{
                            type: "category",
                            boundaryGap: !1,
                            data: [],
                            splitLine: {
                                show: false
                            }
                        }],
                        yAxis: [{
                            type: "value",
                            axisLabel: {
                                formatter: "{value}"
                            }
                        }],
                        series: []
                    };
                    //////////////////////////////
                    a.legend.data = result.legend;
                    for (var i = 0; i < a.legend.data.length; i++) {
                        if ($.inArray(a.legend.data[i], standardNames) != -1) {
                            a.legend.data[i] = '*' + a.legend.data[i]
                        }
                    }
                    a.xAxis[0].data = result.category;
                    if (result.series) {
                        for (var i = 0; i < result.series.length; i++) {
                            var seriesName = result.series[i].name;
                            if ($.inArray(seriesName, standardNames) != -1) {
                                seriesName = '*' + seriesName
                            }
                            var arr = {
                                name: seriesName,
                                type: result.series[i].type,
                                data: result.series[i].data,
                                showSymbol: true,
                                legendHoverLink: true,
                                hoverAnimation: false,
                                itemStyle: {
                                    normal: {
                                        color: myColors[i]
                                    },
                                    emphasis: {
                                        color: myColors[i]
                                    }
                                }
                            };
                            a.series.push(arr);
                        }

                        var chartId = "dataChart" + j;
                        var rankHtml = " <div class='echarts bgf pd10 m-t-10 chunk-set' style='height: 250px;' id='" + chartId + "'></div>" ;
                        $("#allCharts").append(rankHtml);

                        var e1 = echarts.init(document.getElementById(chartId));
                        e1.hideLoading();
                        e1.setOption(a);
                        j++;
                    }
                }
            } else {
                layer.closeAll();
                layer.alert("查询不到信息哦，请重新查询！");
            }
        },
        error: function (errorMsg) {
            layer.closeAll();
            layer.alert("不好意思，图表请求数据失败啦!");
        }
    });
};

//初始化省
function init_pro() {
    var url = $.coreApiPath + "/weather/allProvince";
    var opt = document.getElementById("pro");
    opt.options.length = 0;
    $.getJSON(url).success(function (data) {
        for (var i = 0; i < data.length; i++) {
            opt.options.add(new Option(data[i].province, data[i].id));
        }
        init_city($("#pro option:selected").val());
    });

    $('#pro').change(function () {
        var pro = $(this).children('option:selected').val();
        init_city(pro);
    });

}

//初始化城市
function init_city(proId) {
    var url = $.coreApiPath + "/weather/getAllByProvinceId";
    var param = {
        "proId": proId
    };
    var city = document.getElementById("city");
    city.options.length = 0;
    $.getJSON(url, param).success(function (data) {
        for (var i = 0; i < data.length; i++) {
            city.options.add(new Option(data[i].city, data[i].id));
        }
        loadStandardStation(proId, $("#city option:selected").val());
    });

    $('#city').change(function () {
        var city = $(this).children('option:selected').val();
        loadStandardStation(proId, city);
    });
}

// //初始化站点
// function init_station(proId, cityId) {
// 	var url = $.coreApiPath + "/station/getStationsByCityId";
// 	var param = {
// 		"pro": proId,
// 		"city": cityId
// 	};
// 	var opt = document.getElementById("stations");
// 	opt.options.length = 0;
// 	//  opt.options.add(new Option("全部","-1"));
// 	$.getJSON(url, param).success(function(data) {
// 		for(var i = 0; i < data.length; i++) {
// 			opt.options.add(new Option(data[i].stationName, data[i].stationId));
// 		}
// 	});
// }

//加载标准站
function loadStandardStation(dataType) {
    var type
    if ('MINUTE' == dataType) {
        type = 0
    } else {
        type = 1
    }

    var url = $.coreApiPath + "/weather/getStandardStations";
    var param = {
        "city": parent.cityId,
        "type": type
    };
    var opt = document.getElementById("stations");
    opt.options.length = 0;
    //  opt.options.add(new Option("全部","-1"));
    $.getJSON(url, param).success(function (data) {
        for (var i = 0; i < data.length; i++) {
            opt.options.add(new Option(data[i].stationName, data[i].stationId));
        }
    });
}