<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@include file="../includeJsCss.jsp"%>
<%@include file="../pwd.jsp"%>
<script>
	$(document).ready(function() {
		if(sessionStorage.getItem("currentCityId")!=null){
			$("#city").val(sessionStorage.getItem("currentCityId"));
		}
		if(sessionStorage.getItem("currentCityName")!=null){
			$("#city_name_span").html(sessionStorage.getItem("currentCityName"));
		}
		$(".s_city").click(function(){
			var html = $(this).html();
			$("#city_name_span").html(html);
			$("#city").val($(this).attr("id"));
			saveCitySessionStorage(html,$(this).attr("id"),null,null);
		});
	});
</script>
<body>
	<style type="text/css">
		.btn-group.open .dropdown-toggle{
			-webkit-box-shadow:none;
			box-shadow:none;
			
		}
		.WMMapTools b{
			border-right: none;
			border: none;
		}
		.WMMapTools{
			border: none;
			box-shadow:none;
			
		}
		@media screen and (min-width: 1280px) {
	#ff {
		width: 81.5%;
	}
}
@media screen and (min-width: 1920px) {
	#ff {
		width: 87.5%;
	}
}
	</style>
	<div id="page-loader" class="fade in">
		<span class="spinner"></span>
	</div>
	<div id="page-container" class="fade page-sidebar-fixed">
		<div id="header" class="header navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<a href="${ctx}/main" class="navbar-brand"><span style="margin-right: 12px;"><img src="${ctx}/resources/img/WMLogo.png" width="30" height="30"></span>大气污染管理系统</a>
					<div class="left m-b-10 m-t-10 m-r-15" style="width: 1px; height: 35px; border-right: 1px solid #b9bfc5;"></div>
					<a href="${ctx}/main">
						<div class="WMMap_back"></div>
					</a>
					<div class="left f-s-20 m-t-15 m-l-10 f-w-600">数据统计</div>
					
					<div class=" f-s-14" style=" float: left;margin-top: 13px">
						<a href="#" id="ShowUserBoxclick" style="cursor: pointer"></a><b class="tool-gap" >
						<div class="btn-group" >
							<div type="button" class="btn btn-white dropdown-toggle"
								data-toggle="dropdown" style="background: none;color: #000000;border: none;width: 200px;">
								<span id="city_name_span"><c:out value="${auth.user.cityName}"/></span><span class="caret"></span>
							</div>
							<ul class="dropdown-menu" role="menu" style="min-width: 450px;background:#ffffff">
							 	<li>
									<div class="col-md-12 lp">
									<p style="color: #000000;float: left;padding: 0px 0px;" class="col-md-2">城市：</p>	
									<p style="float: left;padding: 0px 10px;"class="col-md-9 ">
									<c:forEach var="para" items="${domainList}" varStatus="status">
										<span class="s1"><a id="${para.cityId}" class="s_city" href='javascript:void(0);'><c:out value="${para.cityName}"/></a></span>
									</c:forEach>
									</p>
									</div>
								</li>
							</ul>
						</div>
						</b>  
					</div>
					
					<button type="button" class="navbar-toggle" data-click="sidebar-toggled">
						<span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
					</button>
				</div>
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown navbar-user">
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> <img src="${ctx}/resources/img/user.jpg" alt="" /> <span class="hidden-xs"><c:out value='${auth.user.fullName}' /></span> <b class="caret"></b></a>
						<ul class="dropdown-menu animated fadeInLeft">
							<li class="arrow"></li>
							 <li><a href="#" onclick="changePwd()">密码修改</a></li>
							<li><a href="${ctx}/logout">退出</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div id="sidebar" class="sidebar">
			<div data-scrollbar="true" data-height="100%">
				<ul class="nav f-s-12">
					<li class="nav-header"></li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 站点尺度统计</span></a>
						<ul class="sub-menu" style="display: block;">
							<li id="tabFx1"><a class="J_menuItem" href="${ctx }/analysis/history/station_day" onclick="switchMenu('tabFx1');this.blur();">微站日分析</a></li>
							<li id="tabFx2"><a class="J_menuItem" href="${ctx }/analysis/history/station_month" onclick="switchMenu('tabFx2');this.blur();">微站月分析</a></li>
						</ul>
					</li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 城市尺度分析</span></a>
						<ul class="sub-menu" style="display: block;">
							<li id="tabFx3"><a class="J_menuItem" style="color: #fff" href="${ctx}/analysis/realtime/index" onclick="switchMenu('tabFx3');this.blur();">城市数据分析</a></li>
							<li id="tabFx4"><a class="J_menuItem" href="${ctx }/analysis/history/scatter" onclick="switchMenu('tabFx4');this.blur();">24小时数据散点</a></li>
							<li id="tabFx5"><a class="J_menuItem" href="${ctx }/analysis/history/calendar_day" onclick="switchMenu('tabFx5');this.blur();">日历图</a></li>
							<li id="tabFx6"><a class="J_menuItem" href="${ctx }/analysis/history/calendar_month" onclick="switchMenu('tabFx6');this.blur();">月历图</a></li>
						</ul>
					</li>
					<li class="has-sub expand">
						<a href="javascript:;"> <b class="caret pull-right"></b> <i class="fa fa-laptop"></i><span>+ 比对分析</span></a>
						<ul class="sub-menu" style="display: block;">
							<li id="tabFx7"><a class="J_menuItem" href="${ctx }/analysis/history/city" onclick="switchMenu('tabFx7');this.blur();">城市比对分析</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div class="sidebar-bg"></div>
	</div>
	
	<script>
		function switchMenu(ProTag) {
			for (i = 1; i <=$(".J_menuItem").size(); i++) {
				var tab = "#tabFx"+i;
				if ("tabFx"+i == ProTag) {
					sessionStorage.setItem(tab,"bai");
				} else {
					sessionStorage.setItem(tab,"hei");
				}
			}
		}
		
		for (i = 1; i <=$(".J_menuItem").size(); i++) {
			var tab = "#tabFx"+i;
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
</body>