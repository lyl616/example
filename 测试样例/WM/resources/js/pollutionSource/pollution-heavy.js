$(function() {
	initShow();
	$("#btn_search").click(function(){
		getHeavyAqiData();
	});
});

function initShow(){
	var date = new Date();
	var currentDate = getCurDateDay(date);
	var beforDate = getCurDateDayDecre(date,180);
	$("#startTime").val(beforDate);
	$("#endTime").val(currentDate);
	getHeavyAqiData();
	showWind(new Date(date.getTime()-1000*60*60*5),currentDate);
	showHistory(beforDate,currentDate);
	showPollutionCloud(beforDate,currentDate);
	//initAirData({city:$("#city").val(),interval:1,startTime:beforDate,endTime:currentDate});
}

function getHeavyAqiData(){
	load = layer.msg('加载中', {
	  icon: 16,
	  shade: 0.01,
	  time:0
	});
	start = $("#startTime").val();
	end = $("#endTime").val();
	if(!isNull(start) && !isNull(end)){
		$.ajax({
			type:"get",
			url:$.coreApiPath+"/pollution/heavy/rectangle",
			data : {
				cityId : parent.cityId,
				startDate : start,
				endDate : end,
				stationIds : $("#stationIds").val()
			},
			success : function(data){
				$("#total_count").html("重污染过程："+data.data.length+"次");
				rectangleCharts(data);
				layer.close(load);
			}
		});
	}else{
		layer.msg("请选择时间!");
	}
}

function rectangleCharts(data) {
	if(data.data.length==0){
		layer.msg("无重污染分析数据");
		return;
	}
	var datas = [];
	$.each(data.data, function(i,o) {
		var seriesData = {};
		seriesData.name = o.name+"小时";
		seriesData.value = o.value;
		seriesData.itemStyle = {};
		seriesData.itemStyle.normal = {};
		seriesData.itemStyle.normal.color = o.color;
		seriesData.level = o.level;
		seriesData.info=o.info;
		datas.push(seriesData);
	});
	var myChart = echarts.init(document.getElementById('rectangle_charts'));
	option = {
		tooltip: {
			trigger: 'item',
			formatter: function(obj,ticket,cal){
				var str = obj.data.info.startTime+"<br />";
				str+=obj.data.info.endTime+"<br />";
				str+="持续时长："+obj.value+"小时<br />";
				str+="最大AQI："+obj.data.info.maxAqi+"<br />";
				str+=obj.data.level+"级应急预案";
				return str;
			}
		},
		series: [{
			type: 'treemap',
			width:'100%',
			height:'100%',			
            roam:true,
            nodeClick:false,
            breadcrumb:{
            	show:false
            },
            label:{
            	normal:{
            		show:true,
            		position: [10, 10],
            		textStyle: {
						ellipsis: true,
						color: '#fff',
						fontStyle: 'normal',
						fontWeight: 'normal',
						fontSize: 14
					}
            	}
            },
            itemStyle: {
                normal: {
                    show: true,
                    textStyle:{
                    	color:'#fff',
                    	fontSize:14,
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
	myChart.on('click', function (params) {
		if(params.componentType == "series"){
			var start = params.data.info.startTime;
			var end = params.data.info.endTime;
			showWind(start,end);
			showHistory(start,end);
			showPollutionCloud(start,end);
			getAreaDataByDate(params.data);
			//initAirData({city:$("#city").val(),interval:1,startTime:start,endTime:end});
		}
	});
	myChart.on('dblclick', function(params) {
		if(params.componentType == "series"){
		}
	});
}

function getAreaDataByDate(param){
	//initCusModal(d,param);
	$.ajax({
		type:"get",
		url:$.coreApiPath + "/pollution/heavy/date/area",
		data: {
			cityId: parent.cityId,
			startDate: param.info.startTime,
			endDate: param.info.endTime,
			stationIds : $("#stationIds").val()
		},
		success : function(d){
			showArea(d,param);
		}
	});
}

function initCusModal(d,param){
	var r = $("#areaShowDiv");
	var X = r.offset().top;
	var Y = r.offset().left;
	layer.open({
	  type: 1
	  ,id:"area_charts"
	  ,title: param.info.startTime+"——"+param.info.endTime
	  ,area: [r.width(), r.height()]
	  ,shade: 0
	  ,fixed:false
	  ,offset: [X,Y]
	  ,maxmin: false
	  ,scrollbar: true
	  ,zIndex:2
	  ,success: function(layero, index){
	  }
	});
}

function showArea(data,param){
	var myChart = echarts.init(document.getElementById("area_charts"));
	var option = {
		title:{text:param.info.startTime+"/"+param.info.endTime,  x: 'center',   },
		backgroundColor: '#fff',
	    tooltip : {
	        trigger: 'axis',
	        formatter:'{b}<br/>aqi：{c}'
	    },
	    textStyle: {
            fontSize: 14
	    },
	    toolbox: {
	        feature: {
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : data.xs
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            type:'line',
	            areaStyle: {normal: {color:param.color}},
	            data:data.datas
	        }
	    ]
	};
	myChart.setOption(option);
}
