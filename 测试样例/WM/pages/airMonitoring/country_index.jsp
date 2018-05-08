
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



<%@include file="../includeJsCss.html" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 污染地图</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">

    <link rel="stylesheet" href="../../resources/plugins/layer/skin/default/layer.css"/>
    <link rel="stylesheet" href="../../resources/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="../../resources/plugins/leaflet/css/leaflet.css"/>
    <link rel="stylesheet" href="../../resources/plugins/leaflet/css/initmap.css"/>
    <link rel="stylesheet" href="../../resources/css/rewcssChrome.css"/>


    <script type="text/javascript" src="../../resources/plugins/leaflet/js/leaflet.js"></script>
    <script type="text/javascript" src="../../resources/plugins/leaflet/js/windable.min.js"></script>
    <!-- 绘制wind的脚本-->
    <script type="text/javascript" src="../../resources/plugins/leaflet/js/leaflet_canvas_layer.js"></script>
    <!--绘制风向图-->
    <script type="text/javascript" src="../../resources/plugins/d3/js/d3.v3.min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/leaflet/js/Leaflet.Control.Custom.js"></script>
    <script type="text/javascript" type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
    <script type="text/javascript" type="text/javascript" src="../../resources/js/common/JSUtils.js"></script>

    <script type="text/javascript" src="../../resources/plugins/leaflet/js/leaflet.customsearchbox.min.js"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/stationDetail.js"></script>
    <!--左上搜索框内容-->

</head>

<body>
<%@include file="../V1/topMenu.html" %>

<div id="leaflet-map-canvas" class="m-t-20 post-fixed" style="bottom: 0; top:40px;"></div>

<script type="text/javascript" src="../../resources/js/airMonitoring/country_index_config.js"></script>
<script type="text/javascript" src="../../resources/js/airMonitoring/country_index_initCharts.js"></script>

</body>

</html>