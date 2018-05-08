
<%@include file="../includeJsCss.html" %>
<html lang="en">

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 站点日历</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/extension/dataTool.min.js"></script>
	</head>

	<body>
		<%@include file="../V1/topMenu.html" %>
		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-5"><font color="red">*</font>时间</label>
						<input type="text" class="form-control  Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" id="startTime" name="startTime" placeholder="DateTime">
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5"><font color="red">*</font>设备类型</label>
						<select class="form-control" id="s_stech_type">
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">站点类型</label>
						<select class="form-control" id="station_type">
						</select>
					</div>
					<div class="form-group">
						<label for="conType" class="m-l-20 m-r-10"><font color="red">*</font>污染物</label>
						<select class="form-control" name="account" id="conType">
							<option value="aqi">AQI</option>
							<option value="pm25" selected="selected">PM25</option>
						</select>
					</div>
					<div class="pull-right">
						<input type="button" class="btn btn-info pull-right" value="查询" onclick="requestStationTable()">
					</div>
				</div>
			</div>
			<div id="fs" class="m-t-10 bgf">
				<div class="col-md-10 m-t-10">
					<div id="level_table_title" class="row text-center lh200 m-b-10 f-s-16"></div>
				</div>
				<div class="btn-group pull-right m-t-10">
					<button type="button" class="btn btn-info" id="concentration">污染浓度</button>
					<button type="button" class="btn btn-white" id="contribution">贡献率</button>
				</div>
				<div class="magin10">
					<div class="xhideyauto" style="width: 100%;" id="calecObj01">
						<table border="0" cellpadding="0" cellspacing="0" class="table table-bordered">
							<tbody id="level_table" class="t-l-num text-center"></tbody>
						</table>
					</div>

				</div>
			</div>
		</div>
		<a href="javascript:;" class="btn btn-icon btn-circle btn-success btn-scroll-to-top fade" data-click="scroll-top"><i class="fa fa-angle-up"></i></a>
		<script type="text/javascript" src="${ctx }/resources/js/analysis/station_day_statics.js"></script>
		<script type="text/javascript" src="${ctx }/resources/js/analysis/statics_common.js"></script>
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
		<script type="text/javascript">
			//计算左右树与右侧的表格对齐
			calcOverflowH(0, 'calecObj01', 200);
			window.onresize = function() {
				calcOverflowH(0, 'calecObj02', 200);
			}
		</script>
	</body>

</html>