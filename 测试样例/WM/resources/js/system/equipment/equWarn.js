/**
 * 设备告警 js
 */
$(function () {
    Geo.init();
    Geo.btn();
});


var realAlarmsTable;
// var cityId = '370800';
var cityId = parent.cityId;

var realEquMap;
var Geo = {
    init: function () {
        init_project();
        init_alarmGrade("real_alarmGrade");
        init_alarmGrade("his_alarmGrade");
        init_alarmStatus("real_alarmStatus");
        getRealAlarmsList();
        initWateStyle("startTime", "endTime");
    }, btn: function () {
        //设备状态历史 --实时
        $("#real_equ_status_his").click(function () {
            tabSelected('model-warnsrealtime', 'real_equ_status_his', 'tab-4');
        });
        //设备历史告警 --实时
        $("#real_equ_warn_his").click(function () {

            tabSelected('model-warnsrealtime', 'real_equ_warn_his', 'tab-3');
            getReal_EquAlarmsHisList();
        });
        //设备详情 --实时
        $("#real_equ_his").click(function () {
            tabSelected('model-warnsrealtime', 'real_equ_his', 'tab-2');

            realEquMap = initMyBMapWithMaxMin("realEquMap", "济宁", 5, 2, 7);
        });
        //告警详情 --实时
        $("#real_equ_detail").click(function () {
            tabSelected('model-warnsrealtime', 'real_equ_detail', 'tab-1');
        });


        //历史告警信息  --历史
        $("#his_equ_status_his").click(function () {
            tabSelected('model-warnsHistroy', 'his_equ_status_his', 'tab-h4');
        });
        //设备状态历史  --历史
        $("#his_equ_warn").click(function () {
            tabSelected('model-warnsHistroy', 'his_equ_warn', 'tab-h3');
            getHisAlarmHis();
        });
        //设备详情  --历史
        $("#his_equ_detail_his").click(function () {
            tabSelected('model-warnsHistroy', 'his_equ_detail_his', 'tab-h2');
        });
        //告警详情  --历史
        $("#his_equ_wain_detail").click(function () {
            tabSelected('model-warnsHistroy', 'his_equ_wain_detail', 'tab-h1');
        });


    }
};


/**
 * 初始化 告警实时表格
 */
function getRealAlarmsList() {
	 var scrrenH = document.body.clientHeight, tableScrollY = (scrrenH - 100) + "px";
    realAlarmsTable = $("#tabRealAlarmsList").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/realAlarms", //原始请求路径
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#sea_stationId").val();
                d.projectId = $("#real_project").val();
                d.current_grade = $("#real_alarmGrade").val();
                d.status = $("#real_alarmStatus").val();
            }
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
         "scrollY": tableScrollY, //支持垂直滚动
        "scrollCollapse": true,
        
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": '<<t>lfip>',
        initComplete: real_initComplete,
        "columns": [{
            "title": '<input type="checkbox" class="dt_chk_all" />',
            "data": "station_id",
            "orderable": false,
            "className": "select-checkbox text-center",
            "render": function () {
                return ''
            }
        },
            {
                "title": "设备编号",
                "data": "equipment_id",
                "className": "text-center",

            },
            {
                "title": "监测点编号",
                "data": "station_id",
                "className": "text-center",

            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center",

            },
            {
                "title": "告警状态",
                "data": "status",
                "className": "text-center",

            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center",

            },
            {
                "title": "告警开始时间",
                "data": "first_occur_time",
                "className": "text-center",

            }, {
                "title": "告警结束时间",
                "data": "last_occur_time",
                "className": "text-center",

            }, {
                "title": "累计次数",
                "data": "count",
                "className": "text-center",

            }, {
                "title": "操作",
                "data": "id",
                "className": "text-center",
                "render": function (data, type, full, meta) {

                    var sattion_id = full.station_id;

                    return '<button type="button" class="btn btn-info btn-xs" onclick=intiAlarmModal("' + data + '","' + sattion_id + '")>查看并处理</button>';
                }
            }
        ]
    });
}

var tabRalEquHis;
/**
 * 实时--设备历史告警列表
 */
function getReal_EquAlarmsHisList() {
    tabRalEquHis = $("#tabRalEquHisList").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/stationAlarms",
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#real_alarm_sattion_id").val();
            }
        },
        "scrollY": 210, //支持垂直滚动
        "scrollCollapse": true,
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "dom": '<<t>lfip>',
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "columns": [
            {
                "title": "转入历史时间",
                "data": "close_time",
                "className": "text-center"
            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center"
            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center"
            },
            {
                "title": "操作人员",
                "data": "owner_name",
                "className": "text-center"
            }
        ]
    });


    $('#tabRalEquHisList tbody').on('click', 'tr', function () {

        $("#real_equ_his_note").html("");
        tabRalEquHis.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        var data = tabRalEquHis.row(this).data();
        var id = data.alarmId;
        ajax($.coreApiPath + "/alarm/actions/" + id, null, function (r) {
            if (r.result) {
                setNoteDetail(r.data, "real_equ_his_note");
            }
        })

    });
}

var tabRalEquHisStatus;
function getReal_EquStatusHisList() {

    tabRalEquHisStatus = $("#tabRalEquHisStatus").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/stationAlarms", //原始请求路径
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#real_alarm_sattion_id").val();
            }
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "scrollY": 210, //支持垂直滚动
        "scrollCollapse": true,
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": '<<t>lfip>',
        "columns": [
            {
                "title": "转入历史时间",
                "data": "close_time",
                "className": "text-center"
            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center"
            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center"
            },
            {
                "title": "操作人员",
                "data": "owner_name",
                "className": "text-center"
            }
        ]
    });
}


/**
 * 初始化 打开 窗口
 * @param id
 */
function intiAlarmModal(id, sattion_id) {

    $("#real_alarm_id").val(id);
    $("#real_alarm_sattion_id").val(sattion_id);
    document.getElementById('real_detail_frm').reset();
    var url = $.coreApiPath + "/alarm/realdts/" + id;
    ajax_post_msg(url, {}, "加载", function (r) {
        if (r.result) {
            var alarmDataBo = r.data;
            $("#real_detail_frm").setForm(alarmDataBo);
            if (typeof (alarmDataBo.actionsList) != "undefined") {
                setNoteDetail(alarmDataBo.actionsList, 'real_equ_detail_note');
            }
        }
    })
    tabSelected('model-warnsrealtime', 'real_equ_detail', 'tab-1');
    ModalShow('equWarnsModal');
}

/**
 * 刷新备注
 * @param actionsList
 */
function setNoteDetail(actionsList, domId) {
    var html = "";
    if (typeof (actionsList) != "undefined" && actionsList.length > 0) {
        for (var i = 0; i < actionsList.length; i++) {
            html += "<span class='db' >" + actionsList[i].actionTime + "  " + actionsList[i].content + "</span>";
        }
    }
    $("#" + domId).html(html);
    // $("#real_equ_detail_note").html(html);
}

/**
 * 关闭实时查看处理窗口
 */
function closeEquWarnsModal() {
    document.getElementById('real_detail_frm').reset();
    document.getElementById('real_equ_detail_frm').reset();
    document.getElementById('rel_alarm_dt_frm').reset();
    document.getElementById('real_equ_alrm_frm').reset();
    closeModal("equWarnsModal");
    real_search();
}


/**
 * 实时表格里的搜索
 */
function real_search() {
    realAlarmsTable.ajax.reload();
}

function real_initComplete(data) {
    initCheckAll("real_customselt");

    var addBtn = '<button class="btn btn-success  addBtn" onclick="real_delAlarmModal()">批量关闭</button> ';
    $("#topPlugin").append(addBtn); // 在表格上方topPlugin DIV中追加HTML
}

/**
 * 打开批量关闭窗口
 * @returns {boolean}
 */
function real_delAlarmModal() {
    var rows = realAlarmsTable.rows({
        selected: true
    });
    var count = rows.count();
    if (count <= 0) {
        layer.msg('请选择后删除');
        return false;
    }
    var ids = "";
    rows.every(function () {
        ids += this.data().id + ",";
    });
    $("#hidRealAlarmIds").val(ids);

    popMesg("批量关闭");
}

/**
 * 执行批量关闭操作
 */
function delRealAlarms() {
    var ids = $("#hidRealAlarmIds").val();
    if (ids == null || ids == "") {
        layer.msg("请重新选择后删除");
        real_search();
        return false;
    }

    ajax_post_msg($.coreApiPath + "/alarm/close", {ids: ids}, "批量关闭", function (r) {
        if (r.result) {
            layer.msg("关闭成功");
            his_search();
            closeModal("delRealAlarmMsgModal");
        } else {
            layer.msg("关闭失败，请稍候再试！");
            return false;
        }
    })
}


/********************************************设备历史开始************************************************************/
/**
 * 设备告警历史列表
 */
var hisAlarmsTable;
function getHisAlarmsList() {
    hisAlarmsTable = $("#tabHisAlarmsList").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/hisAlarms",
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#stationId").val();
                d.projectId = $("#his_project").val();
                d.current_grade = $("#his_alarmGrade").val();
                d.startTime = $("#startTime").val();
                d.endTime = $("#endTime").val();
            }
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": '<l<"#HistorytopPlugin">f>rt<ip>',
        initComplete: his_initComplete,
        "columns": [{
            "title": '<input type="checkbox" class="dt_chk_all" />',
            "data": "stationId",
            "orderable": false,
            "className": "select-checkbox text-center",
            "render": function () {
                return ''
            }
        },
            {
                "title": "设备编号",
                "data": "equipment_id",
                "className": "text-center",

            },
            {
                "title": "监测点编号",
                "data": "station_id",
                "className": "text-center",
            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center",

            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center",

            },
            {
                "title": "设备告警时间",
                "data": "first_occur_time",
                "className": "text-center",

            },
            {
                "title": "最新告警时间",
                "data": "last_occur_time",
                "className": "text-center",

            }, {
                "title": "转入历史时间",
                "data": "close_time",
                "className": "text-center",

            }, {
                "title": "累计次数",
                "data": "count",
                "className": "text-center",

            }, {
                "title": "操作",
                "data": "id",
                "className": "text-center",
                "render": function (data, type, full, meta) {
                    return '<button type="button" class="btn btn-info btn-xs" onclick=initEquHisModal("' + data + '")>查看</button>';
                }
            }
        ]
    });
}

function his_search() {
    hisAlarmsTable.ajax.reload();
}

/**
 * 历史表格查看
 * @param id
 */
function initEquHisModal(id) {
    $("#his_alarm_sattion_id").val(id);
    document.getElementById('his_detail_frm').reset();
    var url = $.coreApiPath + "/alarm//hisdts/" + id;
    ajax_post_msg(url, {}, "加载", function (r) {
        if (r.result) {
            var alarmDataBo = r.data;
            $("#his_detail_frm").setForm(alarmDataBo);

            if (typeof (alarmDataBo.actionsList) != "undefined") {
                setNoteDetail(alarmDataBo.actionsList, "his_equ_detail_note");
            }
        }
    })

    tabSelected('model-warnsHistroy', 'his_equ_wain_detail', 'tab-h1');

    ModalShow('equWarnsHistroyModal');
}


/**
 * 关闭实时查看处理窗口
 */
function closeHisEquWarnsModal() {
    document.getElementById('his_detail_frm').reset();
    document.getElementById('his_equ_detail_frm').reset();
    document.getElementById('his_alarm_dt_frm').reset();
    document.getElementById('his_equ_alrm_frm').reset();
    closeModal("equWarnsHistroyModal");
}

/**
 * 实时表格加载完成
 * @param data
 */
function his_initComplete(data) {
    initCheckAll("his_customselt");
    // var addBtn = '<button class="btn btn-success  addBtn">批量关闭</button> ';
    // $("#topPlugin").append(addBtn); // 在表格上方topPlugin DIV中追加HTML
}

/**
 * 初始化 项目列表
 * @param id
 */

function init_project() {
    var real_project = $("#real_project")
    var his_project = $("#his_project")
    real_project.empty();
    his_project.empty();
    real_project.append("<option value='-1' selected='selected'>请选择</option>");
    his_project.append("<option value='-1' selected='selected'>请选择</option>");
    ajax_get($.coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
        for (var i = 0; i < data.length; i++) {
            real_project.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
            his_project.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
        }
    })
}

/**
 * 初始化 告警级别
 * @param id
 */

function init_alarmGrade(id) {
    var opt = $("#" + id);
    opt.empty();
    opt.append("<option value='-1' selected='selected'>全部</option>");
    ajax($.coreApiPath + "/alarm/alarmGrade", {}, function (r) {
        if (r.result) {
            var list = r.data;
            for (var i = 0; i < list.length; i++) {
                opt.append("<option value=\"" + list[i].code + "\">" + list[i].name + "</option>");
            }
        }
    })
}

/**
 * 初始化告警状态
 * @param id
 */
function init_alarmStatus(id) {
    var opt = $("#" + id);
    opt.empty();
    opt.append("<option value='-1' selected='selected'>全部</option>");
    ajax($.coreApiPath + "/alarm/alarmStatus", {}, function (r) {
        if (r.result) {
            var list = r.data;
            for (var i = 0; i < list.length; i++) {
                opt.append("<option value=\"" + list[i].code + "\">" + list[i].name + "</option>");
            }
        }
    })
}


/**
 * 打开 批量确认删除 窗口
 * @param msg
 * @param color
 */
function popMesg(msg, color) {
    var colorV = '#333';
    if (color) {
        colorV = '#' + color;
    }
    $("#msgContainer").css("color", colorV);
    $("#msgContainer").html(msg);
    $("#delRealAlarmMsgModal").modal('show');
}


/**
 * 按钮操作确认 重启、关闭、认领、更换
 * @param msg
 * @type_id  1：维修；2：认领；3：关闭；4：关闭数据；5：重启；6：更换））
 * @param color
 */
function OpenOptConfirmModal(type_id, msg, color) {
    var colorV = '#333';
    if (color) {
        colorV = '#' + color;
    }
    $("#msgContainer2").css("color", colorV);
    $("#msgContainer2").html(msg);
    $("#type_id").val(type_id);
    $("#optConfirmModal").modal('show');
}


/**
 * 执行操作流程
 */
function saveOpt(note_id) {
     var id = $("#real_alarm_id").val();
    var type_id = $("#type_id").val();
    var url = $.coreApiPath + "/alarm/operate";
    var postData = {id: id, code: type_id};
    ajax_post_msg(url, postData, "保存", function (r) {

        //code: -1：其他； 1：维修；2：认领；3：关闭；4：关闭数据；5：重启；6：更换
        if (r.result) {
            layer.msg("操作成功！")
            closeModal("optConfirmModal");
            //刷新备注
            setNoteDetail(r.data,note_id);
            if(type_id=='3'){
                closeEquWarnsModal();
            }
        } else {
            layer.msg("操作失败！")
            closeModal("optConfirmModal");
        }
    });
}

/**
 * 发送消息
 * @param alarm_id 告警id
 * @param advice_id 意见id
 * @param note_id 刷新的备注id
 * @returns {boolean}
 */
function sendMsg(alarm_id, advice_id, note_id) {
    var id = $("#" + alarm_id).val();
    var advice = $("#" + advice_id).val();

    // 处理意见
    if (advice == null || "" == advice) {
        layer.msg("处理意见不能为空");
        return false;
    }
    var postData = {id: id, advice: advice};
    ajax_post_msg($.coreApiPath + "/alarm/send", postData, "保存", function (r) {
        //code: -1：其他； 1：维修；2：认领；3：关闭；4：关闭数据；5：重启；6：更换
        if (r.result) {
            layer.msg("发送成功！")
            setNoteDetail(r.data, note_id);
            $("#advice_id").val("");
        } else {
            layer.msg("发送失败！")
            return false;
        }
    });
}


function tabSelected(parentName, obj, className) {
    $('.' + parentName + ' .modal-WarnBtn span').addClass("btn-outline");
    $("#" + obj).removeClass('btn-outline');
    $('.' + parentName + ' .tabContainer').hide();
    $("." + className).show();

}


var tabHisAlarmHis;
/**
 * 历史--设备历史告警列表
 */
function getHisAlarmHis() {
    $("#his_equ_his_note").html("");
    tabHisAlarmHis = $("#tabHisAlarmHis").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/stationAlarms", //原始请求路径
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#sea_stationId").val();
                d.current_grade = $("#real_alarmGrade").val();
                d.status = $("#real_alarmStatus").val();
            }
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "scrollY": 210, //支持垂直滚动
        "scrollCollapse": true,
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "dom": '<<t>lfip>',
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "columns": [
            {
                "title": "转入历史时间",
                "data": "close_time",
                "className": "text-center"
            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center"
            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center"
            },
            {
                "title": "操作人员",
                "data": "owner_name",
                "className": "text-center"
            }
        ]
    });


    $('#tabHisAlarmHis tbody').on('click', 'tr', function () {

        $("#his_equ_his_note").html("");
        tabHisAlarmHis.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        var data = tabHisAlarmHis.row(this).data();
        var id = data.alarmId;
        ajax($.coreApiPath + "/alarm/actions/" + id, null, function (r) {
            if (r.result) {
                setNoteDetail(r.data, "his_equ_his_note");
            }
        })

    });
}


var tabHisEquAlarHis;
function getbHisEquAlarHis() {

    tabHisEquAlarHis = $("#tabHisEquAlarHis").DataTable({
        "ajax": {
            url: $.coreApiPath + "/alarm/realAlarms", //原始请求路径
            type: 'POST',
            data: function (d) {
                d.cityId = cityId;
                d.stationId = $("#sea_stationId").val();
                d.projectId = $("#real_project").val();
                d.current_grade = $("#real_alarmGrade").val();
                d.status = $("#real_alarmStatus").val();
            }
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "scrollY": 210, //支持垂直滚动
        "scrollCollapse": true,
        "autoWidth": true,
        "destroy": true,
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "lengthChange": true, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "dom": '<<t>lfip>',
        "language": {
            "url":$.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "columns": [
            {
                "title": "转入历史时间",
                "data": "close_time",
                "className": "text-center"
            },
            {
                "title": "告警级别",
                "data": "current_grade",
                "className": "text-center"
            },
            {
                "title": "告警内容",
                "data": "content",
                "className": "text-center"
            },
            {
                "title": "操作人员",
                "data": "owner_name",
                "className": "text-center"
            }
        ]
    });
}
