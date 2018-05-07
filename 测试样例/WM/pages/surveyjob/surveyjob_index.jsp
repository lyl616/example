<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 勘查管理</title>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/My97DatePicker/WdatePicker.js"></script>
</head>

<body class="ovh">
<%@ include file="../V1/topMenu.jsp" %>
<div class="pd10  table-scroll" id="app">
    <!--搜索条开始-->
    <div class="top-search-container">
        <div class="form-inline">
            <label class="m-l-20 m-r-10 text-right" style="width: 60px;">任务单号</label>
            <div class="input-group">
                <input type="text" placeholder="请输入任务单号" v-model="searchRequest.jobCode"
                       class="form-control">
            </div>
            <select v-model="personType" class="m-l-20 m-r-10 form-control" style="width: 70px;">
                <option value="1">发布人</option>
                <option value="2">反馈人</option>
            </select>
            <div class="input-group">
                <input type="text" placeholder="请输入发布人名称" v-model="person"
                       class="form-control">
            </div>
            <select v-model="timeType" class="m-l-20 m-r-10 form-control" style="width: 90px;">
                <option value="1">发布时间</option>
                <option value="2">完成时间</option>
            </select>
            <div class="input-group">
                <input type="text" class="form-control Wdate w150"
                       id="searchStartTime"
                       v-model="startTime"
                       placeholder="开始时间"
                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss', maxDate:'#F{$dp.$D(\'searchEndTime\')}',
                                                       onpicking:function(dp){vm.startTime=dp.cal.getNewDateStr();},
                                                       oncleared:function(dp){vm.startTime='';}})"/>
                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                <input type="text" class="form-control Wdate w150"
                       id="searchEndTime"
                       v-model="endTime"
                       placeholder="截止时间"
                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss', maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'searchStartTime\')}',
                                                       onpicking:function(dp){vm.endTime=dp.cal.getNewDateStr();},
                                                       oncleared:function(dp){vm.endTime='';}})">
            </div>
            <label class="m-l-20 m-r-10 text-right">完成状态</label>
            <div class="input-group">
                <select class="form-control" v-model="searchRequest.state">
                    <option value="0">请选择</option>
                    <option value="1">未完成</option>
                    <option value="2">已完成</option>
                </select>
            </div>
        </div>
        <div class="form-inline p-t-10">
            <label class="m-l-20 m-r-10 text-right" style="width: 60px;">监测点编号</label>
            <div class="input-group">
                <input type="text" placeholder="请输入监测点编号" v-model="searchRequest.stationId"
                       class="form-control">
            </div>
            <div class="input-group pull-right">
                <input type="button" class="btn btn-info pull-right" value="搜索"
                       @click="surveyjobSearch"/>
            </div>
        </div>
    </div>
    <!--搜索条结束-->
    <!--表格开始-->
    <div class="chunk-set m-t-20">
        <!--currTab-->
        <div class="m-t-10 m-b-10 m-l-10 pull-left">
            <button v-if="'ROLE_FUN_006_02_01' in allFunctions" class="btn btn-info m-r-10" @click="addSurveyjob">新增</button>
            <button v-if="'ROLE_FUN_006_02_03' in allFunctions" class="btn btn-info m-r-10" @click="modifySurveyjob">修改</button>
            <button v-if="'ROLE_FUN_006_02_04' in allFunctions" class="btn btn-info m-r-10" @click="feedbackSurveyjob">反馈</button>
            <button v-if="'ROLE_FUN_006_02_02' in allFunctions" class="btn btn-danger" @click="deleteByIds">批量删除</button>
        </div>
        <div class="clear table-responsive xhideyauto">
            <vuetable ref="vuetable" api-url="${backendApiPath}/surveyjob/page"
                      http-method="post" :fields="fields" :table-height="tableHeight"
                      :per-page="perPage" :append-params="searchRequest"
                      track-by="jobCode"
                      :load-on-start="false"
                      pagination-path="pagination" @vuetable:pagination-data="onPaginationData"
                      @vuetable:load-success="onLoadSuccess" @vuetable:cell-mouseenter="onCellMouseEnter"
                      @vuetable:cell-mouseleave="onCellMouseLeave">
            </vuetable>
            <div class="vuetable-pagination">
                <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                <component :is="paginationComponent" ref="pagination"
                           @vuetable-pagination:change-page="onChangePage"></component>
            </div>
        </div>
    </div>
    <!--表格结束-->
</div>
<script type="text/javascript" src="${ctx}/pages/surveyjob/surveyjob_index.js"></script>
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