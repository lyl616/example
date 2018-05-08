
<%@include file="../includeJsCss.html" %>
<html>

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 污染来源</title>
		<!--引用插件使用-->
		<link rel="stylesheet" href="../../resources/plugins/bmap/DrawingManager_min.css" />
		<link href="../../resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/DistanceTool_min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/DrawingManager_min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/TrafficControl_min.js"></script>
		<script type="text/javascript" src="../../resources/js/common/com-map.js"></script>
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/extension/bmap.js"></script>
		<!--引用插件使用结束-->
		<link href="../../resources/plugins/DataTables/media/css/dataTables.bootstrap.min.css" rel="stylesheet" />
		<link href="../../resources/plugins/jquery-layout/layout-default-latest.css" rel="stylesheet" />
		<script src="../../resources/plugins/DataTables/media/js/jquery.dataTables.js"></script>
		<script src="../../resources/plugins/jquery-layout/jquery.layout-latest.js"></script>
		<link href="../../resources/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/jquery-ui/jquery-ui.min.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx }/resources/js/common/weather-air.js"></script>
		<script type="text/javascript" src="../../resources/js/common/timer.js"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				$('#myLayout').layout({
					applyDemoStyles: true
				});
			});
		</script>
	</head>

	<body>
		<%@ include file="../V1/topMenu.html" %>
		<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd HH" />
		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<div class="input-group input-daterange">
							<input type="text" class="form-control Wdate" id="startTime" name="start" placeholder="开始日期">
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input type="text" class="form-control Wdate" id="endTime" name="end" placeholder="结束日期">
						</div>
					</div>
					<div class="form-group">
						<span class="glyphicon glyphicon-backward" id="btn-pre"></span> <span class="glyphicon glyphicon-play" id="btn-play" onclick="timerPlay()"></span>
						<span class="glyphicon glyphicon-forward" id="btn-next"></span>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">间隔</label>
						<select id="interval" class="form-control">
							<option value='1' selected="selected">时</option>
							<option value='2'>天</option>
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">半径</label>
						<select id="radius" class="form-control">
							<option value='1000'>1km</option>
							<option value='3000'>3km</option>
							<option value='5000' selected="selected">5km</option>
							<option value='10000'>10km</option>
						</select>
					</div>
					<div class="form-group m-l-20 text-center">
						<label class=" m-r-5" id="nowDate"></label>
						<div id="progressbar" class="progress-bar">
							<div class="progress-label">0%</div>
						</div>
					</div>
					<div class="form-group pull-right">
						<button type="button" class="btn btn-warning btn-md" data-toggle="modal" data-target="#addModal" id="currentRange" style="width: 130px;">当月排名：
                </button>
					</div>
				</div>
			</div>
			<!--搜索内容结束-->
			<div id="myLayout" style="height: 85%; width: 100%; macursor: default;">
				<div class="ui-layout-center">
					<div id="WMMAP" style="width: 100%; height: 100%;"></div>
					<!-- 切换污染物start -->
					<div class="post-top-nav" style="margin-top: 10px;">
						<div class="btn-group col-sm-6" id="polution_type">
							<a id="aqi" class="btn btn-white" type="button">AQI</a>
							<a id="pm25" class="btn btn-white btn-success" type="button">PM<sub>2.5</sub></a>
							<a id="pm10" class="btn btn-white" type="button">PM<sub>10</sub></a>
							<a id="co" class="btn btn-white" type="button">CO</a>
							<a id="so2" class="btn btn-white" type="button">SO<sub>2</sub></a>
							<a id="o3" class="btn btn-white" type="button">O<sub>3</sub></a>
							<a id="no2" class="btn btn-white" type="button">NO<sub>2</sub></a>
						</div>
					</div>
					<!-- 切换污染物End -->
					<div class="Legend post-abs" style="right: 10px;">
						<img src="../../resources/img/legend/legend-pm25.png" width="212" height="46">
					</div>
				</div>
				<div class="ui-layout-east">
					<div class="rosep" id="tubiao5" style="height: 30px;">
						<div style="line-height: 30px; height: 30px; font-weight: bold;">
							<span style="margin-left: 10px;">风力:<label id="power">微风</label>
                        </span> <span style="margin-left: 10px;">风向</span> <span id="direction"> <img
                        src="${ctx }/resources/img/airdata/N1.png" width="20" height="20"></span>
						</div>
					</div>
					<div class="rosep" id="tubiao"></div>
					<div class="rosep" id="tubiao1"></div>
					<div class="rosep" id="tubiao2"></div>
					<div class="rosep" id="tubiao3"></div>
					<div class="rosep" id="tubiao4"></div>
					<div class="rosep" id="temp_humidity_charts" style="height: 160px;"></div>
				</div>
			</div>
		</div>
		<!-- 城市排名开始 -->
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="addModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="float: none; margin: auto auto">
			<div class="modal-dialog" style="height: 500px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
						<h4 class="modal-title" id="myModalLabel">
                    <span>xx月国控站点空气质量排名 </span> <label>月份查询：</label>
                    <input id="d1212" class="Wdate form-control" type="text" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM',onpicked:function(dp){initCityRange(this.value);}})"/>
                </h4>
					</div>
					<div class="modal-body xhideyauto" data-scrollbar="true" style='height: 500px; background: #ffffff'>
						<table id="example" class="table table-bordered table-hover ">
							<thead>
								<tr>
									<th>城市排名</th>
									<th>省份</th>
									<th>城市</th>
									<th>AQI</th>
									<th>空气质量</th>
									<th>PM2.5</th>
									<th>PM10</th>
								</tr>
							</thead>
							<tbody id="tableBody">
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- 城市排名结束 -->
		<!-- 国控点各种图表（Modal） -->
		<div class="modal fade" id="echarsModal" tabindex="999" role="dialog" aria-labelledby="echarsModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" onclick="closeEcharsMode();" aria-hidden="true">×</button>
						<h4 class="modal-title" id="echarsModalLabel">国控点相关站点</h4>
					</div>
					<div class="modal-body" style="padding: 0px; margin: 0px;">
						<div id="polluBarNum" style="width: 595px; height: 180px;border: 1px #bebebe solid;margin: 2px;"></div>
						<div id="polluLineNum" style="width: 595px; height: 180px;border: 1px #bebebe solid;margin: 2px;"></div>
						<div id="polluRoseNum" style="width: 595px; height: 210px;border: 1px #bebebe solid;margin: 2px;"></div>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<style>
			.map-float-popup {
				filter: alpha(opacity=100);
				/* IE */
				-moz-opacity: 1;
				/* 老版Mozilla */
				-khtml-opacity: 1;
				/* 老版Safari */
				opacity: 1;
				/* 支持opacity的浏览器*/
				background: rgba(255, 255, 255, 1);
				margin-top: 100px;
			}
			
			.map-float-ptit {
				background-color: #fff;
				height: 50px;
				line-height: 50px;
				border-bottom: solid 1px #e5e5e5;
				font-size: 14px;
				text-indent: 15px;
			}
			
			.map-float-ptit a {
				font-size: 20px;
				line-height: 44px;
				float: right;
				margin-right: 10px;
				font-family: arial;
				color: #333;
			}
			
			.polustion_info {
				padding: 10px;
			}
			
			.polustion_info p {
				padding: 2px 5px;
				border-bottom: dashed 1px #eee;
			}
			
			.map-float-table-info {
				padding: 0 20px;
			}
			
			.map-float-table-info th {
				font-size: 12px;
				font-weight: normal;
			}
		</style>
		<div class="modal fade" id="pollutionInfoModal" tabindex="999" role="dialog" aria-labelledby="pollutionInfoModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title" id="pollutionInfoModalLabel">污染源排放量信息点</h4>
					</div>
					<div class="modal-body" style="padding: 0px; margin: 0px;">
						<div id="pollutionInfo">
							<div class="polustion_info">
								<p>
									污染源：<span id="p_name"></span>
								</p>
								<p>
									类别：<span id="p_type"></span>&nbsp;种类：<span id="p_catagory"></span>
								</p>
								<p>
									地址：<span id="p_address"></span>
								</p>
							</div>
							<div class="map-float-table-info">
								排放量：
								<table id="p_dischargeds" border="1" style="font-size: 12px; width: 100%;">
								</table>
							</div>
							<div class="map-float-table-info">
								关联监测点：
								<table id="p_wstations" border="1" style="font-size: 12px; width: 100%;"></table>
							</div>
						</div>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollutionSource-index.js"></script>
		<script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollution-index-range.js"></script>
		<script type="text/javascript" src="../../resources/js/management/pollution/pollution-detail.js"></script>
	</body>

</html>
<!-- /.modal -->