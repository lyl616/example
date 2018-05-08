
<%-- <%@include file="../system/include_tools.html"%> --%>
<%@include file="../../includeJsCss.html" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>蛙鸣科技 | 设备寻标</title>
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<%--<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>--%>
        <script type="text/javascript" src="../../resources/plugins/vue/vue-table-sort.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body id="content" class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div class="pd10 table-scroll">
			<div class="tabs-container ">
				<ul class="nav nav-tabs bgf table-head" id="tabs-container">
					<li :class="{active:realActive}" v-if="showRealTab">
						<a data-toggle="tab" href="#tab-benchmark" aria-expanded="true">设备寻标</a>
					</li>
					<li :class="{active:historyActive}" v-if="showHisTab">
						<a data-toggle="tab" href="#tab-history-benchmark">设备寻标历史</a>
					</li>
				</ul>
				<div class="tab-content">
					<div id="tab-benchmark" v-show="showReal" :class="{active:realActive}" class="tab-pane">
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class=" m-r-5">省份</label>
									<select class="form-control " v-model="province">
										<option value="-1">请选择</option>
										<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class=" m-r-5 m-l-20">城市</label>
									<select id="cityselected" class="form-control " v-model="city" v-bind:value="city">
										<option value="-1">请选择</option>
										<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">站点类型</label>
									<select id="stationType" class="form-control " v-model="stationType">
										<option value="-1">请选择</option>
										<option v-for="option in stationTypeList" value="{{option.code}}">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-20">设备类型</label>
									<select id="deviceType" class="form-control " v-model="deviceType">
										<option value="-1">请选择</option>
										<option v-for="option in deviceTypeList" value="{{option.code}}">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-20">监测点</label>
									<input type="text" placeholder="请输入编号/名称" class="form-control" v-model="selStation" v-bind:value="selStation" />
								</div>

								<div class="form-group pull-right">
									<input type="button" class="btn btn-md btn-info pull-right" @click="search" id="getChart" value="查询" />
								</div>
							</div>
						</div>
						<!--搜索结果begin-->
						<div class="table-responsive bgf m-t-10">

							<div class=" table-head">

								<button class="btn btn-info m-t-5 m-b-5 m-l-10" v-if="showBenchmarkTip" @click="showtip">寻标</button>
							</div>
							<div class="f-s-12 clear">
								<!-- 列表开始 -->
								<div class="vuetabletable-loadanimation ">
									<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/benchmark/getList" pagination-path="" :fields="fields" :multi-sort="true" :append-params="params" :per-page="perPage" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading" load-on-start="false"></vuetable>

								</div>
								<!-- 列表结束 -->
							</div>

						</div>
						<!--搜索结果end-->
					</div>
					<div id="tab-history-benchmark" v-show="showHistory" class="tab-pane" :class="{active:historyActive}">
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class=" m-r-5">省份</label>
									<select class="form-control " v-model="province">
										<option value="-1">请选择</option>
										<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class=" m-r-5 m-l-20">城市</label>
									<select id="cityselected-his" class="form-control " v-model="city" v-bind:value="city">
										<option value="-1">请选择</option>
										<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">站点类型</label>
									<select id="stationType-his" class="form-control " v-model="stationType">
										<option value="-1">请选择</option>
										<option v-for="option in stationTypeList" value="{{option.code}}">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-20">设备类型</label>
									<select id="deviceType-his" class="form-control " v-model="deviceType">
										<option value="-1">请选择</option>
										<option v-for="option in deviceTypeList" value="{{option.code}}">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-20">监测点</label>
									<input type="text" placeholder="请输入编号/名称" class="form-control" v-model="selStation" v-bind:value="selStation" />
								</div>

								<div class="form-group">
									<label class="m-l-20 m-r-5 ">寻标时间</label>
									<div class="input-daterange input-group">
										<input v-model="startTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-{%d-1}'})" class="form-control Wdate w150" type="text" placeholder="请选择开始时间" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input v-model="endTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-{%d+1}'})" class="form-control Wdate w150" type="text" placeholder="请选择结束时间" />
									</div>
								</div>

								<div class="form-group">
									<label class="m-l-10 m-r-5 ">操作人</label>
									<input v-model="operator" class="form-control " type="text" placeholder="请输入操作人">
								</div>

								<div class="form-group pull-right">
									<input type="button" class="btn btn-md btn-info pull-right" @click="search" value="查询" id="getChart"/>
								</div>
							</div>
						</div>
						<!--搜索结果begin-->
						<div class="table-responsive bgf m-t-10">
							<div class="f-s-12 clear">
								<!-- 列表开始 -->
								<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/benchmark/getList" pagination-path="" :fields="fields" :multi-sort="true" :append-params="params" :per-page="perPage" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading" load-on-start="false"></vuetable>
								<!-- 列表结束 -->
							</div>
						</div>
						<!--搜索结果end-->
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
		<script src="../../resources/js/system/equipment/benchmark.js"></script>
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