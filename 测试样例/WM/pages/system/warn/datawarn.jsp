<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../include.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <title>蛙鸣科技 | 数据告警</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table-sort.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/report/Init_Reporttime.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/report/report-common.js"></script>
</head>
<body class="ovh">
<%@ include file="../../V1/topMenu.jsp" %>
<div id="content" class="pd10 table-scroll">
    <div class="tabs-container">
        <ul class="nav nav-tabs chunk-set" id="tabContainer">
            <li class="active" v-if="'ROLE_FUN_101_02_01' in allFunctions">
                <a data-toggle="tab" href="#tab-realWarnCount" aria-expanded="true">实时告警统计</a>
            </li>
            <li class="" v-if="'ROLE_FUN_101_02_02' in allFunctions">
                <a data-toggle="tab" href="#tab-historyWarnCount" onclick='tohistorySearch()' aria-expanded="true">历史告警统计</a>
            </li>
        </ul>
        <div class="tab-content" id="scrollObj">
            <div id="tab-realWarnCount" class="tab-pane active">
                <!--实时告警搜索条件 begin-->
                <div class="pd10 bgf b-radius-footer">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5">告警类型</label>
                            <select class="form-control " v-model="real_warn_type">
                                <option value="-1">全部</option>
                                <option :value="option.code" v-for="option in real_warn_type_list">{{option.text}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">告警级别</label>
                            <select class="form-control " v-model="real_warn_grade">
                                <option value="-1">全部</option>
                                <option :value="option.code" v-for="option in real_warn_grade_list">{{option.text}}
                                </option>
                            </select>
                        </div>
                        <!--污染物类别和气象类别切换begin  -->
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">污染物</label>
                            <input type="radio" name='radioN' checked="checked" value="1" v-model='real_radio_Pcategory'/>
                            <label class="m-l-10">气象类别</label>
                            <input type="radio" name='radioN' value="2" v-model='real_radio_Pcategory'/>
                        </div>
                        <div class="form-group" v-if="real_radio_Pcategory==1">
                            <label class="m-l-20 m-r-5">污染类型</label>
                            <select class="form-control " v-model="real_pollution_type">
                                <option value="-1">全部</option>
                                <option value="pm25">PM25</option>
                                <option value="pm10">PM10</option>
                                <option value="co">CO</option>
                                <option value="so2">SO2</option>
                                <option value="o3">O3</option>
                                <option value="no2">NO2</option>
                            </select>
                        </div>
                        <div class="form-group" v-else>
                            <label class="m-l-20  m-r-5">气象类型</label>
                            <select class="form-control " v-model="real_weather_type">
                                <option value="-1">全部</option>
                                <option value="temperature">设备温度</option>
                                <option value="temperature_out">温度</option>
                                <option value="humidity">设备湿度</option>
                                <option value="humidity_out">湿度</option>
                                <option value="pressure">气压</option>
                                <option value="wind_power">风速</option>
                                <option value="wind_direction">风向</option>
                            </select>
                        </div>
                        <!--污染物类别和气象类别切换end-->
                        <div class="form-group">
                            <label class="m-l-20  m-r-5">站点编号</label>
                            <input v-model="real_station_num" class="form-control" type="text" placeholder="请输入站点编号">
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn btn-info" @click="realSearch">查询</button>
                        </div>
                    </div>
                </div>
                <!--实时告警搜索条件end	-->
                <!--搜索结果begin-->
                <div class="table-responsive bgf m-t-10">
                    <!-- 列表开始 -->
                    <div class="vuetabletable-loadanimation clear">
                        <vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/warn/data/realtime"
                                  pagination-path="" :fields="real_fields" :multi-sort="true" :load-on-start="false"
                                  table-class="table table-bordered table-striped table-hover"
                                  ascending-icon="glyphicon glyphicon-chevron-up"
                                  descending-icon="glyphicon glyphicon-chevron-down"
                                  pagination-class="" pagination-info-class=""
                                  pagination-component-class="" :append-params="real_params"
                                  :per-page="real_perPage" wrapper-class="vuetable-wrapper"
                                  table-wrapper=".vuetable-wrapper" loading-class="loading"></vuetable>
                        <!--:query-params="{ sort:'sortProp'}"-->
                    </div>
                    <!-- 列表结束 -->
                </div>
                <!--搜索结果end-->
                <!--实时告警弹窗begin-->
                <div class="modal" id="real_detailModal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content animated">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                                        class="sr-only">Close</span></button>
                                <h4 class="modal-title">数据告警详情</h4>
                            </div>
                            <div class="modal-body ovh">
                                <div class="ovh">
                                    <div class="m-b-10">
                                        <label>站点编号：</label>
                                        <label class="p-r-20" v-model="real_pop_stationid" v-html='real_pop_stationid'></label>
                                        <label>告警级别：</label>
                                        <label class="p-r-20" v-model="real_pop_original_Grade" v-html="real_pop_original_Grade"></label>
                                        <label>告警次数：</label>
                                        <label class="p-r-20" v-model="real_pop_original_count" v-html="real_pop_original_count"></label>
                                    </div>
                                    <label>站点地址：</label>
                                    <label class="p-r-10" v-model="real_pop_address" v-html="real_pop_address"></label>
                                    <!--表格结束-->
                                </div>
                                <!--告警曲线开始-->
                                <div id="warnDetailChart" style="width: 568px; height: 250px;display: none;"></div>
                                <!--告警曲线结束-->
                                <!--实时告警表格begin  -->
                                <div class="data-grid m-t-10" id="real_pop-table">
                                    <div class="data-view" id="real_table">
                                    </div>
                                </div>
                                <!--实时告警表格end-->
                            </div>
                        </div>
                    </div>
                </div>
                <!--实时告警弹窗end-->
            </div>
            <div id="tab-historyWarnCount" class="tab-pane ">
                <!--实时告警搜索条件 begin-->
                <div class="pd10 bgf b-radius-footer">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5">告警类型</label>
                            <select class="form-control " v-model="history_warn_type">
                                <option value="-1">全部</option>
                                <option :value="option.code" v-for="option in history_warn_type_list">{{option.text}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20  m-r-5">告警级别</label>
                            <select class="form-control " v-model="history_warn_grade">
                                <option value="-1">全部</option>
                                <option v-for="option in history_warn_grade_list" value="{{option.code}}">
                                    {{option.text}}
                                </option>
                            </select>
                        </div>
                        <!--污染物类别和气象类别切换begin-->
                        <div class="form-group">
                            <label class="m-l-20  m-r-5">污染物</label>
                            <input type="radio" name='radioNhistory' checked="checked" value="1" v-model='history_radio_Pcategory'/>
                            <label class="m-l-10">气象类别</label>
                            <input type="radio" name='radioNhistory' value="2" v-model='history_radio_Pcategory'/>
                        </div>
                        <div class="form-group" v-if="history_radio_Pcategory==1">
                            <label class="m-l-20  m-r-5">污染类型</label>
                            <select class="form-control " v-model="history_pollution_type">
                                <option value="-1">全部</option>
                                <option value="pm25">PM25</option>
                                <option value="pm10">PM10</option>
                                <option value="co">CO</option>
                                <option value="so2">SO2</option>
                                <option value="o3">O3</option>
                                <option value="no2">NO2</option>
                            </select>
                        </div>
                        <div class="form-group" v-else>
                            <label class="m-l-20  m-r-5">气象类型</label>
                            <select class="form-control " v-model="history_weather_type">
                                <option value="-1">全部</option>
                                <option value="temperature">设备温度</option>
                                <option value="temperature_out">温度</option>
                                <option value="humidity">设备湿度</option>
                                <option value="humidity_out">湿度</option>
                                <option value="pressure">气压</option>
                                <option value="wind_power">风速</option>
                                <option value="wind_direction">风向</option>
                            </select>
                        </div>
                        <!--污染物类别和气象类别切换end-->
                        <div class="form-group">
                            <label class="m-l-20  m-r-5">最后一次异常时间</label>
                            <div class="input-group input-daterange">
                                <input id="history_startTime" v-model="history_startTime" class="form-control Wdate" type="text" placeholder="异常开始时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH',isShowClear:false,isShowToday: false,maxDate:'#F{$dp.$D(\'history_endTime\');}'})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="history_endTime" v-model="history_endTime" class="form-control Wdate" type="text" placeholder="异常结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH',isShowClear:false,isShowToday: false, maxDate:'%y-%M-{%d+1}'})"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20  m-r-5">站点编号</label>
                            <input v-model="history_station_num" class="form-control" type="text" placeholder="请输入站点编号">
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn btn-info" @click="historySearch">查询</button>
                        </div>
                    </div>
                </div>
                <!--实时告警搜索条件end	-->
                <!--搜索结果begin-->
                <div class="table-responsive bgf m-t-10">
                    <!-- 列表开始 -->
                    <div class="vuetabletable-loadanimation clear">
                        <vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/warn/data/history" pagination-path=""
                                  :fields="history_fields" ascending-icon="glyphicon glyphicon-chevron-up" :load-on-start="false"
                                  descending-icon="glyphicon glyphicon-chevron-down" table-class="table table-bordered table-striped table-hover"
                                  pagination-class="" pagination-info-class="" pagination-component-class=""
                                  :append-params="history_params" :per-page="history_perPage"
                                  wrapper-class="vuetable-wrapper1" table-wrapper=".vuetable-wrapper1"
                                  loading-class="loading"></vuetable>
                    </div>
                    <!-- 列表结束 -->
                </div>
                <!--搜索结果end-->
                <!--历史告警弹窗begin-->
                <div class="modal" id="history_detailModal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content animated">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                                        class="sr-only">Close</span></button>
                                <h4 class="modal-title">历史数据告警详情</h4>
                            </div>
                            <div class="modal-body ovh">
                                <div class="ovh">
                                    <div class="m-b-10">
                                        <!--表格开始-->
                                        <label>站点编号：</label>
                                        <label class="p-r-20" v-html="history_pop_stationid" v-model='history_pop_stationid'></label>
                                        <label>告警级别：</label>
                                        <label class="p-r-20" v-html="history_pop_original_Grade" v-model='history_pop_original_Grade'></label>
                                        <label>告警次数：</label>
                                        <label class="p-r-20" v-html="history_pop_original_count" v-model='history_pop_original_count'></label>
                                        <label>关闭告警时间：</label>
                                        <label class="p-r-20" v-html='history_pop_last_OccurcloseTime' v-model='history_pop_last_OccurcloseTime'></label>
                                    </div>
                                    <label>站点地址：</label>
                                    <label class="p-r-20" v-html='history_pop_address' v-model='history_pop_address'></label>
                                    <label>备注：</label>
                                    <label class="p-r-20" v-html='history_pop_close_msg' v-model='history_pop_close_msg'></label>
                                    <!--表格结束-->
                                </div>
                                <!--告警曲线开始-->
                                <div id="historywarnDetailChart" style="width: 568px; height: 250px; display: none;"></div>
                                <!--告警曲线结束-->
                                <!--历史告警表格开始-->
                                <div class="data-grid m-t-10" id="history_pop-table">
                                    <div class="data-view" id="history_table">
                                    </div>
                                </div>
                                <!--历史告警表格结束-->
                            </div>
                        </div>
                    </div>
                </div>
                <!--历史告警弹窗end-->
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/system/warn/datawarn.js"></script>
<script type="text/javascript">
    //计算左右树与右侧的表格对齐
    calcOverflowH(0, 'scrollObj', 100);
    window.onresize = function () {
        calcOverflowH(0, 'scrollObj', 100);
    }
	$(document).ready(function() {
         $(window).resize(function() {
             calcOverflowH(1, "table-scroll", 40);
         });
     });
     calcOverflowH(1, "table-scroll", 40);
</script>
</body>
</html>