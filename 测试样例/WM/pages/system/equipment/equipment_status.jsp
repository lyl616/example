<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@include file="../includeJsCss.jsp"%> --%>
<%@include file="../include.jsp"%>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 设备状态</title>		
		<link href="${ctx}/resources/css/style.min.css" rel="stylesheet" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<!--搜索条开始-->
		<div class="pd10 table-scroll">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-r-5">监测点编号</label>
						<input type="text" id="stationId" class="form-control" placeholder="请输入监测点编号" />
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">项目</label>
						<select class="form-control" id="option_project">
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">设备状态</label>
						<select class="form-control" id="station_status">
						</select>
					</div>					
					<div class="form-group pull-right">
						<button type="button" class="btn btn-md btn-info pull-right" onclick="search()">搜索</button>
					</div>
				</div>
			</div>
			<!--搜索条结束-->
			<div class="m-t-10 bgf chunk-set">
				<div class="table-responsive">
					<table id="tabEquimentnList" class="table table-striped table-bordered customselt" cellspacing="0" width="100%">
					</table>
				</div>
			</div>
		</div>

		<!-- 模态框（Modal） -->
		<div class="modal fade" id="equipModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 800px">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="myModalLabel">查看设备状态</h4>
					</div>
					<div class="modal-body form-horizontal">
						<div class="form-inline form-group">
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtFullName">IP</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="ip" />
								</div>
							</div>
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtHomeTel">port</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="port">
								</div>
							</div>
						</div>
						<div class="form-inline form-group">
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtFullName">终端SIM号</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="20152330" />
								</div>
							</div>
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtHomeTel">正常上传间隔</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="200秒">
								</div>
							</div>
						</div>
						<div class="form-inline form-group">
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtFullName">低功耗上传间隔</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="ip" />
								</div>
							</div>
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtHomeTel">pm2.5设备</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="pm2.5设备">
								</div>
							</div>
						</div>

						<div class="form-inline form-group">
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtFullName">短信号码</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="号码1" />
								</div>
							</div>
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtHomeTel">pm2.5主备</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="port">
								</div>
							</div>
						</div>

						<div class="form-inline form-group">
							<div class="col-lg-6 col-sm-8 col-xs-8">
								<div class="col-md-5 control-label" for="txtFullName">文件配置号</div>
								<div class="col-md-7">
									<input type="text" class="form-control required" value="字符串号码" />
								</div>
							</div>
						</div>
						<div class="form-inline form-group">
							<div class="col-lg-12 col-sm-12 col-xs-12">
								<table id="KBTable" class="table table-bordered table-striped table-hover customselt2">
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

		<script type="text/javascript" src="${ctx}/resources/plugins/DataTables/config/datatable_common.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/equipment/equipment_status.js"></script>
		<script type="text/javascript">
			$(function() {
				getEquipmentsPage();
			});
			$(document).ready(function() {
			    $(window).resize(function() {
			        calcOverflowH(1, "table-scroll", 40);
			    });
			});
			calcOverflowH(1, "table-scroll", 40);
		</script>
		
	</body>

</html>