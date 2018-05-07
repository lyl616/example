<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
	<!--<![endif]-->

	<head>
		<meta charset="utf-8" />
		<meta name="_csrf_parameter" content="_csrf" />
		<meta name="_csrf_header" content="X-CSRF-TOKEN" />
		<meta name="_csrf" content="e62835df-f1a0-49ea-bce5-bf96f998123c" />

		<title>蛙鸣科技 | 登录</title>
		<meta content="" name="description" />
		<meta content="" name="author" />

		<link rel="shortcut icon" href="${ctx}/resources/img/favicon.ico">
		<link href="${ctx}/resources/css/bootstrap.min.css" rel="stylesheet" />
		<link href="${ctx}/resources/css/style.min.css" rel="stylesheet" />

		<!-- ================== BEGIN BASE JS ================== -->
		<script src="${ctx}/resources/plugins/jquery/jquery-1.9.1.min.js"></script>
		<script src="${ctx}/resources/plugins/jquery/jquery-migrate-1.1.0.min.js"></script>
		<%--<script src="${ctx}/resources/plugins/jquery-ui/ui/minified/jquery-ui.min.js"></script>--%>
		<script src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
		<script src="${ctx}/resources/plugins/layer/layer.js"></script>

		<script src="${ctx}/resources/plugins/jquery/jquery.slimscroll.min.js"></script>
		<script src="${ctx}/resources/plugins/jquery/jquery.cookie.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/common/commonUtils.js"></script>
	</head>

	<body class="pace-top loginbg-01">
		<div id="page-container" class="page-posi">
			<div class="shadowBg"></div>
			<!-- begin login -->
			<div class="login animated fadeInDown">
				<div class="login-container-m">
					<!-- begin brand -->
					<div class="login-header">
						<img src="${ctx}/resources/img/logoN.png" width="80">

					</div>
					<!-- end brand -->
					<div class="login-content">

						<form onsubmit="return login();" name="loginForm" id="loginForm" class="margin-bottom-0">
							<div class="form-group m-b-15">
								<input type="text" id="txtUserName" name="username" class="form-control input-lg ibg1" placeholder="用户名" />
							</div>
							<div class="form-group m-b-15">
								<input type="password" id="txtPassword" name="password" class="form-control input-lg ibg2" placeholder="密码" />
							</div>
							<input type="hidden" name="displayCode" id="displayCode" value="true">
							<div class="form-group m-b-15">
								<input type="text" id="txtCode" class="form-control ibg3" name="code" placeholder="不区分大小写"><img src="${requestScope.coreApiContextPath}/kaptcha" onclick="this.src='${requestScope.coreApiContextPath}/kaptcha?t='+new Date()*1" height="28" width="70" />
							</div>

							<div class="checkbox m-b-15">
								<!--
        <label> <input type="checkbox" name="remember-me" value="true" />一周内记住我
        </label>
         -->
							</div>
							<div class="login-buttons">
								<input type="submit" class="btn btn-success btn-block btn-sm" value="登录">
								</input>
							</div>
						</form>
					</div>
				</div>
			</div>
			<!-- end login -->

		</div>
		<!-- end page container -->

		<script>
			$.coreApiPath = "${requestScope.coreApiContextPath}";
			$.ctx = "${ctx}";
			// if(CommonUtil.getCookie("access_token")) {
			// 	window.location.href = $.ctx + "/airMonitoring/landingPage"
			// }
		</script>
		<script language="javascript" type="text/javascript">
			function login() {
				if(validateForm() == true) {
					layer.msg('正在登录', {
						icon: 16,
						shade: 0.01
					});
					var params = $("#loginForm").serializeArray();
					$.post($.coreApiPath + "/login", params,
						function(data) {
							if(data.erroCode == 2000) {
								window.location.href = $.ctx + data.result.firstPage;
							} else {
								layer.msg(data.erroMsg);
							}
						}, "json");
				}
				return false;
			}

			//验证输入
			function validateForm() {
				username = document.getElementById("txtUserName");
				password = document.getElementById("txtPassword");
				txtCode = document.getElementById("txtCode");
				displayCode = document.getElementById("displayCode");

				if(username.value == null || username.value == "") {
					layer.msg('用户名不能为空 !');
					return false;
				} else if(password.value == null || password.value == "") {
					layer.msg('密码不能为空 !');
					return false;
				}
				if(txtCode.value == null || txtCode.value == "") {
					layer.msg('验证码不能为空 !');
					return false;
				}
				var code = CommonUtil.getCookie("code");
				if($.trim(txtCode.value.toLowerCase()) != code.toLowerCase()) {
					layer.msg('验证码不正确!');
					return false;
				}
				return true;
			}

			document.onkeydown = function mykeyDown(e) {
				//compatible IE and firefox because there is not event in firefox
				e = e || event;
				if(e.keyCode == 13) {
					login();
					return false;
				}
				return true;
			}
		</script>
	</body>

</html>