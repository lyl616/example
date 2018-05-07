<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeVue.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 组织管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx}/resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css" />
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="f-s-12 ovh p-t-10 table-scroll" id="app">
			<div class="zTreeDemoBackground col-sm-3 p-l-10">
				<div class="panel panel-white">
					<div class="panel-heading bgf">
						<h3 class="panel-title">组织结构
                    <i class="pull-right fsn g3ba7f9 cursor-p" @click="showAllSysOrgs">查看全部</i></h3>
					</div>
					<div class="panel-body">
						<div class="tab-content XhideYauto" id="calecObj01">
							<!--按组查询开始-->
							<div class="tab-pane active">
								<ul class="ztree" id="user_project_tree">

								</ul>
							</div>

						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-9 table-scroll">
				<!--检索条件开始-->
				<div class="top-search-container">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-l-10 m-r-5">名称</label>
							<input type="text" placeholder="请输入名称" class="form-control" v-model="seaSysOrg.name">
						</div>
						<div class="form-group pull-right">
							<button class="btn btn-info" @click="sysOrgSearch">查询</button>
						</div>
					</div>
				</div>
				<!--检索条件结束-->
				<!--检索结果开始-->
				<div class="m-t-10">
					<div class="table-head bgf ovh p-t-5 p-b-5 p-l-10">
						<button v-if="'ROLE_FUN_103_01_01' in allFunctions" class="btn btn-info m-r-10" @click="addSysOrg">新增</button>
						<button v-if="'ROLE_FUN_103_01_03' in allFunctions" class="btn btn-danger" @click="deleteOrgs">批量删除</button>
					</div>
					<div class="clear table-responsive bgf" id="calecObj02">
						<vuetable ref="vuetable" api-url="${backendApiPath}/sysorg/getSysOrgPage" http-method="post" :fields="fields" :table-height="tableHeight" pagination-path="pagination" :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess" @vuetable:loading="showLoader" @vuetable:loaded="hideLoader" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave" @vuetable:initialized="onInitialized">
						</vuetable>
						<div class="vuetable-pagination p-b-10">
							<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
							<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
						</div>
					</div>
				</div>
				<!--检索结果开始-->
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/plugins/ztree/js/jquery.ztree.all.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/organize_manager.js"></script>
		<script>
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