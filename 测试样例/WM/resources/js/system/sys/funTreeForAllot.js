var TREE;
function getTreeForAllot() {
	var url = $.coreApiPath + "/function/getFunctionsForAllot";
	$.post(url, function(data) {
		if (data.length > 0) {
			TREE = $.fn.zTree.init($(".treeForAdd"), settingForAllot, data);
		}
	}, "json");
}
/*
 * 用户组分权限使用
 */
function getTreeForGroupAllot(parentId) {
	var url = $.coreApiPath + "/function/getFunctionsForGroupAllot";
	$.post(url,{"groupParentID":parentId}, function(data) {
		$(".treeForAdd").empty();
		if (data.length > 0) {
			TREE = $.fn.zTree.init($(".treeForAdd"), settingForAllot, data);
		}
	}, "json");
}

var settingForAllot = {
	view : {
		dblClickExpand : false
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		beforeClick : beforeClick,
		onCheck : chkboxType
	},
	check : {
		enable : true
	}
};

settingForAllot.check.chkboxType = { "Y" : "ps", "N" : "s" };

function beforeClick(treeId, treeNode) {
	// var check = (treeNode && !treeNode.isParent);
	// if (!check) alert("只能选择城市...");
	// return check;
}

function chkboxType(e, treeId, treeNode) {
	var zTree = TREE, 
	nodes = zTree.getCheckedNodes(true), 
	v = "";
	var nodeId = "";
//	nodes.sort(function compare(a, b) {
//		return a.id - b.id;
//	});
	for (var i = 0, l = nodes.length; i < l; i++) {
		v += nodes[i].name + ",";
		nodeId += nodes[i].id + ",";
	}
	var cityObj = $(".parentName");
	cityObj.attr("value", v.substring(0,v.length-1));
	var parentId = $(".parentId");
	parentId.attr("value", nodeId.substring(0,nodeId.length-1));
}

function showMenu() {
	var cityObj = $("#parentName");
	var cityOffset = $("#parentName").offset();
	$("#menuContent").css({}).slideDown("fast");

	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(
			event.target).parents("#menuContent").length > 0)) {
		hideMenu();
	}
}

/**
 * 初始化选中某些节点
 * @param idArr
 */
function initSelect(idArr){
	TREE.checkAllNodes(false);
	var node = null;
	for(var i=0;i<idArr.length;i++){
		var id = idArr[i]+"";
		node = TREE.getNodeByParam("id",id);
		TREE.checkNode(node,true,false);
	}
	chkboxType();
}


