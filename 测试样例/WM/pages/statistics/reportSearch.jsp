
<%@include file="../includeJsCss.html" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 报告查询</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
		<link rel="stylesheet" href="../../resources/css/rewcssChrome.css" />
		<script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
		<script type="text/javascript" src="../../resources/js/report/report-common.js"></script>
	</head>

	<body>
		<%@ include file="../V1/topMenu.html" %>
		<div class="pd10" id="content">
			<div class="tabs-container chunk-set">
				<ul class="nav nav-tabs">
					<li class="active">
						<a data-toggle="tab" href="#tab-day" aria-expanded="true" @click="setCurrTimefg('day')">日报</a>
					</li>
					<li class="">
						<a data-toggle="tab" aria-expanded="true" href="#tab-week" @click="setCurrTimefg('week')">周报</a>
					</li>
					<li class="">
						<a data-toggle="tab" aria-expanded="true" href="#tab-month" @click="setCurrTimefg('month')">月报</a>
					</li>
					<li class="">
						<a data-toggle="tab" aria-expanded="true" href="#tab-qt" @click="setCurrTimefg('qt')">季报</a>
					</li>
					<li class="">
						<a data-toggle="tab" aria-expanded="true" href="#tab-year" @click="setCurrTimefg('year')">年报</a>
					</li>
				</ul>
				<div class="tab-content">
					<div id="tab-day" class="tab-pane active">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-l-10 m-r-5">报告类型</label>
									<select class="form-control" v-model="selected_category">
										<option value="-1" selected>全部</option>
										<option :value="option.code" v-for="option in report_category">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5">区/县</label>
									<select class="form-control" v-model="selected_district">
										<option value="-1" selected>全部</option>
										<option v-for="option in report_district" :value="option.id">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5">报告时间</label>
									<div class="input-group input-daterange">
										<input id="day_startTime" v-model="day_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'day_endTime\',{d:-0});}'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="day_endTime" v-model="day_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'day_startTime\',{d:0});}'})" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5">报告名称</label>
									<input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="setSearchfg">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<div id="tab-week" class="tab-pane">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">报告类型</label>
									<select class="form-control " v-model="selected_category">
										<option value="-1" selected>全部</option>
										<option :value="option.code" v-for="option in report_category">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5">区/县</label>
									<select class="form-control " v-model="selected_district">
										<option value="-1" selected>全部</option>
										<option v-for="option in report_district" :value="option.id">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告时间</label>
									<div class="input-group input-daterange">
										<input id="week_startTime" onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'week_endTime\',{d:-6});}',specialDays:[1],opposite:true,disabledDays:['2$','3$','4$','5$','6$','1$']})" v-model="week_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="week_endTime" v-model="week_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'week_startTime\',{d:0});}',specialDays:[0],opposite:true,disabledDays:['2$','3$','4$','5$','0$','1$']})" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告名称</label>
									<input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="setSearchfg">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<div id="tab-month" class="tab-pane">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">报告类型</label>
									<select class="form-control " v-model="selected_category">
										<option value="-1" selected>全部</option>
										<option :value="option.code" v-for="option in report_category">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">区/县</label>
									<select class="form-control " v-model="selected_district">
										<option value="-1" selected>全部</option>
										<option v-for="option in report_district" :value="option.id">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告时间</label>
									<div class="input-group input-daterange">
										<input id="month_startTime" v-model="month_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'month_endTime\');}'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="month_endTime" v-model="month_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'month_startTime\');}'})" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告名称</label>
									<input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="setSearchfg">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<div id="tab-qt" class="tab-pane">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">报告类型</label>
									<select class="form-control " v-model="selected_category">
										<option value="-1" selected>全部</option>
										<option :value="option.code" v-for="option in report_category">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">区/县</label>
									<select class="form-control " v-model="selected_district">
										<option value="-1" selected>全部</option>
										<option v-for="option in report_district" :value="option.id">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告时间</label>
									<div class="input-group input-daterange">
										<input id="qt_startTime" v-model="qt_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间" onfocus="WdatePicker({dateFmt:'yyyy年M季度',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'qt_endTime\');}',disabledDates: ['....-0[5-9]-..', '....-1[0-2]-..'],startDate:'%y-01-01'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="qt_endTime" v-model="qt_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间" onfocus="WdatePicker({dateFmt:'yyyy年M季度',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'qt_startTime\');}',disabledDates: ['....-0[5-9]-..', '....-1[0-2]-..'],startDate:'%y-01-01'})" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告名称</label>
									<input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="setSearchfg">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
					<div id="tab-year" class="tab-pane">
						<!--日报搜索条件 begin-->
						<div class="p-t-10 p-b-10">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-r-5 m-l-10">报告类型</label>
									<select class="form-control " v-model="selected_category">
										<option value="-1" selected>全部</option>
										<option :value="option.code" v-for="option in report_category">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">区/县</label>
									<select class="form-control " v-model="selected_district">
										<option value="-1" selected>全部</option>
										<option v-for="option in report_district" :value="option.id">{{option.text}}
										</option>
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">报告时间</label>
									<div class="input-group input-daterange">
										<input id="year_startTime" v-model="year_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间" onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'year_endTime\');}'})" />
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input id="year_endTime" v-model="year_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间" onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'year_startTime\');}'})" />
									</div>
								</div>
								<div class="form-group">
									<label class="m-l-20 m-r-5 ">名称</label>
									<input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
								</div>
								<div class="form-group pull-right">
									<button type="button" class="btn btn-md btn-info" @click="setSearchfg">查询</button>
								</div>
							</div>
						</div>
						<!--日报搜索条件end	-->
					</div>
				</div>
			</div>
			<!--搜索结果begin-->
			<!-- 列表开始 -->
			<div class="table-responsive b-radius4 bgf m-t-10">
				<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/statistics/getReportRecord" pagination-path="" :fields="fields" :append-params="params" :per-page="perPage" table-class="table table-bordered table-striped table-hover" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
			</div>
			<!-- 列表结束 -->
			<a class="dn" id="dowload" href="{{fileDownloadUrl}}">点击下载</a>
			<!--搜索结果end-->
		</div>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
		<script type="text/javascript" src="../../resources/js/statistics/reportSearch.js"></script>

	</body>

</html>