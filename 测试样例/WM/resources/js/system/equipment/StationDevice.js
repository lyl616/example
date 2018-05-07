/**
 * 传感器管理
 */
var table= $("#deviceTable");
var oTable;

function getDevice(id) {
	$("#pid").val(id);
	oTable = table.DataTable({
		"ajax" : {
			url : $.coreApiPath + "/station/" + id + "/getDevice",
			type : 'POST'
		},
		select : {
			"style" : 'os',
			"selector" : 'td:first-child',
			"style" : 'multi'
		},
		
		"autoWidth" : true,
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
			'targets': [0],
			"title" : '<input type="checkbox" class="t_selt" />',
			"data" : "id",
			"orderable" : false,
			"className" : "select-checkbox text-center",
			"render" : function() {
				return ''
			}
		},{
			'targets': [1],
			"title" : "传感器编号",
			"data" : "deviceId",
			"className" : "text-center"
		},{
			'targets': [2],
			"title" : "传感器名称",
			"data" : "deviceName",
			"className" : "text-center"
		}, {
			'targets': [3],
			"title" : "传感器类型",
			"data" : "deviceType",
			"className" : "text-center"
		}, {
			'targets': [4],
			"title" : "lab_k",
			"data" : "labK",
			"className" : "text-center"
		}, {
			'targets': [5],
			"title" : "lab_ofser",
			"data" : "labOfset",
			"className" : "text-center"
		},{
			'targets': [6],
			"title" : "real_K",
			"data" : "realK",
			"className" : "text-center"
		}, {
			'targets': [7],
			"title" : "real_ofset",
			"data" : "realOfset",
			"className" : "text-center"
		}, 
		/*{
			"title" : "类型",
			"data" : "dischargedType",
			"className" : "text-center",
			"render" : function(data, type, full, meta) {
				if (data == "1") {
					return "小时";
				} else if (data == "2") {
					return "天";
				} else if (data == "3") {
					return "月";
				}  else if (data == "4") {
					return "年";
				}else {
					return data;
				}
			}
		},*/ 
		{
			'targets': [8],
			"title" : "操作",
			"data" : "id",
			"className" : "text-center",
			"render" : function(data, type, full, meta) {
				var btn = "<a href=\"javascript:;\" data-container=\"body\" data-placement=\"top\" data-html=\"true\" data-original-title=\"编辑\" class=\"btn blue tooltips edit\"><i class=\"fa fa-edit\"></i></a>";
                    btn+= "<a href=\"javascript:;\" data-container=\"body\" data-placement=\"top\" data-original-title=\"删除\" class=\"btn red  tooltips delete\"><i class=\"fa fa-trash-o\"></i></a>";
                return btn;
			}
		} ]
	});
//	table.ajax.reload();
}

/**
 * 初始化表格
 */
function initComplete(data) {
	
	handleTable();
}
var handleTable = function () {
    function restoreRow(oTable, nRow) {
        var aData = oTable.row(0).data(nRow);
        var jqTds = $('>td', nRow);
        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        	oTable.fnUpdate(aData[i], nRow, i, false);
        }
        oTable.fnDraw();
    }
    /**
     * 编辑行
     */
    function editRow(oTable, nRow) {
        var aData = oTable.row(0).data(nRow);
        var jqTds = $('>td', nRow);
        var btn = "<a href=\"javascript:;\ data-container=\"body\" data-placement=\"top\" data-html=\"true\" data-original-title=\"保存\" class=\"btn yellow tooltips edit\"><i class=\"fa fa-save\"></i></a>";
            btn += "<a href=\"javascript:;\ data-container=\"body\" data-placement=\"top\" data-original-title=\"取消\" class=\"btn green tooltips cancel\"><i class=\"fa fa-history\"></i></a>";
           id=$("#pid").val();
            $.ajax({
//        	编辑单行                        
            url :  $.coreApiPath + "/station/" + id + "/queryDevice",
            type:"post",
            dataType:"json", 
            async: false,
            success:function(data){
            	
                if(data.success){
                	
                	layer.msg("选择成功。");	
                }
            },error:function(msg){
            	layer.msg("选择失败。");	
            }
        });
        jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.deviceId+'">';
        jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.deviceName + '">';
        jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.deviceType + '">';
        jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.labK + '">';
        jqTds[5].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.labOfset + '">';
        jqTds[6].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.realK + '">';
        jqTds[7].innerHTML = '<input type="text" class="form-control input-small" value="' + aData.realOfset + '">';
        jqTds[8].innerHTML = btn;
    }
    
    /**
     * 保存行
     */
    function saveRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        var aData = oTable.row(0).data(nRow);
        $.ajax({
        	url : $.coreApiPath + "/",
            type:"post",
            dataType:"json", 
            data:{
//                "deviceType":jqSelect[0].value,
                "id":aData.id,
                "deviceId":jqInputs[1].deviceId,
                "deviceName":jqInputs[2].deviceName,
                "deviceType":jqInputs[3].deviceType,
                "labK":jqInputs[4].labK,
                "labOfset":jqInputs[5].labOfset,
                "realK":jqInputs[6].realK,
                "realOfset":jqInputs[7].realOfset,
            },
            success:function(data){
                if(data.success){
                    oTable.fnUpdate(jqInputs[0].value, nRow, 1, false);
                    oTable.fnUpdate(jqInputs[1].value, nRow, 2, false);
                    oTable.fnUpdate(jqInputs[2].value, nRow, 3, false);
                    oTable.fnUpdate(jqInputs[3].value, nRow, 4, false);
                    oTable.fnUpdate(jqInputs[4].value, nRow, 5, false);
                    oTable.fnUpdate(jqInputs[5].value, nRow, 6, false);
                    table.fnUpdate(jqInputs[6].value, nRow, 7, false);
                    var btn = "<a href=\"javascript:;\ data-container=\"body\" data-placement=\"top\" data-demo-html=\"true\" data-original-title=\"保存\" class=\"btn yellow tooltips edit\"><i class=\"fa fa-edit\"></i></a>";
                    btn+="<a href=\"javascript:;\ data-container=\"body\" data-placement=\"top\" data-original-title=\"删除\" class=\"btn red tooltips delete\"><i class=\"fa fa-trash-o\"></i></a>";
                    oTable.fnDraw();
                }
            },error:function(msg){
            }
        });
    };

    /**
     * 取消编辑行
     */
    function cancelEditRow(oTable, nRow) {
        oTable.fnDraw();
    }
    var nEditing = null;
    var nNew = false;
    var sData = null;
    /**
     * 绑定删除按钮事件
     */
    oTable.on('click', '.delete', function (e) {
        e.preventDefault();
        if (!confirm("你确定要删除这一条记录吗?")) {
            return;
        }
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.row(0).data(nRow);
        $.ajax({
        	
            url : $.coreApiPath + "/",
            type:"post",
            dataType:"json",
            data:{
                "id":aData.id,
            },
            success : function(data){
                console.log(data);
                if(data.success){
                     oTable.fnDeleteRow(nRow);
                }
            },error:function(msg){
            }
        });
    });

    
    /**
     * 绑定取消按钮事件
     */
    oTable.on('click', '.cancel', function (e) {
        e.preventDefault();
        if (nNew) {
            oTable.fnDeleteRow(nEditing);
            nEditing = null;
            nNew = false;
        } else {
            restoreRow(oTable, nEditing);
            nEditing = null;
        }
    });

    /**
     * 绑定编辑按钮事件
     */
    oTable.on('click','.edit', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        if (nEditing !== null && nEditing != nRow) {
            restoreRow(oTable, nEditing);
            editRow(oTable, nRow);
            nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML=="<i class=\"fa fa-save\"></i>") {
            saveRow(oTable, nEditing);
            nEditing = null;
        } else {
            editRow(oTable, nRow);
            nEditing = nRow;
        }
    });
};


