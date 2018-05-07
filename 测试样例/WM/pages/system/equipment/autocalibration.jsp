<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeJsCss.jsp" %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<title>蛙鸣科技 | 参数计算</title>
		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table-sort.js"></script>
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx}/resources/js/report/Init_Reporttime.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/layer/layer.js"></script>
	</head>
	<body id="content" class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="pd10 table-scroll">
			<div class="tabs-container">
				<ul class="nav nav-tabs bgf table-head" id="tabs-container">
					<li :class="{active:realActive}" v-if="showRealTab">
						<a data-toggle="tab" href="#tab-autocorect" aria-expanded="true" onclick="loadReal()">自动化校准</a>
					</li>
					<li :class="{active:historyActive}" v-if="showHisTab">
						<a data-toggle="tab" href="#tab-history-corect" onclick="loadHis()">历史校准记录</a>
					</li>
				</ul>
				<div class="tab-content">
					<div id="tab-autocorect" v-show="showReal" :class="{active:realActive}" class="tab-pane">
						<div class="pull-right kb_menu_continer" id="kb_continer">
							<a class="drop-down-a" @click="show_kbWindow" v-if="showKBjs">K/B值计算<i class='icon_react icon_react_up'></i></a>
							<div class="kb_popwindow">
								<span class="kb_popw_icon"></span>
								<div class="form-group dib m-t-10">
									<label class=" m-r-5 m-l-10" style="margin-left: 34px;">省</label>
									<select class="form-control w50" v-model="province">
										<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group dib m-t-10">
									<label class="m-r-5 m-l-10 " style="margin-left: 26px;">市</label>
									<select class="form-control w50" v-model="city" v-bind:value="city">
										<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group m-t-10">
									<label class="m-r-5 m-l-10">污染物</label>
									<select class="form-control" style="width: 161px;" v-model="kb_pollution" v-bind:value="kb_pollution">
										<option value="pm25">PM2.5</option>
										<option value="pm10">PM10</option>
										<option value="co">CO</option>
										<option value="so2">SO2</option>
										<option value="no2">NO2</option>
									</select>
								</div>
								<label class="m-r-5 m-l-10 m-t-10">训练集范围</label>
								<input id="startTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',maxDate:'%y-%M-%d'})" v-model="day_startTime" v-bind:value="day_startTime" style="width: 91%;" class="form-control Wdate m-r-5 m-l-10 m-t-10" type="text" placeholder="开始时间" />
								<input id="endTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',maxDate:'%y-%M-%d'})" v-model="day_endTime" v-bind:value="day_endTime" style="width: 91%;" class="form-control Wdate m-r-5 m-l-10 m-t-10" type="text" placeholder="结束时间" />
								<button class="btn btn-info m-r-5 m-t-10 m-l-10 btn-block text-center" style="width: 91%;" @click="calc_kb">计算</button>
							</div>
						</div>
						<!--实时告警搜索条件 begin-->
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-l-20 m-r-5">项目</label>
									<select class="form-control" id="option_project">
										<option value='-1' selected='selected'>请选择</option>
										<option v-for="option in autoorect_projectList" value="{{option.id}}">{{option.name}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class=" m-r-5 m-l-10 ">省份</label>
									<select class="form-control " v-model="province">
										<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-10 ">城市</label>
									<select id="citySelect" class="form-control " v-model="city" v-bind:value="city">
										<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5">下发结果</label>
									<select class="form-control " v-model="kb_Result_type">
										<option value="-1">请选择</option>
										<option v-for="option in kb_Result_type_list" value="{{option.id}}">{{option.text}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5">污染物类型</label>
									<input type="checkbox" v-model="selecttoggle" v-bind:true-value="1" v-bind:false-value="0"><label class="m-r-5 m-t-5">全部 </label>
									<input type="checkbox" value="pm25" v-model="querypollutionType"><label class="m-r-5 m-t-5">PM<sub>2.5</sub></label>
									<input type="checkbox" value="pm10" v-model="querypollutionType"><label class="m-r-5 m-t-5">PM<sub>10</sub></label>
									<input type="checkbox" value="so2" v-model="querypollutionType"><label class="m-r-5 m-t-5">SO<sub>2</sub></label>
									<input type="checkbox" value="no2" v-model="querypollutionType"><label class="m-r-5 m-t-5">NO<sub>2</sub></label>
									<input type="checkbox" value="co" v-model="querypollutionType"><label class="m-r-5 m-t-5">CO</label>
									<input type="checkbox" value="o3" v-model="querypollutionType"><label class="m-r-5 m-t-5">O<sub>3</sub></label>
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="search">查询</button>
								</div>
							</div>
							<div class="form-inline m-t-5">
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">监测点</label>
									<input v-model="station_id" v-bind:value="station_id" class="form-control " type="text" placeholder="请输入编号/名称">
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">下发人</label>
									<input v-model="done_people" class="form-control " type="text" placeholder="请输入下发人">
								</div>
							</div>
						</div>
						<!--实时告警搜索条件end	-->
						<!--搜索结果begin-->
						<div class="table-responsive m-t-10 bgf">
							<div class=" table-head">
								<button type="button" v-if="showKBxf" class="btn btn-info m-t-5 m-b-5 m-l-10" @click="confirm_done">下发K/B值</button>
							</div>
							<div class="pull-right">
								<label v-html="calc_currtime"></label>
							</div>
							<!-- 列表开始 -->
							<div class="vuetabletable-loadanimation clear">
								<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/amc/realtime/list" pagination-path="" :fields="fields" :multi-sort="false" :selected-to="selectedTo" :per-page="perPage" :append-params="params" table-class="table table-bordered table-striped table-hover" table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" :load-on-start="loadOnStart" wrapper-class="vuetable-wrapper" loading-class="loading" load-on-start="false"></vuetable>
							</div>
							<!-- 列表结束 -->
						</div>
						<!--搜索结果end-->
					</div>
					<div id="tab-history-corect" v-show="showHistory" class="tab-pane" :class="{active:historyActive}">
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-l-20 m-r-5">项目</label>
									<select class="form-control" v-model="history_query_params.projectId" :value="history_query_params.projectId">
										<option value='-1' selected='selected'>请选择</option>
										<option v-for="option in his_projectList" value="{{option.id}}">{{option.name}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class=" m-r-5 m-l-10 w50">省份</label>
									<select class="form-control" v-model="history_pro">
										<option value="-1">请选择</option>
										<option v-for="option in history_prolist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-r-5 m-l-10 w50">城市</label>
									<select class="form-control " v-model="history_city">
										<option value="-1">请选择</option>
										<option v-for="option in history_citylist" value="{{option.id}}">{{option.domainName}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5">下发结果</label>
									<select class="form-control " v-model="history_query_params.kbResult" :value="history_query_params.kbResult">
										<option value="-1">请选择</option>
										<option v-for="option in his_result_list" value="{{option.id}}">{{option.text}}</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5">污染物类型</label>
									<input type="checkbox" v-model="history_selecttoggle" v-bind:true-value="1" v-bind:false-value="0"><label class="m-r-5 m-t-5">全部 </label>
									<input type="checkbox" value="pm25" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">PM<sub>2.5</sub></label>
									<input type="checkbox" value="pm10" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">PM<sub>10</sub></label>
									<input type="checkbox" value="so2" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">SO<sub>2</sub></label>
									<input type="checkbox" value="no2" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">NO<sub>2</sub></label>
									<input type="checkbox" value="co" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">CO</label>
									<input type="checkbox" value="o3" v-model="history_query_params.pollutionTypes"><label class="m-r-5 m-t-5">O<sub>3</sub></label>
									<%--<input type="checkbox" value="o3" v-model="history_querypollutionType"><label class="m-r-5 m-t-5">O<sub>3</sub></label>--%>
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="loadHisTable(true)">查询</button>
								</div>
							</div>
							<div class="form-inline m-t-10">
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">监测点</label>
									<input v-model="history_query_params.stationId" class="form-control " type="text" placeholder="请输入监测点编号/名称">
								</div>
								<div class="form-group">
									<select class="form-control m-l-20 m-r-5" v-model="history_query_params.opt">
										<option value="1">下发K/B值</option>
										<option value="2">计算K/B值</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">起止时间</label>
									<div class="input-daterange input-group">
										<input v-model="history_query_params.startTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-{%d-1}'})" class="form-control Wdate w150" type="text" placeholder="请选择开始时间" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input v-model="history_query_params.endTime" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" class="form-control Wdate w150" type="text" placeholder="请选择结束时间" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">操作人</label>
									<input v-model="history_query_params.operator" class="form-control " type="text" placeholder="请输入操作人">
								</div>
							</div>
						</div>
						<!--实时告警搜索条件end	-->
						<!--搜索结果begin-->
						<div class="table-responsive bgf m-t-10">
							<!-- 列表开始 -->
							<div class="f-s-12 clear">
								<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/amc/history/list" pagination-path="" :fields="history_fields" :sort-order="sortOrder" :multi-sort="multiSort" :per-page="history_perPage" :append-params="history_params" table-class="table table-bordered table-striped table-hover" table-wrapper=".vuetable-wrapper" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" loading-class="loading" load-on-start="false">
								</vuetable>
							</div>
							<!-- 列表结束 -->
						</div>
						<!--搜索结果end-->
					</div>
				</div>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="${ctx}/resources/js/system/equipment/autocalibration.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
		    $(window).resize(function() {
		        calcOverflowH(1, "table-scroll", 40);
		    });
		});
		calcOverflowH(1, "table-scroll", 40);
	</script>
</html>