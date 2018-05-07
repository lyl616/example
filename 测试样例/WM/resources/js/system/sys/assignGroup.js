

function showgroupMenu() {
	$(".groupMenuContent").css({}).slideDown("fast");
	$("body").bind("mousedown", ongroupBodyDown);
}

var groupTree;
function getGroupTree(userId,callback) {
	var url = $.coreApiPath + "/group/getGroupsZtree";
	$.post(url, function(data) {
		if (data.length > 0) {
			groupTree = $.fn.zTree.init($("#groupTree"), groupSetting, data);
		}
		if(callback){
			callback(userId);
		}
	}, "json");
}

var groupSetting = {
	view : {
		dblClickExpand : false
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onCheck : chkboxTypeGroup
	},
	check : {
		enable : true
	}
};

/**
 * 初始化选中某些节点
 * @param idArr
 */
function initSelectGroup(idArr){
	groupTree.checkAllNodes(false);
	var node = null;
	for(var i=0;i<idArr.length;i++){
		var id = idArr[i]+"";
		node = groupTree.getNodeByParam("id",id);
		groupTree.checkNode(node,true,true);
	}
	chkboxTypeGroup();
}

function chkboxTypeGroup(e, treeId, treeNode) {
	var nodes = groupTree.getCheckedNodes(true);
	var v = "";
	var nodeId = "";
	for (var i = 0, l = nodes.length; i < l; i++) {
		v += nodes[i].name + ",";
		nodeId += nodes[i].id + ",";
	}
	$(".treeGroupName").attr("value", v.substring(0,v.length-1));
	$(".treeGroupId").attr("value", nodeId.substring(0,nodeId.length-1));
}

function hidegroupMenu() {
	$(".groupMenuContent").fadeOut("fast");
	$("body").unbind("mousedown", ongroupBodyDown);
}
function ongroupBodyDown(event) {
	if (!(event.target.id == "groupMenuContent" || $(
			event.target).parents(".groupMenuContent").length > 0)) {
		hidegroupMenu();
	}
}
