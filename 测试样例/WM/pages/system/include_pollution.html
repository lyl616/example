<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@include file="../includeJsCss.html"%>
<%@include file="../pwd.html"%>
<body>
	<!-- begin #page-loader -->
	<div id="page-loader" class="fade in">
		<span class="spinner"></span>
	</div>
	<style type="text/css">
		.WMMapTools{
			border: none;
			box-shadow: none;
		}
	</style>
	<!-- end #page-loader -->
	<!-- begin #page-container -->
	<div id="page-container" class="page-sidebar-fixed">
		<!-- begin #header -->
		<div id="header" class="header navbar navbar-default navbar-fixed-top">
			<!-- begin container-fluid -->
			<div class="container-fluid">
				<!-- begin mobile sidebar expand / collapse button -->
				<div class="navbar-header">
					<a href="${ctx}/main" class="navbar-brand"><span style="margin-right: 12px;"><img src="../../resources/img/WMLogo.png" width="30" height="30"></span>大气污染管理系统</a>
					<div class="left m-b-10 m-t-10 m-r-15" style="width: 1px; height: 35px; border-right: 1px solid #b9bfc5;"></div>
					<a href="${ctx}/main">
						<div class="WMMap_back"></div>
					</a>
					<div class="left f-s-20 m-t-15 m-l-10 f-w-600">污染溯源</div>
					<div class="WMMapTools f-s-14" style="margin-right: 63%; float: left;padding:inherit;">
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
					<li class="dropdown navbar-user"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> <img src="../../resources/img/user.jpg" alt="" /> <span class="hidden-xs"><c:out value='${auth.user.fullName}' /></span> <b class="caret"></b>
					</a>
						<ul class="dropdown-menu animated fadeInLeft">
							<li class="arrow"></li>
							<li><a href="#" onclick="changePwd()">密码修改</a></li>
							<li><a href="${ctx}/logout">退出</a></li>
						</ul></li>
				</ul>
				<!-- end header navigation right -->
			</div>
			<!-- end container-fluid -->
		</div>
		<!-- end #header -->

		<!-- begin #sidebar -->
		<div id="sidebar" class="sidebar">
			<!-- begin sidebar scrollbar -->
			<div data-scrollbar="true" data-height="100%">
				<!-- begin sidebar nav -->
				<ul class="nav f-s-12">
					<li class="nav-header"></li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 国控点分析</span></a>
						<ul class="sub-menu" style="display: block;">
							<li id="menu1"><a class="J_menuItem" style="color: #fff" href="${ctx}/pollutionSource/index" onclick="switchMenu('menu1');this.blur();">污染来源识别</a></li>
							<li id="menu2"><a class="J_menuItem" style="color: #fff" href="${ctx}/pollution/heavy/index" onclick="switchMenu('menu2');this.blur();">污染过程分析</a></li>
							<li id="menu3"><a class="J_menuItem" style="color: #fff" href="${ctx}/pollutionSpace/index" onclick="switchMenu('menu3');this.blur();">污染空间分析</a></li>
							<li id="menu4"><a class="J_menuItem" href="${ctx}/pollution/heavy/level/index" onclick="switchMenu('menu4');this.blur();">所有站点</a></li>
						</ul>
					</li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 省控点分析</span></a>
						<ul class="sub-menu" style="display: block;">
							<li id="menu5"><a class="J_menuItem" style="color: #fff" href="#"  onclick="switchMenu('menu5');this.blur();">省控点</a></li>
						</ul>
					</li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 多曲线</span></a>
						<ul class="sub-menu" style="display: block;">
<%-- 							<li  id="menu6"><a class="J_menuItem" style="color: #fff" href="${ctx }/pollutionSource/indexTemp1" onclick="switchMenu('menu6');this.blur();">多曲线</a></li> --%>
						</ul>
					</li>
				</ul>
				<!-- end sidebar nav -->
			</div>
			<!-- end sidebar scrollbar -->
		</div>
		<div class="sidebar-bg"></div>
	</div>
</body>
<script type="text/javascript">
	$(function() {		
		if(sessionStorage.getItem("currentCityId")!=null){
			$("#city").val(sessionStorage.getItem("currentCityId"));
		}
		if(sessionStorage.getItem("currentCityName")!=null){
			$("#city_name_span").html(sessionStorage.getItem("currentCityName"));
			$("#mapCenter").html(sessionStorage.getItem("currentCityName"));
		}
		$(".s_city").click(function(){
			var html = $(this).html();
			$("#city_name_span").html(html);
			$("#city").val($(this).attr("id"));
			saveCitySessionStorage(html,$(this).attr("id"),null,null);
		});
	});

</script>

<script>
		function switchMenu(ProTag) {
			for (i = 1; i <=$(".J_menuItem").size(); i++) {
				var tab = "#menu"+i;
				if ("menu"+i == ProTag) {
					sessionStorage.setItem(tab,"bai");
				} else {
					sessionStorage.setItem(tab,"hei");
				}
			}
		}
		
		for (i = 1; i <=$(".J_menuItem").size(); i++) {
			var tab = "#menu"+i;
			var sess = sessionStorage.getItem(tab);
			var a =  tab + " a";
			if (sess == "bai") {
				$(a).css("color","#ffffff");
			} else {
				sessionStorage.setItem(tab,"hei");
				$(a).css("color","#889097");
			}
		}
	</script>