var parameterType = CommonUtil.getQueryParameter('type');
var startDate, endDate, searchState = 0;
if (parameterType) {
    startDate = '';
    endDate = '';
    if (parameterType == '2') {
        searchState = 1
    }
    if (parameterType == '3') {
        searchState = 2
    }
} else {
    endDate = new Date().Format("yyyy-MM-dd HH:mm:ss");
    startDate = dayDecreWithReg(endDate, 7, "yyyy-MM-dd HH:mm:ss");
}

var tableColumns = [
    {
        name: '__checkbox',
        width: '30px',
        titleClass: 'text-center',
        dataClass: 'text-center',
        title: 'checkbox'
    },
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '50px'
    },
    {
        name: 'jobCode',
        title: '任务单号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'jobCodeFmt'
    },
    {
        name: 'stationId',
        title: '监测点编号',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'
    },
    {
        name: 'insTime',
        title: '发布时间',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'publisher',
        title: '发布人',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'state',
        title: '完成状态',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'finishTime',
        title: '完成时间',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'feedbacker',
        title: '反馈人',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'surveyResult',
        title: '勘查结果描述',
        titleClass: 'text-center text-overflow',
        dataClass: 'text-center text-overflow'
    }
];
Vue.use(Vuetable);
var vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        fields: tableColumns,
        tableHeight: 'auto',
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        personType: 1,
        timeType: 1,
        person: '', //发布人或反馈人
        startTime: startDate,
        endTime: endDate,
        allFunctions: {},
        searchRequest: {
            "jobCode": "",
            "publisher": "",
            "insStartTime": startDate,
            "insEndTime": endDate,
            "state": searchState,
            "stationId": '',
            "feedbacker": '',
            "finishStartTime": "",
            "finishEndTime": ""
        }
    },
    watch: {
        'perPage': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        }
    },
    methods: {
        initAllFunctions: function () {
            var _self = this;
            var url = $.coreApiPath + "/role/functionRole";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                } else {
                    _self.allFunctions = {};
                }
                _self.surveyjobSearch();
            });
        },
        surveyjobSearch: function () {
            var _self = this;
            if (this.personType == 1) {
                this.searchRequest.publisher = this.person;
                this.searchRequest.feedbacker = '';
            }
            if (this.personType == 2) {
                this.searchRequest.publisher = '';
                this.searchRequest.feedbacker = this.person;
            }
            if (this.timeType == 1) {
                this.searchRequest.insStartTime = this.startTime;
                this.searchRequest.insEndTime = this.endTime;
                this.searchRequest.finishStartTime = '';
                this.searchRequest.finishEndTime = '';
            }
            if (this.timeType == 2) {
                this.searchRequest.insStartTime = '';
                this.searchRequest.insEndTime = '';
                this.searchRequest.finishStartTime = this.startTime;
                this.searchRequest.finishEndTime = this.endTime;
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            })
        },
        onCellMouseEnter: function (data, field, event) {
            if (field.dataClass.indexOf("text-overflow") != -1) {
                if (data[field.name] != "" && data[field.name] != null && data[field.name].length > 9) {
                    layer.tips(data[field.name], event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }
        },
        onCellMouseLeave: function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        onLoadSuccess: function (response) {
            this.$refs.vuetable._data.selectedTo = [];
        },
        onPaginationData: function (tablePagination) {
            this.$refs.pagination.setPaginationData(tablePagination);
            this.$refs.paginationInfo.setPaginationData(tablePagination);
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        jobCodeFmt: function (value) {
            if (this.allFunctions.hasOwnProperty('ROLE_FUN_006_02_05')) {
                return '<a href="' + ctx + '/surveyjob/add?editType=4&jobCode=' + value + '">' + value + '</a>'
            }
            return value;
        },
        addSurveyjob: function () { //新增
            window.location.href = ctx + "/surveyjob/add?editType=1";
        },
        modifySurveyjob: function () { //修改
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length != 1) {
                layer.msg("只可以选择一个进行修改", function () {
                });
                return false;
            }
            //发布人才可以修改
            var rowData = {};
            for (var i = 0; i < this.$refs.vuetable._data.tableData.length; ++i) {
                if (selectTo[0] == this.$refs.vuetable._data.tableData[i].jobCode) {
                    rowData = this.$refs.vuetable._data.tableData[i];
                    break;
                }
            }
            if (rowData.feedbackerId) {
                layer.msg("该任务已经反馈，不可再修改", function () {
                });
                return false;
            }
            if (parent.userId != rowData.publisherId) {
                layer.msg("只有发布人才可以修改", function () {
                });
                return false;
            }
            window.location.href = $.ctx + "/surveyjob/add?editType=2&jobCode=" + rowData.jobCode;
        },
        feedbackSurveyjob: function () { //反馈
            var selectTo = this.$refs.vuetable._data.selectedTo;
            if (selectTo.length != 1) {
                layer.msg("只可以选择一个反馈", function () {
                });
                return false;
            }
            //已经反馈过的，只有反馈人才能反馈
            // var rowData = {};
            // for (var i = 0; i < this.$refs.vuetable._data.tableData.length; ++i) {
            //     if (selectTo[0] == this.$refs.vuetable._data.tableData[i].jobCode) {
            //         rowData = this.$refs.vuetable._data.tableData[i];
            //         break;
            //     }
            // }
            // if (rowData.feedbackerId && parent.userId != rowData.feedbackerId) {
            //     layer.msg("该任务已经反馈，只有反馈人才能反馈", function () {
            //     });
            //     return false;
            // }
            window.location.href = $.ctx + "/surveyjob/add?editType=3&jobCode=" + selectTo[0];
        },
        deleteByIds: function () { //批量删除
            var _self = this;
            var selectTo = _self.$refs.vuetable._data.selectedTo;
            if (selectTo.length < 1) {
                layer.msg("请选择要删除的勘测任务！");
                return false;
            }
            //发布人才可以删除
            for (var k = 0; k < selectTo.length; k++) {
                var rowData = {};
                for (var i = 0; i < this.$refs.vuetable._data.tableData.length; ++i) {
                    if (selectTo[k] == this.$refs.vuetable._data.tableData[i].jobCode) {
                        rowData = this.$refs.vuetable._data.tableData[i];
                        break;
                    }
                }
                if (parent.userId != rowData.publisherId) {
                    layer.msg("只有发布人才可以删除", function () {
                    });
                    return false;
                }
            }

            var url = $.backendApiPath + '/surveyjob/delete';
            layer.confirm("确定删除选中的勘测任务吗吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var params = {
                        jobCodes: selectTo.join(",")
                    };
                    ajax_post_msg(url, params, "删除", function (data) {
                        if (data.erroCode === 2000) {
                            layer.msg("删除成功！");
                            _self.$nextTick(function () {
                                _self.$refs.vuetable.refresh()
                            });
                            _self.$refs.vuetable._data.selectedTo = [];
                        } else {
                            layer.msg("删除失败！");
                            return false;
                        }
                    })
                }
            });
        }
    },
    mounted: function () {
        var _self = this;
        _self.initAllFunctions();
    }
});