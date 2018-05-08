
<%@include file="../../includeJsCss.html" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 原始数据</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript">
			sessionStorage.setItem("tag", "2,0");
		</script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div id="content" class="pd10 table-scroll">
			<!-- begin breadcrumb -->
			<div class="top-search-container ovh">
				<form role="form">
					<div class="form-inline">
						<div class="form-group">
							<div class="input-group input-daterange m-l-10">
								<input id="startTime" v-model="startTime" class="form-control Wdate w150" type="text" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false,maxDate:'%y-%M-%d %H:%m:%s'})" placeholder="请选择开始时间" />
								<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
								<input id="endTime" v-model="endTime" class="form-control Wdate w150" type="text" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false,maxDate:'%y-%M-%d %H:%m:%s'})" placeholder="请选择结束时间" />
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
						<div class="form-group">
							<label class="m-l-20 m-r-5">站点编号</label>
							<input id="stationId" v-model="stationId" class="form-control" type="text" placeholder="站点编号">
						</div>

						<div class="form-group">
							<label class="m-l-20 m-r-5">站点类型</label>
							<select class="form-control" v-model="stationType" id="seaStationType">
								<option value="all">请选择</option>
								<option v-for="option in stationTypeList" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">类别</label>
							<input type="radio" class="m-l-10 m-r-5" name="type" value="1" v-model="queryType" /><label>实时</label>
							<input type="radio" class="m-l-10 m-r-5" name="type" value="2" v-model="queryType" /><label>小时</label>
							<input type="radio" class="m-l-10 m-r-5" name="type" value="3" v-model="queryType" /><label>天</label>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-info" @click="search">查询</button>
							<%--<sec:authorize access="hasRole('ROLE_FUN_006_03_01_01')">--%>
							<button type="button" class="btn btn-warning" @click="exportExcel">导出</button>
							<%--</sec:authorize>--%>
						</div>
					</div>
				</form>
			</div>
			<!-- 		搜索 -->
			<div class="m-t-10 bgf">
				<!-- 列表开始 -->
				<div class="table-responsive clear">
					<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/rest/data/getWeatherData" pagination-path="" :fields="fields" table-class="table table-bordered table-striped table-hover" pagination-class="" pagination-info-class="" pagination-component-class="" :append-params="params" detail-row-id="stationId" :per-page="perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading" load-on-start="false"></vuetable>
				</div>
				<!-- 列表结束 -->
			</div>
		</div>
		<form id="exportForm" method="post"></form>
		<script type="text/javascript" src="../../resources/js/system/data/environmental.js"></script>
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