

<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 项目管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<%@include file="../../includeVue.html" %>
		<link rel="stylesheet" href="../../resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css">
		<script type="text/javascript" src="../../resources/js/common/common.js"></script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div class="p-t-10 ovh table-scroll" id="app">
			<div class="zTreeDemoBackground col-sm-3 p-l-10">
				<div class="panel panel-white">
					<div class="panel-heading bgf">
						<h3 class="panel-title">组织结构
                    <i class="pull-right fsn g3ba7f9 cursor-p" @click="showAllorg">查看全部</i>
                </h3>
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
			<div class="col-sm-9 p-r-10">
				<!--检索条件开始-->
				<div class="top-search-container">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-l-10 m-r-5">名称</label>
							<input type="text" placeholder="请输入名称" class="form-control" v-model="searchNm">
						</div>
						<div class="form-group pull-right">
							<button class="btn btn-info" @click="search">查询</button>
						</div>
					</div>
				</div>
				<!--检索条件结束-->
				<!--检索结果开始-->
				<div class="m-t-10 bgf ovh">
					<div class="p-t-5 p-b-5 p-l-10 table-head">
						<button v-if="'ROLE_FUN_103_03_01' in allFunctions" class="btn btn-info m-r-10" @click="addPject">新增</button>
						<button v-if="'ROLE_FUN_103_03_02' in allFunctions" class="btn btn-danger" @click="delPject">批量删除</button>
					</div>
					<div class="table-responsive" style="height: 500px">
						<vuetable ref="vuetable" api-url="${backendApiPath}/sysproject/getSysProjectPage" :fields="fields" :selected-to="selectedTo" :table-height="tableHeight" :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" pagination-path="pagination" @vuetable:load-success="onLoadSuccess" @vuetable:pagination-data="onPaginationData" @vuetable:loading="showLoader" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave" @vuetable:loaded="hideLoader">
						</vuetable>
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
		<script type="text/javascript" src="../../resources/js/system/sys/project_manager.js"></script>
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