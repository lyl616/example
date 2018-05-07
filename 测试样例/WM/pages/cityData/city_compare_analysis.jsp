<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%-- <%@include file="../system/include_statistics.jsp"%> --%>
<meta http-equiv="pragma" CONTENT="no-cache">
<meta http-equiv="Cache-Control" CONTENT="no-cache, must-revalidate">
<meta http-equiv="expires" CONTENT="Wed, 26 Feb 1997 08:21:57 GMT">
<%@include file="../includeJsCss.jsp" %>
<html lang="en">

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 城市对比分析</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="${ctx}/resources/plugins/select2/dist/css/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx}/resources/plugins/select2/dist/js/select2.full.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/select2/dist/js/i18n/zh-CN.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js "></script>
		
	</head>

	<body>
		<%@include file="../V1/topMenu.jsp" %>
		
		<input type="hidden" name="province" id="province" value="<c:out value='${auth.user.pro}'/>">
		<input type="hidden" name="city" id="city" value="<c:out value='${auth.user.city}'/>">
		<input type="hidden" value="4" id="stationType" />
		<input type="hidden" id="hidePro1" value="">
		<input type="hidden" id="hideCity1" value="">
		<input type="hidden" id="hideDistrict1" value="">
		<input type="hidden" id="hideDistrictName1" value="">
		<input type="hidden" id="hidePro2" value="">
		<input type="hidden" id="hideCity2" value="">
		<input type="hidden" id="hideDistrict2" value="">
		<input type="hidden" id="hideDistrictName2" value="">
		<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd HH" />

		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group ">
						<label class="m-r-5 m-l-10">城市</label>
						<select id="district1" class="form-control">
						</select>
						<label class="m-r-5 m-l-20">VS</label>
						<select id="district2" class="form-control">
						</select>
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-info pull-right" value="对比" onclick="showCityStationTable()" />
					</div>
				</div>
			</div>
			<div id="scrollObj" class="xhideyauto m-t-10">
				<!-- 站点统计 -->
				<div id="stationCntTavleDiv" class="bgf">
					<table id="stationCntTavle" class="table table-bordered" cellspacing="0" width="100%">
					</table>
				</div>
				<!-- 拆线趋势图开始  -->
				<div id="doubleLine_div" class="dn bgf m-t-10 ovh">
					<div class="top-search-container">
						<div class="form-inline ovh">
							<div class="form-group">
								<label class="m-r-5 m-l-10">类型</label>
								<select class="form-control" id="pollution_type">
									<option value="aqi" selected="selected">AQI</option>
									<option value="pm25">PM25</option>
									<option value="pm10">PM10</option>
									<option value="co">CO</option>
									<option value="so2">SO2</option>
									<option value="o3">O3</option>
									<option value="no2">NO2</option>
								</select>
								<label class="m-r-5 m-l-20">起止时间</label>
								<input type="text" class="form-control Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH',maxDate:'#F{$dp.$D(\'endTime\',{H:-1})||\'%y-%M-%d {%H-1}:%m\'}'})" id="startTime" name="start" placeholder="Date Start">
								<input type="text" class="form-control  Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH',minDate:'#F{$dp.$D(\'startTime\')}',maxDate:'%y-%M-%d %H:%m'})" id="endTime" name="end" placeholder="Date End">
							</div>
							<div class="form-group pull-right">
								<input type="button" class="btn btn-info pull-right" value="趋势统计" onclick="queryCityDoubline()" />
							</div>
						</div>
					</div>

					<div class="col-md-12">
						<div class="col-md-7">
							<div id="double_line_char" style="height: 250px; width: 100%;"></div>
						</div>
						<!-- 区间占比统计柱图开始  -->
						<div class="col-md-5" id="cityPercentageDiv">
							<div class="form-inline postbor">
								<div class="form-group">
									<label class="m-r-5 m-l-10">区间</label>
									<select class="form-control" id="pdata_range">
									</select>
								</div>
							</div>
							<div id="cityPercentage" style="height: 250px; width: 100%;"></div>
						</div>
						<!-- 区间占比统计结束  -->
					</div>

				</div>
				<!-- 拆线趋势图结束  -->
				<!-- 微站统计 -->
				<div id="smallStationDiv" class="dn bgf m-t-10 ovh">
					<div class="top-search-container ovh">
						<div class="form-inline">
							<div class="col-xs-6">
								<label class="m-r-5 m-l-10">设备类型</label>
								<select class="form-control" id="s_stech_type">
								</select>
							</div>
							<div class="col-xs-6">
								<label class="m-r-5 m-l-20">站点类型</label>
								<select class="form-control" id="station_type">
								</select>
								<input type="button" class="btn btn-info pull-right" value="微站统计" onclick="smallStationQuery()" />
							</div>
							<div class="clear"></div>
							<div class="form-group col-xs-6 m-t-10">
								<label id="city1Wz" class="m-r-5 m-l-10">城市二-微站</label>
								<select multiple="multiple" data-tags="true" data-placeholder="请选择站点类别" data-allow-clear="true" name="stations1" id="city1WzSel">
								</select>
							</div>
							<div class="form-group col-xs-6 m-t-10">
								<label id="city2Wz" class="m-r-5 m-l-10">城市二-微站</label>
								<select multiple="multiple" data-tags="true" data-placeholder="请选择站点类别" data-allow-clear="true" name="stations2" id="city2WzSel">
								</select>
							</div>
						</div>
					</div>
					<div class="clear"></div>
					<div class="col-xs-6">
						<div id="tendency_district1" style="height: 300px; width: 100%;"></div>
					</div>
					<div class="col-xs-6">
						<div id="tendency_district2" style="height: 300;width: 100%;"></div>
					</div>
				</div>
			</div>
		</div>
		
		<a href="javascript:;" class="btn btn-icon btn-circle btn-success btn-scroll-to-top fade" data-click="scroll-top"><i class="fa fa-angle-up"></i></a>
		<script type="text/javascript" src="${ctx }/resources/js/cityData/city_compare_analysis.js"></script>
		<script>
			$(document).ready(function() {
				$(window).resize(function() {
					calcOverflowH(0, "scrollObj", 130);
				});
			});
			calcOverflowH(0, "scrollObj", 130);
		</script>
	</body>
</html>