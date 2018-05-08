
<%@include file="../include.html" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 设备故障</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="../../resources/css/style.min.css" rel="stylesheet" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="../../resources/js/system/equipment/equFault.js"></script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div class="pd10 table-scroll">
			<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd HH:mm:ss" />
			<!--搜索条开始-->
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<div class="input-group input-daterange">
							<input class="form-control Wdate w150" id="startTime" name="start" placeholder="开始时间" type="text">
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input class="form-control Wdate w150" id="endTime" name="end" placeholder="结束时间" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">监测点编号</label>
						<input type="text" class="form-control" id="stationId" placeholder="请输入监测点编号" />
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">项目</label>
						<select class="form-control" id="option_project">
						</select>
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-md btn-info pull-right" onclick="search()" value="搜索" />
					</div>
				</div>
			</div>
			<!--搜索条结束-->
			<div class="m-t-10 bgf chunk-set">
				<div class="table-responsive">
					<table id="tabequFaultList" class="table table-striped table-bordered customselt" cellspacing="0" width="100%">
					</table>
				</div>
			</div>

		</div>
		<!-- 设备状态列表 模态框（Modal） -->
		<div class="modal fade" id="equFaultModal" tabindex="-1" role="dialog" aria-labelledby="equFaultlLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 850px">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="equFaultlLabel">查看设备故障历史记录列表</h4>
					</div>
					<div class="modal-body form-horizontal">
						<div class="form-inline form-group">
							<div class="col-lg-12 col-sm-12 col-xs-12">
								<table id="equFaultDtTable" class="table table-bordered table-striped table-hover customselt2">
								</table>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>
		<script type="text/javascript">
			$(function() {
				gettabequFaultListPage();
			});
		</script>
		<script type="text/javascript">
			//计算左右树与右侧的表格对齐
			calcOverflowH(0, 'scrollObj', 140);
			window.onresize = function() {
				calcOverflowH(0, 'scrollObj', 140);
			}
			$(document).ready(function() {
			    $(window).resize(function() {
			        calcOverflowH(1, "table-scroll", 40);
			    });
			});
			calcOverflowH(1, "table-scroll", 40);
		</script>
	</body>

</html>