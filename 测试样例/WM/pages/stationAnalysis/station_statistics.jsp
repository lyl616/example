
<%@include file="../includeJsCss.html" %>

<head>
	<meta charset="utf-8" />
	<title>蛙鸣科技 | 站点统计</title>

	<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
</head>

<body>
	<%@ include file="../V1/topMenu.html" %>
	<div id="cons"></div>
	<div id="areaModal" class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-hidden="false">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
					<h4 class="modal-title" id="areaModal_title"></h4>
				</div>
				<div class="modal-body">
					<div id="area_charts" style="width: 570px;height: 350px;"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="myTabContent">
		<div class="pd10" id="home">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<div class="input-group input-daterange">
							<input type="text" class="form-control Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',isShowClear:false})" id="startTime" name="start" />
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input type="text" class="form-control Wdate" onFocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',minDate:'#F{$dp.$D(\'startTime\')}',isShowClear:false})" id="endTime" name="end" />
						</div>
					</div>
					<div class="form-group">
						<select class="form-control m-l-20" id="s_concentrationType"></select>
					</div>
					<div class="form-group">						
						<div class="form-group m-l-20"><span id="total_count"></span></div>
					</div>
					<div class="form-group pull-right">
						<button type="button" id="btn_search" class="btn btn-info pull-right">查询</button>
					</div>
				</div>
			</div>
			<div id="rectangle_charts" class="m-t-10 xhideyauto" style="width: 100%;"></div>
		</div>
	</div>
	<script type="text/javascript">
		//计算左右树与右侧的表格对齐
		calcOverflowH(0, 'rectangle_charts', 200);
		window.onresize = function() {
			calcOverflowH(0, 'rectangle_charts', 200);
		}
	</script>
	<script src="../../resources/js/pollutionSource/pollution-level.js"></script>

</body>

</html>