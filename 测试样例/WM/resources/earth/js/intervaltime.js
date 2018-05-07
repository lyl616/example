
var totalHour;
var currentIndex;
var payInternal = 3000;
var endTime;

function intervalTime(){
	currentIndex = -1;
	totalHour = d3.select("#display").attr("data-total-hour");
	endTime = new Date(d3.select("#display").attr("data-date"));
	window.setInterval(autoplayAir,payInternal);
}

function autoplayAir(){
	currentIndex+=1;
	if(currentIndex>totalHour){
		currentIndex=1;
	}
	var seltime = endTime.getTime()-currentIndex*60*60*1000;
	var param = getWindyParam(seltime);
	//var address = local+"/"+param.dataType+"/"+param.type+"/"+param.year+"/"+param.m+"/"+param.day+"/"+param.hour+"/"+param.city;
	var datePath = $.coreApiPath+"/data/wind/"+param.year+"/"+param.m+"/"+param.day+"/"+param.hour;
}

function getWindyParam(currentDate){
	var d = new Date(currentDate);
	var year = d.getFullYear();
	var m = d.getMonth()+1;
	var day = d.getDate();
	var hour = d.getHours();
	var city = d3.select("#display").attr("data-city-id");
	return {dataType:dataType,type:type,year:year,m:m,day:day,hour:hour,city:city};
}
