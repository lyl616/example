
<%@include file="../../includeVue.html" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 用户管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table2.css">
		<link rel="stylesheet" href="../../resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css">
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div class="f-s-12 ovh p-t-10 table-scroll" id="app">
			<div class="zTreeDemoBackground col-sm-3 p-l-10">
				<div class="panel panel-white">
					<div class="panel-heading bgf">
						<h3 class="panel-title">组织结构
                    <i class="pull-right fsn g3ba7f9 cursor-p" @click="showAllUsers">查看全部</i></h3>
					</div>
					<div class="panel-body">
						<div class="tab-content XhideYauto" id="calecObj01">
							<!--按组查询开始-->
							<div id="searchGp" class="tab-pane active">
								<ul class="ztree" id="user_org_tree">
								</ul>
							</div>

						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-9 p-r-10">
				<!--检索条件开始-->
				<div class="top-search-container">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-l-20 m-r-5">角色</label>
							<select class="form-control" v-model="seaUser.roleId">
								<option value="">请选择</option>
								<option v-for="item in roleList" :value="item.id">{{item.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">姓名</label>
							<input type="text" placeholder="请输入姓名" class="form-control" v-model="seaUser.fullName">
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">登录名</label>
							<input type="text" placeholder="请输入登录名" v-model="seaUser.userName" class="form-control">
						</div>
						<div class="form-group pull-right">
							<input type="button" class="btn btn-info pull-right" value="搜索" @click="userSearch">
						</div>
					</div>
				</div>
				<!--检索条件结束-->
				<!--检索结果开始-->
				<div class="m-t-10 xhideyauto bgf">
					<div class="table-head bgf ovh p-t-5 p-b-5 p-l-10">
						<button v-if="'ROLE_FUN_103_02_02' in allFunctions" class="btn btn-info m-r-8" @click="addUser">新增</button>
						<button v-if="'ROLE_FUN_103_02_01' in allFunctions" class="btn btn-danger m-r-8" @click="deleteUserByIds">批量删除</button>
						<button v-if="'ROLE_FUN_103_02_06' in allFunctions" class="btn btn-warning" @click="updUserPwd">密码重置</button>
					</div>
					<div class="clear table-responsive ">
						<vuetable ref="vuetable" api-url="${coreApiPath}/sysuser/page" :fields="fields" :table-height="tableHeight" :sort-order="sortOrder" :per-page="perPage" :fill-form="fillForm2" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" pagination-path="pagination" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave"></vuetable>
						<div class="vuetable-pagination">
							<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
							<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
						</div>
					</div>
				</div>
				<!--检索结果开始-->
			</div>
		</div>

		<script type="text/javascript" src="../../resources/plugins/ztree/js/jquery.ztree.all.js"></script>

		<script type="text/javascript" src="../../resources/js/system/sys/user_manager.js"></script>
		<script>
			$(document).ready(function() {
				$(window).resize(function() {
					calcOverflowH(0, "calecObj01", 130);
				});
			});
			calcOverflowH(0, "calecObj01", 130);
			$(document).ready(function() {
			    $(window).resize(function() {
			        calcOverflowH(1, "table-scroll", 40);
			    });
			});
			calcOverflowH(1, "table-scroll", 40);
		</script>
	</body>

	<div id="resetPwdModal" style="display: none; overflow: hidden;">
		<div class="modal-body">
			<form class="form-horizontal" id="resetPwdModalForm" method="post">
				<div class="form-group m-b-10">
					<label for="reset_pwd_new" class="m-r-5 form-label text-right">新密码</label>
					<input type="password" class="form-control w200" name="reset_pwd" id="reset_pwd_new">
				</div>
				<div class="form-group m-b-10">
					<label for="reset_pwd_confirm" class="m-r-5 form-label text-right">确认新密码</label>
					<input type="password" class="form-control  w200" name="reset_pwd_confirm" id="reset_pwd_confirm">
				</div>
				<div class="form-group text-center">
					<button type="button" class="btn btn-info" onclick="resetPwd()">确认重置</button>
					<button type="button" class="btn btn-white" onclick="closeRetPwdModal()">关闭</button>
				</div>
			</form>

		</div>
	</div>

</html>