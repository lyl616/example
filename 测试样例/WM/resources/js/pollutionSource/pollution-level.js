$(function() {
	getDictionary({
		id: "s_concentrationType",
		type: 9,
		default: -1,
		all: false,
		complete: initShow
	});
	$("#btn_search").click(function() {
		getLevelAqiData();
	});
});

function initShow() {
	var date = new Date();
	var currentDate = getCurDateDay(date);
	var beforDate = getCurDateDayDecre(date, 7);
	$("#startTime").val(beforDate);
	$("#endTime").val(currentDate);
	getLevelAqiData();
}

function getLevelAqiData() {
	start = $("#startTime").val();
	end = $("#endTime").val();
	conType = $("#s_concentrationType").find("option:selected").text();
	if(!isNull(start) && !isNull(end)) {
		$.ajax({
			type: "get",
			url: $.coreApiPath + "/pollution/heavy/rectangle/level",
			data: {
				cityId: parent.cityId,
				startDate: start,
				endDate: end,
				type: conType
			},
			success: function(data) {
				rectangleCharts(data);
			}
		});
	} else {
		layer.msg("请选择时间!");
	}
}

function rectangleCharts(data) {
	if(data.datas.length == 0) {
		layer.msg("无重污染级别分析数据");
		return;
	}
	var datas = [];
	$.each(data.datas, function(i, o) {
		var seriesData = {};
		seriesData.name = o.stationname + "：" + o.name;
		seriesData.value = o.value;
		seriesData.itemStyle = {};
		seriesData.itemStyle.normal = {};
		seriesData.itemStyle.normal.color = o.color;
		seriesData.level = o.level;
		seriesData.levelName = o.name;
		seriesData.stationname = o.stationname;
		seriesData.avgvalue = o.avgvalue;
		seriesData.stationId = o.stationId;
		seriesData.color = o.color;
		datas.push(seriesData);
	});
	var myChart = echarts.init(document.getElementById('rectangle_charts'));
	option = {
		tooltip: {
			trigger: 'item',
			formatter: function(obj, ticket, cal) {
				var str = start + "<br />";
				str += end + "<br />";
				str += "站点：" + obj.data.stationname + "<br />";
				str += conType + "：" + obj.data.avgvalue + "<br />";
				str += "级别：" + obj.data.levelName;
				return str;
			}
		},
		series: [{
			type: 'treemap',
			width: '100%',
			height: '100%',
			breadcrumb: {
				show: false
			},
			label: {
				normal: {
					show: true,
					position: [10, 10],
					textStyle: {
						ellipsis: true,
						color: '#fff',
						fontStyle: 'normal',
						fontWeight: 'normal',
						fontSize: 10
					}
				}
			},
			itemStyle: {
				normal: {
					show: true,
					textStyle: {
						color: '#fff',
						fontSize: 16,
					},
					borderWidth: 1,
					borderColor: '#fff'
				},
				emphasis: {
					label: {
						show: true
					}
				}
			},
			data: datas
		}]
	};
	myChart.setOption(option);
	myChart.on('dblclick', function(params) {
		if(params.componentType == "series") {
			getAreaDataByStation(params.data);
		}
	});
}

function getAreaDataByStation(data) {
	$.ajax({
		type: "get",
		url: $.coreApiPath + "/pollution/heavy/level/area",
		data: {
			cityId: parent.cityId,
			startDate: start,
			endDate: end,
			type: conType,
			stationIds: data.stationId
		},
		success: function(d) {
			showArea(d, data);
		}
	});
}

function showArea(data, param) {
	$("#areaModal").modal("show");
	$("#areaModal_title").html("[" + param.stationname + "] " + start + "-" + end);
	var myChart = echarts.init(document.getElementById('area_charts'));
	var option = {
		tooltip: {
			trigger: 'axis',
			formatter: '{b}<br/>' + conType + '：{c}'
		},
		toolbox: {
			right: "25px",
			show: true,
			feature: {
				saveAsImage: {
					show: true
				}
			}
		},
		grid: {
			left: '1%',
			right: '5%',
			top: '40px',
			bottom: '60px',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: data.xs
		}],
		yAxis: [{
			type: 'value'
		}],
		dataZoom: [{
			type: 'slider',
			showDetail: false,
			dataBackgroundColor: '#eae6f2', // 底色
			fillerColor: '#f7f7f7', // 选中的颜色
			handleColor: "#65c2e7", // 滑块颜色
			height: "35px",
			width: "94%",
			x: "1%",
			y: "86%"
		}],
		series: [{
			type: 'line',
			areaStyle: {
				normal: {
					color: param.color
				}
			},
			data: data.datas
		}]
	};
	myChart.setOption(option);
}