<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../include.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 组管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script>
			sessionStorage.setItem("tag", "1");
			sessionStorage.setItem("path", "group");
		</script>

	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div id="content" class="f-s-12 ovh m-t-10">
			<!--左侧树搜索条件开始-->
			<div class="zTreeDemoBackground col-sm-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">按组查询</h3>
					</div>
					<div class="panel-body XhideYauto" id="calecObj01">
						<ul id="groupTreeForLeft" class="ztree list-group">

						</ul>
					</div>
				</div>
			</div>
			<!--左侧树搜索条件结束-->
			<div class="table-responsive col-sm-9 bgf">
				<div class="top-search-container m-t10-b10-lr0">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-l-10 m-r-10">名称</label>
							<input type="text" placeholder="名称" id="searchName" class="form-control" />
						</div>
						<div class="form-group pull-right">
							<input type="button" class="btn btn-md btn-info pull-right" value="搜索" onclick="searchGroupData()" />
						</div>
					</div>
				</div>

				<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_02_03')">--%>
				<input type="hidden" id="updateBtn" value="1" />
				<%--</sec:authorize>--%>
				<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_02_04')">--%>
				<input type="hidden" id="funBtn" value="1" />
				<%--</sec:authorize>--%>
				<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_02_05')">--%>
				<input type="hidden" id="roleBtn" value="1" />
				<%--</sec:authorize>--%>
				<div class="table-responsive">
					<div id="topPlugin" role="group" class="pull-left m-r-10">
						<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_02_01')">--%>
						<button type="button" class="btn btn-danger " onclick="del()">批量删除</button>
						<%--</sec:authorize>--%>
						<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_02_02')">--%>
						<button type="button" class="btn btn-primary  addBtn" onclick="showGroupModal()">新增</button>
						<%--</sec:authorize>--%>
					</div>
					<div id="calecObj02">
						<table id="tab" class="table table-striped table-bordered table-hover dataTables-example customselt" cellspacing="0" width="100%">

						</table>
					</div>
				</div>

			</div>
		</div>

		<!-- Modal 添加组 srart -->
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
						<div class="modal-title" id="myModalLabel">添加组</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="groupForm" method="post">
							<div class="appendId"></div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="parentIdForAdd">父级组</label>
								<div class="col-sm-4">
									<input type="text" class="form-control required" id="parentNameForAdd" name="parentName" readonly placeholder="" onclick="showMenuForAdd(); return false;" value="">
									<input type="hidden" class="form-control required" id="parentIdForAdd" name="parentId" placeholder="">
									<div id="menuContentForAdd" class="menuContent user-m-dropmenu addEditModel" style="display:none; width: 170px; height: 180px;">
										<ul id="groupTreeForAdd" class="ztree"></ul>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="name">名称</label>
								<div class="col-sm-4">
									<input type="text" class="form-control required" id="name" name="name" placeholder="请输入名称">
								</div>
							</div>

							<div class="form-group">
								<label class="col-sm-2 control-label" for="description">描述</label>
								<div class="col-sm-4">
									<input type="text" class="form-control required" id="description" name="description" placeholder="请输入描述">
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal" onclick="clean_from()">关闭</button>
						<button type="button" class="btn btn-primary" onclick="addGroup()">保存</button>
					</div>
				</div>
			</div>
		</div>
		<!-- Modal 添加组 end -->
		<!-- 分配功能Modal -->
		<div class="modal fade" id="funModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
						<div class="modal-title" id="myModalLabel2">分配功能</div>
					</div>
					<div class="modal-body">
						<form class="form-horizontal" id="assignForm" method="post">
							<input type="hidden" name="groupId" id="groupId">
							<div class="form-group">
								<label class="col-sm-2 control-label" for="menuContent">分配功能</label>
								<div class="col-sm-4">
									<input type="text" class="form-control parentName" readonly placeholder="" style="width:320px;" onclick="showMenu(); return false;">
									<input type="hidden" class="form-control parentId" name="funIds" placeholder="" value="-1">
									<div id="menuContent" class="menuContent user-m-dropmenu" style="display:none; ">
										<ul class="ztree treeForAdd"></ul>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
						<button type="button" class="btn btn-primary" onclick="addFunToGroup()">保存</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 分配角色Modal -->
		<div class="modal fade" id="roleModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
						<div class="modal-title" id="roleModalLabel">分配角色</div>
					</div>
					<div class="modal-body" style="height: 235px;">
						<form class="form-horizontal" id="assignRoleForm" method="post">
							<input type="hidden" name="groupId" id="rGroupId">
							<div class="form-group">
								<label class="col-sm-2 control-label" for="roleTree">分配角色</label>
								<div class="col-sm-4">
									<!-- 									<input type="text" class="form-control treeRoleName" readonly placeholder="" style="width:320px;" onclick="showRoleMenu(); return false;"> -->
									<input type="hidden" class="form-control treeRoleId" name="roleIds" placeholder="" value="-1">
									<div class="roleMenuContent user-m-dropmenu">
										<ul id="roleTree" class="ztree"></ul>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
						<button type="button" class="btn btn-primary" onclick="addRoleToGroup()">保存</button>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/funTreeForAllot.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/assignRole.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/group.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/groupTreeForAdd.js"></script>
		<script type="text/javascript">
			//计算左右树与右侧的表格对齐
			calcOverflowH(0, 'calecObj01', 95);
			calcOverflowH(0, 'calecObj02', 124);
			window.onresize = function() {
				calcOverflowH(0, 'calecObj01', 105);
				calcOverflowH(0, 'calecObj02', 124);
			}
		</script>
	</body>

</html>