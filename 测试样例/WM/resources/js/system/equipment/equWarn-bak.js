/**
 * 设备故障 js
 */
$(function() {
    initWateStyle("startTime", "endTime");
});

var table;
// var cityId = '370800';
var cityId = parent.cityId;

function gettabequWarnListPage() {
    table = $("#tabEquWarnsList").DataTable({
        "ajax" : {
            url : $.coreApiPath + "/rest/station/equWarns",
            type : 'POST',
            data : function(d) {
                d.stationId = $("#stationId").val();
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
        initComplete : initComplete,
        "columns" : [ {
            "title" : '<input type="checkbox" class="dt_chk_all" />',
            "data" : "stationId",
            "orderable" : false,
            "className" : "select-checkbox text-center",
            "render" : function() {
                return ''
            }
        }, {
            "title" : "端站编号",
            "data" : "station_id",
            "className" : "text-center",

        }, {
            "title" : "告警时间",
            "data" : "rtc_time",
            "className" : "text-center",

        }, {
            "title" : "告警名称",
            "data" : "wname",
            "className" : "text-center",

        }, {
            "title" : "操作",
            "data" : "station_id",
            "className" : "text-center",
            "render" : function(data, type, full, meta) {
                return '<button type="button" class="btn btn-info btn-xs" onclick=showEquWarnsDt("' + data + '")>查看</button>';
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
    initCheckAll("customselt-warn");
}

function showEquWarnsDt(stationId) {
    initequFaultDtTable(stationId);
    $('#equWarnsModal').modal('show');
}

var equWarnDtTable;
function initequFaultDtTable(stationId) {

    equWarnDtTable = $("#equWarnDtTable").DataTable({
        "ajax" : {
            url : $.coreApiPath + "/rest/station/equWarns/stationId",
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
            "data" : "station_id",
            "className" : "text-center",

        }, {
            "title" : "告警时间",
            "data" : "rtc_time",
            "className" : "text-center",

        }, {
            "title" : "告警名称",
            "data" : "wname",
            "className" : "text-center",

        } ]
    });
}

function search() {
    table.ajax.reload();
}
