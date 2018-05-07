function initradioDate() {
	var myDate = new DateHelp({
		date: new Date(), //从此日期开始计算
		format: 'yyyy-MM-dd hh:mm:ss'
	});
	var start24 = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 24, myDate.minus, myDate.secound),
		start48 = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 48, myDate.minus, myDate.secound),
		start72 = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 72, myDate.minus, myDate.secound),
		start96 = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 96, myDate.minus, myDate.secound),
		end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 1, myDate.minus, myDate.secound);
	myDate.format = 'yyyy-MM-dd hh:00:00';
	start24 = myDate.formatDate(start24, myDate.format);
	start48 = myDate.formatDate(start48, myDate.format);
	start72 = myDate.formatDate(start72, myDate.format);
	start96 = myDate.formatDate(start96, myDate.format);
	end = myDate.formatDate(end, myDate.format);
	return {
		start24: start24,
		start48: start48,
		start72: start72,
		start96: start96,
		end: end
	};
}
var dragBar = [{
	type: 'inside',
	//			height: "35px",
	//			width: "97%",
	//			left: '0',
	//			right: '50px',
	//			bottom: "0",
	start: 0,
	end: 100
}, {
	start: 0,
	end: 100,
	handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
	handleSize: '80%',
	handleStyle: {
		color: '#fff',
		shadowBlur: 3,
		shadowColor: 'rgba(0, 0, 0, 0.6)',
		shadowOffsetX: 2,
		shadowOffsetY: 2
	}
}];

function getCurrentTime() {
	var myDate = new DateHelp({
		date: new Date(), //从此日期开始计算
		format: 'yyyy-MM-dd hh:mm:ss'
	});
	var currTime = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 1);
	myDate.format = 'yyyy年MM月dd日  hh时';
	currTime = myDate.formatDate(currTime, myDate.format);
	return currTime;
}

function qkconvert(index, fgname, parentClassname) {
	muiltCharts.toogleMenu(index, fgname, parentClassname);
}

function sortconvert(index, fgParentName, chartsid) {
	muiltCharts.sortFgTimeType = index;
	var clsname = '.' + fgParentName + " button";
	var obj = $(clsname),
		param = {
			'cityId': parent.cityId,
			'endTime': muiltCharts.currTime.endTime
		},
		sortAqiUrl = $.coreApiPath + '/heavyPollution/sortDistrictAqi';
	switch(index) {
		case 1:
			{
				muiltCharts.btnStyleConvert(obj, '24hour');
				param['startTime'] = muiltCharts.currTime.start24_Time;
			}
			break;
		case 2:
			{
				muiltCharts.btnStyleConvert(obj, '48hour');
				param['startTime'] = muiltCharts.currTime.start48_Time;
			}
			break;
		case 3:
			{
				muiltCharts.btnStyleConvert(obj, '72hour');
				param['startTime'] = muiltCharts.currTime.start72_Time;
			}
			break;
		case 4:
			{
				muiltCharts.btnStyleConvert(obj, '96hour');
				param['startTime'] = muiltCharts.currTime.start96_Time;
			}
			break;
	}
	ajax_getReq(sortAqiUrl, param, muiltCharts.getSortDataAqi, chartsid);
}

var muiltCharts = new Vue({
	el: '#content',
	data: {
		chartsColors: ['#DB2727', '#94A1E9', '#FFBF00', '#1ACB18', '#0019A4', '#07D7A0', '#6E00FF', '#A1007E', '#FF7F97', '#AB7526', '#CC5127', '#FF6B00', '#F6F100', '#7ADE00', '#00A4A4', '#3758E1', '#9456A8', '#B200E3', '#FF2A9D', '#535353'],
		districtName: parent.cityName,
		currshowTime: getCurrentTime(),
		remChartstatus: 1, //默认标识选中气态物		
		currTime: {
			start24_Time: initradioDate().start24,
			start48_Time: initradioDate().start48,
			start72_Time: initradioDate().start72,
			start96_Time: initradioDate().start96,
			endTime: initradioDate().end
		},
		bigchartsFg: {
			'b': false,
			'index': null
		},
		label_list: [],
		aqi: [],
		pm25: [],
		pm10: [],
		co: [],
		no2: [],
		so2: [],
		o3: [],
		districtAqiArr: {
			'label': [],
			'value': [],
			'time': []
		},
		sortDistrictAqi: {
			'label': [],
			'value': []
		},
		sortFgTimeType: 1
	},
	created: function() {
		this.refreshCharts();
	},
	watch: {},
	methods: {
		toogleMenu: function(index, fgname, parentClassname) {
			var clsname = '.' + parentClassname + ' ' + "button";
			var obj = $(clsname);
			this.remChartstatus = index;
			this.btnStyleConvert(obj, fgname);
			if(index == 1) { //气态				
				$("#cityPollutionQt_trend").show();
				$("#cityPollutionKl_trend").hide();
				this.echartsResize('cityPollutionQt_trend');
			} else if(index == 2) { //颗粒				
				$("#cityPollutionQt_trend").hide();
				$("#cityPollutionKl_trend").show();
				this.echartsResize('cityPollutionKl_trend');
			} else if(index == 3) { //气态大		
				$("#cityPollutionQt_trendBig").show();
				$("#cityPollutionKl_trendBig").hide();
				this.echartsResize('cityPollutionQt_trendBig');
			} else if(index == 4) { //颗粒大			
				$("#cityPollutionQt_trendBig").hide();
				$("#cityPollutionKl_trendBig").show();
				this.echartsResize('cityPollutionKl_trendBig');
			}
		},
		resiteTime: function() {
			this.currTime.start24_Time = initradioDate().start24;
			this.currTime.start48_Time = initradioDate().start48;
			this.currTime.start72_Time = initradioDate().start72;
			this.currTime.start96_Time = initradioDate().start96;
			this.currTime.endTime = initradioDate().end;
		},
		refreshCharts: function() {
			this.currshowTime = getCurrentTime();
			this.resiteTime();
			/////////污染物趋势图
			var url = $.coreApiPath + "/heavyPollution/cityPollution",
				param = {
					'cityId': parent.cityId,
					'startTime': this.currTime.start24_Time,
					'endTime': this.currTime.endTime
				};
			var chartsArr = ['cityPollutionQt_trend', 'cityPollutionKl_trend', 's'];
			ajax_getReq(url, param, this.getDataArr, chartsArr);
			//////////站点趋势图
			Url = $.coreApiPath + '/heavyPollution/stationAqi';
			chartsArr = ['stationChart', 's'];
			ajax_getReq(Url, param, this.stationAqi, chartsArr);

			/////////区县排序			
			var obj = $('.btnConvent02 button'); //刷新小的排序的曲线
			switch(this.sortFgTimeType) {
				case 1:
					{
						this.btnStyleConvert(obj, '24hour');
						param['startTime'] = this.currTime.start24_Time;
					}
					break;
				case 2:
					{
						this.btnStyleConvert(obj, '48hour');
						param['startTime'] = this.currTime.start48_Time;
					}
					break;
				case 3:
					{
						this.btnStyleConvert(obj, '72hour');
						param['startTime'] = this.currTime.start72_Time;
					}
					break;
				case 4:
					{
						this.btnStyleConvert(obj, '96hour');
						param['startTime'] = this.currTime.start96_Time;
					}
					break;
			}
			Url = $.coreApiPath + '/heavyPollution/sortDistrictAqi';
			ajax_getReq(Url, param, this.getSortDataAqi, 'sortChart');
			/////////区县趋势图
			param['startTime'] = this.currTime.start24_Time;
			Url = $.coreApiPath + '/heavyPollution/districtAqi';
			chartsArr = ['districtAqi', 's'];
			ajax_getReq(Url, param, this.districtAqiCharts, chartsArr);
			if(this.bigchartsFg.b) { //放大弹窗效果
				this.redrawBigCharts(this.bigchartsFg.index);
			}
		},
		echartsResize: function(id) {
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
		},
		btnStyleConvert: function(obj, fg) {
			var clsName = '';
			$(obj).removeClass('btn-info');
			$(obj).removeClass('btn-white');
			for(var i = 0; i < obj.length; i++) {
				clsName = obj[i].className;
				if(clsName.indexOf('btn-info') == -1) {
					obj[i].className = clsName + ' btn-white';
				}
			}
			for(var i = 0; i < obj.length; i++) {
				if(obj[i].name == fg) {
					obj[i].className = clsName + " btn-info";
				}
			}
		},
		dealTime: function(time) {
			var myDate = new DateHelp({
				date: new Date(), //从此日期开始计算
				format: 'MM/dd hh'
			});
			var currTime = new Date(time);
			myDate.format = 'MM/dd hh';
			currTime = myDate.formatDate(currTime, myDate.format);
			return currTime;
		},
		getDataArr: function(data, id) {
			this.label_list = [];
			this.aqi = [];
			this.pm25 = [];
			this.pm10 = [];
			this.co = [];
			this.no2 = [];
			this.so2 = [];
			this.o3 = [];
			for(var i = 0; i < data.result.length; i++) {
				this.label_list.push(this.dealTime(data.result[i].rtcTime));
				this.aqi.push(data.result[i].aqi);
				this.pm25.push(data.result[i].pm25);
				this.pm10.push(data.result[i].pm10);
				this.co.push(data.result[i].co);
				this.no2.push(data.result[i].no2);
				this.so2.push(data.result[i].so2);
				this.o3.push(data.result[i].o3);
			}
			this.cityPollution_Qt(id[0], id[2]);
			this.cityPollution_Kl(id[1], id[2]);
		},
		getSortDataAqi: function(data, parentId) {
			this.sortDistrictAqi['label'] = [];
			this.sortDistrictAqi['value'] = [];
			for(var i = 0; i < data.result.length; i++) {
				this.sortDistrictAqi['label'].push(data.result[i].name);
				this.sortDistrictAqi['value'].push(data.result[i].aqi);
			}
			this.sortChartAqi(parentId);
		},
		cityPollution_Kl: function(id, fg) {
			//$("#" + id).empty();
			var myChart = echarts.init(document.getElementById(id)),
				dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					formatter: function(params) {
						var obj = JSON.parse(JSON.stringify(params)),
							str = '<div class="tooltip-tit">' + obj[0].name + '</div>',
							fsize = 12;
						for(var i = 0; i < obj.length; i++) {
							if(obj[i].value == undefined) {
								obj[i].value = '--';
							}
							str += "<div class=\"tooltip-data clear\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
							str += "</div>";
						}
						return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
					}
				},
				grid: {
					top: '17%',
					left: '0%',
					right: '50px',
					bottom: '10px',
					containLabel: true
				},
				legend: {
					left: 15,
					data: ['AQI', 'PM2.5', 'PM10']
				},
				xAxis: [{
					type: 'category',
					data: this.label_list,
					axisLabel: {
						margin: 20,
						formatter: function(value, idx) {
							if(!value) {
								return "无时间数据";
							}
							return value;
						}
					},
					axisTick: {
						alignWithLabel: true
					}
				}],
				yAxis: [{
					name: 'AQI',
					type: 'value',
					splitNumber: 2,
					position: 'left',
					axisLabel: {
						textStyle: {
							fontSize: 10
						}
					},
					splitLine: {
						show: false //不显示网格线
					},
					axisLine: {
						lineStyle: {
							color: this.chartsColors[0]
						}
					}
				}, {
					name: 'PM2.5',
					type: 'value',
					offset: 50,
					position: 'right',
					splitLine: {
						show: false //不显示网格线
					},
					axisLine: {
						lineStyle: {
							color: this.chartsColors[1]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 10
						},
						formatter: '{value}'
					}
				}, {
					name: 'PM10',
					type: 'value',
					position: 'right',
					splitLine: {
						show: false //不显示网格线
					},
					axisLine: {
						lineStyle: {
							color: this.chartsColors[2]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 10
						},
						formatter: '{value}'
					}
				}],
				series: [{
					name: 'AQI',
					type: 'bar',
					data: this.aqi,
					itemStyle: {
						normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
							color: function(params) {
								var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
								if(params.data == 0) {
									return '#f7f7f7';
								} else if(params.data > 0 && params.data <= 50) {
									return colorList[0];
								} else if(params.data > 50 && params.data <= 100) {
									return colorList[1];
								} else if(params.data > 100 && params.data <= 150) {
									return colorList[2];
								} else if(params.data > 150 && params.data <= 200) {
									return colorList[3];
								} else if(params.data > 200 && params.data <= 300) {
									return colorList[4];
								} else if(params.data > 300) {
									return colorList[5];
								}
							}
						}
					}
				}, {
					name: 'PM2.5',
					type: 'line',
					yAxisIndex: 1,
					data: this.pm25,
					itemStyle: {
						normal: {
							color: this.chartsColors[1]
						}
					}
				}, {
					name: 'PM10',
					type: 'line',
					data: this.pm10,
					yAxisIndex: 2,
					itemStyle: {
						normal: {
							color: this.chartsColors[2]
						}
					}
				}]
			};
			if(fg == 'b') {
				option.dataZoom = dragBar;
				option.grid.bottom = '50px';
			}
			setLineFontSize(option, '');
			myChart.setOption(option);
		},
		cityPollution_Qt: function(id, fg) {
			var myChart = echarts.init(document.getElementById(id), 'macarons'),
				dataZoomcolors = ['f7f7f7', '#eae6f2', '#65c2e7'];
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					formatter: function(params) {
						var obj = JSON.parse(JSON.stringify(params)),
							str = '<div class="tooltip-tit">' + obj[0].name + '</div>',
							fsize = 12;
						for(var i = 0; i < obj.length; i++) {
							if(obj[i].value == undefined) {
								obj[i].value = '--';
							}
							if(obj[i].seriesName == 'CO' && obj[i].value % 1 === 0) {
								obj[i].value = obj[i].value + '.0';
							}
							str += "<div class=\"tooltip-data clear\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
							str += "</div>";
						}
						return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
					}
				},
				legend: {
					left: 15,
					data: ['AQI', 'CO', 'NO2', 'SO2', 'O3']
				},
				grid: {
					top: '17%',
					left: '35px',
					right: '70px',
					bottom: '10px',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: this.label_list,
					axisLabel: {
						//rotate: 60,
						textStyle: {
							fontSize: 10
						},
						formatter: function(value, idx) {
							if(!value) {
								return "无时间数据";
							}
							return value;
						}
					},
					axisTick: {
						alignWithLabel: true
					}
				}],
				yAxis: [{
					name: 'AQI',
					type: 'value',
					position: 'left',
					splitLine: {
						show: false
					},
					splitLine: {
						show: false //不显示网格线
					},
					axisLabel: {
						textStyle: {
							fontSize: 10
						}
					},
					axisLine: {
						lineStyle: {
							color: this.chartsColors[0]
						},
						formatter: '{value}'
					}
				}, {
					name: 'CO',
					type: 'value',
					splitLine: {
						show: false //不显示网格线
					},
					offset: 0,
					position: 'right',
					axisLine: {
						lineStyle: {
							color: this.chartsColors[1]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 10
						}
					}
				}, {
					name: 'NO2',
					type: 'value',
					offset: 40,
					position: 'right',
					splitLine: {
						show: false //不显示网格线
					},
					axisLine: {
						lineStyle: {
							color: this.chartsColors[2]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 10
						},
						formatter: '{value}'
					}
				}, {
					name: 'SO2',
					type: 'value',
					splitLine: {
						show: false //不显示网格线
					},
					offset: 80,
					position: 'right',
					axisLine: {
						lineStyle: {
							color: this.chartsColors[3]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 5
						},
						formatter: '{value}'
					}
				}, {
					name: 'O3',
					type: 'value',
					splitLine: {
						show: false //不显示网格线
					},
					offset: 120,
					position: 'right',
					axisLine: {
						lineStyle: {
							color: this.chartsColors[4]
						}
					},
					axisLabel: {
						textStyle: {
							fontSize: 5
						},
						formatter: '{value}'
					}
				}],
				series: [{
					name: 'AQI',
					type: 'bar',
					data: this.aqi,
					yAxisIndex: 0,
					itemStyle: {
						normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
							color: function(params) {
								var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
								if(params.data == 0) {
									return '#f7f7f7';
								} else if(params.data > 0 && params.data <= 50) {
									return colorList[0];
								} else if(params.data > 50 && params.data <= 100) {
									return colorList[1];
								} else if(params.data > 100 && params.data <= 150) {
									return colorList[2];
								} else if(params.data > 150 && params.data <= 200) {
									return colorList[3];
								} else if(params.data > 200 && params.data <= 300) {
									return colorList[4];
								} else if(params.data > 300) {
									return colorList[5];
								}
							}
						}
					}
				}, {
					name: 'CO',
					type: 'line',
					yAxisIndex: 1,
					data: this.co,
					itemStyle: {
						normal: {
							color: this.chartsColors[1] //自定义设置线条颜色
						}
					}
				}, {
					name: 'NO2',
					type: 'line',
					data: this.no2,
					yAxisIndex: 2,
					itemStyle: {
						normal: {
							color: this.chartsColors[2] //自定义设置线条颜色
						}
					}
				}, {
					name: 'SO2',
					type: 'line',
					data: this.so2,
					yAxisIndex: 3,
					itemStyle: {
						normal: {
							color: this.chartsColors[3] //自定义设置线条颜色
						}
					}
				}, {
					name: 'O3',
					type: 'line',
					data: this.o3,
					yAxisIndex: 4,
					itemStyle: {
						normal: {
							color: this.chartsColors[4] //自定义设置线条颜色
						}
					}
				}]
			};
			if(fg == 'b') {
				option.dataZoom = dragBar;
				option.grid.bottom = '50px';
			}
			setLineFontSize(option, '');
			myChart.setOption(option);
		},
		stationAqi: function(data, chartId) {
			//$("#" + chartId).empty();
			//this.chartsColors[1]
			var iteColors;
			for(var i = 0; i < data["result"].series.length; i++) {
				iteColors = {
					normal: {
						color: this.chartsColors[i] //自定义设置线条颜色
					}
				};
				data["result"].series[i].itemStyle = iteColors;
			}
			for(var j = 0; j < data["result"].category.length; j++) {
				data["result"].category[j] = this.dealTime(data["result"].category[j]);
			}
			var myChart = echarts.init(document.getElementById(chartId[0]));
			var option = {
				tooltip: {
					position: ['10%', '10%'],
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					formatter: function(params) {
						var obj = JSON.parse(JSON.stringify(params)),
							str = '<div class="tooltip-tit">' + obj[0].name + '</div>',
							fsize = 12;
						for(var i = 0; i < obj.length; i++) {
							if(obj[i].value == undefined) {
								obj[i].value = '--';
							}
							str += "<div class=\"tooltip-data\" style=\"width:auto;\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
							str += "</div>";
						}
						return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
					}
				},
				legend: {
					data: data["result"].legend
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
					data: data["result"].category
				},
				yAxis: {
					type: 'value'
				},
				series: data["result"].series
			};
			if(chartId[1] == 'b') {
				option.dataZoom = dragBar;
				option.grid.bottom = '50px';
			}
			setLineFontSize(option, '');
			myChart.setOption(option);
		},
		districtAqiCharts: function(data, parentId) {
			//$("#" + parentId).empty();
			var myChart = echarts.init(document.getElementById(parentId[0]));
			var iteColors;
			for(var i = 0; i < data["result"].series.length; i++) {
				iteColors = {
					normal: {
						color: this.chartsColors[i] //自定义设置线条颜色
					}
				};
				data["result"].series[i].itemStyle = iteColors;
			}
			for(var j = 0; j < data["result"].category.length; j++) {
				data["result"].category[j] = this.dealTime(data["result"].category[j]);
			}
			var option = {
				tooltip: {
					position: ['10%', '10%'],
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					},
					formatter: function(params) {
						var obj = JSON.parse(JSON.stringify(params)),
							str = '<div class="tooltip-tit">' + obj[0].name + '</div>',
							fsize = 12;
						for(var i = 0; i < obj.length; i++) {
							if(obj[i].value == undefined) {
								obj[i].value = '--';
							}
							str += "<div class=\"tooltip-data\" style=\"width:auto;\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
							str += "</div>";
						}
						return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
					}
				},
				legend: {
					data: data["result"].legend
				},
				grid: {
					top: '70px',
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: data["result"].category
				},
				yAxis: {
					type: 'value'
				},
				series: data["result"].series
			};
			if(parentId[1] == 'b') {
				option.dataZoom = dragBar;
				option.grid.bottom = '50px';
			}
			setLineFontSize(option, '');
			myChart.setOption(option);
		},
		sortChartAqi: function(id) {
			var myChart = echarts.init(document.getElementById(id));
			var option = {
				color: ['#00b2f1'],
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					top: '4%',
					left: '3%',
					right: '4%',
					bottom: '7%',
					containLabel: true
				},
				xAxis: [{
					nameRotate: 30,
					type: 'category',
					data: this.sortDistrictAqi['label'],
					axisTick: {
						alignWithLabel: true
					},
					axisLabel: {
						interval: 0,
						rotate: 40
					}
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					type: 'bar',
					barWidth: '60%',
					itemStyle: {
						//通常情况下：
						normal: {　　　　　　　　　　　　 //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
							color: function(params) {
								var ColorsLevel = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023'];
								if(params.value >= 0 && params.value <= 50) {
									return ColorsLevel[0];
								} else if(params.value > 50 && params.value <= 100) {
									return ColorsLevel[1];
								} else if(params.value > 100 && params.value <= 150) {
									return ColorsLevel[2];
								} else if(params.value > 150 && params.value <= 200) {
									return ColorsLevel[3];
								} else if(params.value > 200 && params.value <= 300) {
									return ColorsLevel[4];
								} else if(params.value > 300) {
									return ColorsLevel[5];
								}
							}
						}
					},
					data: this.sortDistrictAqi['value']
				}]
			};
			setLineFontSize(option, '');
			myChart.setOption(option);
		},
		setHmtl: function(fg) {
			var screenHeight = document.body.offsetHeight,
				calcH = screenHeight - 170;
			var html = '';
			html += '<div class="ibox">';
			html += '	<div class="ibox-content">';
			switch(fg) {
				case 1:
					{
						html += '		<div class="btnConvent04">';
						html += '			<button class="btn btn-white btn-xs pull-right" onclick=\'qkconvert(3,"qtbig","btnConvent04")\' name="qtbig">气态物</button>';
						html += '			<button class="btn btn-info btn-xs pull-right" onclick=\'qkconvert(4,"klbig","btnConvent04")\' name="klbig">颗粒物</button>';
						html += '		</div>	';
						html += '		<div id="cityPollutionKl_trendBig" class="clear" style="width: 100%; height: ' + calcH + 'px; display: none;"></div>';
						html += '		<div id="cityPollutionQt_trendBig" class="clear" style="width: 100%; height: ' + calcH + 'px;  "></div>';
					}
					break;
				case 2:
					{

						html += '<div id="stationChartBig" class="clear" style="width: 100%; height: ' + calcH + 'px;"></div>';
					}
					break;
				case 3:
					{

						html += '<div class="btnConvent03">';
						html += '	<button class="btn btn-white btn-xs pull-right" onclick=\'sortconvert(4,"btnConvent03","sortChartBig")\' name="96hour">96小时</button>';
						html += '	<button class="btn btn-white btn-xs pull-right" onclick=\'sortconvert(3,"btnConvent03","sortChartBig")\' name="72hour">72小时</button>';
						html += '	<button class="btn btn-white btn-xs pull-right" onclick=\'sortconvert(2,"btnConvent03","sortChartBig")\' name="48hour">48小时</button>';
						html += '	<button class="btn btn-info btn-xs pull-right" onclick=\'sortconvert(1,"btnConvent03","sortChartBig")\' name="24hour">24小时</button>';
						html += '</div>			';
						html += '<div id="sortChartBig" class="clear" style="width: 100%; height: ' + calcH + 'px;"></div>';
					}
					break;
				case 4:
					{

						html += '<div id="districtAqiBig" class="clear" style="width: 100%; height: ' + calcH + 'px;"></div>';
					}
					break;
			}
			html += '	</div>';
			html += '</div>';
			return html;
		},
		redrawBigCharts: function(index) {
			var url = '',
				param = {
					'cityId': parent.cityId,
					'startTime': this.currTime.start96_Time,
					'endTime': this.currTime.endTime
				};
			switch(index) {
				case 1:
					{
						url = $.coreApiPath + "/heavyPollution/cityPollution",
						chartsArr = ['cityPollutionQt_trendBig', 'cityPollutionKl_trendBig', 'b'];
						ajax_getReq(url, param, this.getDataArr, chartsArr);
					}
					break;
				case 2:
					{
						url = $.coreApiPath + '/heavyPollution/stationAqi';
						chartsArr = ['stationChartBig', 'b'];
						ajax_getReq(url, param, this.stationAqi, chartsArr);
					}
					break;
				case 3:
					{
						url = $.coreApiPath + '/heavyPollution/sortDistrictAqi';
						ajax_getReq(url, param, this.getSortDataAqi, 'sortChartBig');
					}
					break;
				case 4:
					{
						url = $.coreApiPath + '/heavyPollution/districtAqi';
						chartsArr = ['districtAqiBig', 'b'];
						ajax_getReq(Url, param, this.districtAqiCharts, chartsArr);
					}
					break;
			}
		},
		toOpenWin: function(index) {
			var html = this.setHmtl(index);
			var titleHtml = this.districtName;
			switch(index) {
				case 1:
					{
						titleHtml += '最近24-96小时污染物趋势图';
					}
					break;
				case 2:
					{
						titleHtml += '最近24-96小时AQI趋势图';
					}
					break;
				case 3:
					{
						titleHtml += '县市区小时AQI排名';
					}
					break;
				case 4:
					{
						titleHtml += '县市区24-96小时AQI趋势图';
					}
					break;
			}
			var winfg = layer.open({
				title: [titleHtml, 'background:#fff;'],
				type: 1, //代表了展示的内容的类型
				anim: 1, //图层动画类型
				shade: false, //是否显示遮罩层
				id: "chartsContent",
				content: html,
				area: ['98%', '94%'],
				maxmin: false,
				move: false,
				cancel: function() {
					muiltCharts.bigchartsFg.b = false;
					muiltCharts.bigchartsFg.index = null;
					///////当关闭放大窗口的时候重置aqi趋势图的小图状态		
					if(muiltCharts.bigchartsFg.index == 1) {
						if(muiltCharts.remChartstatus == 1 || muiltCharts.remChartstatus == 3) {
							muiltCharts.toogleMenu(1, "qt", "btnConvent01");
						} else if(muiltCharts.remChartstatus == 2 || muiltCharts.remChartstatus == 4) {
							muiltCharts.toogleMenu(2, "kl", "btnConvent01");
						}
					}
				}
			});

			layer.style(winfg, {
				top: '40px'
			});

			this.bigchartsFg.b = true;
			this.bigchartsFg.index = index;
			this.redrawBigCharts(index);
			if(index == 1) {
				if(this.remChartstatus == 1 || this.remChartstatus == 3) {
					this.toogleMenu(3, "qtbig", "btnConvent04");
				} else if(this.remChartstatus == 2 || this.remChartstatus == 4) {
					this.toogleMenu(4, "klbig", "btnConvent04");
				}
			}
		}
	}
});