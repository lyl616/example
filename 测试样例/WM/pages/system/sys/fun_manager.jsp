<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../include.jsp" %>
<!DOCTYPE html>
<html lang="en">

	<head>
		<title>蛙鸣科技 | 模块管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="${ctx }/resources/js/common/common.js"></script>
		<script src="${ctx}/resources/plugins/vue/vue-2.5.9.min.js"></script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div id="content" class=" table-scroll">
			<div class="f-s-12 ovh m-t-10">
				<div class="zTreeDemoBackground col-sm-3">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">按模块查询</h3>
						</div>
						<div class="panel-body XhideYauto" id="calecObj01">
							<ul id="treeDemo" class="ztree list-group"></ul>
						</div>
					</div>
				</div>
				<div class="table-responsive col-sm-9">
					<!-- begin breadcrumb -->
					<div class="top-search-container m-b-10 bgf">
						<div class="form-inline">
							<div class="form-group">
								<label class="m-l-10 m-r-10">功能名称</label>
								<input type="text" placeholder="功能名称" id="searchName" class="form-control" />
							</div>
							<div class="form-group pull-right">
								<input type="button" class="btn btn-md btn-info pull-right" value="搜索" onclick="searchFunData()">
							</div>
						</div>
					</div>
					<div id="calecObj02" class="bgf" style="overflow: hidden">
						<table id="tab" class="table table-striped table-hover table-bordered customselt" cellspacing="0" width="100%">
						</table>
					</div>
				</div>

			</div>
		</div>

		<!--关系开始-->
		<div class="modal fade" id="relation" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" role="document" style="width: 700px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" onclick="closeModal(),cleanForm()" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
						<div class="modal-title">对应关系管理</div>
					</div>
					<div class="modal-body">
						<ul class="nav nav-tabs">
							<li class="active">
								<a class="tab" data-toggle="tab" href="#includeGroup" aria-expanded="true">所属组</a>
							</li>
							<li class="">
								<a class="tab" data-toggle="tab" href="#includerole" aria-expanded="true">所属角色</a>
							</li>
							<li class="">
								<a class="tab" data-toggle="tab" href="#includepeople" aria-expanded="true">包含成员</a>
							</li>
						</ul>
						<div class="tab-content m-t-20 ovh">
							<div id="includeGroup" class="tab-pane active">
								<!--包含组开始-->
								<form role="form" method="post">
									<!-- 	用户所属组start   -->
									<div class="col-md-12">
										<div class="panel panel-default">
											<div class="panel-body h300nox">
												<!--角色树形菜单start-->
												<!--此处使用原来的组管理样式 ，把原来的功能移过来-->
												<ul id="treeForGroup" class="ztree"></ul>
												<!--角色 树形菜单end-->
											</div>
										</div>
									</div>
									<!-- 	用户所属组end   -->
									<div class="col-md-12 text-center">
										<!-- 										<button type="button" class="btn btn-primary">保存</button> -->
										<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
									</div>
								</form>
								<!--包含组结束-->
							</div>
							<div id="includerole" class="tab-pane">
								<!--包含角色开始-->
								<form role="form" method="post">
									<!-- 	用户所属组start   -->
									<div class="col-md-12">
										<div class="panel panel-default">
											<div class="panel-body h300nox">
												<ul class="list-group" id="roleUl">
												</ul>
											</div>

										</div>
									</div>

									<div class="col-md-12 text-center">
										<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
									</div>
								</form>
								<!--包含角色结束-->
							</div>
							<div id="includepeople" class="tab-pane">
								<!--包含成员开始-->
								<form role="form" method="post">
									<!-- 	用户所属组start   -->
									<div class="col-md-12">
										<div class="panel panel-default">
											<div class="panel-body h300nox">
												<ul class="list-group" id="userUl">
												</ul>
											</div>
										</div>
									</div>
									<!-- 	用户所属组end   -->
									<div class="col-md-12 text-center">
										<!-- 										<button type="button" class="btn btn-primary">保存</button> -->
										<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
									</div>
								</form>
								<!--包含成员结束-->
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>

		<!--关系结束-->
		<!-- 新增开始 -->
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" role="document" style="width: 600px;">
				<div class="modal-content">

					<div class="modal-header">
						<button type="button" class="close" onclick="closeModal(),clean_from()" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
						<div class="modal-title" id="myModalLabel">功能管理 / 新增功能</div>
					</div>
					<div class="modal-body">
						<div class="tab-content">
							<div id="newInfo" class="tab-pane active">
								<form class="form-horizontal" role="form" id="sysFunAddFrom">
									<div class="col-sm-6">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="parentName">父级模块</label>
											<input type="text" class="form-control" id="parentName" name="parentName" readonly placeholder="" onclick="showMenu(); return false;" value="作为根功能">
											<input type="hidden" id="parentId" name="parentId" placeholder="" value="-1">
											<div id="menuContent" class="menuContent user-m-dropmenu dn h200 xhideyauto" style="left: 100px;">
												<ul id="treeForAdd" class="ztree"></ul>
											</div>
										</div>
									</div>
									<div class="col-sm-6">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="orderNo">功能序号</label>
											<input type="text" class="form-control" id="orderNo" name="orderNo" placeholder="请输入功能序号" onblur="validate(this)">
										</div>
									</div>
									<div class="col-sm-6 m-t-10">
										<div class="form-group">
											<div class="appendId"></div>
											<label class="m-r-5 form-label text-right" for="functionName">功能名称</label>
											<input type="text" class="form-control" id="functionName" name="functionName" placeholder="请输入功能名称">
										</div>
									</div>
									<div class="col-sm-6 m-t-10">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="code">功能code</label>
											<input type="text" class="form-control" id="code" name="code" placeholder="必须以ROLE_FUN_ 开头" onblur="validateCode(this)">
										</div>
									</div>
									<div class="col-sm-6 m-t-10">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="functionType">功能类型</label>
											<select class="form-control" name="functionType" id="functionType">
											</select>

										</div>
									</div>
									<div class="col-sm-6 m-t-10">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="functionModule">功能模块</label>
											<input type="text" class="form-control" id="functionModule" name="functionModule" placeholder="请输入功能模块">
										</div>
									</div>
									<div class="col-sm-6 m-t-10">
										<div class="form-group">
											<label class="m-r-5 form-label text-right" for="functionUrl">功能路径</label>
											<input type="text" class="form-control" disabled="disabled" id="functionUrl" name="functionUrl" placeholder="请输入功能路径">
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="clear"></div>
					<div class="modal-footer m-t-10">
						<div class="col-md-12 text-center">
							<button type="button" class="btn btn-info" onclick="saveOrUpdateFun('save')" id="saveBtn">保存
                    </button>
							<button type="button" class="btn btn-white" data-dismiss="modal" onclick="closeModal(),clean_from()">关闭
                    </button>
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
							<button type="button" class="btn btn-info" id="delSubmit">确认</button>
						</div>
					</div>
				</div>
			</form>
		</div>

		<script type="text/javascript" src="${ctx}/resources/js/system/sys/sysFun.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/funTreeForAdd.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/common/dictionary.js"></script>
		<script type="text/javascript">
			//计算左右树与右侧的表格对齐
			calcOverflowH(0, 'calecObj01', 130);
			window.onresize = function() {
				calcOverflowH(0, 'calecObj01', 130);
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