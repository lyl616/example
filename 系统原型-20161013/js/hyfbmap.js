/// <reference path="../plugins/jquery/jquery-1.9.1.min.js" />

//设置全局变量
var map;
var point = new BMap.Point(116.412893,39.918034);
var heatmapOverlay;


$(function () {
    Geo.init();
    Geo.btn();
  
    Geo.GetPoint();
});

var Geo = {
    init: function () {
        map = new BMap.Map("WMMAP");          // 创建地图实例  
        // 创建点坐标  
        map.centerAndZoom(point, 7);                 // 初始化地图，设置中心点坐标和地图级别  

 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/marker_power.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_zhangjiakou01);  			 						 

            var marker_zhangjiakou02 = new BMap.Marker(new BMap.Point(117.657823,40.540213), { icon: new BMap.Icon("img/marker_power.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_zhangjiakou02);  

var marker_zhangjiakou04 = new BMap.Marker(new BMap.Point(115.28,38.04), { icon: new BMap.Icon("img/marker_steel.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_zhangjiakou04); 			 
			 			 			 			 			 			 
            var marker_baoding05 = new BMap.Marker(new BMap.Point(116.86,39.96), { icon: new BMap.Icon("img/marker_steel.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_baoding05);      	
			
 var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/marker_ni.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   

						 
            var marker_tangshan16 = new BMap.Marker(new BMap.Point(117.018888888889,39.0333333333333), { icon: new BMap.Icon("img/marker_ni.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan16);  


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
        $("#HYFB-E").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/marker_power.png", new BMap.Size(40, 25)) });  //张家口下花园发电厂
            map.addOverlay(marker_zhangjiakou01);  // 将标注添加到地图
			marker_zhangjiakou01.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中			 						 

            var marker_zhangjiakou02 = new BMap.Marker(new BMap.Point(117.657823,40.540213), { icon: new BMap.Icon("img/marker_power.png", new BMap.Size(40, 25)) });  //兴隆煤电总公司矸石热电厂
            map.addOverlay(marker_zhangjiakou02);  // 将标注添加到地图中			 			 
			marker_zhangjiakou02.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中					 
        });		

		
		
		
         $("#HYFB-S").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 
    var marker_zhangjiakou04 = new BMap.Marker(new BMap.Point(115.28,38.04), { icon: new BMap.Icon("img/marker_steel.png", new BMap.Size(40, 25)) });  //张家口河北建投宣化热电有限责任公司
            map.addOverlay(marker_zhangjiakou04);  // 将标注添加到地图中
			marker_zhangjiakou04.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中			 
			 			 			 			 			 			 
            var marker_baoding05 = new BMap.Marker(new BMap.Point(116.86,39.96), { icon: new BMap.Icon("img/marker_steel.png", new BMap.Size(40, 25)) });  //保定三河发电有限责任公司
            map.addOverlay(marker_baoding05);      // 将标注添加到地图中
			marker_baoding05.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中				
						 
           
						 
							 						 	   
	    });


		
		
		
         $("#HYFB-C").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 
			
						 
            var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/marker_ni.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   // 将标注添加到地图中
			marker_tangshan15.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中

						 
            var marker_tangshan16 = new BMap.Marker(new BMap.Point(117.018888888889,39.0333333333333), { icon: new BMap.Icon("img/marker_ni.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan16);  // 将标注添加到地图中 
			marker_tangshan16.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中
						 
          
						 						 	   
	    });  
		
		 $("#HYFB-D").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 
			
						 
            var marker_beijing01 = new BMap.Marker(new BMap.Point(114.318475,38.195033), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing01);  
			marker_beijing01.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中 

						 
            var marker_beijing02 = new BMap.Marker(new BMap.Point(117.869154,41.594969), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing02);   
			
						 
            var marker_beijing03 = new BMap.Marker(new BMap.Point(118.255497,39.532679), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing03);   
			
						 
            var marker_beijing04 = new BMap.Marker(new BMap.Point(117.114864,40.283606), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing04);   
									 
            var marker_beijing05 = new BMap.Marker(new BMap.Point(115.813256,38.708633), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing05);              
									 
            var marker_beijing06 = new BMap.Marker(new BMap.Point(115.873047,39.186332), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing06);   			
						 
            var marker_beijing07 = new BMap.Marker(new BMap.Point(117.275841,39.429313), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing07);   	
						 
            var marker_beijing08 = new BMap.Marker(new BMap.Point(114.635829,39.365077), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing08);   	
						 
            var marker_beijing09 = new BMap.Marker(new BMap.Point(114.635829,38.09696), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(41, 26)) });
            map.addOverlay(marker_beijing09);   				
						 						 	   
	    }); 
		
		
$("#HYFB-F").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(40, 25)) });  //张家口下花园发电厂
            map.addOverlay(marker_zhangjiakou01);  // 将标注添加到地图
			marker_zhangjiakou01.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中			 						 

            
            var marker_zhangjiakou03 = new BMap.Marker(new BMap.Point(115.28,40.81), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //张家口河北大唐国际张家口热电有限责任公司
            map.addOverlay(marker_zhangjiakou03); // 将标注添加到地图中			 
		
			 			 			 			 			 			 
            var marker_baoding05 = new BMap.Marker(new BMap.Point(116.86,39.96), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //保定三河发电有限责任公司
            map.addOverlay(marker_baoding05);      // 将标注添加到地图中
			marker_baoding05.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中ss
	
						 
            var marker_tangshan09 = new BMap.Marker(new BMap.Point(117.71,39.101), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //北京燕山石化动力事业部
            map.addOverlay(marker_tangshan09);    // 将标注添加到地图中						 

						 
            var marker_tangshan10 = new BMap.Marker(new BMap.Point(114.3,36.88), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan10);   // 将标注添加到地图中
			marker_tangshan10.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中
		

						 
            var marker_tangshan12 = new BMap.Marker(new BMap.Point(113.79,36.38), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan12);  // 将标注添加到地图中 
	
						 
            var marker_tangshan13 = new BMap.Marker(new BMap.Point(116.54,41.81), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan13);    // 将标注添加到地图中						 

			
						 
            var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   // 将标注添加到地图中
			marker_tangshan15.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中
			
						 
            var marker_tangshan17 = new BMap.Marker(new BMap.Point(117.227,40.156), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan17);    // 将标注添加到地图中						 
        });	
		
		




$("#HYFB-G").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/AQI1_sprite.png", new BMap.Size(40, 25)) });  //张家口下花园发电厂
            map.addOverlay(marker_zhangjiakou01);  // 将标注添加到地图		 						 

            
            var marker_zhangjiakou03 = new BMap.Marker(new BMap.Point(115.28,40.81), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //张家口河北大唐国际张家口热电有限责任公司
            map.addOverlay(marker_zhangjiakou03); // 将标注添加到地图中			 
		
			 			 			 			 			 			 
            var marker_baoding05 = new BMap.Marker(new BMap.Point(116.86,39.96), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //保定三河发电有限责任公司
            map.addOverlay(marker_baoding05);      // 将标注添加到地图中
	
						 
            var marker_tangshan09 = new BMap.Marker(new BMap.Point(117.71,39.101), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //北京燕山石化动力事业部
            map.addOverlay(marker_tangshan09);    // 将标注添加到地图中						 

						 
            var marker_tangshan10 = new BMap.Marker(new BMap.Point(114.3,36.88), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan10);   // 将标注添加到地图中
		
			
						 
            var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   // 将标注添加到地图中
			marker_tangshan15.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中
			
						 
            var marker_tangshan17 = new BMap.Marker(new BMap.Point(117.227,40.156), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan17);    // 将标注添加到地图中						 
        });	
		
		
$("#HYFB-H").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/AQI6_sprite.png", new BMap.Size(40, 25)) });  //张家口下花园发电厂
            map.addOverlay(marker_zhangjiakou01);  // 将标注添加到地图
			marker_zhangjiakou01.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画中			 						 

            var marker_zhangjiakou02 = new BMap.Marker(new BMap.Point(117.657823,40.540213), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(40, 25)) });  //兴隆煤电总公司矸石热电厂
            map.addOverlay(marker_zhangjiakou02);  // 将标注添加到地图中			 			 
			 
            var marker_zhangjiakou03 = new BMap.Marker(new BMap.Point(115.28,40.81), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  //张家口河北大唐国际张家口热电有限责任公司
            map.addOverlay(marker_zhangjiakou03); // 将标注添加到地图中			 
			 			 
            var marker_zhangjiakou04 = new BMap.Marker(new BMap.Point(115.28,38.04), { icon: new BMap.Icon("img/AQI6_sprite.png", new BMap.Size(40, 25)) });  //张家口河北建投宣化热电有限责任公司
            map.addOverlay(marker_zhangjiakou04);  // 将标注添加到地图中			 
			 			 			 			 			 			 
            var marker_baoding05 = new BMap.Marker(new BMap.Point(116.86,39.96), { icon: new BMap.Icon("img/AQI2_sprite.png", new BMap.Size(40, 25)) });  //保定三河发电有限责任公司
            map.addOverlay(marker_baoding05);      // 将标注添加到地图中
						 
            var marker_tangshan06 = new BMap.Marker(new BMap.Point(119,39.23), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(40, 25)) });  //唐山唐山中润煤化工有限公司
            map.addOverlay(marker_tangshan06);   // 将标注添加到地图中
			
						 
            var marker_tangshan07 = new BMap.Marker(new BMap.Point(118.31,39.76), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });  //唐山陡河发电厂(大唐)
            map.addOverlay(marker_tangshan07);   // 将标注添加到地图中

						 
            var marker_tangshan08 = new BMap.Marker(new BMap.Point(116,39.79), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    //北京燕山石化动力事业部
            map.addOverlay(marker_tangshan08);  // 将标注添加到地图中 
	
						 
            var marker_tangshan09 = new BMap.Marker(new BMap.Point(117.71,39.101), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  //北京燕山石化动力事业部
            map.addOverlay(marker_tangshan09);    // 将标注添加到地图中						 

						 
            var marker_tangshan10 = new BMap.Marker(new BMap.Point(114.3,36.88), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan10);   // 将标注添加到地图中
			
						 
            var marker_tangshan11 = new BMap.Marker(new BMap.Point(115.27,36.98), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan11);   // 将标注添加到地图中

						 
            var marker_tangshan12 = new BMap.Marker(new BMap.Point(113.79,36.38), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan12);  // 将标注添加到地图中 
	
						 
            var marker_tangshan13 = new BMap.Marker(new BMap.Point(116.54,41.81), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan13);    // 将标注添加到地图中						 

						 
            var marker_tangshan14 = new BMap.Marker(new BMap.Point(118.69,41.01), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan14);   // 将标注添加到地图中
			
						 
            var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   // 将标注添加到地图中

						 
            var marker_tangshan16 = new BMap.Marker(new BMap.Point(117.018888888889,39.0333333333333), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan16);  // 将标注添加到地图中 
	
						 
            var marker_tangshan17 = new BMap.Marker(new BMap.Point(117.227,40.156), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan17);    // 将标注添加到地图中						 
        });		
		 

$("#HYFB-J").click(function () {
            var jjypoint = new BMap.Point(116.412893,39.918034);
            map.centerAndZoom(point, 7);
			
			 map.clearOverlays();
			 

            var marker_zhangjiakou01 = new BMap.Marker(new BMap.Point(115.28,40.49), { icon: new BMap.Icon("img/AQI6_sprite.png", new BMap.Size(40, 25)) });  //张家口下花园发电厂
            map.addOverlay(marker_zhangjiakou01);  // 将标注添加到地图
			 						 

            var marker_zhangjiakou02 = new BMap.Marker(new BMap.Point(117.657823,40.540213), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(40, 25)) });  //兴隆煤电总公司矸石热电厂
            map.addOverlay(marker_zhangjiakou02);  // 将标注添加到地图中			 			 
			 
            var marker_zhangjiakou03 = new BMap.Marker(new BMap.Point(115.28,40.81), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  //张家口河北大唐国际张家口热电有限责任公司
            map.addOverlay(marker_zhangjiakou03); // 将标注添加到地图中			 
			 			 
            var marker_zhangjiakou04 = new BMap.Marker(new BMap.Point(115.28,38.04), { icon: new BMap.Icon("img/AQI6_sprite.png", new BMap.Size(40, 25)) });  //张家口河北建投宣化热电有限责任公司
            map.addOverlay(marker_zhangjiakou04);  // 将标注添加到地图中			 
			 			 			 			 			 			
			
						 
            var marker_tangshan07 = new BMap.Marker(new BMap.Point(118.31,39.76), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });  //唐山陡河发电厂(大唐)
            map.addOverlay(marker_tangshan07);   // 将标注添加到地图中

						 
            var marker_tangshan09 = new BMap.Marker(new BMap.Point(117.71,39.101), { icon: new BMap.Icon("img/AQI5_sprite.png", new BMap.Size(40, 25)) });  //北京燕山石化动力事业部
            map.addOverlay(marker_tangshan09);    // 将标注添加到地图中						 

						 
            var marker_tangshan10 = new BMap.Marker(new BMap.Point(114.3,36.88), { icon: new BMap.Icon("img/AQI6_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan10);   // 将标注添加到地图中
			
						 
            var marker_tangshan11 = new BMap.Marker(new BMap.Point(115.27,36.98), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan11);   // 将标注添加到地图中

						 
            var marker_tangshan12 = new BMap.Marker(new BMap.Point(113.79,36.38), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan12);  // 将标注添加到地图中 
	
						 
            var marker_tangshan13 = new BMap.Marker(new BMap.Point(116.54,41.81), { icon: new BMap.Icon("img/AQI7_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan13);    // 将标注添加到地图中						 

						 
            var marker_tangshan14 = new BMap.Marker(new BMap.Point(118.69,41.01), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) }); 
            map.addOverlay(marker_tangshan14);   // 将标注添加到地图中
			
						 
            var marker_tangshan15 = new BMap.Marker(new BMap.Point(117.49,40.42), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });
            map.addOverlay(marker_tangshan15);   // 将标注添加到地图中

						 
            var marker_tangshan16 = new BMap.Marker(new BMap.Point(117.018888888889,39.0333333333333), { icon: new BMap.Icon("img/AQI3_sprite.png", new BMap.Size(40, 25)) });                    
            map.addOverlay(marker_tangshan16);  // 将标注添加到地图中 
	
						 
            var marker_tangshan17 = new BMap.Marker(new BMap.Point(117.227,40.156), { icon: new BMap.Icon("img/AQI4_sprite.png", new BMap.Size(40, 25)) });  
            map.addOverlay(marker_tangshan17);    // 将标注添加到地图中						 
        });		
		 

		     
}};

