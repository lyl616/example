/**
 * 
 */
var type = "aqi";
var fullName1 = "";
var fullName2 = "";
var distName1 = "";
var distName2 = "";

$(function() {
	switchTab($("#charsTab li a"));
	queryWeatherChars();
});

function switchTab(a) {
	a.click(function() {
		type = this.id;
		type = type.substring(2);
		// queryWeatherChars();
	});
}

function queryWeatherChars() {

	var pro1 = $("#hidePro1").val();
	var city1 = $("#hideCity1").val();
	var district1 = $("#hideDistrict1").val();
	var pro2 = $("#hidePro2").val();
	var city2 = $("#hideCity2").val();
	var district2 = $("#hideDistrict2").val();

	if (pro1 == "" || pro2 == "") {
		layer.msg("请选择两个对比城市");
		return false;
	}

	var endTime = $("#endTime").val();
	var startTime = $("#startTime").val();
	if (endTime == "" || startTime == "") {
		layer.msg("请选择开始或结时间 ！");
		return false;
	}

	// var postData = {
	// pro1 : 370000,
	// city1 : 370800,
	// district1 : 370801,
	// pro2 : 370000,
	// city2 : 370800,
	// district2 : 370811,
	// startTime : '2016-12-02 22:00:00',
	// endTime : '2016-12-04 22:00:00',
	// type : type
	// };
	var postData = {
		pro1 : pro1,
		city1 : city1,
		district1 : district1,
		pro2 : pro2,
		city2 : city2,
		district2 : district2,
		startTime : startTime,
		endTime : endTime,
		type : type
	};
	var url = $.coreApiPath + "/analysis/history/querycharts";
	ajax_post(url, postData, function(data) {
		// 饼图
		initPie(data.pieMap1, distName1, type + '_pie1');
		initPie(data.pieMap2, distName2, type + '_pie2');
		// 双折线图
		initDistrictDobbuleLines(data.dobLineMap, type + "_line");
		// 柱状图
		initPollutionBar(data.barMap, type + "_bar");
	});
}

/**
 * 展示 饼状图
 * 
 * @param data
 *            数据
 * @param title
 *            标题
 * @param domId
 *            展示位置 div》 id
 */
function initPie(data, title, domId) {
	var myChart = echarts.init(document.getElementById(domId));

	var option = {
		color : [ '#00E500', '#FFFF00', '#FF7E00', '#FF0000', '#99004C', '#7E0023' ],
		title : {
			text : title,
			x : 100,
			textStyle : {
				color : '#333333',
				ontWeight : 'normal',
				fontSize : 14
			},
		},
		tooltip : {
			trigger : 'item',
			formatter : "{a} <br/>{b} : {c}次 ({d}%)"
		},
		grid : {
			top : '2%',
			left : '3%',
			right : '4%',
			bottom : '3%',
			containLabel : true
		},
		legend : {
			orient : 'vertical',
			left : 'right',
			itemWidth : 10,
			itemHeight : 8,
			textStyle : {
				fontSize : 11
			},
			data : data.piexLegend
		},
		series : [ {
			name : '空气质量',
			type : 'pie',
			radius : '65%',
			center : [ '50%', '50%' ],
			label : {
				normal : {
					textStyle : {
						fontSize : 10
					}
				}
			},
			data : data.lstPie,
			itemStyle : {
				emphasis : {
					shadowBlur : 10,
					shadowOffsetX : 0,
					shadowColor : 'rgba(0, 0, 0, 0.5)'
				}
			}
		} ]

	};
	myChart.setOption(option);
}

/**
 * 初始化
 * 
 * @param data
 */
function initDistrictDobbuleLines(data, domId) {
	var myChart = echarts.init(document.getElementById(domId));
	var option = {
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				animation : false
			}
		},
		title : '',
		legend : {
			data : [ distName1, distName2 ]
		},
		xAxis : {
			type : 'category',
			data : data.linexAxis,
			axisLabel : {
				show : true,
				// interval : 3, // {number}//间隔段
				rotate : 45,// 旋转45度
				margin : 10,
				formatter : function(value) {
					if (value != "" && value != null) {
						var date = new Date(value);
						return date.Format("MM/dd hh:00");
					} else {
						return "";
					}
				},
				textStyle : {
					color : 'blue',
					fontFamily : 'sans-serif',
					fontSize : 10,
					fontStyle : 'italic',
					fontWeight : 'bold'
				}
			},
		},
		yAxis : [ {
			type : 'value'
		} ],
		series : [ {
			name : distName1,
			type : 'line',
			data : data.lineData1

		}, {
			name : distName2,
			type : 'line',
			data : data.lineData2
		} ]
	};
	myChart.setOption(option);
}

function initPollutionBar(data, domId) {
	var myChart = echarts.init(document.getElementById(domId));
	option = {
		// title : {
		// text : '某地区蒸发量和降水量',
		// subtext : '纯属虚构'
		// },
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ distName1, distName2 ]
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		calculable : true,
		xAxis : [ {
			type : 'category',
			data : data.barxAxis
		} ],
		yAxis : [ {
			type : 'value'
		} ],
		series : [ {
			name : distName1,
			type : 'bar',
			data : data.lstBar1,
			markLine : {
				data : [ {
					type : 'average',
					name : '平均值'
				} ]
			}
		}, {
			name : distName2,
			type : 'bar',
			data : data.lstBar2,
			markLine : {
				data : [ {
					type : 'average',
					name : '平均值'
				} ]
			}
		} ]
	};
	myChart.setOption(option);
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
		if (data != null && data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				opt.append("<option value=\"" + data[i].id + "\">" + data[i].domainName + "</option>");
			}
			if (pro == "-1") {
				initCityByProId(opt.val(), "-1", cityDom, "-1", distDom);
			} else {
				if (city != "-1") {
					opt.find("option[value='" + pro + "']").attr("selected", true);
					if (districtId != -1) {
						initCityByProId(pro, city, cityDom, districtId, distDom);
					} else {
						initCityByProId(pro, city, cityDom, "-1", distDom);
					}
				}
			}
		}
	});

}

// 用户选择城市
function openSelectCity(id) {

	$("#selectCityModal").modal('show');

	initUserProvinces("-1", "selProvince", "-1", "selCity", "-1", "selDistrict");
	$("#iptCity").val(id);// 用于保存是哪个城市动作
}

function showCity() {
	var showId = $("#iptCity").val();

	// 省份
	var optPro = $("#selProvince option:selected"); // 获取选中的项
	var provinceId = optPro.val(); // 拿到选中项的值
	var provinceName = optPro.text(); // 拿到选中项的文本
	// 城市
	var optCity = $("#selCity option:selected"); // 获取选中的项
	var cityId = optCity.val(); // 拿到选中项的值
	var cityName = optCity.text(); // 拿到选中项的文本

	var optDistrict = $("#selDistrict option:selected"); // 获取选中的项
	var districtId = optDistrict.val(); // 拿到选中项的值
	var districtName = optDistrict.text(); // 拿到选中项的文本

	if ("city1" == showId) {
		$("#hidePro1").val(provinceId);
		$("#hideCity1").val(cityId);
		$("#hideDistrict1").val(districtId);
		fullName1 = provinceName + "=" + cityName + "-" + districtName;
		distName1 = districtName;
		$("#city1").val(cityName + "-" + districtName);
	} else if ("city2" == showId) {
		$("#hidePro2").val(provinceId);
		$("#hideCity2").val(cityId);
		$("#hideDistrict2").val(districtId);
		fullName2 = provinceName + "=" + cityName + "-" + districtName;
		distName2 = districtName;
		$("#city2").val(cityName + "-" + districtName);
	}
	$("#selectCityModal").modal('hide');
}