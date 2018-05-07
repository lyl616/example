/**
 * 污染源管理
 */

var map;
var table;

$(function () {
    CommonUtil.getFunctionRole(function (data) {
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_01')) {
            //新增权限
            $('#addBtn').remove();
        }
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_03')) {
            //导入权限
            $('#importBtn').remove();
        }
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_04')) {
            //排放量权限
            $('#pollDischargeBtn').remove();
        }
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_05')) {
            //编辑权限
            $('#updateBtn').remove();
        }
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_06')) {
            //监测点权限
            $('#stationBtn').remove();
        }
        if (!data.result.hasOwnProperty('ROLE_FUN_104_01_07')) {
            //批量删除权限
            $('#delBtn').remove();
        }
        getPollutionList();
    });

});

function getPollutionList() {
    table = $("#tabPopulationList").DataTable({
        "ajax": {
            url: $.backendApiPath + "/pollutionrepo/pollutions",
            type: 'POST',
            data: function (d) {
                d.name = $("#seaName").val();
                d.type = $("#seaType").val();
                d.catagory = $("#seaCategory").val();
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
        "lengthChange": false, // 开关，是否显示每页大小的下拉框
        "searching": false, // 开关，是否启用客户端过滤器
        "info": true, // 开关，是否显示表格的一些信息
        "paging": true, // 开关，是否显示分页器
        "ordering": false, // 开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        //"dom": '<<t>lfip>',
        "dom": '<l<"#topPlugin">f>rt<ip>',
        initComplete: initComplete,
        "columns": [{
            "title": '<input type="checkbox" class="dt_chk_all text-center" />',
            "data": "id",
            "className": "text-center",
            "orderable": false,
            "render": function () {
                return '<input type="checkbox" />';
            }
        }, {
            "title": "污染源名称",
            "data": "name",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "高架/地面",
            "data": "tcbname",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == "6") {
                    return "高架源";
                } else if (data == "7") {
                    return "地面源";
                } else {
                    return data;
                }
            }
        }, {
            "title": "污染类别",
            "data": "tcaname",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "行业类别",
            "data": "tccname",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "省市区",
            "data": "domainname",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "经度",
            "data": "lng",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "纬度",
            "data": "lat",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                if (data == null)
                    return "";
                else
                    return data;
            }
        }, {
            "title": "操作",
            "data": "id",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                var pollDischargeBtn = "";
                var updateBtn = "";
                var stationBtn = "";
                var delModalBtn = "";

                var isPollDischargeBtn = $("#pollDischargeBtn").val();
                var isUpdateBtn = $("#updateBtn").val();
                var isStationBtn = $("#stationBtn").val();
                var isDelModalBtn = $("#delModalBtn").val();

                if (isPollDischargeBtn == 1) {
                    pollDischargeBtn = '<button id="assign" class="btn btn-info" onclick=showPollDischarge("' + data + '")>排放量</button> ';
                }
                if (isUpdateBtn == 1) {
                    updateBtn = '<button id="assign" class="btn btn-info" onclick=showUpdatePollution("' + data + '")>编辑</button> ';
                }
                if (isStationBtn == 1) {
                    stationBtn = '<button class="btn btn-info" onclick=showStationModal("' + data + '")>监测点</button> ';
                }
                // if(isDelModalBtn == 1) {
                // 	delModalBtn = '<button class="btn btn-danger" onclick=showDelModal("' + data + '")>删除</button>';
                // }
                var opt = pollDischargeBtn + updateBtn + stationBtn + delModalBtn;

                return opt;
            }
        }]
    });
    initTypsByType('seaType', '5', '-1', "1"); // 高架桥/地面
}

/**
 * 表格加载渲染完毕后执行的方法
 *
 * @param data
 */
function initComplete(data) {
    initCheckAll("customselt");

    // 删除污染源按钮的HTMLDOM
    var addBtn = "";
    var delBtn = "";
    var impBtn = "";

    var isAddBtn = $("#addBtn").val();
    var isDelBtn = $("#delBtn").val();
    var isImportBtn = $("#importBtn").val();

    if (isAddBtn == 1) {
        addBtn = '<button class="btn btn-info" id="addPollution" onclick="initAddPollution()">新增</button> ';
    }
    if (isDelBtn == 1) {
        delBtn = '<button  class="btn btn-danger " id="deleteAll"  onclick="del()">批量删除</button>  ';
    }
    if (isImportBtn == 1) {
        impBtn = '<button  class="btn btn-info " id="btnImport"  onclick="importPollution()">导入</button>  ';
    }

    var ifm = '<iframe id="exp" style="display:none;"></iframe>';
    var topPlugin = addBtn + delBtn + impBtn + ifm;
    $("#topPlugin").append(topPlugin); // 在表格上方topPlugin DIV中追加HTML
}

/**
 * 新增(添加)窗口
 */
function initAddPollution() {

    $("#frmPollutionAdd").validate();
    $('#pollutionAddModal').modal('show');
    $("#optFlag").val("1"); // 1保存 2修改

    initPrrovince("-1", "populationPro", "-1", "populationCity", "-1", "populationDistrict");

    initTypsByType('selType', '5', '-1', "-1"); // 高架桥/地面
    initTypsByType('selCatagory', '6', '-1', "-1"); // 高架桥
    initTypsByType('selIndustryType', '8', '-1', "-1"); // 行业类别

    cleanForm("frmPollutionAdd");
}

function search() {
    table.ajax.reload();
}

/**
 * 操作里 显示点击删除
 *
 * @param id
 */
function showDelModal(id) {
    $('#pollutionDelModal').modal('show');
    $("#hidPollutionId").val(id);
}

/**
 * 插件栏准备执行 删除
 *
 * @returns {Boolean}
 */
function del() {
    var rows = table.rows({
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
    $("#hidPollutionId").val(ids);
    $("#pollutionDelModal").modal('show');
}

/**
 * 执行删除操作
 */
function deletePollutionByIds() {
    var id = $("#hidPollutionId").val();
    $('#pollutionDelModal').modal('hide');
    $.ajax({
        url: $.backendApiPath + "/pollutionrepo/" + id + "/delete",
        type: "post",
        dataType: "json",
        success: function (r) {
            layer.msg(r);
            layer.msg(r.result);
            if (r.result) {
                layer.msg("删除成功！");
                table.ajax.reload();
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

/**
 * 编辑(修改) 污染源 查看
 *
 * @param id
 */
function showUpdatePollution(id) {
    cleanForm("frmPollutionAdd");
    $("#optFlag").val("2"); // optFlag 2表示修改
    $("#frmPollutionAdd").validate();
    var url = $.backendApiPath + "/pollutionrepo/" + id + "/query";
    ajax(url, "", function (r) {
        if (r.result) {
            var pollution = r.data;
            $("#pollutionAddModal").modal("show");
            $("#frmPollutionAdd").setForm(r.data);
            // 初始化省市
            initPrrovince(pollution.pro, "populationPro", pollution.city, "populationCity", pollution.district, "populationDistrict");

            initTypsByType('selType', "5", pollution.type, "-1"); // //
            // 高架桥/地面源
            initTypsByPid('selCatagory', pollution.type, pollution.catagory, "-1"); // 污染源类型
            initTypsByType('selIndustryType', "8", pollution.industry_type, "-1"); // 行业类别
        } else {
            return false;
        }
    });
}

/**
 * 执行污染源保存/修改操作
 *
 * @returns {Boolean}
 */
function saveOrUpdate() {
    var optFlag = $("#optFlag").val();
    var frmPollutionAdd = $("#frmPollutionAdd");
    var postData = frmPollutionAdd.serialize();
    postData = decodeURIComponent(postData, true);

    if ("1" == optFlag) {
        save(postData);
    } else if ("2" == optFlag) {
        var id = $("#optFlag").val();
        if ("" != id && id.length > 0) {
            update(postData);
        } else {
            layer.msg("请稍候刷新再试！");
            return false;
        }
    }

}

function save(postData) {
    var url = $.backendApiPath + "/pollutionrepo/save";
    $.ajax({
        type: "POST",
        url: url,
        data: postData,
        beforeSend: function () {
            return $("#frmPollutionAdd").valid();
        },
        error: function (request) {
        },
        success: function (r) {
            if (r.result) {
                $('#pollutionAddModal').modal('hide');
                cleanForm("frmPollutionAdd");
                layer.msg("添加成功！");
                table.ajax.reload(); // 刷新当前表格
            } else {
                layer.msg("添加失败！");
                return false;
            }
        }
    });
}

function update(postData) {
    var url = $.backendApiPath + "/pollutionrepo/update";
    $.ajax({
        type: "POST",
        url: url,
        data: postData,
        beforeSend: function () {
            return $("#frmPollutionAdd").valid();
        },
        error: function (request) {
        },
        success: function (r) {
            if (r.result) {
                $('#pollutionAddModal').modal('hide');
                cleanForm("frmPollutionAdd");
                layer.msg("修改成功！");
                table.ajax.reload(); // 刷新当前表格
            } else {
                layer.msg("修改失败！");
                return false;
            }
        }
    });
}

/** ***************************关联站点开始*********************************************** */

/**
 * 切换搜索范围
 */
function changeStations() {
    if (pollution) {
        showMakPoint(pollution, $("#selRange").val());
    } else {
        showStationModal($("#hidPollutionSId").val());
    }
}

/**
 * 关联站点
 *
 * @param id
 */
var pollution;
var listStation;
var bounds;

function showStationModal(id) {
    $.ajax({
        url: $.backendApiPath + "/pollutionrepo/" + id + "/query",
        type: "post",
        dataType: "json",
        success: function (r) {
            if (r.result) {
                pollution = r.data;
                showMakPoint(pollution, $("#selRange").val());
            } else {
                return false;
            }
        },
        error: function (data) {
            layer.msg("请求异常");
        }
    });
    $("#hidPollutionSId").val(id);
    $("#pollutionStationModal").modal("show");

}

var stationIds = [];

/**
 * 显示关联的站点
 *
 * @param pollution
 *            污染站点信息
 * @param km
 *            搜索范围
 */
function showMakPoint(pollution, km) {

    // 监控边界
    bounds = getBounds(pollution.lng, pollution.lat, km);
    var city = pollution.cityId;
    // 通过城市id查询所有站点信息，用于遍历
    ajax($.backendApiPath + "/pollutionrepo/stations", {
        cityId: city
    }, function (r) {
        if (r != null && r.length > 0) {
            _mark_range_station(r, bounds);
        } else {
            layer.msg('未搜索到相关站点！');
        }
    });
}

/**
 * 通过经纬度获取 km的边界值
 *
 * @param lng
 * @param lat
 * @param km
 * @returns
 */
function getBounds(lng, lat, km) {
    map = new BMap.Map("WMMAP");
    var point = new BMap.Point(lng, lat);
    map.centerAndZoom(point, 12); // 设置地图中心及初始化大小
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    // 添加一具半径为km的圆覆盖物
    var circle = new BMap.Circle(point, km);
    map.addOverlay(circle);
    var bounds = circle.getBounds(); // 获取在覆盖的边界
    map.removeOverlay(circle); // 清除所有覆盖物

    // 标记当前站点
    var marker = new BMap.Marker(point);
    marker.enableDragging();
    map.addOverlay(marker);
    // map.panBy(150, 150);// 百度地图趸显示 相对 width:300px height:300px;
    return bounds;
}

/**
 * 标记监测站点
 *
 * @param listStation
 * @param bounds
 */
function _mark_range_station(listStation, bounds) {
    stationIds = [];
    for (var i = 0; i < listStation.length; i++) {
        var ppt = new BMap.Point(listStation[i].lng, listStation[i].lat);
        if (bounds.containsPoint(ppt)) {
            _add_marker(ppt, 1)
            stationIds.push(listStation[i].id);
        }
    }
    //	console.info(stationIds);
    if (stationIds.length > 0) {
        $("#hidStationIds").val(stationIds);
    }
}

/**
 * 保存所有关联站点信息
 *
 * @returns {Boolean}
 */
function saveStation() {
    var stationIds = $("#hidStationIds").val();
    if (stationIds == null || stationIds.length == 0) {
        layer.msg('未关联到站点信息');
        return false;
    }
    var id = $("#hidPollutionSId").val();
    ajax($.backendApiPath + "/pollutionrepo/savePollutionStations", {
        id: id,
        stationIds: stationIds
    }, function (r) {
        if (r.result) {
            layer.msg(r.msg);
            table.ajax.reload();
            $("#pollutionStationModal").modal("hide");
        } else {
            layer.msg(r.msg);
            return false;
        }
    });
}

/** ***************************关联站点结束*********************************************** */

/**
 * 新增(排放量)窗口
 */
function showPollDischarge(id) {
    getPollutionAir(id);
    $('#PollutionModal').modal('show');
}

/**
 * 新增(导入excel)窗口
 */
function importPollution() {
    $('#myModalExcel').modal('show');
    $('#myModal').modal('hide');
}

// 解析excel
function submitExcel() {

    var excelFile = $("#excelFile").val();
    if (excelFile == '') {
        layer.msg("请选择需上传的文件!");
        return false;
    }
    if (excelFile.indexOf('.xls') == -1) {
        layer.msg("文件格式不正确，请选择正确的Excel文件(后缀名.xls)！");
        return false;
    }
    layer.msg("dd");
    $.ajaxFileUpload({
        url: $.backendApiPath + "/pollutionrepo/submitExcel", // 用于文件上传的服务器端请求地址
        secureuri: false, // 一般设置为false
        type: "post",
        dataType: "xls",
        data: excelFile,
        fileElementId: 'excelFile', // 文件上传域的ID
        success: function (r) {
            layer.msg(r);
            layer.msg(r.result);
            if (r.result) {
                layer.msg("解析成功！");
                table.ajax.reload();
            } else {
                layer.msg("解析失败！");
                return false;
            }
        },
        error: function (data) {
            layer.msg("请求异常");
        }
    });
    table.ajax.reload();
}