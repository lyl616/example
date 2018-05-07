

function beforeClick(treeId, treeNode) {
	// var check = (treeNode && !treeNode.isParent);
	// if (!check) layer.msg("只能选择城市...");
	// return check;
}

function showMenuForAdd() {
	var cityObj = $("#parentNameForAdd");
	var cityOffset = $("#parentNameForAdd").offset();
	$("#menuContentForAdd").css({}).slideDown("fast");

	$("body").bind("mousedown", onBodyDownForAdd);
}
function hideMenuForAdd() {
	$("#menuContentForAdd").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDownForAdd);
}
function onBodyDownForAdd(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContentForAdd" || $(
			event.target).parents("#menuContentForAdd").length > 0)) {
		hideMenuForAdd();
	}
}


function initGroupTree(treeId,data){
	if (data!=null&&data.length > 0) {
		var settingForAdd = {
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
				onClick : function(e, treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj(treeId), nodes = zTree
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
					var cityObj = $("#parentNameForAdd");
					cityObj.val(v);
					var parentIdForAdd = $("#parentIdForAdd");
					parentIdForAdd.val(nodeId);
					hideMenuForAdd();
				}
			}
		};
		$.fn.zTree.init($("#"+treeId), settingForAdd, data);
	}
}