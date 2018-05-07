<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@include file="../includeJsCss.jsp"%>


<script src="${ctx}/resources/plugins/metisMenu/jquery.metisMenu.js"></script>
<%-- <script src="${ctx}/resources/plugins/hplus.min.js?v=4.1.0"></script> --%>
<script src="${ctx}/resources/plugins/contabs.min.js"></script>
<script src="${ctx}/resources/plugins/pace/pace.min.js"></script>
<body>
<div id="page-loader" class="fade in">
	<span class="spinner"></span>
</div>
<style type="text/css">
.WMMapTools {
	border: none;
	box-shadow: none;
}
</style>
	<!-- end #page-loader -->
	<!-- begin #page-container -->
	<div id="page-container" class="page-sidebar-fixed">
		<!-- begin #header -->
		<div id="header" class="header navbar navbar-default navbar-fixed-top" style="position: fixed;">
			<!-- begin container-fluid -->
			<div class="container-fluid">
				<!-- begin mobile sidebar expand / collapse button -->
				<div class="navbar-header">
					<a href="${ctx}/main" class="navbar-brand"><span style="margin-right: 12px;"><img src="${ctx}/resources/img/WMLogo.png" width="30" height="30"></span>大气污染管理系统</a>
					<div class="left m-b-10 m-t-10 m-r-15" style="width: 1px; height: 35px; border-right: 1px solid #b9bfc5;"></div>
					<a href="${ctx}/main">
						<div class="WMMap_back"></div>
					</a>
					<div class="left f-s-20 m-t-15 m-l-10 f-w-600">站点分析</div>
					<div class="WMMapTools f-s-14" style="margin-right: 65%; float: left; padding: inherit;">
						<div class="btn-group">
							<button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" style="background: #FFFFFF; color: #000000; border: none;">
								<span id="city_name_span"><c:out value="${auth.user.cityName}" /></span><span class="caret"></span>
							</button>
							<ul class="dropdown-menu" role="menu" style="min-width: 450px; background: #ffffff">
								<li>
									<div class="col-md-12 lp">
										<p style="color: #000000; float: left; padding: 0px 0px;" class="col-md-2">城市：</p>
										<p style="float: left; padding: 0px 10px;" class="col-md-9 ">
											<c:forEach var="para" items="${domainList}" varStatus="status">
												<span class="s1"><a id="${para.cityId}" name="${para.provinceId}" class="s_city" href='javascript:void(0);'><c:out value="${para.cityName}" /></a></span>
											</c:forEach>
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<button type="button" class="navbar-toggle" data-click="sidebar-toggled">
						<span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
					</button>
				</div>
				<!-- end mobile sidebar expand / collapse button -->

				<!-- begin header navigation right -->
				<ul class="nav navbar-nav navbar-right">
					<li>
						<form class="navbar-form full-width">
							<div class="form-group">
								<input type="text" class="form-control" placeholder="查询" />
								<button type="submit" class="btn btn-search">
									<i class="fa fa-search"></i>
								</button>
							</div>
						</form>
					</li>
					<li class="dropdown navbar-user"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> <img src="${ctx}/resources/img/user.jpg" alt="" /> <span class="hidden-xs"><c:out value='${auth.user.fullName}' /></span> <b class="caret"></b>
					</a>
						<ul class="dropdown-menu animated fadeInLeft">
							<li class="arrow"></li>
							<li><a href="${ctx}/logout">退出</a></li>
						</ul></li>
				</ul>
				<!-- end header navigation right -->
			</div>
			<!-- end container-fluid -->
		</div>

		<div id="sidebar" class="sidebar">
			<div data-scrollbar="true" data-height="100%">
				<ul class="nav f-s-12">
					<li class="nav-header"></li>
					<li class="has-sub expand"><a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 首页</span></a>
						<ul class="sub-menu" style="display: block;">
							<li><a style="color: #fff" >使用说明</a></li>
						</ul>
					</li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 统计图表</span></a>
						<ul class="sub-menu" style="display: block;">
							<li>
                                <a href="${ctx}/weather/weatherChartIndex">站点数据分析</a>
                            </li>
                            <li>
                                <a href="${ctx}/weather/customChartIndex?">自定义站点分析</a>
                            </li>
                            <!-- 
                            <li>
                                <a class="J_menuItem" href="weatherChartStation.jsp?">单站点</a>
                            </li>-->
                            <li>
                               <!--  <a href="${ctx}/weather/downloadDataIndex?">下载数据</a>-->
                            </li>
                            <li>
                            	<!-- stationLatLng.jsp?
                                <a class="J_menuItem" href="${ctx}/weather/stationLatLngIndex?">经纬度转化</a>
                                -->
                            </li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div class="sidebar-bg"></div>
	</div>
</body>
<script type="text/javascript">
	$(function() {		
		if (sessionStorage.getItem("currentCityId") != null) {
			$("#city").val(sessionStorage.getItem("currentCityId"));
		}
		if (sessionStorage.getItem("currentCityName") != null) {
			$("#city_name_span")
					.html(sessionStorage.getItem("currentCityName"));
			$("#mapCenter").html(sessionStorage.getItem("currentCityName"));
		}
		$(".s_city").click(function() {
			var html = $(this).html();
			$("#city_name_span").html(html);
			$("#city").val($(this).attr("id"));
			saveCitySessionStorage(html, $(this).attr("id"), null, null);
		});
	});
</script>