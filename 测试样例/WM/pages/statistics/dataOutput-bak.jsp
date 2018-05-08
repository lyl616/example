
<%@include file="../includeJsCss.html" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 数据导出</title>
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
		<div id="content" class="pd10">			
			<div class="top-search-container ovh">
				<form role="form">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-r-5 m-l-10">省份</label>
							<select class="form-control " v-model="province">
								<option value="-1">请选择</option>
								<option v-for="option in prolist" value="{{option.id}}">{{option.domainName}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-r-5 m-l-20">城市</label>
							<select id="cityselected" class="form-control " v-model="city" v-bind:value="city">
								<option value="-1">请选择</option>
								<option v-for="option in citylist" value="{{option.id}}">{{option.domainName}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-r-5 m-l-20">区/县</label>
							<select class="form-control " v-model="district">
								<option value="-1">请选择</option>
								<option v-for="option in districtlist" value="{{option.id}}">{{option.county}}</option>
							</select>
						</div>

						<div class="form-group">
							<label class="m-l-20 m-r-5 ">站点类型</label>
							<select id="stationId" class="form-control " v-model="stationType" id="seaStationType">
								<option value="-1">请选择</option>
								<option v-for="option in stationTypeList" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group m-l-20">
							<div class="dib wz_s"><input type="checkbox" value="6010,1010" v-model="queryStationType"><label class="m-r-5 m-t-5">微站</label></div>
							<div class="dib other_s"><input type="checkbox" value="101" v-model="queryStationType"><label class="m-r-5 m-t-5">扬尘站</label>
								<input type="checkbox" value="98" v-model="queryStationType"><label class="m-r-5 m-t-5">考核站</label>
								<input type="checkbox" value="99" v-model="queryStationType"><label class="m-r-5 m-t-5">爬虫站</label></div>
						</div>
					</div>
					<div class="row col-md-12 form-inline m-t-5">

						<div class="form-group">
							<div class="input-daterange">
								<label class="m-l-20 m-r-5 ">起止时间</label>
								<input id="startTime" v-model="startTime" class="form-control Wdate w150" type="text" placeholder="请选择开始时间" />
								<span class="input-group-addon dib">-</span>
								<input id="endTime" v-model="endTime" class="form-control Wdate w150" type="text" placeholder="请选择结束时间" />
							</div>
						</div>
						<div class="form-group m-l-20">
							<div class="dib time_m"><input type="radio" name="type" value="minute" v-model="queryType" /><label>分钟</label>
							</div>
							<input type="radio" name="type" value="hour" v-model="queryType" /><label>小时</label>
							<input type="radio" name="type" value="day" v-model="queryType" /><label>天</label>
						</div>
					</div>
					<div class="row col-md-12 form-inline m-t-5">
						<div class="form-group">
							<label class="m-l-20 m-r-5 ">污染物类型</label>

							<input type="checkbox" value="aqi" v-model="querypollutionType"><label class="m-r-5 m-t-5">AQI </label>
							<input type="checkbox" value="pm25" v-model="querypollutionType"><label class="m-r-5 m-t-5">PM<sub>2.5</sub></label>
							<input type="checkbox" value="pm10" v-model="querypollutionType"><label class="m-r-5 m-t-5">PM<sub>10</sub> </label>
							<input type="checkbox" value="so2" v-model="querypollutionType"><label class="m-r-5 m-t-5">SO<sub>2 </sub> </label>
							<input type="checkbox" value="no2" v-model="querypollutionType"><label class="m-r-5 m-t-5">NO<sub>2 </sub> </label>
							<input type="checkbox" value="co" v-model="querypollutionType"><label class="m-r-5 m-t-5">CO </label>
							<input type="checkbox" value="o3" v-model="querypollutionType"><label class="m-r-5 m-t-5">O<sub>3 </sub> </label>
							<input type="checkbox" value="o3H8" v-model="querypollutionType"><label class="m-r-5 m-t-5">O<sub>3</sub>_8H</label>
							<input type="checkbox" value="temperatureOut" v-model="querypollutionType"><label class="m-r-5 m-t-5">温度 </label>
							<input type="checkbox" value="humidityOut" v-model="querypollutionType"><label class="m-r-5 m-t-5">湿度 </label>
							<input type="checkbox" value="windPower" v-model="querypollutionType"><label class="m-r-5 m-t-5">风力 </label>
							<input type="checkbox" value="windDirection" v-model="querypollutionType"><label class="m-r-5 m-t-5">风向 </label>
							<input type="checkbox" value="pressure" v-model="querypollutionType"><label class="m-r-5 m-t-5">气压 </label>
							<input type="checkbox" value="vocs" v-model="querypollutionType"><label class="m-r-5 m-t-5">TVOC </label>

						</div>

						<div class="form-group pull-right">
							<div class="export_searchBtn pull-right m-l-5">
								<%--<sec:authorize access="hasRole('ROLE_FUN_008_003_001')">--%>
								<button type="button" class="btn btn-md btn-info" id="exportExcel" disabled="disabled" @click="exportExcel('excel')">导出Excel
                            </button>
								<button type="button" class="btn btn-md btn-info" id="exportCvs" disabled="disabled" @click="exportExcel('csv')">导出CSV
                            </button>
								<%--</sec:authorize>--%>
							</div>
							<button type="button" class="btn btn-md btn-info pull-right" @click="search">查询</button>
						</div>
					</div>
				</form>
			</div>			
			<div class="clear m-t-10 bgf pd10">
				<div class="table-responsive">
					<div class="dataTables_wrapper">						
						<!-- 列表开始 -->
						<div class="clear">
							<div class="vuetable-wrapper">
								<vuetable v-ref:vuetable api-url="" pagination-path="" :fields="fields" :append-params="params" :per-page="perPage" table-class="table table-bordered table-striped table-hover" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" isLoadding="true" loading-class="loading"></vuetable>
							</div>
						</div>
						<!-- 列表结束 -->
					</div>
				</div>
				<a class="dn" id="dowload" href="{{fileDownloadUrl}}">点击下载</a>
			</div>
		</div>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
		<script type="text/javascript" src="../../resources/js/statistics/dataOutput.js"></script>
	</body>

</html>