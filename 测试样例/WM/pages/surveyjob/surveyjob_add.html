

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 勘查任务管理</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <link type="text/css" rel="stylesheet" href="../../resources/plugins/bootstarp-fileinput/css/fileinput.css"/>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
    <link rel="stylesheet" href="../../resources/plugins/webuploader/css/upload-files.css">
    <style type="text/css">
        .header-span {
            font-weight: 800;
            font-size: 13px;
        }
    </style>
    <script>
        var pageJobCode = "${requestScope.jobCode}";
        var editType = "${requestScope.editType}";
    </script>
</head>

<body class="ovh">
<%@ include file="../V1/topMenu.html" %>
<div class="ovh pd10 table-scroll" id="app">
    <div class="panel-body">
        <div class="panel-group" id="accordion">
            <%--头信息--%>
            <header>
                <span class="col-sm-2 header-span">任务单号：{{ jobCode }}</span>
                <span class="col-sm-3 header-span">发布时间：{{ insTime }}</span>
                <span class="col-sm-2 header-span">发布人：{{ publisher }}</span>
                <span class="col-sm-2 header-span">完成状态：{{ state }}</span>
                <span class="col-sm-2 header-span">完成时间：{{ finishTime }}</span>
            </header>
        </div>
        <%--异常点位--%>
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title">
                    <span style="font-weight: bold">异常点位</span>
                </div>
            </div>
            <div id="error-station-div" class="panel-collapse collapse in">
                <div v-show="editType != '1'" class="panel-body">
                    <div class="col-sm-12">
                        <div class="chunk-body">
                            <div class="XhideYauto">
                                <div class="tab-content">
                                    <div class="table-responsive">
                                        <div class="vuetable-head-wrapper">
                                            <table style="table-layout: fixed;"
                                                   class="vuetable table table-bordered table-striped table-hover vuetable-semantic-no-top">
                                                <thead>
                                                <tr>
                                                    <th class="text-center" style="width: 30px;">序号</th>
                                                    <th class="text-center w70">监测点编号</th>
                                                    <th class="text-center w70">监测点名称</th>
                                                    <th class="text-center w70">监测点类型</th>
                                                    <th class="text-center w70">监测点地区</th>
                                                    <th class="text-center w100">监测点地址</th>
                                                    <th class="text-center w70">经度</th>
                                                    <th class="text-center w70">纬度</th>
                                                    <th class="text-center w100">异常时间范围</th>
                                                    <th class="text-center text-overflow w200">
                                                        异常现象描述
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr v-for="(station, index) in stationList">
                                                    <td class="text-center">{{ index + 1 }}</td>
                                                    <td class="text-center">{{ station.stationId }}</td>
                                                    <td class="text-center">{{ station.stationName }}</td>
                                                    <td class="text-center">{{ station.type }}</td>
                                                    <td class="text-center">{{ station.district }}</td>
                                                    <td class="text-center">{{ station.address }}</td>
                                                    <td class="text-center">{{ station.lngReal }}</td>
                                                    <td class="text-center">{{ station.latReal }}</td>
                                                    <td class="text-center">
                                                        {{ station.abnormalStartTime }}
                                                        <br/>
                                                        {{ station.abnormalEndTime }}
                                                    </td>
                                                    <td v-bind:title="station.abnormalContent"
                                                        class="text-center text-overflow">
                                                        {{ station.abnormalContent }}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="editType == '1'" class="panel-body">
                    <!--异常点位列表-->
                    <div v-for="(station, index) in stationList">
                        <div class="chunk-title">监测点编号
                            <input type="text" placeholder="请输入监测点编号" class="form-control w200"
                                   v-model="station.id" @keydown.enter="searchStation(station, index)">
                            <button class="btn btn-info m-l-10"
                                    @click="searchStation(station, index)">
                                确定
                            </button>
                        </div>
                        <div class="chunk-body">
                            <div class="XhideYauto">
                                <div class="col-sm-12 m-t-20">
                                    <div class="form-inline">
                                        <label style="width: 110px;" class="form-label text-right">监测点名称</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.stationName">
                                        </div>
                                        <label style="width: 110px;" class="form-label text-right">监测点类型</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.type">
                                        </div>
                                        <label style="width: 110px;" class="text-right">经度</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.lngReal">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 m-t-20">
                                    <div class="form-inline">
                                        <label style="width: 110px;" class="form-label text-right">监测点地区</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.district">
                                        </div>
                                        <label style="width: 110px;" class="form-label text-right">监测点地址</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.address">
                                        </div>
                                        <label style="width: 110px;" class="text-right">纬度</label>
                                        <div class="input-group">
                                            <input disabled="disabled" class="form-control"
                                                   v-model="station.latReal">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 m-t-20">
                                    <div class="form-inline">
                                        <label class="form-label text-left"><i class="gf00 fsn">*</i>异常时间范围</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control Wdate w150"
                                                   v-model="station.abnormalStartTime"
                                                   v-bind:index="index"
                                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                                       onpicking:function(dp){
                                                           var i = parseInt($(this).attr('index'));
                                                           vm.stationList[i].abnormalStartTime=dp.cal.getNewDateStr();}})"/>
                                            <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                            <input type="text" class="form-control Wdate w150"
                                                   v-model="station.abnormalEndTime"
                                                   v-bind:index="index"
                                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                                       onpicking:function(dp){
                                                           var i = parseInt($(this).attr('index'));
                                                           vm.stationList[i].abnormalEndTime=dp.cal.getNewDateStr();
                                                       }})">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 m-t-20">
                                    <div class="form-inline">
                                        <label class="form-label text-left"><i class="gf00 fsn">*</i>异常现象描述</label>
                                        <div class="input-group">
                                                <textarea maxlength="255" class="form-control" cols="100%" rows="6"
                                                          v-model="station.abnormalContent"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 m-t-10">
                            <div class="form-inline">
                                <button class="btn btn-info" @click="addStation">
                                    新增监测点
                                </button>
                                <button v-show="stationList.length > 1" class="btn btn-danger m-l-30"
                                        @click="removeStation(station, index)">删除监测点
                                </button>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <%--异常点位列表结束--%>
                    <div class="chunk-footer">
                        <div class="m-t-10 m-b-10 text-center">
                            <button v-show="editType == '1'" class="btn btn-info m-r-10" @click="saveErrorStation">
                                创建
                            </button>
                            <button class="btn btn-white" @click="goBack">返回</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--建议信息--%>
        <div v-show="editType != '1'" class="panel panel-default">
            <div id="advise-panel" class="panel-heading">
                <div class="panel-title">
                    <span style="font-weight: bold">勘查建议</span>
                </div>
            </div>
            <div id="advise-div" class="panel-collapse collapse in">
                <div class="panel-body">
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>建议时间</label>
                            <div class="input-group">
                                <input type="text" class="form-control Wdate w150"
                                       v-model="adviseStartTime"
                                       :disabled="editType != '2'"
                                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                           onpicking:function(dp){vm.adviseStartTime=dp.cal.getNewDateStr();}})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input type="text" class="form-control Wdate w150"
                                       v-model="adviseEndTime"
                                       :disabled="editType != '2'"
                                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                           onpicking:function(dp){vm.adviseEndTime=dp.cal.getNewDateStr();}})">
                            </div>
                            <label class="form-label text-right"><i class="gf00 fsn">*</i>建议人员</label>
                            <div class="input-group">
                                <input maxlength="255" class="form-control" v-model="advisePerson"
                                       :disabled="editType != '2'">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>建议区域</label>
                            <div class="input-group">
                                                <textarea maxlength="255" class="form-control" cols="100%" rows="6"
                                                          v-model="adviseArea" :disabled="editType != '2'"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>附近污染源</label>
                            <div class="input-group">
                                                <textarea maxlength="255" class="form-control" cols="100%" rows="6"
                                                          v-model="pollutionSource"
                                                          :disabled="editType != '2'"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>勘查内容</label>
                            <div class="input-group">
                                                <textarea maxlength="255" class="form-control" cols="100%" rows="6"
                                                          v-model="surveyContent"
                                                          :disabled="editType != '2'"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                    <div v-show="editType == '2'" class="chunk-footer">
                        <div class="m-t-10 m-b-10 text-center">
                            <button class="btn btn-info m-r-10" @click="saveAdviseInfo">
                                发布
                            </button>
                            <button class="btn btn-white" @click="goBack">返回</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--勘查结果--%>
        <div v-show="editType == '3' || editType == '4'" class="panel panel-default">
            <div id="result-panel" class="panel-heading">
                <div class="panel-title">
                    <span style="font-weight: bold">勘查结果</span>
                </div>
            </div>
            <div id="result-div" class="panel-collapse collapse in">
                <div class="panel-body">
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>勘查时间</label>
                            <div class="input-group">
                                <input type="text" class="form-control Wdate w150"
                                       v-model="surveyStartTime"
                                       :disabled="editType != '3'"
                                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                           onpicking:function(dp){vm.surveyStartTime=dp.cal.getNewDateStr();}})"/>
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input type="text" class="form-control Wdate w150"
                                       v-model="surveyEndTime"
                                       :disabled="editType != '3'"
                                       onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                           onpicking:function(dp){vm.surveyEndTime=dp.cal.getNewDateStr();}})">
                            </div>
                            <label class="form-label text-right"><i class="gf00 fsn">*</i>勘查人员</label>
                            <div class="input-group">
                                <input :disabled="editType != '3'" maxlength="255" class="form-control"
                                       v-model="surveyPerson">
                            </div>
                            <label class="form-label text-right">反馈人员</label>
                            <div class="input-group">
                                <input disabled="disabled" class="form-control" v-model="feedbacker">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left"><i class="gf00 fsn">*</i>勘查结果</label>
                            <div class="input-group">
                                                <textarea :disabled="editType != '3'" maxlength="255"
                                                          class="form-control" cols="100%" rows="6"
                                                          v-model="surveyResult"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 m-t-5">
                        <div class="form-inline">
                            <label class="form-label text-left">附件上传</label>
                            <div class="input-group">
                                <ul class="upload-ul clearfix">
                                    <li v-show="editType == '3'" class="upload-pick">
                                        <div class="webuploader-container clearfix" id="filesUpload"></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--移动监测--%>
        <div v-show="editType == '3' || editType == '4'" class="panel panel-default">
            <div id="mobileMonitorPanel" class="panel-heading">
                <div class="panel-title">
                    <span style="font-weight: bold">移动监测</span>
                </div>
            </div>
            <div id="mobile-monitor-div" class="panel-collapse collapse in">
                <div v-show="editType=='3'" class="panel-body">
                    <!--异常点位列表-->
                    <div v-for="(monitor, index) in mobileMonitorList" class="col-sm-12">
                        <div class="chunk-body">
                            <div class="XhideYauto">
                                <div class="col-sm-12 m-t-5">
                                    <div class="form-inline">
                                        <label style="width: 110px;" class="form-label text-left">移动设备编号</label>
                                        <div class="input-group">
                                            <input :disabled="editType != '3'" maxlength="255" class="form-control"
                                                   v-model="monitor.monitorId">
                                        </div>
                                        <label class="form-label text-right">移动监测时间</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control Wdate w150"
                                                   v-model="monitor.monitorStartTime"
                                                   v-bind:index="index"
                                                   :disabled="editType != '3'"
                                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                                       onpicking:function(dp){
                                                           var i = parseInt($(this).attr('index'));
                                                           vm.mobileMonitorList[i].monitorStartTime=dp.cal.getNewDateStr();}})"/>
                                            <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                            <input type="text" class="form-control Wdate w150"
                                                   v-model="monitor.monitorEndTime"
                                                   v-bind:index="index"
                                                   :disabled="editType != '3'"
                                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', maxDate:'%y-%M-%d',
                                                       onpicking:function(dp){
                                                           var i = parseInt($(this).attr('index'));
                                                           vm.mobileMonitorList[i].monitorEndTime=dp.cal.getNewDateStr();
                                                       }})">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 m-t-5">
                                    <div class="form-inline">
                                        <label style="width: 110px;" class="form-label text-left">移动监测位置</label>
                                        <div class="input-group">
                                            <input :disabled="editType != '3'" maxlength="255" class="form-control"
                                                   v-model="monitor.monitorAddress">
                                        </div>
                                        <label class="form-label text-right">经度</label>
                                        <div class="input-group">
                                            <input :disabled="editType != '3'" maxlength="255" class="form-control"
                                                   v-model="monitor.monitorLng">
                                        </div>
                                        <label class="text-right">纬度</label>
                                        <div class="input-group">
                                            <input :disabled="editType != '3'" maxlength="255" class="form-control"
                                                   v-model="monitor.monitorLat">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 m-t-5">
                                    <div class="form-inline">
                                        <label style="width: 110px;" class="form-label text-left">移动监测结果</label>
                                        <div class="input-group">
                                                <textarea :disabled="editType != '3'" maxlength="255"
                                                          class="form-control" cols="100%" rows="6"
                                                          v-model="monitor.monitorContent"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 m-t-10">
                            <div class="form-inline">
                                <button class="btn btn-info" @click="addMobileMonitor">
                                    新增移动监测
                                </button>
                                <button v-show="mobileMonitorList.length > 1" class="btn btn-danger m-l-30"
                                        @click="removeMobileMonitor(monitor, index)">删除移动监测
                                </button>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <div class="clear"></div>
                    <div class="chunk-footer">
                        <div class="m-t-10 m-b-10 text-center">
                            <button class="btn btn-info m-r-10" @click="saveMobileMonitor">
                                提交
                            </button>
                            <button class="btn btn-white" @click="goBack">返回</button>
                        </div>
                    </div>
                </div>
                <div v-show="editType=='4'" class="panel-body">
                    <!--异常点位列表-->
                    <div class="col-sm-12">
                        <div class="chunk-body">
                            <div class="XhideYauto">
                                <div class="tab-content">
                                    <div class="table-responsive">
                                        <div class="vuetable-head-wrapper">
                                            <table style="table-layout: fixed;"
                                                   class="vuetable table table-bordered table-striped table-hover vuetable-semantic-no-top">
                                                <thead>
                                                <tr>
                                                    <th class="text-center" style="width: 30px;">序号</th>
                                                    <th class="text-center w90">移动设备编号</th>
                                                    <th class="text-center w200">移动监测位置</th>
                                                    <th class="text-center w70">经度</th>
                                                    <th class="text-center w70">纬度</th>
                                                    <th class="text-center w100">移动监测时间</th>
                                                    <th class="text-center text-overflow w200">
                                                        移动监测结果
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr v-show="mobileMonitorList[0].monitorId"
                                                    v-for="(monitor, index) in mobileMonitorList">
                                                    <td class="text-center">{{ index+1 }}</td>
                                                    <td class="text-center">{{ monitor.monitorId }}</td>
                                                    <td class="text-center">{{ monitor.monitorAddress }}</td>
                                                    <td class="text-center">{{ monitor.monitorLng }}</td>
                                                    <td class="text-center">{{ monitor.monitorLat }}</td>
                                                    <td class="text-center">
                                                        {{ monitor.monitorStartTime }}
                                                        <br/>
                                                        {{ monitor.monitorEndTime }}
                                                    </td>
                                                    <td v-bind:title="monitor.monitorContent"
                                                        class="text-center text-overflow">
                                                        {{ monitor.monitorContent }}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <div class="clear"></div>
                    <div class="chunk-footer">
                        <div class="m-t-10 m-b-10 text-center">
                            <button class="btn btn-white" @click="goBack">返回</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../../resources/plugins/webuploader/js/webuploader.min.js"></script>
<script type="text/javascript" src="../../resources/plugins/webuploader/js/upload-files.js"></script>
<script type="text/javascript" src="${ctx}/pages/surveyjob/surveyjob_add.js"></script>
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