var E_SERVER_ERROR = 'Error communicating with the server'

var queryType = CommonUtil.getQueryParameter('type');

Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        roleId: '',
        roleCode: '',
        roleName: '',
        roleDescription: '',
        selectedFuncs: [],
        isViewMode: (queryType == 1)
    },
    watch: {},
    methods: {
        initLoadRoleInfo: function () {
            var _self = this;
            if (_self.roleId) {
                ajax_get_msg($.backendApiPath + "/role/getRole/" + _self.roleId, {}, "加载", function (data) {
                    if (2000 == data.erroCode) {
                        _self.roleName = data.result.name;
                        _self.roleDescription = data.result.description;
                        _self.roleCode = data.result.code;
                    }
                    else {
                        alert(data.erroMsg ? data.erroMsg : "初始化角色信息出错");
                    }
                });
            }
        },
        initFuncTreeForRole: function () {
            var _self = this;
            var setting = {
                callback: {
                    beforeCheck: zTreeBeforeCheck
                },
                check: {
                    enable: true,
                    chkboxType: {"Y": "p", "N": "s"}
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                }
            };
            ajax_get_msg($.backendApiPath + "/role/queryRoleFuns/" + (_self.roleId ? _self.roleId : '_'), {}, "加载", function (data) {
                if (2000 == data.erroCode) {
                    var funList = data.result.funList;
                    var funIds = data.result.funIds;
                    if (!$.isArray(funIds)) {
                        funIds = [];
                    }
                    if (funIds.length > 0) {
                        funIds.push('-1');
                    }
                    $.each(funList, function (k, o) {
                        o.checked = funIds.hasVal(o.id);
                        if (o.chkDisabled != true) {
                            //不可编辑的选项不允许修改
                            funIds.removeByValue(o.id);
                        }
                        if (_self.isViewMode) {
                            o.chkDisabled = true;
                        }
                    });
                    $.fn.zTree.init($("#userListTree"), setting, funList);
                    _self.selectedFuncs = funIds;
                }
                else {
                    alert(data.erroMsg ? data.erroMsg : "初始化角色功能树出错");
                }
            });
        },
        saveSysRole: function () {
            var _self = this;
            if (isNull($.trim(_self.roleName))) {
                layer.msg("角色名称不能为空！");
                return false;
            }
            var treeObj = $.fn.zTree.getZTreeObj("userListTree");
            var chkNodes = treeObj.getCheckedNodes();
            $.each(chkNodes, function (i, n) {
                if (!_self.selectedFuncs.hasVal(n.id))
                    _self.selectedFuncs.push(n.id);
            });
            if (_self.selectedFuncs.length <= 0) {
                layer.msg("分配功能不能为空！");
                return false;
            }
            var saveUrl = _self.roleId ? ($.backendApiPath + "/role/updateSysRole") : ($.backendApiPath + "/role/addSysRole");
            var postData = {
                'code': _self.roleCode,
                'name': $.trim(_self.roleName),
                'description': _self.roleDescription,
                "funIds": _self.selectedFuncs.join(',')
            };
            if (_self.roleId) {
                postData['id'] = _self.roleId;
            }
            post_ajax(saveUrl, JSON.stringify(postData), "保存", 'application/json; charset=UTF-8', function (data) {
                if (data.erroCode === 2000) {
                    layer.msg(data.msg ? data.msg : "保存成功！");
                    _self.$nextTick(function () {
                        _self.cancelModify();
                    });
                } else {
                    //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                    layer.msg(data.msg ? data.msg : "保存失败！");
                    return false;
                }
            }, "保存失败！");
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
            });
            //*/
        },
        cancelModify: function () {
            window.location.href = ctx + "/role/manager";
        },
        formatDate(value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        showLoader: function () {
            initLayerLoader();
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = '';
            closeLayreLoader();
        }
    },
    mounted: function () {
        this.roleId = $("#roleId").val();
        if (this.roleId) {
            $("#pageName").html("修改角色");
        }
        else {
            $("#pageName").html("添加角色");
        }
        this.initLoadRoleInfo();
        this.initFuncTreeForRole();
    }
});

function zTreeBeforeCheck(treeId, treeNode, clickFlag) {
    if (treeNode.type != 3) {
        if (!treeNode.checked) {
            cancelParentNodeChecked(treeNode);
        } else {
            cancelChildrenNodeChecked(treeNode);
        }
    }
}

function cancelParentNodeChecked(node) {
    zTree = $.fn.zTree.getZTreeObj("userListTree");
    var nodes = node.children;
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].type != 3) {
                zTree.checkNode(nodes[i], true, false);
                cancelParentNodeChecked(nodes[i]);
            }
        }
    }
}

function cancelChildrenNodeChecked(node) {
    zTree = $.fn.zTree.getZTreeObj("userListTree");
    var m = 0;
    if (node.getParentNode()) {
        var nodes = node.getParentNode().children;
        if (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id != node.id) {
                    if (nodes[i].checked) {
                        m += 1;
                    } else {
                        m += 0;
                    }
                }
            }
        }
        if (m == 0) {
            zTree.checkNode(node.getParentNode(), false, false);
            cancelChildrenNodeChecked(node.getParentNode());
        }
    }
}
