

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 区县考核统计</title>
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<!--引入下拉多选框样式-->
		<link href="../../resources/plugins/bootstrap-multiselect/css/bootstrap-multiselect.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/bootstrap-multiselect/js/bootstrap-multiselect.js"></script>
		<script type="text/javascript" src="${ctx }/resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.js"></script>
		<script type="text/javascript" src="${ctx }/resources/js/common/echarts-common.js"></script>
		<script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="${ctx }/resources/js/common/dateHelper.js"></script>
	</head>
	<body class="ovh">
		<%@include file="../V1/topMenu.html" %>
		<div class="pd10 table-scroll" id="content">
			<div class="clear m-b-10" id="topSearch">
				<div class="btn-group pull-left">
					<button type="button" class="btn btn-white btn-tabinfo timeType" @click="clkTimeType(1)">月</button>
					<button type="button" class="btn btn-white timeType" @click="clkTimeType(2)">季</button>
					<button type="button" class="btn btn-white timeType" @click="clkTimeType(3)">半年</button>
					<button type="button" class="btn btn-white timeType" @click="clkTimeType(4)">年</button>
					<input v-show=" time_type ==1 " v-model="starttime" class="form-control Wdate m-l-10" type="text" @click="WdatePickMonth" />
					<input v-show=" time_type !=1 " v-model="starttime" class="form-control Wdate m-l-10" type="text" @click="WdatePickYear" />
					<select v-show=" time_type == 2 || time_type == 3" class="form-control width-90 m-l-10" v-model="timeInterval">
						<option v-for="item in timeIntervalList " :value="item">{{item }}</option>
					</select>
				</div>
				<div class="pull-right" style="margin-right: 20px">已统计<span v-html="totalDays" style="color: deepskyblue;margin: 0px 2px">{{totalDays}}</span>天</div>
			</div>
			<!--表格+图表排名-->
			<div class="ovh" id="districtRank">
				<div class="pull-left bgf chunk-set" style="width: 400px;">
					<div class="chunk-title">区县PM<sub>2.5</sub>排名</div>
					<div class="chunk-body" style="height: 365px;width: 100%">
						<vuetable ref="vuetable" api-url="${coreApiPath}/target/analysis/pm25Rank" http-method="post" :fields="fields" :table-height="tableHeight" pagination-path="pagination" :sort-order="sortOrder" :multi-sort="multiSort" :load-on-start="loadOnStart" :per-page="perPage" :append-params="moreParams" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess">
						</vuetable>
					</div>
				</div>
				<div class="bgf pull-right chunk-set" style="width: calc(100% - 410px);">
					<div class="chunk-title">区县PM<sub>2.5</sub>排名
					</div>
					<div class="chunk-body" style="height: 365px;width: 100%" id="districtRankChar">
					</div>
				</div>
			</div>
			<!--表格+图表排名 2-->
			<div class="ovh m-t-10" id="airDaysRank">
				<div class="pull-left bgf chunk-set" style="width: 400px;">
					<div class="chunk-title">空气质量天数排名
						<div class="pull-right m-r-10">
							<select v-model="moreParams.aqiLevel" @click="onSelectedOption" class="form-control">
								<option value="1">优</option>
								<option value="2">良</option>
								<option value="3">轻度</option>
								<option value="4">中度</option>
								<option value="5">重度</option>
								<option value="6">严重</option>
							</select>
						</div>
					</div>
					<div class="chunk-body" style="height: 365px;width: 100%">
						<vuetable ref="vuetable" api-url="${coreApiPath}/target/analysis/airDaysRank" http-method="post" :fields="fields" :table-height="tableHeight" pagination-path="pagination" :sort-order="sortOrder" :multi-sort="multiSort" :load-on-start="loadOnStart" :per-page="perPage" :append-params="moreParams" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess">
						</vuetable>
					</div>
				</div>
				<div class="bgf pull-right chunk-set" style="width: calc(100% - 410px);">
                    <div class="chunk-title">空气质量天数排名</div>
					<div class="chunk-body" style="height: 365px;width: 100%" id="airDataRankChar">
					</div>
				</div>
			</div>
			<!--表格+图表排名 3-->
			<div class="ovh" id="dayChars">
				<div class="m-t-10 p-l-0" :class="{'col-xs-6':showCol6,'col-xs-12':showCol12}">
					<div class="chunk-set bgf">
						<div class="chunk-title">空气质量天数状况</div>
						<div class="chunk-body" style="height: 365px;width: 100%" id="daysStackChar">
						</div>
					</div>
				</div>
				<div class=" m-t-10 col-xs-6  p-r-0" v-show="showCol6">
					<div class="chunk-set bgf">
						<div class="chunk-title">优良天数同比率</div>
						<div class="chunk-body" style="height: 365px;width: 100%" id="daysTongBiChar">
						</div>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="${ctx }/resources/js/cityData/districtScorn_Analysis.js"></script>
		<script type="text/javascript" src="../../resources/js/common/common.js"></script>
		<script type="text/javascript">
		     $(document).ready(function() {
		         $(window).resize(function() {
		             calcOverflowH(1, "table-scroll", 40);
		         });
		     });
		     calcOverflowH(1, "table-scroll", 40);
		</script>
	</body>
</html>