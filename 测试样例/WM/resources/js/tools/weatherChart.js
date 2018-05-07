$(document).ready(function() {
	var date = new Date();
	$("#startTime").val(addDate(date, -1));
	$("#endTime").val(addDate(date, 0));
	//初始化下拉框数据
	var opts = {};
	opts.objID = "wrwtype"; //需要写入option 的select 的id号
	opts.type = "9"; //向后台请求的接口类型名
	opts.parentID = "";
	opts.cityID = parent.cityId; //城市id
	opts.proID = parent.provinceId; //省份id
	opts.isAll = false;
	opts.hideAQI = true;
	opts.callBack = null; //如果需要写回调函数，此处为回调函数的名称。
	backwrite_select_option(opts); //调用函数
	$("#dateType").change(function() {
		var dtVal = $("#dateType").val();
		if(dtVal == "MINUTE") {
			$("#startTime").attr("onFocus", "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:00'})");
			$("#endTime").attr("onFocus", "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:00',minDate:'#F{$dp.$D(\\'startTime\\')}'})");
		}
		if(dtVal == "HOUR") {
			$("#startTime").attr("onFocus", "WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00'})");
			$("#endTime").attr("onFocus", "WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',minDate:'#F{$dp.$D(\\'startTime\\')}'})");
		}
	});
	$("#getChart").bind('click', getChartFun = function() {
		var wrwtype = $("#wrwtype").val();
		var starttime = $("#startTime").val();
		var endtime = $("#endTime").val();
		getChartData(wrwtype, starttime, endtime);
	});
	function addDate(date, days) {
		var d = new Date(date);
		d.setDate(d.getDate() + days);
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var minute = d.getMinutes();
		var sec = d.getSeconds();
		var hour = d.getHours();
		if(month < 10) {
			month = "0" + month;
		}
		if(day < 10) {
			day = "0" + day;
		}
		if(hour < 10) {
			hour = "0" + hour;
		}
		if(minute < 10) {
			minute = "0" + minute;
		}
		if(sec < 10) {
			sec = "0" + sec;
		}
		var val = d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
		return val;
	}
});
function getChartData(wrwtype, starttime, endtime) {
	if(wrwtype == 'tvoc') {
		wrwtype = 'vocs'
	}
	$("#allCharts").html("");
	var dateType = $("#dateType").val();
	var province = parent.provinceId;
	var city = parent.cityId;
	var startT = starttime.replace(/-/g, "/");
	var endT = endtime.replace(/-/g, "/");
	var dateS = new Date(startT);
	var dateE = new Date(endT);
	var dayTime = (Math.abs(dateE - dateS)) / 1000 / 60 / 60 / 24;
	if(dateType == 'MINUTE' && dayTime > 1) {
		alphaWindow("最多查询一天的数据！");
		return;
	}
	var param = {
		type: wrwtype,
		startTime: starttime,
		endTime: endtime,
		// province: province,
		city: city,
		dateType: dateType,
		showFlag: '1'
	};
	var reqURL = $.coreApiPath + "/weather/chartAll";
	ajax_post_info(reqURL, param, '加载', function(data) {
		if(data.length > 0) {
			var j = 0;
			for(var pos in data) {
				var result = data[pos];
				var a = {
					tooltip: {
						trigger: "axis",
						formatter: function(params) {
							var obj = JSON.parse(JSON.stringify(params))
							var itemName = obj[0].name;
							var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
							var fsize = 12,
								changeWid = 120;
							if(obj[0].seriesName.length <= 5) {
								changeWid = 100;
							} else {
								changeWid = 120;
							}
							for(var i = 0; i < obj.length; i++) {
								if(obj[i].value == undefined) {
									obj[i].value = '-';
								}
								str = str + "<div class=\"tooltip-data\" style=\"width:" + changeWid + "px;\"><b style=\"color: " + obj[i].color + ";\"> &bull;</b><i style=\"width:" + (changeWid - 30) + "px;\">" + obj[i].seriesName + ":" + obj[i].value + "</i>";
								str += "</div>";
							}
							return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
						},
						position: ['5%', '5%']
					},
					toolbox: {
						right: "0px",
						show: true,
						feature: {
							saveAsImage: {
								show: true
							}
						}
					},
					legend: {
						data: [],
						top: '10px',
						right: '50px',
						left: '50px'
					},
					grid: {
						x: 40,
						x2: 40,
						y2: 24
					},
					xAxis: [{
						type: "category",
						boundaryGap: !1,
						data: [],
						splitLine: {
							show: false
						}
					}],
					yAxis: [{
						type: "value",
						axisLabel: {
							formatter: "{value}"
						}
					}],
					series: []
				};
				//////////////////////////////
				a.legend.data = result.legend;
				a.xAxis[0].data = result.category;
				if(result.series) {
					for(var i = 0; i < result.series.length; i++) {
						var arr = {
							name: result.series[i].name,
							type: result.series[i].type,
							data: result.series[i].data,
							showSymbol: true,
							legendHoverLink: true,
							hoverAnimation: false
						};
						a.series.push(arr);
					}
					var chartId = "dataChart" + j;
					var rankHtml = "<div class='chunk-set m-t-10 '>" +
						"       <div class='echarts pd10' style='height: 250px;' id='" + chartId + "'></div>" +
						" </div>";
					$("#allCharts").append(rankHtml);
					var e1 = echarts.init(document.getElementById(chartId));
					e1.hideLoading();
					e1.setOption(a);
					j++;
				}
			}
		}
	}, "图表请求数据失败,请联系管理员!");
};