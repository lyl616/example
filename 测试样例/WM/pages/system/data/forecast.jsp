<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeJsCss.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<title>蛙鸣科技 | 天气预报</title>
		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript">
			sessionStorage.setItem("tag", "2,1");
		</script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div id="content" class="pd10 table-scroll">
			<!-- begin breadcrumb -->
			<div class="top-search-container ovh">
				<form role="form">
					<div class="form-inline">
						<div class="form-group">
							<div class="input-group input-daterange m-l-10">
								<input id="startTime" v-model="startTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss' ,maxDate:'%y-%M-%d %H:%m:%s'})" class="form-control Wdate w150" type="text" placeholder="请选择开始时间">
								<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
								<input id="endTime" v-model="endTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss' ,maxDate:'%y-%M-%d %H:%m:%s'})" class="form-control Wdate w150" type="text" placeholder="请选择结束时间">
							</div>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">省份</label>
							<select class="form-control" id="s_province" v-model="province">
								<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">城市</label>
							<select class="form-control" id="s_city" v-model="city">
								<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
							</select>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-info " @click="search">查询</button>
							<%--<sec:authorize access="hasRole('ROLE_FUN_006_03_02_01')">--%>
							<button type="button" class="btn btn-white" @click="exportExcel">导出</button>
							<%--</sec:authorize>--%>
						</div>
					</div>
				</form>
			</div>
			<div class="m-t-10 bgf">
				<!-- 列表开始 -->
				<div class="table-responsive clear">
					<vuetable v-ref:vuetable api-url="${requestScope.backendApiContextPath}/airdata/getAirData" pagination-path="" :fields="fields" table-class="table table-bordered table-striped table-hover" pagination-class="" pagination-info-class="" load-on-start="false" pagination-component-class="" :append-params="params" :per-page="perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
				</div>
			</div>
		</div>
		<form id="exportForm" method="post"></form>
		<script type="text/javascript" src="${ctx}/resources/js/system/data/forecast.js"></script>
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