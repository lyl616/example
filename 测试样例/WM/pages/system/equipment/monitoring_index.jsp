<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeVue.jsp" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 监测点管理</title>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/My97DatePicker/WdatePicker.js"></script>
</head>
<body class="ovh">
<%@ include file="../../V1/topMenu.jsp" %>
<div class="pd10 table-scroll" id="app">
    <!--搜索条开始-->
    <div class="tabs-container chunk-set">
        <ul class="nav nav-tabs">
            <li class="active" v-if="'ROLE_FUN_102_01_01' in allFunctions">
                <a data-toggle="tab" href="#tab-monitoring" aria-expanded="true" @click="currTabFg(1)">监测点管理</a>
            </li>
            <li class="" v-if="'ROLE_FUN_102_01_02' in allFunctions" :class="{active:!('ROLE_FUN_102_01_01' in allFunctions) && ('ROLE_FUN_102_01_02' in allFunctions)}">
                <a data-toggle="tab" aria-expanded="false" href="#tab-monHistory" @click="currTabFg(2)">监测点历史</a>
            </li>
        </ul>
        <div class="tab-content">
            <div v-if="'ROLE_FUN_102_01_01' in allFunctions" id="tab-monitoring" class="tab-pane active">
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 text-right">省份</label>
                            <select class="form-control" v-model="station.pro">
                                <option value="-1">请选择</option>
                                <option v-for="item in newprolist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 text-right" style="width: 40px;">城市</label>
                            <select class="form-control" v-model="station.city">
                                <option value="-1">请选择</option>
                                <option v-for="item in newcitylist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 text-right" style="width: 50px;">区/县</label>
                            <select class="form-control" v-model="station.district">
                                <option value="-1">请选择</option>
                                <option v-for="item in newdislist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 text-right">监测点状态</label>
                            <select class="form-control" v-model="station.status">
                                <option value="-1">请选择</option>
                                <option v-for="item in statusList" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 text-right" style="width: 60px;">绑定状态</label>
                            <select class="form-control" v-model="station.mountStatus">
                                <option value="-1">请选择</option>
                                <option value="1">已绑定</option>
                                <option value="2">未绑定</option>
                            </select>
                        </div>
                        <br/>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 m-t-10 text-right">项目</label>
                            <select class="form-control" v-model="station.projectId">
                                <option value="-1">请选择</option>
                                <option v-for="item in projectList" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 m-t-10 text-right" style="width: 40px;">监测点</label>
                            <input type="text" placeholder="请输入编号/名称" id="monitor" v-model="station.stationIdOrName"
                                   class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10 m-t-10 text-right" style="width: 50px;">绑定设备</label>
                            <input type="text" placeholder="请输入设备号" v-model="station.equipmentId" id="searchName"
                                   class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-t-10 m-r-10 text-right">监测点种类</label>
                            <select class="form-control" v-model="station.equipmentType">
                                <option value="-1">请选择</option>
                                <option v-for="item in equipmentTypeList" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-t-10 m-r-10 text-right" style="width: 60px;">监测点类型</label>
                            <select class="form-control" v-model="station.stationType">
                                <option value="-1">请选择</option>
                                <option v-for="item in stationTypeList" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group pull-right">
                            <input type="button" class="btn btn-info pull-right" value="搜索" @click="stationSearch"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="'ROLE_FUN_102_01_02' in allFunctions" id="tab-monHistory" :class="['tab-pane', {active:!('ROLE_FUN_102_01_01' in allFunctions) && ('ROLE_FUN_102_01_02' in allFunctions)}]">
                <div class="p-t-10 p-b-10">
                    <div class="form-inline">
                        <div class="form-group">
                            <label class="m-l-20 m-r-10">监测点</label>
                            <input type="text" placeholder="请输入编号/名称" v-model="his_station.stationId" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10">项目</label>
                            <select class="form-control" v-model="his_station.projectId">
                                <option value="-1">请选择</option>
                                <option v-for="item in projectList" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10">省份</label>
                            <select class="form-control" v-model="his_station.pro">
                                <option value="-1">请选择</option>
                                <option v-for="item in newprolist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10">城市</label>
                            <select class="form-control" v-model="his_station.city">
                                <option value="-1">请选择</option>
                                <option v-for="item in newcitylist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-10">区/县</label>
                            <select class="form-control " v-model="his_station.district">
                                <option value="-1">请选择</option>
                                <option v-for="item in newdislist" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-inline m-t-5">
                        <div class="form-group">
                            <label class="m-l-10 m-r-5">时间范围</label>
                            <div class="input-group input-daterange">
                                <input type="text" class="form-control Wdate" onclick="initTime('1')"
                                       v-model="his_station.startTime" id="startTime" placeholder="开始时间">
                                <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                                <input type="text" class="form-control Wdate" onclick="initTime('2')"
                                       v-model="his_station.endTime" id="endTime" placeholder="结束时间">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">操作人</label>
                            <input type="text" placeholder="请输入操作人" v-model="his_station.operator"
                                   class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">操作</label>
                            <select class="form-control" v-model="his_station.operatorResult">
                                <option value="-1">请选择</option>
                                <option value="1">新增</option>
                                <option value="2">修改</option>
                                <option value="3">删除</option>
                                <option value="4">上线</option>
                                <option value="5">下线</option>
                                <option value="6">绑定设备</option>
                                <option value="7">解绑设备</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="m-l-20 m-r-5">绑定/解绑设备</label>
                            <input type="text" placeholder="请输入设备编号" class="form-control"
                                   v-model="his_station.equipmentId">
                        </div>
                        <div class="form-group pull-right">
                            <input type="button" class="btn btn-info pull-right" value="搜索" @click="stationHisSearch"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--搜索条结束-->
    <!--表格开始-->
    <div class="m-t-10 bgf">
        <!--currTab-->
        <div v-show="currTab==1 && ('ROLE_FUN_102_01_01' in allFunctions)">
            <div class="table-head ovh">
                <div class="m-t-5 m-b-5 m-l-10 pull-left">
                    <button v-if="'ROLE_FUN_102_01_03' in allFunctions" class="btn btn-info m-r-5" @click="addMonitor">
                        新增
                    </button>
                    <button v-if="'ROLE_FUN_102_01_04' in allFunctions" class="btn btn-info m-r-5" @click="showImportModal">
                        导入
                    </button>
                    <button v-if="'ROLE_FUN_102_01_05' in allFunctions" class="btn btn-info m-r-5"
                            @click="updateStatus('2')">上线
                    </button>
                    <button v-if="'ROLE_FUN_102_01_06' in allFunctions" class="btn btn-info m-r-5"
                            @click="updateStatus('1')">下线
                    </button>
                    <button v-if="'ROLE_FUN_102_01_07' in allFunctions" class="btn btn-danger" @click="deleteByIds">
                        批量删除
                    </button>
                </div>
            </div>
            <div class="clear table-responsive xhideyauto">
                <vuetable ref="vuetable" api-url="${coreApiPath}/manage/station/page" http-method="post"
                          :fields="fields" :table-height="tableHeight" :per-page="perPage" :append-params="moreParams"
                          :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }"
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
        <div v-if="currTab!=1 && ('ROLE_FUN_102_01_02' in allFunctions)" class="table-responsive">
            <vuetable ref="vuetable" api-url="${coreApiPath}/manage/station/pageHis" http-method="post"
                      :fields="fieldsHistory" :fill-form="fillFormRight" :table-height="tableHeight"
                      :load-on-start="true" :per-page="perPage" :append-params="hismoreParams"
                      :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }"
                      pagination-path="paginationRightTable" @vuetable:pagination-data="onPaginationData"
                      @vuetable:load-success="onLoadSuccess"></vuetable>
            <div class="vuetable-pagination">
                <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                <component :is="paginationComponent" ref="pagination"
                           @vuetable-pagination:change-page="onChangePage"></component>
                <%--<component :is="paginationComponent2" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>--%>
            </div>
        </div>
    </div>
    <!--表格结束-->
    <!-- 站点导入弹框 -->
    <div class="modal fade" id="importStationModal" tabindex="-1" role="dialog"
         aria-labelledby="myModalExcelLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <div class="modal-title">批量导入</div>
                </div>
                <div class="modal-body">
                    <form id="fileUpload" enctype="multipart/form-data" method="post"
                          action="${requestScope.coreApiContextPath}/manage/station/batchImport">
                        <label class="m-r-10">所属项目</label>
                        <select v-model="importProjectId" name="importProjectId" class="form-control w200">
                            <option value="">请选择</option>
                            <option v-for="item in projectList" :value="item.id">{{ item.name }}</option>
                        </select>
                        <input id="excelFile" name="excelFile" type="file" class="m-t-10 m-b-10"/>
                        <a href="${ctx}/resources/template/Station_Import_Template.xlsx">导入文件模板下载</a>
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
</div>
<script type="text/javascript" src="${ctx}/resources/plugins/jquery-file-upload/js/jquery.form.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/system/equipment/monitoring_index.js"></script>
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