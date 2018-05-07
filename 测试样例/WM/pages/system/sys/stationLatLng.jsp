<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%@include file="../include.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<title>蛙鸣科技 | 经纬度转换 </title>
		<link rel="stylesheet" href="${ctx}/resources/css/rewcssChrome.css" />
	</head>

	<body class="gray-bg">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="pd10">
			<div class="top-search-container">
				<form role="form" class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-5">省名</label>
						<select class="form-control" name="account" id=district1>
						</select>
					</div>
					<div class="form-group">
						<label class="m-l-20 m-r-5">市名</label>
						<select class="form-control" name="account" id="district2">
						</select>
					</div>
					<div class="form-group">
						<input type="button" class="btn btn-info m-l-20" onclick="translateByProCity()" value="转化指定" />
						<input type="button" class="btn btn-info m-l-5" onclick="translateAll()" value="转化所有" />
					</div>
				</form>
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
		<script src="${ctx}/resources/plugins/jquery/content.min.js?v=1.0.0"></script>
		<script src="${ctx}/resources/plugins/jquery/icheck.min.js"></script>
		<script type="text/javascript">
			$.coreApiPath = "${requestScope.coreApiContextPath}";
			//下载数据
			function translateAll() {
				var url = $.coreApiPath + "/weather/translateLatLng?proId=-1&cityId=-1";
				$.get(url).success(function(data) {
					if(data) {
						alert("转化成功");
					} else {
						alert("存在转化失败");
					}
				});
			}

			function translateByProCity() {
				var proId = $("#district1 option:selected").val();
				var cityId = $("#district2 option:selected").val();
				var url = $.coreApiPath + "/weather/translateLatLng?proId=" + proId + "&cityId=" + cityId;
				$.get(url).success(function(data) {
					if(data) {
						alert("转化成功");
					} else {
						alert("存在转化失败");
					}
				});
			}
			//初始化省
			function initPrrovince() {
				var url = $.coreApiPath + "/weather/allProvince";
				var opt = document.getElementById("district1");
				opt.options.length = 0;
				$.getJSON(url).success(function(data) {
					for(var i = 0; i < data.length; i++) {
						opt.options.add(new Option(data[i].province, data[i].id));
					}
					initCityByProId($("#district1 option:selected").val());
				});
			}

			//初始化城市
			function initCityByProId(pro_id) {
				var url = $.coreApiPath + "/weather/getAllByProvinceId";
				var param = {
					"proId": pro_id
				};
				var opt = document.getElementById("district2");
				opt.options.length = 0;
				$.getJSON(url, param).success(function(data) {
					for(var i = 0; i < data.length; i++) {
						opt.options.add(new Option(data[i].city, data[i].id));
					}
				});
			}

			$(function() {
				initPrrovince();
				$('#district1').change(function() {
					initCityByProId($("#district1 option:selected").val());
				})
			})
		</script>
	</body>

</html>