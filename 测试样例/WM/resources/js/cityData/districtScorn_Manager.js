var E_SERVER_ERROR = 'Error communicating with the server'
var domainId = parent.cityId;
$(function () {
    initYear();
    initDistrinct();
    addSelect('year');
    addSelect('quarter');
    addSelect('month');
});

function initYear() {
    var year = new Date().getFullYear()
    var timeYear = $("#time-year");
    timeYear.empty();
    for (var i = 2015; i <= year + 5; i++) {
        //默认选中今年
        if (i == year) {
            timeYear.append("<option value='" + i + "' selected>" + i + "年" + "</option>");
        } else {
            timeYear.append("<option value='" + i + "'>" + i + "年" + "</option>");
        }
    }
}

function initDistrinct() {
    var optionDistrict = $("#district");
    optionDistrict.empty();
    ajax_get(coreApiPath + "/domain/child/" + domainId, {}, function (data) {
        if (data.erroCode = 2000) {
            $.each(data.result, function (index, val) {
                optionDistrict.append("<option value='" + val.id + "'>" + val.domainName + "</option>");
            });
            addSelect("district");
        }
    });
}

function addSelect(id) {
    $('#' + id).multiselect({
        buttonClass: 'btn btn-white', //显示按钮style
        selectAllText: "全选",
        includeSelectAllOption: true,
        selectedClass: 'multiselect-selected multiselect-checked', //选中项样式
        buttonWidth: 'auto',
        buttonText: function (options) {
            // var district = [];
            if (options.length === 0) {
                return '请选择<b class="caret"></b>';
            } else {
                var selected = '';
                if (options.length <= 4) {
                    options.each(function () {
                        selected += $(this).text() + '| ';
                    });
                    return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                } else {
                    return '已选中个数：' + options.length + ' <b class="caret"></b>';
                }
            }
        }
    });
}

Vue.config.productionTip = false;
var districtScornVM = new Vue({
    el: '#content',
    data: {
        moreParams: {
            detail: 0,
            domainId: domainId
        },
        allFunctions: {},
        tableScorn: {
            tableScornData: [], //站点统计，表格数据
            tableScornColumns: [
                {
                field: 'childDomainName',
                width: 120,
                columnAlign: 'center',
                isFrozen: true,
                isResize: true,
                formatter: function (rowData, index) {
                    return districtScornVM.allCap(rowData.childDomainName)
                }
            }, {
                field: 'timeInterval',
                width: 100,
                columnAlign: 'center',
                isFrozen: true,
                isResize: true
            }, {
                field: 'pm25',
                width: 120,
                columnAlign: 'center'

            }, {
                field: 'pm25Percent',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.pm25Percent)
                }
            }, {
                field: 'rankDay1',
                width: 120,
                columnAlign: 'center'
            }, {
                field: 'rankPercent1',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent1)
                }
            }, {
                field: 'rankDay2',
                width: 120,
                columnAlign: 'center'
            }, {
                field: 'rankPercent2',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent2)
                }
            }, {
                field: 'rankDay3',
                width: 120,
                columnAlign: 'center'
            }, {
                field: 'rankPercent3',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent3)
                }
            }, {
                field: 'rankDay4',
                width: 120,
                columnAlign: 'center'

            }, {
                field: 'rankPercent4',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent4)
                }
            }, {
                field: 'rankDay5',
                width: 120,
                columnAlign: 'center'
            }, {
                field: 'rankPercent5',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent5)
                }
            }, {
                field: 'rankDay6',
                width: 120,
                columnAlign: 'center'

            }, {
                field: 'rankPercent6',
                width: 120,
                columnAlign: 'right',
                formatter: function (rowData, index) {
                    return districtScornVM.showDetailRow(rowData.rankPercent6)
                }
            }],
            tableScornRows: [
                [{
                    fields: ['childDomainName'],
                    titleAlign: 'center',
                    title: '区县',
                    rowspan: 2
                }, {
                    fields: ['timeInterval'],
                    titleAlign: 'center',
                    title: '时段',
                    rowspan: 2

                }, {
                    fields: ['pm25', 'pm25Percent'],
                    title: 'PM2.5',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay1', 'rankPercent1'],
                    title: '优天数',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay2', 'rankPercent2'],
                    title: '良天数',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay3', 'rankPercent3'],
                    title: '轻度天数',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay4', 'rankPercent4'],
                    title: '中度天数',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay5', 'rankPercent5'],
                    title: '重度天数',
                    titleAlign: 'center',
                    colspan: 2
                }, {
                    fields: ['rankDay6', 'rankPercent6'],
                    title: '严重及以上天数',
                    titleAlign: 'center',
                    colspan: 2
                }],
                [{
                    fields: ['pm25'],
                    title: '浓度',
                    titleAlign: 'center'
                },
                    {
                        fields: ['pm25Percent'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay1'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent1'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay2'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent2'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay3'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent3'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay4'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent4'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay5'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent5'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankDay6'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['rankPercent6'],
                        title: '同比',
                        titleAlign: 'center'
                    }
                ],
            ]
        },
        pageIndex: 1, //当前页数
        pageSize: 10, //每页多少条
        total: 0, //总记录个数
    },
    watch: {},
    methods: {
        queryTableData: function () {
            var _self = this;
            var multiselectAll = "multiselect-all";
            var regExp = new RegExp(multiselectAll, "g");
            _self.moreParams.timeYear = $("#time-year option:selected").val();
            if( _self.moreParams.detail != 1){
                var childDomainId = $("#district").val().toString();
                if (childDomainId != "") {
                    if (childDomainId.indexOf(multiselectAll) != -1) {
                        _self.moreParams.childDomainIdList = childDomainId.replace(regExp, "").slice(1).split(',');
                    } else {
                        _self.moreParams.childDomainIdList = childDomainId.split(',');
                    }
                } else {
                    _self.moreParams.childDomainIdList = [];
                }
            }
            var year = $("#year").val().toString()
            var quarter = $("#quarter").val().toString()
            var month = $("#month").val().toString();
            if (year == "" && quarter == "" && month == "") {
                layer.msg('请选择时间类型（年、季度、月）！');
                return;
            }
            var yearQuarterMonth = "";
            if (year != "") {
                if (year.indexOf(multiselectAll) != -1) {
                    year = year.replace(regExp, "").slice(1);
                }
                yearQuarterMonth = year;
            }
            if (quarter != "") {
                if (quarter.indexOf(multiselectAll) != -1) {
                    quarter = quarter.replace(regExp, "").slice(1);
                }
                if (yearQuarterMonth != '') {
                    yearQuarterMonth += "," + quarter;
                } else {
                    yearQuarterMonth = quarter;
                }
            }
            if (month != "") {
                if (month.indexOf(multiselectAll) != -1) {
                    month = month.replace(regExp, "").slice(1);
                }
                if (yearQuarterMonth != '') {
                    yearQuarterMonth += "," + month;
                } else {
                    yearQuarterMonth = month;
                }
            }
            var timeIntervalList = yearQuarterMonth.split(',');
            _self.moreParams.timeIntervalList = timeIntervalList;
            _self.queryTble();
        },
        queryTble: function () {
            var _self = this;
            var postData = _self.moreParams;
            var url = $.coreApiPath + "/assessment/page";
            postData['page'] = _self.pageIndex;
            postData['perPage'] = _self.pageSize;
            post_ajax(url, JSON.stringify(postData), "加载", 'application/json; charset=UTF-8', function (r) {
                if (r.erroCode === 2000) {
                    var data = r.result.data;
                    var tableData = _self.assembleData(data, r.result.pagination).dataVal;
                    _self.tableScorn.tableScornData = tableData;
                } else {
                    _self.tableScorn.tableScornData == [];
                }
                if(_self.moreParams.detail == 1){
                    //目标详情
                    $("#btnSettingOrBack").text("返回");
                } else {
                    //目标设置
                    $("#btnSettingOrBack").text("目标设置");
                }
            });
        },
        assembleData: function (data, pagination) {
            var _self = this;
            var tablePagination = {
                total: pagination.total,
                per_page: pagination.per_page,
                current_page: pagination.current_page,
                last_page: Math.ceil(pagination.total / pagination.per_page),
                from: (pagination.current_page - 1) * pagination.per_page + 1,
                to: Math.min(pagination.current_page * pagination.per_page, pagination.total)
            };
            this.total = pagination.total;
            var fields = ['childDomainId', 'childDomainName', 'timeInterval', 'pm25', 'pm25Percent', 'rankDay1', 'rankPercent1',
                'rankDay2', 'rankPercent2', 'rankDay3', 'rankPercent3', 'rankDay4', 'rankPercent4', 'rankDay5', 'rankPercent5', 'rankDay6', 'rankPercent6'
            ];
            var tableData = [];
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var rowData = {};
                for (var j = 0; j < fields.length; j++) {
                    if (fields[j] != '') {
                        rowData[fields[j]] = row[fields[j]];
                    }
                }
                tableData.push(rowData);
            }
            return {
                'page': tablePagination,
                'dataVal': tableData
            }
        },
        pageChange: function (pageIndex) {
            this.pageIndex = pageIndex;
            this.queryTableData();
        },
        pageSizeChange: function (pageSize) {
            this.pageIndex = 1;
            this.pageSize = pageSize;
            this.queryTableData();
        },
        showDetailRow: function (value) {
            var html = '',
                colorSite = '',
                icon = '',
                percent = '';
            if (value == 0) {
                colorSite = 'green';
                percent = '%';
            } else if (value > 0) {
                colorSite = 'red';
                icon = '<b class="arrow-green-up"></b>';
                percent = '%';
            } else if (value < 0) {
                colorSite = 'green';
                value = Math.abs(value);
                icon = '<b class="arrow-red-dow"></b>';
                percent = '%';
            } else {
                value = '';
                icon = '<b/>';
            }
            colorSite = '';
            if (value == 0) {
                html += '<div style="color:' + colorSite + '; margin-right: 46px">' +
                    value + percent + icon +
                    '</div>';
            } else {
                html += '<div style="color:' + colorSite + '; margin-right: 30px">' +
                    value + percent + icon +
                    '</div>';
            }
            return html;
        },
        allCap: function (value) {
            var _self = this;
            if (_self.moreParams.detail != 1) {
                return '<button class="btn-link">' + value + '</button>';
            } else {
                return value;
            }
        },
        //详情
        onRowClick: function (rowIndex, rowData, column) {

            if (column.field != "childDomainName") {
                return;
            }

            var _self = this;
            var childDomainId = rowData["childDomainId"];
            //显示区县考核目标详情
            _self.moreParams.detail = 1;
            _self.pageIndex = 1;
            _self.pageSize = 100;
            var childDomainIdList = new Array();
            childDomainIdList[0] = childDomainId;
            _self.moreParams.childDomainIdList = childDomainIdList;
            _self.queryTableData();
        },
        districtScornSetting: function () {
            var _self = this;
            var btnText = $("#btnSettingOrBack").text();
            //区县目标设定
            if (btnText == "目标设置") {
                window.location.href = ctx + "/cityData/districtS_setting?timeYear=" + $("#time-year option:selected").val();
            } else {
                //显示区县考核目标
                _self.moreParams.detail = 0;
                _self.pageIndex = 1;
                _self.pageSize = 10;
                _self.queryTableData();
            }
        }, initAllFunctions: function () {
            var _self = this;
            var url = $.coreApiPath + "/role/functionRole";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                } else {
                    _self.allFunctions = {};
                }
            });
        }

    },
    mounted: function () {
        // this.queryTableData();
        var _self = this;
        _self.initAllFunctions();
    }
})