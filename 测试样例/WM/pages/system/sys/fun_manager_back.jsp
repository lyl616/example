<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../include.html" %>
<!DOCTYPE html>
<html lang="en">

	<head>
		<title>模块管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script>
			sessionStorage.setItem("tag", "1");
			sessionStorage.setItem("path", "fun");
		</script>
	</head>
	<body class="ovh">
	<%@ include file="../../V1/topMenu.html" %>
		<div id="content" class="table-scroll">
			<!-- begin breadcrumb -->
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-10">功能名称</label>
						<input type="text" placeholder="功能名称" class="form-control" />
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-md btn-info pull-right" value="搜索" onclick="queryWeatherChars()">
					</div>
				</div>
			</div>
			
			<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_04_01')">--%>
				<input type="hidden" id="delAllBtn" value="1" />
			<%--</sec:authorize>--%>
			<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_04_02')">--%>
				<input type="hidden" id="addBtn" value="1" />
			<%--</sec:authorize>--%>
			<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_04_03')">--%>
				<input type="hidden" id="delBtn" value="1" />
			<%--</sec:authorize>--%>
			<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_04_04')">--%>
				<input type="hidden" id="updateBtn" value="1" />
			<%--</sec:authorize>--%>
			<div class="f-s-12 magin10 bgf pd10 ovh">
				<div class="zTreeDemoBackground col-sm-3">
					<div class="panel panel-success">
				      <div class="panel-heading">
				        <h3 class="panel-title">按模块查询</h3>
				      </div>
				      <div class="panel-body">
							<ul id="treeDemo" class="ztree list-group"></ul>
					  </div>
					</div>
				</div>
				<div class="table-responsive col-sm-9">
					<table id="tab" class="table table-striped table-bordered" cellspacing="0" width="100%">
						<thead>
							<tr>
								<th><input type="checkbox" name="allChecked" /></th>
								<th>功能名称</th>							
								<th>功能代码</th>							
								<th>功能等级</th>
								<th>功能类型</th>
								<th>功能URL</th>								
								<th>操作</th>
							</tr>
						</thead>
					</table>
				</div>

			</div>
		</div>
	</body>
	<!-- 新增开始 -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="document" style="width: 700px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal(),cleanForm()">
					<span aria-hidden="true">&times;</span>
				</button>
					<div class="modal-title" id="myModalLabel">功能管理 / 新增功能</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" role="form" id="sysFunAddFrom">
							<div class="form-group">
								<div class="appendId"></div>							
								<label class="col-sm-2 control-label" for="functionName">功能名称</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="functionName" name="functionName" placeholder="请输入功能名称">
								</div>
								<label class="col-sm-2 control-label" for="code">功能code</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="code" name="code" placeholder="请输入功能code" onblur="validateCode(this)">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="functionType">功能类型</label>
									<div class="col-sm-4">
<!-- 									<input type="text" class="form-control" id="functionType" name="functionType" placeholder="请输入功能类型"> -->
										<select class="form-control" name="functionType" id="functionType">
											<option value="菜单" selected="selected">菜单</option>
											<option value="路径">路径</option>
											<option value="按钮">按钮</option>
											<option value="restFul">restFul</option>
										</select>
									</div>
								<label class="col-sm-2 control-label" for="functionLevel">功能等级</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="functionLevel" name="functionLevel" placeholder="请输入功能级别" onblur="validate(this)">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="functionModule">功能模块</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="functionModule" name="functionModule" placeholder="请输入功能模块">
								</div>
								<label class="col-sm-2 control-label" for="functionUrl">功能路径</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="functionUrl" name="functionUrl" placeholder="请输入功能路径">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="parentName">父级模块</label>
								<div class="col-sm-4">

									<input type="text" class="form-control" id="parentName" name="parentName" readonly placeholder="" onclick="showMenu(); return false;" value="作为根功能">
									<input type="hidden" class="form-control" id="parentId" name="parentId" placeholder="" value="-1">
									<div id="menuContent" class="menuContent user-m-dropmenu" style="display:none;">
										<ul id="treeForAdd" class="ztree"></ul>
									</div>
								</div>
								<label class="col-sm-2 control-label" for="orderNo">功能序号</label>
								<div class="col-sm-4">
									<input type="text" class="form-control" id="orderNo" name="orderNo" placeholder="请输入功能序号" onblur="validate(this)">
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" onclick="saveOrUpdateFun('save')" id="saveBtn">保存</button>
						<button type="button" class="btn btn-white" data-dismiss="modal" onclick="closeModal(),cleanForm()">关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
		<!-- 新增结束 -->
		<!--单个删除确认对话框-->
		<div class="modal fade" id="deleteOneModal" tabindex="-1" role="dialog" aria-labelledby="userAddModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<!-- data-backdrop="static" 禁止点击弹框后面内容 -->
			<form class="form-horizontal" role="form">
				<input type="hidden" id="functionId" name="functionId">
				<div class="modal-dialog modal-sm ">
					<!-- modal-sm 小的  modal-lg 大的 -->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" id="userAddModalLabel">提示信息</div>
						</div>
						<div class="modal-body" style="text-align: left;">
							<h5>您确定要删除当前信息吗？</h5>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
							<button type="button" class="btn btn-primary" id="delSubmit">确认</button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<script type="text/javascript">
			$(document).ready(function() {
			    $(window).resize(function() {
			        calcOverflowH(1, "table-scroll", 40);
			    });
			});
			calcOverflowH(1, "table-scroll", 40);
		</script>
</html>
<script type="text/javascript" src="../../resources/js/system/sys/sysFun.js"></script>
<script type="text/javascript" src="../../resources/js/system/sys/funTreeForAdd.js"></script>