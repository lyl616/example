<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="coreApiPath" value="${requestScope.coreApiContextPath}" />

<!-- ================== BEGIN BASE CSS STYLE ================== -->
<link rel="shortcut icon" href="${ctx}/resources/img/favicon.ico">
<link rel="stylesheet" href="${ctx}/resources/css/zlight.menu.css" media="screen">
<link rel="stylesheet" href="${ctx}/resources/css/bootstrap.min.css" />
<link rel="stylesheet" href="${ctx}/resources/css/style.min.css" rel="stylesheet" />
<link rel="stylesheet" href="${ctx}/resources/plugins/layer/skin/default/layer.css" rel="stylesheet" />
<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table2.css">
<!-- ================== END BASE CSS STYLE ================== -->

<!-- ================== END PAGE LEVEL JS ================== -->
<script type="text/javascript" src="${ctx}/resources/plugins/jquery/jquery-1.9.1.min.js"></script>

<script type="text/javascript" src="${ctx}/resources/plugins/layer/layer.js"></script>
<script src="${ctx}/resources/plugins/vue/semantic.min.2.2.2.js" charset="utf-8"></script>
<script src="${ctx}/resources/plugins/vue/vue-2.5.9.min.js"></script>
<script src="${ctx}/resources/plugins/vue/vue-table-2-full.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/JSUtils.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/commonUtils.js"></script>
<script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
<script type="text/javascript">
	var ctx = "${ctx }",
		coreApiPath = "${requestScope.coreApiContextPath}";
	var ctx = ctx;
	$.ctx = ctx;
	$.coreApiPath = coreApiPath;
    $.backendApiPath = "${requestScope.backendApiContextPath}";
    parent['cityId'] = CommonUtil.getCookie("cityId");
    parent['domainId'] = CommonUtil.getCookie("cityId");
    parent['provinceId'] = CommonUtil.getCookie("provinceId");
    parent['cityName'] = decodeURI(CommonUtil.getCookie("cityName"));
    var userId = CommonUtil.getCookie("userId");
    parent['userId'] = userId;

	function calcOverflowH(index, objV, vh) {
		//0(id) ,1 (class) ,objV 是要设置的对象 ，vh 是要减去的距离顶部的间距   
		 var scrrenW = document.documentElement.clientHeight;
		var h = scrrenW - vh;
		if(index == 0) {
			$("#" + objV).height(h + "px"); //直接设置元素的高
			//$().css("height",scrrenW-vh+"px");
		} else {
			$("." + objV).height(h + "px"); //直接设置元素的高
		}
	}
</script>