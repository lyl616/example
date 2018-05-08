<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../include.html" %>
<!DOCTYPE html>
<html lang="en">

	<head>
		<title>蛙鸣科技 | 缓存管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body>
		<%@ include file="../../V1/topMenu.html" %>
		<div class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<label class="m-l-10 m-r-5">URL</label>
						<input id="cache_url" type="text" placeholder="URL" class="form-control" />
					</div>
					<div class="form-group pull-right">
						<input type="button" class="btn btn-info pull-right" onclick="loadCache($('#cache_url').val())" value="同步" />
					</div>
				</div>
			</div>

			<div class="bgf m-t-10 clear chunk-set">
				<div class="table-responsive">
					<table class="table table-striped" cellspacing="0" width="100%">
						<thead>
							<tr>
								<th width="200px" class="text-center">功能名称</th>
								<th width="200px" class="text-center">URL</th>
								<th width="100px" class="text-center">操作</th>
								<th class="text-center"></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="text-center">加载微站实时数据</td>
								<td class="text-center">redis/reloadWeatherInfo</td>
								<td class="text-center"><button class="btn btn-info" onclick="loadCache('redis/reloadWeatherInfo')">同步</button></td>
								<td></td>
							</tr>
							<tr>
								<td class="text-center">加载国控实时数据</td>
								<td class="text-center">redis/reloadGkhourDataInfo</td>
								<td class="text-center"><button class="btn btn-info" onclick="loadCache('redis/reloadGkhourDataInfo')">同步</button></td>
								<td></td>
							</tr>
							<tr>
								<td class="text-center">加载站点信息</td>
								<td class="text-center">redis/reloadStation</td>
								<td class="text-center"><button class="btn btn-info" onclick="loadCache('redis/reloadStation')">同步</button></td>
								<td></td>
							</tr>
							<tr>
								<td class="text-center">加载中兴站点信息</td>
								<td class="text-center">redis/reloadZTEStation</td>
								<td class="text-center"><button class="btn btn-info" onclick="loadCache('redis/reloadZTEStation')">同步</button></td>
								<td></td>
							</tr>
						</tbody>
					</table>

				</div>

			</div>
		</div>
		<script>
			function loadCache(url) {
				if(url != "") {
					ajax_post($.coreApiPath + "/" + url, null, function(r) {
						if(r.result) {
							layer.msg('redis 同步成功！');
						} else {
							layer.msg('redis 同步失败！');
						}
					});
				} else {
					layer.msg('请填写同步的url相对路径！');
				}
			}
		</script>
	</body>

</html>