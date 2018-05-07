var E_SERVER_ERROR = 'Error communicating with the server'
Vue.config.productionTip = false;
var vm = new Vue({
	el: '#app',
	data: {
		loading: "",
		vuetableFields: false,
		orgId: {
			name: "",
			id: ""
		}, //存储所选组织的id
		orname: "",
		ordescription: "",
		projectId: '',
		fgaddOrMody: true //默认添加
	},
	mounted: function() {
		this.initTree();
	},
	watch: {
		'perPage': function(val, oldVal) {
			this.$nextTick(function() {
				this.$refs.vuetable.refresh()
			})
		}
	},
	methods: {
		trim: function(str) {
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		judgeTextarea: function(textLength, val) {
			var msg = '',
				get_msg = 0;
			if(val == 'orname') {
				msg = this.orname;
			} else if(val == 'ordescription') {
				msg = this.ordescription;
			}
			get_msg = this.trim(msg);
			var letter_num = textLength - get_msg.length,
				input_msg = '';
			//console.log("可输入  " + letter_num + "   已输入    " + get_msg.length);
			if(letter_num == 0) {
				input_msg = get_msg.substring(0, textLength);
			} else if(letter_num < 0) {
				layer.msg('输入的内容不得大于' + textLength + '字！');
				input_msg = get_msg.substring(0, textLength);
			} else {
				input_msg = get_msg;
			}
			if(val == 'orname') {
				this.orname = input_msg;
			} else if(val == 'ordescription') {
				this.ordescription = input_msg;
			}
		},
		getproTreeForId: function(id) {
			var url = $.backendApiPath + "/sysproject/getProjectById/" + id,
				that = this;
			$.ajax({
				type: "get",
				url: url,
				async: true,
				success: function(data) {
					var result = data.result;
					
					that.orname = result.name;
					that.ordescription = result.description;
					that.orgId.id = result.orgId;
					that.orgId.name = result.orgName;
					var orgVal = result.orgId,
						zTree = $.fn.zTree.getZTreeObj("downDragtree");
					zTree.selectNode(zTree.getNodeByParam("id", id));
				}
			});
		},
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				return unescape(r[2])
			} else {
				return null;
			}
		},
		seltree: function() {			
			var id = this.getUrlParam("id"),fg = this.getUrlParam("fg"), orgid = this.getUrlParam("orgid"), orgname = this.getUrlParam("orgname");
			if(fg == "n") {
				$("#pageName").html("新增项目");
				this.fgaddOrMody = true; //为添加页面
				this.orgId.id = orgid ? orgid : "";
				this.orgId.name = orgname ? orgname : "";
			} else {
				$("#pageName").html("修改项目");
				this.fgaddOrMody = false; //此处为修改页面	
			}
			
			if(id) {
				this.projectId = id;
				this.getproTreeForId(id);
			}
		},
		initTree: function() {
			var url = $.backendApiPath + "/sysorg/getOrgTreeHasPriv";
			var that = this;
			$.ajax({
				type: "get",
				url: url,
				async: true,
				success: function(data) {
					var zNodes = data.result;
					var setting = {
						check: {
							enable: false
						},
						data: {
							simpleData: {
								enable: true
							}
						},
						callback: {
                            onClick: treeClk,
                        	beforeClick: treeBeforeClk
						},
                        view: {
                            fontCss: getTreeNodeStyle
                        }
					};

                    function getTreeNodeStyle(treeId, treeNode) {
                        if(treeNode.attr && treeNode.attr.length > 0 &&
                            treeNode.attr[0] == 'N') { //无权限节点置灰
                            return {
                                'color': '#d7d7d7'
                            };
                        }
                    }

                    function treeBeforeClk(treeId, treeNode, clickFlag) {
                        if(treeNode.attr && treeNode.attr.length > 0 &&
                            treeNode.attr[0] == 'N') { //无权限节点不允许点击
                            return false;
                        }
                        return true;
                    }

                    function treeClk(event, treeId, treeNode) {
                        that.orgId.name = treeNode.name;
                        that.orgId.id = treeNode.id;
                        hideMenu();
                    }

					$.fn.zTree.init($("#downDragtree"), setting, zNodes);
					that.seltree();
				}
			});
		},
		save: function() {
			if(this.orname == '') {
				layer.msg("名称不能为空！");
				return;
			}
			if(this.orgId.id == '') {
				layer.msg("所属组织不能为空！");
				return;
			}
			var param = {
				"code": "", //项目的编码
				"description": this.ordescription,
				"name": this.orname,
				"orgId": this.orgId.id
			};
			if(this.fgaddOrMody) { //c新增项目
				var url = $.backendApiPath + "/sysproject/addSysProject";
				$.ajax({
					type: 'post',
					url: url,
					data: JSON.stringify(param),
					dataType: "json",
					contentType: "application/json;charset=UTF-8",
					success: function(data) {
						if(2000 == data.erroCode) {
							layer.msg(data.erroMsg ? data.erroMsg : "新增项目成功！");
							setTimeout(function() {
								window.location.href = ctx + "/sys/project";
							}, 1000);
						} else {
							layer.msg(data.erroMsg ? data.erroMsg : "新增项目失败！");
						}
					}
				});
			} else { //为修改项目
				param.id = this.projectId;
				var url = $.backendApiPath + "/sysproject/updateSysProject";
				$.ajax({
					type: 'post',
					url: url,
					data: JSON.stringify(param),
					dataType: "json",
					contentType: "application/json;charset=UTF-8",
					success: function(data) {
						if(2000 == data.erroCode) {
							layer.msg(data.erroMsg ? data.erroMsg : "修改项目成功！");
							setTimeout(function() {
								window.location.href = ctx + "/sys/project";
							}, 1000);
						} else {
							layer.msg(data.erroMsg ? data.erroMsg : "修改项目失败！");
						}
					}
				});
			}
		},
		canselSave: function() {
			window.location.href = ctx + "/sys/project";
		}
	},
})

function showMenu() {
	var cityObj = $("#citySel");
	var cityOffset = $("#citySel").offset();
	$("#menuContent").css({
		left: cityOffset.left + "px",
		top: cityOffset.top + cityObj.outerHeight() + "px"
	}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
	if(!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
		hideMenu();
	}
}