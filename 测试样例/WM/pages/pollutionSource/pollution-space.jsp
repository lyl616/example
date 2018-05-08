
<%-- <%@include file="../system/include_pollution.html"%> --%>
<%@include file="../includeJsCss.html" %>
<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 相关性分析</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<link rel="stylesheet" href="../../resources/plugins/bmap/DrawingManager_min.css" />
		<link href="../../resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/DistanceTool_min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/DrawingManager_min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/bmap/TrafficControl_min.js"></script>
		<%--<script src="${ctx}/js/plugins/echarts/echarts.min.js"></script>--%>
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
		<script src="${ctx }/resources/plugins/echarts2.0/esl.js"></script>
		<script src="${ctx }/resources/plugins/echarts2.0/echarts.js"></script>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
		<script type="text/javascript" src="../../resources/js/common/timer.js"></script>
		<script type="text/javascript" src="../../resources/plugins/jquery-layout/jquery.layout-latest.js"></script>
		<script type="text/javascript" src="../../resources/plugins/jquery-ui/jquery-ui.min.js"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				$('#circle').layout({
					applyDemoStyles: true
				});
			});
		</script>
	</head>
	<body>
		<%@ include file="../V1/topMenu.html" %>
		<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd HH" />
		<!-- begin #content -->
		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<div class="input-group input-daterange">
							<input type="text" class="form-control Wdate" id="startTime" name="start" placeholder="Date Start">
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input type="text" class="form-control Wdate" id="endTime" name="end" placeholder="Date End">
						</div>
					</div>
					<div class="form-group m-l-20">
						<span class="glyphicon glyphicon-backward" id="btn-pre"></span>
						<span class="glyphicon glyphicon-play" id="btn-play" onclick="timerPlay()"></span>
						<span class="glyphicon glyphicon-forward" id="btn-next"></span>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">间隔</label>
						<select id="interval" class="form-control">
							<option value='1' selected="selected">时</option>
							<!-- <option value='2'>天</option> -->
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">半径</label>
						<select id="radius" class="form-control">
							<option value='1000'>1km</option>
							<option value='3000' selected="selected">3km</option>
							<option value='5000'>5km</option>
							<option value='10000'>10km</option>
						</select>
					</div>
					<div class="form-group m-l-20 text-center">
						<label id="nowDate">2017-01-01 12:00:00</label>
						<div id="progressbar" class="progress-bar">
							<div class="progress-label">0%</div>
						</div>
					</div>
				</div>
			</div>
			<div id="circle" style="height: 83%;" class="m-t-10">
				<div class="ui-layout-center">
					<div id="WMMAP" style="width: 100%; height: 100%;"></div>
					<!-- 切换污染物start -->
					<div class="post-top-nav m-t-10">
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
					<div class="Legend" style="right: 10px;">
						<img src="../../resources/img/legend/legend-pm25.png" width="212" height="46">
					</div>
				</div>
				<div class="ui-layout-east">
					<div id="main" style="width: 100%; height: 33%;" class="piePic"></div>
					<div id="main1" style="width: 100%; height: 33%;" class="piePic"></div>
					<div id="main2" style="width: 100%; height: 33%;" class="piePic"></div>
				</div>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollution-space.js"></script>
</html>