<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 项目管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<%@include file="../../includeVue.jsp" %>
		<link rel="stylesheet" href="${ctx}/resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css">
		<script type="text/javascript" src="${ctx}/resources/plugins/ztree/js/jquery.ztree.all.js"></script>
	</head>

	<body>
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="m-t-10" id="app">
			<div class="col-sm-12 p-r-10 p-l-10">
				<!--检索条件开始-->
				<div class="search-formgroup">
					<div class="form-inline">
						<div class="form-group ">
							<label class="m-l-10 m-r-5"><i class="gf00 fsn">*</i>所属组织</label>
							<!--下拉树开始-->
							<div class="select-tree" style="width: 120px;">
								<input id="citySel" class="form-control" placeholder="请输入所属组织" v-model="orgId.name" :value="orgId.name"  type="text" onclick="showMenu();" />
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
							<input type="text" placeholder="请输入名称" class="form-control w200" v-model="orname" @keyup="judgeTextarea(30,'orname')"/>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">描述</label>
							<input type="text" placeholder="请输入描述" class="form-control w200" v-model="ordescription" @keyup="judgeTextarea(50,'ordescription')"/>
						</div>
						<div class="form-group pull-right">
							<button class="btn btn-info m-r-10" @click="save">保存</button><button class="btn btn-white" @click="canselSave">取消</button>
						</div>
					</div>
				</div>
				<!--检索条件结束-->
			</div>
		</div>

		<div style="width: 200px; height: 300px;">
			<div id="menuContent" class="dragTreeContent dn post-abs">
				<ul id="downDragtree" class="ztree" style="width:180px; height: 300px;"></ul>
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/js/system/sys/project_manager_view.js"></script>
	</body>

</html>