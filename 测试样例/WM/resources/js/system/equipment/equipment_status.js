/**
 * 设备状态 js
 */
var status = "-1";
$(function() {
    initProject();
	initStationType("station_status", "12");
	$('#station_status').change(function() {
		status = $(this).children('option:selected').val();
		search();
	})
});
// var cityId = '370800';
var cityId = parent.cityId;

var table;

function getEquipmentsPage() {
	table = $("#tabEquimentnList").DataTable({
		"ajax" : {
			url : $.coreApiPath + "/rest/station/equipments",
			type : 'POST',
			data : function(r) {
                r.cityId = cityId;
				r.stationId = $("#stationId").val();
                r.projectId = $("#option_project").val();
				r.station_status = $("#station_status").children('option:selected').val();
			}
		},
		select : {
			"style" : 'os',
			"selector" : 'td:first-child',
			"style" : 'multi'
		},
		"autoWidth" : true,
		"destroy" : true,
		"responsive" : true,
		"processing" : true,
		"serverSide" : true,
		"lengthChange" : false, // 开关，是否显示每页大小的下拉框
		"searching" : false, // 开关，是否启用客户端过滤器
		"info" : true, // 开关，是否显示表格的一些信息
		"paging" : true, // 开关，是否显示分页器
		"ordering" : false, // 开关，是否启用各列具有按列排序的功能
		"pagingType" : "full_numbers",
		"language" : {
			"url" : $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
		},		
		"dom" : '<l<"#topPlugin">f>rt<ip>',
		initComplete : initComplete,
		"columns" : [ {
			"title" : '<input type="checkbox" class="dt_chk_all text-center" />',
			"data" : "stationId",
			"orderable" : false,
			"className" : "text-center",
			"render" : function() {
				return '<input type="checkbox" />';
			}
		}, {
            "title" : "监测点编号",
            "data" : "stationId",
            "className" : "text-center",

        }, {
			"title" : "设备编号",
			"data" : "equipmentId",
			"className" : "text-center",

		}, {
			"title" : "状态",
			"data" : "status",
			"className" : "text-center",
			"render" : function(data, type, full, meta) {
                if (data == "2") {
                    return "正常";
                } else {
                    return "运维中";
                }
				// if (data == "1") {
				// 	return "";
				// } else if (data == "-2") {
				// 	return "维护中";
				// } else if (data == "-1") {
				// 	return "下线";
				// } else if (data == "0") {
				// 	return "关闭";
				// } else if (data == "2") {
				// 	return "正常";
				// }
			}
		}, {
			"title" : "电压",
			"data" : "batteryVoltage",
			"className" : "text-center"

		}, {
			"title" : "CCID",
			"data" : "CCID",
			"className" : "text-center"

		}, {
			"title" : "IMEI",
			"data" : "IMEI",
			"className" : "text-center"

		}, {
			"title" : "IMSI",
			"data" : "IMSI",
			"className" : "text-center"

		}, {
			"title" : "软件版本号",
			"data" : "softwareVersion",
			"className" : "text-center"

		}, {
			"title" : "传感器个数",
			"data" : "sensorCount",
			"className" : "text-center"

		}]
		// , {
		// 	"title" : "操作",
		// 	"data" : "stationId",
		// 	"className" : "text-center",
		// 	"render" : function(data, type, full, meta) {
		// 		return '<button id="assign" class="btn btn-info btn-xs" onclick=showPollDischarge("' + data + '")>查看</button>';
		// 	}
		// }
		//
	});
}


function initProject() {
    var option_project = $("#option_project")
    option_project.empty();
    option_project.append("<option value='-1' selected='selected'>请选择</option>");
    ajax_get($.coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
        for (var i = 0; i < data.length; i++) {
            option_project.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
        }
    })
}

/**
 * 表格加载渲染完毕后执行的方法
 * 
 * @param data
 */
function initComplete(data) {
	initCheckAll("customselt");
}
function initComplete2(data) {
	initCheckAll("customselt2");
}

function search() {
	table.ajax.reload();
}

function showPollDischarge(stationId) {
	initKBTable(stationId);
	$('#equipModal').modal('show');
}

var KBTable = "";
function initKBTable(stationId) {
	KBTable = $("#KBTable").DataTable({
		"ajax" : {
			url : $.coreApiPath + "/rest/station/equipments/kblab",
			type : 'POST',
			data : function(r) {
				r.stationId = stationId;

			}
		},
		select : {
			"style" : 'os',
			"selector" : 'td:first-child',
			"style" : 'multi'
		},
		"autoWidth" : true,
		"destroy" : true,
		"responsive" : true,
		"processing" : true,
		"serverSide" : true,
		"lengthChange" : true, // 开关，是否显示每页大小的下拉框
		"searching" : false, // 开关，是否启用客户端过滤器
		"info" : true, // 开关，是否显示表格的一些信息
		"paging" : true, // 开关，是否显示分页器
		"ordering" : false, // 开关，是否启用各列具有按列排序的功能
		"pagingType" : "full_numbers",
		"language" : {
			"url" : $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
		},
        "dom" : '<l<"#topPlugin">f>rt<ip>',
		initComplete : initComplete2,
		"columns" : [ {
			"title" : '<input type="checkbox" class="dt_chk_all" />',
			"data" : "id",
			"orderable" : false,
			"className" : "select-checkbox text-center",
			"render" : function() {
				return ''
			}
		}, {
			"title" : "类型",
			"data" : "CCID",
			"className" : "text-center"

		}, {
			"title" : "realR",
			"data" : "realR",
			"className" : "text-center"

		}, {
			"title" : "realB",
			"data" : "realB",
			"className" : "text-center"

		}, {
			"title" : "LaB",
			"data" : "LaB",
			"className" : "text-center"

		}, {
			"title" : "LabK2",
			"data" : "LabK2",
			"className" : "text-center"

		}, {
			"title" : "LabB2",
			"data" : "LabB2",
			"className" : "text-center"

		}, {
			"title" : "寿命",
			"data" : "CCID",
			"className" : "text-center"

		}, {
			"title" : "查询时间",
			"data" : "CCID",
			"className" : "text-center"

		}, {
			"title" : "CCID",
			"data" : "CCID",
			"className" : "text-center"

		}
		// , {
		// "title" : "操作",
		// "data" : "stationId",
		// "className" : "text-center",
		// "render" : function(data, type, full, meta) {
		// return '<button id="assign" class="btn btn-info btn-xs" onclick=showPollDischarge("' + data + '")>查看</button>';
		// }
		// }
		]
	});
}