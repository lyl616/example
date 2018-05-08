
<%@include file="../include.html" %>
<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 污染源管理</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script>
        sessionStorage.setItem("tag", "2");
        sessionStorage.setItem("path", "poll");
    </script>
</head>

<body class="ovh">
<%@ include file="../../V1/topMenu.html" %>
<div id="content" class="pd10 table-scroll">
    <!-- begin breadcrumb -->
    <div class="top-search-container">
        <div class="form-inline">
            <div class="form-group">
                <label class="m-l-10 m-r-5">名称</label>
                <input type="text" class="form-control" id="seaName" name="name" placeholder="请输入搜索选项">
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">高架/地面</label>
                <select class="form-control" name="type" id="seaType"
                        onchange="initTypsByPid('seaCategory', this.value, '-1','1');">
                </select>
            </div>
            <div class="form-group">
                <label class="m-l-20 m-r-5">污染源</label>
                <select class="form-control" name="category" id="seaCategory">
                    <option value="-1" selected>全部</option>
                </select>
            </div>
            <div class="form-group pull-right">
                <button type="button" class="btn btn-info pull-right" onclick="search();">搜索</button>
            </div>
        </div>
    </div>
    <input type="hidden" id="addBtn" value="1"/>
    <input type="hidden" id="delBtn" value="1"/>
    <input type="hidden" id="importBtn" value="1"/>
    <input type="hidden" id="pollDischargeBtn" value="1"/>
    <input type="hidden" id="updateBtn" value="1"/>
    <input type="hidden" id="stationBtn" value="1"/>
    <div class="bgf m-t-10">
        <div class="table-responsive">
            <table id="tabPopulationList" class="table table-striped table-bordered customselt" cellspacing="0"
                   width="100%">
            </table>
        </div>
    </div>
</div>
</body>
<!-- 污染源管理添加 Modal begin -->
<div class="modal fade" id="pollutionAddModal" tabindex="-1" role="dialog" aria-labelledby="pollutionAddModalLabel"
     aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-title" id="pollutionAddModalLabel">污染源管理 / 污染源添加</div>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="frmPollutionAdd">
                    <div class="form-group m-t-10">
                        <label for="txt_name" class="m-r-5 form-label text-right">污染源名称</label>
                        <input type="text" class="form-control " name="name" id="txt_name" placeholder="请输入污染源名称">
                        <label for="txtLng" class="m-r-5 form-label text-right">经度</label>
                        <input type="text" class="form-control " name="lng" id="txtLng" placeholder="请输入经度">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="selType" class="m-r-5 form-label text-right">高架源/地面源</label>
                        <select class="form-control" id="selType" name="type"
                                onchange="initTypsByPid('selCatagory', this.value, '-1','-1');">
                        </select>
                        <label for="txtLat" class="m-r-5 form-label text-right ">纬度</label>
                        <input type="text" class="form-control " name="lat" id="txtLat" placeholder="请输入纬度">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="selCatagory" class="m-r-5 form-label text-right">污染源类型</label>
                        <select class="form-control" name="catagory" id="selCatagory">
                        </select>
                        <label for="populationPro" class="m-r-5 form-label text-right">省份</label>
                        <select class="form-control" name="pro" id="populationPro"
                                onchange="initCityByProId(this.value,'-1','populationCity','-1','populationDistrict')">
                        </select>
                    </div>
                    <div class="form-group m-t-10">
                        <label for="selIndustryType" class="m-r-5 form-label text-right">行业类别</label>
                        <select class="form-control" name="industry_type" id="selIndustryType">
                        </select>
                        <label for="populationCity" class="m-r-5 form-label text-right">城市</label>
                        <select class="form-control" name="city" id="populationCity"
                                onchange="initDistrictByCityId(this.value, '-1','populationDistrict')">
                        </select>
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txtAddress" class="m-r-5 form-label text-right">地址</label>
                        <input type="text" class="form-control" name="address" id="txtAddress" placeholder="请输入地址">
                        <label for="populationDistrict" class="m-r-5 form-label text-right">县/区</label>
                        <select class="form-control" name="district" id="populationDistrict">
                        </select>
                    </div>
                    <div class="form-group m-t-10">
                        <label for="ereaDescription" class="m-r-5 form-label text-right">备注</label>
                        <textarea class="form-control" style="width: 352px;" rows="3" name="description"
                                  id="ereaDescription"></textarea>
                    </div>
                    <div class="form-group m-t-10 m-b-10 text-center">
                        <input type="hidden" id="optFlag"> <input type="hidden" name="id" id="uptId">
                        <!-- 标准的按钮 -->
                        <button type="button" class="btn btn-info" onclick="saveOrUpdate()">保存</button>
                        <!-- 表示应谨慎采取的动作 -->
                        <button type="button" class="btn btn-white" data-dismiss="modal">返回</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- 污染源添加 Modal end -->
<!-- 关联监测点 Begin -->
<div class="modal fade" id="pollutionStationModal" tabindex="-1" role="dialog"
     aria-labelledby="pollutionStationModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-title" id="pollutionStationModalLabel">污染源管理 / 关联监测点</div>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="frmpollutionStation">
                    <div class="form-group m-t-10">
                        <label for="selRange" class="m-r-5 form-label text-right">关联监测点</label>
                        <select class="form-control" id="selRange" onchange="changeStations()">
                            <option value="1000" selected="selected">1KM</option>
                            <option value="2000">2KM</option>
                            <option value="3000">3KM</option>
                            <option value="4000">4KM</option>
                            <option value="5000">5KM</option>
                            <option value="6000">6KM</option>
                        </select>
                    </div>
                    <div class="form-group m-t-10">
                        <label for="WMMAP" class="m-r-5 form-label text-right dib va-t">范围</label>
                        <div id="WMMAP" style="height: 250px; width: 435px;" class="dib"></div>
                    </div>
                    <div class="form-group m-t-10 text-center m-b-10">
                        <input type="hidden" name="id" id="hidPollutionSId">
                        <input type="hidden" name="stationIds" id="hidStationIds">
                        <!-- 标准的按钮 -->
                        <button type="button" class="btn btn-info" onclick="saveStation()">保存</button>
                        <!-- 表示应谨慎采取的动作 -->
                        <button type="button" class="btn btn-white" data-dismiss="modal">返回</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- 关联监测点 End -->
<!--单个删除确认对话框-->
<div class="modal fade" id="pollutionDelModal" tabindex="-1" role="dialog" aria-labelledby="pollutionDelModalLabel"
     aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <!-- data-data-backdrop="static" 禁止点击弹框后面内容 -->
    <form class="form-horizontal" role="form">
        <input type="hidden" id="hidPollutionId">
        <div class="modal-dialog modal-sm ">
            <!-- modal-sm 小的  modal-lg 大的 -->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <div class="modal-title" id="pollutionDelModalLabe">提示信息</div>
                </div>
                <div class="modal-body" style="text-align: left;">
                    <h5>您确定要删除当前信息吗？</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-info" id="deletePollutio" onclick="deletePollutionByIds()">确认
                    </button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
    </form>
</div>
<!-- 模态框上传excel（Modal） -->
<div class="modal fade" id="myModalExcel" tabindex="-1" role="dialog" aria-labelledby="myModalExcelLabel"
     aria-hidden="true" enctype="multipart/form-data" method="post">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <div class="modal-title" id="myModalLabel2">请参照模板</div>
                <a href="${ctx }/resources/template/污染源排放量模板.xls">模板下载 </a>
            </div>
            <div class="modal-body">
                <form id="fileUpload" enctype="multipart/form-data" method="post">
                    <input id="excelFile" name="filename" type="file"/>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-info addSubBtn" data-dismiss="modal"
                                onclick="submitExcel()">确认
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- 污染源排放量表格 start -->
<div class="modal fade" id="PollutionModal" tabindex="-1" role="dialog" aria-labelledby="PollutionModalLabel"
     aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" style="width: 700px;">
        <div class="modal-content col-md-12">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <div class="modal-title" id="myModalLabel">污染源排放量</div>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table id="tabPollutionAir" class="table table-striped table-bordered customselt1" cellspacing="0"
                           width="100%">
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- 污染源排放量表格 end -->
<!-- 排放量的增加 -->
<div class="modal fade" id="pollutionAirAddModal" tabindex="-1" role="dialog"
     aria-labelledby="pollutionAirAddModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" style="width: 700px">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" id="pollutionAirAddModalLabel">排放量添加</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" id="frmPollutionAirAdd" name="frmPollutionAirAdd">
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedPm25" class="m-r-5 form-label text-right">pm25(吨)</label>
                        <input type="text" class="form-control " name="dischargedPm25" id="txt_dischargedPm25"
                               placeholder="请输入pm25的值">
                        <label for="txtdischargedPm25" class="m-r-5 form-label text-right">pm25(%)</label>
                        <input type="text" class="form-control " name="percentPm25" id="txtdischargedPm25"
                               placeholder="请输入pm25的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedPm10" class="m-r-5 form-label text-right">pm10(吨)</label>
                        <input type="text" class="form-control " name="dischargedPm10" id="txt_dischargedPm10"
                               placeholder="请输入pm10的值">
                        <label for="txtdischargedPm10" class="m-r-5 form-label text-right">pm10(%)</label>
                        <input type="text" class="form-control " name="percentPm10" id="txtdischargedPm10"
                               placeholder="请输入pm10的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedPmCo" class="m-r-5 form-label text-right">Co(吨)</label>
                        <input type="text" class="form-control " name="dischargedCo" id="txt_dischargedPmCo"
                               placeholder="请输入Co的值">
                        <label for="txtdischargedCo" class="m-r-5 form-label text-right">Co(%)</label>
                        <input type="text" class="form-control " name="percentCo" id="txtdischargedCo"
                               placeholder="请输入Co的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedSo2" class="m-r-5 form-label text-right">So2(吨)</label>
                        <input type="text" class="form-control " name="dischargedSo2" id="txt_dischargedSo2"
                               placeholder="请输入So2的值">
                        <label for="txtdischargedCo" class="m-r-5 form-label text-right">So2(%)</label>
                        <input type="text" class="form-control " name="percentSo2" id="txtdischargedSo2"
                               placeholder="请输入So2的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedNo2" class="m-r-5 form-label text-right">No2(吨)</label>
                        <input type="text" class="form-control " name="dischargedNo2" id="txt_dischargedNo2"
                               placeholder="请输入No2的值">
                    </div>
                    <label for="txtdischargedNo2" class="m-r-5 form-label text-right">No2(%)</label>
                    <input type="text" class="form-control " name="percentNo2" id="txtdischargedNo2"
                           placeholder="请输入No2的百分比">
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedPm" class="m-r-5 form-label text-right">pm(吨)</label>
                        <input type="text" class="form-control " name="dischargedPm" id="txt_dischargedPm"
                               placeholder="请输入pm的值">
                        <label for="txtdischargedPm" class="m-r-5 form-label text-right">pm(%)</label>
                        <input type="text" class="form-control " name="percentPm" id="txtdischargedPm"
                               placeholder="请输入pm的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="txt_dischargedO3" class="m-r-5 form-label text-right">o3(吨)</label>
                        <input type="text" class="form-control " name="dischargedO3" id="txt_dischargedO3"
                               placeholder="请输入o3的值">
                        <label for="txtdischargedO3" class="m-r-5 form-label text-right">o3(%)</label>
                        <input type="text" class="form-control " name="percentO3" id="txtdischargedO3"
                               placeholder="请输入o3的百分比">
                    </div>
                    <div class="form-group m-t-10">
                        <label for="selAirType" class="m-r-5 form-label text-right">类型</label>
                        <select class="form-control" id="selAirType" name="dischargedType"
                                onchange="initTypss('selAirType', this.value, '-1');">
                            <option selected value="1">小时</option>
                            <option value="2">天</option>
                            <option value="3">月</option>
                            <option value="4">年</option>
                        </select>
                    </div>
                    <div class="form-group m-t-10">
                        <div class="col-sm-offset-2 ">
                            <input type="hidden" id="optAdd"> <input type="hidden" name="id" id="upId"> <input
                                type="hidden" name="polutionId" id="pid">
                            <!-- 标准的按钮 -->
                            <button type="button" class="btn btn-info" onclick="saveAir()">保存</button>
                            <!-- 表示应谨慎采取的动作 -->
                            <button type="button" class="btn btn-white" data-dismiss="modal">返回</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- 排放量增加 -->
<!--单个删除确认对话框-->
<div class="modal fade" id="pollutionDelAirModal" tabindex="-1" role="dialog"
     aria-labelledby="pollutionDelAirModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <!-- data-data-backdrop="static" 禁止点击弹框后面内容 -->
    <form class="form-horizontal" role="form">
        <input type="hidden" id="hidPollutionAirId">
        <div class="modal-dialog modal-sm ">
            <!-- modal-sm 小的  modal-lg 大的 -->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="pollutionDelModalLabel">提示信息</h4>
                </div>
                <div class="modal-body" style="text-align: left;">
                    <h5>您确定要删除当前信息吗？</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-info" id="delSubmit" onclick="deletePollutionAirByIds()">确认
                    </button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
    </form>
</div>
<!-- 污染源排放量end -->
<script type="text/javascript" src="../../resources/js/management/pollution/pollution.js"></script>
<script type="text/javascript" src="../../resources/js/management/pollution/pollutionAir.js"></script>
<script type="text/javascript" src="../../resources/js/common/country.js"></script>
<script type="text/javascript" src="../../resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $(window).resize(function() {
            calcOverflowH(1, "table-scroll", 40);
        });
    });
    calcOverflowH(1, "table-scroll", 40);
</script>
</html>