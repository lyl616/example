<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
         import="java.util.ResourceBundle" %>
<%@include file="../../includeJsCss.jsp" %>

<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 设备整机管理</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link type="text/css" rel="stylesheet" href="${ctx}/resources/plugins/bootstarp-fileinput/css/fileinput.css"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput.js"></script>
    <script type="text/javascript"
            src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/jquery-file-upload/js/jquery.form.js"></script>

    <link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
    <%--<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>--%>
    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table-sort.js"></script>

    <!--引入下拉多选框样式-->
    <link href="${ctx}/resources/plugins/bootstrap-multiselect/css/bootstrap-multiselect.css" rel="stylesheet"/>
    <script type="text/javascript"
            src="${ctx}/resources/plugins/bootstrap-multiselect/js/bootstrap-multiselect.js"></script>
    <script type="text/javascript">
        var communicat_IP_Port = "communicat_IP_Port";
    </script>
    <script type="text/javascript">
        sessionStorage.setItem("tag", "1,1");
    </script>
</head>

<body class="ovh">
<%@ include file="../../V1/topMenu.jsp" %>
<div class="pd10 table-scroll">
    <div class="tabs-container chunk-set">
        <ul class="nav nav-tabs" id="tab-head">
            <li v-if="tabRealTime" class="active">
                <a data-toggle="tab" href="#tab-equipment" aria-expanded="true">设备管理</a>
            </li>
            <li v-if="tabHis" :class="{active:tabHis && !tabRealTime}">
                <a data-toggle="tab" aria-expanded="false" href="#tab-equipmentHistory">设备历史</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="tab-equipment" class="tab-pane active">
                <div id="content" class="pd10">
                    <!-- begin breadcrumb -->
                    <div class="search-formgroup ovh">
                        <form role="form">
                            <div class="form-inline">
                                <div class="form-group">
                                    <label class="m-r-5">设备编号</label>
                                    <input type="text" placeholder="请输入设备编号" id="equipment"
                                           v-model="searchParams.equipmentId" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="s_province" class="m-r-5 m-l-20 ">省份</label>
                                    <select class="form-control" id="s_province" v-model="searchParams.pro">
                                        <option value="">请选择</option>
                                        <option v-for="option in prolist" value="{{option.id}}">{{option.name}}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="s_city" class="m-l-20 m-r-5">城市</label>
                                    <select class="form-control" id="s_city" v-model="searchParams.city">
                                        <option value="">请选择</option>
                                        <option v-for="option in citylist" value="{{option.id}}">{{option.name}}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="s_district" class="m-l-20 m-r-5">县/区</label>
                                    <select class="form-control" id="s_district" v-model="searchParams.district">
                                        <option value="">请选择</option>
                                        <option v-for="option in dislist" value="{{option.id}}">{{option.name}}</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="m-l-20 m-r-5">绑定状态</label>
                                    <select class="form-control" id="s_mountStatus" name="type"
                                            v-model="searchParams.mountStatus">
                                        <option value="">请选择</option>
                                        <option value="0">未绑定</option>
                                        <option value="1">已绑定</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group">
                                    <label class="m-r-5">设备状态</label>
                                    <select class="form-control" id="s_status" name="type"
                                            v-model="searchParams.status">
                                        <option value="">请选择</option>
                                        <option v-for="option in statustypelist" value="{{option.id}}">{{option.name}}
                                        </option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="m-l-20 m-r-5">设备类型</label>
                                    <select class="form-control" name="s_tech_type" v-model="searchParams.sTechType"
                                            id="s_tech_type">
                                        <option value="">请选择</option>
                                        <option v-for="option in sTechTypeList" value="{{option.code}}">
                                            {{option.name}}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="m-l-20 m-r-5">终端类型</label>
                                    <select class="form-control" name="s_equipmentType"
                                            v-model="searchParams.equipmentType" id="s_equipmentType">
                                        <option value="">请选择</option>
                                        <option v-for="option in equipmentTypeList" value="{{option.id}}">
                                            {{option.name}}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="m-l-10 m-r-5">项目</label>
                                    <select class="form-control" v-model="searchParams.projectId">
                                        <option value="">请选择</option>
                                        <option v-for="item in projectList" value="{{item.id}}">{{item.name}}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="m-l-10 m-r-5">监测点</label>
                                    <input type="text" placeholder="请输入编号/名称" id="monitor"
                                           v-model="searchParams.stationIdOrName" class="form-control">
                                </div>

                                <div class="form-group pull-right">
                                    <button type="button" class="btn btn-info pull-right" @click="search">搜索</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="m-t-10 bgf">
                        <div class="table-head ovh">
                            <div class="m-t-5 p-b-5 m-l-10 pull-left">
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_02')"
                                        class="btn btn-info m-r-5" @click="addStation">新增
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_03')"
                                        class="btn btn-info m-r-5" @click="showImportFile">导入
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_09')"
                                        class="btn btn-info m-r-5" @click="showBatchModifyIP">批量修改IP
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_01')"
                                        class="btn btn-danger m-r-5" @click="mulDelete">批量删除
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_04')"
                                        class="btn btn-info m-r-5" @click="mulSetCommand">下发指令
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_07')"
                                        class="btn btn-info m-r-5" @click="mainting">运维中
                                </button>
                                <button v-if="allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_08')"
                                        class="btn btn-info m-r-5" @click="maintOver">运维结束
                                </button>
                            </div>
                        </div>
                        <!-- 列表开始 -->
                        <div class="table-responsive clear">
                            <vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/equipment/page"
                                      :selected-to="selectedTo" :fields="fields" :multi-sort="multiSort"
                                      :pagination-component="paginationComponent" :append-params="moreParams"
                                      :per-page="perPage" table-class="table table-bordered table-striped table-hover"
                                      table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up"
                                      descending-icon="glyphicon glyphicon-chevron-down" :load-on-start="false"
                                      wrapper-class="vuetable-wrapper" loading-class="loading">
                            </vuetable>
                        </div>
                        <!-- 列表结束 -->
                    </div>
                </div>

                <!-- 批量修改IP（Modal） -->
                <div class="modal fade" id="batchModifyIpModal" tabindex="-1" role="dialog"
                     aria-labelledby="batchModifyIpModal"
                     aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;
                                </button>
                                <div class="modal-title" id="upModalLabel">批量修改IP</div>
                            </div>
                            <div class="modal-body">
                                <form id="batchModifyIpForm" enctype="multipart/form-data" method="post"
                                      action="${requestScope.coreApiContextPath}/batchModifyIp">
                                    <label class="m-r-10">IP地址</label>
                                    <input type="text" class="form-control" id="batchIp" name="batchIp"
                                           placeholder="必填">
                                    <label class="m-r-10 m-l-20">端口号</label>
                                    <input type="text" class="form-control" id="batchPort" name="batchPort"
                                           placeholder="必填">
                                    <input id="batchModifyIpFile" name="excelFile" type="file" class="m-t-10 m-b-10"/>
                                    <a href="${ctx }/resources/template/ModifyIp_Import_Template.xlsx">上传文件模版下载</a>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                                <button type="button" class="btn btn-primary addSubBtn" @click="batchModifyIp">确认
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!--单个删除确认对话框-->
                <div class="modal fade" id="stationDelModal" tabindex="-1" role="dialog"
                     aria-labelledby="stationDelModalLabel" aria-hidden="true" data-backdrop="static"
                     data-keyboard="false">
                    <form class="form-horizontal" role="form">
                        <input type="hidden" id="hidStationId">
                        <div class="modal-dialog modal-sm ">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                    </button>
                                    <div class="modal-title" id="stationlModalLabel">提示信息</div>
                                </div>
                                <div class="modal-body" style="text-align: left;">
                                    <h5>您确定要删除当前信息吗？</h5>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                                    <button type="button" class="btn btn-primary" id="delSubmit"
                                            onclick="deleteStationByIds()">确认
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 模态框上传excel（Modal） -->
                <div class="modal fade" id="myModalExcel" tabindex="-1" role="dialog"
                     aria-labelledby="myModalExcelLabel" aria-hidden="true" data-backdrop="static"
                     data-keyboard="false">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;
                                </button>
                                <div class="modal-title" id="upModalLabel">批量导入</div>
                            </div>
                            <div class="modal-body">
                                <form id="fileUpload" enctype="multipart/form-data" method="post"
                                      action="${requestScope.coreApiContextPath}/equipment/batchImport">
                                    <label class="m-r-10">所属项目</label>
                                    <select v-model="importProjectId" name="importProjectId" class="form-control w200">
                                        <option value="">请选择</option>
                                        <option v-for="item in projectList" value="{{item.id}}">{{item.name}}</option>
                                    </select>
                                    <input id="excelFile" name="excelFile" type="file" class="m-t-10 m-b-10"/>
                                    <a href="${ctx}/resources/template/Device_Import_Template.xlsx">导入文件模板下载</a>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                                <button type="button" class="btn btn-primary addSubBtn" @click="importFile">确认
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 	新增 -->
                <div class="modal fade" data-backdrop="static" data-keyboard="false" id="addModal" tabindex="-1"
                     role="dialog" aria-labelledby="addModalModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="width: 950px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                </button>
                                <div class="modal-title" id="addModalModalLabel"></div>
                            </div>
                            <div class="modal-body" data-scrollbar="true">
                                <form id="addStationForm">
                                    <div class="form-group col-md-6">
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right">设备编号</label>
                                                <input type="text" class="form-control w200" id="new_equipmentId"
                                                       v-model="newstation.equipmentId" placeholder="请输入设备编号">
                                            </div>
                                        </div>
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right"
                                                       for="new_sTechType">设备类型</label>
                                                <select class="form-control w200" name="new_sTechType"
                                                        v-model="newstation.sTechType" id="new_sTechType">
                                                    <option value="">请选择</option>
                                                    <option v-for="option in sTechTypeList" value="{{option.code}}">
                                                        {{option.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right" for="new_collectInternel">采集间隔</label>
                                                <input type="text" class="form-control w200" id="new_collectInternel"
                                                       v-model="newstation.collectInternel" placeholder="请输入采集间隔">
                                            </div>
                                        </div>

                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right">固件类型</label>
                                                <select class="form-control w200" v-model="newstation.firmwareType">
                                                    <option value="A1" selected>A1</option>
                                                    <option value="A2">A2</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="form-group col-md-6">
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right"
                                                       for="new_projectId">所属项目</label>
                                                <select class="form-control w200" v-model="newstation.projectId"
                                                        id="new_projectId">
                                                    <option value="">请选择</option>
                                                    <option v-for="item in projectList" value="{{item.id}}">
                                                        {{item.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right"
                                                       for="new_equipmentType">终端类型</label>
                                                <select class="form-control w200" id="new_equipmentType"
                                                        v-model="newstation.equipmentType">
                                                    <option value="">请选择</option>
                                                    <option v-for="option in equipmentTypeList" value="{{option.id}}">
                                                        {{option.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-inline">
                                            <div class="form-group m-b-10">
                                                <label class="m-r-5 form-label text-right"
                                                       for="new_uploadInternel">上传间隔</label>
                                                <input type="text" class="form-control w200" id="new_uploadInternel"
                                                       v-model="newstation.uploadInternel" placeholder="请输入上传间隔">
                                            </div>
                                        </div>

                                    </div>
                                    <div class="form-group clear">
                                        <label class="m-r-15 form-label text-right pull-left" for="mark">备注</label>
                                        <textarea rows="3" class="form-control m-l-5 "
                                                  style="width: 658px;height: 135px" id="mark" v-model="newstation.mark"
                                                  name="mark"></textarea>

                                    </div>

                                </form>

                                <form id="addStationSensorForm" class="form-horizontal hidden">
                                    <div class="form-group magin10 clear">
                                        <label class="col-sm-9 control-label m-l-10" for="deviceTable">注：下面这个表格的每列都可以编辑，输入传感器编号时自动带出传感器信息并可以作相关修改</label>
                                    </div>
                                    <!-- 列表开始 -->
                                    <div class="table-responsive">
                                        <table id="deviceTable" class="table table-striped table-bordered "
                                               cellspacing="0" width="98%">
                                            <thead class="sensorThead">
                                            <tr class="text-center">
                                                <th>传感器编号</th>
                                                <th>传感器名称</th>
                                                <th>类型</th>
                                                <th>lab_k</th>
                                                <th>lab_ofset</th>
                                                <th>real_k</th>
                                                <th>real_ofset</th>
                                                <th>状态</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="sensorTr" v-for="(index,sensor) in sensorList">
                                                <td><input class="form-control w70" type="text"
                                                           @blur="autoSendor(index,sensor)" v-model="sensor.deviceId">
                                                </td>
                                                <td><input class="form-control w70" type="text"
                                                           v-model="sensor.deviceName">
                                                </td>
                                                <td>
                                                    <select class="form-control w90" v-model="sensor.deviceType">
                                                        <option v-for="option in sensortypelist"
                                                                value="{{option.code}}">
                                                            {{option.name}}
                                                        </option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input class="form-control w70" type="text" v-model="sensor.labK">
                                                </td>
                                                <td>
                                                    <input class="form-control w70" type="text"
                                                           v-model="sensor.labOfset"></td>
                                                <td>
                                                    <input class="form-control w70" type="text" v-model="sensor.realK">
                                                </td>
                                                <td>
                                                    <input class="form-control w70" type="text"
                                                           v-model="sensor.realOfset"></td>
                                                <td>
                                                    <select class="form-control w90" v-model="sensor.status">
                                                        <option v-for="option in sensorstatuslist"
                                                                value="{{option.code}}">
                                                            {{option.name}}
                                                        </option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="button" v-if="sensorList.length>1"
                                                           class="btn btn-danger w70" title="删除"
                                                           @click="sensorDel(index)" value="删除"/>
                                                    <input type="button" class="btn btn-primary w70" title="添加"
                                                           @click="sensorAdd(sensor)" value="添加"/></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- 列表结束 -->
                                </form>

                            </div>
                            <div class="modal-footer">
                                <input type="hidden" id="optFlag"> <input type="hidden" name="id" id="upId">
                                <input type="hidden" name="wwWstation.id" id="pid">
                                <!-- 标准的按钮 -->
                                <button type="button" class="btn btn-info" @click="saveStation">保存</button>
                                <!-- 表示应谨慎采取的动作 -->
                                <button type="button" class="btn btn-white" data-dismiss="modal">返回</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 下发命令 -->
                <div class="modal fade" data-backdrop="static" data-keyboard="false" id="setCommand" tabindex="-1"
                     role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                </button>
                                <div class="modal-title" id="setCommandModalLabel"></div>
                            </div>
                            <div class="modal-body ovh" data-scrollbar="true" style="height: 400px; overflow-y: auto;">
                                <div class="col-md-12 control-label" for="txtName">
                                    <div class="form-inline">
                                        <div class="form-group m-b-10">
                                            <label class="m-r-5 form-label text-right">下发基础指令</label>
                                            <select class="form-control" name="baseCommadSel" id="baseCommadSel">
                                                <option value="">请选择</option>
                                                <option value="0">设备复位</option>
                                                <option value="1">恢复出厂值指令</option>
                                                <option value="2">健康包状态查询</option>
                                                <option value="3">小区基站信息查询</option>
                                                <option value="4">GPS信息查询</option>
                                            </select>
                                            <button type="button" class="btn btn-info m-l-5" @click="setBaseCommadSel">
                                                下发
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="form-inline">
                                        <div class="form-group m-b-10">
                                            <label class="m-r-5 form-label text-right">下发通用查询指令</label>
                                            <select class="form-control" name="queryCommadSel" id="queryCommadSel">
                                                <option value="">请选择</option>
                                                <option value="1">IP端口</option>
                                                <option value="2">时间校准</option>
                                                <option value="3">终端SIM卡号</option>
                                                <option value="4">正常模式下数据上传时间</option>
                                                <option value="5">低功耗模式下数据上传时间</option>
                                                <option value="6">健康包上传时间间隔</option>
                                                <!-- <option value="7">传感器实验室校准值K1，B1，K2，B2</option> -->
                                                <!-- <option value="8">传感器应用校准值K1，B1，K2，B2</option> -->
                                                <option value="9">PM2.5传感器主被查询</option>
                                                <option value="10">短信配置号码</option>
                                                <option value="11">硬件配置字</option>
                                                <option value="176">传感器实验室修正系数批量查询</option>
                                                <option value="160">传感器应用修正系数批量查询</option>
                                            </select>
                                            <button type="button" class="btn  m-l-5 btn-info"
                                                    @click="setQueryCommadSel">下发
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12" style="display: none;" id="setQuery7_8Sel">
                                    <div class="form-inline">
                                        <div class="form-group m-b-10">
                                            <label class="m-r-5 form-label text-right"></label>
                                            <select id='example-getting-started' class='form-control'
                                                    multiple="multiple">
                                                <option value='0'>PM2.5</option>
                                                <option value='1'>PM2.5(备)</option>
                                                <option value='2'>PM10</option>
                                                <option value='3'>CO</option>
                                                <option value='4'>NO2</option>
                                                <option value='5'>O3</option>
                                                <option value='6'>SO2</option>
                                                <option value='7'>NO</option>
                                                <option value='8'>CO2</option>
                                                <option value='9'>TVOC</option>
                                                <option value='10'>H2S</option>
                                                <option value='11'>NH3</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12" id="sss">
                                    <div class="form-inline">
                                        <div class="form-group m-b-10">
                                            <label class="m-r-5 form-label text-right">下发设置参数指令</label>
                                            <select class="form-control" name="configCommadSel" id="str">
                                                <option value="">请选择</option>
                                                <option value="1">IP设置</option>
                                                <option value="2">时间校准</option>
                                                <option value="3">终端SIM卡号</option>
                                                <option value="4">正常模式下数据上传时间</option>
                                                <option value="5">低功耗模式下数据上传时间</option>
                                                <option value="6">健康包上传时间间隔</option>
                                                <!-- 								<option value="7">传感器实验室校准值K1，B1，K2，B2</option> -->
                                                <!-- 								<option value="8">传感器应用校准值K1，B1，K2，B2</option> -->
                                                <option value="9">PM2.5传感器切换</option>
                                                <option value="10">短信配置号码</option>
                                                <option value="11">硬件配置字</option>
                                                <option value="176">传感器实验室修正系数批量设置</option>
                                                <option value="160">传感器应用修正系数批量设置</option>
                                                <!-- 							<option value="160">传感器修正系数批量查询</option> -->
                                            </select>
                                            <button type="button" class="btn m-l-5 btn-info" @click="setCommadSel1">下发
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-inline">
                                        <div class="form-group m-b-10">
                                            <label class="m-r-5 form-label text-right">&nbsp;</label>
                                            <div id="apps" class="dib"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <!-- 表示应谨慎采取的动作 -->
                                <button type="button" class="btn btn-info dn" id="er">保存（继续配置下一项）</button>
                                <button type="button" class="btn btn-white" data-dismiss="modal">返回</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 老版下发命令 -->
                <div class="modal fade" data-backdrop="static" data-keyboard="false" id="oldSetCommand" tabindex="-1"
                     role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog" style="width: 900px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                </button>
                                <div class="modal-title">老版端站下发指令</div>
                            </div>
                            <div class="modal-body" data-scrollbar="true"
                                 style="background: #ffffff; height: 400px; overflow-y: auto; padding-top: 35px;">
                                <div class="col-md-3 control-label" for="txtName">下发基础指令:</div>
                                <div class="col-md-4">
                                    <select class="form-control" name="oldBaseCommadSel" id="oldBaseCommadSel">
                                        <option value="">请选择</option>
                                        <option value="1">检查是否在线</option>
                                        <option value="3">主动校时</option>
                                        <option value="15">主动获取端站信息</option>
                                        <option value="19">主动请求端站软硬件版本号</option>
                                        <option value="91">服务器主动下发配置</option>
                                        <option value="97">强制重启</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOldBaseCommadSel"
                                            style="margin-left: 20px;">
                                        下发
                                    </button>
                                </div>
                                <div class="col-md-3 control-label" style="clear: both;">下发历史数据回调指令:</div>
                                <div class="col-md-4">
                                    <input id="hisCommandStartTime" class="form-control Wdate" type="text"
                                           placeholder="开始时间"
                                           onfocus="WdatePicker({dateFmt:'yyMMddHHmm',isShowClear:false,isShowToday: false, firstDayOfWeek: 1, maxDate:'#F{$dp.$D(\'hisCommandEndTime\',{d:-0});}'})"/>
                                    <input id="hisCommandEndTime" class="form-control Wdate" type="text"
                                           placeholder="结束时间"
                                           onfocus="WdatePicker({dateFmt:'yyMMddHHmm',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'hisCommandStartTime\',{d:0});}'})"/>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOldHistoryCommadSel"
                                            style="margin-left: 20px;">下发
                                    </button>
                                </div>
                                <div class="col-md-3 control-label" style="clear: both;">修改采集/传输间隔:</div>
                                <div class="col-md-2">
                                    <input id="oldCollectInternel" type='number' min="1" max="99" class='form-control'
                                           placeholder='采集间隔'/>
                                </div>
                                <div class="col-md-2">
                                    <input id="oldTransferInternel" type='number' min="1" max="99" class='form-control'
                                           placeholder='传输间隔'/>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOldModifyIntervalCommand"
                                            style="margin-left: 20px;">下发
                                    </button>
                                </div>
                                <div class="col-md-3 control-label" style="clear: both;">设置传感器KB值:</div>
                                <div class="col-md-2">
                                    <select class="form-control" id="kbSensorType">
                                        <option value="1" selected>pm25</option>
                                        <option value="2">pm10</option>
                                        <option value="3">co</option>
                                        <option value="4">so2</option>
                                        <option value="5">o3</option>
                                        <option value="6">no2</option>
                                    </select>
                                    <input type="number" id="sensorK1" min="0.01" max="9.99" step="0.01"
                                           class='form-control' placeholder='k1值'/>
                                </div>
                                <div class="col-md-2">
                                    <input type="number" id="sensorB1" min="-999" max="999" class='form-control'
                                           placeholder='b1值'/>
                                    <input type="number" id="sensorK2" min="0.01" max="9.99" step="0.01"
                                           class='form-control' placeholder='k2值，o3时使用'/>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOldModifyKBCommand"
                                            style="margin-left: 20px;">下发
                                    </button>
                                </div>
                                <div class="col-md-3 control-label" style="clear: both;">切换传感器:</div>
                                <div class="col-md-2" style="padding-top: 8px;">
                                    <label>
                                        <input id="masterSensor" type="checkbox" checked>
                                        主PM2.5传感器</label>
                                </div>
                                <div class="col-md-2" style="padding-top: 8px;">
                                    <label>
                                        <input id="slaveSensor" type="checkbox">
                                        备PM2.5传感器</label>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOldSensorChannelCommand"
                                            style="margin-left: 20px;">下发
                                    </button>
                                </div>
                                <div class="col-md-3 control-label" style="clear: both;">修改端站两个传感器编号:</div>
                                <div class="col-md-4">
                                    <select class="form-control" id="sensorCodeValue1">
                                        <option value="0" selected>传感器已报废</option>
                                        <option value="1">传感器正在工作</option>
                                        <option value="2">传感器处于备用状态</option>
                                    </select>
                                    <div style="width: 100%; height: 100px;">
                                        <input type="text" id="sensorCodeValue2" class='form-control'
                                               placeholder='传感器编号'/>
                                        <select class="form-control" id="sensorCodeValue3">
                                            <option value="0" selected>传感器已报废</option>
                                            <option value="1">传感器正在工作</option>
                                            <option value="2">传感器处于备用状态</option>
                                        </select>
                                        <input type="text" id="sensorCodeValue4" class='form-control'
                                               placeholder='传感器编号'/>
                                        <select class="form-control" id="sensorCodeValue5">
                                            <option value="1" selected>正在使用传感器1</option>
                                            <option value="2">正在使用传感器2</option>
                                            <option value="3">两个传感器同时工作</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn  btn-info" @click="setOld  CodeCommand"
                                            style="margin-left: 20px;">
                                        下发
                                    </button>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-warning" data-dismiss="modal">退出</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div id="tab-equipmentHistory" class="tab-pane">
                <div class="pd10">
                    <div class="search-formgroup ovh">
                        <div class="form-inline">
                            <div class="form-group">
                                <label class="m-l-20 m-r-10">设备编号</label>
                                <input type="text" placeholder="请输入设备编号" v-model="params.equipmentId"
                                       class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-10">项目</label>
                                <select class="form-control" v-model="params.projectId">
                                    <option value="">请选择</option>
                                    <option v-for="item in projectList" value="{{item.id}}">{{item.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-10">省份</label>
                                <select class="form-control" v-model="params.pro">
                                    <option value="">请选择</option>
                                    <option v-for="item in proList" value="{{item.id}}">{{item.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-10">城市</label>
                                <select class="form-control" v-model="params.city">
                                    <option value="">请选择</option>
                                    <option v-for="item in cityList" value="{{item.id}}">{{item.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-10">区/县</label>
                                <select class="form-control " v-model="params.district">
                                    <option value="">请选择</option>
                                    <option v-for="item in districtList" value="{{item.id}}">{{item.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-inline m-t-5">
                            <div class="form-group">
                                <label class="m-l-20 m-r-5">监测点</label>
                                <input type="text" placeholder="请输入编号/名称" class="form-control"
                                       v-model="params.stationIdOrName">
                            </div>
                            <div class="form-group">
                                <label class="m-l-10 m-r-5">时间范围</label>
                                <div class="input-group input-daterange">
                                    <input type="text" class="form-control Wdate"
                                           v-model="params.startTime" id="startTime" placeholder="开始时间"
                                           onclick="WdatePicker({dateFmt:'yyyy-MM-dd', maxDate:'#F{$dp.$D(\'endTime\')}',
                                                       onpicking:function(dp){equipmentHistoryVm.params.startTime=dp.cal.getNewDateStr();},
                                                       oncleared:function(dp){equipmentHistoryVm.params.startTime='';}})">
                                    <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                    <input type="text" class="form-control Wdate"
                                           v-model="params.endTime" id="endTime" placeholder="结束时间"
                                           onclick="WdatePicker({dateFmt:'yyyy-MM-dd', maxDate:'%y-%M-%d',minDate:'#F{$dp.$D(\'startTime\')}',
                                                       onpicking:function(dp){equipmentHistoryVm.params.endTime=dp.cal.getNewDateStr();},
                                                       oncleared:function(dp){equipmentHistoryVm.params.endTime='';}})">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-5">操作人</label>
                                <input type="text" placeholder="请输入操作人" v-model="params.operator"
                                       class="form-control"/>
                            </div>
                            <div class="form-group">
                                <label class="m-l-20 m-r-5">操作</label>
                                <select class="form-control" v-model="params.operatorResult">
                                    <option value="">请选择</option>
                                    <option v-for="item in operatorResultList" value="{{item.code}}">{{item.name}}
                                    </option>
                                </select>
                            </div>

                            <div class="form-group pull-right">
                                <input type="button" class="btn btn-info pull-right" value="搜索" @click="search"/>
                            </div>
                        </div>
                    </div>
                    <div class="m-t-10 bgf">
                        <!-- 列表开始 -->
                        <div class="table-responsive clear">
                            <vuetable v-ref:vuetable
                                      api-url="${requestScope.coreApiContextPath}/equipmenthistory/historypage"
                                      :selected-to="selectedTo" :fields="fields" :multi-sort="multiSort"
                                      :pagination-component="paginationComponent" :append-params="moreParams"
                                      :per-page="perPage" table-class="table table-bordered table-striped table-hover"
                                      table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up"
                                      descending-icon="glyphicon glyphicon-chevron-down"
                                      wrapper-class="vuetable-wrapper" loading-class="loading">
                            </vuetable>
                        </div>
                        <!-- 列表结束 -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var spr = new Array();
    var ss = new Array();
    var ss1 = new Array();
    var tag = "";
    var ind = "";
    $("#str").on("change", function () {
        var sel = $('#str option:selected').val();
        if (sel == "1") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='text' class='form-control clear m-b-10' placeholder='ip地址' id='configValue1_1'/>")
            $("#apps").append("<input type='text' class='form-control clear m-b-10' placeholder='端口号' id='configValue1_2'/>")
            //$("#sss").append("<input type='text' />")
        } else if (sel == "2") {
            $("#er").css("display", "none");
            $("#apps").text("");
        } else if (sel == "3") {
            $("#er").css("display", "none");
            $("#apps").text("");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='终端SIM卡号,例如：(13711111111)' id='configValue3'/>")
        } else if (sel == "4") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='单位秒，写0表示不上传' id='configValue4'/>")
        } else if (sel == "5") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='单位秒，写0表示不上传' id='configValue5'/>");
        } else if (sel == "6") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='单位分钟，写0表示不上传' id='configValue6'/>");
        } else if (sel == "176") {
            $("#er").css("display", "block")
            $("#apps").text("");
            $("#apps").append("<select id='haha1' class='form-control clear m-b-10'><option value='0'>PM2.5</option><option value='1'>PM2.5(备)</option><option value='2'>PM10</option><option value='3'>CO</option><option value='4'>NO2</option><option value='5'>O3</option><option value='6'>SO2</option><option value='7'>NO</option><option value='8'>CO2</option><option value='9'>TVOC</option><option value='10'>H2S</option><option value='11' >NH3</option></select>")
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='放大系数' id='coefficient' onchange='updates()'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='k1' id='k1' onchange='updates()'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='k2' id='k2' onchange='updates()'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='b1' id='k3' onchange='updates()'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='b2' id='k4' onchange='updates()'/>");
            var ss = $('#haha1 option:selected').val();
            ind = ss;
            $("#haha1").on("change", function () {
                var ss = $('#haha1 option:selected').val();
                ind = ss;
                for (var i = 0; i < 14; i++) {
                    if (ss == i) {
                        $("#coefficient").val("");
                        $("#k1").val("");
                        $("#k2").val("");
                        $("#k3").val("");
                        $("#k4").val("");
                    }
                }
            });
            $('#er').unbind();
            $("#er").on("click", function (e) {
                str_ser();
            });
        } else if (sel == "160") {
            $("#er").css("display", "block")
            $("#apps").text("");
            $("#apps").append("<select id='haha' class='form-control clear m-b-10'><option value='0'>PM2.5</option><option value='1'>PM2.5(备)</option><option value='2'>PM10</option><option value='3'>CO</option><option value='4'>NO2</option><option value='5'>O3</option><option value='6'>SO2</option><option value='7'>NO</option><option value='8'>CO2</option><option value='9'>TVOC</option><option value='10'>H2S</option><option value='11' >NH3</option></select>")
            $("#apps").append("<input type='number' class='form-control pp clear m-b-10' placeholder='放大系数' id='kcoefficient' onchange='updates1()'/>");
            $("#apps").append("<input type='number' class='form-control pp clear m-b-10' placeholder='k1' id='kk1' onchange='updates1()'/>");
            $("#apps").append("<input type='number' class='form-control pp clear m-b-10' placeholder='k2' id='kk2'onchange='updates1()'/>");
            $("#apps").append("<input type='number' class='form-control pp clear m-b-10' placeholder='b1' id='kk3' onchange='updates1()'/>");
            $("#apps").append("<input type='number' class='form-control pp clear' placeholder='b2' id='kk4' onchange='updates1()'/>");
            var ss = $('#haha option:selected').val();
            $("#haha").on("change", function () {
                for (var i = 0; i < 14; i++) {
                    if (ss == i) {
                        $("#kcoefficient").val("");
                        $("#kk1").val("");
                        $("#kk2").val("");
                        $("#kk3").val("");
                        $("#kk4").val("");
                    }
                }
            });
            $('#er').unbind();
            $("#er").on("click", function (e) {
                str_ser1();
            });
        } else if (sel == "9") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='radio' class=\"form-control\" name='radioPm25' id='r1' value='0'/><label for='r1' class=\"m-r-20\">主PM2.5传感器</label>")
            $("#apps").append("<input type='radio' class=\"form-control\" name='radioPm25' id='r2' value='1'/><label for='r2' class=\"m-r-20\">从PM2.5传感器</label>")
        } else if (sel == "10") {
            $("#er").css("display", "none")
            $("#apps").text("");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='号码1' id='ed1'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='号码2' id='ed2'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='号码3' id='ed3'/>");
            $("#apps").append("<input type='number' class='form-control clear m-b-10' placeholder='号码4' id='ed4'/>");
            $("#apps").append("<input type='number' class='form-control clear' placeholder='号码5' id='ed5'/>");
        } else if (sel == "11") {
            $("#er").css("display", "none");
            $("#apps").text("");
            $("#apps").append("<input type='text' class='form-control' placeholder='配置字' id='configValue11'/>")
        }
        if (sel == "") {
            $("#er").css("display", "none")
            $("#apps").text("");
        }
    })

    function updates() {
        var a = $("#k1").val();
        var b = $("#k2").val();
        var c = $("#k3").val();
        var d = $("#k4").val();
        var e = $("#coefficient").val();
        if (a != "" && b != "" && c != "" && d != "" && e != "") {
            var jsn = {};
            jsn.k1 = a;
            jsn.k2 = b;
            jsn.b1 = c;
            jsn.b2 = d;
            jsn.sensorType = $('#haha1 option:selected').val();
            jsn.coefficient = e;
            ss.push(jsn);
            console.log(ss)
        }
    }

    function updates1() {
        var a = $("#kk1").val();
        var b = $("#kk2").val();
        var c = $("#kk3").val();
        var d = $("#kk4").val();
        var e = $("#kcoefficient").val();
        if (a != "" && b != "" && c != "" && d != "" && e != "") {
            var jsn = {};
            jsn.k1 = a;
            jsn.k2 = b;
            jsn.b1 = c;
            jsn.b2 = d;
            jsn.sensorType = $('#haha option:selected').val();
            jsn.coefficient = e;
            ss1.push(jsn);
            console.log(ss1)
        }
    }

    function str_ser() {
        var e = $("#coefficient").val();
        var a = $("#k1").val();
        var b = $("#k2").val();
        var c = $("#k3").val();
        var d = $("#k4").val();
        if (a == "" || b == "" || c == "" || d == "" || e == "") {
            layer.msg("请将信息填写完整!");
            return;
        }
        var flag = false;
        for (var i = 0; i < ss.length; i++) {
            if (ss[i].sensorType == ind) {
                flag = true;
            }
        }
        if (!flag) {
            var jsn = {};
            jsn.k1 = a;
            jsn.k2 = b;
            jsn.b1 = c;
            jsn.b2 = d;
            jsn.sensorType = ind;
            jsn.coefficient = e;
            ss.push(jsn);
        }
        layer.msg("以保存可以配置下一项！");
    }

    function str_ser1() {
        var e = $("#kcoefficient").val();
        var a = $("#kk1").val();
        var b = $("#kk2").val();
        var c = $("#kk3").val();
        var d = $("#kk4").val();
        if (a == "" || b == "" && c == "" || d == "" || e == "") {
            layer.msg("请将信息填写完整!");
            return;
        }
        var flag = false;
        var ind = $('#haha option:selected').val();
        for (var i = 0; i < ss1.length; i++) {
            if (ss1[i].sensorType == ind) {
                flag = true;
            }
        }
        if (!flag) {
            var jsn = {};
            jsn.k1 = a;
            jsn.k2 = b;
            jsn.b1 = c;
            jsn.b2 = d;
            jsn.sensorType = ind;
            jsn.coefficient = e;
            ss1.push(jsn);
        }
        layer.msg("以保存可以配置下一项！");
        console.log(ss1)
    }

    $("#queryCommadSel").on("change", function () {
        var sel = $('#queryCommadSel option:selected').val();
        if (sel == "") return;
        switch (Number(sel)) {
            case 160:
            case 176:
                $("#setQuery7_8Sel").css("display", "block");
                $('#example-getting-started').multiselect();
                $el = $('#example-getting-started');
                $('option', $el).each(function (element) {
                    $el.multiselect('deselect', $(this).val());
                });
                break;
            default:
                $("#setQuery7_8Sel").css("display", "none");
                break;
        }
    })
</script>
<script type="text/javascript" src="${ctx}/resources/js/system/equipment/station_index.js"></script>
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