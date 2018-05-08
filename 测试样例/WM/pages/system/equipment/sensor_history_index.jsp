
<%@include file="../../includeJsCss.html" %>
<!DOCTYPE html>

<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<title>传感器历史</title>
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
		<script type="text/javascript" src="../../resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript">
			sessionStorage.setItem("tag", "1,2");
			sessionStorage.setItem("path", "sensor");
		</script>
	</head>

	<body>
		<%@ include file="../../V1/topMenu.html" %>
		<div id="content" class="pd10">
			<!-- begin breadcrumb -->
			<div class="top-search-container">
				<form role="form">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-r-5">监测点编号</label>
							<input type="text" class="form-control" v-model="searchFor.stationId" placeholder="请输入监测点编号">
						</div>
						<div class="form-group">
							<label class="m-r-5 m-l-20">设备编号</label>
							<input type="text" class="form-control" v-model="searchFor.equipmentId" placeholder="请输入设备编号">
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">项目</label>
							<select class="form-control" name="s_tech_type" id="projectId" v-model="searchFor.projectId">
								<option value="">请选择</option>
								<option v-for="option in projectList" value="{{option.id}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">类型</label>
							<select class="form-control" name="s_tech_type" id="s_tech_type" v-model="searchFor.deviceType">
								<option v-for="option in devtypelist" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">下发状态</label>
							<select class="form-control" id="selType" name="type" v-model="searchFor.status">
								<option v-for="option in statustypelist" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-md btn-info pull-right" @click="search">搜索</button>
						</div>
					</div>
				</form>
			</div>

			<div class="table-head m-t-10 ovh bgf">
				<%--<sec:authorize access="hasRole('ROLE_FUN_006_02_03_01')">--%>
				<button class="btn btn-info m-l-10 m-t-5 m-b-5" id="btnReSend" @click="reSend">一键补发</button>
				<%--</sec:authorize>--%>
			</div>
				
			<!-- 列表开始 -->
			<div class="table-responsive clear bgf">
				<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/rest/deviceHistory/page" pagination-path="" :fields="fields" :multi-sort="multiSort" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" :pagination-component="paginationComponent" :item-actions="itemActions" :append-params="moreParams" :per-page="perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading" :selected-to="selectedTo"></vuetable>
			</div>
			<!-- 列表结束 -->

		</div>

		<script type="text/javascript" src="../../resources/js/system/equipment/sensor_history_index.js"></script>

	</body>

</html>