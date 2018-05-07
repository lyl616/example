<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="provinceId" value="${auth.user.pro}"/>
<c:set var="cityId" value="${auth.user.city}"/>
<c:set var="cityName" value="${auth.user.cityName}"/>


<!-- ================== BEGIN BASE CSS STYLE ================== -->
<link rel="shortcut icon" href="${ctx}/resources/img/favicon.ico">
<link rel="stylesheet" href="${ctx}/resources/css/zlight.menu.css" media="screen">
<link rel="stylesheet" href="${ctx}/resources/css/bootstrap.min.css"/>
<link rel="stylesheet" href="${ctx}/resources/css/style.min.css" rel="stylesheet"/>
<link rel="stylesheet" href="${ctx}/resources/plugins/layer/skin/default/layer.css" rel="stylesheet"/>
<!-- ================== END BASE CSS STYLE ================== -->


<script type="text/javascript" src="${ctx}/resources/plugins/jquery/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="${ctx}/resources/plugins/layer/layer.js"></script>
<script type="text/javascript" src="${ctx}/resources/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
<!-- ================== END PAGE LEVEL JS ================== -->


<!-- ================== BEGIN COMMOM JS ================== -->
<script type="text/javascript" src="${ctx}/resources/js/common/JSUtils.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/echarts-common.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/commonUtils.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/layer_msg.js"></script>

<script type="text/javascript" src="${ctx}/resources/js/common/dictionary.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/common.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/country.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/lev-color.js"></script>
<!-- ================== END COMMOM JS ================== -->


<script type="text/javascript">
    var ctx = "${ctx }", coreApiPath = "${requestScope.coreApiContextPath}";
    $.backendApiPath = "${requestScope.backendApiContextPath}";
    $.ctx = ctx, $.coreApiPath = coreApiPath;
    //if (!parent.cityId) {
    	parentDP = {
            ctx: "${ctx}",
            provinceId: "370000",
            cityId: "370800",
            cityName: "济宁市",
            bigScreen: "${isBigScreen}"
        };
    //}
</script>
