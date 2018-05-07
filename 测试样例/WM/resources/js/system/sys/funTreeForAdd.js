
var settingForAdd = {
	async : {
		autoParam : [ "id=parentId" ],
		contentType : "application/x-www-form-urlencoded",
		enable : true,
		type : "post",
		url : $.coreApiPath + "/function/getFunctionsByParentID"
	},
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
		onClick : onClick
	}
};

function beforeClick(treeId, treeNode) {
	// var check = (treeNode && !treeNode.isParent);
	// if (!check) layer.msg("只能选择城市...");
	// return check;
}

function onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeForAdd"), nodes = zTree
			.getSelectedNodes(), v = "";
	var nodeId = "";
	nodes.sort(function compare(a, b) {
		return a.id - b.id;
	});
	for (var i = 0, l = nodes.length; i < l; i++) {
		v += nodes[i].name + ",";
		nodeId += nodes[i].id;
	}
	if (v.length > 0)
		v = v.substring(0, v.length - 1);
	var cityObj = $("#parentName");
	cityObj.val(v);
	var parentId = $("#parentId");
	parentId.val(nodeId);
	hideMenu();
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

$(function(){
	var temp = [];
	var bo={"id":"-1","pId":"-1","name":"作为根功能","isParent":true};
	temp.push(bo);
	$.fn.zTree.init($("#treeForAdd"), settingForAdd, temp);
})
