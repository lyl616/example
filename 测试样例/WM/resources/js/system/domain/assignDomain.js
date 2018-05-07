function showDomainMenu() {
	$(".domainMenuContent").css({}).slideDown("fast");
	$("body").bind("mousedown", onDomainBodyDown);
}

var domainTree;

/**
 * 初始化省市 区域
 * @param id 用户id
 * @param callback 回调查询用户的省市
 */
function getDomainTree(id,callback) {
	var url = $.coreApiPath + "/domain/getDomainsZtree";
	$.post(url, function(data) {
		if (data.length > 0) {
			domainTree = $.fn.zTree.init($("#domainTree"), domainSetting, data);
		}
		if(callback){
			callback(id);
		}
	}, "json");
}

var domainSetting = {
	view : {
		dblClickExpand : false
	},
	data : {
		simpleData : {
			enable : true
		}
	},
	callback : {
		onCheck : chkboxTypeDomain
	},
	check : {
		enable : true
	}
};

/**
 * 初始化选中某些节点
 * @param idArr
 */
function initSelectDomain(idArr){
	domainTree.checkAllNodes(false);
	var node = null;
	for(var i=0;i<idArr.length;i++){
		var id = idArr[i]+"";
		node = domainTree.getNodeByParam("id",id);
		domainTree.checkNode(node,true,true);
	}
	chkboxTypeDomain();
}

function chkboxTypeDomain(e, treeId, treeNode) {
	var nodes = domainTree.getCheckedNodes(true);
	var v = "";
	var nodeId = "";
	for (var i = 0, l = nodes.length; i < l; i++) {
		if(!nodes[i].isParent){
			v += nodes[i].name + ",";
			nodeId += nodes[i].bid + ",";
		}
	}
	$(".treeDomainName").attr("value", v.substring(0,v.length-1));
	$(".treeDomainId").attr("value", nodeId.substring(0,nodeId.length-1));
}

function hideDomainMenu() {
	$(".domainMenuContent").fadeOut("fast");
	$("body").unbind("mousedown", onDomainBodyDown);
}
function onDomainBodyDown(event) {
	if (!(event.target.id == "domainMenuContent" || $(
			event.target).parents(".domainMenuContent").length > 0)) {
		hideDomainMenu();
	}
}
