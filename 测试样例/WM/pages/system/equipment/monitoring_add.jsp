<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeVue.jsp" %>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 监测点管理</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link type="text/css" rel="stylesheet" href="${ctx}/resources/plugins/bootstarp-fileinput/css/fileinput.css" />
		<link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet" />
		<link rel="stylesheet" href="${ctx}/resources/plugins/vue/vue-table2.css">
		<link rel="stylesheet" href="${ctx}/resources/plugins/webuploader/css/upload-files.css">
		<link rel="stylesheet" href="${ctx}/resources/plugins/webuploader/css/viewer.min.css">
		<%--<script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput.min.js"></script>--%>
		<%--<script type="text/javascript" src="${ctx}/resources/plugins/bootstarp-fileinput/js/fileinput_locale_zh.js"></script>--%>
		<%--<script type="text/javascript" src="${ctx}/resources/plugins/jquery-file-upload/js/ajaxfileupload.js"></script>--%>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
		<script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
		<script>
			var sid = "${requestScope.id}";
		</script>
	</head>

	<body>
		<%@ include file="../../V1/topMenu.jsp" %>
		<div class="ovh pd10" id="app">
			<div class="panel-body">
				<div class="panel-group" id="accordion">
					<div class="panel panel-default">
						<div class="panel-heading" data-toggle="collapse" data-parent="#accordion" href="#baseinfo">
							<div class="panel-title">
								<a>基本信息</a>
							</div>
						</div>
						<div id="baseinfo" class="panel-collapse collapse in">
							<div class="panel-body">
								<div class="col-sm-4 m-t-5">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>监测点名称</label>
											<input type="text" placeholder="请输入" class="form-control w200" v-model="newstation.stationName">
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>监测点种类</label>
											<select class="form-control w200" v-model="newstation.equipmentType">
												<option value="-1">请选择</option>
												<option v-for="item in equipmentTypeList" :value="item.id">{{item.name}}
												</option>
											</select>
										</div>
									</div>
								</div>
								<div class="col-sm-4 m-t-5">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>监测点编号</label>
											<input type="text" placeholder="请输入监测点编号" id="stationId" v-model="newstation.stationId" class="form-control w200">
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>监测点类型</label>
											<select class="form-control w200" v-model="newstation.stationType">
												<option value="-1">请选择</option>
												<option v-for="item in stationTypeList" :value="item.id">{{item.name}}</option>
											</select>
										</div>
									</div>
								</div>
								<div class="col-sm-4 m-t-5">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>所属项目</label>
											<select class="form-control w200" v-model="newstation.projectId">
												<option value="">请选择</option>
												<option v-for="item in projectList" :value="item.id">{{item.name}}</option>
											</select>
										</div>
									</div>
								</div>

								<div class="form-inline"  id="div-status" hidden="true">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>监测点状态</label>
										<select id="optionStatus" class="form-control w200" v-model="newstation.status">
											<option value="-1">请选择</option>
											<%--<option v-for="item in statusList" :value="item.id">{{item.name}}--%>
											</option>
										</select>
									</div>
								</div>
								<div class="clear"></div>
								<div class="col-sm-4">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>省份</label>
											<select class="form-control w200" v-model="newstation.pro">
												<option value="-1">请选择</option>
												<option v-for="item in newprolist" :value="item.id">{{item.name}}</option>
											</select>
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right">地址</label>
											<input type="text" placeholder="请输入地址" v-model="newstation.addr" class="form-control w200">
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right">杆号</label>
											<input type="text" placeholder="请输入杆号" v-model="newstation.poleId" class="form-control w200">
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right">备注</label>
											<input type="text" placeholder="请输入" v-model="newstation.mark" id="mark" class="form-control w200">
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>城市</label>
											<select class="form-control w200" v-model="newstation.city">
												<option value="-1">请选择</option>
												<option v-for="item in newcitylist" :value="item.id">{{item.name}}</option>
											</select>
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>经度</label>
											<input type="text" placeholder="请输入经度" class="form-control w200"  @blur="addMarker" @keyup="showNewMarker" v-model="newstation.lngReal">
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right">电表</label>
											<input type="text" placeholder="请输入电表" v-model="newstation.ammeterNo" class="form-control w200">
										</div>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>县/区</label>
											<select class="form-control w200" v-model="newstation.district">
												<option value="-1">请选择</option>
												<option v-for="item in newdislist" :value="item.id">{{item.name}}</option>
											</select>
										</div>
									</div>
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>纬度</label>
											<input type="text" placeholder="请输入纬度" v-model="newstation.latReal" @blur="addMarker"  @keyup="showNewMarker"  class="form-control w200">
										</div>
									</div>
								</div>
								<div class="clear"></div>
								<div class="col-sm-12">
									<div class="form-inline">
										<div class="form-group m-b-10">
											<label class="m-r-5 form-label text-right"><i class="g3ba7f9 fsn" @click="showMap" v-html="showMaphtml"></i></label>
											<div v-show="show" class="monitoringMap pull-right" id="monitoringMap" style="width: 880px;height: 268px;border: 1px solid lightgray;display: none;">
											</div>
										</div>
									</div>
								</div>
								<div class="clear"></div>
								<div class="chunk-footer">
									<div class="m-t-10 m-b-10 text-center">
										<button class="btn btn-info m-r-10" @click="saveStationBase">保存</button>
										<button class="btn btn-white" @click="goBack">取消</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading" v-if="_self.newstation.id != '' " data-toggle="collapse" data-parent="#accordion" href="tabs_panels.html#collapseTwo">
							<div class="panel-title">
								<a>图片</a>
							</div>
						</div>
						<div v-else class="panel-heading">
							<div class="panel-title">
								<span>图片</span>
							</div>
						</div>
						<div id="collapseTwo" class="panel-collapse collapse">
							<div class="panel-body pd10">
								<%--<button class="btn btn-info m-r-10" @click="pictureManager" data-toggle="modal">管理图片</button>--%>
								<%--<button class="btn btn-white" @click="goBack" data-toggle="modal">返回</button>--%>
                                    <div>
                                        <ul id="imagesContent" class="upload-ul clearfix">
                                            <li class="upload-pick">
                                                <div class="webuploader-container clearfix" id="imagesUpload"></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="clear"></div>
                                    <div class="chunk-footer">
                                        <div class="m-t-10 m-b-10 text-center">
                                            <button class="btn btn-info m-r-10" @click="saveStationImages">保存</button>
                                            <button class="btn btn-white" @click="goBack">返回</button>
                                        </div>
                                    </div>
							</div>
						</div>
					</div>
					<!-- 设备列表开始 -->
					<div class="panel panel-default" v-show="showStations">
						<div class="panel-heading">
							<div class="panel-title">
								<a v-if="newstation.id != '' " data-toggle="collapse" data-parent="#accordion" href="tabs_panels.html#collapseThree" id="stationListCollapse" @click="equipmentMountTab">设备列表</a>
								<span v-else data-toggle="collapse">设备列表</span>
							</div>
						</div>
						<div id="collapseThree" class="panel-collapse collapse" id="historyMount">
							<div class="panel-body">
								<!--设备列表开始-->
								<div class="chunk-title">已绑定设备
									<button class="btn btn-info m-l-10" v-if="'ROLE_FUN_102_01_09' in allFunctions" @click="unMountEquipment">解绑设备</button>
								</div>
								<div class="chunk-body">
									<div class="XhideYauto">
										<div class="tab-content">
											<!--绑定设备列表开始-->
											<div class="table-responsive">
												<div>
													<div class="vuetable-head-wrapper">
														<table class="vuetable table table-bordered table-striped table-hover vuetable-fixed-layout">
															<thead>
																<tr>
																	<th class="vuetable-th-checkbox-id" style="width: 40px;">
																		<%--<input type="checkbox" @click="checkAllEquipment(event)" v-model="checkAll">--%>
																	</th>
																	<th class="vuetable-th-sequence text-center" style="width: 60px;">序号</th>
																	<th id="_equipmentId" class="vuetable-th-equipmentId text-center">设备编号</th>
																	<th id="_mountStatus" class="vuetable-th-mountStatus text-center">绑定状态</th>
																	<th id="_mountTime" class="vuetable-th-mountTime text-center">绑定时间</th>
																	<th id="_mountTime3" class="vuetable-th-mountTime text-center">解绑时间</th>
																</tr>
															</thead>
															<tbody>
																<tr v-for="(value,index) in mountHisData">
																	<td class="vuetable-th-checkbox-id" style="width: 40px;">
																		<input type="checkbox" v-if="value.mountStatus == 1" :value="value.equipmentId" v-model="equipmentIds" class="equipmentIds" name="equipmentIds">
																		<%--<input type="checkbox" :value="value.equipmentId" v-model="equipmentIds" class="equipmentIds" name="equipmentIds">--%>
																	</td>
																	<td class="vuetable-th-sequence text-center" style="width: 60px;">{{ index+1 }}</td>
																	<td id="{{ value.equipmentId }}" class="vuetable-th-equipmentId text-center">{{ value.equipmentId }}</td>
																	<td id="_mountStatu3s" class="vuetable-th-mountStatus text-center">
																		{{ value.mountStatus == 1 ? '已绑定':'已解绑'}}
																	</td>
																	<td id="_mountTim3e3" class="vuetable-th-mountTime text-center">
																		{{ value.mountTime != null ? new Date(value.mountTime).Format('yyyy-MM-dd HH:mm:ss'):'' }}
																	</td>
																	<td id="_mountTime333" class="vuetable-th-mountTime text-center">
																		{{ value.unmountTime != null ? new Date(value.unmountTime).Format('yyyy-MM-dd HH:mm:ss'):'' }}
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
								<div class="chunk-title m-t-10">未绑定设备
									<button class="btn btn-info m-l-10" v-if="'ROLE_FUN_102_01_08' in allFunctions" @click="mountEquipment">绑定设备</button>
								</div>
								<div class="chunk-body">
									<div class="XhideYauto">
										<div class="tab-content">
											<!--绑定设备列表开始-->
											<div class="table-responsive">
												<vuetable ref="vuetable" api-url="${coreApiPath}/manage/station/unmountEquipments" :fields="fieldsUnMount" :table-height="tableHeight" :per-page="perPage" :load-on-start="loadOnStart" :append-params="moreParams" :track-by="trackByUnMount" :fill-form="fillFormUnmount" :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" pagination-path="pagination" @vuetable:pagination-data="onPaginationData" @vuetable:load-success="onLoadSuccess">
												</vuetable>
												<div class="vuetable-pagination">
													<vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
													<component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
												</div>
											</div>
											<!--绑定设备列表结束-->
										</div>
									</div>
								</div>
								<!--设备列表结束-->
							</div>
						</div>
					</div>
					<!-- 设备列表结束 -->
				</div>
			</div>
			<!--图片上传-->
			<div class="modal fade" id="addPicModal" tabindex="-1" role="dialog" aria-labelledby="addPicModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog" style="width: 900px;">
					<div class="modal-content ">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" id="addPicModalLabel" align="center">
								图片管理
							</div>
						</div>
						<div class="modal-body ovh" id="inside">
							<input id="photostationid" type="hidden" value="" />							
							<div class="tabs-container">
								<ul class="nav nav-tabs">
									<li class="active">
										<a data-toggle="tab" href="javascript:void(0)" aria-expanded="true" @click="goReView">图片查看</a>
									</li>
									<li class="">										
										<a data-toggle="tab" @click="showAddPic" aria-expanded="true" href="javascript:void(0)">图片上传</a>
									</li>
								</ul>
							</div>
							<ul class="pd0">
								<li id="photostab" class="photostab disn">
									<div class="photosdiv">
										<div v-if="images.length<1" class="file-drop-zone-title" style="text-align: center;">暂无图片
										</div>
										<div v-for="(index,img) in images" class="file-review-frame">
											<div v-if="img.isselect" class="removeicondiv">
												<span class="glyphicon glyphicon-ok-sign"></span>
											</div>
											<img :src="img.imageUrl" @click="deletePic(index,img)">
										</div>
									</div>
								</li>
								<li id="pho">
									<div style="width: 100%; height: 430px;">
										<div class="form-group" style="height: 332px;">
											<input id="uploadFileIpt" type="file" name="file" multiple data-preview-file-type="any" data-preview-file-icon="" data-max-file-count="10">
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="modal-footer clear">
							<div class="text-center ">
								<button class="btn btn-info" @click="savePics">确认</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="${ctx}/resources/plugins/webuploader/js/webuploader.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/webuploader/js/viewer.new.min.js"></script>
		<script type="text/javascript" src="${ctx}/resources/plugins/webuploader/js/upload-files.js"></script>
		<script type="text/javascript" src="${ctx}/resources/js/system/equipment/monitoring_add.js"></script>
	</body>

</html>