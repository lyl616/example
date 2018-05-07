var treeNodeParentId = null;


$(function(){
	getList();
	getGroupTree();
	$("#groupForm").validate();
});
/**
 * 获取组管理分页列表
 */
function getList(){
	var scrrenH = document.body.clientHeight,tableScrollY=(scrrenH-100)+"px";
	tab = $('#tab').DataTable({
		"dom" : '<l<"#topPlugin">f>rt<ip>',
        "ajax": {
        	 url:$.coreApiPath+"/group/getGroups",
        	 type: 'POST',
        	 "data":function(d){
    			 d.parentId = treeNodeParentId;
    			 d.name = $("#searchName").val();
    		 }
        },
        select: {
            "style"   : 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "scrollY": tableScrollY, //支持垂直滚动
        "scrollCollapse": true,
        "lengthMenu" : [ 10, 20, 40, 50 ],
		"autoWidth":true,
		"responsive" :true,
		"processing": true,
        "serverSide": true,
        "lengthChange": true, //开关，是否显示每页大小的下拉框
		"searching": false, //开关，是否启用客户端过滤器
		"info": true, //开关，是否显示表格的一些信息
		"paging": true, //开关，是否显示分页器
		"ordering": false, //开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url" : $.ctx+"/resources/plugins/DataTables/config/Chinese.json"
        },
        initComplete : addBut,
        "columns" : [
                     {"title":'<input type="checkbox" class="t_selt" />',
                    	"data":"id","orderable": false,"className":"select-checkbox text-center",
                    	"render": function(){
                    		return ''
                     }},
                     { "title":"名称","data":"name","className":"text-center"},
                     { "title":"parentId","data":"parentId","className":"text-center","visible": false},
                     { "title":"编码","data":"code","className":"text-center","visible": false},
                     { "title":"描述","data":"description","className":"text-center"},
                     { "title":"创建人","data":"createBy","className":"text-center","visible": false},
                     { "title":"创建时间","data":"createDt","className":"text-center","visible": false},
                     { "title":"修改人","data":"modifyBy","className":"text-center","visible": false},
                     { "title":"修改时间","data":"modifyDt","className":"text-center","visible": false},
                     { "title":"操作","data":"id","className":"text-center","width":"80px",
                     	"render" : function(data, type, full, meta) {
                     		var pid = full.parentId===undefined?"":full.parentId
                     		var up="";
            				var fun="";
            				var role="";
            				
            				var isShowUpdateBtn=$("#updateBtn").val();
            				var isShowFunBtn=$("#funBtn").val();
            				var isShowRoleBtn=$("#roleBtn").val();
                     		if(isShowUpdateBtn==1){
                     			up = '<button id="assign" class="btn btn-success btn-outline btn-xs" onclick=update("'+data+'")>修改</button>';
                     		}
                     		if(isShowFunBtn==1){
                     			//fun = '<button class="btn btn-info btn-outline btn-xs" onclick=showAssignFun("'+data+'","'+pid+'")>功能</button>';
                     		}
                     		if(isShowRoleBtn==1){
                     			role = '<button class="btn btn-warning btn-outline btn-xs" onclick=showAssignRole("'+data+'","'+pid+'")>角色</button>';
                     		}
                     		return up+" "+fun+" "+role;
                     	}
          			 }
        ]
	});
}

function addBut(){
	cusInitComplete();	
	var html = $("#topPlugin").html();
//	alert(html+"4444")
//	$("#topPlugin").remove();
//	$("#topPlugin").html(html);
}

/**
 * 显示分配功能
 * @param id
 */
function showAssignFun(id,pid){
	getTreeForGroupAllot(pid);
	setTimeout(function(){
		$("#funModal").modal("show");
		$("#groupId").val(id);
		$.ajax({
	        type: "get",
	        url:$.coreApiPath+"/group/getFunIdsByGroupId/"+id,
	        error: function(request) {
	        },
	        success: function(data) {
	        	initSelect(data);
	        }
	    });
	},300);
}

/**
 * 保存分配的功能
 */
function addFunToGroup(){
	$.ajax({
        type: "POST",
        url:$.coreApiPath+"/group/assignFun",
        data:$('#assignForm').serialize(),
        error: function(request) {
        },
        success: function(data) {
        	$("#funModal").modal("hide");
        	layer.msg('分配成功');
        }
    });
}

/**
 * 显示分配角色
 * @param id
 */
function showAssignRole(id,pid){
	getRoleForGroupTree(null,false ,pid);
	setTimeout(function(){
		$("#roleModal").modal("show");
		$("#rGroupId").val(id);
		$.ajax({
			type: "get",
			url:$.coreApiPath+"/group/getRoleIdsByGroupId/"+id,
			error: function(request) {
			},
			success: function(data) {
				initSelectRole(data);
			}
		});
	},300);
}

/**
 * 保存分配的角色
 */
function addRoleToGroup(){
	$.ajax({
        type: "POST",
        url:$.coreApiPath+"/group/assignRole",
        data:$('#assignRoleForm').serialize(),
        error: function(request) {
        },
        success: function(data) {
        	$("#roleModal").modal("hide");
        	layer.msg('分配成功');
        }
    });
}

/**
 * 显示组modal
 */
function showGroupModal(){
	$("#parentNameForAdd").attr("onclick","showMenuForAdd(); return false;");
	getGroupTreeForAdd();
	cleanForm("groupForm");
	$("#groupModal").modal("show");
}

/**
 * 添加组
 */
function addGroup(){
	$.ajax({
        type: "POST",
        url:$.coreApiPath+"/group/saveOrUpGroup",
        data:$('#groupForm').serialize(),
        beforeSend : function(){
        	return $("#groupForm").valid();
        },
        error: function(request) {
        },
        success: function(data) {
        	$("#groupModal").modal("hide");
        	layer.msg('保存成功');
        	reloadData();
        }
    });
}

/**
 * 修改
 * @param id
 */
function update(id){	
	$("#parentNameForAdd").removeAttr("onclick");
	//showGroupModal(); //禁止修改夫级分组
	$("#groupTreeForAdd").empty();
	cleanForm("groupForm");
	$("#groupModal").modal("show");
	$.ajax({
		type: "get",
		url:$.coreApiPath+"/group/getGroup/"+id,
		error: function(request) {
		},
		success: function(data) {
			var id_html='<input type="hidden" id="id" name="id"><input type="hidden" id="code" name="code">';
			$(".appendId").empty();
			$(".appendId").append(id_html);
			$("#name").val(data.name);
			$("#code").val(data.code);
			$("#description").val(data.description);
			$("#id").val(data.id);
			if(data.parentId!=null){
				$.ajax({
					url : $.coreApiPath + "/group/getGroup/" + data.parentId,
					async : true,
					type : "post",
					dataType : "json",
					cache : false, // 不允许缓存
					success : function(rP) {
						$("#parentNameForAdd").val(rP.name);
						$("#parentIdForAdd").val(rP.id);
					}
				});
			}else{
				$("#parentNameForAdd").val("根目录");
				$("#parentIdForAdd").val("-1");
			}
		}
	});
}

/**
 * 删除
 */
function del(){
	var rows = tab.rows( { selected: true } );
	var count = rows.count();
	if(count<=0){
		layer.msg('请选择后删除');
		return;
	}
	layer.msg('你确定要删除吗？子组将会同时被删除。', {
	  time: 0, //不自动关闭
	  btn: ['确定删除', '取消'],
	  yes: function(index){
		  var ids = new Array();
			var index = 0;
			rows.every( function(){
				ids[index]=this.data().id;
				index++;
			});
			$.ajax({
				type : "post",
				async : false,
				dataType : "json",
				url : $.coreApiPath+"/group/delGroups",
				data : {ids:ids},
				success : function(data) {
					layer.msg('删除成功');
					reloadData();
				}
			});
	  }
	});
}


function reloadData(){
	tab.ajax.reload();
	getGroupTree();
	$("#groupForm").validate();
	clean_from();
}

/**
 * 清空表单
 */
function clean_from(){
	$(".appendId").empty();
	$('#groupForm').cleanForm("groupForm");
	$("#parentName").val("根目录");
	$("#parentId").val("-1");
	$("#parentNameForAdd").val("根目录");
	$("#parentIdForAdd").val("-1");
}

/**
 * 搜索
 */
function searchGroupData(){
	treeNodeParentId = null;
	tab.ajax.reload();
}

/*****************group 左侧树 start*********************/
/**
 * 获得tree数据（用于添加或修改）
 */
function getGroupTreeForAdd() {
	$("#groupTreeForAdd").empty();
	var url = $.coreApiPath + "/group/getGroupTreeForLeft";
	$.post(url, {}, function(data) {
		initGroupTree("groupTreeForAdd",data)
	}, "json");
}
/**
 * 获得tree数据(左侧搜索栏)
 * @param parent_id
 */
function getGroupTree() {
	var settingForGroup = {
			data : {
				simpleData : {
					enable : true
				}
			},
			callback : {
				onExpand :onExpandEvent,
				onClick : onClickEvent
			},
			check : {
				enable : false
			},
			view: {
				dblClickExpand: false//屏蔽掉双击事件
			}
	};
	var url = $.coreApiPath + "/group/getGroupTreeForLeft";
	$.post(url, {}, function(data) {
		if (data.length > 0) {
			$("#groupTreeForLeft").empty();
			$.fn.zTree.init($("#groupTreeForLeft"), settingForGroup, data);
		}
	}, "json");
}

/**
 * tree 单击事件
 * @param e
 * @param treeId
 * @param treeNode
 */
function onClickEvent(e, treeId, treeNode){
	treeNodeParentId = treeNode.id;
	$("#searchName").val(null);
	tab.ajax.reload();
	var zTree = $.fn.zTree.getZTreeObj("groupTreeForLeft");
	zTree.expandNode(treeNode);
};
/**
 * tree 展开事件
 * @param e
 * @param treeId
 * @param treeNode
 */
function onExpandEvent(e, treeId, treeNode){
	treeNodeParentId = treeNode.id;
	$("#searchName").val(null);
	tab.ajax.reload();
}
/*****************group 左侧树   end*********************/
