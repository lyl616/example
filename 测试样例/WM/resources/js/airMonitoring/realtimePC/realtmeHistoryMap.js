function queryData(params) {
	params.sort = 'pvalue|asc';
	params.page = 1;
	params.perPage = 10;
	console.log("重新请求数据");
	$.ajax({
		type: "POST",
		url: $.coreApiPath + '/stationNew/list/rank/staions',
		dataType: 'JSON',
		contentType: 'application/json; charset=UTF-8',
		data: JSON.stringify(params),
		success: function(data) {
			if(data.erroCode = 2000) {
				//debugger
				var data = data.data;
				if(data == null) {
					weatherVM.clearMarkers();
				} else {
					weatherVM.addMarkers(data);
				}
			} else {
				layer.msg("加载失败！")
				closeLayreLoader();
				return false;
			}
		}
	});
}

var xAxis,
	no2_lst,
	pm25_lst,
	pm10_lst,
	o3_lst,
	aqi_lst,
	aqi2_lst,
	co_lst,
	so2_lst;

function popWindowShow(station, params) {

	layer.open({
		skin: 'leafletLay-popup-contianer',
		type: 1,
		title: false, //不显示标题栏
		closeBtn: true,
		area: ['750px', '510px'],
		shade: 0.3,
		id: 'LAY_layuipro', //设定一个id，防止重复弹出
		resize: false,
		btnAlign: 'c',
		moveType: 1, //拖拽模式，0或者1
		content: '<div class="leaflet-popup-content pd20"><div class="loading_popup_msg">加载中...</div></div>',
		success: function(layero) {
			// console.log("点击成功按钮执行的事件！");
		}
	});
	var pop_url = $.coreApiPath + '/realtimePC/getStationDataDetail';
	var param = {
		stationId: station.stationId,
		domainId: parent.domainId,
		insTime: params.currentTime,
		timeType: params.dateType,
		stationType: 'wz',
		total: 72
	};

	$.ajax({
		type: 'POST',
		url: pop_url,
		dataType: 'json',
		data: param,
		success: function(data) {
			if(data.erroCode == 2000) {
				var station_city_fg = true,
					html = '';
				html = modal_html(data.result, params.dateType);
				$('.leaflet-popup-content').html(html);
				$("#pollution_type_char").find("option[value='" + params.pollutionType.toLowerCase() + "']").attr("selected", true);
				var detail = data.result.detail;
				xAxis = detail.insTime;
				no2_lst = detail.no2;
				pm25_lst = detail.pm25;
				pm10_lst = detail.pm10;
				o3_lst = detail.o3;
				aqi_lst = detail.aqi;
				aqi2_lst = detail.aqi2;
				co_lst = detail.co;
				so2_lst = detail.so2;
				var obj = getShowData(params.pollutionType);
				hourlyChartFun(xAxis, obj[0], obj[1]); //加载浓度曲线
				// hourlyChartFun(xAxis, aqi_lst, 'AQI'); //加载浓度曲线
				particulateChartFun(xAxis, pm10_lst, pm25_lst, aqi_lst); //加载颗粒物曲线
				gaseousChartFun(xAxis, co_lst, no2_lst, so2_lst, o3_lst, aqi_lst); //加载气曲线
			} else {
				$('.loading_popup_msg').html("暂无数据！");
			}
		}
	});

}

function modal_html(result, dateType) {

	var topicMap = result.topicMap;
	var stationInfo = result.station;

	var url = $.ctx + '/stationAnalysis/surveyData?stationId=' + stationInfo.stationId + '&stationType=' + stationInfo.stationType + "&stechType=" + stationInfo.techType;
	stationInfo.stationType = result.stationType;
	var level = topicMap.level + '';
	if(level == "-1" || level.indexOf("-") != -1) {
		level = "--";
	} else {
		level = level + "级";
	}

	var aqiFirst = topicMap.aqiFirst + "";
	if(aqiFirst.indexOf("-") == -1) {
		aqiFirst = getAqiFirst(aqiFirst)
	}
	var html = '';
	html += '<div class="pop_st_baseinfo" style="width:710px;">';
	html += '	<div class=\'pop_st_tit\'>';
	html += makeStationDetailTitle(stationInfo);
	html += '	</div>';
	html += '<div class="pop_st_baseinfo" style="width:710px;">';
	html += '	<ol class="pop_st_ol">';
	html += '		<li>空气质量等级：' + topicMap.grade + '</li>';
	html += '		<li>空气质量级别： ' + level + '</li>';
	html += '		<li>首要污染物：' + aqiFirst + '</li>';
	if(dateType == 2) {
		html += '		<li class="text-right">数据时间：' + new Date(topicMap.currentTime).Format("yyyy-MM-dd HH:mm") + '</li>';
	}
	if(dateType == 3) {
		html += '		<li class="text-right">数据时间：' + new Date(topicMap.currentTime).Format("yyyy-MM-dd") + '</li>';
	}
	html += getHtmlsite(url);
	html += '	</ol>';
	html += '	<table cellpadding="0" cellspacing="0" class="pop_st_table">';
	html += '		<tr class="even">';
	if(dateType == 2) {
		html += '			<td>AQI</td>';
		html += '			<td>标准AQI</td>';
	} else {
		html += '			<td>AQI</td>';
	}

	html += '			<td>PM<sub>2.5</sub></td>';
	html += '			<td>PM<sub>10</sub></td>';
	html += '			<td>SO<sub>2</sub></td>';
	html += '			<td>NO<sub>2</sub></td>';
	html += '			<td>CO</td>';
	html += '			<td>O<sub>3</sub></td>';
	html += '			<td>温度</td>';
	html += '			<td>湿度</td>';
	html += '			<td>风力</td>';
	html += '			<td>风向</td>';
	html += '			<td>气压</td>';
	html += '		</tr>';
	html += '		<tr class="odd">';
	if(dateType == 2) {
		html += '			<td>' + topicMap.aqi2 + '</td>';
	}
	html += '			<td>' + topicMap.aqi + '</td>';

	html += '			<td>' + topicMap.pm25 + '</td>';
	html += '			<td>' + topicMap.pm10 + '</td>';
	html += '			<td>' + topicMap.so2 + '</td>';
	html += '			<td>' + topicMap.no2 + '</td>';
	html += '			<td>' + topicMap.co + '</td>';
	html += '			<td>' + topicMap.o3 + '</td>';
	html += '			<td>' + topicMap.temperature + '</td>';
	html += '			<td>' + topicMap.humidity + '</td>';
	html += '			<td>' + topicMap.windPowerValue + '</td>';
	html += '			<td>' + topicMap.windDirection + '</td>';
	html += '			<td>' + topicMap.pressure + '</td>';
	html += '		</tr>';
	html += '	</table>';
	html += '	<div class="pop_st_echarts">';
	html += '		近72小时浓度曲线（小时数据）';
	html += '		<div class="pull-right" >';
	html += '			<button  class="btn btn-white btn-info m-l-10" onclick="showEcharts(1,this,\'hourlyChart\')">浓度</button>';
	html += '			<button class="btn btn-white" onclick="showEcharts(2,this,\'particulateChart\')">颗粒物</button>';
	html += '			<button class="btn btn-white" onclick="showEcharts(3,this,\'gaseousChart\')">气体</button>';
	html += '		</div>';
	html += '	</div>';
	html += '	<div class="pop_st_echarts_detail">';
	html += '           <select id="pollution_type_char"  onchange="changeChar()" class="post-abs zindex9" style=" right: 116px; top: 4px;">';
	if(dateType == 2) {
		html += '               <option value="aqi2">AQI</option>';
		html += '               <option value="aqi">标准AQI</option>';
	} else {
		html += '               <option value="aqi">AQI</option>';
	}
	html += '               <option value="pm25">PM2.5</option>';
	html += '               <option value="pm10">PM10</option>';
	html += '               <option value="co">CO</option>';
	html += '               <option value="so2">SO2</option>';
	html += '               <option value="o3">O3</option>';
	html += '               <option value="no2">NO2</option>';
	html += '           </select>';
	html += '		<div id="hourlyChart" class="positionAbs opacity1 zindex1" style="width: 710px; height: 300px;"></div>';
	html += '		<div id="particulateChart" class="positionAbs opacity0 zindex0" style="width: 710px; height: 300px;"></div>';
	html += '		<div id="gaseousChart" class="positionAbs opacity0 zindex0" style="width: 710px; height: 300px;"></div>';
	html += '	</div>';
	html += '</div>';
	return html;
}

function getHtmlsite(url) {
	for(i in weatherVM.allFunctions) {
		if(weatherVM.allFunctions[i] == 'ROLE_FUN_003_012') {
			return '<li>详细分析:<a href="' + url + '" target="_blank">点击跳转</a></li>';
		}
	}
	return '';
}

function changeChar() {
	var p_type = $("#pollution_type_char").val();
	var obj = getShowData(p_type);
	hourlyChartFun(xAxis, obj[0], obj[1]); //加载浓度曲线
}

function getShowData(p_type) {
	switch(p_type) {
		case 'aqi2':
			return [aqi2_lst, "AQI"]
		case 'aqi':
			return [aqi_lst, "AQI"]
		case 'pm25':
			return [pm25_lst, "PM25"]
		case 'pm10':
			return [pm10_lst, "PM10"]
		case 'co':
			return [co_lst, "CO"]
		case 'so2':
			return [so2_lst, "SO2"]
		case 'o3':
			return [o3_lst, "O3"]
		case 'no2':
			return [no2_lst, "NO2"]

	}
}
getBoundary();

//设置地图上地域的边界
function getBoundary() {
	var bdary = new BMap.Boundary(),
		name = parent.cityName;
	bdary.get(name, function(rs) { //获取行政区域
		weatherVM.map.clearOverlays(); //清除地图覆盖物       
		var count = rs.boundaries.length; //行政区域的点有多少个
		for(var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {
				strokeWeight: 2, //设置多边形边线线粗
				strokeOpacity: 1, //设置多边形边线透明度0-1
				StrokeStyle: "solid", //设置多边形边线样式为实线或虚线，取值 solid 或 dashed
				strokeColor: "#f00", //设置多边形边线颜色
			}); //建立多边形覆盖物
			weatherVM.map.addOverlay(ply); //添加覆盖物
			map.setViewport(ply.getPath()); //调整视野         
		}
	});
}