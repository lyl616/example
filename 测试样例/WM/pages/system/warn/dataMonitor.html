
<%@include file="../../includeVue.html" %>
<!DOCTYPE html>
<html>
<head>
    <title>蛙鸣科技 | 异常数据监控</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
</head>
<body class="ovh">
<%@ include file="../../V1/topMenu.html" %>

<div id="content" class="pd10 table-scroll">
    <div class="tabs-container">
        <ul class="nav nav-tabs chunk-set" id="tab-head">
            <li v-if="tabRealTime" class="active">
                <a data-toggle="tab" href="#tab-realtimeMonitor" onclick="realTimeSearch()" aria-expanded="true">实时监控</a>
            </li>
            <li v-if="tabHis" :class="{active:tabHis && !tabRealTime}">
                <a data-toggle="tab" href="#tab-historyLog" onclick="tohistorySearch()" aria-expanded="true">历史记录</a>
            </li>
        </ul>
        <div class="tab-content" id="scrollObj">
            <div id="tab-realtimeMonitor" class="tab-pane active">
                <!--实时告警搜索条件 begin-->
                <div class="pd10 bgf b-radius-footer">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5">设备编号</label>
                            <input type="text" class="form-control" v-model="equipmentId" placeholder="请输入设备编号"/>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">监测点</label>
                            <input type="text" class="form-control" v-model="stationName" placeholder="请输入监测点名称"/>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">异常类型</label>
                            <select class="form-control " v-model="exceptionType">
                                <option value="">全部</option>
                                <option v-for="item in exceptionTypeList" v-bind:value="item.code">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn btn-info" @click="realtimeExceptionSearch">查询</button>
                        </div>
                    </div>
                </div>
                <!--实时告警搜索条件end	-->
                <!--搜索结果begin-->
                <div class="table-responsive bgf m-t-10">
                    <div class="clear table-head">
                        <label class="p-t-10 p-b-10 p-l-10">{{currentTimeLabel}}</label>
                    </div>
                    <!-- 列表开始 -->
                    <div class="vuetabletable-loadanimation">
                        <vuetable ref="vuetable" api-url="${coreApiPath}/warn/dataMonitor/realtimeQuery" http-method="post" :fields="realtime_fields" :table-height="tableHeight" pagination-path="pagination"
                                  :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" @vuetable:pagination-data="onPaginationData"
                                  @vuetable:load-success="onLoadSuccess" @vuetable:loading="showLoader" @vuetable:loaded="hideLoader" @vuetable:initialized="onInitialized">
                        </vuetable>
                        <div class="vuetable-pagination">
                            <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                            <component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
                        </div>
                    </div>
                    <!-- 列表结束 -->
                </div>
                <!--搜索结果end-->
            </div>
            <div id="tab-historyLog"  class="tab-pane">
                <!--实时告警搜索条件 begin-->
                <div class="pd10 bgf b-radius-footer">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5">设备编号</label>
                            <input type="text" class="form-control" v-model="equipmentId" placeholder="请输入设备编号"/>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">监测点</label>
                            <input type="text" class="form-control" v-model="stationName" placeholder="请输入监测点名称"/>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">异常类型</label>
                            <select class="form-control " v-model="exceptionType">
                                <option value="">全部</option>
                                <option v-for="item in exceptionTypeList" v-bind:value="item.code">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">发生时间</label>
                            <div class="input-group input-daterange">
                                <input id="start_occurTime" onfocus="showDatePicker('start_occurTime')" v-model="start_occurTime" class="form-control Wdate w150" type="text" placeholder="开始时间"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <!-- onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:00'})" {dateFmt:'yyyy-MM-dd HH:mm:00',maxDate:'%y-%M-%d'})  -->
                                <input id="end_occurTime" onfocus="showDatePicker('end_occurTime')" v-model="end_occurTime" class="form-control Wdate w150" type="text" placeholder="结束时间"/>
                            </div>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn btn-info" @click="historyLogSearch">查询</button>
                        </div>
                    </div>
                </div>
                <!--实时告警搜索条件end	-->
                <!--搜索结果begin-->
                <div class="table-responsive bgf m-t-10">
                    <div class="clear table-head">
                        <label class="p-t-10 p-b-10 p-l-10">{{currentTimeLabel}}</label>
                    </div>
                    <!-- 列表开始 -->
                    <div class="vuetabletable-loadanimation">
                        <vuetable ref="vuetable" api-url="${coreApiPath}/warn/dataMonitor/historyLogQuery" http-method="post" :fields="historyLog_fields" :table-height="tableHeight" pagination-path="pagination" :load-on-start="loadOnStart"
                                  :sort-order="sortOrder" :multi-sort="multiSort" :per-page="perPage" :append-params="moreParams" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" @vuetable:pagination-data="onPaginationData"
                                  @vuetable:load-success="onLoadSuccess" @vuetable:loading="showLoader" @vuetable:loaded="hideLoader" @vuetable:initialized="onInitialized">
                        </vuetable>
                        <div class="vuetable-pagination">
                            <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                            <component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
                        </div>
                    </div>
                    <!-- 列表结束 -->
                </div>
                <!--搜索结果end-->
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
<script type="text/javascript" src="../../resources/js/system/warn/dataMonitor.js"></script>
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