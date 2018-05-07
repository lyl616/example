var E_SERVER_ERROR = 'Error communicating with the server'

Vue.component('custom-actions', {
	template: '<button class="btn btn-info m-l-10" @click="onClick(\'view-item\', rowData)"><i class="zoom icon"></i>查看</button>',
	props: {
		rowData: {
			type: Object,
			required: true
		}
	},
	methods: {
		onClick: function(action, data) {
			console.log('actions: on-click', data.name);
			this.$root.showModel(data.id, data.name);
		},
	}
})

var tableColumns = [{
		name: '__checkbox:id',
		width: '30px',
		title: 'checkbox',
		titleClass: 'text-center',
		dataClass: 'text-center'
	},
	{
		name: '__sequence',
		title: '序号',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '50px'
	},
	{
		name: 'name',
		title: '角色名称',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '200px'

	},
	{
		name: 'description',
		title: '角色描述',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '250px'
	},
	{
		name: '__component:custom-actions',
		title: '功能',
		titleClass: 'text-left',
		dataClass: 'text-left'
	}
]

Vue.use(Vuetable);
Vue.config.productionTip = false;
var vm = new Vue({
	el: '#app',
	data: {
		loading: '',
		parentOrg: {
			id: "",
			name: ""
		},
		orgId: "",
		orgCode: "",
		orgName: "",
		orgType: "1",
		orgDescription: "",
		funRoleName: "",
		searchRoleName: "",
		searchFor: '',
		moreParams: {
			"orgId": $("#orgId").val(),
			"roleName": ""
		},
		seaOrgRole: {
			orgId: $("#orgId").val(),
			roleName: ""
		},
		roleSearchTimer: null,
		fields: tableColumns,
		tableHeight: '457px',
		selectedTo: [],
		vuetableFields: false,
		sortOrder: [{
			field: 'name',
			direction: 'asc',
		}],
		multiSort: true,
		noDataTemplate: '没有相关的数据',
		paginationComponent: 'vuetable-pagination',
		perPage: 10,
		paginationInfoTemplate: '显示: {from} to {to} ，共 {total} 条记录'
	},
	mounted: function() {
		this.orgId = $("#orgId").val();
		this.parentOrg.id = $("#parentId").val();
		this.parentOrg.name = $("#parentName").val();
		if(this.orgId) {
			$("#pageName").html("修改组织");
		} else {
			$("#pageName").html("添加组织");
		}
		//this.searchRoles();
		this.initOrgInfo();
		this.initTree();
		this.initFunTree();
	},
	watch: {
		'searchRoleName': function(val, oldVal) {
			if(this.roleSearchTimer) {
				clearTimeout(this.roleSearchTimer);
				this.roleSearchTimer = null;
			}
			this.$nextTick(function() {
				this.searchRolesTimeout();
			})
			/*
            this.$nextTick(function () {
                this.searchRoles();
            })//*/
		},
		'perPage': function(val, oldVal) {
			this.$nextTick(function() {
				this.$refs.vuetable.refresh()
			})
		},
		'paginationComponent': function(val, oldVal) {
			this.$nextTick(function() {
				this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
			})
		}
	},
	methods: {
		initOrgInfo: function() {
			var _self = this;
			if(_self.orgId) {
				ajax_get(coreApiPath + "/sysorg/getOrgById/" + _self.orgId, {}, function(data) {
					if(data.result) {
						_self.parentOrg.id = data.data.parentId;
						_self.parentOrg.name = data.data.parentName;
						_self.orgCode = data.data.code;
						_self.orgName = data.data.name;
						_self.orgType = data.data.type;
						_self.orgDescription = data.data.description;
					} else {
						alert(data.msg ? data.msg : "初始化组织信息出错");
					}
				});
			}
		},
		initTree: function() {
			var _self = this;
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
				_self.parentOrg.id = treeNode.id;
				_self.parentOrg.name = treeNode.name;
				hideMenu();
			}

			ajax_get($.backendApiPath + "/sysorg/getOrgTreeHasPriv", {}, function(data) {
				if(2000 == data.erroCode) {
					$.fn.zTree.init($("#downDragtree"), setting, data.result);
				}
			});
		},
		initFunTree: function(roleId) {
			var _self = this;
			var setting = {
				check: {
					enable: true
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					beforeCheck: function() {
						return false;
					}
				}
			};
			ajax_get_msg($.backendApiPath + "/role/queryRoleFuns/" + (roleId ? roleId : '_'), {}, "加载", function(data) {
				if(2000 == data.erroCode) {
					var funList = data.result.funList;
					var funIds = data.result.funIds;
					if(!$.isArray(funIds)) {
						funIds = [];
					}
					if(funIds.length > 0) {
						funIds.push('-1');
					}
					$.each(funList, function(k, o) {
						o.checked = funIds.hasVal(o.id);
						funIds.removeByValue(o.id);
					});
					$.fn.zTree.init($("#fun_tree"), setting, funList);
					_self.selectedFuncs = funIds;
				} else {
					alert(data.msg ? data.erroMsg : "初始化角色功能树出错");
				}
			});
		},
		refreshRoleFunTree: function(roleId, callback) {
			ajax_get_msg($.backendApiPath + "/function/queryRoleFunIds/" + (roleId ? roleId : '_'), {}, "加载", function(data) {
				if(2000 == data.erroCode) {
					clearZTreeCheck("fun_tree");
					var treeObj = $.fn.zTree.getZTreeObj("fun_tree");
					var funIds = data.result.funIds;
					if(!$.isArray(funIds)) {
						funIds = [];
					}
					if(funIds.length > 0) {
						funIds.push('-1');
					}
					chkYlZTreeByIds(treeObj, funIds);
				} else {
					alert(data.erroMsg ? data.erroMsg : "初始化角色功能树出错");
				}
				if($.isFunction(callback)) {
					callback(data);
				}
			});
		},

		showModel: function(roleId, roleName) {
			//console.log("zhix ");
			this.funRoleName = roleName;
			this.refreshRoleFunTree(roleId, function(data) {
				if(data.result) {
					$('#myModal').modal('show');
				}
			});
		},
		closeFunModal: function() {
			$('#myModal').modal('hide');
		},
		transform: function(response) {
			var transformed = {}
			transformed.pagination = {
				total: response.pagination.total,
				per_page: response.pagination.per_page,
				current_page: response.pagination.current_page,
				last_page: response.pagination.last_page,
				next_page_url: response.pagination.next_page_url,
				prev_page_url: response.pagination.prev_page_url,
				from: response.pagination.from,
				to: response.pagination.to
			}

			transformed.data = [];
			this.selectedTo = [];
			response = response.data;
			for(var i = 0; i < response.length; i++) {
				transformed['data'].push({
					id: response[i].id,
					name: response[i].name,
					description: response[i].description
				});
				if(response[i].selected) {
					this.selectedTo.push(response[i].id);
					this.$refs.vuetable._data.selectedTo.push(response[i].id);
				}
			}

			return transformed
		},
		showLoader: function() {
			initLayerLoader();
			this.loading = 'loading';
		},
		hideLoader: function() {
			this.loading = '';
			closeLayreLoader();
		},
		setFilter: function() {
			this.moreParams = {
				'filter': this.searchFor
			}
			this.$nextTick(function() {
				this.$refs.vuetable.refresh()
			})
		},
		resetFilter: function() {
			this.searchFor = ''
			this.setFilter()
		},
		onLoadSuccess: function(response) {
			// set pagination data to pagination-info component
			this.$refs.paginationInfo.setPaginationData(response.data)

			var data = response.data.data
		},
		onLoadError: function(response) {
			if(response.status == 400) {
				sweetAlert('Something\'s Wrong!', response.data.message, 'error')
			} else {
				sweetAlert('Oops', E_SERVER_ERROR, 'error')
			}
		},
		onPaginationData: function(tablePagination) {
			this.$refs.paginationInfo.setPaginationData(tablePagination)
			this.$refs.pagination.setPaginationData(tablePagination)
		},
		onChangePage: function(page) {
			this.$refs.vuetable.changePage(page)
		},
		onInitialized: function(fields) {
			this.vuetableFields = fields
		},
		onDataReset: function() {
			console.log('onDataReset')
			this.$refs.paginationInfo.resetData()
			this.$refs.pagination.resetData()
		},
		searchRoles: function() {
			var _self = this;
			_self.seaOrgRole.orgId = _self.orgId;
			_self.seaOrgRole.roleName = _self.searchRoleName;
			_self.moreParams = _self.seaOrgRole;
			_self.$nextTick(function() {
				_self.$refs.vuetable.refresh()
			});
		},
		searchRolesTimeout: function() {
			var _self = this;
			_self.roleSearchTimer = setTimeout(function() {
				_self.searchRoles();
			}, 800);
		},
		saveSysOrg: function() {
			var _self = this;
			if(isNull(this.parentOrg.id)) {
				layer.msg("父级组织不能为空！");
				return false;
			}
			if(isNull(this.orgName)) {
				layer.msg("名称不能为空！");
				return false;
			}
			if(isNull(this.orgType)) {
				layer.msg("类型不能为空！");
				return false;
			}
			var selectTo = this.$refs.vuetable._data.selectedTo;
			if(selectTo.length <= 0) {
				layer.msg("必须选择组织的角色！");
				return false;
			}
			if(this.orgName.length > 30) {
				this.orgName = this.orgName.substring(0, 30);
			}
			if(!isNull(this.orgDescription) && this.orgDescription.length > 50) {
				this.orgDescription = this.orgDescription.substring(0, 50);
			}
			var saveUrl = _self.orgId ? ($.backendApiPath + "/sysorg/updateSysOrg") : ($.backendApiPath + "/sysorg/addSysOrg");
			var postData = {
				'code': _self.orgCode,
				'name': _self.orgName,
				'parentId': _self.parentOrg.id,
				'description': _self.orgDescription,
				'type': _self.orgType,
				"roleIds": selectTo.join(',')
			};
			if(_self.orgId) {
				postData['id'] = _self.orgId;
			}
			//*
			post_ajax(saveUrl, JSON.stringify(postData), "保存", 'application/json; charset=UTF-8', function(data) {
				if(2000 == data.erroCode) {
					layer.msg(data.msg ? data.msg : "保存成功！");
					_self.$nextTick(function() {
						_self.cancelModify();
					});
				} else {
					//错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
					layer.msg(data.erroMsg ? data.erroMsg : "保存失败！");
					return false;
				}
			}, "保存失败！");
			//*/
			/*
			$.ajax({
			    type: "post",
			    url: saveUrl,
			    dataType: "json",
			    data: JSON.stringify(postData),
			    contentType: 'application/json; charset=UTF-8',
			    success: function (data) {
			        if (data.result) {
			            layer.msg(data.message ? data.message : "保存成功！");
			            _self.$nextTick(function () {
			                _self.cancelModify();
			            });
			        } else {
			            //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
			            layer.msg(data.message ? data.message : "保存失败！");
			            return false;
			        }
			    },
			    error: function (errorMsg) {
			        console.log("error:::::::::/"+saveUrl);
			        console.log(errorMsg);
			    }
			});//*/
		},
		cancelModify: function() {
			window.location.href = ctx + "/sys/organize";
		}
	},
})

//下拉树菜单操作
function beforeClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("downDragtree");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("downDragtree"),
		nodes = zTree.getCheckedNodes(true),
		v = "";
	for(var i = 0, l = nodes.length; i < l; i++) {
		v += nodes[i].name + ",";
	}
	if(v.length > 0) v = v.substring(0, v.length - 1);
	var cityObj = $("#citySel");
	cityObj.attr("value", v);
}

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