
<%@include file="../includeJsCss.html" %>

<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 报表上传</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link type="text/css" rel="stylesheet" href="../../resources/plugins/bootstarp-fileinput/css/fileinput.css"/>
    <link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css"/>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
    <link rel="stylesheet" href="../../resources/plugins/webuploader/css/upload-files.css">
    <%--<script type="text/javascript" src="../../resources/plugins/bootstarp-fileinput/js/fileinput.min.js"></script>--%>
    <%--<script type="text/javascript" src="../../resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>--%>
    <%--<script type="text/javascript" src="../../resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>--%>
    <script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
    <script type="text/javascript" src="../../resources/js/report/report-common.js"></script>
</head>

<body>
<%@ include file="../V1/topMenu.html" %>
<div id="content" class="pd10">

    <div class="tabs-container bgf">
        <ul class="nav nav-tabs">
            <li class="active">
                <a data-toggle="tab" href="#tab-day" aria-expanded="true" @click="setCurrTimefg('day')">日报</a>
            </li>
            <li class="">
                <a data-toggle="tab" aria-expanded="true" href="#tab-week" @click="setCurrTimefg('week')">周报</a>
            </li>
            <li class="">
                <a data-toggle="tab" aria-expanded="true" href="#tab-month" @click="setCurrTimefg('month')">月报</a>
            </li>
            <li class="">
                <a data-toggle="tab" aria-expanded="true" href="#tab-qt" @click="setCurrTimefg('qt')">季报</a>
            </li>
            <li class="">
                <a data-toggle="tab" aria-expanded="true" href="#tab-year" @click="setCurrTimefg('year')">年报</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="tab-day" class="tab-pane active">
                <!--日报搜索条件 begin-->
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-l-10 m-r-5 ">区/县</label>
                            <select class="form-control " v-model="selected_district">
                                <option selected value="-1">全部</option>
                                <option v-for="option in report_district" :value="option.id">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告类型</label>
                            <select class="form-control " v-model="selected_category">
                                <option value="-1" selected>全部</option>
                                <option v-bind:value="option.code" v-for="option in report_category">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告时间</label>
                            <div class="input-daterange input-group">
                                <input id="day_startTime" v-model="day_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'day_endTime\',{d:-0});}'})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="day_endTime" v-model="day_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'day_startTime\',{d:0});}'})"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">报告名称</label>
                            <input v-model="report_name" class="form-control " type="text" placeholder="请输入报告名称">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告状态</label>
                            <select class="form-control " v-model="selected_status">
                                <option v-bind:value="option.code" v-for="option in status">{{option.text}}</option>
                            </select>
                        </div>

                        <div class="form-group pull-right">
                            <button type="button" class="btn  btn-info" @click="setSearchfg">查询</button>
                        </div>
                    </div>
                </div>
                <!--日报搜索条件end	-->
            </div>
            <div id="tab-week" class="tab-pane">
                <!--日报搜索条件 begin-->
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-l-10 m-r-5 ">区/县</label>
                            <select class="form-control " v-model="selected_district">
                                <option selected value="-1">全部</option>
                                <option v-for="option in report_district" :value="option.id">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告类型</label>
                            <select class="form-control " v-model="selected_category">
                                <option value="-1" selected>全部</option>
                                <option v-bind:value="option.code" v-for="option in report_category">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告时间</label>
                            <div class="input-daterange input-group">
                                <input id="week_startTime"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'week_endTime\',{d:-6});}',specialDays:[1],opposite:true,disabledDays:['2$','3$','4$','5$','6$','1$']})"
                                       v-model="week_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="week_endTime" v-model="week_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月dd日',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'week_startTime\',{d:0});}',specialDays:[0],opposite:true,disabledDays:['2$','3$','4$','5$','0$','1$']})"/>

                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告名称</label>
                            <input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告状态</label>
                            <select class="form-control " v-model="selected_status">
                                <option v-bind:value="option.code" v-for="option in status">{{option.text}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn  btn-info" @click="setSearchfg">查询</button>
                        </div>
                    </div>
                </div>
                <!--日报搜索条件end	-->
            </div>
            <div id="tab-month" class="tab-pane">
                <!--日报搜索条件 begin-->
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-l-10 m-r-5 ">区/县</label>
                            <select class="form-control " v-model="selected_district">
                                <option selected value="-1">全部</option>
                                <option v-for="option in report_district" :value="option.id">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告类型</label>
                            <select class="form-control " v-model="selected_category">
                                <option value="-1" selected>全部</option>
                                <option v-bind:value="option.code" v-for="option in report_category">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告时间</label>
                            <div class="input-daterange input-group">
                                <input id="month_startTime" v-model="month_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'month_endTime\');}'})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="month_endTime" v-model="month_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年MM月',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'month_startTime\');}'})"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告名称</label>
                            <input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告状态</label>
                            <select class="form-control " v-model="selected_status">
                                <option v-bind:value="option.code" v-for="option in status">{{option.text}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn  btn-info" @click="setSearchfg">查询</button>
                        </div>
                    </div>
                </div>
                <!--日报搜索条件end	-->
            </div>
            <div id="tab-qt" class="tab-pane">
                <!--日报搜索条件 begin-->
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5 m-l-10">区/县</label>
                            <select class="form-control " v-model="selected_district">
                                <option selected value="-1">全部</option>
                                <option v-for="option in report_district" :value="option.id">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告类型</label>
                            <select class="form-control " v-model="selected_category">
                                <option value="-1" selected>全部</option>
                                <option v-bind:value="option.code" v-for="option in report_category">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告时间</label>
                            <div class="input-daterange input-group">
                                <input id="qt_startTime" v-model="qt_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年M季度',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'qt_endTime\');}',disabledDates: ['....-0[5-9]-..', '....-1[0-2]-..'],startDate:'%y-01-01'})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="qt_endTime" v-model="qt_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年M季度',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'qt_startTime\');}',disabledDates: ['....-0[5-9]-..', '....-1[0-2]-..'],startDate:'%y-01-01'})"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告名称</label>
                            <input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告状态</label>
                            <select class="form-control " v-model="selected_status">
                                <option v-bind:value="option.code" v-for="option in status">{{option.text}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn  btn-info" @click="setSearchfg">查询</button>
                        </div>
                    </div>
                </div>
                <!--日报搜索条件end	-->
            </div>
            <div id="tab-year" class="tab-pane">
                <!--日报搜索条件 begin-->
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-r-5 m-l-10">区/县</label>
                            <select class="form-control " v-model="selected_district">
                                <option selected value="-1">全部</option>
                                <option v-for="option in report_district" :value="option.id">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告类型</label>
                            <select class="form-control " v-model="selected_category">
                                <option value="-1" selected>全部</option>
                                <option v-bind:value="option.code" v-for="option in report_category">{{option.text}}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告时间</label>
                            <div class="input-group input-daterange">
                                <input id="year_startTime" v-model="year_startTime" class="form-control Wdate" type="text" placeholder="报告开始时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'#F{$dp.$D(\'year_endTime\');}'})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input id="year_endTime" v-model="year_endTime" class="form-control Wdate" type="text" placeholder="报告结束时间"
                                       onfocus="WdatePicker({dateFmt:'yyyy年',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'year_startTime\');}'})"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">名称</label>
                            <input v-model="report_name" class="form-control" type="text" placeholder="请输入报告名称">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5 ">报告状态</label>
                            <select class="form-control " v-model="selected_status">
                                <option v-bind:value="option.code" v-for="option in status">{{option.text}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <button type="button" class="btn  btn-info" @click="setSearchfg">查询</button>
                        </div>
                    </div>
                </div>
                <!--日报搜索条件end	-->
            </div>

        </div>
    </div>
    <!--搜索结果begin-->
    <div class="vuetable-wrapper m-t-10 bgf b-radius4 m-b-10">
        <div class="vuetable-top">
            <div class="m-t-5 m-l-10 p-b-5">
                <button type="button" v-if="report.upload" id="fileimg" class="btn btn-info" @click="clearInputfile('UploadModal')" data-toggle="modal">上传报告</button>
                <button type="button" v-if="report.delete" id="deleteReport" class="btn btn-danger" @click="mulDelete" data-toggle="modal"> 删除报告</button>
            </div>
        </div>
        <!-- 列表开始 -->
        <div class="clear">
            <vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/statistics/getReportRecordUpload" pagination-path="" :fields="fields" :append-params="params" :per-page="perPage" :selected-to="selectedTo"
                      table-class="table table-bordered table-striped table-hover" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class=""
                      pagination-component-class="" wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" loading-class="loading">
            </vuetable>
        </div>
        <!-- 列表结束 -->

    </div>
    <!--搜索结果end-->

    <!--上传弹窗begin-->
    <div class="modal" id="UploadModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content animated">
                <div class="modal-header">
                    <button type="button" class="close" onclick="closeModalCallBack('UploadModal', clearUpload);"><span
                            aria-hidden="true">&times;</span>
                        <span class="sr-only">关闭</span>
                    </button>
                    <h4 class="modal-title">上传报告</h4>
                </div>
                <div class="modal-body ovh">
                    <!--上传控件begin-->
                    <%--<div style="width: 540px; height: 345px; margin: 0 auto;">--%>
                    <%--<div class="form-group" style="height: 250px;">--%>
                    <%--<input id="file-1" type="file" name="file" class="file" data-overwrite-initial="false" data-min-file-count="1">--%>
                    <%--</div>--%>
                    <%--</div>--%>
                    <!--上传控件end-->
                    <form method="post" id="reportUploadFrm" class="pd10">
                        <%--<form enctype="multipart/form-data" method="post" id="reportUploadFrm">--%>
                        <input type="hidden" id="report_pro" name="pro">
                        <input type="hidden" id="report_city" name="city">
                        <input type="hidden" id="report_name" name="reportName">
                        <input type="hidden" id="report_url" v-bind:value="report_url" name="reportUrl">
                        <input type="hidden" id="report_adminFlag" value="0" name="adminFlag">
                        <input type="hidden" value="1" name="source"/>
                        <div class="col-sm-12 m-t-5 m-b-10">
                            系统强制转换为标准文件名称：如城市+区域+报告类型+日期（大小不得超过5M）
                        </div>
                        <div class="form-inline clear ovh">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>报告类别</label>
                                    <select class="form-control w100 m-l-5" name="type" v-model="upload_selected_type" id="upload_selected_type">
                                        <option selected value="-1">请选择</option>
                                        <option v-bind:value="option.code" v-for="option in report_type ">
                                            {{option.text}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>区/县</label>
                                    <select class="form-control w100 m-l-5" name="district" v-model="upload_report_district">
                                        <option selected value="-1">请选择</option>
                                        <option v-for="option in report_district" :value="option.id">{{option.text}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>报告类型</label>
                                    <select class="form-control w100 m-l-5" name="category" v-model="upload_report_category">
                                        <option selected value="-1">请选择</option>
                                        <option v-bind:value="option.code" v-for="option in report_category">
                                            {{option.text}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-inline clear ovh m-t-10">
                            <div class="col-sm-5">
                                <div class="form-group">
                                    <label>开始日期</label>
                                    <input type="text" id="upload_startTime" class="form-control Wdate w120 m-l-5" v-model='upload_startTime' v-bind:value="upload_startTime" name="queryBeginTime"/>
                                </div>
                            </div>
                            <div class="col-sm-5">
                                <div class="form-group upload_endtime_container" id="upload_endtime_container" class="dn">
                                    <label>结束日期</label>
                                    <input disabled="disabled" readonly type="text" id="upload_endTime" class="form-control Wdate w120 m-l-5" v-model='upload_endTime' v-bind:value="upload_endTime" name="queryEndTime"/>
                                </div>
                            </div>
                        </div>
                        <%--上传文件控件--%>
                        <div class="form-inline clear ovh m-t-10" style="margin-left: 6px;">
                            <ul class="upload-ul clearfix">
                                <li class="upload-pick">
                                    <div class="webuploader-container clearfix" id="filesUpload"></div>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" onclick="closeModalCallBack('UploadModal', clearUpload);">关闭
                    </button>
                    <button type="button" class="btn btn-info" onclick="reportUpload()">保存</button>
                </div>
            </div>
        </div>
    </div>
    <!--上传弹窗end-->
</div>
<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
<script type="text/javascript" src="../../resources/plugins/webuploader/js/webuploader.min.js"></script>
<script type="text/javascript" src="../../resources/plugins/webuploader/js/upload-files.js"></script>
<script type="text/javascript" src="../../resources/js/statistics/reportUpload.js"></script>
</body>

</html>