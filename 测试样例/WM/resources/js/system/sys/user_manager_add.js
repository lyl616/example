Vue.config.debug = false;

Vue.use(Vuetable);

var userVM = new Vue({
    el: '#app',
    data: {
        selectedTo: [],
        pageData: [],
        roleList: [], //角色信息
        domainList: [],
        domainIds: "",
        groupIds: [],
        user_id: "",
        user: {
            "userId": "",
            "userName": "",
            "fullName": "",
            "gender": 1,
            "mobileno": "",
            "workEmail": "",
            "workAddress": null,
            "isBigScreen": "1",
            "remark": null,
            "orgId": "",
            "domainId": "",
            "orgName": "",
            "allRoleName": "",
            "allOrgName": "",
            "allProjectName": "",
            "roleIdList": [],
            "domainIdList": [],
            "stationIdList": [],
            "stationProjectIdList": [],
            "projectIdList": [],
            "orgIdList": []
        },
        showOrgName: "",
        showOrgNames: "",
        showRoleNames: "",
        projectNames: "",
        userNameError: "",
        mobilenoError: "",
        fullNameError: "",
        workEmailError: "",
        workAddressError: "",
        remarkError: "",
        orgError: "",
        roleError: "",
        stationIds: "",
        collapseTwoHref: '',
        collapseThreeHref: '',
        leftHeaderTitle: 0, //左边上标题
        rightHeaderTitle: 0, //右边上标题
        leftProjectList: [], //左栏项目列表
        rightProjectList: [], //右栏项目列表
        leftCheckedProjectIdList: [], //左边选中项目id列表
        rightCheckedProjectIdList: [], //右边选中项目id列表
        isLoadProject: false //是否加载用户项目
    },
    watch: {
        'leftProjectList': function () {
            var len = this.leftCheckedProjectIdList.length;
            var total = this.leftProjectList.length;
            if (len <= 0) {
                this.leftHeaderTitle = total;
            }
            if (len > 0 && len < this.leftProjectList.length) {
                this.leftHeaderTitle = len + "/" + total;
            }
            if (len >= this.leftProjectList.length && len > 0) {
                this.leftHeaderTitle = len + "/" + total;
            }
        },
        'leftCheckedProjectIdList': function () {
            var len = this.leftCheckedProjectIdList.length;
            var total = this.leftProjectList.length;
            if (len <= 0) {
                //空状态
                $("#leftCheckAll").prop("checked", false);
                $("#leftCheckAll").prop("indeterminate", false);
                this.leftHeaderTitle = total;
            }
            if (len > 0 && len < this.leftProjectList.length) {
                //半选状态
                $("#leftCheckAll").prop("checked", false);
                $("#leftCheckAll").prop("indeterminate", true);
                this.leftHeaderTitle = len + "/" + total;
            }
            if (len >= this.leftProjectList.length && len > 0) {
                //全选选状态
                $("#leftCheckAll").prop("checked", true);
                $("#leftCheckAll").prop("indeterminate", false);
                this.leftHeaderTitle = len + "/" + total;
            }
        },
        'rightProjectList': function () {
            var len = this.rightCheckedProjectIdList.length;
            var total = this.rightProjectList.length;
            if (len <= 0) {
                this.rightHeaderTitle = total;
            }
            if (len > 0 && len < this.leftProjectList.length) {
                this.rightHeaderTitle = len + "/" + total;
            }
            if (len >= this.leftProjectList.length && len > 0) {
                this.rightHeaderTitle = len + "/" + total;
            }
        },
        'rightCheckedProjectIdList': function () {
            var len = this.rightCheckedProjectIdList.length;
            var total = this.rightProjectList.length;
            if (len <= 0) {
                //空状态
                $("#rightCheckAll").prop("checked", false);
                $("#rightCheckAll").prop("indeterminate", false);
                this.rightHeaderTitle = total;
            }
            if (len > 0 && len < this.rightProjectList.length) {
                //半选状态
                $("#rightCheckAll").prop("checked", false);
                $("#rightCheckAll").prop("indeterminate", true);
                this.rightHeaderTitle = len + "/" + total;
            }
            if (len >= this.rightProjectList.length && len > 0) {
                //全选选状态
                $("#rightCheckAll").prop("checked", true);
                $("#rightCheckAll").prop("indeterminate", false);
                this.rightHeaderTitle = len + "/" + total;
            }
        },
        'user.userId': function () {
            var _self = this;
            if (_self.user.userId) {
                disabledByDomId("userName");
                this.collapseTwoHref = 'tabs_panels.html#collapseTwo';
                this.collapseThreeHref = 'tabs_panels.html#collapseThree';
            }
        },
        'isLoadProject': function () {
            if (this.isLoadProject) {
                this.loadLoginUserProject();
            }
        }
    },
    mounted: function () {
        var _self = this;
        _self.initSysDoMainTree();
        if (uid != "" && uid != "") {
            _self.user_id = uid;
            _self.user.userId = uid;
            disabledByDomId("userName");
            _self.viewUser();
            $("#pageName").text("修改用户");
        } else {
            removeAttrByDomId("userName", "disabled")
            $("#pageName").text("添加用户");
        }

    },
    methods: {
        //左边全选
        clickLeftCheckAll: function () {
            var checked = $("#leftCheckAll").prop("checked");
            this.leftCheckedProjectIdList.splice(0, this.leftCheckedProjectIdList.length);
            if (checked) {
                for (var i = 0; i < this.leftProjectList.length; ++i) {
                    this.leftCheckedProjectIdList.push(this.leftProjectList[i].projectId);
                }
            }
        },
        //右边全选
        clickRightCheckAll: function () {
            var checked = $("#rightCheckAll").prop("checked");
            this.rightCheckedProjectIdList.splice(0, this.rightCheckedProjectIdList.length);
            if (checked) {
                for (var i = 0; i < this.rightProjectList.length; ++i) {
                    this.rightCheckedProjectIdList.push(this.rightProjectList[i].projectId);
                }
            }
        },
        //往右移动
        transferToRight: function () {
            //左边减少，右边增加
            var i = this.leftProjectList.length;
            while (i--) {
                var p = this.leftProjectList[i];
                if (this.leftCheckedProjectIdList.indexOf(p.projectId) > -1) {
                    var del = this.leftProjectList.splice(i, 1);
                    this.rightProjectList.push(del[0]);
                }
            }
            //清空左边选中
            this.leftCheckedProjectIdList.splice(0, this.leftCheckedProjectIdList.length);
        },
        //往左移动
        transferToLeft: function () {
            //右边减少，左边增加
            var i = this.rightProjectList.length;
            while (i--) {
                var p = this.rightProjectList[i];
                if (this.rightCheckedProjectIdList.indexOf(p.projectId) > -1) {
                    var del = this.rightProjectList.splice(i, 1);
                    this.leftProjectList.push(del[0]);
                }
            }
            //清空左边选中
            this.rightCheckedProjectIdList.splice(0, this.rightCheckedProjectIdList.length);
        },
        showTip: function (msg, id) {
            var layerobg = layer.tips(msg, '#' + id, {
                tips: 1,
                time: 0
            });
        },
        hideTip: function () {
            layer.closeAll();
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        //登录用户可分配项目
        loadLoginUserProject: function () {
            var _self = this;
            ajax_get(coreApiPath + "/sysproject/getStationProjectByLoginUser", {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.leftProjectList.splice(0, _self.leftProjectList.length);
                    _self.rightProjectList.splice(0, _self.rightProjectList.length);
                    for (var i = 0; i < data.result.length; ++i) {
                        var p = data.result[i];
                        if (_self.user.stationProjectIdList.indexOf(p.projectId) > -1) {
                            _self.rightProjectList.push(p);
                        } else {
                            _self.leftProjectList.push(p);
                        }
                    }
                    //初始多选栏表头
                    _self.leftHeaderTitle = _self.leftProjectList.length;
                    _self.rightHeaderTitle = _self.rightProjectList.length;
                }
            });
        },
        viewUser: function () {
            var _self = this;
            ajax_post_msg(coreApiPath + "/sysuser/detail/" + _self.user_id, {}, "加载", function (data) {
                if (data.erroCode == 2000) {
                    _self.user = data.result;
                    _self.domainList = data.result.domainDTOList;
                    _self.isLoadProject = true;
                }
            });
        },
        initSysDoMainTree: function () { //初始化区域信息
            var _self = this;
            var treeSet = _self.checkTreeSets(oncheck);

            function oncheck(e, treeId, treeNode) {
                var domainTree = $.fn.zTree.getZTreeObj(treeId);
                var nodes = domainTree.getCheckedNodes(true);
                _self.user.domainIdList = [];
                _self.domainList = [];
                if (nodes.length > 0) {
                    $.each(nodes, function (index, node) {
                        _self.domainList.push({
                            id: node.id,
                            domainName: node.name
                        });
                        _self.user.domainIdList.push(node.id)
                    });
                }
                if (_self.user.domainId != "" && _self.user.domainId != null) {
                    if (!_self.user.domainIdList.hasVal(_self.user.domainId)) {
                        _self.user.domainId = "";
                    }
                }
            }

            ajax_get(coreApiPath + "/domain/tree", {}, function (data) {
                destroyMyZTree("domainTree"); //清除之前的tree信息
                var doZTree = initMyZTree("domainTree", treeSet, data);
                chkYlZTreeByIdsAll(doZTree, _self.user.domainIdList);
            })
        }, //所属区域信息
        initOrgTree: function () { //所属组织
            var _self = this;
            var treeSet = {
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    // onCheck: clickTreeNode,
                    onCheck: onCheck
                },
                check: {
                    enable: true,
                    chkboxType: {
                        "Y": "",
                        "N": ""
                    },
                    chkStyle: "radio", //单选框
                    radioType: "all" //对所有节点设置单选
                }
            };

            function clickTreeNode(event, treeId, treeNode) {
                _self.user.orgName = treeNode.name;
                _self.user.orgId = treeNode.id;
                console.log("选择的所属组织信息:" + treeNode.id + ":" + treeNode.name)
            }

            function onCheck(event, treeId, treeNode) {
                if (_self.user.orgId != treeNode.id) {
                    _self.user.roleIdList = [];
                    _self.user.allRoleName = "";
                }
                _self.user.orgName = treeNode.name;
                _self.user.orgId = treeNode.id;
                console.log("选择的所属组织信息:" + treeNode.id + ":" + treeNode.name)
            }

            ajax_get(coreApiPath + "/sysorg/getOrgTreeHasPriv", {}, function (data) {
                var tree = initMyZTree("downDragtree", treeSet, data);
                chkYlZTreeByIdsAll(tree, _self.user.orgId.split(","));
            })
        }, //所属组织
        initRoleTree: function () { //获取组下的角色信息
            var _self = this;
            var treeSet = _self.checkTreeSets(onCheck);

            function onCheck(e, treeId, treeNode) {
                var item = getYlTreeCheckItems(treeId, treeNode)
                _self.user.allRoleName = item.names.join(",");
                _self.user.roleIdList = item.ids;
                console.log("所有角色信息:" + item.ids + "--" + item.names);
            }

            var orgId = _self.user.orgId;
            var url = coreApiPath + "/sysorg/getRolesByOrgId/" + orgId;
            ajax_get(url, {}, function (data) {
                var tree = initMyZTree("downDragtree", treeSet, data);
                chkYlZTreeByIdsAll(tree, _self.user.roleIdList);
            });
        }, //获取组下的角色信息
        initOrgListTree: function () { //系统管理权限
            var _self = this;
            var treeSet = _self.checkTreeSets(onCheck);

            function onCheck(e, treeId, treeNode) {
                var item = getYlTreeCheckItems(treeId, treeNode)
                _self.user.allOrgName = item.names.join(",");
                _self.user.orgIdList = item.ids;
                console.log("系统管理权限:" + item.ids + "--" + item.names);
            }

            ajax_get(coreApiPath + "/sysorg/getOrgTreeHasPriv", {}, function (data) {
                var tree = initMyZTree("downDragtree", treeSet, data);
                chkYlZTreeByIdsAll(tree, _self.user.orgIdList);
            })
        }, //系统管理权限
        initProjectTree: function () { //设备管理权限
            var _self = this;
            var treeSet = _self.checkTreeSets(onCheck);

            function onCheck(e, treeId, treeNode) {
                var item = getYlTreeCheckItems(treeId, treeNode)
                _self.user.allProjectName = item.names;
                _self.user.projectIdList = item.ids;
                console.log("设备管理权限:" + item.ids + "--" + item.names);
            }

            ajax_get(coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
                var doZTree = initMyZTree("downDragtree", treeSet, data);
                chkYlZTreeByIdsAll(doZTree, _self.user.projectIdList);
            })
        }, //设备管理权限
        checkTreeSets: function (callBack) { //带checkBox的ztree设置
            return {
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: callBack
                },
                check: {
                    enable: true,
                    chkboxType: {
                        "Y": "",
                        "N": ""
                    }
                }
            };
        },
        noCheckTreeSets: function (callBack) { //不带checkBox的ztree设置
            return {
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                check: {
                    enable: false
                },
                callback: {
                    onClick: callBack
                }
            }
        },
        initDownTree: function (flag, id) {
            var _self = this;
            if (flag == "1") { //所属组织
                _self.initOrgTree();
            } else if (flag == "2") { //组织下的角色
                if (_self.user.orgId == "") {
                    layer.msg("请选择所属组织信息！")
                    return false;
                }
                _self.initRoleTree();
            } else if (flag == "3") { //系统管理权限
                _self.initOrgListTree();
            } else if (flag == "4") {
                _self.initProjectTree();
            }
            _self.showMenu(id);
        },
        showMenu: function (id) {
            destroyMyZTree("downDragtree"); //清除之前的tree信息
            var obj = $("#" + id);
            var offset = obj.offset();
            $("#menuContent").css({
                left: offset.left + "px",
                top: offset.top + obj.outerHeight() + "px"
            }).slideDown("fast");
            $("body").bind("mousedown", onBodyDown);
        },
        backToUsers: function () {
            window.location.href = ctx + "/user/manager";
        },
        saveBase: function () {
            var _self = this;
            if (_self.validateUserFrm()) {
                var params = {
                    userId: _self.user.userId,
                    fullName: _self.user.fullName,
                    gender: _self.user.gender,
                    isBigScreen: _self.user.isBigScreen,
                    mobileno: _self.user.mobileno,
                    orgId: _self.user.orgId,
                    orgIdList: _self.user.orgIdList.length > 0 ? _self.user.orgIdList.join(",") : "",
                    projectIdList: _self.user.projectIdList.length > 0 ? _self.user.projectIdList.join(",") : "",
                    remark: _self.user.remark,
                    roleIdList: _self.user.roleIdList.length > 0 ? _self.user.roleIdList.join(",") : "",
                    userName: _self.user.userName,
                    workAddress: _self.user.workAddress,
                    workEmail: _self.user.workEmail
                };

                initLayerLoaderMsg('保存');
                $.ajax({
                    type: "post",
                    url: coreApiPath + '/sysuser/add',
                    dataType: "json",
                    data: JSON.stringify(params),
                    contentType: 'application/json; charset=UTF-8',
                    success: function (data) {
                        closeLayreLoader();
                        if (data.erroCode === 2000) {
                            var userId = data.result;
                            _self.user.userId = userId;
                            _self.isLoadProject = true;
                            layer.msg("保存成功！")
                            setTimeout(function () {
                                $("#sysDomainCollapse").click();
                            }, 1000)
                        } else if (data.erroCode === 2001) {
                            layer.msg(data.erroMsg);
                            _self.userNameError = data.erroMsg;
                            return false;
                        }
                    },
                    error: function (errorMsg) {
                        console.log("error:::::::::/sysuser/add");
                        console.log(errorMsg);
                        closeLayreLoader();
                    }
                });
            }

        },
        saveUserSysDoMain: function () {
            var _self = this;
            console.log(_self.user.domainIdList + "========" + _self.user.domainId)
            if (_self.user.domainIdList.length < 1) {
                layer.msg("请选择区域信息！")
                return false;
            }
            if (_self.user.domainId == "" || _self.user.domainId == null) {
                layer.msg("请选择默认区域信息！")
                return false;
            }
            var params = {
                "domainId": _self.user.domainId,
                "domainIdList": _self.user.domainIdList.length > 0 ? _self.user.domainIdList.join(",") : "",
                "userId": _self.user.userId
            }

            var contentType = 'application/json; charset=UTF-8';
            post_ajax(coreApiPath + '/sysuser/domain/add', JSON.stringify(params), "保存", contentType, function (data) {
                if (data.erroCode === 2000) {
                    $("#stationDomainCollapse").click();
                    layer.msg("保存成功！")
                } else if (data.erroCode === 2001) {
                    layer.msg(data.erroMsg);
                    _self.userNameError = data.erroMsg;
                    return false;
                }
            });

        },
        saveUserStationProject: function () {
            var _self = this;
            var idStr = "";
            if (this.rightProjectList.length > 0) {
                var idArray = [];
                $.each(this.rightProjectList, function (index, project) {
                    idArray.push(project.projectId);
                });
                idStr = idArray.join(",");
            }
            var params = {
                "stationProjectIdList": idStr,
                "userId": _self.user.userId
            }

            var contentType = 'application/json; charset=UTF-8';
            post_ajax(coreApiPath + '/sysuser/station/add', JSON.stringify(params), "保存", contentType, function (data) {
                if (data.erroCode === 2000) {
                    layer.msg("保存成功！")
                    window.location.href = ctx + "/user/manager";
                } else if (data.erroCode === 2001) {
                    layer.msg(data.erroMsg);
                    return false;
                }
            });

        },
        validateUserFrm: function () {
            var _self = this;
            if (_self.user.userName.trim() == "" || _self.user.userName == null) {
                _self.userNameError = "登录名不能为空！";
                return false;

            } else {
                var reg = /^[a-zA-Z0-9_]{0,}$/;
                if (!reg.test(_self.user.userName.trim())) {
                    _self.userNameError = "登录名不能有中文和特殊字符！";
                    return false;
                } else {
                    if (_self.user.userName.length > 20) {
                        _self.userNameError = "登录名不能超过20个字符！";
                        return false;
                    } else {

                        _self.userNameError = "";
                    }
                }
            }
            if (_self.user.fullName == "" || _self.user.fullName == null) {
                _self.fullNameError = "姓名不能为空！";
                return false;
            } else {
                if (_self.user.fullName.trim() == "") {
                    _self.fullNameError = "姓名不能只有空格！";
                }
                _self.fullNameError = "";
            }
            if (_self.user.mobileno == "" || _self.user.mobileno == null) {
                _self.mobilenoError = "手机号不能为空！";
                return false;
            } else {
                var reg = /^((1\d{2})+\d{8})$/;
                if (!reg.test(_self.user.mobileno)) {
                    _self.mobilenoError = "请输入有效的手机号码！";
                    return false;
                } else {
                    _self.mobilenoError = "";

                }
            }
            if (_self.user.workEmail.trim() == "" || _self.user.workEmail == null) {
                _self.workEmailError = "邮箱不能为空！";

                return false;
            } else {
                var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!regEmail.test(_self.user.workEmail)) {
                    _self.workEmailError = "邮箱格式不正确!";
                    return false;
                }
                _self.workEmailError = ""
            }
            if (_self.user.roleIdList == [] || _self.user.roleIdList == null || _self.user.roleIdList == "") {
                _self.roleError = "角色不能为空！";
                return false;
            } else {
                _self.roleError = "";
            }
            if (_self.user.orgId == "" || _self.user.orgId == null) {
                _self.orgError = "所属组织不能为空！";
                return false;
            } else {
                _self.orgError = "";
            }
            if (_self.user.workAddress && _self.user.workAddress.length > 50) {
                _self.workAddressError = "工作地址不能超过50个字符！！";
                return false;
            } else {
                _self.workAddressError = "";
            }
            if (_self.user.remark && _self.user.remark.length > 50) {
                _self.remarkError = "备注不能超过50个字符！！";
                return false;
            } else {
                _self.remarkError = "";
            }
            return true;
        },
        cleanError: function () {
            var _self = this;
            _self.userNameError = "";
            _self.mobilenoError = "";
            _self.fullNameError = "";
            _self.workEmailError = "";
            _self.orgError = "";
            _self.roleError = "";
            _self.workAddressError = "";
            _self.remarkError = "";
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        }
    }
})

Event.$on("selectedToIds", function (data) {
    userVM.selectedTo = data;
}.bind(this));

function showGroupMenu() {
    $(".roleMenuContent").css({}).slideDown("fast");
    $("body").bind("mousedown", onRoleBodyDown);
}

function onRoleBodyDown(event) {
    if (!(event.target.id == "roleMenuContent" || $(event.target).parents(".roleMenuContent").length > 0)) {
        hideRoleMenu();
    }
}

function hideRoleMenu() {
    $(".roleMenuContent").fadeOut("fast");
    $("body").unbind("mousedown", onRoleBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" ||
        $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}