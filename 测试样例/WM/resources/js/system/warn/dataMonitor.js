var curr_city = parent.cityId,
    curr_city_name = parent.cityName;

var real_tableColumns = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '45px'
    }, {
        name: 'equipmentId',
        title: '设备编号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px'
    }, {
        name: 'stationName',
        title: '监测点',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px'
    }, {
        name: 'exceptionType',
        title: '异常类型',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px',
        callback: "formatExceptionType"
    }, {
        name: 'occurTime',
        title: '发生时间',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px',
        callback: 'formatDate|yyyy-MM-dd HH:mm'
    }, {
        name: 'totalTime',
        title: '持续时长',
        titleClass: 'text-center',
        dataClass: 'totalTimeCss',
        width: '150px',
        callback: "formatTotalTime"
    }, {
        name: 'totalCount',
        title: '异常次数',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '90px'
    }, {
        name: 'districtName',
        title: '地区',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px'
    }, {
        name: 'stationAddr',
        title: '地址',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];

var tabHead = new Vue({
    el: '#tab-head',
    data: {
        tabRealTime: false,
        tabHis: false
    },
    beforeCreate: function () {
        //所有权限
        var _self = this;
        CommonUtil.getFunctionRole(function (data) {
            _self.tabRealTime = data.result.hasOwnProperty('ROLE_FUN_101_03_01');
            _self.tabHis = data.result.hasOwnProperty('ROLE_FUN_101_03_02');
            if (!_self.tabHis) {
                $('#tab-historyLog').remove();
            }
            if (!_self.tabRealTime) {
                $('#tab-realtimeMonitor').remove();
                $('#tab-historyLog').addClass('active');
            }
            if (_self.tabHis && !_self.tabRealTime) {
                tohistorySearch();
            }
        });
    }
});

Vue.use(Vuetable);
Vue.config.debug = false;
Vue.config.productionTip = false;

function realTimeSearch() {
    rtMonitor.realtimeExceptionSearch();
}

var rtMonitor = new Vue({
    el: "#tab-realtimeMonitor",
    data: {
        loading: '',
        equipmentId: "", //设备编号
        stationName: "", //站点名称
        exceptionType: "", //异常类型
        currentTimeLabel: "", //当前时间
        exceptionTypeList: [],//异常类型列表
        moreParams: {
            "city": curr_city,//城市
            "equipmentId": "",
            "stationName": "",
            "exceptionType": ""
        },
        realtime_fields: real_tableColumns,
        tableHeight: 'auto',//设置表格可滚动的区域高度
        sortOrder: [{
            field: 'id',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        loadOnStart: true,
        allFunctions: {},
        showReal: false
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_101_03_01'] != undefined) {
                    _self.showReal = true;
                } else {
                    _self.showReal = false;
                }

            } else {
                _self.allFunctions = {};
                _self.showReal = false;
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
        initAllFunctions: function () {
            var _self = this;
            var url = $.coreApiPath + "/role/functionRole";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                } else {
                    _self.allFunctions = {};
                }
            });
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

            if (response.currentTime) {
                this.currentTimeLabel = "当前时间  " + this.formatDate(response.currentTime, "yyyy-MM-dd HH:mm");
            }
            else {
                this.currentTimeLable = "";
            }

            transformed.data = []
            response = response.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].id,
                    equipmentId: response[i].equipmentId,
                    stationName: response[i].stationName,
                    exceptionType: response[i].exceptionType,
                    occurTime: response[i].occurTime,
                    totalTime: response[i].totalTime,
                    totalCount: response[i].totalCount,
                    status: response[i].status,
                    districtName: response[i].districtName,
                    stationAddr: response[i].stationAddr
                })
            }
            return transformed
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        totalTimeCss: function (value, rowData, param) {
            if (rowData.status == 2) {
                return "text-center cell-bgf2775a";
            }
            return "text-center";
        },
        formatTotalTime: function (value, fmt) {
            var hour = Math.floor(value / 60);
            var minute = Math.round(value % 60)
            var day = Math.floor(hour / 24);
            hour = Math.round(hour % 24);
            value = minute + '分钟';
            if (hour > 0) {
                value = hour + '小时' + value;
            }
            if (day > 0) {
                value = day + '天' + value;
            }
            return value;
        },
        formatExceptionType: function (value, fmt) {
            var text = value;
            $.each(this.exceptionTypeList, function (i, k) {
                if (k.code == value) {
                    text = k.name;
                }
            });
            return text;
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
        realtimeExceptionSearch: function () {//组织查询
            var _self = this;
            _self.moreParams = {
                "city": curr_city,//城市
                "equipmentId": _self.equipmentId, //设备编号
                "stationName": _self.stationName, //站点名称
                "exceptionType": _self.exceptionType //异常类型
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable._data.selectedTo = [];
                _self.$refs.vuetable.refresh()
            });
        },
        initExceptionTypeList: function () {
            var _self = this;
            ajax_get(coreApiPath + "/dictionary/dictionaryType", {"type": 32}, function (data) {
                if (data != null && data.length > 0) {
                    $.each(data, function (i, e) {
                        _self.exceptionTypeList.push({
                            code: e.code,
                            name: e.name
                        });
                    });
                }
            });
        }
    },
    mounted: function () {
        this.initExceptionTypeList();
        //this.realtimeExceptionSearch();
    }

});

//////////////以下历史告警//////////////////

var history_tableColumns = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '45px'
    }, {
        name: 'equipmentId',
        title: '设备编号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px'
    }, {
        name: 'stationName',
        title: '监测点',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px'
    }, {
        name: 'exceptionType',
        title: '异常类型',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px',
        callback: "formatExceptionType"
    }, {
        name: 'occurTime',
        title: '发生时间',
        sortField: 'occur_time',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px',
        callback: 'formatDate|yyyy-MM-dd HH:mm'
    }, {
        name: 'recoveryTime',
        title: '结束时间',
        sortField: 'recovery_time',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '120px',
        callback: 'formatDate|yyyy-MM-dd HH:mm'
    }, {
        name: 'totalTime',
        title: '持续时长',
        sortField: 'total_time',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px',
        callback: "formatTotalTime"
    }, {
        name: 'totalCount',
        title: '异常次数',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '90px'
    }, {
        name: 'districtName',
        title: '地区',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px'
    }, {
        name: 'stationAddr',
        title: '地址',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];

var historyLog = new Vue({
    el: "#tab-historyLog",
    data: {
        loading: '',
        equipmentId: "", //设备编号
        stationName: "", //站点名称
        exceptionType: "", //异常类型
        currentTimeLabel: "", //当前时间
        start_occurTime: "", //发生时间-开始
        end_occurTime: "", //发生时间-结束
        exceptionTypeList: [],//异常类型列表
        moreParams: {
            "city": curr_city,//城市
            "equipmentId": "",
            "stationName": "",
            "exceptionType": "",
            "occurTimeStart": null,
            "occurTimeEnd": null
        },
        historyLog_fields: history_tableColumns,
        loadOnStart: false,
        inited: false,
        tableHeight: 'auto',//设置表格可滚动的区域高度
        sortOrder: [{
            field: 'recovery_time',
            direction: 'desc'
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        showHistory: false,
        allFunctions: {}
    },
    beforeCreate: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                if (_self.allFunctions['ROLE_FUN_101_03_02'] != undefined) {
                    _self.showHistory = true;
                } else {
                    _self.showHistory = false;
                }

            } else {
                _self.allFunctions = {};
                _self.showHistory = false;
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

            if (response.currentTime) {
                this.currentTimeLabel = "当前时间  " + this.formatDate(response.currentTime, "yyyy-MM-dd HH:mm");
            }
            else {
                this.currentTimeLable = "";
            }

            transformed.data = []
            response = response.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].id,
                    equipmentId: response[i].equipmentId,
                    stationName: response[i].stationName,
                    exceptionType: response[i].exceptionType,
                    occurTime: response[i].occurTime,
                    recoveryTime: response[i].recoveryTime,
                    totalTime: response[i].totalTime,
                    totalCount: response[i].totalCount,
                    districtName: response[i].districtName,
                    stationAddr: response[i].stationAddr
                })
            }
            return transformed
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        formatTotalTime: function (value, fmt) {
            var hour = Math.floor(value / 60);
            var minute = Math.round(value % 60)
            var day = Math.floor(hour / 24);
            hour = Math.round(hour % 24);
            value = minute + '分钟';
            if (hour > 0) {
                value = hour + '小时' + value;
            }
            if (day > 0) {
                value = day + '天' + value;
            }
            return value;
        },
        formatExceptionType: function (value, fmt) {
            var text = value;
            $.each(this.exceptionTypeList, function (i, k) {
                if (k.code == value) {
                    text = k.name;
                }
            });
            return text;
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

            this.$refs.paginationInfo.setPaginationData(response.pagination);
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
        historyLogSearch: function () {//组织查询
            var _self = this;
            _self.moreParams = {
                "city": curr_city,//城市
                "equipmentId": _self.equipmentId, //设备编号
                "stationName": _self.stationName, //站点名称
                "exceptionType": _self.exceptionType, //异常类型
                "occurTimeStart": _self.start_occurTime, //发生时间-开始
                "occurTimeEnd": _self.end_occurTime //发生时间-结束
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable._data.selectedTo = [];
                _self.$refs.vuetable.refresh()
            });
        },
        initExceptionTypeList: function () {
            var _self = this;
            ajax_get(coreApiPath + "/dictionary/dictionaryType", {"type": 32}, function (data) {
                if (data != null && data.length > 0) {
                    $.each(data, function (i, e) {
                        _self.exceptionTypeList.push({
                            code: e.code,
                            name: e.name
                        });
                    });
                }
            });
        },
        initialize: function () {
            var now = new Date();
            var initStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes(), 0);
            this.start_occurTime = initStart.Format("yyyy-MM-dd HH:mm:00");
            this.end_occurTime = now.Format("yyyy-MM-dd HH:mm:00");
            this.inited = true;
        }
    },
    mounted: function () {
        this.initExceptionTypeList();

    }

});

function showDatePicker(id) {
    WdatePicker.call(this, {
        dateFmt: 'yyyy-MM-dd HH:mm:00',
        maxDate: '%y-%M-%d',
        onpicked: function () {
            if ('start_occurTime' == id) {
                historyLog.start_occurTime = $dp.cal.getDateStr('yyyy-MM-dd HH:mm:00');
            }
            else {
                historyLog.end_occurTime = $dp.cal.getDateStr('yyyy-MM-dd HH:mm:00');
            }
        }
    });
}

function tohistorySearch() {
    if (!historyLog.inited) {
        historyLog.initialize();
        historyLog.historyLogSearch();
    }
}