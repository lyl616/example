
<%@include file="../include.html" %>
<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>

    <link type="text/css" rel="stylesheet" href="../../resources/plugins/bootstarp-fileinput/css/fileinput.css"/>
    <link type="text/css" rel="stylesheet" href="../../resources/plugins/bootstrap-edittable/css/bootstrap.min.css"/>
    <script type="text/javascript" src="../../resources/plugins/bootstarp-fileinput/js/fileinput.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>
    <style>
        .file-drop-zone {
            height: 400px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
<%@ include file="../../V1/topMenu.html" %>
<script type="text/javascript">
    sessionStorage.setItem("tag", "2");
    sessionStorage.setItem("path", "sensor");
</script>
<div id="content" class="content">
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-left f-s-12">
        <li><a href="javascript:;">设备管理</a></li>
        <li><a href="javascript:;">传感器管理</a></li>
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
                                    <label class="col-md-3 control-label" for="station_id">传感器编号</label>
                                    <div class="col-md-7">
                                        <input type="text" class="form-control" id="station_id" name="station_id" placeholder="请输入搜索选项">
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
                                        <!-- <input type="text" class="form-control" id="s_tech_type" name="s_tech_type" placeholder="请输入搜索选项"> -->

                                        <select class="form-control" name="s_tech_type" id="s_tech_type">
                                            <option v-for="option in devtypelist" value="{{option.id}}">{{option.name}}</option>
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
                                        <select class="form-control" id="selType" name="type">
                                            <option v-for="option in statustypelist" value="{{option.id}}">{{option.name}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group col-md-2">
                            <button type="button" class="btn  btn-info"
                                    style="margin-left: 20px;" onclick="search()">搜索
                            </button>
                        </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal-body" style='background: #ffffff'>
        <!-- 列表开始 -->
        <div class="f-s-12">
            <div class="table-responsive">
                <table id="stationTable" class="table table-striped table-bordered customselt" cellspacing="0" width="100%"></table>
            </div>
        </div>
        <!-- 列表结束 -->
    </div>

</div>
<!-- 	新增 -->
<div class="modal fade col-md-6" data-backdrop="static"
     data-keyboard="false" id="addModal" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true"
     style="float: none; margin: auto auto">
    <div class="modal-dialog" style="height: 600px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="myModalLabel"></h4>
            </div>

            <div class="modal-body" data-scrollbar="true"
                 style='height: 400px; background: #ffffff'>
                <form class="form-horizontal" id="addForm" method="post">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">端站名称</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control required" v-model="newstation.stationName" id="stationName" name="stationName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="stationId">端站ID</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control required" id="stationId" v-model="newstation.stationId" name="stationId">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="sTechType">设备类型</label>
                        <div class="col-sm-5">
                            <select name="sTechType" id="sTechType" class="col-md-12" v-model="newstation.techType" style="height: 34px;">
                                <option v-for="option in devtypelist" value="{{option.id}}">{{option.name}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="populationPro">省份</label>
                        <div class="col-sm-5">
                            <select name="wwZprovince.id" id="populationPro"
                                    onchange="initCityByProId(this.value,'-1')" class="col-md-12" v-model="newstation.pro" style="height: 34px;">
                            </select>
                        </div>


                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="populationCity">城市</label>
                        <div class="col-sm-5">
                            <select name="wwZcity.id" id="populationCity"
                                    onchange="initDistrict(this.value, '-1')" class="col-md-12" v-model="newstation.city" style="height: 34px;">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="populationDistrict">县/区</label>
                        <div class="col-sm-5">
                            <select name="wwZdistrict.id" id="populationDistrict" v-model="newstation.district" class="col-md-12" style="height: 34px;">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">地址</label>
                        <div class="col-sm-5">
                            <input type="text" class="form-control required" id="addr" v-model="newstation.addr" name="addr">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="lat">经度</label>
                        <div class="col-sm-3">
                            <input type="text" class="form-control required" id="lat" v-model="newstation.lat" name="lat">
                        </div>
                        <label class="col-sm-2 control-label" for="lng">维度</label>
                        <div class="col-sm-3">
                            <input type="text" class="form-control required" id="lng" v-model="newstation.lng" name="lng">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="baiDuLat">百度经度</label>
                        <div class="col-sm-3">
                            <input type="text" class="form-control required" id="baiDuLat" v-model="newstation.stationName" name="baiDuLat">
                        </div>
                        <label class="col-sm-2 control-label" for="baiDuLng">百度维度</label>
                        <div class="col-sm-3">
                            <input type="text" class="form-control required" id="baiDuLng" v-model="newstation.stationName" name="baiDuLng">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-9">
                            <div class="Map-All"
                                 style="width: 100%; height: 100px; position: relative; top: 0px; left: 10%;">
                                <div id="WMMAP" style="height: 100%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="mark">备注</label>
                        <div class="col-sm-5">
								<textarea rows="3" class="form-control required" id="mark" v-model="newstation.mark"
                                          name="mark"></textarea>
                        </div>
                    </div>
                    <!-- 列表开始 -->
                    <div class="f-s-12">
                        <div class="table-responsive">
                            <table id="deviceTable"
                                   class="table table-striped table-bordered customselt"
                                   cellspacing="0" width="100%">
                            </table>
                        </div>
                    </div>
                    <!-- 列表结束 -->

                    <div class="form-group">
                        <div class="modal-footer">
                            <input type="hidden" id="optFlag"> <input type="hidden"
                                                                      name="id" id="upId"> <input type="hidden"
                                                                                                  name="wwWstation.id" id="pid">
                            <!-- 标准的按钮 -->
                            <button type="button" class="btn btn-primary"
                                    onclick="saveOrUpdate()">保存
                            </button>
                            <!-- 表示应谨慎采取的动作 -->
                            <button type="button" class="btn btn-warning"
                                    data-dismiss="modal">返回
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="../../resources/js/system/equipment/sensor.js"></script>
</body>

</html>
