var mapChar = null;
var pollution_type = "pm25";//污染物类型
var map = null;
var gridType = 1,//网格类型（1:1X1网格；2:3X3网格；3：5X5网格；4:10X10网格；10：行政网格）
    gridStationType = 13,//网格站点聚合类型（0：所有站点；1：微站；2：国控站；3：考核站；12：微站国控；13：微站考核站；23：国控考核站）
    rtcTime = null;

parent.cityName = "济宁";
parent.cityId = 370800;
parent.provinceId = 370000;
var province, cityId, cityName;

/**
 * 页面初始化
 */
$(function () {
    Litchi.init();
    Litchi.btns();
});


var Litchi = {
    init: function () {
        province = parent.provinceId;
        cityId = parent.cityId;
        cityName = parent.cityName;

        //加载网格数据
        listLastGridData();

    }, btns: function () {
        $('.virt-lefttop-btn button').click(function () {
            $('.virt-lefttop-btn button').removeClass('btn-info');
            $('.virt-lefttop-btn button').addClass('btn-white');
            $(this).addClass('btn-info');
            $(this).removeClass('btn-white');
            pollution_type = this.id;
            console.log(pollution_type)

            $("#virtlegend").attr('src', '../../resources/img/legend/wm-legend-' + pollution_type + '.png');
            listLastGridData();
        });
    }
};

/**
 *   加载网格数据
 */
function listLastGridData() {
    var url = "../../json/analysis/griddata_last.json";
    var postData = {
        city: cityId,
        pollutionType: pollution_type,
        gridType: gridType,
        gridStationType: gridStationType
    };
    ajax(url, postData, function (data) {
        if (data.erroCode == 2000) {
            rtcTime = new Date(data.result.rtcTime).Format("yyyy-MM-dd HH:mm:ss");
            $("#rtcTime").html(rtcTime.substring(0, 16));
            if (map == null && mapChar == null) {
                initMapChar(getLenColor(pollution_type), data.result.list);
            } else {
                var opts = {
                    tooltip: {},
                    visualMap: {
                        pieces: getLenColor(pollution_type)
                    },
                    series: [{
                        data: data.result.list
                    }]
                };
                mapChar.setOption(opts);
            }
        }
    })
}


/**
 * 切换地图类型
 *
 * @param obj
 */
function changeMaptype(obj) {
    var str = obj.id;
    if (str.indexOf('0') != -1) {
        $("#" + str + " img").attr("src", '../../resources/img/wx.png');
        map.setMapType(BMAP_SATELLITE_MAP);
        obj.id = str.replace('0', '1');
    } else {
        $("#" + str + " img").attr("src", '../../resources/img/map.png');
        map.setMapType(BMAP_NORMAL_MAP);
        obj.id = str.replace('1', '0');
    }
}

var level_colors = ["#00e600", "#ff0", "#ff7e00", "#f00", "#9b004c", "#800020", "#777672"];

/**
 * 初始化 地图 信息
 * @param legend_type
 * @param data
 */
function initMapChar(legend_type, data) {


    mapChar = echarts.init(document.getElementById('main'));

    function renderItem(params, api) {
        var maxLat = api.value(0),
            minLat = api.value(1),
            maxLng = api.value(2),
            minLng = api.value(3),
            pointLeftTop = getCoord(params, api, minLng, minLat),
            pointRightBottom = getCoord(params, api, maxLng, maxLat);
        return {
            type: 'rect',
            shape: {
                x: pointLeftTop[0],
                y: pointLeftTop[1],
                width: pointRightBottom[0] - pointLeftTop[0],
                height: pointRightBottom[1] - pointLeftTop[1]
            },
            style: api.style({
                stroke: 'rgba(0,0,0,0.5)'
            }),
            styleEmphasis: api.styleEmphasis()
        };
    }

    function getCoord(params, api, lat, lng) {
        var coords = params.context.coords || (params.context.coords = []),
            key = lat + '-' + lng;
        return coords[key] || (coords[key] = api.coord([lat, lng]));
    }

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var val = params.data[5];
                var color = params.color;
                if (val == -1)
                    return '<div><b style=\"color: ' + color + ';\"></b>--</div>';
                else
                    return '<div><b style=\"color: ' + color + ';\"> &bull;</b>' + val + '</div>';

            }
        },
        visualMap: {
            show: false,
            type: 'piecewise',
            inverse: true,
            top: 20,
            left: 300,
            pieces: legend_type,
            borderColor: '#000',
            borderWidth: 1,
            backgroundColor: '#eee',
            dimension: 5,
            inRange: {
                color: level_colors,
                opacity: 0.5
            }
        },
        series: [{
            type: 'custom',
            coordinateSystem: 'bmap',
            renderItem: renderItem,
            animation: false,
            itemStyle: {
                emphasis: {
                    //color: 'yellow' 鼠标滑动状态时，方框的颜色
                }
            },
            encode: {
                tooltip: 5
            },
            data: data
        }],
        bmap: {
            center: cityName,
            zoom: 9,
            roam: true
        }
    };
    mapChar.setOption(option);
    map = mapChar.getModel().getComponent('bmap').getBMap();
    mapChar.on('click', function (param) {

        var val = param.value[5];
        if (val != -1) {
            var gridId = param.value[6];
            clickMapChar(gridId);
            //返回按钮点击
            $("#verifyBackBtn").on("click", function () {
                $("#virtualGridModal").modal('hide');
            });
        }
    });
    areaMapPC(cityId);
}


function clickMapChar(gridId) {
    $("#detailTab").html("");
    $("#pollutionVal").html("");
    $("#aqiFirst").val("");
    var url = $.backendApiPath + "/griddata/detail";
    var postData = {
        gridId: gridId,
        gridStationType: gridStationType,
        rtcTime: rtcTime
    };
    ajax(url, postData, function (data) {
        if (data.erroCode == 2000) {

            var result = data.result;
            if (pollution_type == "pm25") {
                $("#pollutionVal").html("PM2.5 浓度：" + result.pm25);
                $("#aqiSapn").hide();
                $("#aqiFirst").html("");
            } else if (pollution_type == "aqi") {
                $("#pollutionVal").html("AQI 浓度：" + result.aqi);
                var aqiFirst = result.aqiFirst;

                var aqiFirst = aqiFirst.toUpperCase(),
                    num = aqiFirst.replace(/[^0-9]/ig, ""),
                    vl = aqiFirst.replace(/\d+/g, '');
                if (num == "25") {
                    num = "2.5";
                }
                $("#aqiFirst").show();
                $("#aqiFirst").html("首要污染物：" + vl + "<sub>" + num);
            }
            var html = "";
            var list = result.operatorList;
            for (var i = 0; i < list.length; i++) {
                var st = list[i];
                html += '<tr><td class="tc">' + st.districtName + '</td> <td class="tc">' + st.streetName + '</td> <td class="tc">' + st.operatorName + '</td> <td class="tc">' + st.telephone + '</td></tr>';
            }
            $("#detailTab").html(html);

        }

        $("#virtualGridModal").modal('show');
    });

}


function clearGridData() {

}


function getLenColor(type) {

    switch (type) {
        case 'pm25'  : {
            return [
                {lt: 0, color: level_colors[6]},
                {gt: 0, lte: 35, color: level_colors[0]},
                {gt: 35, lte: 75, color: level_colors[1]},
                {gt: 75, lte: 115, color: level_colors[2]},
                {gt: 115, lte: 150, color: level_colors[3]},
                {gt: 150, lte: 250, color: level_colors[4]},
                {gt: 250, color: level_colors[5]}

            ];
        }
            break;
        case 'aqi'  : {
            return [
                {lt: 0, color: level_colors[6]},
                {gt: 0, lte: 50, color: level_colors[0]},
                {gt: 50, lte: 100, color: level_colors[1]},
                {gt: 100, lte: 150, color: level_colors[2]},
                {gt: 150, lte: 200, color: level_colors[3]},
                {gt: 200, lte: 300, color: level_colors[4]},
                {gt: 300, color: level_colors[5]}
            ];
        }
            break;
    }
}


/**
 * 通过城市名称查找经纬度，改变地图中心点
 * @param poiName
 * @param myChart
 */
function searchByName(poiName, myChart) {
    var bmap = myChart.getModel().getComponent('bmap');
    var localSearch = new BMap.LocalSearch(bmap.getBMap());
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
    localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);
        var centerPoint = poi.point;
        var center = [centerPoint.lng, centerPoint.lat];
        var opt = {
            bmap: {
                center: center,
                zoom: 9,
                roam: true
            }
        };
        myChart.setOption(opt);
    });
    localSearch.search(poiName);
}