<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeJsCss.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>蛙鸣科技 | 设备驯化</title>
		<link rel="shortcut icon" href="${ctx}/resources/img/favicon.ico">
		<link href="${ctx}/resources/plugins/select2/dist/css/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/select2/dist/js/select2.full.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/select2/dist/js/i18n/zh-CN.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js"></script>
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="pd10 table-scroll">
			<div class="top-search-container">
				<form role="form" class="form-inline">
					<div class="form-group">
						<label class="m-r-5">时间类别</label>
						<select class="form-control" name="account" id="dateType">
							<option value="MINUTE">按分钟</option>
							<option value="HOUR">按小时</option>
						</select>
					</div>
					<div class="form-group">
						<label class="m-r-5 m-l-20">站点类别</label>
						<select class="form-control" name="stationType" id="idStationType">
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
							<input type="text" class="form-control Wdate w150" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',isShowClear:false,isShowToday: false})" id="startTime" name="start" />
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input type="text" class="form-control Wdate w150" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',isShowClear:false,isShowToday: false,minDate:'#F{$dp.$D(\'startTime\')}'})" id="endTime" name="end" />
						</div>
					</div>
					<div class="form-group">
						<label class="m-r-5 m-l-20">标准站</label>
						<select style="width: auto;" multiple="multiple" data-tags="true" data-placeholder="选中站点" data-allow-clear="true" name="stations" id="stations">
						</select>
					</div>
					<!--省,市,站点关联-->
					<div class="form-group pull-right">
						<button type="button" class="btn btn-md btn-info pull-right" id="getChart" onclick="getChartFun()">查询</button>
					</div>
				</form>
			</div>
			<div class="m-t-10" id="allCharts">
			</div>
		</div>
		<script src="${ctx}/resources/js/system/equipment/deviceAdjust.js"></script>
		<script src="${ctx}/resources/js/common/dictionary.js"></script>
		<script type="text/javascript">
		     $(document).ready(function() {
		         $(window).resize(function() {
		             calcOverflowH(1, "table-scroll", 40);
		         });
		     });
		     calcOverflowH(1, "table-scroll", 40);
		</script>
	</body>
</html>