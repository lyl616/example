<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/Map" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
<head>
    <meta charset="utf-8"/>
    <title></title>
    <meta itemprop="name" property="og:title" content=""/>
    <meta name="description" itemprop="description" property="og:description" content=""/>
    <meta name="author" itemprop="author" content="Cameron Beccario"/>
    <meta property="fb:admins" content="510217216"/>
    <link rel="stylesheet" type="text/css" href="../../resources/earth/css/styles.css"/>
</head>
<body>
    <div id="display" data-topography="../../resources/earth/data/${cityId}-topo.json"
    	data-samples="${requestScope.coreApiContextPath}/data/wind/${samples}"
                      data-type="wind" data-date="${date}" data-total-hour="${totalHour}"
                       data-city-id="${cityId}">
        <div id="map">
            <svg id="map-svg" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
        </div>
        <div id="field">
            <canvas id="field-canvas"></canvas>
        </div>
        <div id="overlay">
            <canvas id="overlay-canvas"></canvas>
        </div>
        <div id="details" style="display:none;">
            <h3 id="sample-label" style="display: none">&nbsp;</h3>
            <h3 id="status">&nbsp;</h3>
            <h3 id="location">&nbsp;</h3>
            <h3 id="point-details">&nbsp;</h3>
        </div>
    </div>

    <script src="../../resources/earth/js/when.js" charset="utf-8"></script>
    <script src="../../resources/earth/js/d3.v3.js" charset="utf-8"></script>
    <script src="../../resources/earth/js/jquery-3.1.1.js" charset="utf-8"></script>
    <script src="../../resources/earth/js/topojson.v1.js" charset="utf-8"></script>
    <script src="../../resources/earth/js/mvi.js" charset="utf-8"></script>
    <script src="../../resources/earth/js/air.js" charset="utf-8"></script>
    <script>
    	$.ctx = "${ctx}";
    	$.coreApiPath = "${requestScope.coreApiContextPath}";
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() { (i[r].q = i[r].q || []).push(arguments); }, i[r].l = 1 * new Date();
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-44235933-1', 'nullschool.net');
        ga('send', 'pageview');
    </script>
</body>
</html>
