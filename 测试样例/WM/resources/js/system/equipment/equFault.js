/**
 * 设备故障 js
 */
$(function() {
	initWateStyle("startTime", "endTime");
    initProject();
});

var table;
// var cityId = '370800';
var cityId = parent.cityId;

function gettabequFaultListPage() {
	table = $("#tabequFaultList").DataTable({
		"ajax" : {
			url : $.coreApiPath + "/rest/station/equFaults",
			type : 'POST',
			data : function(d) {
				d.stationId = $("#stationId").val();
                d.projectId = $("#option_project").val();
				d.startTime = $("#startTime").val();
				d.endTime = $("#endTime").val();
				d.cityId =  cityId ;
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

		},  {
            "title" : "设备编号",
            "data" : "equipmentId",
            "className" : "text-center",

        }, {
			"title" : "故障时间",
			"data" : "rtcTime",
			"className" : "text-center",

		}, {
			"title" : "故障类型",
			"data" : "faultName",
			"className" : "text-center",

		}, {
			"title" : "故障次数",
			"data" : "faultNum",
			"className" : "text-center",

		}, {
			"title" : "操作",
			"data" : "stationId",
			"className" : "text-center",
			"render" : function(data, type, full, meta) {
				return '<button type="button" class="btn btn-info btn-xs" onclick=showEquFultDt("' + data + '")>查看</button>';
			}
		} ]
	});
}

function search() {
	table.ajax.reload();
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

function showEquFultDt(stationId) {
	initequFaultDtTable(stationId);
	$('#equFaultModal').modal('show');
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

var equFaultDtTable;
function initequFaultDtTable(stationId) {
	equFaultDtTable = $("#equFaultDtTable").DataTable({
		"ajax" : {
			url : $.coreApiPath + "/rest/station/equFaults/stationId",
			type : 'POST',
			data : function(d) {
				d.stationId = stationId;
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
			"title" : "端站编号",
			"data" : "stationId",
			"className" : "text-center",

		}, {
			"title" : "故障时间",
			"data" : "rtcTime",
			"className" : "text-center",

		}, {
			"title" : "故障类型",
			"data" : "faultName",
			"className" : "text-center",

		} ]
	});
}

function search() {
	table.ajax.reload();
}
