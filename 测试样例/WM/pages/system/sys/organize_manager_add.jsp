

<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 组织管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<%@include file="../../includeVue.html" %>
		<link rel="stylesheet" href="../../resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css">
		<script type="text/javascript" src="../../resources/plugins/ztree/js/jquery.ztree.all.min.js"></script>
	</head>

	<body class="ovh">
		<%@ include file="../../V1/topMenu.html" %>
		<div class="f-s-12 ovh p-t-10  table-scroll" id="app">
			<div class="col-sm-12 p-r-10 p-l-10">
				<!--检索条件开始-->
				<div class="top-search-container">
					<div class="form-inline">
						<div class="form-group">
							<input id="orgId" type="hidden" value="${param.orgId}" />
							<input id="parentId" type="hidden" value="${param.pid}" />
							<input id="parentName" type="hidden" value="${param.pname}" />
							<label class="m-l-10 m-r-5"><i class="gf00 fsn">*</i>父级组织</label>
							<!--下拉树开始-->
							<div class="select-tree" style="width: 120px;">
								<input id="citySel" class="form-control" placeholder="请输入父级组织" type="text" v-model="parentOrg.name" value="" onclick="showMenu();" />
								<div class="btn-group">
									<div class="dropdown-toggle pull-right p-r-10">
										<span class="caret" id="menuBtn" onclick="showMenu();"></span>
									</div>
								</div>
							</div>
							<!--下拉树结束-->
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5"><i class="gf00 fsn">*</i>名称</label>
							<input type="text" placeholder="请输入名称" class="form-control" v-model="orgName">
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5"><i class="gf00 fsn">*</i>类型</label>
							<!-- <input type="text" placeholder="请输入类型" class="form-control" v-model="orgType"> -->
							<select placeholder="请输入" class="form-control" v-model="orgType">
								<option value="1">政府</option>
								<option value="2">企业</option>
								<option value="3">机构</option>
								<option value="4">其他 </option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">描述</label>
							<input type="text" placeholder="请输入描述" class="form-control w200" v-model="orgDescription">
						</div>
					</div>
				</div>
				<!--检索条件结束-->
				<!--检索结果开始-->
				<div class="chunk-set m-t-10">					
					<div class="m-t-10 m-b-10">
						<label class="m-l-10 m-r-5">可用角色</label> <input type="text" class="table-searchInput " placeholder="搜索" v-model="searchRoleName" />
					</div>
					<div class="table-responsive clear">
						<vuetable ref="vuetable" api-url="${backendApiPath}/sysorg/getRolesForOrgModify" http-method="post" :fields="fields" :table-height="tableHeight" pagination-path="pagination" :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :no-data-template="noDataTemplate" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess" @vuetable:loading="showLoader" @vuetable:loaded="hideLoader" @vuetable:initialized="onInitialized" @vuetable:data-reset="onDataReset">
						</vuetable>
						<div class="vuetable-pagination" style="display:none">
							<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
							<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
						</div>
						<!-- vuetable-wrapper -->
						<settings-modal ref="settingsModal" :vuetable-fields="vuetableFields"></settings-modal>
					</div>
					<div class="chunk-footer">
						<div class="m-t-10 m-b-10 text-center">
							<button class="btn btn-info m-r-10" @click="saveSysOrg">保存</button>
							<button class="btn btn-white" @click="cancelModify">取消</button>
						</div>
					</div>
				</div>
				<!--检索结果开始-->
			</div>
			<!--功能列表-->
			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content ovh">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" align="left">
								<span>{{funRoleName}}</span>功能列表
							</div>
						</div>
						<div class="modal-body xhideyauto" style="height: 400px;">
							<div class="tab-pane active">
								<ul class="ztree" id="fun_tree">
								</ul>
							</div>
						</div>
						<div class="modal-footer">
							<button class="btn btn-white" @click="closeFunModal">关闭</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="menuContent" class="dragTreeContent dn post-abs">
			<ul id="downDragtree" class="ztree" style="width:180px; height: 300px;"></ul>
		</div>
		<script type="text/javascript" src="../../resources/js/system/sys/organize_manager_add.js"></script>
		<script type="text/javascript">
            var heightSet = function () {
                var scrrenW = document.documentElement.clientHeight;
                if (scrrenW < 730) {
                    /* $('body').css('overflow', 'auto'); */
                    $('.vuetable-body-wrapper').css('height', 'auto');
                }  else {
                    $('body').css('overflow', 'hidden');
                    $('.vuetable-body-wrapper').css('height', '457px');
                }
            }
			heightSet();
            window.onresize = function() {
                heightSet();
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