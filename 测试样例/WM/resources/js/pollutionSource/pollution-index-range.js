$(function() {
	initCityRange(null);
	$(".s_city").click(function(){
		setTimeout("changeCurrentCity()",500);
	});
});
$(function() {
	$('#example').DataTable({
		columns : [ {
			data : "firstname"
		}, {
			data : "lastname"
		}, {
			data : "phone"
		}, {
			data : "firstname1"
		}, {
			data : "lastname1"
		}, {
			data : "phone1"
		}, {
			data : "phone2"
		}, ],
		"ordering" : false, // 开关，是否启用各列具有按列排序的功能
		"searching" : false, // 开关，是否启用客户端过滤器
		"lengthChange" : false, // 开关，是否显示每页大小的下拉框
		"paging" : false, //开关，是否显示分页器
		"info" : false, // 开关，是否显示表格的一些信息
	});
});

/**
 * 初始化城市污染物排行
 */
var CITYRANGE=null;//存储所有城市排行榜，用于切换城市当前城市的排名
function initCityRange(date) {
	var time;
	if(date==null){
		var myDate = new Date;
		time = myDate.getFullYear()+"-"+(myDate.getMonth()+1);
	}else{
		time = date;
	}
	$("#myModalLabel p span").html(time.split("-")[1]+"月国控站点空气质量排名")
	
	var currentCityCode = parent.cityId;
	var url = $.backendApiPath + "/pollutionSource/getAllCityRange";
	var param = {
		"time" : time,
		"type" : "month"
	};
	var cityRange = 0;
	var range_html = "";
	var range;
	$.getJSON(url, param).success(function(data) {
		for(var d in data){
			if(!isNaN(d)){
				if(data[d].cityCode == currentCityCode){
					cityRange = Number(d)+1;	
				}
				range = Number(d)+1;
				range_html+="<tr> <td>"+range+"</td> <td>"+data[d].provinceName+"</td> <td>"+data[d].cityName+"</td> <td>"+data[d].avgAqi+"</td> <td>"+data[d].levelName+"</td> <td>"+data[d].avgPm25+"</td> <td>"+data[d].avgPm10+"</td> </tr>"
			}
		}
		if(date == null){
			CITYRANGE = data;
			$("#currentRange").html("当月排名："+cityRange);
		}
		$("#tableBody").html(range_html);
	});
}

/**
 * 切换城市
 */
function changeCurrentCity(){
	var currentCityCode = parent.cityId;
	if(CITYRANGE!=null){
		var cityRange=0;
		for(var d in CITYRANGE){
			if(CITYRANGE[d].cityCode==currentCityCode){
				cityRange = Number(d)+1;	
			}
		}
		$("#currentRange").html("当月排名："+cityRange);
	}else{
		initCityRange(null);
	}
}
