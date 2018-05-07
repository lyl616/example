var settings;
var reg = "yyyy-MM-dd HH";

var cityId = parentDP.cityId;
var provinceId = parentDP.provinceId;
var cityName = parentDP.cityName;

$(document).ready(function() {
	if('' == cityId) {
		cityId = 370800;
	}
	initWateStyle("startTime", "endTime");
	stations = $("#stations").select2({
		theme: "bootstrap",
		language: "zh-CN"
	});
	initS_stechType();
	var currentDate = new Date();
	initStartEndDateWithReg(currentDate, 7, reg);
	settings = {
		height: $("#fs").height()
	};
	clickStationType();
});

function clickStationType() {
	$("#station_type").change(function() {
		var p = getParamData();
		initSelect({
			id: "stations",
			all: false,
			url: "station/query/station/stechtype/" + p.stechType + "/type/" + p.stationType + "/" + cityId,
			value: "stationId",
			text: "stationId"
		});
	});
}

/**
 * 设备类型
 */
function initS_stechType() {
	var opts = {};
	opts.objID = "s_stech_type";
	opts.type = "11";
	opts.parentID = "";
	opts.cityID = cityId;
	opts.proID = provinceId;
	opts.isAll = false;
	opts.callBack = init_station_type;
	init_s_stech_type_option(opts);
	$('#s_stech_type').change(function() {
		s_stech_type_global = $(this).children('option:selected').val().split("_")[0];
		var codeId = $(this).children('option:selected').val().split("_")[1];
		var _html_all = '<option value="aqi">AQI</option><option value="pm25" selected>PM25</option><option value="pm10">PM10</option><option value="co">CO</option><option value="so2">SO2</option><option value="o3">O3</option><option value="no2">NO2</option>';
		var _html_1 = '<option value="aqi">AQI</option><option value="pm25" selected>PM25</option>';
		$("#conType").empty();
		if(s_stech_type_global == "1010") {
			$("#conType").append(_html_1);
		} else {
			$("#conType").append(_html_all);
		}
		init_station_type();
	});
}

/**
 * 站点类型
 * @param codeId code数据的ID
 */
function init_station_type() {
	var codeID = $("#s_stech_type").val().split("_")[1];
	var opts = {};
	opts.objID = "station_type";
	opts.type = "4";
	opts.parentID = codeID;
	opts.cityID = cityId;
	opts.proID = provinceId;
	opts.isAll = true;
	init_station_type_option(opts);
}

/**
 * 请求图表数据
 */
function requestData() {
	var params = getParamData();
	if(params.start == '' || params.end == '') {
		layer.msg("标红*条件为必填项！");
		return;
	}
	var load = layer.msg('加载中', {
		icon: 16,
		shade: 0.01
	});
	$.ajax({
		type: "post",
		url: $.coreApiPath + "/analysis/realtime/querycharts",
		data: params,
		async: true,
		success: function(data) {
			$("#stationCharts").hide();
			$("#level_tab_h").hide();
			weatherLevelCharts(data.level);
			aqiTendency(data.aqiTendency);
			layer.close(load);
		},
		error: function(e) {}
	});
}

function getParamData() {
	stations = $("#stations").val();
	var startObj = stringToDate($("#startTime").val());
	var endObj = stringToDate($("#endTime").val());
	var params = {
		cityId: cityId,
		start: $("#startTime").val(),
		startObj: startObj,
		endObj: endObj,
		end: $("#endTime").val(),
		conType: $("#conType").val(),
		stationType: $("#station_type").val() == null ? "" : $("#station_type").val().split("_")[0],
		stations: stations == null ? "-1" : stations.toString(),
		intervalType: $("#intervalType").val(),
		intervalTypeText: $("#intervalType").find("option:selected").text(),
		cellTooltipTitle: $("#intervalType").val() == 'hour' ? '分钟' : '小时',
		stechType: $("#s_stech_type").val() == null ? '' : $("#s_stech_type").val().split("_")[0]
	};
	return params;
}

/**
 * 空气质量分级构成
 */
function weatherLevelCharts(data) {
	var currentParam = getParamData();
	var seriesDatas = [];
	var totalNum = 0;
	$.each(data.datas, function(index, o) {
		var seriesData = {};
		seriesData.name = o.name;
		seriesData.value = o.value;
		totalNum += o.value;
		seriesData.itemStyle = {};
		seriesData.itemStyle.normal = {};
		seriesData.itemStyle.normal.color = o.color;
		seriesDatas.push(seriesData);
	});
	var myChart = echarts.init(document.getElementById('levelCharts'));
	currentParam.conType = currentParam.conType.toUpperCase();
	var option = {
		backgroundColor: 'white', // 背景色
		title: {
			text: currentParam.conType + '[' + currentParam.intervalTypeText + ']浓度按区间次数分布图(总点数：' + totalNum + ')',
			textStyle: {
				fontSize: 40,
				fontWeight: 'bolder',
				color: '#333'
			},
			x: 'center',
			top: '40px'
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {d}%（{c}次）"
		},
		grid: {
			left: '3%',
			right: '4%',
			containLabel: true,
			height: '30'
		},
		legend: {
			orient: 'vertical',
			left: 'right',
			top: '10',
			data: data.legend
		},
		series: [{
			name: '空气质量',
			type: 'pie',
			radius: '70%',
			startAngle: 0,
			label: {
				normal: {
					textStyle: {
						fontSize: 40
					}
				}
			},
			itemStyle: {
				normal: {
					borderColor: '#fff',
					borderWidth: 2
				}
			},
			center: ['40%', '50%'],
			data: seriesDatas
		}]
	};
	if(bigScreen_flg) {
		setLineFontSize(option, 40);
	}
	myChart.setOption(option);
	myChart.on('click', function(params) {
		if(params.componentType == "series") {
			requestStation(params);
		}
	});
}

function requestStation(paramsInfo) {
	var params = getParamData();
	params.ranges = paramsInfo.data.name;
	$.ajax({
		type: "get",
		url: $.coreApiPath + "/analysis/realtime/queryStationCharts",
		data: params,
		async: true,
		success: function(data) {
			stationCharts(data, paramsInfo.color, params.ranges);
		}
	});
}

function stationCharts(data, color, ranges) {
	$("#stationCharts").show();
	var myChart = echarts.init(document.getElementById('stationCharts'));
	var params = getParamData();
	option = {
		backgroundColor: '#fff', //设置整个图表的背景色（默认透明）
		title: {
			x: 'center',
			text: '在' + ranges + '之间各个站点及次数分布图',
			textStyle: {
				fontSize: 40,
				color: '#333'
			},
			top: '40px'
		},
		color: [color],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
			/*,
			             formatter: function (value, index) {
			             return value.split("&&")[1];
			             }*/
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '7%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: data.xAxis,
			axisTick: {
				alignWithLabel: true
			},
			axisLabel: {
				formatter: function(value, index) {
					return value.split("&&")[1];
				}
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '总次数',
			type: 'bar',
			data: data.datas
		}]
	};
	if(bigScreen_flg) {
		setLineFontSize(option, 40);
	}
	myChart.setOption(option);
	myChart.on('click', function(params) {
		if(params.componentType == "series") {
			requestStationTable(params);
		}
	});
}

var stationParams;

function requestStationTable(paramsInfo) {
	$("#level_tab_h").show();
	stationParams = getParamData();
	stationParams.conType = stationParams.conType.toUpperCase();

	var PolutionTypeStr = stationParams.conType,
		Polutionvalnum = PolutionTypeStr.replace(/[^0-9]/ig, ""),
		pollutionV = PolutionTypeStr.replace(/\d.+/g, '');
	if(Polutionvalnum == "25") {
		Polutionvalnum = "2.5";
	}

	var titleName = paramsInfo.name.split("&&");
	$("#level_table_title").html('站点' + titleName[1] + '的' + pollutionV + '<sub>' + Polutionvalnum + '</sub>浓度[' + stationParams.intervalTypeText + ']分布图');
	stationParams.stations = titleName[0];
	$.ajax({
		type: "get",
		url: $.coreApiPath + "/analysis/realtime/queryTableCharts",
		data: stationParams,
		async: true,
		beforeSend: function() {
			if(stationParams.intervalType == 'hour') {
				drawTabDay();
			} else if(stationParams.intervalType == 'day') {
				drawTabMonth()
			}
			var fsh = settings.height + $("#level_tab_h").height();
			$("#fs").css("height", fsh);
		},
		success: function(data) {
			if(stationParams.intervalType == 'hour') {
				drawTableHourColor(data);
			} else {
				drawTableDayColor(data);
			}
		}
	});
}

/**
 * 填充单位为小时的表格颜色
 *
 * @param {Object}
 *            data
 */
function drawTableHourColor(data) {
	var param = getParamData();
	for(var key in data) {
		var rowDate = converTimeFormat(key);
		var format = 'yyyy-MM-dd';
		var rowId = rowDate.Format(format);
		var tdId = $("#" + rowId + " #h_" + rowDate.getHours());
		tdId.css('background-color', data[key]);
		var stechType = param.stechType;
		if('aqi' != param.conType && stechType != '98') {
			tdId.css('cursor', 'pointer');
			tdId.click(hourLine);
		}
	}
}

/**
 * 填充单位为天的表格颜色
 *
 * @param {Object}
 *            data
 */
function drawTableDayColor(data) {
	for(var key in data) {
		var rowDate = converTimeFormat(key);
		var format = 'yyyy-MM';
		var rowId = rowDate.Format(format);
		var tdId = $("#" + rowId + " #h_" + rowDate.getDate());
		tdId.css('background-color', data[key]);
		tdId.css('cursor', 'pointer');
		tdId.click(dayLine);
	}
}

function converTimeFormat(time) {
	if(time != null) {
		time = time.replace("-", "/");
		time = time.replace("-", "/");
		return new Date(time);
	}
	return null;
}

/**
 * 点击获取表格的小时曲线数据
 */
function hourLine() {
	var hourDate = new Date($(this).parent().attr("id"));
	var hour = $(this).attr("id").split("_")[1];
	hourDate.setHours(hour);
	var cliDate = hourDate.Format("yyyy-MM-dd hh");
	$("#cellModal").modal('show');
	$("#span1").html(stationParams.conType + '分钟趋势图');
	$("#span3").html(hourDate.Format('yyyy年MM月dd日 hh时'));
	$("#cell_charts").empty();
	stationParams.nowDate = cliDate;
	$.ajax({
		type: "get",
		url: $.coreApiPath + "/analysis/realtime/table/hourdata",
		async: true,
		data: stationParams,
		success: function(data) {
			showCellLine(data);
		}
	});
}

/**
 * 点击获取表格的天的曲线数据
 */
function dayLine() {
	var rowDate = new Date($(this).parent().attr("id"));
	var dayNum = $(this).attr("id").split("_")[1];
	rowDate.setDate(dayNum);
	var cliDate = rowDate.Format("yyyy-MM-dd");
	$("#cellModal").modal('show');
	$("#cell_charts").empty();
	$("#cellModal").modal('show');
	$("#span1").html(stationParams.conType + '小时趋势图');
	$("#span3").html(rowDate.Format('yyyy年MM月dd日'));
	stationParams.nowDate = cliDate;
	$.ajax({
		type: "get",
		url: $.coreApiPath + "/analysis/realtime/table/daydata",
		async: true,
		data: stationParams,
		success: function(data) {
			showCellLine(data);
		}
	});
}

function showCellLine(data, param) {
	var myChart = echarts.init(document.getElementById('cell_charts'));
	var option = {
		//backgroundColor : 'white',// 背景色
		tooltip: {
			trigger: 'axis',
			formatter: stationParams.cellTooltipTitle + '：{b}<br/>' + stationParams.conType + '：{c}'
		},
		toolbox: {
			feature: {}
		},
		grid: {
			left: '5%',
			right: '5%',
			top: '10%',
			bottom: '10%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: data.xAxis
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			type: 'line',
			data: data.datas
		}]
	};
	if(bigScreen_flg) {
		setLineFontSize(option, 40);
	}
	myChart.setOption(option);
}

/**
 * 绘制以天和小时表格
 */
function drawTabDay() {
	var params = getParamData();
	var time1 = params.startObj;
	var totalDays = Math.abs((params.endObj.getTime() - time1.getTime())) / (1000 * 60 * 60 * 24) + 1;
	var ltab = $("#level_table");
	var html = '';
	for(var index = 0; index < totalDays; index++) {
		if(index > 0) {
			time1.setDate(time1.getDate() + 1);
		}
		var dateRow = time1.Format("yyyy-MM-dd");
		html += '<tr id="' + dateRow + '">';
		html += '<td style="width:350px;">' + dateRow + '</td>';
		for(var hourIndex = 0; hourIndex <= 23; hourIndex++) {
			html += '<td id="h_' + hourIndex + '" class="level-hour"></td>';
		}
		html += '</tr>';
	}
	html += '<tr><td></td>';
	for(var h = 0; h <= 23; h++) {
		html += '<td>' + h + '</td>';
	}
	html += '</tr>';
	ltab.html(html);
}

/**
 * 绘制月和天表格
 */
function drawTabMonth() {
	var params = getParamData();
	var time1 = stringToDate(params.start);
	var time2 = stringToDate(params.end);
	var totalMonth = getMonthNumber(time2, time1) + 1;
	var ltab = $("#level_table");
	var html = '';
	for(var index = 1; index <= totalMonth; index++) {
		if(index > 1) {
			time1.setMonth(time1.getMonth() + 1);
		}
		var dateRow = time1.Format("yyyy-MM");
		html += '<tr id="' + dateRow + '">';
		html += '<td class="level-hour-nbd">' + dateRow + '</td>';
		for(var hourIndex = 1; hourIndex <= 31; hourIndex++) {
			html += '<td id="h_' + hourIndex + '" class="level-hour"></td>';
		}
		html += '</tr>';
	}
	html += '<tr><td></td>';
	for(var h = 1; h <= 31; h++) {
		html += '<td>' + h + '</td>';
	}
	html += '</tr>';
	ltab.html(html);
}

/**
 * 格式为 yyyy-MM-dd hh:mm:ss
 */
function stringToDate(fDate) {
	var arrays = fDate.split(" ");
	var fullDate = arrays[0].split("-");
	var fullTime = arrays[1];
	return new Date(fullDate[0], fullDate[1] - 1, fullDate[2], fullTime, 0, 0);
}

/**
 * aqi变化趋势
 *
 * @param {Object}
 *            data
 */
function aqiTendency(data) {
	var myChart = echarts.init(document.getElementById('aqi_tendency_charts')),
		pd = getParamData();
	var colomW = 165.5; //图例中，单个的宽度为91.9像素
	for(var i in data.legend) {
		if(data.legend[i].length > 5) {
			colomW = 246.5;
		}
	}
	var canvasW = $("#aqi_tendency_charts").width() * 0.93,
		rowNum = parseInt(canvasW / colomW), //一行的显示的单图例的个数
		marginTop = 130, //默认的单行的行高22
		totalRow = parseInt(data.legend.length / rowNum),
		gridTop = (marginTop * totalRow) + "px";
	//console.log(data.legend.length + " 一行个数  " + rowNum + "  总行数  " + totalRow);
	var option = {
		backgroundColor: 'white', // 背景色
		title: {
			x: 'center',
			textStyle: {
				color: '#333',
				ontWeight: 'normal',
				fontSize: 45
			},
			top: '40px'
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(params) {
				var obj = JSON.parse(JSON.stringify(params))
				var itemName = obj[0].name;
				var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
				var fsize = 45,
					changeWid = 240;
				if(obj[0].seriesName.length <= 5) {
					changeWid = 200;
				} else {
					changeWid = 240;
				}
				for(var i = 0; i < obj.length; i++) {
					if(obj[i].value == undefined) {
						obj[i].value = '-';
					}
					str = str + "<div class=\"tooltip-data\"><b style=\"color: " + obj[i].color + ";\"> &bull;</b><i style=\"width:" + (changeWid - 30) + "px;\">" + obj[i].seriesName + ":" + obj[i].value + "</i>";
					str += "</div>";

				}
				return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
			},
			position: ['7%', '5%']
		},
		toolbox: {
			show: true,
			width:'300px',
			height:'100px',
			itemSize:'50',
			feature: {
				myTool2: {
					show: true,
					title: '隐藏图例',
					icon: 'image://' + $.ctx + '/resources/img/close-blue.png',
					onclick: function() {
						var opt = {
							legend: {
								show: false
							}
						};
						myChart.setOption(opt);
					}
				},
				myTool1: {
					show: true,
					title: '显示图例',
					icon: 'image://' + $.ctx + '/resources/img/ok-blue.png',
					onclick: function() {
						var opt = {
							legend: {
								show: true
							}
						};
						myChart.setOption(opt);
					}
				}
			}
		},
		legend: {			
			left:70,
			right:70,
			itemGap:50,
			itemWidth:50,
			itemHeight:30,
			data: data.legend
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top: gridTop,
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: data.xAxisData
		},
		yAxis: {
			type: 'value'
		},
		series: data.series
	};
	if(bigScreen_flg) {
		setLineFontSize(option, 45);
	}
	myChart.setOption(option);
}

function show(oEvent) {
	var UserBox = document.getElementById("ShowUserBoxMain");
	if(UserBox.style.display == "block") {
		document.getElementById("ShowUserBoxMain").style.display = "none";
	} else {
		document.getElementById("ShowUserBoxMain").style.display = "block";
	}
	e = window.event || oEvent;
	if(e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}

function hide() {
	document.getElementById("ShowUserBoxMain").style.display = "none";
}