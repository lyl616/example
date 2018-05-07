<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../includeJsCss.jsp" %>
<html>

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 多曲线分析</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollution-index-range-temp.js"></script>
		<link rel="stylesheet" href="${ctx}/resources/css/rewcssChrome.css" />
		<script src="${ctx }/resources/plugins/d3/js/modernizr.js"></script>
		<script src="${ctx }/resources/plugins/d3/js/d3.v3.min.js"></script>
		<script src="${ctx }/resources/plugins/d3/js/underscore-min.js"></script>
		<style>
			svg {
				width: 1000px;
				height: 920px;
				padding-top: 0px;
			}
		</style>
	</head>

	<body>
		<%@ include file="../V1/topMenu.jsp" %>
		<!-- end #header -->
		<div class="col-md-12">
			<div class="top-search-container post-fixed m-l-10 m-t-10">
				<div class="form-inline">
					<div class="form-group">
						<label>历史查询</label>
						<input id="d1212" class="form-control Wdate m-l-10" type="text" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',isShowClear:false})" />
						<select class="form-control m-l-10" id="s_concentrationType" />
						</select>
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-md btn-info pull-right" value="查询" onclick="initGKDZCharts()" />
					</div>
				</div>
			</div>
		</div>

		<div id="chart">
			<svg id='chartSVG'></svg>
			<div id="widgets">
				<div id="menu">
				</div>
				<div id="info">
				</div>
			</div>
		</div>

	</body>

</html>