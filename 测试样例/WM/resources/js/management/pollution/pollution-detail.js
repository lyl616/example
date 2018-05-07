/**
 * 地图 查看污染源信息公共 js
 */



function showPollutionInfo(id) {
	var url = $.backendApiPath + "/pollutionrepo/detail/" + id;
	$.ajax({
		type : "GET",
		url : url,
		success : function(data) {
			setProp("pollutionInfo", "p_", data);
			// $("#p_type").html(data.typeConfig.name);
			// $("#p_catagory").html(data.catagoryTypeConfig.name);
			initDischargedsTable(data);
			initWstationsTable(data);
			$("#pollutionInfo").show();
		}
	});
}

function initDischargedsTable(data) {
	$('#p_dischargeds').DataTable({
		data : data.dischargeds,
		"destroy" : true,
		"searching" : false, //开关，是否启用客户端过滤器
		"info" : false, //开关，是否显示表格的一些信息
		"paging" : false, //开关，是否显示分页器
		"language" : {
			"url" : $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
		},
		columns : [ {
			"title" : "PM2.5",
			"data" : "dischargedPm25"
		}, {
			"title" : "PM10",
			"data" : "dischargedPm10"
		}, {
			"title" : "CO",
			"data" : "dischargedCo"
		}, {
			"title" : "SO2",
			"data" : "dischargedSo2"
		}, {
			"title" : "O3",
			"data" : "dischargedO3"
		}, {
			"title" : "NO2",
			"data" : "dischargedNo2"
		} ]
	});
}

function initWstationsTable(data) {
	$('#p_wstations').DataTable({
		data : data.wstations,
		"destroy" : true,
		"searching" : false, //开关，是否启用客户端过滤器
		"info" : false, //开关，是否显示表格的一些信息
		"paging" : false, //开关，是否显示分页器
		"language" : {
			"url" : $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
		},
		columns : [ {
			"title" : "站点",
			"data" : "stationId"
		}, {
			"title" : "状态",
			"data" : "status"
		}, {
			"title" : "AQI",
			"data" : "status"
		}, {
			"title" : "首要污染物",
			"data" : "status"
		} ]
	});
}
