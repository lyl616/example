<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../includeJsCss.jsp" %>
<!DOCTYPE html>
<html>
	<head>
		<title>蛙鸣科技 | 超标统计</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx}/resources/js/report/Init_Reporttime.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/report/report-common.js"></script>
	</head>
	<body class="ovh">
		<%@ include file="../V1/topMenu.jsp" %>
		<div id="content" class="pd10 table-scroll">
			<div class="tabs-container ovh ">
				<ul class="nav nav-tabs bgf">
					<li class="active">
						<a data-toggle="tab" href="#tab-three" @click="setOverproofLevel(3)" aria-expanded="true">限值：三级 <span v-html="level3Total"> </span></a>
					</li>
					<li>
						<a id="forthTab" data-toggle="tab" aria-expanded="true" @click="setOverproofLevel(4)" href="#tab-four">限值：四级 <span v-html="level4Total"> </span></a>
					</li>
				</ul>
				<div class="tab-content">
					<div id="tab-three" class="tab-pane bgf active">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">站点类别</label>
									<input id="three_wzcb" type="checkbox" value="6010,1010" v-model="three_queryStationType">
									<label for="three_wzcb" class="m-r-5 m-t-5">微站</label>
									<input id="three_khcb" type="checkbox" value="98" v-model="three_queryStationType">
									<label for="three_khcb" class="m-r-5 m-t-5">考核站</label>
									<input id="three_pccb" type="checkbox" value="99" v-model="three_queryStationType">
									<label for="three_pccb" class="m-r-5 m-t-5">爬虫站</label>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">污染物</label>
									<select id="three_ptype" class="form-control " v-model="three_pollutionType">
										<option :value="option.value" v-for="option in pollutionTypeList">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">起止时间</label>
									<div class="input-group input-daterange">
										<input id="three_startTime" v-model="three_startTime" class="form-control Wdate w150" type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'three_endTime\',{d:-7});}', maxDate:'#F{$dp.$D(\'three_endTime\',{d:-0});}'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="three_endTime" v-model="three_endTime" class="form-control Wdate w150" type="text" placeholder="结束时间" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'three_startTime\',{d:0});}', maxDate:'#F{$dp.$D(\'three_startTime\',{d:7});}'})" />
									</div>
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-info" @click="Search">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<div id="tab-four" class="tab-pane bgf">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">站点类别</label>
									<input id="four_wzcb" type="checkbox" value="6010,1010" v-model="four_queryStationType">
									<label for="four_wzcb" class="m-r-5 m-t-5">微站</label>
									<input id="four_khcb" type="checkbox" value="98" v-model="four_queryStationType">
									<label for="four_khcb" class="m-r-5 m-t-5">考核站</label>
									<input id="four_pccb" type="checkbox" value="99" v-model="four_queryStationType">
									<label for="four_pccb" class="m-r-5 m-t-5">爬虫站</label>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">污染物</label>
									<select id="four_ptype" class="form-control " v-model="four_pollutionType">
										<option :value="option.value" v-for="option in pollutionTypeList">{{option.name}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-5 ">起止时间</label>
									<div class="input-group input-daterange">
										<input id="four_startTime" v-model="four_startTime" class="form-control Wdate w150" type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'four_endTime\',{d:-7});}', maxDate:'#F{$dp.$D(\'four_endTime\',{d:-0});}'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="four_endTime" v-model="four_endTime" class="form-control Wdate w150" type="text" placeholder="结束时间" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'four_startTime\',{d:0});}', maxDate:'#F{$dp.$D(\'four_startTime\',{d:7});}'})" />
									</div>
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-info" @click="Search">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<!--搜索结果begin-->
					<div class="table-responsive m-t-10 bgf">
						<!-- 列表开始 -->
						<div class="f-s-12 clear">
							<div class="table-responsive">
								<vuetable v-ref:vuetable :load-on-start="false" api-url="${requestScope.coreApiContextPath}/analysis/overproof/list" pagination-path="" :fields="fields" :append-params="queryParam" :per-page="perPage" table-class="table table-bordered table-striped table-hover" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading">
								</vuetable>
							</div>
						</div>
						<!-- 列表结束 -->
					</div>
					<!--搜索结果end-->
				</div>
			</div>
			<!--查看详情弹窗begin-->
			<div class="modal" id="detailModal" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content animated">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
		                            class="sr-only">Close</span></button>
							<button @click="clickFeedback" v-bind:class="{ 'btn-white': showDetail, 'btn-info': showFeedback }" id="feedbackBtn" type="button" class="btn btn-white pull-right">反馈
		                    </button>
							<button @click="clickDetail" v-bind:class="{ 'btn-white': showFeedback, 'btn-info': showDetail }" id="detailBtn" type="button" class="btn btn-info pull-right">详情
                    </button>
							<h4 class="modal-title">超标详情</h4>
						</div>
						<div class="modal-body ovh">
							<!--24小时曲线开始-->
							<div class="">
								<span class="m-r-5">名称：<b class="fwn" v-html='pop_pollution_name'></b></span>
								<span class="m-r-5">编号：<b class="fwn" v-html='pop_pollution_id'></b></span>
								<span class="m-r-5">污染物：<b class="fwn" v-html='pop_pollution_type'></b></span>
								<span class="m-r-5">时间：<b class="fwn" v-html='pop_pollution_time'></b></span>
							</div>
							<div id="hour24Chart" v-bind:style="{ display: showDetailDiv }" style="width: 568px; height: 250px;"></div>
							<!--24小时曲线结束-->
							<!--表格开始-->
							<div class="table" v-bind:style="{ display: showDetailDiv }" style="width: 568px;height: 230px; overflow-y: scroll;">
								<%--<vuetable api-url='/api/users' :fields='pop_fields'></vuetable>--%>
								<table id="detailTable" class="table table-bordered table-striped table-hover">
									<thead>
										<tr>
											<th class="text-center">序号</th>
											<th class="text-center">超标时间</th>
											<th class="text-center">污染数值</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
							<!--表格结束-->
							<!--反馈表格开始-->
							<div class="table m-t-10 m-b-10" v-bind:style="{ display: showFeedbackDiv }" style="width: 568px;height: 426px; overflow-y: scroll;">
								<table class="table table-bordered table-striped table-hover">
									<thead>
										<tr>
											<th class="text-center col-xs-1">序号</th>
											<th class="text-center col-xs-4">反馈详情</th>
											<th class="text-center col-xs-2">反馈时间</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(index, feedback) in feedbackList">
											<td class="text-center col-xs-1">{{ index + 1 }}</td>
											<td class="text-center col-xs-4">{{ feedback.detail }}</td>
											<td class="text-center col-xs-2">{{ feedback.insTime }}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!--反馈表格结束-->
							<div class="m-t-10 m-b-10" style="width: 539px;" v-bind:style="{ display: showFeedbackDiv }">
								<div class="input-group">
									<input v-model="feedbackDetail" @keyup.enter="saveFeedback" class="form-control" maxlength="100" placeholder="请填写反馈">
									<span class="input-group-btn">
			                            <button @click="saveFeedback"  class="btn btn-info" type="button">提交</button>
			                        </span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--查看详情弹窗end-->
		</div>
		<script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/statistics/overStandard.js"></script>
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