<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeVue.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 角色管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<script>
			sessionStorage.setItem("tag", "1");
			sessionStorage.setItem("path", "role");
			$(document).ready(function() {
                $(window).resize(function() {
                    calcOverflowH(1, "table-scroll", 40);
                });
            });
            calcOverflowH(1, "table-scroll", 40);
		</script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="f-s-12 pd10 table-scroll" id="app">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-r-10">名称</label>
						<input type="text" placeholder="请输入名称" id="searchName" class="form-control" v-model="seaSysRole.name">
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-info pull-right" value="搜索" @click="sysRoleSearch">
					</div>
				</div>
			</div>
			
				<div class="table-head p-l-10 p-t-5 p-b-5 m-t-10 bgf">
					<button v-if="'ROLE_FUN_103_04_02' in allFunctions" class="btn btn-info m-r-10" @click="addSysRole">新增</button>
					<button v-if="'ROLE_FUN_103_04_01' in allFunctions" class="btn btn-danger" @click="deleteRoles">批量删除</button>
				</div>
				<div class="clear table-responsive bgf">
					<vuetable ref="vuetable" api-url="${coreApiPath}/role/getAllRolesPage" :fields="fields" :table-height="tableHeight" :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" pagination-path="pagination" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave">
					</vuetable>
					<div class="vuetable-pagination">
						<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
						<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
					</div>
				</div>
			
			<script type="text/javascript" src="${ctx}/resources/js/system/sys/role_manager.js"></script>
		</div>
	</body>

</html>