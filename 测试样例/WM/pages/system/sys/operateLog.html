
<%@include file="../../includeVue.html" %>

<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 操作日志</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div id="app" class="pd10 table-scroll">
			<!--实时告警搜索条件 begin-->
			<div class="pd10 bgf">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-r-5">时间范围</label>
						<div class="input-group input-daterange">
							<input class="form-control Wdate w150" id="startTime" onfocus="showDatePicker('startTime')" v-model="startTime" name="startTime" readonly placeholder="开始时间" type="text">
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input class="form-control Wdate w150" id="endTime" onfocus="showDatePicker('endTime')" v-model="endTime" name="endTime" readonly placeholder="结束时间" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">页面</label>
						<select class="form-control " v-model="operatingPage">
							<option value="">请选择</option>
							<option v-for="item in pageList" v-bind:value="item.code">{{item.name}}</option>
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">操作</label>
						<select class="form-control " v-model="operation">
							<option value="">请选择</option>
							<option v-for="item in operationList" v-bind:value="item.code">{{item.name}}</option>
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">操作人</label>
						<input type="text" class="form-control" v-model="userName" placeholder="请输入姓名或登录名" />
					</div>

					<div class="form-group">
						<label class="m-l-20 m-r-5">日志内容</label>
						<input type="text" class="form-control" v-model="operatingDetail" placeholder="用户登录名/项目名称/组织名称" />
					</div>
					<div class="form-group pull-right">
						<button type="button" class="btn btn-info" @click="operationLogSearch">查询</button>
					</div>
				</div>
			</div>
			<!--实时告警搜索条件end	-->
			<!--搜索结果begin-->
			<div class="table-responsive bgf m-t-10 b-radius4">
				<!-- 列表开始 -->
				<div class="table-responsive">
					<vuetable ref="vuetable" api-url="${coreApiPath}/sysOpertaionLog/getSysOperationLogPage" :fields="fields" :table-height="tableHeight" pagination-path="pagination" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" :sort-order="sortOrder" :multi-sort="multiSort" :load-on-start="loadOnStart" @vuetable:pagination-data="onPaginationData" @vuetable:loading="showLoader" @vuetable:loaded="hideLoader" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave" @vuetable:load-success="onLoadSuccess" @vuetable:initialized="onInitialized">
					</vuetable>
					<div class="vuetable-pagination">
						<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
						<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
					</div>
				</div>
				<!-- 列表结束 -->
			</div>
			<!--搜索结果end-->
		</div>
		<script type="text/javascript" src="../../resources/js/system/sys/operateLog.js"></script>
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