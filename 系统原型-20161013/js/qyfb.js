/// <reference path="../plugins/jquery/jquery-1.9.1.min.js" />

//设置全局变量
var map;
var point = new BMap.Point(96.873541,38.761321);
var heatmapOverlay;
var t = 2000;
var clt;
$(function () {
    Geo.init();
    Geo.btn();

});

var Geo = {
    init: function () {
        map = new BMap.Map("WMMAP");          // 创建地图实例  
        // 创建点坐标  
        map.centerAndZoom(point, 5);                 // 初始化地图，设置中心点坐标和地图级别  

        //var opts = { anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(20, 80) }
        //map.addControl(new BMap.NavigationControl(opts));
        //var MapTypeopts = { anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(88, 53) }
        // map.addControl(new BMap.MapTypeControl(MapTypeopts));

 
        //map.addControl(new BMap.CityListControl({
        //    anchor: BMAP_ANCHOR_TOP_RIGHT,
        //    offset: new BMap.Size(20, 52)
        //}));



        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        
     

    },
    GetPoint: function () {
        function showInfo(e) {
            console.log("{ \"lng\":" + e.point.lng + ",\"lat\": " + e.point.lat, ",\"count\":" + parseInt(100 * Math.random()) + " },");
        }
        map.addEventListener("click", showInfo);
    },
    btn: function () {
        $("#btn-china").click(function () {
            map.clearOverlays();
            map.centerAndZoom(point, 6);
        });
        $("#btn-jjy").click(function () {
            var jjypoint = new BMap.Point(115.44416,38.818242, 38.215516);
            map.centerAndZoom(jjypoint, 7);

         
            map.clearOverlays();

    

            var marker_beijing = new BMap.Marker(new BMap.Point(116.378484, 39.911234), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(39, 25)) });  //北京的点
            map.addOverlay(marker_beijing);               // 将标注添加到地图中
            marker_beijing.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画



            var marker_tianjing = new BMap.Marker(new BMap.Point(117.200165, 39.103228), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(39, 25)) });  //天津的点
            map.addOverlay(marker_tianjing);               // 将标注添加到地图中
            marker_tianjing.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画


 
            var marker_shijiazhuang = new BMap.Marker(new BMap.Point(114.524277, 38.053458), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(39, 25)) });   // 石家庄
            map.addOverlay(marker_shijiazhuang);               // 将标注添加到地图中
            marker_shijiazhuang.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画



        });
		
        $("#btn-beijing").click(function () {
            map.clearOverlays();
            map.centerAndZoom("北京", 11);
            var marker_beijing = new BMap.Marker(new BMap.Point(116.403406,39.924121), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing);               // 将标注添加到地图中
            marker_beijing.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			
			var marker_beijing_station01 = new BMap.Marker(new BMap.Point(116.494099,39.920137), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station01);               // 将标注添加到地图中
            marker_beijing_station01.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画


			var marker_beijing_station02 = new BMap.Marker(new BMap.Point(116.283968,39.853811), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station02);               // 将标注添加到地图中
            marker_beijing_station02.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			

			var marker_beijing_station03 = new BMap.Marker(new BMap.Point(116.452418,39.817022), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station03);               // 将标注添加到地图中
            marker_beijing_station03.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			
			

			var marker_beijing_station04 = new BMap.Marker(new BMap.Point(116.2351,39.880947), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station04);               // 将标注添加到地图中
            marker_beijing_station04.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			

			var marker_beijing_station05 = new BMap.Marker(new BMap.Point(116.40355,39.797068), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station05);               // 将标注添加到地图中
            marker_beijing_station05.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			

			var marker_beijing_station06 = new BMap.Marker(new BMap.Point(116.289861,39.727626), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station06);               // 将标注添加到地图中
            marker_beijing_station06.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
					

			var marker_beijing_station07 = new BMap.Marker(new BMap.Point(116.289861,39.727626), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(39, 28)) }); // 创建标注
            map.addOverlay(marker_beijing_station07);               // 将标注添加到地图中
            marker_beijing_station07.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
					
        });


        
        $("#btn-hotmap").click(function () {

            Geo.hotmap();
            var point = new BMap.Point(116.418261, 39.921984);
            map.centerAndZoom(point, 6);
            heatmapOverlay.show();
        });

        $("#btnhotmap").click(function () {
         
            Geo.hotmap();
            var point = new BMap.Point(116.418261, 39.921984);
            map.centerAndZoom(point, 6);
            heatmapOverlay.show();
        });

      

        $("#btn-play").click(function () {
            var point = new BMap.Point(116.418261, 39.921984);
            map.centerAndZoom(point, 7);
            play1();
        });

        $("#play-pause").click(function () {
            map.clearOverlays();
            clearTimeout(clt);
        });
    },
   
    hotmap: function () {
        map.clearOverlays();
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
      
    }

};

function play1() {
    var p1 = [
{ "lng": 118.416979, "lat": 39.410459, "count": 24 },
{ "lng": 118.582555, "lat": 39.595744, "count": 94 },
{ "lng": 118.582555, "lat": 39.709519, "count": 67 },
{ "lng": 118.600952, "lat": 40.035568, "count": 69 },
{ "lng": 118.600952, "lat": 40.162727, "count": 59 },
{ "lng": 118.453774, "lat": 40.556799, "count": 40 },
{ "lng": 118.435377, "lat": 40.640941, "count": 67 },
{ "lng": 118.306595, "lat": 40.78094, "count": 16 },
{ "lng": 118.196212, "lat": 40.948548, "count": 2 },
{ "lng": 117.975444, "lat": 41.213051, "count": 27 },
{ "lng": 117.791471, "lat": 41.3241, "count": 37 },
{ "lng": 117.699485, "lat": 41.379553, "count": 2 },
{ "lng": 117.46032, "lat": 41.628503, "count": 88 },
{ "lng": 117.46032, "lat": 41.862736, "count": 95 },
{ "lng": 117.625895, "lat": 42.041275, "count": 52 },
{ "lng": 117.625895, "lat": 42.191952, "count": 44 },
{ "lng": 117.018785, "lat": 41.821464, "count": 87 },
{ "lng": 116.945195, "lat": 41.8077, "count": 42 },
{ "lng": 116.669236, "lat": 41.656105, "count": 59 },
{ "lng": 116.374879, "lat": 41.614698, "count": 8 },
{ "lng": 115.878152, "lat": 41.559447, "count": 15 },
{ "lng": 114.958287, "lat": 41.517978, "count": 93 },
{ "lng": 114.387971, "lat": 41.531804, "count": 42 },
{ "lng": 114.792712, "lat": 41.032191, "count": 2 },
{ "lng": 115.14226, "lat": 40.836857, "count": 15 },
{ "lng": 115.638987, "lat": 40.289646, "count": 57 },
{ "lng": 115.455014, "lat": 40.233267, "count": 76 },
{ "lng": 114.498355, "lat": 40.233267, "count": 49 },
{ "lng": 114.682328, "lat": 39.950662, "count": 28 },
{ "lng": 115.271041, "lat": 39.51029, "count": 57 },
{ "lng": 115.749371, "lat": 39.081426, "count": 0 },
{ "lng": 116.043728, "lat": 38.952251, "count": 36 },
{ "lng": 116.614044, "lat": 38.534404, "count": 27 },
{ "lng": 117.018785, "lat": 38.230288, "count": 29 },
{ "lng": 116.98199, "lat": 38.201258, "count": 17 },
{ "lng": 116.246098, "lat": 38.244799, "count": 80 },
{ "lng": 115.123863, "lat": 38.273812, "count": 4 },

{ "lng": 114.627136, "lat": 38.273812, "count": 50 },
{ "lng": 114.351177, "lat": 38.273812, "count": 66 },
{ "lng": 114.847904, "lat": 37.515682, "count": 32 },
{ "lng": 115.013479, "lat": 36.571831, "count": 31 },
{ "lng": 114.53515, "lat": 36.58667, "count": 12 },
{ "lng": 114.167204, "lat": 36.631168, "count": 41 },
{ "lng": 115.056861, "lat": 36.385737, "count": 47 },
 { "lng": 114.872888, "lat": 36.400611, "count": 43 },
 { "lng": 114.357764, "lat": 36.474941, "count": 73 },
 { "lng": 114.063407, "lat": 36.549199, "count": 69 },
 { "lng": 113.787448, "lat": 36.593719, "count": 83 },
 { "lng": 113.953023, "lat": 36.875079, "count": 76 },
 { "lng": 114.173791, "lat": 37.125939, "count": 89 },
 { "lng": 114.799299, "lat": 36.919409, "count": 31 },
 { "lng": 115.204039, "lat": 36.845511, "count": 45 },
 { "lng": 115.185642, "lat": 37.08173, "count": 57 },
 { "lng": 114.136996, "lat": 38.627915, "count": 33 },
 { "lng": 114.72571, "lat": 38.656773, "count": 41 },
 { "lng": 117.356523, "lat": 38.251693, "count": 49 },
 { "lng": 116.418261, "lat": 38.627915, "count": 67 },
 { "lng": 116.271083, "lat": 38.91597, "count": 15 },
 { "lng": 116.510247, "lat": 39.302981, "count": 63 },
 { "lng": 114.541737, "lat": 39.374414, "count": 64 },
 { "lng": 115.001669, "lat": 39.545554, "count": 59 },
 { "lng": 115.093656, "lat": 39.545554, "count": 95 },
 { "lng": 115.038464, "lat": 39.744681, "count": 14 },
 { "lng": 114.909683, "lat": 39.900732, "count": 42 },
 { "lng": 114.836093, "lat": 39.971546, "count": 64 },
 { "lng": 114.394558, "lat": 40.127077, "count": 51 },
 { "lng": 114.762504, "lat": 40.098826, "count": 21 },
 { "lng": 115.296026, "lat": 40.112953, "count": 48 },
 { "lng": 115.461602, "lat": 40.282251, "count": 23 },
 { "lng": 115.388012, "lat": 40.324508, "count": 15 },
 { "lng": 114.762504, "lat": 40.423006, "count": 60 },
 { "lng": 114.394558, "lat": 40.619567, "count": 59 },
 { "lng": 115.479999, "lat": 40.773599, "count": 29 },
 { "lng": 115.663972, "lat": 40.801567, "count": 48 },
 { "lng": 115.976726, "lat": 40.815546, "count": 81 },
 { "lng": 116.031918, "lat": 40.857466, "count": 73 },
 { "lng": 114.670518, "lat": 41.247429, "count": 94 },
 { "lng": 114.339366, "lat": 41.37228, "count": 19 },
 { "lng": 114.412956, "lat": 41.607451, "count": 17 },
 { "lng": 114.431353, "lat": 41.759162, "count": 49 },
 { "lng": 114.633723, "lat": 41.965459, "count": 67 },
 { "lng": 114.688915, "lat": 41.717822, "count": 6 },
 { "lng": 114.836093, "lat": 41.496889, "count": 41 },
 { "lng": 115.204039, "lat": 41.441537, "count": 69 },
 { "lng": 115.443204, "lat": 41.455379, "count": 21 },
 { "lng": 115.866342, "lat": 41.66266, "count": 83 },
 { "lng": 116.01352, "lat": 41.538372, "count": 92 },
 { "lng": 116.031918, "lat": 41.344556, "count": 97 },
 { "lng": 115.645574, "lat": 41.31682, "count": 62 },
 { "lng": 115.627177, "lat": 40.969122, "count": 63 },
 { "lng": 115.351218, "lat": 42.147131, "count": 90 },
 { "lng": 115.378814, "lat": 42.18135, "count": 22 },
 { "lng": 115.452403, "lat": 42.222388, "count": 46 },
 { "lng": 116.445857, "lat": 41.562558, "count": 30 },
 { "lng": 116.547042, "lat": 41.755718, "count": 77 },
 { "lng": 116.602234, "lat": 41.810799, "count": 68 },
 { "lng": 116.639029, "lat": 41.907076, "count": 32 },
 { "lng": 116.76781, "lat": 41.23007, "count": 87 },
 { "lng": 116.896591, "lat": 41.007459, "count": 41 },
 { "lng": 117.071365, "lat": 40.860958, "count": 27 },
 { "lng": 117.098961, "lat": 42.358987, "count": 38 },
 { "lng": 117.292133, "lat": 42.413544, "count": 88 },
 { "lng": 117.365722, "lat": 42.42036, "count": 37 },
 { "lng": 117.604887, "lat": 42.474862, "count": 78 },
 { "lng": 117.696873, "lat": 42.481672, "count": 23 },
 { "lng": 117.85325, "lat": 42.345341, "count": 0 },
 { "lng": 117.871647, "lat": 42.277063, "count": 33 },
 { "lng": 117.604887, "lat": 42.270231, "count": 36 },
 { "lng": 117.549695, "lat": 42.277063, "count": 77 },
 { "lng": 117.457708, "lat": 42.277063, "count": 30 },
 { "lng": 117.5129, "lat": 42.195032, "count": 57 },
 { "lng": 118.474159, "lat": 42.728011, "count": 18 },
 { "lng": 118.474159, "lat": 42.704269, "count": 99 },
 { "lng": 117.903843, "lat": 41.805637, "count": 34 },
 { "lng": 117.802658, "lat": 41.636786, "count": 66 },
 { "lng": 117.844051, "lat": 41.23875, "count": 50 },
 { "lng": 116.997776, "lat": 41.085808, "count": 89 },
 { "lng": 117.149554, "lat": 40.939482, "count": 47 },
 { "lng": 118.924893, "lat": 41.228334, "count": 12 },
 { "lng": 119.095068, "lat": 41.263049, "count": 19 },
 { "lng": 119.07667, "lat": 41.224861, "count": 13 },
 { "lng": 118.547748, "lat": 41.141465, "count": 81 },
 { "lng": 118.405169, "lat": 41.113642, "count": 16 },
 { "lng": 117.586489, "lat": 40.649351, "count": 46 },
 { "lng": 118.717923, "lat": 40.694878, "count": 93 },
 { "lng": 118.386772, "lat": 40.614309, "count": 98 },
 { "lng": 118.409768, "lat": 40.610804, "count": 45 },
 { "lng": 118.713324, "lat": 40.677371, "count": 14 },
 { "lng": 118.777714, "lat": 40.680873, "count": 98 },
 { "lng": 118.000428, "lat": 40.480982, "count": 91 },
 { "lng": 118.441964, "lat": 40.459906, "count": 25 },
 { "lng": 119.256044, "lat": 40.442337, "count": 3 },
 { "lng": 119.274441, "lat": 40.442337, "count": 70 },
 { "lng": 118.441964, "lat": 40.305144, "count": 47 },
 { "lng": 118.037223, "lat": 40.329789, "count": 60 },
 { "lng": 119.223849, "lat": 40.231154, "count": 58 },
 { "lng": 119.568798, "lat": 40.340348, "count": 21 },
 { "lng": 119.600993, "lat": 39.941459, "count": 59 },
 { "lng": 117.816456, "lat": 39.849346, "count": 91 },
 { "lng": 117.687674, "lat": 39.870614, "count": 52 },
 { "lng": 118.023425, "lat": 39.852891, "count": 99 },
 { "lng": 119.729774, "lat": 39.95562, "count": 99 },
 { "lng": 119.674582, "lat": 39.877702, "count": 59 },
 { "lng": 118.607539, "lat": 39.436858, "count": 21 },
 { "lng": 119.131862, "lat": 39.611401, "count": 4 },
 { "lng": 118.920293, "lat": 40.537152, "count": 65 },
 { "lng": 118.06022, "lat": 41.02662, "count": 2 },
 { "lng": 117.770462, "lat": 41.377476, "count": 52 },
 { "lng": 117.775062, "lat": 41.864113, "count": 72 },
 { "lng": 117.563493, "lat": 42.312918, "count": 42 },
 { "lng": 117.568092, "lat": 42.316332, "count": 27 },
 { "lng": 117.326627, "lat": 42.182205, "count": 64 },
 { "lng": 117.338126, "lat": 42.117174, "count": 15 },
 { "lng": 117.305931, "lat": 41.877005, "count": 64 },
 { "lng": 116.119305, "lat": 41.307283, "count": 93 },
 { "lng": 116.103207, "lat": 41.314219, "count": 57 }
    ];

    map.clearOverlays();

    heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({ data: p1, max: 100 });

    clt=setTimeout("play2()", t);
}

function play2() {
    var p1 = [
{ "lng": 113.799258, "lat": 36.55699, "count": 50 },
 { "lng": 114.277587, "lat": 36.438155, "count": 83 },
 { "lng": 115.031877, "lat": 36.36379, "count": 61 },
 { "lng": 115.14226, "lat": 36.36379, "count": 17 },
 { "lng": 115.123863, "lat": 36.497595, "count": 9 },
 { "lng": 115.123863, "lat": 36.55699, "count": 52 },
 { "lng": 115.123863, "lat": 36.55699, "count": 24 },
 { "lng": 115.087068, "lat": 37.804553, "count": 21 },
 { "lng": 114.53515, "lat": 37.482701, "count": 61 },
 { "lng": 115.123863, "lat": 37.18889, "count": 43 },
 { "lng": 115.528604, "lat": 37.541324, "count": 51 },
 { "lng": 115.547001, "lat": 37.848333, "count": 76 },
 { "lng": 116.154112, "lat": 38.02319, "count": 59 },
 { "lng": 116.963593, "lat": 38.22666, "count": 83 },
 { "lng": 116.356482, "lat": 38.963025, "count": 70 },
 { "lng": 114.332779, "lat": 38.718417, "count": 79 },
 { "lng": 114.792712, "lat": 39.93296, "count": 29 },
 { "lng": 114.866301, "lat": 40.286124, "count": 62 },
 { "lng": 115.068671, "lat": 40.300212, "count": 81 },
 { "lng": 114.921493, "lat": 40.903196, "count": 70 },
 { "lng": 114.755917, "lat": 41.181785, "count": 53 },
 { "lng": 114.571944, "lat": 41.41765, "count": 31 },
 { "lng": 115.638987, "lat": 41.112249, "count": 80 },
 { "lng": 115.749371, "lat": 41.431498, "count": 60 },
 { "lng": 115.749371, "lat": 41.666452, "count": 37 },
 { "lng": 115.82296, "lat": 41.084414, "count": 7 },
 { "lng": 116.062125, "lat": 41.140072, "count": 69 },
 { "lng": 116.687633, "lat": 41.666452, "count": 32 },
 { "lng": 117.66269, "lat": 42.338856, "count": 18 },
 { "lng": 117.533909, "lat": 41.389946, "count": 73 },
 { "lng": 117.993841, "lat": 40.567323, "count": 44 },
 { "lng": 118.233006, "lat": 39.677539, "count": 88 },
 { "lng": 118.876912, "lat": 39.805369, "count": 12 },
 { "lng": 119.373639, "lat": 39.862106, "count": 67 },
 { "lng": 119.520817, "lat": 40.247366, "count": 74 }

    ];

    map.clearOverlays();

    heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({ data: p1, max: 100 });
    clt = setTimeout("play3()", t);
}

function play3() {
    var p1 = [
{ "lng": 113.909641, "lat": 36.58667, "count": 84 },
{ "lng": 114.222396, "lat": 36.512448, "count": 74 },
{ "lng": 114.53515, "lat": 36.453019, "count": 67 },
{ "lng": 114.811109, "lat": 36.423288, "count": 89 },
{ "lng": 115.160658, "lat": 36.348908, "count": 82 },
{ "lng": 115.381425, "lat": 36.334023, "count": 96 },
{ "lng": 115.381425, "lat": 36.334023, "count": 36 },
{ "lng": 113.707271, "lat": 36.560701, "count": 48 },
{ "lng": 113.974032, "lat": 36.471596, "count": 13 },
{ "lng": 114.185601, "lat": 36.449304, "count": 44 },
{ "lng": 113.389918, "lat": 35.951629, "count": 23 },
{ "lng": 113.932638, "lat": 36.610777, "count": 10 },
{ "lng": 114.079816, "lat": 36.773759, "count": 26 },
{ "lng": 114.558146, "lat": 36.803355, "count": 98 },
{ "lng": 115.054873, "lat": 36.729344, "count": 35 },
{ "lng": 115.5516, "lat": 37.260613, "count": 8 },
{ "lng": 115.937943, "lat": 37.656603, "count": 96 },
{ "lng": 116.379479, "lat": 37.977695, "count": 46 },
{ "lng": 116.692233, "lat": 38.065021, "count": 74 },
{ "lng": 117.078576, "lat": 38.12318, "count": 70 },
{ "lng": 117.225754, "lat": 38.239358, "count": 76 },
{ "lng": 116.876206, "lat": 38.528985, "count": 13 },
{ "lng": 116.250698, "lat": 39.19068, "count": 94 },
{ "lng": 115.606792, "lat": 39.390832, "count": 18 },
{ "lng": 115.569998, "lat": 38.774248, "count": 73 },
{ "lng": 116.802616, "lat": 38.166769, "count": 89 },
{ "lng": 116.2323, "lat": 38.166769, "count": 43 },
{ "lng": 114.834106, "lat": 38.384318, "count": 10 },
{ "lng": 114.079816, "lat": 38.398798, "count": 80 },
{ "lng": 114.226995, "lat": 38.166769, "count": 82 },
{ "lng": 114.944489, "lat": 38.137713, "count": 22 },
{ "lng": 115.735573, "lat": 38.094106, "count": 4 },
{ "lng": 115.882752, "lat": 37.065512, "count": 72 },
{ "lng": 114.935291, "lat": 37.93035, "count": 7 },
{ "lng": 114.32818, "lat": 37.359809, "count": 70 },
{ "lng": 114.346577, "lat": 37.242229, "count": 37 },
{ "lng": 114.769715, "lat": 37.256936, "count": 2 },
{ "lng": 115.119264, "lat": 37.227518, "count": 3 },
{ "lng": 115.413621, "lat": 37.462539, "count": 95 },
{ "lng": 115.615991, "lat": 38.003176, "count": 5 },
{ "lng": 115.763169, "lat": 38.25024, "count": 95 },
{ "lng": 115.763169, "lat": 38.25024, "count": 90 },
{ "lng": 115.100866, "lat": 38.557883, "count": 34 },
{ "lng": 115.100866, "lat": 38.810244, "count": 13 },
{ "lng": 115.137661, "lat": 39.319415, "count": 65 },
{ "lng": 115.018079, "lat": 39.68287, "count": 66 },
{ "lng": 115.018079, "lat": 39.711295, "count": 57 },
{ "lng": 114.889298, "lat": 39.83197, "count": 97 },
{ "lng": 114.493756, "lat": 40.164491, "count": 2 },
{ "lng": 114.493756, "lat": 40.164491, "count": 87 },
{ "lng": 115.096267, "lat": 40.286124, "count": 85 },
{ "lng": 115.510206, "lat": 40.335419, "count": 91 },
{ "lng": 115.491809, "lat": 40.511178, "count": 44 },
{ "lng": 114.581143, "lat": 40.574338, "count": 84 },
{ "lng": 114.277587, "lat": 41.167883, "count": 74 },
{ "lng": 114.39717, "lat": 41.514521, "count": 19 },
{ "lng": 114.516752, "lat": 41.687142, "count": 76 },
{ "lng": 114.654732, "lat": 41.852421, "count": 77 },
{ "lng": 115.050274, "lat": 41.431498, "count": 13 },
{ "lng": 115.326233, "lat": 40.979927, "count": 78 },
{ "lng": 115.638987, "lat": 40.833364, "count": 21 },
{ "lng": 115.786166, "lat": 40.819388, "count": 48 },
{ "lng": 115.905748, "lat": 40.798419, "count": 81 },
{ "lng": 115.96094, "lat": 40.812399, "count": 49 },
{ "lng": 115.905748, "lat": 41.22347, "count": 77 },
{ "lng": 115.868954, "lat": 41.445342, "count": 66 },
{ "lng": 115.804563, "lat": 41.604342, "count": 64 },
{ "lng": 115.813762, "lat": 41.659554, "count": 36 },
{ "lng": 116.292091, "lat": 41.659554, "count": 61 },
{ "lng": 116.466866, "lat": 41.790492, "count": 17 },
{ "lng": 116.246098, "lat": 41.133118, "count": 20 },
{ "lng": 116.50366, "lat": 41.251246, "count": 42 },
{ "lng": 116.687633, "lat": 41.348367, "count": 60 },
{ "lng": 116.807216, "lat": 41.555992, "count": 23 },
{ "lng": 117.101572, "lat": 41.804259, "count": 88 },
{ "lng": 117.441922, "lat": 41.989825, "count": 47 },
{ "lng": 117.469518, "lat": 42.229565, "count": 15 },
{ "lng": 117.285545, "lat": 41.424574, "count": 96 },
{ "lng": 116.972791, "lat": 41.042639, "count": 67 },
{ "lng": 117.736279, "lat": 41.403799, "count": 87 },
{ "lng": 118.20541, "lat": 41.23736, "count": 75 },
{ "lng": 117.66269, "lat": 40.728475, "count": 76 },
{ "lng": 118.389383, "lat": 40.847336, "count": 91 },
{ "lng": 118.490568, "lat": 40.959009, "count": 92 },
{ "lng": 119.070083, "lat": 40.314297, "count": 41 },
{ "lng": 118.88611, "lat": 39.996666, "count": 98 },
{ "lng": 119.125275, "lat": 40.14508, "count": 89 },
{ "lng": 119.355241, "lat": 40.032032, "count": 55 },
{ "lng": 119.02409, "lat": 39.720175, "count": 30 },
{ "lng": 118.536562, "lat": 39.4996, "count": 83 },
{ "lng": 118.508966, "lat": 39.57617, "count": 18 },
{ "lng": 118.485969, "lat": 39.668653, "count": 27 },
{ "lng": 118.467572, "lat": 39.707742, "count": 9 },
{ "lng": 118.416979, "lat": 39.778757, "count": 61 },
{ "lng": 118.416979, "lat": 39.778757, "count": 74 },
{ "lng": 117.073977, "lat": 39.782306, "count": 7 },
{ "lng": 117.037182, "lat": 39.839062, "count": 11 },
{ "lng": 116.958993, "lat": 39.948892, "count": 67 },
{ "lng": 116.890004, "lat": 40.030264, "count": 6 },
{ "lng": 117.096973, "lat": 40.01612, "count": 22 },
{ "lng": 118.288198, "lat": 39.778757, "count": 20 }

    ];

    map.clearOverlays();

    heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({ data: p1, max: 100 });
    clt = setTimeout("play4()", t);
}

function play4() {
    var p1 = [
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

    map.clearOverlays();

    heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({ data: p1, max: 100 });
    clt = setTimeout("play1()", t);
}


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
