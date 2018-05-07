/**
 * 污染源气体管理
 */

var tableAir;

function destoryTest() {
    tableAir.destroy();
}

/**
 * 排放量表格开始  查询
 */
function getPollutionAir(id) {
    $("#pid").val(id);
    tableAir = $("#tabPollutionAir").DataTable({
        "ajax": {
            url: $.backendApiPath + "/pollutionrepo/" + id + "/getPollutionAir",
            type: 'POST'
        },
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "autoWidth": true,
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
        "dom": '<l<"#topPluginAir">f>rt<ip>',
        initComplete: initCompletes,
        "columns": [{
            "title": '<input type="checkbox" class="dt_chk_all" />',
            "data": "id",
            "orderable": false,
            "className": "select-checkbox text-center",
            "render": function () {
                return ''
            }
        }, {
            "title": "so2",
            "data": "dischargedSo2",
            "className": "text-center"
        }, {
            "title": "no2",
            "data": "dischargedNo2",
            "className": "text-center"
        }, {
            "title": "pm",
            "data": "dischargedPm",
            "className": "text-center"
        }, {
            "title": "pm25",
            "data": "dischargedPm25",
            "className": "text-center"
        }, {
            "title": "pm10",
            "data": "dischargedPm10",
            "className": "text-center"
        }, {
            "title": "co",
            "data": "dischargedCo",
            "className": "text-center"
        }, {
            "title": "o3",
            "data": "dischargedO3",
            "className": "text-center"
        }, {
            "title": "类型",
            "data": "dischargedType",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == "1") {
                    return "小时";
                } else if (data == "2") {
                    return "天";
                } else if (data == "3") {
                    return "月";
                } else if (data == "4") {
                    return "年";
                } else {
                    return data;
                }
            }
        }, {
            "title": "操作",
            "data": "id",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                var opt = '<button class="btn btn-danger " onclick=DelPollutionAir("' + data + '")>删除</button>'
                    + '<button id="assign" class="btn btn-info " onclick=UpdatePollutionAir("' + data + '")>编辑</button> ';
                return opt;
            }
        }]
    });
    tableAir.ajax.reload();
}

/**
 * 表格加载渲染完毕后执行的方法
 *
 * @param data
 */
function initCompletes(data) {
    initCheckAll("customselt2");
    // 删除污染源按钮的HTMLDOM
    var addBtnAir = '<button class="btn btn-info addBtn" id="addPollution" onclick="initAddAirPollution()">新增</button> ';
    var delBtnAir = '<button  class="btn btn-danger " id="deleteAll"  onclick="delAir()">批量删除</button>  ';
    var topPluginAir = addBtnAir + delBtnAir;
    $("#topPluginAir").append(topPluginAir);// 在表格上方topPlugin DIV中追加HTML
}

/**
 * 排放量表格结束
 */

/**
 * 新增(添加)窗口
 */
function initAddAirPollution() {

    $("#frmPollutionAirAdd").validate();
    $('#pollutionAirAddModal').modal('show');
    $("#optAdd").val("1");// 1保存
}

/**
 * 污染源排放量保存操作   增加开始
 *
 * @returns {Boolean}
 */
function saveAir() {
    var optAdd = $("#optAdd").val();
    for (var i = 0; i < document.frmPollutionAirAdd.elements.length - 1; i++) {
        if (document.frmPollutionAirAdd.elements[i].value == "" && document.frmPollutionAirAdd.elements[i].type == 'text') {
            layer.msg("当前表单不能有空项");
            document.frmPollutionAirAdd.elements[i].focus();
            return false;
        }
    }
    var frmPollutionAirAdd = $("#frmPollutionAirAdd");
    var postData = frmPollutionAirAdd.serialize();
    postData = decodeURIComponent(postData, true);
    if ("1" == optAdd) {
        saveA(postData);
    } else if ("2" == optAdd) {
        var id = $("#optAdd").val();
        if ("" != id && id.length > 0) {
            updateAir(postData);
        } else {
            layer.msg("请稍候刷新再试！");
            return false;
        }
    }
}

/**
 * 保存排放量信息   增加结束
 * @param postData
 */
function saveA(postData) {

    var url = $.backendApiPath + "/pollutionrepo/saveAir";
    $.ajax({
        type: "POST",
        url: url,
        data: postData,
        beforeSend: function () {
            return $("#frmPollutionAirAdd").valid();
        },
        error: function (request) {
        },
        success: function (r) {
            if (r.result) {
                $('#pollutionAirAddModal').modal('hide');
                cleanForm("frmPollutionAirAdd");
                layer.msg("添加成功！");
                tableAir.ajax.reload();
            } else {
                layer.msg("添加失败！");
                return false;
            }
        }
    });
}

//修改前查詢
/**
 * 编辑(修改) 污染源
 *
 * @param id
 */
function UpdatePollutionAir(id) {
    cleanForm("frmPollutionAirAdd");
    $("#optAdd").val("2");// optAdd 2表示修改
    $("#frmPollutionAirAdd").validate();
    var url = $.backendApiPath + "/pollutionrepo/" + id + "/queryAir";
    ajax(url, "", function (r) {
        if (r.result) {
            console.info(r);
            var pollution = r.data;
            $("#pollutionAirAddModal").modal("show");
            $("#frmPollutionAirAdd").setForm(r.data);
            $("#pid").val(r.data.polutionId);

        } else {
            return false;
        }
    });
}

//修改
function updateAir(postData) {
    var url = $.backendApiPath + "/pollutionrepo/updateAir";
    $.ajax({
        type: "POST",
        url: url,
        data: postData,
        beforeSend: function () {
            return $("#frmPollutionAirAdd").valid();
        },
        error: function (request) {
        },
        success: function (r) {
            if (r.result) {
                $('#pollutionAirAddModal').modal('hide');
                cleanForm("frmPollutionAirAdd");
                layer.msg("修改成功！");
                tableAir.ajax.reload();
            } else {
                layer.msg("修改失败！");
                return false;
            }
        }
    });
}

/**
 * 操作里 显示点击删除
 *
 * @param id
 */
function DelPollutionAir(id) {
    $('#pollutionDelAirModal').modal('show');
    $("#hidPollutionAirId").val(id);
}

/**
 * 插件栏准备执行 删除
 *
 * @returns {Boolean}
 */
function delAir() {
    var rows = tableAir.rows({
        selected: true
    });
    var count = rows.count();
    if (count <= 0) {
        layer.msg('请选择后删除');
        return false;
    }
    var ids = new Array();
    var index = 0;
    rows.every(function () {
        ids[index] = this.data().id;
        index++;
    });
    $("#hidPollutionAirId").val(ids);
    $("#pollutionDelAirModal").modal('show');
}

/**
 * 执行删除操作
 */
function deletePollutionAirByIds() {
    var id = $("#hidPollutionAirId").val();
    $('#pollutionDelAirModal').modal('hide');
    $.ajax({
        url: $.backendApiPath + "/pollutionrepo/" + id + "/deleteAir",
        type: "post",
        dataType: "json",
        success: function (r) {
            if (r.result) {
                layer.msg("删除成功！");
                tableAir.ajax.reload();
            } else {
                layer.msg("删除失败！");
                return false;
            }
        },
        error: function (data) {
            layer.msg("请求异常");
        }
    });
}
