<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<html lang="en">
	<head>
	</head>
	<body>
	</body>
	<script src="../../resources/plugins/jquery/jquery-1.9.1.min.js"></script>
	<script>
		$(document).ready(function() {
			window.parent.location.href="${ctx}/login";
		});
	</script>
</html>