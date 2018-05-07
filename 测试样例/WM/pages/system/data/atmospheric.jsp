<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@include file="../include.jsp" %>
<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <title>大气数据</title>
    <link type="text/css" rel="stylesheet" href="${ctx}/resources/plugins/bootstarp-fileinput/css/fileinput.css"/>
    <link type="text/css" rel="stylesheet" href="${ctx}/resources/plugins/bootstrap-edittable/css/bootstrap.min.css"/>

    <link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css"/>

    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>

    <style>
        .file-drop-zone {
            height: 400px;
            overflow-y: auto;
        }

        .table_length {
            width: 170px;
        }

        .table_length label {
            font-weight: normal;
            float: left;
            padding-top: 8px;
            padding-right: 10px;
        }

        .table_length select {
            float: left;
            width: 60px;
            margin-right: 10px;
        }

        .addSensor .form-group {
            height: 35px;
        }
    </style>
    <script type="text/javascript">
        sessionStorage.setItem("tag", "2,2");
    </script>
</head>
<body>
<%@ include file="../../V1/topMenu.jsp" %>

<div id="content" class="content">
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-left f-s-12">
        <li><a href="javascript:;">数据管理</a></li>
        <li><a href="javascript:;">天气数据</a></li>
    </ol>


    <!-- 		搜索 -->
    <div class="f-s-12">
        <div class="panel">
            <!-- panel-body begin -->
            <div class="panel-body">
                <form class="form-horizontal" role="form">
                    <div class="row">
                        <!-- 						1 -->
                        <div class="col-lg-3 col-sm-6 col-xs-8 col-xxs-12">
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-md-4 control-label" for="txtName">传感器编号</div>
                                    <div class="col-md-7">
                                        <input type="text" class="form-control" v-model="searchFor.deviceId" placeholder="请输入搜索选项">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 							2 -->
                        <div class="col-lg-3 col-sm-6 col-xs-8 col-xxs-12">
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-md-4 control-label" for="txtName">类型</div>
                                    <div class="col-md-7">

                                        <select class="form-control" name="s_tech_type" id="s_tech_type" v-model="searchFor.deviceType">
                                            <option v-for="option in devtypelist" value="{{option.code}}">{{option.name}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 							4 -->
                        <div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <div class="col-md-5 control-label" for="selType">状态</div>
                                    <div class="col-md-7">
                                        <select class="form-control" id="selType" name="type" v-model="searchFor.status">
                                            <option v-for="option in statustypelist" value="{{option.code}}">{{option.name}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group col-md-2">
                            <button type="button" class="btn  btn-info" style="margin-left: 20px;" @click="search">搜索
                            </button>
                        </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal-body" style='background: #ffffff'>
        <div class="actions">
            <div class="table_length">
                <label>显示</label> <select v-model="perPage" name="stationTable_length" aria-controls="stationTable" class="form-control">
                <option v-for="num in pageList" value="{{num}}">{{num}}
                </option>
            </select><label>项结果</label>
            </div>
            <div>
                <button class="btn btn-danger " @click="delsSensor">批量删除</button>
                <button class="btn btn-primary " data-toggle="modal"
                        data-target="#settingsModal">新 增
                </button>
                <button class="btn btn-primary " @click="exportSensor">导 入</button>
            </div>
        </div>
        <!-- 列表开始 -->
        <div class="f-s-12">
            <div class="table-responsive">
                <vuetable v-ref:vuetable api-url="${ctx}/rest/device/getDevicePage"
                          pagination-path="" :fields="fields" :multi-sort="multiSort"
                          table-class="table table-bordered table-striped table-hover"
                          ascending-icon="glyphicon glyphicon-chevron-up"
                          descending-icon="glyphicon glyphicon-chevron-down"
                          pagination-class="" pagination-info-class=""
                          pagination-component-class=""
                          :pagination-component="paginationComponent"
                          :item-actions="itemActions" :append-params="moreParams"
                          :per-page="perPage" wrapper-class="vuetable-wrapper"
                          table-wrapper=".vuetable-wrapper" loading-class="loading"
                          row-class-callback="rowClassCB" :selected-to="selectedTo"></vuetable>
            </div>
        </div>
        <!-- 列表结束 -->
    </div>

</div>
<!-- 	新增 -->
<div class="modal fade addSensor" id="settingsModal" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
                <h4 class="modal-title">{{sensor.id?"编辑传感器":"新增传感器"}}</h4>
            </div>
            <div class="modal-body">
                <input type="hidden" v-model="sensor.id">
                <div class="form-group">
                    <label class="col-sm-2 control-label">编号:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.deviceId">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">名称:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.deviceName">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">类型:</label>
                    <div class="col-sm-7">
                        <select class="form-control" name="type" v-model="sensor.deviceType">
                            <option v-for="option in devtypelistAdd" value="{{option.code}}">{{option.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">状态:</label>
                    <div class="col-sm-7">
                        <select class="form-control" name="type" v-model="sensor.status">
                            <option v-for="option in statustypelistAdd" value="{{option.code}}">{{option.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">labK:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.labK">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">labK2:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.labK2">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">labOfset:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.labOfset">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">realK:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.realK">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">realK2:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.realK2">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">realOfset:</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control required" v-model="sensor.realOfset">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="addSensor"
                        data-dismiss="modal">确定
                </button>
                <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript" src="${ctx}/resources/js/system/equipment/sensor_index.js"></script>
</html>

