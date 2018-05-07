var E_SERVER_ERROR = '与服务器通信错误';
Vue.component('pagination', {
    template: '<div class="m-l-10 m-r-10">' +
    ' <label>每页</label>' +
    ' <select class="" v-model="$parent.perPage">' +
    '   <option v-for="option in $parent.pageList" v-bind:value="option">{{ option }}</option>' +
    ' </select>' +
    '<label class="m-r-5">条记录</label>' +
    '</div>',
    props: ['vuetableFields']
})

var tableColumns = [{
    name: '__checkbox:id',
    width: '20px',
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
        title: '名称',
        width: '150px',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow',
        callback: 'addprojLink'
    },
    {
        name: 'description',
        title: '描述',
        width: '150px',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'
    },
    {
        name: 'modifyByName',
        title: '修改者',
        width: '100px',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {

        name: 'modifyDtStr',
        title: "修改时间",
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px'
    }
];
Vue.use(Vuetable);
Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {
            "name": "", //搜索框字段值
            "orgId": "" //组织id
        },
        orgName: "", //组织名称
        selectedTo: [],
        fields: tableColumns,
        tableHeight: 'auto',
        sortOrder: [{
            field: 'id',
            direction: 'asc',
        }],
        searchNm: '',
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        allFunctions: {},
        showEdit: false
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.backendApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_103_03_03'] != undefined) {
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
    mounted: function () {
        this.initTree();
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
        addprojLink: function (val) {
            if (val == null || val == "") {
                return "";
            }
            var arr = val.split("|");
            var params = 'id=' + arr[0];
            if (this.showEdit) {
                return '<a href="' + ctx + '/sys/project/view?fg=m&' + params + '">' + arr[1] + '</a>';
            } else {
                return arr[1];
            }
        },
        initTree: function () {
            var url = $.backendApiPath + "/sysorg/getOrgTreeHasPriv";
            $.ajax({
                type: "get",
                url: url,
                async: true,
                success: function (data) {
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
                            onClick: zTreeOnClick,
                            beforeClick: treeBeforeClk
                        },
                        view: {
                            fontCss: getTreeNodeStyle,
                            addDiyDom: customizeNodeTextView
                        }
                    };
                    $.fn.zTree.init($("#user_project_tree"), setting, zNodes);
                }
            });

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
                    treeNode.attr[0] == 'N') { //无权限节点置灰
                    return {
                        'color': '#d7d7d7'
                    };
                }
            }

            function treeBeforeClk(treeId, treeNode, clickFlag) {
                console.log("异步加载");
                if (treeNode.attr && treeNode.attr.length > 0 &&
                    treeNode.attr[0] == 'N') { //无权限节点不允许点击
                    return false;
                }
                return true;
            }

            $(window).resize(function () {
                $("a.calcNodeWidth", $("#user_project_tree")).each(function () {
                    calcNodeWidth($(this));
                })
            });
        },
        showModel: function () {
            $('#myModal').modal('show');
        },
        transform: function (response) { //分页设置
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
            response = response.data;
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].id,
                    name: response[i].id + "|" + response[i].name,
                    description: response[i].description,
                    modifyByName: response[i].modifyByName,
                    modifyDtStr: response[i].modifyDtStr
                })
            }
            return transformed
        },
        addPject: function () {
            window.location.href = ctx + "/sys/project/view?fg=n&orgid=" + this.moreParams.orgId + "&orgname=" + escape(this.orgName);
        },
        search: function () {
            this.moreParams.name = this.searchNm;
            this.vuetableRefresh();
        },
        vuetableRefresh: function () {
            this.$nextTick(function () {
                this.$refs.vuetable._data.selectedTo = [];
                this.$refs.vuetable.refresh()
            });
        },
        showAllorg: function () {
            this.moreParams.orgId = '';
            this.orgName = '';
            this.search();
            //取消当前所有被选中节点的选中状态
            var treeObj = $.fn.zTree.getZTreeObj("user_project_tree");
            treeObj.cancelSelectedNode();
        },
        delPject: function () {
            var that = this;
            var selectTo = this.$refs.vuetable._data.selectedTo;

            if (selectTo.length < 1) {
                layer.msg("请选择要删除的项目");
                return false;
            }
            layer.confirm("您确定要删除当前信息吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var param = {
                        'ids[]': selectTo
                    };
                    var url = $.backendApiPath + "/sysproject/deleteProjects";
                    $.ajax({
                        type: 'post',
                        url: url,
                        data: param,
                        dataType: "json",
                        success: function (data) {
                            if (data.erroCode == 2000) {
                                layer.msg(data.erroMsg ? data.erroMsg : "删除成功！");
                                that.$nextTick(function () {
                                    that.$refs.vuetable._data.selectedTo = [];
                                    that.$refs.vuetable.refresh();
                                });
                            } else {
                                //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                layer.msg(data.erroMsg ? data.erroMsg : "删除失败！");
                                return false;
                            }
                        }
                    });

                }
            });

        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        onLoadSuccess: function (response) {
            this.$refs.paginationInfo.setPaginationData(response.data);
            var data = response.data.data
            if (this.searchFor !== '') {

            }
        },
        onLoadError: function (response) {
            console.log(response.data.message)
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        onCellMouseEnter: function (data, field, event) {
            if (field.name == "name" || field.name == "description") {
                if (data[field.name] != "" && data[field.name] != null
                    && event.srcElement.clientWidth < event.srcElement.scrollWidth) {
                    var val = data[field.name];
                    if (field.name == "name" && val && val.indexOf('|') >= 0) {
                        val = val.substring(val.indexOf('|') + 1);
                    }
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
})

function zTreeOnClick(event, treeId, treeNode) {
    vm.moreParams.orgId = treeNode.id;
    vm.orgName = treeNode.name;
    vm.vuetableRefresh();
}