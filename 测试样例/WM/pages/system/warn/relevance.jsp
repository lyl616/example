<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../include.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 关联管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script>
			sessionStorage.setItem("tag", "3");
			sessionStorage.setItem("path", "guan_lian");
		</script>
	</head>

	<body>
		<%@ include file="../../V1/topMenu.jsp" %>
		<div id="content" class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<form role="form">
						<div class="form-group">
							<label class="m-l-10 m-r-5">省</label>
							<select id="s_province" class="form-control"></select>
						</div>
						<div class="form-group">
							<label class="m-l-20">市</label>
							<select id="s_city" class="form-control"></select>
						</div>
						<div class="form-group">
							<label for="divcte" class="m-l-20 m-r-5">浓度类型</label>
							<b id="divcte">
                        <select name="category" class="form-control" id="s_concentrationType"></select>
                    </b>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-info pull-right" onclick="tab.ajax.reload()">搜索</button>
						</div>
					</form>
				</div>
			</div>
			<div class="m-t-10 bgf pd10">
				<div class="table-responsive">
					<div id="topPlugin" class="hide" role="group">
						<%--<sec:authorize access="hasRole('ROLE_FUN_006_04_03_01')">--%>
						<button type="button" class="btn btn-danger m-r-5" onclick="del()">批量删除</button>
						<%--</sec:authorize>--%>
						<%--<sec:authorize access="hasRole('ROLE_FUN_006_04_03_02')">--%>
						<button type="button" id="addBtn" class="btn btn-info" onclick="showAddModal()">新增</button>
						<%--</sec:authorize>--%>
						<%--<sec:authorize access="hasRole('ROLE_FUN_006_04_03_03')">--%>
						<input type="hidden" id="updateBtn" value="1" />
						<%--</sec:authorize>--%>
					</div>
					<table id="tab" class="table table-striped table-bordered" cellspacing="0" width="100%">
					</table>
				</div>
			</div>
		</div>
		<!-- Modal -->
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="addModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
						<div class="modal-title" id="myModalLabel"></div>
					</div>
					<div class="modal-body ovh">
						<form class="form-horizontal" id="addForm" method="post">
							<input type="hidden" name="id" id="id">
							<div class="col-sm-6">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="name">名称</label>
									<input type="text" class="form-control " id="name" name="name">
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label class="m-r-5 form-label text-right">浓度类型</label>
									<select id="concentrationType" name="concentrationType.id" class="form-control">
									</select>
								</div>
							</div>
							<div class="clear"></div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="locationType">使用位置</label>
									<select name="locationType" id="locationType" class="form-control">
										<option value="1">告警</option>
										<option value="2">预警</option>
									</select>
								</div>
							</div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="refpointValue">关联点峰值</label>

									<input type="text" class="form-control " id="refpointValue" name="refpointValue">

								</div>
							</div>
							<div class="clear"></div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="pointValue">站点峰值</label>
									<input type="text" class="form-control " id="pointValue" name="pointValue">
								</div>
							</div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="messageType">发送通知</label>
									<select name="messageType" id="messageType" class="form-control">
										<option value="1">发送通知</option>
										<option value="0">不发送通知</option>
									</select>
								</div>
							</div>
							<div class="clear"></div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="templates">内容模板</label>
									<div class="checkbox" id="templates">
										<c:forEach var="t" items="${templates}" varStatus="status">
											<label>
                                        <input class="cus_template" type="checkbox" value="${t.code}">
                                            ${t.name}
                                    </label>
										</c:forEach>
									</div>
								</div>
							</div>
							<div class="clear"></div>
							<div class="col-sm-12 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="messageContent">通知内容</label>
									<textarea id="messageContent" name="messageContent" class="form-control" rows="3" style="width: 388px;"></textarea>
								</div>
							</div>
							<div class="clear"></div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="province">省</label>
									<select id="province" name="province.id" class="form-control">
									</select>
								</div>
							</div>
							<div class="col-sm-6 m-t-10">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="city">市</label>
									<select id="city" name="city.id" class="form-control">
									</select>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer clear m-t-10">
						<button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
						<button type="button" class="btn btn-info" onclick="add()">保存</button>
					</div>
				</div>
			</div>
		</div>
		<script src="${ctx}/resources/js/system/warn/relevance.js"></script>
		<script src="${ctx}/resources/js/system/warn/template-content.js"></script>
		<script type="text/javascript">
			//计算左右树与右侧的表格对齐
			calcOverflowH(0, 'scrollObj', 140);
			window.onresize = function() {
				calcOverflowH(0, 'scrollObj', 140);
			}
		</script>
	</body>

</html>