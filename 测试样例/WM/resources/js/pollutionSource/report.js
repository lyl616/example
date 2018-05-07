var map=null;
var currentPolutionType = "pm25";
function initMap(){
	var mapCenter=$("#mapCenter").val();
//    map = new BMap.Map("WMMAP", {minZoom:11,maxZoom:13,enableMapClick:false});          // 创建地图实例  
//    // 创建点坐标
//	map.centerAndZoom(mapCenter, 12);
//	map.clearOverlays();
//	map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    // 创建点坐标  
    //map.centerAndZoom(point, 5);         //初始化地图，设置中心点坐标和地图级别  
    //map.centerAndZoom("北京", 13);
    //map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //创建地址解析器实例
	// 初始化请求
	if(null == map){
		map = new BMap.Map("WMMAP", {minZoom:12,maxZoom:17,enableMapClick:false});
	}
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(mapCenter, function(point){
        if (point) {
        	initialize_point = point;
            map.centerAndZoom(initialize_point, 13);
            map.enableScrollWheelZoom(); // 允许滚轮缩放

            map.addEventListener("zoomend", function(){    
                map.removeOverlay(heatmapOverlay);
            });
            // 初始化请求
//          if (_is_exits_function(_after_map_init)) {
//              _after_map_init(map);
//          }
        }else{
            layer.msg("您选择地址没有解析到结果!");
        }
    }, mapCenter);

}
function _is_exits_function(funcName) {
    try {
        if (typeof(eval(funcName)) == "function") {
            return true;
        }
    } catch(e) {}
    return false;
}
//function _after_map_init() {
//	requestRealData();
//}
//function requestRealData() {
//  
//  var reqURL = "../realtimePC/realtimeData";
//  var province=$("#province").val();
//  var city=$("#city").val();
//  var district=$("#district1").val();
//  var stationType=$("#district2").val();
//  $.ajax({  
//      url : reqURL,  
//      async : false, //注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected  
//      type : "POST",  
//      dataType : "json", 
//      data:{polutionType: currentPolutionType,province:province,city:city,district:district,stationType:stationType},
//      success : function(data) {  
//      	aqiData=data.dataListAqi;
//      	pm25Data=data.dataListPm25;
//      	pm10Data=data.dataListPm10;
//      	coData=data.dataListCo;  
//      	so2Data=data.dataListSo2; 
//      	o3Data=data.dataListO3;  
//      	no2Data=data.dataListNo2; 
//      	var cityAqiData = data.cityAqiData;
//      	//创建城市AQI信息
//      	
//      	//改变数据
//      	//changeData(currentPolutionType,currentRankingListType,currentSort)
//      }  
//  });  
//}

initMap();

var width = 960,
    height = 126,
    cellSize = 17; // cell size

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var svg = d3.select("#rili").selectAll("svg")
    .data(d3.range(2016,2017))
  .enter().append("svg")
   
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

d3.csv("dji.csv", function(error, csv) {
  if (error) throw error;

  var data = d3.nest()
    .key(function(d) { return d.Date; })
    .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
    .map(csv);

  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day " + color(data[d]); })
    .select("title")
      .text(function(d) { return d + ": " + percent(data[d]); });
});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

