
<%@include file="../includeJsCss.html" %>
<!DOCTYPE html>
<html>

<head>
	<title>蛙鸣科技 | 数据审核</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="renderer" content="webkit">
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
	<link rel="stylesheet" href="../../resources/plugins/layer/skin/default/layer.css" />
	<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	<link rel="stylesheet" href="../../resources/css/zlight.menu.css" />
	<script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
</head>

<body class="ovh">
<%@ include file="../V1/topMenu.html" %>
<div id="content" class="pd10 table-scroll">
	<div class="tabs-container">
		<ul class="nav nav-tabs bgf p-l-10 p-r-10">
			<li  v-show="dataAudit.real" id="realTab" :class="{active:dataAudit.real}">
				<a data-toggle="tab" href="#tab-data" aria-expanded="true">数据审核</a>
			</li>
			<li  v-show="dataAudit.history" id="hisTab" :class="{active:dataAudit.history && !dataAudit.real}" >
				<a data-toggle="tab" href="#tab-datahistory" aria-expanded="true">数据审核历史</a>
			</li>
		</ul>
		<div class="tab-content">
			<div id="tab-data" class="tab-pane"  :class="{'active':isRealActive}"  >
				<div class="pd10 bgf">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-r-5 ">城市</label>
							<select class="form-control " v-model="selected_city">
								<option value="-1" selected>请选择</option>
								<option v-for="item in option_city" :value="item.id">{{item.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-r-5 m-l-20">区/县</label>
							<select class="form-control " v-model="selected_district">
								<option value="-1" selected>请选择</option>
								<option v-for="option in option_district" :value="option.id">{{option.text}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">质控类型</label>
							<select class="form-control " v-model="selected_valid">
								<option value="-1" selected>请选择</option>
								<option v-for="option in option_valid" :value="option.code" >{{option.text}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">污染物</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" v-bind:true-value="1" v-bind:false-value="0" v-model="selpollutionType">全部</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="PM25" v-model="querypollutionType"> PM<sub>2.5</sub></label>
							<label class="m-r-5 m-t-5" v-if="intervel_time==1"> <input type="checkbox" value="PM25_24h" v-model="querypollutionType">PM<sub>2.5</sub>_24h</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="PM10" v-model="querypollutionType"> PM<sub>10</sub></label>

							<label class="m-r-5 m-t-5" v-if="intervel_time==1"> <input type="checkbox" value="PM10_24h" v-model="querypollutionType">PM<sub>10</sub>_24h</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="CO" v-model="querypollutionType"> CO</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="SO2" v-model="querypollutionType"> SO<sub>2</sub> </label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="NO2" v-model="querypollutionType"> NO<sub>2</sub> </label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="O3" v-model="querypollutionType"> O<sub>3</sub></label>
							<label class="m-r-5 m-t-5" v-if="intervel_time==1"> <input type="checkbox" value="O3_8h" v-model="querypollutionType"> O<sub>3</sub>_8h</label>
							<label class="m-r-5 m-t-5" v-if="intervel_time==2"> <input type="checkbox" value="O3_8h" v-model="querypollutionType"> O<sub>3</sub>_8h(Max)</label>

						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn  btn-info" @click="Search">查询</button>
						</div>
					</div>
					<div class="form-inline m-t-5">
						<div class="form-group">
							<label class="m-r-5 ">站点</label>
							<input type="text" class="form-control " placeholder="输入站点编号和名称" id="stationIdOrName" v-model="searchParams_stationIdOrName"/>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">间隔</label>
							<select class="form-control " v-model="intervel_time">
								<option value="1" selected>小时</option>
								<option value="2">天</option>
							</select>
						</div>
						<div v-show="showExceptionType == 1" class="form-group">
							<label class="m-l-20 m-r-5 ">异常类别</label>
							<select class="form-control " v-model="selected_category">
								<option value="-1" selected>请选择</option>
								<option v-for="option in option_category" :value="option.code" >{{option.text}}</option>
							</select>
						</div>
						<div class="form-group m-l-20 ">
							<label class="m-r-5 m-l-5"> <input type="radio" name="date" value="1day" v-model="querydateType"/> 当天</label>
							<label class="m-r-5"> <input type="radio" name="date" value="3day" v-model="querydateType"/> 近三天</label>
							<label class="m-r-5"> <input type="radio" name="date" value="1week" v-model="querydateType"/> 近一周</label>
							<label class="m-r-5"> <input type="radio" name="date" value="1month" v-model="querydateType"/> 近一月</label>
							<label class="m-r-5"> <input type="radio" name="date" value="autosite" v-model="querydateType"/> 自定义</label>
						</div>
						<div class="form-group dn" v-if="querydateType === 'autosite'">
							<div class="input-group input-daterange">
								<my-date-component scope="0" :fmt="fmt" :maxdate="maxdate" :starttime="starttime" :endtime="endtime"></my-date-component>
							</div>
						</div>
					</div>
				</div>
				<!-----------------------------查询结果-------------------------------->
				<div class="table-responsive bgf m-t-10">
					<div class="pull-left m-t-10">
						<button class="btn btn-info m-l-10" v-if="historyType==0 && showType==0 &&  dataAudit.output" id="exportExcel" @click="exportData">台账导出</button>
					</div>
					<div class="pull-right m-t-10">
						<button class="btn btn-tabinfo" v-if="historyType==0" id="btn-matrix" @click="searchMatrix">矩阵</button>
						<button class="btn btn-white m-l-5 m-r-10" v-if="historyType==0" id="btn-list" @click="searchList">列表</button>
					</div>
					<!-- 列表开始 -->
					<div class="clear"></div>
					<div class="vuetabletable-loadanimation m-t-10">
						<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/data/verify/list" pagination-path="" load-on-start="false" :fields="fields" :multi-sort="true" :pagination-component="paginationComponent" :append-params="params" :per-page="perPage" table-class="table table-bordered" table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up" wrapper-class="vuetable-wrapper" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" loading-class="loading">
						</vuetable>
					</div>
					<!-- 列表结束 -->
				</div>
				<!--审核弹窗-->
				<div class="modal" id="verifyModal" tabindex="-1" role="dialog" data-backdrop="false" aria-hidden="true">
					<div class="modal-dialog" style="width: 350px;">
						<div class="modal-content animated">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
										class="sr-only">Close</span></button>
								<h4 class="modal-title">数据审核</h4>
							</div>
							<div class="modal-body ovh">
								<div class="form-group">
									<label style="font-size: large;font-weight:800; color: red">
										<input type="radio" v-model="validRadio" value="1"> 数据有效
									</label>
									<label style="font-size: large;color: green;font-weight:800; float: right;">
										<input type="radio" v-model="validRadio" value="3"> 数据无效
									</label>
								</div>
								<div class="form-group">
									<select class="col-md-12" v-model="verifySelectReason" @change="changeSelectReason" style="height: 30px;margin-bottom: 6px;">
										<option v-for="option in optionValidReason" :value="option.value">{{option.text}}
										</option>
									</select>
									<textarea id="verifyInputReason" class="col-md-12" style="margin-bottom: 6px;" rows="6" v-model="verifyReason" v-bind:value="verifyReason" maxlength="30" placeholder="请输入原因"></textarea>
									<button id="verifyConfirmBtn" style="height: 30px;width: 100px;" class="btn btn-primary" type="button">确定</button>
									<button id="verifyBackBtn" style="height: 30px; width: 100px;float: right;" @click="hideModal" class="btn btn-info" type="button">返回</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="tab-datahistory"  class="tab-pane" :class="{'active':isActive}" >
				<div class="pd10 bgf">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-r-5 ">城市</label>
							<select class="form-control " v-model="selected_hiscity">
								<option value="-1" selected>请选择</option>
								<option v-for="item in option_hiscity" :value="item.id">{{item.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-r-5 m-l-20">区/县</label>
							<select class="form-control " v-model="selected_hisdistrict">
								<option value="-1" selected>请选择</option>
								<option v-for="option in option_hisdistrict" :value="option.id">{{option.text}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">审核操作</label>
							<select class="form-control " v-model="selected_hisvalid">
								<option value="-1" selected>请选择</option>
								<option value="1">有效</option>
								<option value="3">无效</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">审核员</label>
							<input type="text" placeholder="请输入审核员" class="form-control" v-model="searchParams_auditorName" />
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">污染物</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" v-bind:true-value="1" v-bind:false-value="0" v-model="selpollutionTypeHis">全部</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="PM25" v-model="querypollutionTypeHis"> PM<sub>2.5</sub></label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="PM10" v-model="querypollutionTypeHis"> PM<sub>10</sub></label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="CO" v-model="querypollutionTypeHis"> CO</label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="SO2" v-model="querypollutionTypeHis"> SO<sub>2</sub> </label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="NO2" v-model="querypollutionTypeHis"> NO<sub>2</sub> </label>
							<label class="m-r-5 m-t-5"> <input type="checkbox" value="O3" v-model="querypollutionTypeHis"> O<sub>3</sub></label>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-info" @click="SearchHis">查询</button>
						</div>
					</div>
					<div class="form-inline m-t-5">
						<div class="form-group">
							<label class="m-r-5 ">站点</label>
							<input type="text" class="form-control " placeholder="输入站点编号和名称" v-model="searchParams_hisStationIdOrName" />
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">间隔</label>
							<select class="form-control " v-model="intervel_histime">
								<option value="1" selected>小时</option>
							</select>
						</div>
						<div v-show="showExceptionType == 1" class="form-group">
							<label class="m-l-20 m-r-5 ">异常类别</label>
							<select class="form-control " v-model="selected_hiscategory">
								<option value="-1" selected>请选择</option>
								<option v-for="option in option_hiscategory" :value="option.code" >{{option.text}}</option>
							</select>
						</div>
						<div class="form-group m-l-20 ">
							<label class="m-r-5 m-l-5"> <input type="radio" name="date_history" value="1day" v-model="querydateTypeHis"/> 当天</label>
							<label class="m-r-5"> <input type="radio" name="date_history" value="3day" v-model="querydateTypeHis"/> 近三天</label>
							<label class="m-r-5"> <input type="radio" name="date_history" value="1week" v-model="querydateTypeHis"/> 近一周</label>
							<label class="m-r-5"> <input type="radio" name="date_history" value="1month" v-model="querydateTypeHis"/> 近一月</label>
							<label class="m-r-5"> <input type="radio" name="date_history" value="autosite" v-model="querydateTypeHis"/> 自定义</label>
						</div>
						<div class="form-group dn" v-if="querydateTypeHis === 'autosite'">
							<div class="input-group input-daterange">
								<my-date-component-his scope="1" :fmt="fmt" :maxdate="maxdate" :hisstarttime="hisstarttime" :hisendtime="hisendtime"></my-date-component-his>
							</div>
						</div>
					</div>
				</div>
				<!-----------------------------查询结果-------------------------------->
				<div class="table-responsive bgf m-t-10">
					<!-- 列表开始 -->
					<div class="clear"></div>
					<div class="vuetabletable-loadanimation m-t-10">
						<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/data/verify/list" pagination-path="" load-on-start="false" :fields="fields" :multi-sort="true" :pagination-component="paginationComponent" :append-params="params" :per-page="perPage" table-class="table table-bordered" table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up" wrapper-class="vuetable-wrapper" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" loading-class="loading">
						</vuetable>
					</div>
					<!-- 列表结束 -->
				</div>
			</div>
		</div>
	</div>
	<form id="exportForm" method="post"></form>

	<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
	<%--<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>--%>
	<script type="text/javascript" src="../../resources/plugins/vue/vue-table-sort.js"></script>
	<script type="text/javascript" src="../../resources/js/statistics/dataAudit.js"></script>
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