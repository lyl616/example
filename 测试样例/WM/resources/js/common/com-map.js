/**
 * 关于操作百度地图公共API
 */

/**
 * 标注的点位
 *
 * @param point
 */
var map;

function _add_marker(point) {
	// 创建地图标注
	var icon_path = $.ctx + "/resources/img/mark_sprite_" + 1 + ".png";
	var markIcon = new BMap.Icon(icon_path, new BMap.Size(39, 28), {
		offset: new BMap.Size(0, 0),
		imageSize: new BMap.Size(29, 25),
		imageOffset: new BMap.Size(0, 0)
	});
	var marker = new BMap.Marker(point, {
		icon: markIcon
	}); // 创建标注
	// 将标注添加到地图中
	map.addOverlay(marker);
}

// clear markers
function _clear_map_markers() {
	$.each(markers, function(n, marker) {
		map.removeOverlay(marker);
	});
}

// 判断浏览区是否支持canvas
function isSupportCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

/** ******************************************************** */

/**
 * 初始化百度地图
 */
function initComMap() {
	map = new BMap.Map("WMMAP", {
		minZoom: 8,
		maxZoom: 14,
		enableMapClick: false
		// 去除百度地图默认的点击事件--test
	});

	//按城市名称设置地图中心点
	map.centerAndZoom(cityName, 10);
	// 开启鼠标滚轮缩放
	map.enableScrollWheelZoom(true);
	//添加平移缩放控件
	var NavigationControl = new BMap.NavigationControl({
		// offset: new BMap.Size(50, 85),
		type: BMAP_NAVIGATION_CONTROL_LARGE,
		offset: new BMap.Size(0, 90),
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT
	});
	map.addControl(NavigationControl);
}

function initMyBMap(domId, mapCenter, initSize) {
	map = new BMap.Map(domId, {
		minZoom: 9,
		maxZoom: 14,
		enableMapClick: false
		// 去除百度地图默认的点击事件
	});
	// 创建点坐标
	map.centerAndZoom(mapCenter, initSize);
	map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
	map.clearOverlays();
	return map;
}

function initMyBMapWithMaxMin(domId, mapCenter, initSize, min, max) {
	map = new BMap.Map(domId, {
		maxZoom: max,
		minZoom: min,
		enableMapClick: false
		// 去除百度地图默认的点击事件
	});
	// 创建点坐标
	map.centerAndZoom(mapCenter, initSize);
	map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
	map.clearOverlays();
	return map;
}

/**
 * 显示插值图
 *
 * @param data
 */
function showInterpolation(data) {
	var polutionList = data.polutionList;
	if(polutionList != null && polutionList.length > 0) {
		_clear_map_markers();
		$.each(polutionList, function(i, sub_data) {
			if(sub_data.lat != null && sub_data.lng != null) {
				_add_map_markers(sub_data);
			}
		});
	} else {
		_clear_map_markers();
	}
}

/**
 * 显示热力图
 *
 * @param data
 */
function showHotmap(data) {
	if(!map) {
		initComMap();
	}
	if(null != data) {
		map.clearOverlays();
		heatmapOverlay = new BMapLib.HeatmapOverlay({
			radius: 40,
			maxOpacity: .6,
			minOpacity: 0,
			blur: .80
		});
		map.addOverlay(heatmapOverlay);
		heatmapOverlay.setDataSet({
			data: data.data,
			max: 100
		});
	} else {
		map.clearOverlays();
	}
}

/**
 * 叠加
 *
 * @param data
 */
function showSpatialmap(data) {
	if(!map) {
		initSpatialmap();
	}
	map.clearOverlays(); // 清除所有覆盖物
	if(null != data) {
		var unitResult = "%";
		var name = "历史记录";
		var spatialMapData = {
			max: data.max,
			data: data.data,
			unit: unitResult
		};
		var config = {
			alpha: 0.4,
			legend: {
				title: name + '-动态插值图',
				offset: '20'
			}
		};
		var childSpatialmap = new SpatialmapOverlay(map, config);
		map.addOverlay(childSpatialmap);
		childSpatialmap.setDataSet(spatialMapData);

	}
}

/**
 * 初始化 spatiMap地图集成
 */
function initSpatialmap() {
	// 创建地图实例
	map = new BMap.Map("WMMAP", {
		minZoom: 10,
		maxZoom: 17,
		enableMapClick: false
		// 清除百度地图默认点击弹出事件
		// ,mapType : BMAP_SATELLITE_MAP// 默认卫星地图BMAP_SATELLITE_MAP
	});
	// 创建点坐标
	var opts = { // 添加控制控件
		type: BMAP_NAVIGATION_CONTROL_SMALL,
		showZoomInfo: true
	};
	mapCenter = $("#mapCenter").val();
	map.centerAndZoom(mapCenter, 13);
	// map.addControl(new BMap.NavigationControl(opts));
	map.enableScrollWheelZoom(); // 启动鼠标滚轮操作
	map.enableContinuousZoom(); // 开启连续缩放效果
	map.enableInertialDragging(); // 开启惯性拖拽效果
}

var wwDis;
var ctrl = null;

// 初始化距离工具
function initDistanceTool() {
	wwDis = new BMapLib.DistanceTool(map);
}

function initTraffic() {
	ctrl = new BMapLib.TrafficControl();
	map.addControl(ctrl);
}

function showTraffic() {
	if(ctrl != null) {
		ctrl.remove();
		ctrl = null;
		return;
	}
	ctrl = new BMapLib.TrafficControl();
	map.addControl(ctrl);
	ctrl.showTraffic();
}

/**
 * 获取指定坐标的边界
 *
 * @param map
 * @param point
 * @param km
 * @returns
 */
function getBounds(map, point, km) {
	// 添加一具半径为km的圆覆盖物
	var circle = new BMap.Circle(point, km);
	map.addOverlay(circle); // 尝试过，去掉不能
	var bounds = circle.getBounds(); // 获取在覆盖的边界
	map.removeOverlay(circle); // 清除所有覆盖物
	return bounds;
}

/**
 * 添加 地图缩略图
 */
function addMapControls() {
	map.addControl(new BMap.OverviewMapControl());
	map.addControl(new BMap.OverviewMapControl({
		isOpen: true,
		anchor: BMAP_ANCHOR_BOTTOM_LEFT, // anchor表示控件的停靠位置，即控件停靠在地图的哪个角
		offset: new BMap.Size(50, 100),
		size: new BMap.Size(300, 200)
	}));
}

var pointCollection = "";

/**
 * 添加海量点
 *
 * @param data
 */
function addPointCollection() {
	if(arguments.length == 1) {
		var data = arguments[0];
	} else {
		var data = arguments[0];
		map = arguments[1];
	}
	if(document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
		if("" != pointCollection)
			map.removeOverlay(pointCollection);
		// p.id , p.lat , p.lng , t1.`code` pic,t1.`name` tname
		var points = []; // 添加海量点数据
		for(var i = 0; i < data.length; i++) {
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
		pointCollection.addEventListener('click', function(e) {
			showPollutionInModal(e.point.obj);
		});

		map.addOverlay(pointCollection); // 添加Overlay

	} else {
		layer.msg('请在chrome、safari、IE8+以上浏览器查看本示例');
	}
}

function showPollutionInModal(id) {

	var url = $.backendApiPath + "/pollutionrepo/detail/" + id;
	$.ajax({
		type: "GET",
		url: url,
		success: function(data) {

			setProp("pollutionInfo", "p_", data);
			// $("#p_type").html(data.typeConfig.name);
			// $("#p_catagory").html(data.catagoryTypeConfig.name);
			initDischargedsTable(data);
			initWstationsTable(data);
			// $("#pollutionInfoModal").draggable();
			$("#pollutionInfoModal").modal("show");
		}
	});
}

function cleanPointCollection() {
	if("" != pointCollection) {
		map.removeOverlay(pointCollection);
		pointCollection = "";
	}
}

/**
 * 划分区域边框
 * @param {Object} cityname
 */
function getBoundary(cityname) {
	console.log("覆盖点的城市     " + cityname);
	var bdary = new BMap.Boundary();
	bdary.get(cityname, function(rs) { //获取行政区域
		var count = rs.boundaries.length; //行政区域的点有多少个
		if(count === 0) {
			return;
		}
		var pointArray = [];
		for(var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {
				strokeWeight: 10,
				strokeColor: "#ff0000",
				fillColor: 'none'
			}); //建立多边形覆盖物
			map.addOverlay(ply); //添加覆盖物
			pointArray = pointArray.concat(ply.getPath());
		}
	});
}

/**
 * 划分行政区域
 * @param {Object} cityId
 */
function areaMap(cityId) {
	var url = $.coreApiPath + "/pollution/districts";
	var param = {
		"cityId": cityId
	};
	$.getJSON(url, param).success(function(data) {
		if(data != null && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				//getBoundary(data[i].district);
				var opt = {};
				opt.cityname = data[i].district;
				opt.strokeWeight = 10;
				opt.strokeColor = "#ff0000";
				opt.fillColor = 'none';
				getOptBoundary(opt);
			}
		}
	});
}

function areaMapPC(cityId) {
	var url = $.coreApiPath + "/pollution/districts";
	var param = {
		"cityId": cityId
	};
	$.getJSON(url, param).success(function(data) {
		if(data != null && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				//getBoundary(data[i].district);
				var opt = {};
				opt.cityname = data[i].district;
				opt.strokeWeight = 4;
				opt.strokeColor = "#ff0000";
				opt.fillColor = 'none';
				getOptBoundary(opt);
			}
		}
	});
}

/**
 * 划分区域边框
 * @param {Object}  option
 * example：getOptBoundary({cityname:'济宁',strokeWeight: 10, strokeColor: "#ff0000",fillColor:'none'});
 */
function getOptBoundary(option) {

	var bdary = new BMap.Boundary();
	bdary.get(option.cityname, function(rs) { //获取行政区域

		var count = rs.boundaries.length; //行政区域的点有多少个
		if(count === 0) {
			return;
		}
		var pointArray = [];
		for(var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], option); //建立多边形覆盖物
			map.addOverlay(ply); //添加覆盖物
			pointArray = pointArray.concat(ply.getPath());
		}
	});
}

function openStationWin(lat, lng, stationId) {
	var infowindow = initInfowindow(stationId);
	var point = new BMap.Point(lng, lat);
	map.openInfoWindow(infowindow, point);
}

function initInfowindow(content) {
	return new BMap.InfoWindow(content, {
		enableAutoPan: true, // 自动平移
		disableAutoPan: true,
		enableMessage: false,
		enableCloseOnClick: true,
		enableMessage: true,
		width: 220, // 信息窗口宽度
		height: 70 // 信息窗口高度
	});
}

var myStyleJson = [{
		"featureType": "background",
		"elementType": "all",
		"stylers": {
			"color": "#0c1a4cff"
		}
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": {
			"color": "#04070cff"
		}
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": {
			"color": "#006cc3ff",
			"weight": "0.1",
			"lightness": -4
		}
	},
	{
		"featureType": "road",
		"elementType": "geometry.fill",
		"stylers": {
			"color": "#0058b242",
			"weight": "0.1"
		}
	},
	{
		"featureType": "continent",
		"elementType": "labels",
		"stylers": {
			"visibility": "off"
		}
	},
	{
		"featureType": "road",
		"elementType": "labels.text.stroke",
		"stylers": {
			"color": "#000000ff",
			"weight": "0.1"
		}
	},
	{
		"featureType": "road",
		"elementType": "labels.text.fill",
		"stylers": {
			"color": "#ffffffff",
			"weight": "0.1"
		}
	},
	{
		"featureType": "boundary",
		"elementType": "geometry.fill",
		"stylers": {
			"color": "#9d9d9dff"
		}
	},
	{
		"featureType": "boundary",
		"elementType": "geometry.stroke",
		"stylers": {
			"color": "#000000ff"
		}
	},
	{
		"featureType": "districtlabel",
		"elementType": "labels.text.fill",
		"stylers": {
			"color": "#ffffffff"
		}
	},
	{
		"featureType": "districtlabel",
		"elementType": "labels.text.stroke",
		"stylers": {
			"color": "#000000ff"
		}
	},
	{
		"featureType": "district",
		"elementType": "labels.text.stroke",
		"stylers": {
			"color": "#ffffff00"
		}
	},
	{
		"featureType": "all",
		"elementType": "labels.icon",
		"stylers": {
			"visibility": "off"
		}
	},
	{
		"featureType": "poilabel",
		"elementType": "labels.text.fill",
		"stylers": {
			"color": "#f3f3f3ff",
			"visibility": "off"
		}
	},
	{
		"featureType": "town",
		"elementType": "labels.text.fill",
		"stylers": {
			"color": "#ffffffff",
			"visibility": "off"
		}
	},
	{
		"featureType": "all",
		"elementType": "labels.text.fill",
		"stylers": {
			"color": "#d8d8d8ff"
		}
	},
	{
		"featureType": "manmade",
		"elementType": "labels",
		"stylers": {
			"visibility": "off"
		}
	}
];