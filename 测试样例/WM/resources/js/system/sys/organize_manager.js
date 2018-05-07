$("#pageName").html("组织管理");
var tableColumns = [
    {
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
        name: 'name',
        title: '名称',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow',
        callback: 'nameFmt'
    },
    {
        name: 'description',
        title: '描述',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'
    },
    {
        name: 'type',
        title: '类型',
        visible: true,
        callback: 'formatType',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'modifyByName',
        title: "修改者",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'modifyDtStr',
        title: '修改时间',
        titleClass: 'text-center',
        dataClass: 'text-center', width: '120px',
        callback: 'formatDate|yyyy-MM-dd HH:mm'
    }
]

Vue.use(Vuetable);
Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {
            "name": "",
            "parentId": ""
        },
        seaSysOrg: {
            name: "",
            parentId: "",
            parentName: ""
        },
        fields: tableColumns,
        tableHeight: 'auto',//设置表格可滚动的区域高度
        sortOrder: [{
            field: 'id',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        allFunctions: {},
        showEdit: false
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_103_01_02'] != undefined) {
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
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        'paginationComponent': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        }
    },
    methods: {
        addSysOrg: function () {
            window.location.href = ctx + "/sys/organize/add?pid=" + this.seaSysOrg.parentId + "&pname=" + encodeURIComponent(this.seaSysOrg.parentName);
        },
        transform: function (response) {
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

            transformed.data = []
            response = response.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].id,
                    name: response[i].name,
                    // name: "<a href='" + ctx + "/sys/organize/add?orgId=" + response[i].id + "'>" + response[i].name + "</a>",
                    description: response[i].description,
                    type: response[i].type,
                    modifyByName: response[i].modifyByName,
                    modifyDtStr: response[i].modifyDtStr
                })
            }
            return transformed
        },
        nameFmt: function (val, row) {
            var _self = this;
            if (val == "" || val == null) {
                return "";
            } else {
                if (_self.showEdit) {
                    return "<a href='" + ctx + "/sys/organize/add?orgId=" + row.id + "'>" + row.name + "</a>"
                } else {
                    return val;
                }
            }
        },
        formatType: function (value) {
            var types = {
                "1": "政府",
                "2": "企业",
                "3": "机构",
                "4": "其他"
            };
            return types[value + ""];
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        showLoader: function () {
            initLayerLoader();
            this.loading = 'loading';
        },
        hideLoader: function () {
            this.loading = '';
            closeLayreLoader();
        },
        onCellClicked: function (data, field, event) {
            console.log('cellClicked', field.name)
            if (field.name !== '__actions') {
                this.$refs.vuetable.toggleDetailRow(data.id)
            }
        },
        onCellDoubleClicked: function (data, field, event) {
            console.log('cellDoubleClicked:', field.name)
        },
        onLoadSuccess: function (response) {

            this.$refs.paginationInfo.setPaginationData(response.data);
            var data = response.data.data
            if (this.searchFor !== '') {

            }
        },
        onLoadError: function (response) {
            if (response.status == 400) {
                console.log('error:::::::' + response.data.message)
            }
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        onInitialized: function (fields) {
            this.vuetableFields = fields
        },
        onDataReset: function () {
            this.$refs.paginationInfo.resetData()
            this.$refs.pagination.resetData()
        },
        showAllSysOrgs: function () {//查看所有组织信息
            var treeObj = $.fn.zTree.getZTreeObj("user_project_tree");
            treeObj.cancelSelectedNode();
            var _self = this;
            _self.seaSysOrg.parentId = "";
            _self.seaSysOrg.parentName = "";
            /*
             _self.seaSysOrg = {
             name: "",
             parentId: "",
             parentName: "",
             };//*/
            _self.sysOrgSearch();
        },
        sysOrgSearch: function () {//组织查询
            var _self = this;
            _self.moreParams = {
                "name": _self.seaSysOrg.name,
                "parentId": _self.seaSysOrg.parentId
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable._data.selectedTo = [];
                _self.$refs.vuetable.refresh()
            });
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
                    return {'color': '#d7d7d7'};
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
                _self.seaSysOrg.parentId = orgId;
                _self.seaSysOrg.parentName = treeNode.name;

                _self.sysOrgSearch();
            }

            ajax_get($.backendApiPath + "/sysorg/getOrgTreeHasPriv", {}, function (data) {
                if(2000 == data.erroCode){
                    $.fn.zTree.init($("#user_project_tree"), setting, data.result);
                }
            });

            $(window).resize(function () {
                $("a.calcNodeWidth", $("#user_project_tree")).each(function () {
                    calcNodeWidth($(this));
                })
            });

        },//初始化 组织树
        deleteOrgs: function () {//通过 orgIds 删除 组织
            var _self = this;
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length < 1) {
                layer.msg("请选择要删除的组织");
                return false;
            }

            layer.confirm("确定删除选中的组织吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    //var orgIds = selectTo.join(",");
                    ajax($.backendApiPath + '/sysorg/deleteOrgs', {
                        "ids[]": selectTo
                    }, function (data) {
                        if (data.erroCode == 2000) {
                            layer.msg(data.erroMsg ? data.erroMsg : "删除成功！");

                            var treeObj = $.fn.zTree.getZTreeObj("user_project_tree");
                            $.each(selectTo, function (i, v) {
                                var nodes = treeObj.getNodesByParam("id", v);
                                if (nodes && nodes.length > 0)
                                    treeObj.removeNode(nodes[0]);
                            });

                            _self.$nextTick(function () {
                                _self.$refs.vuetable._data.selectedTo = [];
                                _self.$refs.vuetable.refresh()
                            });
                        } else {
                            //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                            layer.msg(data.erroMsg ? data.erroMsg : "删除失败！");
                            return false;
                        }
                    })

                }
            });

        },
        onCellMouseEnter: function (data, field, event) {
            if (field.name == "name" || field.name == "description") {
                if (data[field.name] != "" && data[field.name] != null
                    && event.srcElement.clientWidth < event.srcElement.scrollWidth) {
                    var val = data[field.name];
                    layer.tips(val, event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }
        },
        onCellMouseLeave: function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        }
    },
    mounted: function () {
        this.initUserOrgTree();
    }

});

