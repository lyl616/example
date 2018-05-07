$("#pageName").html("角色管理");

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
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: "nameFmt"
    },
    {
        name: 'description',
        title: '描述',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'usedOrgNames',
        title: '使用中组织',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'
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
        dataClass: 'text-center',
        callback: 'formatDate|yyyy-MM-dd HH:mm',
        titleClass: 'text-center',
        dataClass: 'text-center'
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
            "name": ""
        },
        seaSysRole: {
            name: ""
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
        showEdit: false,
        viewPrivilege: false
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.backendApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_103_04_03'] != undefined) {
                    _self.showEdit = true;
                } else {
                    _self.showEdit = false;
                }
                //查看权限
                if (_self.allFunctions.hasOwnProperty('ROLE_FUN_103_04_04')) {
                    _self.viewPrivilege = true;
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
        addSysRole: function () {
            window.location.href = ctx + "/role/manager/modify";
        },
        transform: function (data) {
            var transformed = {}
            transformed.pagination = {
                total: data.pagination.total,
                per_page: data.pagination.per_page,
                current_page: data.pagination.current_page,
                last_page: data.pagination.last_page,
                next_page_url: data.pagination.next_page_url,
                prev_page_url: data.pagination.prev_page_url,
                from: data.pagination.from,
                to: data.pagination.to
            }

            transformed.data = []
            data = data.data
            for (var i = 0; i < data.length; i++) {
                var usedOrgNms = data[i].usedOrgNames;
                transformed['data'].push({
                    id: data[i].id,
                    // name: "<a href='" + ctx + "/role/manager/modify?roleId=" + data[i].id + "'>" + data[i].name + "</a>",
                    name: data[i].name,
                    description: data[i].description,
                    usedOrgNames: usedOrgNms,
                    modifyByName: data[i].modifyByName,
                    modifyDtStr: data[i].modifyDtStr
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
                    return "<a href='" + ctx + "/role/manager/modify?roleId=" + row.id + "'>" + row.name + "</a>";
                }
                if (_self.viewPrivilege) {
                    return "<a href='" + ctx + "/role/manager/modify?type=1&roleId=" + row.id + "'>" + row.name + "</a>";
                }
                return val;
            }
        },
        formatDate(value, fmt) {
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
        setFilter: function () {
            this.moreParams = {
                'filter': this.searchFor
            }
            this.$nextTick(function () {
                this.$refs.vuetable.refresh();
            })
        },
        resetFilter: function () {
            this.searchFor = ''
            this.setFilter()
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
            console.log(response.data.message)
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
        sysRoleSearch: function () {//角色查询
            var _self = this;
            _self.moreParams = _self.seaSysRole;
            _self.$nextTick(function () {
                _self.$refs.vuetable._data.selectedTo = [];
                _self.$refs.vuetable.refresh();
            });
        },
        deleteRoles: function () {//通过 Ids 角色 组织
            var _self = this;
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length < 1) {
                layer.msg("请选择要删除的角色");
                return false;
            }

            layer.confirm("确定删除选中的角色吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    ajax($.backendApiPath + '/role/deleteRoles', {
                        "roleIds[]": selectTo
                    }, function (data) {
                        if (data.erroCode == 2000) {
                            layer.msg(data.erroMsg ? data.erroMsg : "删除成功！");

                            _self.$nextTick(function () {
                                _self.$refs.vuetable._data.selectedTo = [];
                                _self.$refs.vuetable.refresh();
                            });
                        } else {
                            layer.msg(data.erroMsg ? data.erroMsg : "删除失败！");
                            return false;
                        }
                    })

                }
            });

        },
        onCellMouseEnter(data, field, event) {
            if (field.name == "usedOrgNames") {
                if (data[field.name] != "" && data[field.name] != null) {
                    layer.tips(data[field.name], event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }
        },
        onCellMouseLeave(data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
    },
    mounted: function () {
    }

});

