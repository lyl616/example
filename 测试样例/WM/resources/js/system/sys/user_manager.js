var E_SERVER_ERROR = 'Error communicating with the server'

var tableColumns = [{
    name: '__checkbox:id',
    width: '30px',
    title: 'checkbox',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: '__sequence',
    width: '45px',
    title: '序号',
    titleClass: 'text-center',
    dataClass: 'text-center'
},
    {
        name: 'fullName',
        title: '姓名',
        callback: "fullNameFmt",
        titleClass: 'text-center ',
        dataClass: 'text-center tovf'
    },
    {
        name: 'userName',
        title: '登录名',
        titleClass: 'text-center ',
        dataClass: 'text-center tovf'
    },
    {
        name: 'mobileno',
        title: ' 手机号',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {

        name: 'status',
        width: '80px',
        title: "状态",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'lastLoginTime',
        title: "上次登录时间",
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'formatDate|yyyy-MM-dd HH:mm:ss'
    }, {
        name: 'roles',
        title: "角色",
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'

    }, {
        name: 'modifyBy',
        title: "修改者",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'modifyDt',
        title: '修改时间',
        callback: 'formatDate|yyyy-MM-dd HH:mm:ss',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
]

Vue.use(Vuetable);
var userWM = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {},
        fields: tableColumns,
        tableHeight: 'auto',
        vuetableFields: false,
        sortOrder: [{
            field: 'id',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        fillForm2: "userFrm",
        seaUser: {
            fullName: "",
            userName: "",
            orgId: "",
            roleId: ""
        },
        roleList: [],
        allFunctions: {},
        showEdit: false
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_103_02_03'] != undefined) {
                    _self.showEdit = true;
                } else {
                    _self.showEdit = false;
                }
            } else {
                _self.allFunctions = {};
                _self.showEdit = false;
            }
        });
    },
    watch: {
        'perPage': function (val, oldVal) {
            var _self = this;
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            })
            _self.$refs.vuetable._data.selectedTo = [];
        },
        'paginationComponent': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        }
    },
    mounted: function () {
        var _self = this;
        _self.initUserOrgTree();
    },
    methods: {
        userFrm: function (response) {
            var transformed = {}
            var page = response.pagination;
            transformed.pagination = {
                total: page.total,
                per_page: page.per_page,
                current_page: page.current_page,
                last_page: page.last_page,
                next_page_url: page.next_page_url,
                prev_page_url: page.prev_page_url,
                from: page.from,
                to: page.to
            }

            transformed.data = []
            response = response.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].id,
                    userName: response[i].userName,
                    fullName: response[i].id + "|" + response[i].fullName,
                    workEmail: response[i].workEmail,
                    lastLoginTime: response[i].lastLoginTime,
                    mobileno: response[i].mobileno,
                    roles: response[i].roles,
                    status: response[i].status,
                    accessToken: response[i].accessToken,
                    modifyBy: response[i].modifyBy,
                    modifyDt: response[i].modifyDt
                })
            }

            return transformed
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        onCellMouseEnter: function (data, field, event) {
            if (field.dataClass.indexOf("text-overflow") != -1) {
                if (data[field.name] != "" && data[field.name] != null && data[field.name].length > 10) {
                    layer.tips(data[field.name], event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }

            if (field.dataClass.indexOf("tovf") != -1) {
                if (data[field.name] != "" && data[field.name] != null) {

                    var show_msg = data[field.name];
                    if (field.name == "fullName") {
                        show_msg = show_msg.split("|")[1];
                    }
                    if (show_msg.length > 10) {
                        layer.tips(show_msg, event.srcElement, {
                            tips: 1,
                            time: 0
                        });
                    }
                }
            }
        },
        onCellMouseLeave: function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        onLoadSuccess: function (response) {
            this.$refs.paginationInfo.setPaginationData(response.data)
        },
        onLoadError: function (response) {
            console.log("onLoadError:::::::" + response.data.message)
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page);
            this.$refs.vuetable._data.selectedTo = [];
        },
        showAllUsers: function () { //查看所有用户信息
            var _self = this;
            _self.seaUser = {
                fullName: "",
                userName: "",
                orgId: "",
                roleId: ""
            };
            refreshZTree("user_org_tree");
            _self.userSearch();
        },
        userSearch: function () { //用户查询
            var _self = this;
            _self.moreParams = _self.seaUser;
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            });
        },
        noCheckTreeSets: function (callBack) { //不带checkBox的ztree设置
            function getTreeNodeStyle(treeId, treeNode) {
                if (treeNode.attr && treeNode.attr.length > 0 &&
                    treeNode.attr[0] == 'N') { //无权限节点置灰
                    return {
                        'color': '#d7d7d7'
                    };
                }
            }

            function treeBeforeClk(treeId, treeNode, clickFlag) {
                if (treeNode.attr && treeNode.attr.length > 0 &&
                    treeNode.attr[0] == 'N') { //无权限节点不允许点击
                    return false;
                }
                return true;
            }

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
                    onClick: callBack,
                    beforeClick: treeBeforeClk
                },
                view: {
                    fontCss: getTreeNodeStyle
                }
            }

        },
        initUserOrgTree: function () {

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
                    fontCss: getTreeNodeStyle,
                    addDiyDom: customizeNodeTextView
                }
            };

            function customizeNodeTextView(treeId, treeNode) {
                var aObj = $("#" + treeNode.tId + "_a");
                aObj.addClass('calcNodeWidth');
                calcNodeWidth(aObj);
            }

            function calcNodeWidth(aObj) {
                var nodeText = aObj.prop('title');
                var width = aObj.parent().width() - aObj.prev().width() - aObj.children("span:first").width() - 5;
                if (aObj.width() > width) {
                    aObj.children("span.node_name").html("<div style='display:inline-block;white-space:nowrap;" +
                        "text-overflow:ellipsis;overflow:hidden;width:" + width + "px' title='" + nodeText + "'>" + nodeText + "</div>");
                }
                else {
                    aObj.children("span.node_name").text(nodeText);
                }
            }

            function getTreeNodeStyle(treeId, treeNode) {
                if (treeNode.attr && treeNode.attr.length > 0 &&
                    treeNode.attr[0] == 'N') {//无权限节点置灰
                    return {
                        'color': '#d7d7d7'
                    };
                }
            }

            function treeBeforeClk(treeId, treeNode, clickFlag) {
                if (treeNode.attr && treeNode.attr.length > 0 &&
                    treeNode.attr[0] == 'N') {//无权限节点不允许点击
                    return false;
                }
                return true;
            }

            function treeClk(event, treeId, treeNode) {
                var orgId = treeNode.id;
                _self.seaUser.orgId = orgId;
                _self.initUserRole(orgId);
                _self.userSearch();
            }

            ajax_get(coreApiPath + "/sysorg/getOrgTreeHasPriv", {}, function (data) {
                initMyZTree("user_org_tree", setting, data);
            });

        },
        initUserRole: function (orgId) {
            var _self = this;
            ajax_get(coreApiPath + "/sysorg/getRolesByOrgId/" + orgId, {}, function (data) {
                _self.roleList = [];
                _self.seaUser.roleId = "";
                if (data.length > 0) {
                    _self.roleList = data;
                }
            });
        }, //初始化 用户组织树
        deleteUserByIds: function () { //通过 userIds 删除 用户
            var _self = this;
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length < 1) {
                layer.msg("请选择要删除的用户");
                return false;
            }

            var params = {
                "userIds": selectTo.join(",")
            };
            layer.confirm("确定删除选中的用户吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var userIds = selectTo.join(",");
                    var params = {
                        userIds: userIds
                    };
                    $.ajax({
                        type: "post",
                        url: coreApiPath + '/sysuser/delete',
                        dataType: "json",
                        data: params,
                        contentType: 'application/x-www-form-urlencoded',
                        success: function (data) {
                            if (data.erroCode === 2000) {
                                layer.msg("删除成功！");
                                _self.userTableRefrsh();
                            } else {
                                //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                layer.msg("删除失败！");
                                return false;
                            }
                        },
                        error: function (errorMsg) {
                            console.log("error:::::::::/sysuser/delete");
                            console.log(errorMsg);
                        }
                    });

                }
            });

        },
        updUserPwd: function () { //密码重置 用户
            var _self = this;
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length < 1) {
                layer.msg("请选择要重置密码的用户");
                return false;
            } else if (selectTo.length > 1) {
                layer.msg("只能选择一个要重置密码的用户");
                return false;
            }

            resetId = selectTo[0];
            layer.open({
                type: 1,
                title: '密码重置',
                closeBtn: false,
                id: 'resetPwdModal2',
                // skin: 'layui-layer-rim', //加上边框
                area: ['400px', '180px'], //宽高
                content: $('#resetPwdModal')
            });

        },
        addUser: function () {
            window.location.href = ctx + "/user/manager/add?id=";
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        fullNameFmt: function (value) {
            if (value == null || value.length == "") {
                return "";
            } else {
                var data = value.split("|");
                if (this.showEdit)
                    return '<a href="' + ctx + '/user/manager/add?id=' + data[0] + '">' + data[1] + '</a>';
                else
                    return data[1];

            }
        },
        userTableRefrsh: function () {//用户表格刷新
            var _self = this;
            _self.$refs.vuetable._data.selectedTo = [];
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            });
        }

    }
})

var resetId = null;

function resetPwd() {
    var reset_pwd_new = $("#reset_pwd_new").val();
    var reset_pwd_confirm = $("#reset_pwd_confirm").val();
    if (reset_pwd_new == null || reset_pwd_new == "" || reset_pwd_confirm == null || reset_pwd_confirm == "") {
        layer.msg("新密码或者确认密码不能为空！");
        return false;
    } else {
        if (reset_pwd_new != reset_pwd_confirm) {
            layer.msg("新密码与确认密码不一致，请确认！");
            return false;
        }
    }
    var params = {userId: resetId, pwd: reset_pwd_new};
    var url = coreApiPath + '/sysuser/updatePwd';
    ajax_post_msg(url, params, "重置", function (data) {
        if (data.erroCode == 2000) {
            layer.msg("重置成功!")
            closeRetPwdModal();
            userWM.userTableRefrsh();
        }
    });


}

function closeRetPwdModal() {
    $("#reset_pwd_new").val("");
    $("#reset_pwd_confirm").val("");
    resetId = null;
    layer.closeAll();
    $('#resetPwdModal').hide();
}