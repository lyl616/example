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
                        getPointCollection();
                    } else {
                        query_pollution_markers(code);
                    }
                }
            }
        }
    });
}

function query_pollution_markers(code) {
    var city = parent.cityId;
    var url = $.backendApiPath + "/pollutionrepo/pollutions/" + city + "/" + code;
    if (code.length > 0) {
        ajax_get(url, {}, function(data) {
            add_pollution_markers(code, data, function(e) {
                var target = e.currentTarget;
                var obj_data = target.obj;
                showPollutionInModal(obj_data);
            });
        });
    }

}
/**
 * 添加海量点
 */
function getPointCollection() {

    ajax_get($.backendApiPath + "/pollutionrepo/pollutions/" + city, {}, function (r) {
        if (r.erroCode == 2000) {
            addPointCollection(r.result);
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
    var size = 30;
    if (bigScreen_flg) {
        size = 90;
    }
    $.each(datas, function (index, data) {
        var point = new BMap.Point(data.lng, data.lat);
        icon_path = $.ctx + "/resources/img/pollutions/" + data.typeCode + ".png";
        var markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
            imageSize: new BMap.Size(size, size)
        });
        var marker = new BMap.Marker(point, {
            icon: markIcon
        });
        marker.obj = data.id;
        marker.onclick = onclickFunc;
        map.addOverlay(marker);
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
                map: map,
                selectFirstResult: false
            },
            onMarkersSet: function (array) {
            }
        };
        var local = new BMap.LocalSearch(map, options);
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
function clear_map_pollution_markers(code, isLocal) {
    if (isLocal) {
        pollution_local_markers_map[code].clearResults();
    } else {
        if (pollution_markers_map[code]) {
            $.each(pollution_markers_map[code], function (n, marker) {
                map.removeOverlay(marker);
            });
        }
    }

}