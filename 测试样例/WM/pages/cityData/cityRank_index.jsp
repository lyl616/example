
<%@include file="../includeJsCss.html" %>
<!DOCTYPE html>
<html>

<head>
	<title>蛙鸣科技 | 城市排名</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="renderer" content="webkit">
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css" />
	<%--<link rel="stylesheet" href="../../resources/plugins/jquery-ui/themes/base/minified/jquery-ui.min.css" rel="stylesheet"/>--%>
	<link rel="stylesheet" href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
	<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js "></script>
	<script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
	<script type="text/javascript" src="../../resources/js/report/report-common.js"></script>
	<style>
        span.align-right{width: 90px;display: inline-block;text-align: right;}
		.ui-btn {
			border: none;
			padding: 4px 0 0;
            color: black;
			background-color: transparent;
		}

        .btn-focus {
            color: #32A3F8;
            background-color: transparent;
            border-bottom: 2px solid #32A3F8;
        }

        .ui-btn:focus,
        .ui-btn:active:focus,
        .ui-btn.active:focus,
        .ui-btn.focus,
        .ui-btn:active.focus,
        .ui-btn.active.focus {
            color: #32A3F8;
            outline: none;
            border-color: transparent;
            border-bottom: 2px solid #32A3F8;
            box-shadow:none;
		}
	</style>
</head>

<body id="content" class="ovh">
<%@ include file="../V1/topMenu.html" %>
<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
<script type="text/javascript" src="../../resources/plugins/vue/vue-table-sort.js"></script>
<div class="tabs-container  table-scroll">
	<ul class="nav nav-tabs magin10">
		<li class="active">
			<a data-toggle="tab" href="#tab-aqci-rank" onclick="clickById('hid-aqci-tab')" aria-expanded="true">综合指数排名</a>
		</li>
		<li class="">
			<a data-toggle="tab" href="#tab-Zdayrank" onclick="clickById('hidreshTab')" aria-expanded="true">重污染天数排名</a>
		</li>
		<li class="">
			<a data-toggle="tab" href="#tab-ExcellentDayrank" onclick="clickById('hidDrateTab')" aria-expanded="true">优良天数排名</a>
		</li>
	</ul>
	<div class="tab-content" id="scrollObj">
		<div id="tab-Zdayrank" class="tab-pane">
			<input type="hidden" @click="refreshTab" id="hidreshTab">
			<div class="form-inline m-t-10 m-l-10 ovh">
				<!--第一组  -->
				<div class="num_1 pull-left">
					<button class="btn btn-tabinfo btn-white grounp_02" @click="dayRankCity">城市</button>
				</div>
				<!--第二组-->
				<div class="num_2 pull-left dib btn-group m-l-10">
					<button class="btn  btn-white btn-tabinfo m-l-10 grounp_03" @click="dayRankCityType(1,21)" title="京津冀大气污染传输通道">2+26</button>
					<button class="btn  btn-white m-l-10 grounp_03" @click="dayRankCityType(2,21)" title="长江三角洲城市群">长三角</button>
					<button class="btn  btn-white m-l-10 grounp_03" @click="dayRankCityType(3,21)" title="珠江三角洲城市群">珠三角</button>
					<button class="btn btn-white grounp_03 m-l--5" @click="dayRankCityType(4,22)" title="74城市">74</button>
					<button class="btn btn-white grounp_03 m-l--5" @click="dayRankCityType(5,22)" title="成渝城市群">成渝</button>
					<button class="btn  btn-white grounp_03 m-l--5" @click="dayRankCityType(6,23)" title="全国城市">338</button>
				</div>
				<!--第三组-->
				<div class="num_3 pull-left dib btn-group m-l-10">
					<button class="btn  btn-white btn-tabinfo m-l-10 grounp_04" @click="dayRankMonth(24)">月</button>
					<button class="btn  btn-white grounp_04 m-l--5" @click="dayRankYear(25)">年</button>
					<button class="btn  btn-white grounp_04 m-l--5" @click="dayRankCustom(26)">任意</button>
				</div>
				<div class="num_4 pull-left dib btn-group m-l-10 input-group input-daterange">
					<mycontent v-if="dayRank_timeType=='month'" :timetype="dayRank_timeType" :idx="'dayRank'"></mycontent>
					<mycontent v-if="dayRank_timeType=='year'" :timetype="dayRank_timeType" :idx="'dayRank'"></mycontent>
					<mycontent v-if="dayRank_timeType=='custom'" :timetype="dayRank_timeType" :idx="'dayRank'"></mycontent>
				</div>
			</div>

			<!--图表开始-->
			<div class="clear m-t-10">
				<div class="col-xs-6 p-l-10" id="tab_1chart">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">TOP10排名</div>
						<div class="post-rel zindex9 m-t-10">
							<button class="btn m-l-10 grounp_01 ui-btn btn-focus" @click="toggleBtnStatue(1)"> 最优</button>
							<button class="btn grounp_01 m-l-10 ui-btn" @click="toggleBtnStatue(0)"> 最差</button>
						</div>
						<div id="day_best10_echart" class="post-abs" style="width: 96%; height: 350px; opacity: 0; z-index: 1;"></div>
						<div id="day_bad10_echart" class="post-abs" style="width: 96%; height: 350px; z-index: 999;"></div>
					</div>
				</div>
				<div class="col-xs-6 p-r-10">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">城市改善TOP10排名</div>
						<div id="day_beter10_echart" class="m-t-20" style="width: 96%; height: 350px;"></div>
					</div>
				</div>
			</div>
			<!--图表结束-->
			<!--搜索结果begin-->
			<!-- 列表开始 -->
			<div class="vuetable-wrapper m-t-10 bgf b-radius4 m-l-10 m-r-10 m-b-10">
				<div class="vuetable-top ovh">
					<div class="pull-left m-t-5 m-l-10">
						<button class="btn btn-info" style="display: none;" id="dayRankBack" @click="dayRankBack"> 返回</button>
					</div>
					<div class="pull-right m-r-10">已统计：<b class="g09c f-s-16 lh200" v-model="dayRank_totalDays" id="dayRank_totalDays" v-html="dayRank_totalDays"></b></div>
				</div>
				<div class="vuetabletable-loadanimation">
					<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/envrank/badday/list" pagination-path="" :fields="dayRank_fields" :sort-order="dayRank_sortOrder" :multi-sort="true" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" :append-params="dayRank_params" :per-page="dayRank_perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
					<!--:query-params="{ sort:'sortProp'}"-->
				</div>
			</div>
			<!-- 列表结束 -->

			<!--搜索结果end-->
		</div>
		<div id='tab-ExcellentDayrank' class="tab-pane">
			<input type="hidden" @click="refrechDrateTab" id="hidDrateTab">

			<div class="form-inline m-t-10 m-l-10 ovh">
				<!--第一组  -->
				<div class="num_1 pull-left">
					<button class="btn  btn-tabinfo btn-white grounp_12" @click="drateCity">城市</button>
				</div>
				<!--第二组-->
				<div class="num_22  pull-left dib btn-group  m-l-10">
					<button class="btn btn-white btn-tabinfo m-l-10 grounp_13" @click="drateCityType(1,31)" title="京津冀大气污染传输通道">2+26</button>
					<button class="btn btn-white grounp_13 m-l--5" @click="drateCityType(2,32)" title="长江三角洲城市群">长三角</button>
					<button class="btn btn-white grounp_13 m-l--5" @click="drateCityType(3,32)" title="珠江三角洲城市群">珠三角</button>
					<button class="btn btn-white grounp_13 m-l--5" @click="drateCityType(4,32)" title="74城市">74</button>
					<button class="btn btn-white grounp_13 m-l--5" @click="drateCityType(5,32)" title="成渝城市群">成渝</button>
					<button class="btn btn-white grounp_13 m-l--5" @click="drateCityType(6,33)" title="全国城市">338</button>
				</div>
				<!--第三组-->
				<div class="num_3  pull-left dib btn-group  m-l-10">
					<button class="btn btn-white btn-tabinfo m-l-10 grounp_14" @click="drateMonth(34)">月</button>
					<button class="btn  btn-white grounp_14 m-l--5" @click="drateYear(35)">年</button>
					<button class="btn  btn-white grounp_14 m-l--5" @click="drateCustom(36)">任意</button>
				</div>
				<div class="num_4 pull-left dib btn-group m-l-10 input-group input-daterange">
					<mycontent v-if="drate_timeType=='month'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
					<mycontent v-if="drate_timeType=='year'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
					<mycontent v-if="drate_timeType=='custom'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
				</div>
			</div>

			<!--图表开始-->
			<div class="clear m-t-10">
				<div class="col-xs-6 p-l-10" id="tab_2chart">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">TOP10排名</div>
						<div class="post-abs zindex9 m-t-10">
							<button class="btn m-l-10 grounp_11 ui-btn btn-focus" @click="toggleBtnStatueB(1)"> 最优</button>
							<button class="btn m-l-10 grounp_11 ui-btn" @click="toggleBtnStatueB(0)">最差</button>
						</div>
						<div id="drate_best10_echart" class="post-abs" style="height: 350px; z-index: 999; width:100%;"></div>
						<div id="drate_bad10_echart" class="post-abs" style="height: 350px; opacity: 0; z-index: 1;"></div>
					</div>
				</div>
				<div class="col-xs-6 p-r-10">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">城市改善TOP5排名</div>
						<div id="drate_beter10_echart" style="height: 350px;"></div>
					</div>
				</div>
			</div>
			<!--图表结束-->
			<!--搜索结果begin-->
			<div class="vuetable-wrapper m-t-10 bgf b-radius4 m-l-10 m-r-10 m-b-10">
				<div class="vuetable-top ovh">
					<div class="pull-left m-t-5 m-l-10">
						<button class="btn btn-info" style="display: none;" id="drateBack" @click="drateBack">返回</button>
					</div>
					<div class="pull-right m-r-10">已统计：<b class="g09c f-s-16 lh200" v-model="drate_totalDays" id="drate_totalDays" v-html="drate_totalDays"></b></div>
				</div>
				<!-- 列表开始 -->
				<div class="vuetabletable-loadanimation">
					<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/envrank/goodday/list" pagination-path="" :fields="drate_fields" :multi-sort="true" :sort-order="drate_sortOrder" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" load-on-start="false" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" :append-params="drate_params" :per-page="drate_perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
				</div>
				<!-- 列表结束 -->
			</div>
		</div>
		<!--搜索结果end-->
		<div id='tab-aqci-rank' class="tab-pane active">
			<input type="hidden" @click="refreshAll" id="hid-aqci-tab">

			<div class="form-inline m-t-10 m-l-10 ovh">
				<!--第一组  -->
				<div class="num_1 pull-left">
					<button class="btn btn-tabinfo btn-white grounp_22" @click="drateCity">城市</button>
				</div>
				<!--第二组-->
				<div class="num_22 pull-left dib btn-group m-l-10">
					<button class="btn btn-white btn-tabinfo m-l-10 grounp_23" @click="drateCityType(1,31)" title="京津冀大气污染传输通道">2+26</button>
					<button class="btn btn-white grounp_23 m-l--5" @click="drateCityType(2,32)" title="长江三角洲城市群">长三角</button>
					<button class="btn btn-white grounp_23 m-l--5" @click="drateCityType(3,32)" title="珠江三角洲城市群">珠三角</button>
					<button class="btn btn-white grounp_23 m-l--5" @click="drateCityType(4,32)" title="74城市">74</button>
					<button class="btn btn-white grounp_23 m-l--5" @click="drateCityType(5,32)" title="成渝城市群">成渝</button>
					<button class="btn btn-white grounp_23 m-l--5" @click="drateCityType(6,33)" title="全国城市">338</button>
				</div>
				<div class="num_3 pull-left dib btn-group m-l-10">
					<button class="btn btn-white m-l-10 btn-tabinfo grounp_25" @click="changePollution(1,'aqci')">综指</button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(2,'pm25')">PM<sub>2.5</sub></button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(3,'pm10')">PM<sub>10</sub></button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(4,'co')">CO</button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(5,'so2')">SO<sub>2</sub></button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(6,'no2')">NO<sub>2</sub></button>
					<button class="btn btn-white grounp_25 m-l--5" @click="changePollution(7,'o3')">O<sub>3</sub></button>
				</div>
				<!--第三组-->
				<div class="num_3  pull-left dib btn-group  m-l-10">
					<button class="btn btn-white m-l-10 grounp_24 btn-tabinfo" @click="drateMonth(34)">月</button>
					<button class="btn btn-white grounp_24 m-l--5" v-show="pollution != 'aqci'" @click="drateYear(35)">年</button>
					<button class="btn btn-white grounp_24 m-l--5" v-show="pollution != 'aqci'" @click="drateCustom(36)">任意</button>
				</div>
				<div class="num_4 pull-left dib btn-group m-l-10 input-group input-daterange">
					<mycontent v-if="drate_timeType=='month'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
					<mycontent v-if="drate_timeType=='year'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
					<mycontent v-if="drate_timeType=='custom'" :timetype="drate_timeType" :idx="'drate'"></mycontent>
				</div>
			</div>

			<!--图表开始-->
			<div class="clear m-t-10">
				<div class="col-xs-6 p-l-10">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">TOP10排名</div>
						<div class="post-abs zindex9 m-t-10">
							<button class="btn m-l-10 grounp_21 ui-btn btn-focus" @click="toggleBtnStatueB(1)">最优</button>
							<button class="btn m-l-10 grounp_21 ui-btn" @click="toggleBtnStatueB(0)">最差</button>
						</div>
						<div id="aqci_best10_echart" class="post-abs" style="height: 350px; z-index: 999; width:100%;"></div>
						<div id="aqci_bad10_echart" class="post-abs" style="height: 350px; opacity: 0; z-index: 1;"></div>
					</div>
				</div>
				<div class="col-xs-6 p-r-10">
					<div class="chunk-set" style="height: 410px;">
						<div class="chunk-title">城市改善TOP5排名</div>
						<div id="aqci_goodrate10_echart" style="height: 350px;"></div>
					</div>
				</div>
			</div>
			<!--图表结束-->
			<!--搜索结果begin-->
			<div class="vuetable-wrapper m-t-10 bgf b-radius4 m-l-10 m-r-10 m-b-10">
				<div class="vuetable-top ovh">
					<div class="pull-left m-t-5 m-l-10">
						<button class="btn btn-tabinfo" style="display: none;" id="aqciBack" @click="drateBack">返回</button>
					</div>
					<div class="pull-right m-r-10">已统计：<b class="g09c f-s-16 lh200" v-model="drate_totalDays" id="drate_totalDays" v-html="drate_totalDays"></b></div>
				</div>
				<!-- 列表开始 -->
				<div class="vuetabletable-loadanimation">
					<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/envrank/badday/list" pagination-path="" :fields="drate_fields" :multi-sort="true" :sort-order="drate_sortOrder" table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" load-on-start="false" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" :append-params="drate_params" :per-page="drate_perPage" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
				</div>
				<!-- 列表结束 -->
			</div>
			<!--搜索结果end-->
		</div>
	</div>
</div>

<script type="text/javascript" src="../../resources/js/cityData/cityRank_index.js"></script>
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