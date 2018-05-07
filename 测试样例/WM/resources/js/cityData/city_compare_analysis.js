/**
 * 全局变量
 */
var type = "aqi";

var equipment_type = "0"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var s_stech_type = "1010"; //： 站点数据来源（设备类型） 单传感器 1010  ６传感器 6010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var stationType = "-1"; // 站点类型 -1：表示全部

var interval = "1"; // 查询表格 1 小时 2 天 3 月 4 年
var reg = "yyyy-MM-dd HH";
var city = "";
var province = "";
var district1 = "";
var districtName1 = "";
var district2 = "";
var districtName2 = "";
var startTime = "";
var endTime = "";
var range = "";
var maxVal = "";
/**
 * 页面初始化
 */
$(function() {

	Geo.init();
	Geo.fns();
});

var Geo = {
	init: function() {

		city = parent.cityId;
		province = parent.provinceId;

		initDistrictByCityId(parent.cityId, '-1', 'district1');
		initDistrictByCityId(parent.cityId, '-1', 'district2');
		clearData();
		// 始 时间
		// initStartEndDate(7);
		initWateStyle("startTime", "endTime");
		initStartEndDateWithReg(new Date(), 7, reg);

		// 站点类型 不----用
		//  initStationType("station_type", "4");

		// 根据不同区间显示 不同搜索范围
		showSeachRangeBtType("pdata_range", type);

		$("#city1WzSel").select2({
			theme: "bootstrap",
			width: 'auto', //设置默认尺寸
			language: "zh-CN"
		});
		$("#city2WzSel").select2({
			theme: "bootstrap",
			width: 'auto', //设置默认尺寸
			language: "zh-CN"
		});

	},
	fns: function() {

		// 污染物类型绑定
		$('#pollution_type').change(function() {
			type = $(this).children('option:selected').val();
			queryCityDoubline();
			// 根据不同区间显示 不同搜索范围
			showSeachRangeBtType("pdata_range", type);
			// maxVal = getMaxValByType(type);
			queryCityPercentage('0');
		})

		$('#interval').change(function() {
			interval = $(this).children('option:selected').val();
			if(interval == "1") {
				reg = "yyyy-MM-dd HH";
				initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
			} else if(interval == "2") {
				reg = "yyyy-MM-dd";
				initStartEndTimeByDay(new Date(), "startTime", "endTime", dateVal, reg);
			} else if(interval == "3") {
				reg = "yyyy-MM";
				initStartEndTimeByMonth(new Date(), "startTime", "endTime", dateVal);
			} else if(interval == "4") {
				reg = "yyyy";
				initStartEndTimeByYear(new Date(), "startTime", "endTime", dateVal);
			}
			_TIMMER.Refresh();

		});

		$("#pdata_range").change(function() {
			range = $(this).val();
			queryCityPercentage('1');
		});

	}

};

function initPostParams() {
	// city = $("#city").val();

	district1 = $("#district1").val();
	districtName1 = $("#district1").find("option:selected").text();
	$("#city1Wz").html(districtName1 + "-微站");

	district2 = $("#district2").val();
	districtName2 = $("#district2").find("option:selected").text();
	$("#city2Wz").html(districtName2 + "-微站");

	startTime = $("#startTime").val();
	endTime = $("#endTime").val();
	if(interval == "1") {
		startTime = startTime.substring(0, 13) + ":00:00";
		endTime = endTime.substring(0, 13) + ":00:00";
	}
	range = $("#pdata_range").val();

}

/**
 * 统计两个 城市（区县）站点 的个数
 */
function showCityStationTable() {

	initPostParams();
	initS_stechType();
	if(checkDistricts()) {
		var postData = {
			district1: district1,
			district2: district2
		};
		// 查询两个区的所有 污染站点信息
		ajax_post($.coreApiPath + "/analysis/history/queryPolluReposCntByCity", postData, function(r) {
			var temptab = $("#stationCntTavle");
			temptab.html("");
			var html = "";
			if(r.result) {
				var map = r.data;
				var thLst = map.th;
				for(var i = 0; i < thLst.length; i++) {
					r
					if(i == 0) {
						html += "<tr><th></th>";
					}
					html += "<th class='tc'>" + thLst[i].name + "</th>";
					if(i == thLst.length - 1) {
						html += "</tr>";
					}
				}
				var tr1Lst = map.tr1Lst;
				for(var i = 0; i < tr1Lst.length; i++) {
					if(i == 0) {
						html += "<tr><td>" + districtName1 + "</td>";
					}
					var disCnt1 = tr1Lst[i];
					if(disCnt1.substr(0, 1) == "0") {
						html += "<td>" + disCnt1 + "</td>";
					} else {
						html += "<td style='color: blue;'>" + disCnt1 + "</td>";
					}

					if(i == tr1Lst.length - 1) {
						html += "</tr>";
					}
				}
				var tr2Lst = map.tr2Lst;
				for(var i = 0; i < tr2Lst.length; i++) {
					if(i == 0) {
						html += "<tr><td>" + districtName2 + "</td>";
					}

					var disCnt2 = tr2Lst[i];
					if(disCnt2.substr(0, 1) == "0") {
						html += "<td>" + disCnt2 + "</td>";
					} else {
						html += "<td style='color: blue;'>" + disCnt2 + "</td>";
					}

					// html += "<td>" + tr2Lst[i] + "</td>";
					if(i == tr2Lst.length - 1) {
						html += "</tr>";
					}
				}
			}
			temptab.html(html);
			$("#stationCntTavleDiv").show();

			// 双折线趋势图
			queryCityDoubline();
			$("#doubleLine_div").show();

			// 站点占比
			queryCityPercentage(0);
			$("#cityPercentageDiv").show();

			$("#smallStationDiv").show();

			initSmallStations(district1, district2, $("#station_type").val());
			smallStationQuery();
		});
	}

}

/**
 * 验证所选城市
 *
 * @returns {Boolean}
 */
function checkDistricts() {
	if(district1 == "" || district2 == "") {
		layer.msg("请选择两个对比城市");
		return false;
	} else {
		if(district1 == district2) {
			layer.msg("对比城市不能一样");
			return false;
		}
	}
	return true;
}

function checkTime() {
	if(endTime == "" || startTime == "") {
		layer.msg("请选择开始或结时间 ！");
		return false;
	} else {
		if(startTime == endTime) {
			layer.msg("开始和结束时间不能一致");
			return false;
		}
	}
	return true;
}

/**
 * 双折线 趋势图
 *
 * @returns {Boolean}
 */
function queryCityDoubline() {
	initPostParams();

	if(checkDistricts() && checkTime()) {
		clearChar("double_line_char");
		var postData = {
			city1: city,
			district1: district1,
			district2: district2,
			startTime: startTime,
			endTime: endTime,
			type: type,
			equipment_type: equipment_type,
			s_stech_type: s_stech_type,
			stationType: stationType,
			interval: interval
		};
		var url = $.coreApiPath + "/analysis/history/cityDoubleLine";
		ajax_post(url, postData, function(data) {
			initDistrictDobbuleLines(data.dobLineMap, "double_line_char");
		});
	}

	queryCityPercentage('1')
}

function initDistrictDobbuleLines(data, domId) {
	var doubleLineChar = echarts.init(document.getElementById(domId));
	var option = {
		backgroundColor: 'white', // 背景色
		grid: {
			bottom: '21px',
			top: '20%',
			left: '5%',
			right: '20px'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				animation: false
			}
		},
		title: '',
		legend: {
			data: [districtName1, districtName2]
		},
		xAxis: {
			type: 'category',
			data: data.linexAxis,
			axisLabel: {
				show: true,
				// interval : 3, // {number}//间隔段
				// rotate : 45,// 旋转45度
				margin: 10,
				formatter: function(value) {
					if(value != "" && value != null) {
						var date = new Date(value);
						return date.Format("MM/dd hh:00");
					} else {
						return "";
					}
				},
				textStyle: {
					color: '#333',
					fontSize: 12
				}
			}
		},
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: districtName1,
			type: 'line',
			data: data.lineData1

		}, {
			name: districtName2,
			type: 'line',
			data: data.lineData2
		}]
	};
	doubleLineChar.setOption(option);
	doubleLineChar.resize();
}

/**
 * 百分比统计
 */

function queryCityPercentage(flag) {
	initPostParams();

	if(checkDistricts() && checkTime()) {
		if(range == "-1") {
			if(flag != "0")
				layer.msg("请选择区间！");
			return false;
		}
		clearChar("cityPercentage");
		var postData = {
			city: city,
			district1: district1,
			district2: district2,
			startTime: startTime,
			endTime: endTime,
			equipment_type: equipment_type,
			s_stech_type: s_stech_type,
			stationType: stationType,
			type: type,
			range: range,
			interval: interval
		};

		var url = $.coreApiPath + "/analysis/history/cityPercentageBar";
		ajax_post(url, postData, function(r) {
			if(r.result) {
				initPercentageChar(r.data, "cityPercentage");
			}
		});
	}

}

/**
 * 初始化百分比柱形图
 * @param data
 * @param domId
 */
function initPercentageChar(data, domId) {
	var myChart = echarts.init(document.getElementById(domId));
	var option = {
		backgroundColor: 'white', // 背景色
		title: {
			text: '区间浓度占比',
			x: 'center',
			y: 'top',
			textStyle:{
				fontSize:'12px'
			},
			textAlign: 'center'
		},
		grid: {
			x: "41px",
			y: "41px",
			x2: "21px",
			y2: "21px"
		},
		tooltip: {
			trigger: 'item',
			formatter: function(params) {				
				return params.name + type + " <br/>" + "在" + range + "占比:" + params.value + "%";
			}
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: [districtName1, districtName2]
		}],
		yAxis: [{
			type: 'value',
			max: 100,
			axisLabel: {
				show: true,
				interval: 'auto',
				formatter: '{value} %'
			}
		}],
		series: [{
			name: '百分比',
			type: 'bar',
			data: data
		}]
	};
	myChart.setOption(option);
	myChart.resize();
}

/**
 * 所有微点信息查询
 */
function smallStationQuery() {

	initPostParams();

	if(checkDistricts() && checkTime()) {
		var sids1 = $("#city1WzSel").val();
		var sids2 = $("#city2WzSel").val();

		var params = {
			city: city,
			district1: district1,
			district2: district2,
			equipment_type: equipment_type,
			s_stech_type: s_stech_type,
			stationType: stationType,
			startTime: startTime,
			endTime: endTime,
			type: type,
			range: range,
			interval: interval,
			firIds: sids1 == null ? "" : sids1.join(","),
			secIds: sids2 == null ? "" : sids2.join(",")
		};
		var load = layer.msg('加载中', {
			icon: 16,
			shade: 0.01
		});

		clearChar("tendency_district1");
		clearChar("tendency_district2");
		ajax_post($.coreApiPath + "/analysis/history/querySmallStations", params, function(r) {
			if(r.result) {
				aqiTendency("tendency_district1", r.data.charMap1);
				aqiTendency("tendency_district2", r.data.charMap2);
			}
			layer.close(load);
		});
	}
}

/**
 * aqi变化趋势
 *
 * @param {Object}
 *            data
 */
function aqiTendency(domId, data) {
	var myChart = echarts.init(document.getElementById(domId));
	var option = {
		backgroundColor: 'white', //背景色
		title: {
			x: 'center',
			textStyle: {
				color: '#333333',
				ontWeight: 'normal',
				fontSize: 16
			}
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(params) {
				var obj = JSON.parse(JSON.stringify(params))
				var itemName = obj[0].name;
				var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
				var fsize = 12,
					changeWid = 140;
				for(var i = 0; i < obj.length; i++) {
					if(obj[i].value == undefined) {
						obj[i].value = '-';
					}
					str = str + "<div class=\"tooltip-data\" style=\"width:" + changeWid + "px;\"><b style=\"color: " + obj[i].color + ";\"> &bull;</b><i style=\"width:" + (changeWid - 30) + "px;\">" + obj[i].seriesName + ":" + obj[i].value + "</i>";
					str += "</div>";
				}
				return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
			},
			position: ['7%', '5%']
			//			position : function(p) { //其中p为当前鼠标的位置
			//				return [ p[0] - 20, p[1] - 10 ];
			//			}
		},
		legend: {
			data: data.legend,
			show: false
		},
		toolbox: {
			show: true,
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
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: data.xAxisData,
			axisLabel: {
				show: true,
				// interval : 3, // {number}//间隔段
				// rotate : 45,// 旋转45度
				margin: 10,
				formatter: function(value) {
					if(value != "" && value != null) {
						var date = new Date(value);
						return date.Format("yyy-MM-dd hh");
					} else {
						return "";
					}
				},
				textStyle: {
					color: '#333',
					fontSize: 12
				}
			}
		},
		yAxis: {
			type: 'value',
			max: data.max
		},
		series: data.series
	};
	myChart.setOption(option);
	//console.log("执行了");
	myChart.resize();
}

/**
 * 初始化省
 *
 * @param domId
 *            渲染的div Id
 * @param pro
 *            -1 默认选中 否则选中pro
 */
function initUserProvinces(pro, proDom, city, cityDom, districtId, distDom) {
	var url = $.coreApiPath + "/user/getUserPros";
	var opt = $("#" + proDom);
	opt.empty();
	$.getJSON(url).success(function(data) {
		if(data != null && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				opt.append("<option value=\"" + data[i].id + "\">" + data[i].domainName + "</option>");
			}
			if(pro == "-1") {
				initCityByProId(opt.val(), "-1", cityDom, "-1", distDom);
			} else {
				if(city != "-1") {
					opt.find("option[value='" + pro + "']").attr("selected", true);
					if(districtId != -1) {
						initCityByProId(pro, city, cityDom, districtId, distDom);
					} else {
						initCityByProId(pro, city, cityDom, "-1", distDom);
					}
				}
			}
		}
	});

}

/**
 * 初始化微站选择信息
 */
function initSmallStations() {
	if(checkDistricts()) {
		$("#city1WzSel").select2("val", "");
		$("#city2WzSel").select2("val", "");

		initSelect2({
			id: "city1WzSel",
			all: false,
			url: $.coreApiPath + "/station/queryDistrictStations",
			postData: {
				district: district1,
				equipment_type: equipment_type,
				s_stech_type: s_stech_type,
				stationType: stationType
			},
			width: 'auto',
			value: "stationId",
			text: "stationName"
		});
		//console.log("ddddds");
		initSelect2({
			id: "city2WzSel",
			all: false,
			url: $.coreApiPath + "/station/queryDistrictStations",
			postData: {
				district: district2,
				equipment_type: equipment_type,
				s_stech_type: s_stech_type,
				stationType: stationType
			},
			width: 'auto',
			value: "stationId",
			text: "stationName"
		});
	}
}

/**
 * 清空 页面数据
 */
function clearData() {
	clearChar("double_line_char");
	clearChar("cityPercentage");
	clearChar("tendency_district1");
	clearChar("tendency_district2");

	$("#stationCntTavleDiv").hide();
	// 双折线趋势图
	$("#doubleLine_div").hide();
	// 站点占比
	$("#cityPercentageDiv").hide();
	$("#smallStationDiv").hide();
}

/**
 * 设备类型
 */
function initS_stechType() {
	var opts = {};
	opts.objID = "s_stech_type";
	opts.type = "11";
	opts.parentID = "";
	opts.cityID = city;
	opts.proID = province;
	opts.isAll = false;
	opts.callBack = init_station_type;

	init_s_stech_type_option(opts);

	$('#s_stech_type').change(function() {
		var selVal = $(this).children('option:selected').val();

		s_stech_type = selVal.split("_")[0];
		if(s_stech_type == "6010" || s_stech_type == "1010") {
			equipment_type = "0";
		} else if(s_stech_type == "99" || s_stech_type == "98" || s_stech_type == "101") {
			equipment_type = "4";
		} else if(s_stech_type == "5010") {
			equipment_type = "3";
		}
		init_station_type();
	});
}

/**
 * 站点类型
 * @param codeId code数据的ID
 */
function init_station_type() {
	var codeID = $("#s_stech_type").val();
	if(codeID != null && codeID.indexOf("_") != -1) {
		codeID = $("#s_stech_type").val().split("_")[1];
	}
	var opts = {};
	opts.objID = "station_type";
	opts.type = "4";
	opts.parentID = codeID;
	opts.cityID = city;
	opts.proID = province;
	opts.isAll = true;
	opts.callBack = initSmallStations;
	init_station_type_option(opts);

	$('#station_type').change(function() {
		stationType = $(this).children('option:selected').val().split("_")[0];
		initSmallStations();
	});
}