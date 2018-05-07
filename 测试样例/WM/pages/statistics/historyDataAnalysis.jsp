<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../VueMulitTable.jsp" %>
<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 历史同期数据分析</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link href="${ctx}/resources/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/report/Init_Reporttime.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/report/report-common.js"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/My97DatePicker/WdatePicker.js"></script>
</head>

<body>
<%@ include file="../V1/topMenu.jsp" %>
<div class="pd10" id="content">
    <div class='panel-left' :class="{'min-marginright':!tabActivefg,'min-sucerData-left':tabActivefg && btn_toogle_statue==1}">
        <div class="tabs-container">
            <ul class="nav nav-tabs bgf">
                <li class="active" v-if="'ROLE_FUN_003_004_01' in allFunctions">
                    <a data-toggle="tab" href="#tab-byDistrict" aria-expanded="true" @click="tabChange(false,'byDistrict')">区县统计</a>
                </li>
                <li v-if="'ROLE_FUN_003_004_02' in allFunctions">
                    <a data-toggle="tab" href="#tab-byStation" aria-expanded="true" @click="tabChange(true,'byStation')">站点统计</a>
                </li>
                <li v-if="'ROLE_FUN_003_004_03' in allFunctions">
                    <a data-toggle="tab" href="#tab-allDistrict" aria-expanded="true" @click="tabChange(false,'allDistrict')">全部区县</a>
                </li>
                <li v-if="'ROLE_FUN_003_004_04' in allFunctions">
                    <a data-toggle="tab" href="#tab-allStation" aria-expanded="true" @click="tabChange(false,'allStation')">全部站点</a>
                </li>
            </ul>
            <div class="tab-content">
                <div id="tab-byDistrict" class="tab-pane active">
                    <!--站点统计搜索条件 begin-->
                    <div class="pd10 chunk-set ovh">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="m-r-5 ">选择年份</label>
                                <div class="input-group input-daterange">
                                    <input id="startTime_byDistrict" v-model="startTime" class="form-control Wdate " type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y',
											onpicking:function(dp){report.startTime=dp.cal.getNewDateStr();}})"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="m-r-5 m-l-20">区县</label>
                                <select id="districtSelect" v-model="districtSelect" class="form-control">
                                    <option value="">请选择</option>
                                    <option v-for="item in districtList" v-bind:value="item.id">{{item.name}}</option>
                                </select>
                            </div>
                            <div class="form-group pull-right">
                                <button type="button" class="btn btn-md btn-info" @click="queryHistoryDataAnalysis('byDistrict')">查询</button>
                            </div>
                        </div>
                    </div>
                    <!--站点统计搜索条件end	-->
                    <div class="clear m-t-10 btn-group">
                        <button class="btn btn-white grounp_byDistrict btn-tabinfo" @click="toggleBtnStatue('byDistrict','aqi')"> AQI</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'pm25')"> PM2.5</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'pm10')"> PM10</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'co')"> CO</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'so2')"> SO2</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'no2')"> NO2</button>
                        <button class="btn btn-white grounp_byDistrict" @click="toggleBtnStatue('byDistrict', 'o3')"> O3</button>
                    </div>
                    <!--搜索结果begin-->
                    <div id="resultTableDiv_byDistrict" class="table-responsive xhideyauto m-t-10 clear">
                        <!--图表开始-->
                        <div id="echart_byDistrict" class="bgf chunk-set" style="width: 100%; height: 350px"></div>
                        <!--图表结束-->
                    </div>
                    <!-- 列表开始 -->
                    <div class="m-t-10">
                        <v-table ref="tabbyDistrict" is-horizontal-resize style="width:100%" :height="600" even-bg-color="#f2f2f2" :title-rows="tabbyDistrict.byDistrictRows" :columns="tabbyDistrict.byDistrictColumns"
                                 :table-data="tabbyDistrict.byDistrictData" row-hover-color="#eee" row-click-color="#eee"></v-table>
                    </div>
                    <!-- 列表结束 -->
                    <!--搜索结果end-->
                </div>
                <div id="tab-byStation" class="tab-pane">
                    <!--站点统计搜索条件 begin-->
                    <div class="pd10 chunk-set ovh">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="m-r-5 ">选择年份</label>
                                <div class="input-group input-daterange">
                                    <input id="startTime_byStation" class="form-control Wdate " type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y'})"/>
                                </div>
                            </div>
                            <div class="form-group pull-right">
                                <button type="button" class="btn btn-md btn-info" @click="queryHistoryDataAnalysis('byStation')">查询</button>
                            </div>
                        </div>
                    </div>
                    <!--站点统计搜索条件end	-->
                    <div class="clear m-t-10">
                        <button class="btn btn-white grounp_byStation btn-tabinfo" @click="toggleBtnStatue('byStation', 'aqi')"> AQI</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'pm25')"> PM2.5</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'pm10')"> PM10</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'co')"> CO</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'so2')"> SO2</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'no2')"> NO2</button>
                        <button class="btn btn-white grounp_byStation m-l--5" @click="toggleBtnStatue('byStation', 'o3')"> O3</button>
                    </div>
                    <!--搜索结果begin-->
                    <div id="resultTableDiv_byStation" class="table-responsive m-t-10 xhideyauto clear bgf chunk-set">
                        <!--  style="max-height: 500px;" -->
                        <div id="select_station" class="chunk-title">已选站点为：--</div>
                        <!--图表开始-->
                        <div id="echart_byStation" class="bgf " style="width: 100%; height: 350px;"></div>
                        <!--图表结束-->
                    </div>
                    <!-- 列表开始 -->
                    <div class="m-t-10">
                        <v-table ref="tabbyStation" is-horizontal-resize style="width:100%" :height="700" even-bg-color="#f2f2f2" :title-rows="tabbyStation.byStationRows" :columns="tabbyStation.byStationColumns"
                                 :table-data="tabbyStation.byStationData" row-hover-color="#eee" row-click-color="#eee"></v-table>
                    </div>
                    <!-- 列表结束 -->
                    <!--搜索结果end-->
                </div>
                <div id="tab-allDistrict" class="tab-pane ">
                    <!--站点统计搜索条件 begin-->
                    <div class="pd10 chunk-set ovh">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="m-r-5 ">选择年份</label>
                                <div class="input-group input-daterange">
                                    <input id="startTime_allDistrict" class="form-control Wdate " type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-{%M-1}'})"/>
                                </div>
                            </div>
                            <div class="form-group pull-right">
                                <button type="button" class="btn btn-md btn-tabinfo" @click="queryHistoryDataAnalysis('allDistrict')">查询</button>
                            </div>
                        </div>
                    </div>
                    <!--站点统计搜索条件end	-->
                    <div class="clear m-t-10">
                        <button class="btn btn-white grounp_allDistrict btn-tabinfo" @click="toggleBtnStatue('allDistrict', 'aqi')"> AQI</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'pm25')"> PM2.5</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'pm10')"> PM10</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'co')"> CO</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'so2')"> SO2</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'no2')"> NO2</button>
                        <button class="btn btn-white grounp_allDistrict m-l--5" @click="toggleBtnStatue('allDistrict', 'o3')"> O3</button>
                    </div>
                    <!--搜索结果begin-->
                    <div id="resultTableDiv_allDistrict" class="table-responsive m-t-10 xhideyauto">
                        <!--图表开始-->
                        <div class="pull-left p-r-10 w50sc post-rel" id="tab_1chart">
                            <div class="post-abs zindex9 m-t-10 m-l-10">
                                <button class="btn-linetab" :class="{'btn-lineactive':btnStatue.allDistrict.better}" @click="toggleBtnStatue('top10_allDistrict', 1)"> 最优</button>
                                <button class="btn-linetab" :class="{'btn-lineactive':btnStatue.allDistrict.worst}" @click="toggleBtnStatue('top10_allDistrict', 0)"> 最差</button>
                            </div>
                            <div id="echart_top10_allDistrict" class="chunk-set bgf" style="width: 100%; height: 350px; "></div>
                        </div>
                        <div class="pull-left w50sc">
                            <div id="echart_top5_allDistrict" class="chunk-set bgf" style="width: 100%; height: 350px; "></div>
                        </div>
                        <!--图表结束-->
                    </div>
                    <!-- 列表开始 -->
                    <div class="m-t-10">
                        <v-table ref="taballDistrict" is-horizontal-resize style="width:100%" :height="500" even-bg-color="#f2f2f2" :title-rows="taballDistrict.allDistrictRows" :columns="taballDistrict.allDistrictColumns"
                                 :table-data="taballDistrict.allDistrictData" row-hover-color="#eee" row-click-color="#eee" :paging-index="(allDpageIndex-1)*allDpageSize"></v-table>
                    </div>
                    <div class="m-t-10 pull-right">
                        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="allDtotal" :page-size="allDpageSize" :layout="['total', 'prev', 'pager', 'next']"></v-pagination>

                    </div>
                    <!-- 列表结束 -->
                    <!--搜索结果end-->
                </div>
                <div id="tab-allStation" class="tab-pane">
                    <!--站点统计搜索条件 begin-->
                    <div class="pd10 chunk-set ovh">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="m-r-5 ">选择年份</label>
                                <div class="input-group input-daterange">
                                    <input id="startTime_allStation" class="form-control Wdate " type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-{%M-1}'})"/>
                                </div>
                            </div>
                            <div class="form-group pull-right">
                                <button type="button" class="btn btn-md btn-tabinfo" @click="queryHistoryDataAnalysis('allStation')">查询</button>
                            </div>
                        </div>
                    </div>
                    <!--站点统计搜索条件end	-->
                    <div class="clear m-t-10">
                        <button class="btn btn-white grounp_allStation btn-tabinfo" @click="toggleBtnStatue('allStation', 'aqi')"> AQI</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'pm25')"> PM2.5</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'pm10')"> PM10</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'co')"> CO</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'so2')"> SO2</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'no2')"> NO2</button>
                        <button class="btn btn-white grounp_allStation m-l--5" @click="toggleBtnStatue('allStation', 'o3')"> O3</button>
                    </div>
                    <!--搜索结果begin-->
                    <div id="resultTableDiv_allStation" class="table-responsive m-t-10 xhideyauto">
                        <!--图表开始-->
                        <div class="pull-left p-r-10 w50sc post-rel" id="tab_2chart">
                            <div class="post-abs zindex9 m-t-10 m-l-10">
                                <button class="btn-linetab" :class="{'btn-lineactive':btnStatue.allStation.better}" @click="toggleBtnStatue('top10_allStation', 1)"> 最优</button>
                                <button class="btn-linetab" :class="{'btn-lineactive':btnStatue.allStation.worst}" @click="toggleBtnStatue('top10_allStation', 0)"> 最差</button>
                            </div>
                            <div id="echart_top10_allStation" class="chunk-set" style="width: 100%; height: 350px; "></div>
                        </div>
                        <div class="pull-left w50sc">
                            <div id="echart_top5_allStation" class="chunk-set" style="width: 100%; height: 350px; "></div>
                        </div>
                        <!--图表结束-->
                    </div>
                    <!--搜索结果end-->
                    <!-- 列表开始 -->
                    <div class="m-t-10">
                        <v-table ref="taballStation" is-horizontal-resize style="width:100%;" :height="500" even-bg-color="#f2f2f2" :title-rows="taballStation.allStationRows" :columns="taballStation.allStationColumns"
                                 :table-data="taballStation.allStationData" row-hover-color="#eee" row-click-color="#eee"></v-table>
                    </div>
                    <div class="m-t-10 pull-right">
                        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="allStotal" :page-size="allSpageSize" :layout="['total', 'prev', 'pager', 'next']"></v-pagination>

                    </div>
                    <!-- 列表结束 -->
                </div>
            </div>
        </div>
    </div>
    <div class="panel-right rel-list-zcontent-show" v-show="tabActivefg">
        <div class="rel-btn-toogle" @click="toogleContianer">
            <span class="btn-jt-right"></span>
        </div>
        <div class="text-center post-rel">
            <input class="form-control icon-search" style="width: 190px;" v-model="stationId" type="text" @keyup.13="searchStation" placeholder="请输入站点编号或名称"/>
        </div>
        <!--类型下拉开始-->
        <div class="category-surverD text-center m-t-10 width-90" id="category-station">
            <a class="drop-down-a" @click="popWindwoShow('categ_popwindow')"> 类型</a>
            <div class="categ_popwindow" id="categ_popwindow" style="display: none;">
                <span class="popw_icon_triangle_bootom"></span>
                <!--站点详情开始-->
                <div class="categ_li">
                    <div class="list-type-surver">
                        <input disabled="disabled" type="checkbox" v-bind:checked="kh_all" @click="clk_kh_all" v-bind:true-value="1" v-bind:false-value="0"/>
                        <label class="m-r-10">考核站</label>
                    </div>
                    <ul class="list-s-name-surver">
                        <li v-for="item in khstationList"><input disabled="disabled" type="checkbox" v-bind:value="item.id" v-model="khli"/>
                            <label class="m-r-10">{{item.name}}</label></li>
                    </ul>
                    <div class="list-type-surver">
                        <input type="checkbox" v-bind:checked="wz_all" @click="clk_wz_all" v-bind:true-value="1" v-bind:false-value="0"/>
                        <label class="m-r-10">微站</label>
                    </div>
                    <ul class="list-s-name-surver">
                        <li v-for="item in wzstationList"><input type="checkbox" v-bind:value="item.id" v-model="wzli"/>
                            <label class="m-r-10">{{item.name}}</label></li>
                    </ul>
                    <div class="list-type-surver">
                        <%--扬尘站--%>
                        <li v-for="item in ycstationList"><input disabled="disabled" type="checkbox" v-bind:value="item.id" v-model="ycli"/><label class="m-r-10">{{item.name}}</label></li>
                    </div>
                    <div class="list-type-surver">
                        <input disabled="disabled" type="checkbox" v-bind:checked="pc_all" @click="clk_pc_all" v-bind:true-value="1" v-bind:false-value="0"/>
                        <label class="m-r-10">爬虫站</label>
                    </div>
                    <ul class="list-s-name-surver">
                        <li v-for="item in pcstationList"><input disabled="disabled" type="checkbox" v-bind:value="item.id" v-model="pcli"/>
                            <label class="m-r-10">{{item.name}}</label></li>
                    </ul>
                    <hr class="list-inline"/>
                    <div class="list-type-surver">
                        <input type="checkbox" v-bind:checked="district_all" @click="clk_district_all" v-bind:true-value="1" v-bind:false-value="0"/>
                        <label class="m-r-10">行政区</label>
                    </div>
                    <ul class="list-s-name-surver">
                        <li v-for="item in districtList"><input type="checkbox" v-bind:value="item.id" v-model="districtli"/>
                            <label class="m-r-10">{{item.name}}</label></li>
                    </ul>
                </div>
                <!--站点详情结束-->
                <div class="categ_2btn">
                    <button class="btn btn-info text-center col-sm-5 pull-left m-t-10" @click="queryStations">确定
                    </button>
                    <button class="btn btn-white text-center col -sm-5 pull-right m-t-10" @click="resiteSelStations">重置
                    </button>
                </div>
            </div>
        </div>
        <button class="btn pull-right m-t-10 width-90" :class="{'btn-info':mapOpenStatus.isActive,'btn-white':mapOpenStatus.noActive}" @click="openMap">地图点选</button>
        <!--类型下拉结束-->
        <!--右侧面板开始-->
        <div class="vuetabletable-loadanimation m-t-10 clear" id="station_info_list" style="overflow-y: auto;">
            <vuetable ref="vuetable" api-url="${requestScope.coreApiContextPath}/monitor/stationtype" http-method="post" fill-form="transformRight" track-by="stationId" :load-on-start="false" :fields="fields" :multi-sort="true"
                      :append-params="params" @vuetable:load-success="onRightLoadSuccess" @vuetable:loading="onRightLoading" @vuetable:loaded="onRightLoaded">
            </vuetable>
            <script type="text/javascript">
                var windowheight = $(window).height(),
                    vtable_height = windowheight - 150;
                $("#station_info_list").css("height", vtable_height + 'px');
                $("#resultTableDiv").height(windowheight - 100);
                $(window).resize(function () {
                    windowheight = $(window).height();
                    vtable_height = windowheight - 150;
                    $("#station_info_list").css("height", vtable_height + 'px');
                    $("#resultTableDiv").height(windowheight - 100);
                });
            </script>
        </div>
    </div>
    <div id="mapHtml" style="display: none;">
        <div class="tooltip-control mapbtn-danxActive post-abs map-Btnsurver-abs mapbtn-danxActive" title="点选站点"></div>
        <div id="allmap" style="height:100%;"></div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/resources/js/statistics/historyDataAnalysis.js"></script>
</body>

</html>