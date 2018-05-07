<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.ResourceBundle" %>
<%@include file="../../includeJsCss.jsp" %>
<script type="text/javascript">
	var communicat_IP_Port = "communicat_IP_Port";
</script>
<!DOCTYPE html>
<html>

	<head>
		<title>蛙鸣科技 | 微站管理</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="renderer" content="webkit">
		<meta http-equiv="Cache-Control" content="no-siteapp" />
		<link type="text/css" rel="stylesheet" href="${ctx}/resources/plugins/bootstarp-fileinput/css/fileinput.css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
		<script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table.css" />
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-1.0.24.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/vue/vue-table.js"></script>
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript">
			sessionStorage.setItem("tag", "1,1");
		</script>
	</head>

	<body id="app">
		<%@ include file="../../V1/topMenu.jsp" %>
		<div id="content" class="col-sm-12 p-l-10 p-r-10">
			<!-- begin breadcrumb -->
			<div class="search-formgroup m-t-10">
				<form role="form">
					<div class="form-inline">
						<div class="form-group">
							<label class="m-l-20 m-r-5">站号</label>
							<input type="text" class="form-control" id="station_id" name="station_id" placeholder="请输入搜索选项">
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">设备类型</label>
							<select class="form-control" name="s_tech_type" v-model="searchdevtype" id="s_tech_type">
								<option value="">请选择</option>
								<option v-for="option in devtypelist" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">站点类型</label>
							<select class="form-control" name="station" v-model="searchstationtype" id="seaStationType">
								<option value="">请选择</option>
								<option v-for="option in stationtypelist" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label class="m-l-20 m-r-5">状态</label>
							<select class="form-control" id="selType" name="type" v-model="searchstatus">
								<option value="">请选择</option>
								<option v-for="option in statustypelist" value="{{option.code}}">{{option.name}}</option>
							</select>
						</div>
						<div class="form-group">
							<label for="s_province" class="m-l-20 m-r-5">省份</label>
							<select class="form-control" id="s_province" v-model="searchprovince">
								<option value="">请选择</option>
								<option v-for="option in prolist" value="{{option.id}}">{{option.province}}</option>
							</select>
						</div>
						<div class="form-group">
							<label for="s_city" class="m-l-20 m-r-5">城市</label>
							<select class="form-control" id="s_city" v-model="searchcity">
								<option value="">请选择</option>
								<option v-for="option in citylist" value="{{option.id}}">{{option.city}}</option>
							</select>
						</div>
						<div class="form-group">
							<label for="s_district" class="m-l-20 m-r-5">县/区</label>
							<select class="form-control" id="s_district" v-model="searchdistrict">
								<option value="">请选择</option>
								<option v-for="option in dislist" value="{{option.id}}">{{option.district}}</option>
							</select>
						</div>
						<div class="form-group pull-right">
							<button type="button" class="btn btn-info pull-right" @click="search">搜索</button>
						</div>
					</div>
				</form>
			</div>
			<input type="hidden" name="mapCenter" id="mapCenter" value="<c:out value='${auth.user.cityName}'/>">
			<div class="chunk-set m-t-10">
				<div class="m-t-10 m-b-10 m-l-10 pull-left">
					<label>显示</label>
					<select v-model="perPage" name="stationTable_length" aria-controls="stationTable" class="form-control">
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="40">40</option>
						<option value="50">50</option>
					</select>
					<label>项结果</label>
				</div>
				<div class="m-t-10 m-b-10 m-l-10 pull-left">
					<button class="btn btn-info m-r-10" @click="addStation">新增</button><button class="btn btn-info m-r-10" @click="showImportFile">导入</button><button class="btn btn-info m-r-10" @click="mulSetCommand">新版端站下发指令</button><button class="btn btn-danger" @click="mulDelete">批量删除</button>

				</div>
				<!-- 列表开始 -->
				<div class="table-responsive clear">
					<vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/equipment/page" :selected-to="selectedTo" :fields="fields" :multi-sort="multiSort" :pagination-component="paginationComponent" :item-actions="itemActions" :append-params="moreParams" :per-page="perPage" pagination-path="" table-class="table table-bordered table-striped table-hover" table-wrapper=".vuetable-wrapper" ascending-icon="glyphicon glyphicon-chevron-up" descending-icon="glyphicon glyphicon-chevron-down" pagination-class="" pagination-info-class="" pagination-component-class="" wrapper-class="vuetable-wrapper" loading-class="loading" row-class-callback="rowClassCB">
					</vuetable>
				</div>
				<!-- 列表结束 -->
			</div>
		</div>
		<!--单个删除确认对话框-->
		<div class="modal fade" id="stationDelModal" tabindex="-1" role="dialog" aria-labelledby="stationDelModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<form class="form-horizontal" role="form">
				<input type="hidden" id="hidStationId">
				<div class="modal-dialog modal-sm ">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" id="stationlModalLabel">提示信息</div>
						</div>
						<div class="modal-body" style="text-align: left;">
							<h5>您确定要删除当前信息吗？</h5>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
							<button type="button" class="btn btn-primary" id="delSubmit" onclick="deleteStationByIds()">确认
                    </button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<!-- 	图片上传-->
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 900px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<div class="modal-title" id="myModalLabel" align="center">
							图片管理
						</div>
					</div>
					<div style="margin-top: 20px; margin-right: 30px; margin-left: 30px;" class="center-block" id="inside">
						<input id="photostationid" type="hidden" value="" />
						<ul class="list-unstyled" style="margin-bottom: 70px;">
							<li>
								<ul class="list-inline">
									<a type="button" class="btn btn-info" id="reView" onclick="goReView()"> <span class="glyphicon glyphicon-facetime-video" aria-hidden="true"></span>&nbsp;图片查看 </a>
									<a type="button" class="btn btn-warning" onclick="op()"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>图片上传 </a>
								</ul>
							</li>
							<li id="photostab" class="photostab">
								<div class="photosdiv">
									<div Zv-if="images.length<1" class="file-drop-zone-title" style="text-align: center;">暂无图片
									</div>
									<div v-for="(index,img) in images" class="file-review-frame">
										<div v-if="img.isselect" class="removeicondiv">
											<span class="glyphicon glyphicon-ok-sign"></span>
										</div>
										<img :src="img.imageUrl" @click="deletePic(index,img)">
									</div>
								</div>
								<button class="btn btn-danger " style="float: right; margin-top: 20px;" @click="mulPicDelete">批量删除
                        </button>
							</li>
							<li id="pho" style="margin-top: 20px; background: #ffffff;"></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!-- 模态框上传excel（Modal） -->
		<div class="modal fade" id="myModalExcel" tabindex="-1" role="dialog" aria-labelledby="myModalExcelLabel" aria-hidden="true" enctype="multipart/form-data" method="post">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<div class="modal-title" id="upModalLabel">请参照模板</div>
						<a href="${ctx }/resources/template/Device_Import_Template.xlsx">模板下载 </a>
					</div>
					<div class="modal-body">
						<form id="fileUpload" enctype="multipart/form-data" method="post">
							<input id="excelFile" name="excelFile" type="file" v-model="excelFile" class="magin10" />
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-primary addSubBtn" data-dismiss="modal" @click="importFile">确认
                </button>
					</div>
				</div>
			</div>
		</div>
		<!-- 	新增 -->
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="addModal" tabindex="-1" role="dialog" aria-labelledby="addModalModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 900px;">
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
										<label class="m-r-5 form-label text-right">端站名称</label>
										<input type="text" class="form-control w200" v-model="newstation.stationName" id="stationName" name="stationName">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="sTechType">站点类型</label>
										<select name="sTechType" id="sTechType" class="form-control w200" v-model="newstation.stationType">
											<option v-for="option in stationtypelist" value="{{option.code}}">{{option.name}}
											</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="techType">设备类型</label>
										<select name="sTechType" id="techType" class="form-control w200" v-model="newstation.techType">
											<option v-for="option in devtypelist" value="{{option.code}}">{{option.name}}</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="businessType">业务标识</label>
										<input type="text" class="form-control w200" id="businessType" v-model="newstation.businessType" name="businessType">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="populationCity">城市</label>
										<select name="wwZcity.id" id="populationCity" class="form-control w200" v-model="newstation.city">
											<option v-for="option in newcitylist" value="{{option.id}}">{{option.city}}</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">地址</label>
										<input type="text" class="form-control w200" id="addr" v-model="newstation.addr" name="addr">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="lng">纬度</label>
										<input type="text" class="form-control w200" @blur="baiduBlur" id="lng" v-model="newstation.latReal" name="lng">
									</div>
								</div>
							</div>
							<div class="form-group col-md-6">
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="stationId">端站ID</label>
										<input type="text" class="form-control w200" id="stationId" v-model="newstation.stationId" name="stationId">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="collectInternel">采集间隔</label>
										<input type="text" class="form-control w200" id="collectInternel" v-model="newstation.collectInternel" name="collectInternel">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="uploadInternel">上传间隔</label>
										<input type="text" class="form-control w200" id="uploadInternel" v-model="newstation.uploadInternel" name="uploadInternel">
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="productType">终端类型</label>
										<select name="sTechType" id="productType" class="form-control w200" v-model="newstation.productType">
											<option v-for="option in producttypelist" value="{{option.code}}">{{option.name}}
											</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="populationPro">省份</label>
										<select name="wwZprovince.id" id="populationPro" class="form-control w200" v-model="newstation.pro">
											<option v-for="option in newprolist" value="{{option.id}}">{{option.domainName}}</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="populationDistrict">县/区</label>
										<select name="wwZdistrict.id" id="populationDistrict" v-model="newstation.district" class="form-control w200">
											<option v-for="option in newdislist" value="{{option.id}}">{{option.district}}</option>
										</select>
									</div>
								</div>
								<div class="form-inline">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right" for="lat">经度</label>
										<input type="text" class="form-control w200" @blur="baiduBlur" id="lat" v-model="newstation.lngReal" name="lat">
									</div>
								</div>
							</div>
							<template v-if="newstation.id">
								<div class="form-group">
									<label class="m-r-5 form-label text-right" for="baiDuLat">百度经度</label>
									<div class="col-sm-3">
										<input type="text" class="form-control w200" id="baiDuLat" v-model="newstation.lng" readonly="readonly" name="baiDuLat">
									</div>
									<label class="m-r-5 form-label text-right" for="baiDuLng">百度纬度</label>
									<div class="col-sm-3">
										<input type="text" class="form-control w200" id="baiDuLng" v-model="newstation.lat" readonly="readonly" name="baiDuLng">
									</div>
								</div>
							</template>

							<div class="form-group">
								<label class="m-r-15 form-label text-right pull-left" for="mark">备注</label>
								<textarea rows="3" class="form-control m-l-5" style="width: 617px;" id="mark" v-model="newstation.mark" name="mark"></textarea>

							</div>
						</form>
						<form id="addStationSensorForm" class="form-horizontal">
							<div class="form-group">
								<label class="col-sm-9 control-label" for="deviceTable">注：
                            下面这个表格的每列都可以编辑，输入传感器编号时自动带出传感器信息并可以作相关修改</label>
							</div>
							<!-- 列表开始 -->
							<div class="table-responsive">
								<table id="deviceTable" class="table table-striped table-bordered customselt" cellspacing="0" width="100%">
									<thead class="sensorThead">
										<tr>
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
											<td><input class="form-control" type="text" @blur="autoSendor(index,sensor)" v-model="sensor.deviceId"></td>
											<td><input class="form-control" type="text" v-model="sensor.deviceName">
											</td>
											<td>
												<select class="form-control" v-model="sensor.deviceType">
													<option v-for="option in sensortypelist" value="{{option.code}}">
														{{option.name}}
													</option>
												</select>
											</td>
											<td>
												<input class="form-control" style="width: 50px;" type="text" v-model="sensor.labK"></td>
											<td>
												<input class="form-control" style="width: 70px;" type="text" v-model="sensor.labOfset"></td>
											<td>
												<input class="form-control" style="width: 50px;" type="text" v-model="sensor.realK"></td>
											<td>
												<input class="form-control" style="width: 70px;" type="text" v-model="sensor.realOfset"></td>
											<td>
												<select class="form-control" style="width: 100px;" v-model="sensor.status">
													<option v-for="option in sensorstatuslist" value="{{option.code}}">
														{{option.name}}
													</option>
												</select>
											</td>
											<td><input type="button" v-if="sensorList.length>1" class="btn btn-danger " title="删除" @click="sensorDel(index)" value="删除" />
												<input type="button" class="btn btn-primary" title="添加" @click="sensorAdd(sensor)" value="添加" /></td>
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
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="setCommand" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 900px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
						<div class="modal-title" id="setCommandModalLabel"></div>
					</div>
					<div class="modal-body" data-scrollbar="true" style="background: #ffffff; height: 400px; overflow-y: auto; padding-top: 35px;">
						<div class="col-md-2 control-label" for="txtName">下发基础指令:</div>
						<div class="col-md-4">
							<select class="form-control" name="baseCommadSel" id="baseCommadSel">
								<option value="">请选择</option>
								<option value="0">设备复位</option>
								<option value="1">恢复出厂值指令</option>
								<option value="2">健康包状态查询</option>
								<option value="3">小区基站信息查询</option>
								<option value="4">GPS信息查询</option>
							</select>
						</div>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setBaseCommadSel" style="margin-left: 20px;">下发
                    </button>
						</div>
						<div class="col-md-2 control-label" style="clear: both;" for="txtName">下发通用查询指令:</div>
						<div class="col-md-4">
							<select class="form-control" name="queryCommadSel" id="queryCommadSel">
								<option value="">请选择</option>
								<option value="1">IP端口</option>
								<option value="2">时间校准</option>
								<option value="3">终端SIM卡号</option>
								<option value="4">正常模式下数据上传时间</option>
								<option value="5">低功耗模式下数据上传时间</option>
								<option value="6">健康包上传时间间隔</option>
								<!-- 								<option value="7">传感器实验室校准值K1，B1，K2，B2</option> -->
								<!-- 								<option value="8">传感器应用校准值K1，B1，K2，B2</option> -->
								<option value="9">PM2.5传感器主被查询</option>
								<option value="10">短信配置号码</option>
								<option value="11">硬件配置字</option>
								<option value="176">传感器实验室修正系数批量查询</option>
								<option value="160">传感器应用修正系数批量查询</option>
							</select>
						</div>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setQueryCommadSel" style="margin-left: 20px;">下发
                    </button>
						</div>
						<div class="col-md-2 control-label" style="clear: both;"></div>
						<div class="col-md-4" style="display: none;" id="setQuery7_8Sel">
							<select id='example-getting-started' class='form-control' multiple="multiple">
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
						<div class="col-md-2 control-label" style="clear: both;" for="txtName">下发设置参数指令:</div>
						<div class="col-md-4" id="sss">
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
							<div style="width: 100%; height: 100px; margin-top: 20px;" id="apps"></div>
						</div>
						<button type="button" class="btn btn-primary" style="float: right; position: absolute; bottom: 10px; right: 30%; display: none;" id="er">
                    保存（继续配置下一项）
                </button>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setCommadSel1" style="margin-left: 20px;">
                        下发
                    </button>
						</div>
					</div>
					<div class="modal-footer">
						<!-- 表示应谨慎采取的动作 -->
						<button type="button" class="btn btn-warning" data-dismiss="modal">返回</button>
					</div>
				</div>
			</div>
		</div>
		<!-- 老版下发命令 -->
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="oldSetCommand" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 900px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
						<div class="modal-title">老版端站下发指令</div>
					</div>
					<div class="modal-body" data-scrollbar="true" style="background: #ffffff; height: 400px; overflow-y: auto; padding-top: 35px;">
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
							<button type="button" class="btn  btn-info" @click="setOldBaseCommadSel" style="margin-left: 20px;">下发
                    </button>
						</div>
						<div class="col-md-3 control-label" style="clear: both; display: none">下发历史数据回调指令:</div>
						<div class="col-md-4" style="display: none">
							<input id="hisCommandStartTime" class="form-control Wdate" type="text" placeholder="开始时间" onfocus="WdatePicker({dateFmt:'yyMMddHHmm',isShowClear:false,isShowToday: false, firstDayOfWeek: 1, maxDate:'#F{$dp.$D(\'hisCommandEndTime\',{d:-0});}'})" />
							<input id="hisCommandEndTime" class="form-control Wdate" type="text" placeholder="结束时间" onfocus="WdatePicker({dateFmt:'yyMMddHHmm',isShowClear:false,isShowToday: false, firstDayOfWeek: 1,minDate:'#F{$dp.$D(\'hisCommandStartTime\',{d:0});}'})" />
						</div>
						<div class="form-group col-md-3" style="display: none">
							<button type="button" class="btn  btn-info" @click="setOldHistoryCommadSel" style="margin-left: 20px;">下发
                    </button>
						</div>
						<div class="col-md-3 control-label" style="clear: both;">修改采集/传输间隔:</div>
						<div class="col-md-2">
							<input id="oldCollectInternel" type='number' min="1" max="99" class='form-control' placeholder='采集间隔' />
						</div>
						<div class="col-md-2">
							<input id="oldTransferInternel" type='number' min="1" max="99" class='form-control' placeholder='传输间隔' />
						</div>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setOldModifyIntervalCommand" style="margin-left: 20px;">下发
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
							<input type="number" id="sensorK1" min="0.01" max="9.99" step="0.01" class='form-control' placeholder='k1值' />
						</div>
						<div class="col-md-2">
							<input type="number" id="sensorB1" min="-999" max="999" class='form-control' placeholder='b1值' />
							<input type="number" id="sensorK2" min="0.01" max="9.99" step="0.01" class='form-control' placeholder='k2值，o3时使用' />
						</div>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setOldModifyKBCommand" style="margin-left: 20px;">下发
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
							<button type="button" class="btn  btn-info" @click="setOldSensorChannelCommand" style="margin-left: 20px;">下发
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
								<input type="text" id="sensorCodeValue2" class='form-control' placeholder='传感器编号' />
								<select class="form-control" id="sensorCodeValue3">
									<option value="0" selected>传感器已报废</option>
									<option value="1">传感器正在工作</option>
									<option value="2">传感器处于备用状态</option>
								</select>
								<input type="text" id="sensorCodeValue4" class='form-control' placeholder='传感器编号' />
								<select class="form-control" id="sensorCodeValue5">
									<option value="1" selected>正在使用传感器1</option>
									<option value="2">正在使用传感器2</option>
									<option value="3">两个传感器同时工作</option>
								</select>
							</div>
						</div>
						<div class="form-group col-md-3">
							<button type="button" class="btn  btn-info" @click="setOld  CodeCommand" style="margin-left: 20px;">下发
                    </button>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning" data-dismiss="modal">退出</button>
					</div>
				</div>
			</div>
		</div>
		<%--&lt;%&ndash;查看经纬度&ndash;%&gt;--%>
		<%--<div class="modal fade" data-backdrop="static" data-keyboard="false" id="viewLngLatModal" tabindex="-1" role="dialog"--%>
		<%--aria-labelledby="viewLngLatModalLabel" aria-hidden="true">--%>
		<%--<div class="modal-dialog" style="width: 900px;">--%>
		<%--<div class="modal-content">--%>
		<%--<div class="modal-header">--%>
		<%--<button type="button" class="close" @click="clearCeJu">--%>
		<%--<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>--%>
		<%--</button>--%>
		<%--<div class="modal-title" id="viewLngLatModalTitle">查看经纬度信息</div>--%>
		<%--</div>--%>
		<%--<div class="modal-body" data-scrollbar="true">--%>
		<%--<form id="viewLngLatForm" class="form-horizontal">--%>
		<%--<div class="form-group">--%>
		<%--<div style="width: 800px">--%>
		<%--<div style="position: absolute;right: 20px;top: 10px;z-index: 9999;">--%>
		<%--<a class="btn btn-white btn-xs" @click="ceju">测距</a>--%>
		<%--</div>--%>
		<%--<div class="Map-All"--%>
		<%--style="width: 780px; height:400px; position: relative; top: 0px; left: 5%;">--%>
		<%--<div id="WMMAP3" style="height: 100%;display: none;"></div>--%>
		<%--</div>--%>
		<%--</div>--%>
		<%--</div>--%>
		<%--</form>--%>
		<%--</div>--%>
		<%--<div class="modal-footer">--%>
		<%--<button type="button" class="btn btn-warning" @click="clearCeJu">返回</button>--%>
		<%--</div>--%>
		<%--</div>--%>
		<%--</div>--%>
		<%--</div>--%>
		<div class="modal fade" data-backdrop="static" data-keyboard="false" id="viewLngLatModal2" tabindex="-1" role="dialog" aria-labelledby="viewLngLatModalLabel" aria-hidden="true">
			<div class="modal-dialog" style="width: 600px;">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" @click="clearCeJu">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
						<div class="modal-title" id="viewLngLatModalLabel"></div>
					</div>
					<div class="modal-body" data-scrollbar="true" style="height: 430px;">
						<div class="col-sm-12">
							<div style="position: absolute;right: 20px;top: 10px;z-index: 9999;">
								<a class="btn btn-white btn-xs" @click="ceju">测距</a>
							</div>
							<div class="Map-All" style="width: 100%; height: 400px; position: relative; top: 0px; left: 0;">
								<div id="WMMAP2" style="height: 100%"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>

</html>
<script>
	var spr = new Array();
	var ss = new Array();
	var ss1 = new Array();
	var tag = "";
	var ind = "";
	$("#str").on("change", function() {
		var sel = $('#str option:selected').val();
		if(sel == "1") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='text' class='form-control' placeholder='ip地址' id='configValue1_1'/>")
			$("#apps").append("<input type='text' class='form-control' placeholder='端口号' style='margin-top: 10px;' id='configValue1_2'/>")
			//$("#sss").append("<input type='text' />")
		} else if(sel == "2") {
			$("#er").css("display", "none");
			$("#apps").text("");
		} else if(sel == "3") {
			$("#er").css("display", "none");
			$("#apps").text("");
			$("#apps").append("<input type='number' class='form-control' placeholder='终端SIM卡号,例如：(13711111111)' id='configValue3'/>")
		} else if(sel == "4") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='number' class='form-control' placeholder='单位秒，写0表示不上传' id='configValue4'/>")
		} else if(sel == "5") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='number' class='form-control' placeholder='单位秒，写0表示不上传' id='configValue5'/>");
		} else if(sel == "6") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='number' class='form-control' placeholder='单位分钟，写0表示不上传' id='configValue6'/>");
		} else if(sel == "176") {
			$("#er").css("display", "block")
			$("#apps").text("");
			$("#apps").append("<select id='haha1' class='form-control'><option value='0'>PM2.5</option><option value='1'>PM2.5(备)</option><option value='2'>PM10</option><option value='3'>CO</option><option value='4'>NO2</option><option value='5'>O3</option><option value='6'>SO2</option><option value='7'>NO</option><option value='8'>CO2</option><option value='9'>TVOC</option><option value='10'>H2S</option><option value='11' >NH3</option></select>")
			$("#apps").append("<input type='number' class='form-control' placeholder='放大系数' style='margin-top: 10px;' id='coefficient' onchange='updates()'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='k1' style='margin-top: 10px;' id='k1' onchange='updates()'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='k2' style='margin-top: 10px;' id='k2' onchange='updates()'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='b1' style='margin-top: 10px;' id='k3' onchange='updates()'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='b2' style='margin-top: 10px;' id='k4' onchange='updates()'/>");
			var ss = $('#haha1 option:selected').val();
			ind = ss;
			$("#haha1").on("change", function() {
				var ss = $('#haha1 option:selected').val();
				ind = ss;
				for(var i = 0; i < 14; i++) {
					if(ss == i) {
						$("#coefficient").val("");
						$("#k1").val("");
						$("#k2").val("");
						$("#k3").val("");
						$("#k4").val("");
					}
				}
			});
			$('#er').unbind();
			$("#er").on("click", function(e) {
				str_ser();
			});
		} else if(sel == "160") {
			$("#er").css("display", "block")
			$("#apps").text("");
			$("#apps").append("<select id='haha' class='form-control'><option value='0'>PM2.5</option><option value='1'>PM2.5(备)</option><option value='2'>PM10</option><option value='3'>CO</option><option value='4'>NO2</option><option value='5'>O3</option><option value='6'>SO2</option><option value='7'>NO</option><option value='8'>CO2</option><option value='9'>TVOC</option><option value='10'>H2S</option><option value='11' >NH3</option></select>")
			$("#apps").append("<input type='number' class='form-control pp' placeholder='放大系数' style='margin-top: 10px;' id='kcoefficient' onchange='updates1()'/>");
			$("#apps").append("<input type='number' class='form-control pp' placeholder='k1' style='margin-top: 10px;' id='kk1' onchange='updates1()'/>");
			$("#apps").append("<input type='number' class='form-control pp' placeholder='k2' style='margin-top: 10px;' id='kk2'onchange='updates1()'/>");
			$("#apps").append("<input type='number' class='form-control pp' placeholder='b1' style='margin-top: 10px;' id='kk3' onchange='updates1()'/>");
			$("#apps").append("<input type='number' class='form-control pp' placeholder='b2' style='margin-top: 10px;' id='kk4' onchange='updates1()'/>");
			var ss = $('#haha option:selected').val();
			$("#haha").on("change", function() {
				for(var i = 0; i < 14; i++) {
					if(ss == i) {
						$("#kcoefficient").val("");
						$("#kk1").val("");
						$("#kk2").val("");
						$("#kk3").val("");
						$("#kk4").val("");
					}
				}
			});
			$('#er').unbind();
			$("#er").on("click", function(e) {
				str_ser1();
			});
		} else if(sel == "9") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='radio' name='radioPm25' id='r1' value='0' style='position: relative;top: 2px;'/>&nbsp;&nbsp;<label for='r1' >主PM2.5传感器</label>")
			$("#apps").append("&nbsp;&nbsp;<input type='radio' name='radioPm25' id='r2' value='1' style='position: relative;top: 2px;'/>&nbsp;&nbsp;<label for='r2' >从PM2.5传感器</label>")
		} else if(sel == "10") {
			$("#er").css("display", "none")
			$("#apps").text("");
			$("#apps").append("<input type='number' class='form-control' placeholder='号码1' style='margin-top: 10px;' id='ed1'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='号码2' style='margin-top: 10px;' id='ed2'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='号码3' style='margin-top: 10px;' id='ed3'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='号码4' style='margin-top: 10px;' id='ed4'/>");
			$("#apps").append("<input type='number' class='form-control' placeholder='号码5' style='margin-top: 10px;' id='ed5'/>");
		} else if(sel == "11") {
			$("#er").css("display", "none");
			$("#apps").text("");
			$("#apps").append("<input type='text' class='form-control' placeholder='配置字' id='configValue11'/>")
		}
		if(sel == "") {
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
		if(a != "" && b != "" && c != "" && d != "" && e != "") {
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
		if(a != "" && b != "" && c != "" && d != "" && e != "") {
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
		if(a == "" || b == "" || c == "" || d == "" || e == "") {
			layer.msg("请将信息填写完整!");
			return;
		}
		var flag = false;
		for(var i = 0; i < ss.length; i++) {
			if(ss[i].sensorType == ind) {
				flag = true;
			}
		}
		if(!flag) {
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
		console.log(ss)
	}

	function str_ser1() {
		var e = $("#kcoefficient").val();
		var a = $("#kk1").val();
		var b = $("#kk2").val();
		var c = $("#kk3").val();
		var d = $("#kk4").val();
		if(a == "" || b == "" && c == "" || d == "" || e == "") {
			layer.msg("请将信息填写完整!");
			return;
		}
		var flag = false;
		var ind = $('#haha option:selected').val();
		for(var i = 0; i < ss1.length; i++) {
			if(ss1[i].sensorType == ind) {
				flag = true;
			}
		}
		if(!flag) {
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
	$("#queryCommadSel").on("change", function() {
		var sel = $('#queryCommadSel option:selected').val();
		if(sel == "") return;
		switch(Number(sel)) {
			case 160:
			case 176:
				$("#setQuery7_8Sel").css("display", "block");
				$('#example-getting-started').multiselect();
				$el = $('#example-getting-started');
				$('option', $el).each(function(element) {
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