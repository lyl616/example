<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.ResourceBundle"%>
<%@include file="../include.jsp"%>
<script type="text/javascript">
	var communicat_IP_Port = "communicat_IP_Port";
</script>
<!DOCTYPE html>
<html>
<head>
	<title>微站最近邻</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="renderer" content="webkit">
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
</head>
<body>
<%@ include file="../../V1/topMenu.jsp" %>
	<div class="table-responsive">
		<table id="tab" class="table table-striped table-bordered customselt" cellspacing="0" width="100%">
		</table>
	</div>
	<script type="text/javascript" src="${ctx}/resources/js/system/equipment/closestation.js"></script>
</body>
</html>