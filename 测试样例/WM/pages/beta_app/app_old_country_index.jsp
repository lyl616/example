<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 全国视图</title>
		<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
		<!--<script src="${ctx}/resources/beta_app/js/jquery.mobile-1.4.5.min.js"></script>-->
		<script src="${ctx}/resources/beta_app/js/zepto.js"></script>			
		<script type="text/javascript" src="${ctx}/resources/beta_app/js/plugins/layer/js/layer.js"></script>
		<script type="text/javascript">			
			if(!parent.cityId) {
				parent = {
					ctx: "${ctx}",
					provinceId: "${provinceId}",
					cityId: "${cityId}",
					cityName: "${cityName}",
					bigScreen: "${isBigScreen}"
				};
			}
			$.ctx = "${ctx }";
			$.coreApiPath = "${requestScope.coreApiContextPath}";
		</script>
		<link href="${ctx}/resources/beta_app/css/bootstrap.min.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx}/resources/beta_app/js/plugins/leaflet/css/leaflet.css" />
		<link rel="stylesheet" href="${ctx}/resources/beta_app/css/initmap.css" />
		<script src="${ctx}/resources/beta_app/js/plugins/leaflet/js/leaflet.js" type="text/javascript"></script>
		<script src="${ctx}/resources/beta_app/js/plugins/wind/windable.min.js"></script>
		<!-- 绘制wind的脚本-->
		<script src="${ctx}/resources/beta_app/js/plugins/leaflet/js/leaflet_canvas_layer.js"></script>
		<!--绘制风向图-->
		<script src="${ctx}/resources/beta_app/js/d3.min.js"></script>
		<script src="${ctx}/resources/beta_app/js/plugins/leaflet/js/Leaflet.Control.Custom.js"></script>
		<script type="text/javascript" src="${ctx}/resources/beta_app/js/plugins/echarts/js/echarts.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/beta_app/js/JSUtils.js"></script>
		<script src="${ctx}/resources/beta_app/js/plugins/leaflet/js/leaflet.customsearchbox.min.js"></script>
		<!--左上搜索框内容-->
	</head>
	<body>		
		<div id="leaflet-map-canvas"></div>
		<script type="text/javascript" src="${ctx}/resources/beta_app/js/config_appold.js"></script>
		<script type="text/javascript" src="${ctx}/resources/beta_app/js/initCharts.js"></script>
	</body>
</html>