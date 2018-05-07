


function showRoleMenu() {
    $(".roleMenuContent").css({}).slideDown("fast");
    $("body").bind("mousedown", onRoleBodyDown);
}


var roleTree;
/**
 * 获取用户角色信息
 * @param userId用户id
 * @param callback
 */
function getRoleTree(userId, callback) {
    var url = $.coreApiPath + "/role/getRolesZtree";
    $.post(url, function (data) {
        if (data.length > 0) {
            roleTree = $.fn.zTree.init($("#roleTree"), roleSetting, data);
        }
        if (callback) {
            callback(userId);
        }
    }, "json");
}
/**
 * 获取用户角色信息(组授权使用)
 * @param userId用户id
 * @param callback
 */
function getRoleForGroupTree(userId, callback,pId) {
	$("#roleTree").empty();
	var url = $.coreApiPath + "/role/getRolesForGroupZtree";
	$.post(url,{"groupParentId":pId}, function (data) {
		if (data.length > 0) {
			roleTree = $.fn.zTree.init($("#roleTree"), roleSetting, data);
		}
		if (callback) {
			callback(userId);
		}
	}, "json");
}

var roleSetting = {
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onCheck: chkboxTypeRole
    },
    check: {
        enable: true,
        chkboxType:  { "Y" : "s", "N" : "s" }
    }
};

/**
 * 初始化选中某些节点
 * @param idArr
 */
function initSelectRole(idArr) {
    roleTree.checkAllNodes(false);
    var node = null;
    for (var i = 0; i < idArr.length; i++) {
        var id = idArr[i] + "";
        node = roleTree.getNodeByParam("id", id);
        roleTree.checkNode(node, true, false);
    }
    chkboxTypeRole();
}

function chkboxTypeRole(e, treeId, treeNode) {
    var nodes = roleTree.getCheckedNodes(true);
    var v = "";
    var nodeId = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
        nodeId += nodes[i].id + ",";
    }
    $(".treeRoleName").attr("value", v.substring(0, v.length - 1));
    $(".treeRoleId").attr("value", nodeId.substring(0, nodeId.length - 1));
}

function hideRoleMenu() {
    $(".roleMenuContent").fadeOut("fast");
    $("body").unbind("mousedown", onRoleBodyDown);
}
function onRoleBodyDown(event) {
    if (!(event.target.id == "roleMenuContent" || $(
            event.target).parents(".roleMenuContent").length > 0)) {
        hideRoleMenu();
    }
}
