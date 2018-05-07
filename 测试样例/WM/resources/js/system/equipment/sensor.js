var currentPolutionType = "pm25";
$(document).ready(function () {
    stationTable = $('#stationTable').DataTable({
        select: {
            "style": 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "lengthMenu": [10, 20, 40, 50],
        "autoWidth": true,
        "responsive": true,
        "processing": true,
        "scrollX": true,
        "serverSide": true,
        "stateSave": false,
        "lengthChange": true, //开关，是否显示每页大小的下拉框
        "searching": false, //开关，是否启用客户端过滤器
        "info": true, //开关，是否显示表格的一些信息
        "paging": true, //开关，是否显示分页器
        "ordering": false, //开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": '<l<"#topPlugin">f>rt<ip>',
        initComplete: initComplete,
        "columns": [
            {
                "title": '<input type="checkbox" class="t_selt text-center" />',
                "data": "id", "orderable": false, "className": "select-checkbox text-center",
                "render": function () {
                    return ''
                }
            },
            {"title": "站号", "data": "stationId", "className": "text-center"},
            {"title": "站名", "data": "stationName", "className": "text-center"},
            {
                "title": "设备类型", "data": "sTechType", "className": "text-center", "render": function () {
                return ''
            }
            },
            {
                "title": "省市区",
                "className": "text-center",
                "render": function (data, type, full, meta) {
                    return full.wwZprovince.province + "/"
                        + full.wwZcity.city + "/"
                        + full.wwZdistrict.district;
                }
            },
//	                  { "title":"省","data":"pro","className":"text-center"},
//	                  { "title":"市","data":"city","className":"text-center"},
//	                  { "title":"区","data":"district","className":"text-center"},
            {"title": "精度", "data": "lat", "className": "text-center"},
            {"title": "纬度", "data": "lng", "className": "text-center"},
            {
                "title": "站点类型", "data": "stationType", "className": "text-center",
                "render": function (data, type, full, meta) {
                    if (data == "11") {
                        return "11";
                    } else if (data == "15") {
                        return "15";
                    } else if (data == "16") {
                        return "16";
                    } else if (data == "17") {
                        return "17";
                    } else if (data == "18") {
                        return "18";
                    } else if (data == "19") {
                        return "19";
                    } else {
                        return data;
                    }
                }
            },
            {
                "title": "状态", "data": "status", "className": "text-center",
                "render": function (data, type, full, meta) {
                    if (data == "-1") {
                        return "删除";
                    } else if (data == "0") {
                        return "冻结";
                    } else if (data == "1") {
                        return "下线";
                    } else if (data == "2") {
                        return "在线";
                    } else {
                        return data;
                    }
                }
            },

            {
                "title": "操作", "data": "id", "className": "text-center",
                "render": function (data, type, full, meta) {
                    var up = '<button id="assign" class="btn btn-primary " onclick=updateStation("' + data + '")>编辑</button> '
                        + '<button class="btn btn-danger " onclick=del("' + data + '")>删除</button>'
                        + '<button  class="btn btn-info " id="ImgId"  onclick="upImg()">上传图片</button>';
                    return up;
                }
            }],
        "sAjaxSource": $.coreApiPath + '/rest/station/getStationPage',
        "fnServerData": function (sSource, aoData, fnCallback) {
            var data11 = {
//	            				stationId: $("#station_id").val(),
//	            				sTechType: $("#s_tech_type").val(),
//	            				stationType: $("#seaStationType").val(),
//	            				status: $("#selType").val(),
//	            				province: $("#s_province").val(),
//	            				city: $("#s_city").val(),
//	            				district: $("#s_district").val(),
                pageNo: aoData[3].value,
                length: aoData[4].value
            };
            $.ajax({
                type: "post",
                url: sSource,
                data: JSON.stringify(data11),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (data) {
                    if (data.erroCode === 2000) {
                        var resultData = {
                            "sEcho": aoData[0].value,
                            "iTotalRecords": data.result.recordsTotal,
                            "iTotalDisplayRecords": data.result.recordsTotal,
                            "aaData": data.result.data
                        }
                        fnCallback(resultData);
                    }
                },
                error: function (errorMsg) {
                    var resultData = {
                        "sEcho": 1,
                        "iTotalRecords": 0,
                        "iTotalDisplayRecords": 0,
                        "aaData": []
                    }
                    fnCallback(resultData);
                }
            });
        }
    });
});

/**************************  ****************************/

new Vue({
    el: '#content',
    data: {
        devtypelist: [
            {id: 'aqi', name: 'aqi'},
            {id: 'pm25', name: 'pm2.5'},
            {id: 'pm10', name: 'pm10'},
            {id: 'co', name: 'co'},
            {id: 'so2', name: 'so2'},
            {id: 'o3', name: 'o3'},
            {id: 'no2', name: 'no2'}
        ],
        statustypelist: [
            {id: 2, name: '正常'},
            {id: 0, name: '关闭'},
            {id: -1, name: '下线'},
            {id: -2, name: '维护中'}
        ],
        newstation: {
            stationId: '',
            stationName: '',
            techType: '',
            pro: '',
            city: '',
            district: '',
            addr: '',
            lat: '',
            lng: '',
            latReal: '',
            lngReal: '',
            mark: ''
        }
    }
})


/******************************************************/


/**
 * 表格加载渲染完毕后执行的方法
 *
 * @param data
 */
function initComplete(data) {
    cusInitComplete();
    // 删除污染源按钮的HTMLDOM
    var addBtn = '<button class="btn btn-primary  addBtn" id="addPollution" onclick="initAddStation()">新 增</button> ';
    var delBtn = '<button  class="btn btn-success " id="deleteAll"  onclick="delStation()">删除</button>  ';
    var impBtn = '<button  class="btn btn-info " id="btnImport"  onclick="importStation()">导入</button>  ';
    var ifm = '<iframe id="exp" style="display:none;"></iframe>';
    var topPlugin = addBtn + delBtn + impBtn + ifm;
    $("#topPlugin").append(topPlugin);// 在表格上方topPlugin DIV中追加HTML
}

function search() {
    stationTable.ajax.reload();
}