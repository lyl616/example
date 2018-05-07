<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../system/include.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 用户管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />

		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<!-- begin #content -->
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_01')">--%>
		<input type="hidden" id="delAllBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_02')">--%>
		<input type="hidden" id="addBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_03')">--%>
		<input type="hidden" id="updateBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_04')">--%>
		<input type="hidden" id="domainBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_05')">--%>
		<input type="hidden" id="groupBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_06')">--%>
		<input type="hidden" id="roleBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_07')">--%>
		<input type="hidden" id="delBtn" value="1" />
		<%--</sec:authorize>--%>
		<%--<sec:authorize access="hasRole('ROLE_FUN_006_01_01_08')">--%>
		<input type="hidden" id="resetPwdBtn" value="1" />
		<%--</sec:authorize>--%>
		<div class="f-s-12 ovh m-t-10">
			<div class="zTreeDemoBackground col-sm-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">按组/角色查询</h3>
					</div>
					<div class="panel-body">
						<ul class="nav nav-tabs">
							<li class="active">
								<a class="tab" data-toggle="tab" href="#searchGp" onclick="tabGPClk()" aria-expanded="false"> 按组</a>
							</li>
							<li class="">
								<a class="tab" data-toggle="tab" href="#searchRl" onclick="tabRlClk()" aria-expanded="true">按角色</a>
							</li>
						</ul>
						<div class="tab-content XhideYauto" id="calecObj01">
							<!--按组查询开始-->
							<div id="searchGp" class="tab-pane active">

								<ul class="ztree list-group" id="user_group_tree">
								</ul>
							</div>
							<!--按组查询结束-->
							<!--按角色查询开始-->
							<div id="searchRl" class="tab-pane">
								<ul class="ztree list-group" id="user_role_tree">
								</ul>
							</div>
							<!--按角色查询结束-->
						</div>
					</div>
				</div>

			</div>
			<div class="table-responsive col-sm-9 bgf">
				<!--检索条件开始-->
				<div class="top-search-container m-t10-b10-lr0">
					<div class="row form-inline">
						<div class="form-group ovh">
							<label class="m-l-10 m-r-10">姓名</label>
							<input type="text" class="form-control" placeholder="姓名" id="sea_fullName" />
						</div>
						<div class="form-group ovh">
							<label class="m-l-10 m-r-10">登录名</label>
							<input type="text" class="form-control" placeholder="登录名" id="sea_userName" />
						</div>
						<div class="form-group ovh">
							<label class="m-l-10 m-r-10">邮箱</label>
							<input type="text" class="form-control" placeholder="邮箱" id="ser_userEmail" />
						</div>
						<div class="form-group ovh pull-right">
							<input type="button" class="btn btn-md btn-info pull-right m-r-10" value="搜索" onclick="sea_userTal()" />
						</div>
					</div>
				</div>

				<!--检索条件结束-->
				<!--检索结果开始-->
				<div id="calecObj02">
					<table id="tabUserList" class="table table-striped table-bordered customselt " cellspacing="0" width="100%">
					</table>
				</div>
				<!--检索结果开始-->
			</div>
		</div>
		<!-- end #content -->
	</body>

	<!-- 用户添加 Modal begin -->
	<div class="modal fade" id="userAddModal" tabindex="-1" role="dialog" aria-labelledby="userAddModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" style="width: 777px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" onclick="closeUserAddModal()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
					<div class="modal-title" id="userAddModalLabel">用户基本信息</div>
				</div>
				<div class="modal-body ovh">
					<ul class="nav nav-tabs">
						<li class="active" id="userInfoTab">
							<a class="tab" data-toggle="tab" href="#userBaseinfo" aria-expanded="false"> 基本信息</a>
						</li>
						<li id="roleGroupInfoTab">
							<a class="tab" data-toggle="tab" href="#roleItaminfo" aria-expanded="true">所属组/角色</a>
						</li>
					</ul>
					<div class="tab-content m-t-20">
						<div id="userBaseinfo" class="tab-pane active">
							<!-- 	用户基本信息start   -->
							<form role="form" id="frmUserAdd" class="form-horizontal">
								<input type="hidden" id="optFlag" value="1" />
								<input type="hidden" id="txtUserId" name="id" value="1" />
								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtFullName">
												<span class="gf00">*</span>姓名
											</div>
											<div class="col-md-7">
												<input type="text" class="form-control required" id="txtFullName" name="fullName" placeholder="请输入姓名">
											</div>
										</div>

									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtHomeTel">性别</div>
											<div class="col-md-7 m-t-10">
												<input type="radio" name="gender" id="optionsRadios1" value="1" checked>男 <input type="radio" name="gender" id="optionsRadios2" value="2">女
											</div>
										</div>

									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtUserName">
												<span class="gf00">*</span>登录名
											</div>
											<div class="col-md-7">
												<input type="text" id="txtUserName" class="form-control required" name="userName" placeholder="请输入登录名">
											</div>
										</div>
									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtMobileno1">
												<span class="gf00">*</span>手机号
											</div>
											<div class="col-md-7">
												<input type="text" id="txtMobileno1" class="form-control required" name="mobileno1" placeholder="请输入手机号">
											</div>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtPersonalEmail">
												<span class="gf00">*</span>个人邮箱
											</div>
											<div class="col-md-7">
												<input type="text" class="form-control required email" id="txtPersonalEmail" name="personalEmail" placeholder="请输入个人邮箱" />
											</div>
										</div>
									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">
										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="workEmail">
												<span class="gf00">*</span>工作邮箱
											</div>
											<div class="col-md-7">
												<input type="text" id="txtWorkEmail" class="form-control  required email" name="workEmail" placeholder="请输入工作邮箱">
											</div>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtHomeTel">家庭电话</div>
											<div class="col-md-7">
												<input type="text" class="form-control" id="txtHomeTel" name="homeTel" placeholder="请输入家庭电话" />
											</div>
										</div>

									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtHomeAddress">家庭地址</div>
											<div class="col-md-7">
												<input type="text" class="form-control" id="txtHomeAddress" name="homeAddress" placeholder="请输入家庭地址" />
											</div>
										</div>

									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtExpcontPerson">紧急联系人</div>
											<div class="col-md-7">
												<input type="text" id="txtExpcontPerson" class="form-control" name="expcontPerson" placeholder="请输入紧急联系人">
											</div>
										</div>

									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtWorkAddress">工作地址</div>
											<div class="col-md-7">
												<input type="text" id="txtWorkAddress" class="form-control" name="workAddress" placeholder="请输入工作地址">
											</div>
										</div>

									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="txtExpcontPsnTel">紧急联系电话</div>
											<div class="col-md-7">
												<input type="text" class="form-control" id="txtExpcontPsnTel" name="expcontPsnTel" placeholder="请输入紧急联系人电话" />
											</div>
										</div>

									</div>
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh form-inline">
											<div class="col-md-5 control-label" for="txtRemark">出生地</div>
											<div class="col-md-7">
												<select onchange="initCityByProId(this.value)" class="form-control" style="width:95px;" name="pro" id="uProvince"></select>
												<select class="form-control" style="width: 95px;" name="city" id="uCity"></select>
											</div>
										</div>

									</div>
								</div>

								<div class="row">
									<div class="col-lg-6 col-sm-6 col-xs-6">

										<div class="form-group ovh">
											<div class="col-md-5 control-label" for="isBigScreen">是否大屏用户</div>
											<div class="col-md-7">
												<input type="radio" name="isBigScreen" id="isBigScreen" value="1" checked>PC <input type="radio" name="isBigScreen" id="isBigScreen2" value="2">大屏
											</div>
										</div>

									</div>
									<div class="col-lg-12 col-sm-12 col-xs-12">

										<div class="form-group ovh">
											<div class="col-md-2 control-label" for="txtRemark">备注</div>
											<div class="col-md-10 ">
												<textarea style="width: 577px;" class="form-control pull-right" id="txtRemark" name="remark" rows="3"></textarea>
											</div>
										</div>

									</div>
								</div>
							</form>
							<!-- 	用户基本信息end    -->
						</div>
						<div id="roleItaminfo" class="tab-pane">

							<!-- 	用户所属组start   -->
							<div class="col-md-6">
								<div class="panel panel-default">
									<div class="panel-heading">
										<h3 class="panel-title">所属组</h3>
									</div>
									<div class="panel-body h300nox">
										<!--组 树形菜单start-->
										<!--此处使用原来的组管理样式 ，把原来的功能移过来-->
										<ul class="ztree" id="userAdd_group_tree">
										</ul>
										<!--组 树形菜单end-->
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="panel panel-default">
									<div class="panel-heading">
										<h3 class="panel-title">所属角色</h3>
									</div>
									<div class="panel-body h300nox">
										<!--角色树形菜单start-->
										<!--此处使用原来的组管理样式 ，把原来的功能移过来-->
										<ul class="ztree" id="userAdd_role_tree">
										</ul>
										<!--角色 树形菜单end-->
									</div>
								</div>
							</div>
							<!-- 	用户所属组end   -->

						</div>
					</div>
				</div>
				<div class="modal-footer ovh">
					<div class="col-md-12 text-center">
						<button type="button" class="btn btn-primary" id="addUserRoleGpBtn" onclick="saveOrUpdate()">保存</button>
						<button type="button" class="btn btn-white" onclick="closeUserAddModal()">关闭</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 用户添加 Modal end -->

	<!--单个删除确认对话框-->
	<div class="modal fade" id="userDelModal" tabindex="-1" role="dialog" aria-labelledby="userDelModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<!-- data-data-backdrop="static" 禁止点击弹框后面内容 -->
		<form class="form-horizontal" role="form">
			<input type="hidden" id="hidUserId">
			<div class="modal-dialog modal-sm ">
				<!-- modal-sm 小的  modal-lg 大的 -->
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<div class="modal-title" id="userDelModalLabel">提示信息</div>
					</div>
					<div class="modal-body" style="text-align: left;">
						<h5>您确定要删除当前信息吗？</h5>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-primary" id="delSubmit" onclick="deleteUserByIds()">确认</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
		</form>
	</div>

	<!-- 分配省市区域Modal begin-->
	<div class="modal fade" id="doMainModal" tabindex="-1" role="dialog" aria-labelledby="doMainModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" onclick="closeDomainModal()">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
					<div class="modal-title" id="doMainModalLabel">用户管理/分配区域</div>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="assignDoMainForm" method="post">
						<input type="hidden" name="userId" id="dmUserId">
						<div class="form-group ovh">
							<label class="col-sm-2 control-label" for="domainTree">分配区域</label>
							<input type="hidden" class="form-control treeDoMainId" id="treeDoMainId" name="doMainIds" value="">
							<div class="col-sm-10">
								<ul id="domainTree" class="ztree h300nox"></ul>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-white" onclick="closeDomainModal()">关闭</button>
					<button type="button" class="btn btn-primary" id="userDomain_addBtn" onclick="addDoMainToUser()">保存</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="pwdResetModal" tabindex="-1" role="dialog" aria-labelledby="pwdResetModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog .modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" onclick="closeRestMode()">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
					<h4 class="modal-title" id="pwdResetModalLabel">用户管理/密码重置</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal" id="pwdResetForm" method="post">
						<input type="hidden" name="userId" id="reset_userId">
						<div class="form-group">
							<label for="newpass" class="col-sm-2 control-label">新密码</label>
							<div class="col-sm-10">
								<input type="password" class="form-control" name="newpass" id="newpass" placeholder="New Password">
							</div>
						</div>
						<div class="form-group">
							<label for="newpassAgain" class="col-sm-2 control-label">确认新密码</label>
							<div class="col-sm-10">
								<input type="password" class="form-control" name="newpassAgain" id="newpassAgain" placeholder="Again New Password">
							</div>
						</div>
						<div class="form-group text-center">
							<button type="button" class="btn btn-primary" id="pwdChSubmit" onclick="resetUserPwd()">确认修改
                        </button>
							<button type="button" class="btn btn-white" id="pwdChClose" onclick="closeRestMode()">关闭
                        </button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- 分配省市区域Modal end-->
	<script type="text/javascript" src="${ctx}/resources/js/system/sys/user_manager.js"></script>

	<script type="text/javascript">
		$(function() {
			getUserList();
			initRolesGroups();
		});
		//计算左右树与右侧的表格对齐
		calcOverflowH(0, 'calecObj01', 100);
		calcOverflowH(0, 'calecObj02', 102);
		window.onresize = function() {
			calcOverflowH(0, 'calecObj01', 100);
			calcOverflowH(0, 'calecObj02', 95);
		}
	</script>

</html>