/**
 * 初始化污染源
 */
function initPollutions() {
    $.each(cus_pollutions, function (index, data) {
        var html = '';
        html += '<div class="checkbox i-checks db">';
        html += '	<label><strong>' + data.name + '</strong>&nbsp;';
        if (data.code) {
            html += '		<div class="icheckbox_square-green" style="position: relative;">';
            html += '			<input id="' + data.code + '" type="checkbox" index="' + index + '" class="ckb_pollutions ckb_pollutions_parent" name="' + data.name + '" style="position: absolute; opacity: 0;">';
            html += '		</div>';
        }
        html += '		</label>';
        html += '</div>';
        $.each(data.child, function (cindex, cd) {
            html += '<div class="checkbox i-checks">';
            html += '	<label>';
            html += '    <div class="icheckbox_square-green" style="position: relative;">';
            html += '    	<input id="' + cd.code + '" name="' + cd.name + '" class="ckb_pollutions" type="checkbox" style="position: absolute; opacity: 0;">';
            html += '    </div>' + cd.name;
            html += '  </label>';
            html += '</div>';
        });
        $("#uls").append(html);
    });
    $(".ckb_pollutions").click(function () {
        var code = $(this).attr("id");
        var value = $(this).attr("name");
        var isLocal = (code == value);
        var hasChk = $(this).parent().hasClass("checked");
        var city = $("#city").val();
        if (!isNull(code)) {
            $(this).parent().toggleClass("checked");
            if (hasChk) {// 清除 选 中
                if (value == "POI")
                // 清除海量点
                    cleanPointCollection();
                else
                // 清除本地 污染点
                    clear_map_pollution_markers(code, isLocal);
            } else {// 选 中
                if (isLocal) {
                    add_baidu_pollution_markers(code);
                } else {
                    if (value == "POI") {
                        getPointsCollection();
                    } else {
                        query_pollutions_markers(code);
                    }
                }
            }
        }
    });
}

function query_pollutions_markers(code) {
    var city = parent.cityId;
    var url = $.backendApiPath + "/pollutionrepo/pollutions/" + city + "/" + code;
    if (code.length > 0) {
        ajax_get(url, {}, function (data) {
            add_pollution_markers(code, data, function (e) {
                var target = e.currentTarget;
                var obj_data = target.obj;
                showPollutionInModal(obj_data);
            });
        });
    }

}


function cleanPointsCollection() {
    if ("" != pointCollection) {
        airMonitoringVM.map.removeOverlay(pointCollection);
        pointCollection = "";
    }
}

/**
 * 添加海量点
 */
function getPointsCollection() {

    ajax_get($.backendApiPath + "/pollutionrepo/pollutions/" + airMonitoringVM.currentCity, {}, function (r) {
        if (r.erroCode == 2000) {
            addPointsCollection(r.result);
        }
    });
}

/**
 * 添加污染源marker
 *
 * @param data
 * @param onclickFunc
 */
var pollution_markers_map = {};

function add_pollution_markers(code, datas, onclickFunc) {
    var markers = [];
    var size = 16;

    $.each(datas, function (index, data) {
        var point = new BMap.Point(data.lng, data.lat);
        // icon_path = $.ctx + "/resources/img/pollutions/" + data.typeCode + ".png";
        icon_path = $.ctx + "/resources/img/airdata/marker/gc16.png";
        if (airMonitoringVM.zoom > 13) {
            icon_path = $.ctx + "/resources/img/airdata/marker/gc24.png";
            size = 24;
        }
        else if (airMonitoringVM.zoom = 13) {
            size = 20;
        }
        else if (airMonitoringVM.zoom < 13) {
            size = 16;
        }
        var markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
            imageSize: new BMap.Size(size, size)
        });
        var marker = new BMap.Marker(point, {
            icon: markIcon
        });
        marker.obj = data.id;
        marker.onclick = onclickFunc;
        airMonitoringVM.map.addOverlay(marker);
        markers.push(marker);
    });
    pollution_markers_map[code] = markers;
}

var pollution_local_markers_map = {};

/**
 * 添加本地污染源
 *
 * @param searchKey[]
 */
function add_baidu_pollution_markers(searchKey) {
    if (searchKey.length > 0) {
        var options = {
            renderOptions: {
                map: airMonitoringVM.map,
                selectFirstResult: false
            },
            onMarkersSet: function (array) {
            }
        };
        var local = new BMap.LocalSearch(airMonitoringVM.map, options);
        local.disableAutoViewport();
        local.search(searchKey);
        pollution_local_markers_map[searchKey] = local;

    }

}

/**
 * 清除污染源marker
 *
 * @param datas
 */
function clear_map_pollutions_markers(code, isLocal) {
    if (isLocal) {
        pollution_local_markers_map[code].clearResults();
    } else {
        if (pollution_markers_map[code]) {
            $.each(pollution_markers_map[code], function (n, marker) {
                airMonitoringVM.map.removeOverlay(marker);
            });
        }
    }

}


/**
 * 添加海量点
 *
 * @param data
 */
function addPointsCollection() {
    if (arguments.length == 1) {
        var data = arguments[0];
    } else {
        var data = arguments[0];
        airMonitoringVM.map = arguments[1];
    }
    if (document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
        if ("" != pointCollection)
            map.removeOverlay(pointCollection);
        // p.id , p.lat , p.lng , t1.`code` pic,t1.`name` tname
        var points = []; // 添加海量点数据
        for (var i = 0; i < data.length; i++) {
            var point = new BMap.Point(data[i][1], data[i][2]);
            point.obj = data[i][0];
            points.push(point);
        }
        var options = {
            size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            // color : '#ff3232'
            color: '#bebebe'
        }
        pointCollection = new BMap.PointCollection(points, options); // 初始化PointCollection
        pointCollection.addEventListener('click', function (e) {
            showPollutionInModal(e.point.obj);
        });

        airMonitoringVM.map.addOverlay(pointCollection); // 添加Overlay

    } else {
        layer.msg('请在chrome、safari、IE8+以上浏览器查看本示例');
    }
}