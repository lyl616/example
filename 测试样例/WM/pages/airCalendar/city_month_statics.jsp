<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../includeJsCss.jsp" %>
<html lang="en">

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 城市月历</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
	</head>

	<body class="ovh">
		<%@include file="../V1/topMenu.jsp" %>
		<div class="pd10 table-scroll">
			<div id="con">
				<div class="top-search-container">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-r-5 m-l-10">年月</label>
							<input type="text" class="form-control  Wdate" onfocus="WdatePicker({dateFmt:'yyyy'})" id="startTime" name="startTime" placeholder="Date Start">
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5"><font color="red">*</font>设备类型</label>
							<select class="form-control" id="s_stech_type">
							</select>
						</div>
						<div class="form-group">
							<label for="station_type" class="m-r-5 m-l-20"><font color="red">*</font>站点类型</label>
							<select class="form-control" name="station_type" id="station_type"></select>
						</div>						
						<div class="form-group">
							<label class="m-r-5 m-l-20">污染物</label>
							<select id="pollution_type" class="form-control ">
								<option value="aqi">AQI</option>
								<option value="pm25" selected="selected">PM25</option>
							</select>
						</div>
						<div class="pull-right">
							<input type="button" class="btn btn-md btn-info  pull-right" onclick="queryCalendar()" value="查询">
							<input type="hidden" class="form-control" id="stationIds" placeholder="站点编号" />
						</div>
					</div>
				</div>
			</div>
			<div class="bgf m-t-10">
				<div id="rili">
					<div id="MyTable" class="xhideyauto">
						<table border="0" cellpadding="0" cellspacing="0" class="table">
							<tbody>
								<tr>
									<td class="level-hour-nbd ">
										<ul class="tableUl" style="margin-top: 48px;">
											<li>1</li>
											<li>2</li>
											<li>3</li>
											<li>4</li>
											<li>5</li>
											<li>6</li>
											<li>7</li>
											<li>8</li>
											<li>9</li>
											<li>10</li>
											<li>11</li>
											<li>12</li>
										</ul>
									</td>
									<td style="padding-right: 5px;">
										<table border="0" cellpadding="0" cellspacing="0" style="overflow-x: hidden; border-collapse: collapse; border: none; width: 100%; height: 100%;">
											<tbody>
												<tr>
													<td colspan="31" id="tab-title00" class="f-s-16 tc" style="height: 50px;">
														<div class="col-md-10">
															<div id="tab-title" class="row text-center lh200 m-b-10 f-s-14"></div>
														</div>
														<div class="btn-group pull-right">
															<button type="button" class="btn btn-info" id="concentration">污染浓度</button>
															<button type="button" class="btn btn-white" id="contribution">贡献率</button>
														</div>
													</td>
												</tr>
												<tr id="tr1">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr2">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr3">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr4">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr5">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr6">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr7">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr8">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr9">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr10">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr11">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr id="tr12">
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
													<td class="tdHour"></td>
												</tr>
												<tr style="font-size: 13px;">
													<td style="text-align: center;">1</td>
													<td style="text-align: center;">2</td>
													<td style="text-align: center;">3</td>
													<td style="text-align: center;">4</td>
													<td style="text-align: center;">5</td>
													<td style="text-align: center;">6</td>
													<td style="text-align: center;">7</td>
													<td style="text-align: center;">8</td>
													<td style="text-align: center;">9</td>
													<td style="text-align: center;">10</td>
													<td style="text-align: center;">11</td>
													<td style="text-align: center;">12</td>
													<td style="text-align: center;">13</td>
													<td style="text-align: center;">14</td>
													<td style="text-align: center;">15</td>
													<td style="text-align: center;">16</td>
													<td style="text-align: center;">17</td>
													<td style="text-align: center;">18</td>
													<td style="text-align: center;">19</td>
													<td style="text-align: center;">20</td>
													<td style="text-align: center;">21</td>
													<td style="text-align: center;">22</td>
													<td style="text-align: center;">23</td>
													<td style="text-align: center;">24</td>
													<td style="text-align: center;">25</td>
													<td style="text-align: center;">26</td>
													<td style="text-align: center;">27</td>
													<td style="text-align: center;">28</td>
													<td style="text-align: center;">29</td>
													<td style="text-align: center;">30</td>
													<td style="text-align: center;">31</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div id="cellModal" class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-hidden="false">
			<div class="modal-dialog modal-md">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
						<div class="f-s-14">
							<span id="span1"></span>
						</div>
						<h4 class="modal-title" id="cell_title"></h4>
					</div>
					<div id="cell_charts" class="m-t-15" style="width: 598px; height: 316px;"></div>
				</div>
			</div>
		</div>

		<script type="text/javascript" src="${ctx }/resources/js/analysis/city_month_statics.js"></script>
		<script type="text/javascript" src="${ctx }/resources/js/analysis/statics_common.js"></script>
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