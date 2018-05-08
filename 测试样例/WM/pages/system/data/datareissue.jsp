
<%@include file="../include.html" %>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 数据补发</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	</head>

	<body>
		<%@ include file="../../V1/topMenu.html" %>
		<div id="content" class="pd10">
			<div class="top-search-container">
				<div class="form-inline">
					<div class="form-group">
						<button type="button" class="btn btn-info" @click="createReissue">添加</button>
					</div>
				</div>
			</div>

			<div class="m-t-10 bgf pd10 ovh">
				<div class="form-inline m-t-10" v-for="val in list">
					<div class="form-group m-r-20">
						<label class="m-r-5">URL</label>
						<input type="text" class="form-control m-r-5 w200" v-model="val.urlVal" />
					</div>
					<div class="form-group m-r-20">
						<label class="m-r-5">日期</label>
						<div class="input-group input-daterange">
							<input v-bind:id="'start-'+$index" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false,maxDate:'%y-%M-%d %H:%m:%s'})" v-model="val.startTime" class="form-control Wdate" type="text" />
							<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
							<input v-bind:id="'end-'+$index" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',isShowClear:false,maxDate:'%y-%M-%d %H:%m:%s'})" v-model="val.endTime" class="form-control Wdate" type="text" />
						</div>
					</div>
					<div class="form-group">
						<input type="button" v-on:click="nowReissue($index)" class="btn btn-info" value="补发">
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="../../resources/js/system/data/datareissue.js"></script>
	</body>

</html>