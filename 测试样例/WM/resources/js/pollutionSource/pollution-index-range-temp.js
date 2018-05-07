$(function() {
	$("#d1212").val(new Date().Format("yyyy-MM-dd"));
	initGKDZCharts();
	getDictionary({
		id: "s_concentrationType",
		type: 9,
		default: -1,
		all: false,
		complete: function() {
			$("#s_concentrationType").val('56');
		}
	});
});

function initGKDZCharts() {
	var time = $("#d1212").val();
	var pollution = $("#s_concentrationType").find("option:selected").text();
	if(time == null || "" == time) {
		time = new Date().Format("yyyy-MM-dd");
	}
	if(pollution == null || "" == pollution) {
		pollution = 'PM2.5';
	}
	var url = $.coreApiPath + "/pollutionSource/getAllCityCharts";
	var param = {
		"time": time,
		"type": "day",
		"cityCode": parent.cityId,
		"pollution": pollution
	};
	ajax_post_info(url, param, '加载', function(data) {
		$("#chartSVG").empty();
		d3_data = data;
		x_index = data.xArr;
		Modernizr.load({
			test: Modernizr.svg,
			yep: $.ctx + '/resources/plugins/d3/js/temperature-temp.js',
			nope: [$.ctx + '/resources/plugins/jquery/jquery-1.9.1.min.js', $.coreApiPath + '/resources/plugins/d3/js/fallback.js'],
			complete: function() {
				chartInit();
			}
		});
	}, "图表请求数据失败!");
}
var z_index = 23;
var d3_data = {};
var x_index = [];
var y_index = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];