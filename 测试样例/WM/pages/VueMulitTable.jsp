
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="coreApiPath" value="${requestScope.coreApiContextPath}" />

<c:set var="provinceId" value="${auth.user.pro}" />
<c:set var="cityId" value="${auth.user.city}" />
<c:set var="cityName" value="${auth.user.cityName}" />

<!-- ================== BEGIN BASE CSS STYLE ================== -->
<link rel="shortcut icon" href="../../resources/img/favicon.ico">
<link rel="stylesheet" href="../../resources/css/zlight.menu.css" media="screen">
<link rel="stylesheet" href="../../resources/css/bootstrap.min.css" />
<link rel="stylesheet" href="../../resources/css/style.min.css" rel="stylesheet" />
<link rel="stylesheet" href="../../resources/plugins/layer/skin/default/layer.css" rel="stylesheet" />
<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
<link rel="stylesheet" href="../../resources/plugins/vue-easytable/css/easytable.css"> <!--修改-->
	<link rel="stylesheet" href="../../resources/plugins/vue/vue-table2.css">
<!-- ================== END BASE CSS STYLE ================== -->

<!-- ================== END PAGE LEVEL JS ================== -->
<script type="text/javascript" src="../../resources/plugins/jquery/jquery-1.9.1.min.js"></script>

<script type="text/javascript" src="../../resources/plugins/layer/layer.js"></script>
<script src="../../resources/plugins/vue/semantic.min.2.2.2.js" charset="utf-8"></script>
<script src="../../resources/plugins/vue/vue-2.5.9.min.js"></script>
<script src="../../resources/plugins/vue-easytable/js/easytable.js"></script> <!--修改-->
<script src="../../resources/plugins/vue/vue-table-2-full.js"></script>
<script type="text/javascript" src="../../resources/js/common/JSUtils.js"></script>
<script type="text/javascript" src="../../resources/js/common/commonUtils.js"></script>
<script type="text/javascript" src="../../resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
<script type="text/javascript">
	var ctx = "${ctx }",
		coreApiPath = "${requestScope.coreApiContextPath}";
	var ctx = ctx;

	$.coreApiPath = coreApiPath;
	if(!parent.cityId) {
		parent = {
			ctx: "${ctx}",
			provinceId: "${provinceId}",
			cityId: "${cityId}",
			cityName: "${cityName}",
			bigScreen: "${isBigScreen}"
		};
	}

	var userId = "${auth.user.userId}";
	var provinceId = "${auth.user.provinceId}";
	var cityId = "${auth.user.cityId}";	
	
	function calcOverflowH(index, objV, vh) {
		//0(id) ,1 (class) ,objV 是要设置的对象 ，vh 是要减去的距离顶部的间距   
		 var scrrenW = document.body.clientHeight;
		var h = scrrenW - vh;
		if(index == 0) {
			$("#" + objV).height(h + "px"); //直接设置元素的高
			//$().css("height",scrrenW-vh+"px");
		} else {
			$("." + objV).height(h + "px"); //直接设置元素的高
		}
	}
</script>