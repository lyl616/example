/// <reference path="../plugins/jquery/jquery-1.9.1.min.js" />

//设置全局变量
var map;
var point = new BMap.Point(115.48038,38.984918);
var heatmapOverlay;
var t = 500;
var clt;
$(function () {
    Geo.init();
    Geo.btn();

});

var Geo = {
    init: function () {
        map = new BMap.Map("WMMAP");          // 创建地图实例  
        // 创建点坐标  
        map.centerAndZoom(point, 7);                 // 初始化地图，设置中心点坐标和地图级别  

        //var opts = { anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(20, 80) }
        //map.addControl(new BMap.NavigationControl(opts));
        //var MapTypeopts = { anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(88, 53) }
        // map.addControl(new BMap.MapTypeControl(MapTypeopts));

 
        //map.addControl(new BMap.CityListControl({
        //    anchor: BMAP_ANCHOR_TOP_RIGHT,
        //    offset: new BMap.Size(20, 52)
        //}));

if (!isSupportCanvas()) {
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
        map.addOverlay(heatmapOverlay);
        var points = [
{ "lng": 114.627136, "lat": 36.720088, "count": 50 },
{ "lng": 115.326233, "lat": 36.956698, "count": 20 },
{ "lng": 115.491809, "lat": 37.236713, "count": 30 },
{ "lng": 115.436617, "lat": 38.462113, "count": 7 },
{ "lng": 114.995082, "lat": 40.360053, "count": 86 },
{ "lng": 114.903096, "lat": 40.20506, "count": 21 },
{ "lng": 114.682328, "lat": 41.296356, "count": 57 },
{ "lng": 116.742825, "lat": 41.365695, "count": 35 },
{ "lng": 117.66269, "lat": 41.3241, "count": 24 },
{ "lng": 118.269801, "lat": 40.612906, "count": 95 },
{ "lng": 118.766528, "lat": 40.458499, "count": 7 },
{ "lng": 118.711336, "lat": 39.936501, "count": 41 },
{ "lng": 119.005693, "lat": 39.851471, "count": 1 },
{ "lng": 118.876912, "lat": 40.388195, "count": 92 },
{ "lng": 118.490568, "lat": 40.035568, "count": 29 },
{ "lng": 118.067431, "lat": 40.612906, "count": 90 },
{ "lng": 118.233006, "lat": 40.598883, "count": 23 },
{ "lng": 117.754677, "lat": 40.696976, "count": 61 },
{ "lng": 117.883458, "lat": 40.626925, "count": 81 },
{ "lng": 118.619349, "lat": 40.878763, "count": 92 },
{ "lng": 117.773074, "lat": 40.962496, "count": 94 },
{ "lng": 117.276347, "lat": 41.032191, "count": 78 },
{ "lng": 117.754677, "lat": 41.157456, "count": 25 },
{ "lng": 117.681087, "lat": 41.476482, "count": 62 },
{ "lng": 117.276347, "lat": 41.434959, "count": 15 },
{ "lng": 117.129168, "lat": 41.31023, "count": 28 },
{ "lng": 117.018785, "lat": 41.890237, "count": 21 },
{ "lng": 116.025331, "lat": 41.656105, "count": 8 },
{ "lng": 115.841358, "lat": 41.587079, "count": 50 },
{ "lng": 115.675782, "lat": 41.504149, "count": 45 },
{ "lng": 116.227701, "lat": 41.296356, "count": 50 },
{ "lng": 116.30129, "lat": 41.157456, "count": 19 },
{ "lng": 116.430071, "lat": 41.296356, "count": 99 },
{ "lng": 116.540455, "lat": 41.517978, "count": 46 },
{ "lng": 116.632441, "lat": 41.625052, "count": 77 },
 { "lng": 117.133768, "lat": 41.141811, "count": 30 },
 { "lng": 117.409727, "lat": 41.239096, "count": 52 },
 { "lng": 117.704084, "lat": 41.252982, "count": 68 },
 { "lng": 117.924852, "lat": 41.294622, "count": 37 },
 { "lng": 117.980043, "lat": 41.363962, "count": 33 },
 { "lng": 118.090427, "lat": 41.419381, "count": 65 },
 { "lng": 118.07203, "lat": 41.530076, "count": 58 },
 { "lng": 117.832865, "lat": 42.203922, "count": 80 },
 { "lng": 117.667289, "lat": 42.367854, "count": 32 },
 { "lng": 117.428125, "lat": 42.395135, "count": 45 },
 { "lng": 117.060179, "lat": 41.3501, "count": 63 },
 { "lng": 116.526657, "lat": 41.433228, "count": 77 },
 { "lng": 116.453068, "lat": 41.874769, "count": 67 },
 { "lng": 116.278293, "lat": 41.912572, "count": 18 },
 { "lng": 116.2323, "lat": 41.850701, "count": 44 },
 { "lng": 116.158711, "lat": 41.761226, "count": 77 },
 { "lng": 115.965539, "lat": 41.692314, "count": 53 },
 { "lng": 115.763169, "lat": 41.685418, "count": 66 },
 { "lng": 114.962887, "lat": 41.505878, "count": 61 },
 { "lng": 114.80651, "lat": 41.498962, "count": 12 },
 { "lng": 115.625189, "lat": 41.485129, "count": 98 },
 { "lng": 115.873553, "lat": 41.381286, "count": 77 },
 { "lng": 116.020731, "lat": 41.24951, "count": 37 },
 { "lng": 116.140314, "lat": 41.047862, "count": 71 },
 { "lng": 115.937943, "lat": 40.796672, "count": 77 },
 { "lng": 115.303237, "lat": 41.24951, "count": 23 },
 { "lng": 115.082469, "lat": 41.422843, "count": 60 },
 { "lng": 114.613338, "lat": 41.898828, "count": 56 },
 { "lng": 114.374173, "lat": 41.781885, "count": 4 },
 { "lng": 115.238846, "lat": 41.054826, "count": 95 },
 { "lng": 115.514806, "lat": 40.866543, "count": 83 },
 { "lng": 115.533203, "lat": 40.775696, "count": 51 },
 { "lng": 115.395223, "lat": 40.775696, "count": 0 },
 { "lng": 115.100866, "lat": 40.929364, "count": 78 },
 { "lng": 114.66853, "lat": 41.193946, "count": 42 },
 { "lng": 114.429365, "lat": 41.214788, "count": 8 },
 { "lng": 115.036476, "lat": 40.495378, "count": 94 },
 { "lng": 115.34923, "lat": 40.333659, "count": 28 },
 { "lng": 115.524004, "lat": 40.319578, "count": 45 },
 { "lng": 115.560799, "lat": 40.263224, "count": 78 },
 { "lng": 114.46616, "lat": 40.065613, "count": 19 },
 { "lng": 115.165257, "lat": 40.01612, "count": 63 },
 { "lng": 115.432018, "lat": 39.533444, "count": 68 },
 { "lng": 114.539749, "lat": 39.083219, "count": 95 },
 { "lng": 116.609445, "lat": 38.731027, "count": 75 },
 { "lng": 116.627842, "lat": 38.702199, "count": 10 },
 { "lng": 117.501714, "lat": 38.377077, "count": 96 },
 { "lng": 116.213903, "lat": 38.261121, "count": 92 },
 { "lng": 115.947142, "lat": 38.253867, "count": 12 },
 { "lng": 114.456961, "lat": 38.572328, "count": 8 },
 { "lng": 115.00888, "lat": 37.385504, "count": 95 },
 { "lng": 115.00888, "lat": 37.392844, "count": 22 },
 { "lng": 114.539749, "lat": 37.512018, "count": 49 },
{ "lng": 115.271041, "lat": 38.143161, "count": 69 }
   
        ];
           heatmapOverlay.setDataSet({ data: points, max: 100 });
      
   
var marker_beijing = new BMap.Marker(new BMap.Point(116.378484, 39.911234), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(39, 25)) });  //北京的点
            map.addOverlay(marker_beijing);               // 将标注添加到地图中
            marker_beijing.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
 			var opts = {
                width: 60,     // 信息窗口宽度
                height: 160,     // 信息窗口高度
                title: "全局信息", // 信息窗口标题
               
            }
            var scontent = "<span></span></br>";
            scontent += "<span style='font-weight:bold;'>SO2：</span><span>125.22</span></br>";
            scontent += "<span style='font-weight:bold;'>NOX：</span><span>127.86</span></br>";
            scontent += "<span style='font-weight:bold;'>VOC：</span><span>1.61</span></br>";
			scontent += "<span style='font-weight:bold;'>PM10：</span><span>8.42</span></br>";
            scontent += "<span style='font-weight:bold;'>Pm2.5：</span><span>9.46</span></br>";
            scontent += "<span style='font-weight:bold;'>OC：</span><span>0.65</span></br>";
            scontent += "<span style='font-weight:bold;'>BC：</span><span>0.58</span></br>";
            var infoWindow = new BMap.InfoWindow(scontent, opts);  // 创建信息窗口对象 
            marker_beijing.addEventListener("mouseover", function () {
                map.openInfoWindow(infoWindow, new BMap.Point(116.378484, 39.911234)); //开启信息窗口
            });

map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        
     

    },
    GetPoint: function () {
        function showInfo(e) {
            console.log("{ \"lng\":" + e.point.lng + ",\"lat\": " + e.point.lat, ",\"count\":" + parseInt(100 * Math.random()) + " },");
        }
        map.addEventListener("click", showInfo);
    },
    btn: function () {
    $("#btn-browse").click(function () {
            var jjypoint = new BMap.Point(115.48038,38.984918);
            map.centerAndZoom(jjypoint, 7);
            map.clearOverlays();

    
if (!isSupportCanvas()) {
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
        map.addOverlay(heatmapOverlay);
        var points = [
{ "lng": 114.627136, "lat": 36.720088, "count": 0 },
{ "lng": 115.326233, "lat": 36.956698, "count": 0 },
{ "lng": 115.491809, "lat": 37.236713, "count": 30 },
{ "lng": 115.436617, "lat": 38.462113, "count": 0 },
{ "lng": 114.995082, "lat": 40.360053, "count": 46 },
{ "lng": 114.903096, "lat": 40.20506, "count": 0 },
{ "lng": 114.682328, "lat": 41.296356, "count": 57 },
{ "lng": 116.742825, "lat": 41.365695, "count": 35 },
{ "lng": 117.66269, "lat": 41.3241, "count": 24 },
{ "lng": 118.269801, "lat": 40.612906, "count": 45 },
{ "lng": 118.766528, "lat": 40.458499, "count": 0 },
{ "lng": 118.711336, "lat": 39.936501, "count": 41 },
{ "lng": 119.005693, "lat": 39.851471, "count": 0 },
{ "lng": 118.876912, "lat": 40.388195, "count": 52 },
{ "lng": 118.490568, "lat": 40.035568, "count": 29 },
{ "lng": 118.067431, "lat": 40.612906, "count": 50 },
{ "lng": 118.233006, "lat": 40.598883, "count": 23 },
{ "lng": 117.754677, "lat": 40.696976, "count": 31 },
{ "lng": 117.883458, "lat": 40.626925, "count": 31 },
{ "lng": 118.619349, "lat": 40.878763, "count": 32 },
{ "lng": 117.773074, "lat": 40.962496, "count": 34 },
{ "lng": 117.276347, "lat": 41.032191, "count": 38 },
{ "lng": 117.754677, "lat": 41.157456, "count": 25 },
{ "lng": 117.681087, "lat": 41.476482, "count": 32 },
{ "lng": 117.276347, "lat": 41.434959, "count": 0 },
{ "lng": 117.129168, "lat": 41.31023, "count": 28 },
{ "lng": 117.018785, "lat": 41.890237, "count": 21 },
{ "lng": 116.025331, "lat": 41.656105, "count": 0 },
{ "lng": 115.841358, "lat": 41.587079, "count": 30 },
{ "lng": 115.675782, "lat": 41.504149, "count": 35 },
{ "lng": 116.227701, "lat": 41.296356, "count": 40 },
{ "lng": 116.30129, "lat": 41.157456, "count": 0 },
{ "lng": 116.430071, "lat": 41.296356, "count": 39 },
{ "lng": 116.540455, "lat": 41.517978, "count": 36 },
{ "lng": 116.632441, "lat": 41.625052, "count": 37 },
 { "lng": 117.133768, "lat": 41.141811, "count": 30 },
 { "lng": 117.409727, "lat": 41.239096, "count": 52 },
 { "lng": 117.704084, "lat": 41.252982, "count": 38 },
 { "lng": 117.924852, "lat": 41.294622, "count": 37 },
 { "lng": 117.980043, "lat": 41.363962, "count": 33 },
 { "lng": 118.090427, "lat": 41.419381, "count": 35 },
 { "lng": 118.07203, "lat": 41.530076, "count": 38 },
 { "lng": 117.832865, "lat": 42.203922, "count": 30 },
 { "lng": 117.667289, "lat": 42.367854, "count": 32 },
 { "lng": 117.428125, "lat": 42.395135, "count": 45 },
 { "lng": 117.060179, "lat": 41.3501, "count": 53 },
 { "lng": 116.526657, "lat": 41.433228, "count": 57 },
 { "lng": 116.453068, "lat": 41.874769, "count": 37 },
 { "lng": 116.278293, "lat": 41.912572, "count": 0 },
 { "lng": 116.2323, "lat": 41.850701, "count": 44 },
 { "lng": 116.158711, "lat": 41.761226, "count": 37 },
 { "lng": 115.965539, "lat": 41.692314, "count": 33 },
 { "lng": 115.763169, "lat": 41.685418, "count": 36 },
 { "lng": 114.962887, "lat": 41.505878, "count": 31 },
 { "lng": 114.80651, "lat": 41.498962, "count": 0 },
 { "lng": 115.625189, "lat": 41.485129, "count": 38 },
 { "lng": 115.873553, "lat": 41.381286, "count": 37 },
 { "lng": 116.020731, "lat": 41.24951, "count": 37 },
 { "lng": 116.140314, "lat": 41.047862, "count": 31 },
 { "lng": 115.937943, "lat": 40.796672, "count": 37 },
 { "lng": 115.303237, "lat": 41.24951, "count": 23 },
 { "lng": 115.082469, "lat": 41.422843, "count": 30 },
 { "lng": 114.613338, "lat": 41.898828, "count": 36 },
 { "lng": 114.374173, "lat": 41.781885, "count": 0 },
 { "lng": 115.238846, "lat": 41.054826, "count": 35 },
 { "lng": 115.514806, "lat": 40.866543, "count": 33 },
 { "lng": 115.533203, "lat": 40.775696, "count": 31 },
 { "lng": 115.395223, "lat": 40.775696, "count": 0 },
 { "lng": 115.100866, "lat": 40.929364, "count": 38 },
 { "lng": 114.66853, "lat": 41.193946, "count": 32 },
 { "lng": 114.429365, "lat": 41.214788, "count": 0 },
 { "lng": 115.036476, "lat": 40.495378, "count": 34 },
 { "lng": 115.34923, "lat": 40.333659, "count": 28 },
 { "lng": 115.524004, "lat": 40.319578, "count": 15 },
 { "lng": 115.560799, "lat": 40.263224, "count": 18 },
 { "lng": 114.46616, "lat": 40.065613, "count": 0 },
 { "lng": 115.165257, "lat": 40.01612, "count": 13 },
 { "lng": 115.432018, "lat": 39.533444, "count": 18 },
 { "lng": 114.539749, "lat": 39.083219, "count": 15 },
 { "lng": 116.609445, "lat": 38.731027, "count": 15 },
 { "lng": 116.627842, "lat": 38.702199, "count": 0},
 { "lng": 117.501714, "lat": 38.377077, "count": 16 },
 { "lng": 116.213903, "lat": 38.261121, "count": 12 },
 { "lng": 115.947142, "lat": 38.253867, "count": 0 },
 { "lng": 114.456961, "lat": 38.572328, "count": 0 },
 { "lng": 115.00888, "lat": 37.385504, "count": 15 },
 { "lng": 115.00888, "lat": 37.392844, "count": 12 },
 { "lng": 114.539749, "lat": 37.512018, "count": 19 },
{ "lng": 115.271041, "lat": 38.143161, "count": 19 }
   
        ];
           heatmapOverlay.setDataSet({ data: points, max: 100 });


var marker_beijing = new BMap.Marker(new BMap.Point(116.378484, 39.911234), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(39, 25)) });  //北京的点
            map.addOverlay(marker_beijing);               // 将标注添加到地图中
            marker_beijing.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
 			var opts = {
                width: 60,     // 信息窗口宽度
                height: 160,     // 信息窗口高度
                title: "全局信息", // 信息窗口标题
               
            }
            var scontent = "<span></span></br>";
            scontent += "<span style='font-weight:bold;'>SO2：</span><span>25.22</span></br>";
            scontent += "<span style='font-weight:bold;'>NOX：</span><span>27.86</span></br>";
            scontent += "<span style='font-weight:bold;'>VOC：</span><span>0.61</span></br>";
			scontent += "<span style='font-weight:bold;'>PM10：</span><span>5.42</span></br>";
            scontent += "<span style='font-weight:bold;'>Pm2.5：</span><span>3.46</span></br>";
            scontent += "<span style='font-weight:bold;'>OC：</span><span>0.15</span></br>";
            scontent += "<span style='font-weight:bold;'>BC：</span><span>0.08</span></br>";
            var infoWindow = new BMap.InfoWindow(scontent, opts);  // 创建信息窗口对象 
            marker_beijing.addEventListener("mouseover", function () {
                map.openInfoWindow(infoWindow, new BMap.Point(116.378484, 39.911234)); //开启信息窗口
            });


        });
  

    },

};




//判断浏览区是否支持canvas
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}


function getBoundary() {
    var bdary = new BMap.Boundary();
    bdary.get("河北省", function (rs) {       //获取行政区域
        map.clearOverlays();        //清除地图覆盖物       
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            alert('未能获取当前输入行政区域');
            return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray);    //调整视野  
       
    });
}
