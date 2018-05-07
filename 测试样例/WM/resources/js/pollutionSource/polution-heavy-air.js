//var local = "58.83.189.152";
//var port = "8887";
var dataType = "map";
var type = "wind";

function showWind(startDate,endDate){
	var endTime = endDate;
	var time1 = Date.parse(startDate);  
    var time2 = Date.parse(endDate);
    var totalHourCount = (Math.abs(time2 - time1))/1000/60/60;
    var paramDate = new Date(startDate).Format("yyyy/MM/dd/hh");
    //var address = "http://"+local+":"+port+"/map/wind/"+paramDate+"/"+parent.cityId+"/"+totalHourCount;
    var address = $.ctx+"/map/wind/"+paramDate+"/"+parent.cityId+"/"+totalHourCount;
	$("#windFrame").attr("src",address);
}
