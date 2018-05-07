<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../../includeJsCss.jsp"%>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<title>蛙鸣科技 | 数据校准</title>

		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>

		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx}/resources/js/config/config.js"></script>
	</head>

	<body>
		<%@ include file="../../V1/topMenu.jsp" %>
		<!-- begin breadcrumb -->
		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-5">请选择 </label>
						<label class="m-l-10 m-r-5">PM<sub>2.5</sub></label>
						<input type="checkbox" id="pm25chk" class="form-control" value="PM25" />

						<label class="m-l-10 m-r-5">PM<sub>10</sub></label>
						<input type="checkbox" id="pm10chk" class="form-control" value="PM10" />

					</div>
				</div>
			</div>
			<div class="m-t-10 bgf pd10 ovh">
				<div class="form-inline col-sm-3">
					<div class="form-group m-r-20">
						<label class="m-r-5">数据校准</label>
						<input type="text" class="form-control w100px m-r-5" id="updateValue" />倍
					</div>
					<div class="form-group">
						<input type="button" class="btn btn-info" id="idUpdateData" value="确定" />
					</div>
				</div>
				<div class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-5">数据关闭</label>
						<input type="text" class="form-control m-r-20" id="closeData" checked="" value="" />
					</div>
					<div class="form-group">
						<input type="button" class="btn btn-info" id="idCloseData" value="确定" />
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/js/system/data/datacalibration.js"></script>
	</body>

</html>