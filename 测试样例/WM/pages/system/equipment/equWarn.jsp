
<%@include file="../include.html" %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>蛙鸣科技 | 设备告警</title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<link href="../../resources/css/style.min.css" rel="stylesheet" />
		<link href="../../resources/css/rewcssChrome.css" rel="stylesheet" />
		<script type="text/javascript" src="../../resources/plugins/My97DatePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="../../resources/js/system/equipment/equWarn.js"></script>
	</head>
	<body>
		<%@ include file="../../V1/topMenu.html" %>
		<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd HH:mm:ss" />
		<div class="magin10">
			<div class="tabs-container" id="scrollObj">
				<ul class="nav nav-tabs bgf table-head">
					<li class="active">
						<a data-toggle="tab" href="#tab-1" onclick="getRealAlarmsList()" aria-expanded="true">实时告警列表</a>
					</li>
					<li class="">
						<a data-toggle="tab" href="#tab-2" onclick="getHisAlarmsList()" aria-expanded="false">历史告警列表</a>
					</li>
				</ul>
				<div class="tab-content">
					<div id="tab-1" class="tab-pane active">
						<!--搜索条开始-->
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-l-10 m-r-10">监测点编号</label>
									<input type="text" class="form-control" id="sea_stationId" placeholder="请输入监测点编号" />
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-10">项目</label>
									<select class="form-control" id="real_project">
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-10">告警级别</label>
									<select class="form-control" id="real_alarmGrade">
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-10">告警状态</label>
									<select class="form-control" id="real_alarmStatus">
									</select>
								</div>
								<div class="form-group pull-right">
									<input type="button" class="btn btn-md btn-info pull-right" onclick="real_search()" value="搜索" />
								</div>
							</div>
						</div>
						<!--搜索条结束-->
						<!--实时告警列表开始-->
						<div class="table-responsive bgf m-t-10">							
							<table id="tabRealAlarmsList" class="table table-striped table-bordered real_customselt" cellspacing="0" width="100%">
							</table>
						</div>
						<!--实时告警列表结束-->
					</div>
					<div id="tab-2" class="tab-pane">
						<!--搜索条开始-->
						<div class="pd10 bgf b-radius-footer">
							<div class="form-inline">
								<div class="form-group">
									<label class="m-l-10 m-r-10">监测点编号</label>
									<input type="text" class="form-control" id="stationId" placeholder="请输入监测点编号" />
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-10">项目</label>
									<select class="form-control" id="his_project">
									</select>
								</div>
								<div class="form-group">
									<label class="m-l-10 m-r-10">告警级别</label>
									<select class="form-control" id="his_alarmGrade">
									</select>
								</div>
								<div class="form-group">
									<div class="input-group input-daterange">
										<input class="form-control Wdate " id="startTime" name="start" placeholder="开始日期" type="text">
										<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
										<input class="form-control Wdate" id="endTime" name="end" placeholder="结束日期" type="text">
									</div>
								</div>
								<div class="form-group pull-right">
									<input type="button" class="btn btn-md btn-info pull-right" onclick="his_search()" value="搜索" />
								</div>
							</div>
						</div>
						<!--搜索条结束-->
						<!--历史告警列表开始-->
						<div class="table-responsive bgf m-t-10">							
							<table id="tabHisAlarmsList" class="table table-striped table-bordered his_customselt" cellspacing="0" width="100%">
							</table>
						</div>
						
						<!--历史告警列表结束-->
					</div>
				</div>
			</div>
		</div>
		<!-- 设备实时状态列表 模态框（Modal） -->
		<div class="modal fade" id="equWarnsModal" tabindex="-1" role="dialog" aria-labelledby="equWarnsModalLabel" aria-hidden="true">
			<input type="hidden" name="id" id="real_alarm_id" value="" />
			<input type="hidden" name="station_id" id="real_alarm_sattion_id" value="" />
			<div class="modal-dialog" style="width:700px">
				<div class="modal-content model-warnsrealtime" style="height: 527px;">
					<div class="modal-header modal-WarnBtn">
						<button type="button" class="close" onclick="closeEquWarnsModal()" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="lable">
							实时告警信息
							<div class="btn-group pull-right m-r-10">
			                    <span id="real_equ_detail" class="btn btn-info">告警详情</span>
			                     <span id="real_equ_his" class="btn btn-info btn-outline">设备详情</span>
			                     <span id="real_equ_warn_his" class="btn btn-info btn-outline">设备历史告警</span>
			                     <span id="real_equ_status_his" class="btn btn-info btn-outline">设备状态历史</span>
							</div>                   
              			  </h4>
					</div>
					<div class="tabContainer tab-1">
						<!--告警详情开始-->
						<form method="post" id="real_detail_frm">
							<div class="m-t-20 ovh">
								<div class="col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备编号：</label><input class="input-nobg-npborder form-control" name="stationId" disabled="disabled" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="deviceStatus" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">数据状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="dataStatusStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">类型代码：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="类型代码" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">备件告警编码：</label><input class="input-nobg-npborder form-control" name="backupAlarmCode" disabled="disabled"></span>
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警内容：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="content" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备告警时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="lastOccurTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">最新告警时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="lastOccurTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">处理建议：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="处理建议" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">备注：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="备注" value="" />
									</div>
								</div>
								<div class="col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" value="" name="typeStr" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="statusStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警级别：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="currentGradeStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警编码：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="code" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">操作人员：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="ownerName" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警详情：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="告警详情" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">系统接收时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="receiveTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">最后处理时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="lastProcessTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">累计次数：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="count" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">出现故障次数：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="count" value="" />
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" style="height: 66px; background: none;" id="real_equ_detail_note">
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="form-control" style="width: 490px;" cols="1" rows="1" id="real_advice"></textarea>
										<input type="button" class="btn btn-info" onclick="sendMsg('real_alarm_id','real_advice','real_equ_detail_note')" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-info" onclick="OpenOptConfirmModal('5','重启设备','c72222');">重启</button>
									<button type="button" class="btn btn-info" onclick="OpenOptConfirmModal('2','认领设备','c72222');">认领 </button>
									<button type="button" class="btn btn-info" onclick="OpenOptConfirmModal('6','更换设备','c72222');">更换 </button>
									<button type="button" class="btn btn-danger" onclick="OpenOptConfirmModal('4','关闭数据','c72222');">关闭数据 </button>
									<button type="button" class="btn btn-danger" onclick="OpenOptConfirmModal('3','关闭告警','c72222');">关闭告警 </button>
									<button type="button" class="btn btn-white" onclick="closeEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-2" style="display: none;">
						<!--设备详情开始-->
						<form method="post" action="/" id="real_equ_detail_frm">
							<div class="m-t-20 ovh">
								<div class="col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备编号：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="stationId" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="设备类型" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">采集间隔：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="采集间隔" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">上次清洗时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="上次清洗时间" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">已用多长时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="已用多长时间" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">对应监控点：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="对应监控点" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">监控点类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="监控点类型" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">监控点地址：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="监控点地址" value="" />
									</div>
								</div>
								<div class="col-lg-6 col-sm-6 col-xs-6">
									<div class="form-control" style="height: 250px;" id="realEquMap"></div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto" style="height: 66px; background: none;">
										<span class="db">2016-05-06 17:09:39 设备上线</span>
										<span class="db">2016-05-06 17:09:40 更换传感器</span>
										<span class="db">2016-05-06 17:09:40 独立看门狗复位</span>
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="form-control" style="width:490px;" cols="1" rows="1"></textarea>
										<input type="button" class="btn btn-info" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-3" style="display: none;">
						<!--告警详情开始-->
						<form method="post" action="/" id="rel_alarm_dt_frm">
							<div class="m-t-20 ovh">
								<div class="pd10">
									<table class="table table-striped table-bordered raeal_his_customselt" id="tabRalEquHisList" cellspacing="0" width="100%">
									</table>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" id="real_equ_his_note" style="height: 66px; background: none;">
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="form-control" style="width: 490px;" cols="1" rows="1"></textarea>
										<input type="button" class="btn  btn-info" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-4" style="display: none;">
						<form action="/" method="post" id="real_equ_alrm_frm">
							<!--告警详情开始-->
							<div class="m-t-20 ovh">
								<div class="pd10">
									<table class="table table-striped table-bordered real_sta_customselt" id="tabRalEquHisStatus" cellspacing="0" width="100%">
									</table>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto" style="height: 66px; background: none;">
										<span class="db">2016-05-06 17:09:39 设备上线</span>
										<span class="db">2016-05-06 17:09:40 更换传感器</span>
										<span class="db">2016-05-06 17:09:40 独立看门狗复位</span>
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="form-control" style="width: 490px;" cols="1" rows="1"></textarea>
										<input type="button" class="btn  btn-info" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>
		<!-- 设备历史状态列表 模态框（Modal） -->
		<div class="modal fade" id="equWarnsHistroyModal" tabindex="-1" role="dialog" aria-labelledby="equWarnsHistroyLabel" aria-hidden="true">
			<input type="hidden" name="id" id="his_alarm_id">
			<input type="hidden" name="station_id" id="his_alarm_sattion_id">
			<div class="modal-dialog" style="width:700px">
				<div class="modal-content model-warnsHistroy" style="height: 567px;">
					<div class="modal-header modal-WarnBtn">
						<button type="button" class="close" onclick="closeHisEquWarnsModal()" aria-hidden="true">&times;
                </button>
						<h4 class="modal-title" id="equWarnsHistroyLabel">历史告警信息
                    <span id="his_equ_status_his"
                          class="btn btn-xs btn-success btn-outline pull-right m-r-20">设备状态历史</span>
                    <span id="his_equ_warn"
                          class="btn btn-xs btn-success btn-outline pull-right m-r-10">设备历史告警</span>
                    <span id="his_equ_detail_his"
                          class="btn btn-xs btn-success btn-outline pull-right m-r-10">设备详情</span>
                    <span id="his_equ_wain_detail"
                          class="btn btn-xs btn-success  pull-right m-r-10">告警详情</span>
                </h4>
					</div>
					<div class="tabContainer tab-h1">
						<!--告警详情开始-->
						<form method="post" id="his_detail_frm">
							<div class="m-t-20 ovh">
								<div class="col-lg-6 col-sm-6 col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备编号：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="stationId" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="deviceStatus" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">数据状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="dataStatusStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">类型代码：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="类型代码" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">备件告警编码：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="backupAlarmCode" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警内容：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="content" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备告警时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="lastOccurTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">最新告警时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="lastOccurTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">处理建议：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="处理建议" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">备注：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="备注" value="" />
									</div>
								</div>
								<div class="col-lg-6 col-sm-6 col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="typeStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警状态：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="statusStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警级别：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="currentGradeStr" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警编码：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="code" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">最后操作人员：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="ownerName" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">告警详情：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="告警详情" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">系统接收时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="receiveTime" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">转入历史时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="转入历史时间" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">累计次数：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="count" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">出现故障次数：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="count" value="" />
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" style="height: 66px; background: none;" id="his_equ_detail_note">
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="pull-left" style="width: 530px;" cols="1" rows="1" id="his_advice"></textarea>
										<input type="button" class="btn  btn-success" onclick="sendMsg('his_alarm_id','his_advice','his_equ_detail_note')" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeHisEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-h2" style="display: none;">
						<!--设备详情开始-->
						<form method="post" id="his_equ_detail_frm">
							<div class="m-t-20 ovh">
								<div class="col-lg-6 col-sm-6 col-xs-6">
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备编号：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="设备编号" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">设备类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="设备类型" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">采集间隔：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="采集间隔" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">上次清洗时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="上次清洗时间" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">已用多长时间：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="已用多长时间" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">对应监控点：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="对应监控点" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">监控点类型：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="监控点类型" value="" />
									</div>
									<div class="form-group m-b-10">
										<label class="m-r-5 form-label text-right">监控点地址：</label><input class="input-nobg-npborder form-control" disabled="disabled" name="监控点地址" value="" />
									</div>
								</div>
								<div class="col-lg-6 col-sm-6 col-xs-6">
									<div class="form-control" style="height: 250px;">
										此处为地图显示内容
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" style="height: 66px; background: none;">
										<span class="db">2016-05-06 17:09:39 设备上线</span>
										<span class="db">2016-05-06 17:09:40 更换传感器</span>
										<span class="db">2016-05-06 17:09:40 独立看门狗复位</span>
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="pull-left" style="width: 530px;" cols="1" rows="1"></textarea>
										<input type="button" class="btn  btn-success" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeHisEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-h3" style="display: none;">
						<!--告警详情开始-->
						<form method="post" id="his_alarm_dt_frm">
							<div class="m-t-20 ovh">
								<div class="pd10">
									<table class="table table-striped table-bordered his_his_customselt" id="tabHisAlarmHis" cellspacing="0" width="100%">
									</table>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" id="his_equ_his_note" style="height: 66px; background: none;">
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="pull-left" style="width: 530px;" cols="1" rows="1" id=""></textarea>
										<input type="button" class="btn  btn-success" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeHisEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
					<div class="tabContainer tab-h4" style="display: none;">
						<!--告警详情开始-->
						<form method="post" id="his_equ_alrm_frm">
							<div class="m-t-20 ovh">
								<div class="pd10">
									<table class="table table-striped table-bordered his_st_customselt2" id="tabHisEquAlarHis" cellspacing="0" width="100%">
										<thead>
											<tr>
												<th class="text-center">状态改变时间</th>
												<th class="text-center">初始状态</th>
												<th class="text-center">改变状态</th>
												<th class="text-center">操作人员</th>
											</tr>
										</thead>
										<tbody>
											<tr role="row" class="odd">
												<td class=" text-center">2017-05-05 17:05-05</td>
												<td class=" text-center">可安装</td>
												<td class=" text-center">安装</td>
												<td class=" text-center">运维00001</td>
											</tr>
											<tr role="row" class="odd">
												<td class=" text-center">2017-05-05 17:05-05</td>
												<td class=" text-center">可安装</td>
												<td class=" text-center">安装</td>
												<td class=" text-center">运维00001</td>
											</tr>
											<tr role="row" class="odd">
												<td class=" text-center">2017-05-05 17:05-05</td>
												<td class=" text-center">可安装</td>
												<td class=" text-center">安装</td>
												<td class=" text-center">运维00001</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="form-control text-left XhideYauto lh200" style="height: 66px; background: none;">
										<span class="db">2016-05-06 17:09:39 设备上线</span>
										<span class="db">2016-05-06 17:09:40 更换传感器</span>
										<span class="db">2016-05-06 17:09:40 独立看门狗复位</span>
									</div>
								</div>
								<div class="form-group m-b-10 clear m-l-15">
									<div class="text-left XhideYauto lh200">
										<label class="m-r-5 form-label text-right">填写处理意见：</label>
										<textarea class="pull-left" style="width: 530px;" cols="1" rows="1"></textarea>
										<input type="button" class="btn  btn-success" value="发送" />
									</div>
								</div>
							</div>
							<!-- 告警详情结束-->
							<div class="modal-footer">
								<div class="text-center">
									<button type="button" class="btn btn-white" onclick="closeHisEquWarnsModal()">返回</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal -->
		</div>
		<!--批量关闭 确认对话框-->
		<div class="modal fade" id="delRealAlarmMsgModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<form class="form-horizontal" role="form">
				<input type="hidden" id="hidRealAlarmIds">
				<div class="modal-dialog modal-sm ">
					<!-- modal-sm 小的  modal-lg 大的 -->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" id="delRealAlarmMsgLabel">温馨提示</div>
						</div>
						<div class="modal-body" style="text-align: left;">
							是否要
							<h5 id="msgContainer" class="dib"></h5>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
							<button type="button" class="btn btn-primary" onclick="delRealAlarms()">确认</button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="modal fade" id="optConfirmModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
			<form class="form-horizontal" role="form">
				<input type="hidden" id="type_id">
				<div class="modal-dialog modal-sm ">
					<!-- modal-sm 小的  modal-lg 大的 -->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<div class="modal-title" id="optConfirmModalLabel">温馨提示</div>
						</div>
						<div class="modal-body" style="text-align: left;">
							是否要
							<h5 id="msgContainer2" class="dib"></h5>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
							<button type="button" class="btn btn-primary" onclick="saveOpt('real_equ_detail_note')">确认</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</body>
</html>