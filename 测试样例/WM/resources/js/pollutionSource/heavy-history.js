//设置全局变量
var map;
var heatmapOverlay;
var t = 500;
var clt;

/** ****************************全局变量****************************** */
var polution_type = 'aqi';// 全局变量 污染类型
var s_stech_type = "98"; //： 站点数据来源（设备类型） 单传感器 6010 ６传感器 1010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var interval = 1;// 默认按小时查询
var show_type = "1";// 1 代表分布图 2代表热力图
var equipment_type = "4"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var start_index = 1;// 开始下标
var totalCount = 0;// 循环的总次数
var is_change = true;// 是否启定时器

var startTime = "";// 开始时间
var emdTime = "";// 结束时间
var currentTime = "";// 当前帧循环时间

var province = "";
var city = "";
var mapCenter = "";


$(function(){
	cityName = parent.cityName;
	initComMap();
	$('#interval').change(function() {
		interval = $(this).children('option:selected').val();
		_TIMMER.Refresh();
	});
	window.setInterval(_TIMMER_TRIGER_, 3000);
});

function showHistory(startDate,endDate){
	startTime = startDate;
	endTime = endDate;
	$("#progressbar").progressbar({
		value : 0
	});
	initHisParams();
	_TIMMER.Refresh();
}

/**
 * 初始化页面全局相关参数 
 */
function initHisParams() {
	province = parent.provinceId;
	city = parent.cityId;
	current_district = "-1";
	current_type = "-1";
}

/** *****************************定时器播放开始************************************************* */
var _TIMMER = [];
function _TIMMER_TRIGER_() {
	if (is_change) {
		_TIMMER.To_DO();
	}
}
// 触发函数
_TIMMER.To_DO = function() {
	go_next();
	show_tipbar();
	get_history_hour();

}

_TIMMER.Refresh = function() {
	initHisParams();
	resetTimerParams2();
	start_index = 1;
	currentTime = startTime;
	is_change = true;
	_clear_map_markers();
	map.clearOverlays();
	clear_tipbar();
	_TIMMER.To_DO();
}

/**
 * 重置Timer参数
 */
function resetTimerParams2() {
	interval = $("#interval").val();
	if (currentTime == "") {
		currentTime = startTime;// 默认第一帧数据为开始时间
	}
	if (endTime != "" && endTime.length > 0 && startTime != "" && startTime.length > 0) {
		if (endTime <= startTime) {
			layer.msg("请选择正确的时间段");
			is_change = false;
			return;
		}
		if (interval == 1) {
			totalCount = GetHourDiff(endTime, startTime);
		} else if (interval == 2) {
			totalCount = GetDateDiff(endTime, startTime);
		} else if (interval == 3) {
			totalCount = getMonthsDiff(endTime, startTime);
		} else if (interval == 4) {
			totalCount = getYearDiff(endTime, startTime);
		}
		if (totalCount <= 0) {
			is_change = false;
			return;
		}
	} else {
		is_change = false;
		return;
	}
}

/** *****************************定时器播放开始************************************************* */
/**
 * 获取历史数据
 */
function get_history_hour() {
	var url = $.coreApiPath + "/history/getData";
    var postData = {
        show_type: show_type,
        province: province,
        city: city,
        interval: interval, // interval 1时 2 天 3 月 4 年 显示的类型
        polution_type: polution_type,
        gridTime: currentTime, // 当前取出时间
        district: current_district, // 行政区
        equipment_type: equipment_type,
        s_stech_type: s_stech_type,
        station_type: current_type
        // 站点类别
    };
	$.ajax({
		type : "POST",
		url : url,
		data : postData,
		datatype : "json",
		success : function(r) {
			if (r.result) {
				var data = r.data;
				if (data != null) {
					if (show_type == "1") {
						showInterpolation(data);
					} else if (show_type == "2") {
						showHotmap(data);
						// showSpatialmap(data);
					}
				}
			} else {
				map.clearOverlays();// 清除所有覆盖物
			}
		},
		error : function() {
		}
	});

}

// 添加标识
var markers = [];

function _add_map_markers(data) {
	// 创建地图标注
//	var icon_path = $.ctx + "/resources/img/mark_sprite_" + data.baseLevel + ".png";
//	if(current_type == "99") {
//		icon_path = $.ctx + "/resources/img/mark_sprite_g_" + data.baseLevel + ".png";
//	}
	
	var icon_path ="";
	if(data.stationType == '99') {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_gk_" + data.baseLevel + ".png";
	} else if(data.stationType == '98') {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_sk_" + data.baseLevel + ".png";
	} else if(data.stationType == '97') {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_s_" + data.baseLevel + ".png";
	} else if(data.stationType == '101') {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_yc_" + data.baseLevel + ".png";
	} else if(data.stationType < 90 && data.stechType == 1010) {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_d_" + data.baseLevel + ".png";
	} else if(data.stationType < 90 && data.stechType == 6010) {
		icon_path = $.ctx + "/resources/img/sprite/mark_sprite_six_" + data.baseLevel + ".png";
	}
	var markIcon = new BMap.Icon(icon_path, new BMap.Size(39, 28), {
		offset: new BMap.Size(0, 0),
		imageSize: new BMap.Size(29, 25),
		imageOffset: new BMap.Size(0, 0)
	});
	var point = new BMap.Point(data.lng, data.lat);
	var marker = new BMap.Marker(point, {
		icon: markIcon
	}); // 创建标注
	marker.obj = data;
	// 将标注添加到地图中
	map.addOverlay(marker);
	markers.push(marker);
}

var heatmapOverlay = null;
function _after_map_init(map) {
	request_city_static_data();
	// 初始化插值图
	heatmapOverlay = _CreateChaZhiMap(map);
}

