
<%@include file="../includeJsCss.html" %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>蛙鸣科技 | 全站分析</title>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
	</head>
	<body>
		<%@ include file="../V1/topMenu.html" %>
		<div class="pd10">
			<div class="top-search-container">
				<form role="form" class="form-inline">
					<div class="form-group">
						<label class="m-r-5 m-l-10">类别</label>
						<select class="form-control" name="account" id="dateType">
							<option value="MINUTE">按分钟</option>
							<option value="HOUR">按小时</option>
						</select>
					</div>
					<div class="form-group">
						<label class="m-r-5 m-l-20">污染类别</label>
						<select class="form-control" name="account" id="wrwtype">

						</select>
					</div>
					<div class="form-group">
						<label class="m-r-5 m-l-20">起止时间</label>
						<div class="input-group input-daterange ">
							<input type="text" class="form-control Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:00'})" id="startTime" name="start" />
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input type="text" class="form-control Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:00',minDate:'#F{$dp.$D(\'startTime\')}'})" id="endTime" name="end" />
						</div>
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-md btn-info pull-right" id="getChart" value="查询" />
					</div>
				</form>
			</div>
			<div class="animated fadeInRight" id="allCharts">
			</div>
		</div>
		<script src="../../resources/js/tools/weatherChart.js"></script>
		<script src="../../resources/js/common/dictionary.js"></script>
	</body>
</html>