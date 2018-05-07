<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../VueMulitTable.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 区县目标管理</title>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <!--引入下拉多选框样式-->
    <link href="${ctx}/resources/plugins/bootstrap-multiselect/css/bootstrap-multiselect.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-multiselect/js/bootstrap-multiselect.js"></script>
</head>
<body class="ovh">
<%@include file="../V1/topMenu.jsp" %>
<div class="pd10 table-scroll" id="content">
    <div class="top-search-container">
        <div class="form-inline">
            <div class="form-group">
                <label class="m-l-10 m-r-5">区县</label>
                <select id="district" multiple data-live-search="true" style="width:120px;height:23px">
                    <option>任城区</option>
                    <option>高新区</option>
                    <option>太白湖区</option>
                    <option selected>地市</option>
                    <option>市辖区</option>
                </select>
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">选择年份</label>
                <select id="time-year" class="form-control" name="type">
                    <option>2017年</option>
                    <option selected>2018年</option>
                    <option>2019年</option>
                    <option>2020年</option>
                    <option>2021年</option>
                </select>
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">年</label>
                <select id="year" multiple data-live-search="true">
                    <option>全年</option>
                    <option>上半年</option>
                    <option>下半年</option>
                </select>
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">季度</label>
                <select id="quarter" multiple data-live-search="true">
                    <option>第一季度</option>
                    <option>第二季度</option>
                    <option>第三季度</option>
                    <option>第四季度</option>
                </select>
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">月份</label>
                <select id="month" multiple data-live-search="true">
                    <option value="1月">1月</option>
                    <option value="2月">2月</option>
                    <option>3月</option>
                    <option>4月</option>
                    <option>5月</option>
                    <option>6月</option>
                    <option>7月</option>
                    <option>8月</option>
                    <option>9月</option>
                    <option>10月</option>
                    <option>11月</option>
                    <option>12月</option>
                </select>
            </div>
            <div class="form-group pull-right">
                <input type="button" class="btn btn-info pull-right" value="查询" @click="queryTableData"/>
            </div>
        </div>
    </div>
    <div class="m-t-10 p-l-10 table-head bgf" v-if="'ROLE_FUN_004_05_01' in allFunctions">
        <button id="btnSettingOrBack" class="btn btn-info m-t-5 m-b-5" @click="districtScornSetting">目标设置</button>
    </div>
    <v-table ref="tableScorn" is-horizontal-resize style="width:100%" :height="500" even-bg-color="#f2f2f2" :title-rows="tableScorn.tableScornRows" :columns="tableScorn.tableScornColumns" :table-data="tableScorn.tableScornData" row-hover-color="#eee"
             row-click-color="#eee" :row-click="onRowClick" :paging-index="(pageIndex-1)*pageSize"></v-table>
    <div class="b-radius-footer bgf ovh">
        <div class="m-t-10 pull-right">
            <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next']"></v-pagination>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx }/resources/js/cityData/districtScorn_Manager.js"></script>
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