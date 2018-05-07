/**
 * 初始化温度湿度和风力风向
 */
function initAirData(option) {
	$.ajax({
		type : "POST",
		url : $.coreApiPath + "/pollutionSource/getAirData",
		data : {
			city : option.city,
			interval : option.interval,
			startTime : option.startTime,
			endTime : option.endTime
		},
		datatype : "json",
		success : function(data) {
			tempHumidityBoxCharts(data);
		}
	});
}


//温度-湿度 曲线
function tempHumidityCharts(id,xdata,seriesData){
	var temperateChart = echarts.init(document.getElementById(id));
	var option = {
		tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	            animation: false
	        }
	    },
	    title: {
	    },
	    legend: {
	        data:['温度','湿度']
	    },
		xAxis: {
			data : xdata
		},
		 yAxis: [
	         {
	             name: '温度',
	             type: 'value'
	         },
	         {
	             name: '湿度',
	             type: 'value'
	         }
	     ],
		series: seriesData
	};
	temperateChart.setOption(option);
}

/**
 * 显示温湿度箱线图
 * 
 * @param {Object}
 *            data
 */
function tempHumidityBoxCharts(data) {
	var tempData = echarts.dataTool.prepareBoxplotData([ data.tempData ]);
	var humidityData = echarts.dataTool.prepareBoxplotData([ data.humidityData ]);
	var temperateChart = echarts.init(document.getElementById("temp_humidity_charts"));
	var xs = data.xAxis;
	if (xs.length == 0) {
		xs = [ '无数据' ];
	}
	var option = {
		backgroundColor : '#f5f5f5',
		legend : {
			data : [ '温度', '湿度' ]
		},
		tooltip : {
			trigger : 'item',
			axisPointer : {
				type : 'shadow'
			}
		},
		grid : {
			x : '20%',
			y : '20%',
			x1 : '10%',
			y2 : '15%'
		},
		xAxis : {
			type : 'category',
			data : xs,
			boundaryGap : true,
			nameGap : 30,
			splitArea : {
				show : true
			},
			axisLabel : {
				formatter : '{value}'
			},
			splitLine : {
				show : false
			}
		},
		yAxis : {
			type : 'value',
			splitArea : {
				show : false
			}
		},
		series : [ {
			name : '温度',
			type : 'boxplot',
			data : tempData.boxData,
			tooltip : {
				formatter : formatterBox
			}
		}, {
			name : '湿度',
			type : 'boxplot',
			data : humidityData.boxData,
			tooltip : {
				formatter : formatterBox
			}
		} ]
	};
	temperateChart.setOption(option);
}

/**
 * 温湿度箱线图 自定义显示
 * 
 * @param {Object}
 *            param
 */
function formatterBox(param) {
	return [ param.name + ': ', '最大值: ' + param.data[4], 'Q1: ' + param.data[1], 'Q2:' + param.data[2], 'Q3: ' + param.data[3], '最小值: ' + param.data[0] ].join('<br/>')
}