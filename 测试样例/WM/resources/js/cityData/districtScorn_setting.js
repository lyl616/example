var E_SERVER_ERROR = 'Error communicating with the server'

var dimainId = parent.cityId;
var timeYear;
var timeInterval;

var dataTable = {};

var curHandleCell = {
    clickedColumnName: '',//当前点击列名
    arrowUpFlag: 0, //点击改善恶化处理，1改善，-1恶化,0无变化
    rowKey: ''//当前处理单元格对应行数据的key
};

var selTimeInterval = "";
var totalDays = 366;

var yearArr = ["全年", "上半年", "下半年"];
var quarterArr = ["第一季度", "第二季度", "第三季度", "第四季度"];
var monthArr = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];


var cityId = parent.cityId;

$(function () {
    //初始化年份
    initYear();
    //初始化时间
    initTimeInterval();
});

function initYear() {

    var selectedYear = getQueryString("timeYear");
    var year = new Date().getFullYear();
    if (selectedYear == "") {
        selectedYear = year;
    }

    var wholeYear = $("#whole-year");
    wholeYear.empty();
    for (var i = 2015; i <= year + 5; i++) {
        //默认选中今年
        if (i == selectedYear) {
            wholeYear.append("<option value='" + i + "' selected>" + i + "年" + "</option>");
        } else {
            wholeYear.append("<option value='" + i + "'>" + i + "年" + "</option>");
        }
    }
}

function initTimeInterval() {
    $("#year-quarter-month").change(function () {
        var yearQuarterMonth = $("#year-quarter-month").val();
        var timeInterval = $("#time-interval");
        timeInterval.empty();
        timeInterval.append("<option value='-1' selected>请选择</option>");
        if (yearQuarterMonth == '年') {
            for (var index = 0; index < yearArr.length; index++) {
                timeInterval.append("<option value='" + yearArr[index] + "'>" + yearArr[index] + "</option>");
            }
        } else if (yearQuarterMonth == '季度') {
            for (var index = 0; index < quarterArr.length; index++) {
                timeInterval.append("<option value='" + quarterArr[index] + "'>" + quarterArr[index] + "</option>");
            }
        } else if (yearQuarterMonth == '月份') {
            for (var index = 0; index < monthArr.length; index++) {
                timeInterval.append("<option value='" + monthArr[index] + "'>" + monthArr[index] + "</option>");
            }
        }
    });
}


// Vue.use(Vuetable);
Vue.config.productionTip = false;
/* eslint-disable no-new */
var districtSettingVM = new Vue({
    el: '#content',
    data: {

        editList: [],
        moreParams: {},
        tableScorn: {
            tableScornData: [], //站点统计，表格数据
            tableScornColumns: [
                {
                    field: 'childDomainName',
                    width: 60,
                    columnAlign: 'center',
                    isFrozen: true,
                    isResize: true
                }, {
                    field: 'pm25',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPm25DataFormat(rowData.pm25);
                    }

                }, {
                    field: 'pm25Percent',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.pm25Percent);
                    }
                }, {
                    field: 'rankDay1',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay1);
                    }
                }, {
                    field: 'rankPercent1',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent1);
                    }
                }, {
                    field: 'rankDay2',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay2);
                    }
                }, {
                    field: 'rankPercent2',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent2)
                    }
                }, {
                    field: 'rankDay3',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay3);
                    }
                }, {
                    field: 'rankPercent3',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent3)
                    }
                }, {
                    field: 'rankDay4',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay4);
                    }

                }, {
                    field: 'rankPercent4',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent4)
                    }
                }, {
                    field: 'rankDay5',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay5);
                    }
                }, {
                    field: 'rankPercent5',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent5)
                    }
                }, {
                    field: 'rankDay6',
                    width: 120,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputDaysDataFormat(rowData.rankDay6);
                    }

                }, {
                    field: 'rankPercent6',
                    width: 120,
                    columnAlign: 'left',
                    formatter: function (rowData, index) {
                        return districtSettingVM.inputPercentFormat(rowData.rankPercent6)
                    }
                }],
            tableScornRows: [
                [{
                    fields: ['childDomainName'],
                    titleAlign: 'center',
                    title: '区县',
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
        moreParams: {},
        pageIndex: 1, //当前页数
        pageSize: 10, //每页多少条
        total: 0, //总记录个数
    },
    watch: {},
    methods: {
        //PM25浓度值处理
        inputPm25DataFormat: function (value) {
            var html = '';
            if (value == null) {
                value = "";
            }
            html += '<div>' +
                '<input type="text" class="no-borders bg_none w30 text-center" ' +
                'onkeyup="filterDigitalRangeLimit(this, 1, 1000)" maxlength="4" onblur="setDataOnblur(this, 1, 1000)" value="' + value + '" />' +
                '</div>';
            return html;
        },

        inputDaysDataFormat: function (value) {
            var html = '';
            if (value == null) {
                value = "";
            }
            html += '<div>' +
                '<input type="text" class="no-borders bg_none w30 text-center" ' +
                'onkeyup="filterDigitalRangeLimit(this, 0, 366)" maxlength="3" onblur="setDataOnblur(this, 0, 366)" value="' + value + '" />' +
                '</div>';
            return html;
        },

        //百分比箭头默认向下（优良）
        inputPercentFormat: function (value) {
            var html = '',
                icon = '',
                percent = '';
            if (value == 0) {
                icon = '<b/>';
                percent = '%';
            } else if (value > 0) {
                icon = '<b class="better-green cursor-p" onclick="switchArrowDirection(this)"></b>';
                percent = '%';
            } else if (value < 0) {
                value = Math.abs(value);
                icon = '<b class="worse-red cursor-p" onclick="switchArrowDirection(this)"></b>';
                percent = '%';
            } else {
                value = '';
                icon = '<b/>';
            }

            html += '<div>' +
                '<input type="text" class="no-borders bg_none m-l-10 w30 text-right" maxlength="4" ' +
                'onkeyup="filterDigitalRangeLimit(this, 0, 1000)" onblur="setPercentOnblur(this, 0, 1000)" value="' + value + '" />'
                + percent + icon +
                '</div>';
            return html;
        },


        ishidehead: function () {
            return true;
        },

        cellClassCB: function(rowIndex, columnName, rowData){
            var childDomainId = rowData.childDomainId;
            if (childDomainId != null) {
                dataTable[childDomainId] = JSON.parse(JSON.stringify(rowData));
            }
        },
        onRowClick: function (rowIndex, rowData, column) {
            if (column.field == "childDomainName") {
                return;
            }
            curHandleCell.clickedColumnName = column.field;
            curHandleCell.childDomainId = rowData["childDomainId"];
            curHandleCell.rowKey = curHandleCell.childDomainId;

            //点击箭头后箭头上升
            var rowKey = curHandleCell.rowKey;
            var clickedColumnName = curHandleCell.clickedColumnName;
            if (curHandleCell.arrowUpFlag == 1) {
                //上升取整
                dataTable[rowKey][clickedColumnName] = Math.abs(dataTable[rowKey][clickedColumnName]);

            } else if (curHandleCell.arrowUpFlag == -1) {
                //下降取负
                dataTable[rowKey][clickedColumnName] = 0 - Math.abs(dataTable[rowKey][clickedColumnName]);
            }
            //箭头方向已处理，置为0
            curHandleCell.arrowUpFlag = 0;
        },

        onDataReset: function () {
            console.log('onDataReset')
            this.$refs.paginationInfo.resetData()
            this.$refs.pagination.resetData()
        },
        Search: function () {
            var _self = this;
            dataTable = {};
            var multiselectAll = "multiselect-all";
            _self.moreParams = {};
            _self.moreParams.domainId = dimainId;
            _self.moreParams.timeYear = $("#whole-year").val();

            timeYear = _self.moreParams.timeYear;
            selTimeInterval = $("#time-interval").val();

            if (selTimeInterval == '-1') {
                layer.msg('请选择时间类型！');
                return;
            }
            timeInterval = selTimeInterval;

            var timeIntervalList = selTimeInterval.split(',');
            _self.moreParams.timeIntervalList = timeIntervalList;

            if (selTimeInterval.indexOf("月") != -1) {
                //月总天数上线
                totalDays = 31
            } else if (selTimeInterval.indexOf("季度") != -1) {
                //季度总天数上线
                totalDays = 92;
            } else if (selTimeInterval.indexOf("半年") != -1) {
                //半年天数上线
                totalDays = 184;
            } else {
                //全年总天数上线
                totalDays = 366;
            }

            var postData = _self.moreParams;
            var url = $.coreApiPath + "/assessment/pageSetting";
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
            });

            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
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
            var fields = ['id', 'domainId', 'childDomainId', 'childDomainName', 'timeYear', 'timeInterval', 'pm25', 'pm25Percent', 'rankDay1', 'rankPercent1',
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
        save: function () {
            var saveParams = new Array();
            for (var i in dataTable) {
                var result = "";
                result += dataTable[i].pm25 == null ? "" : dataTable[i].pm25;
                result += dataTable[i].pm25Percent == null ? "" : dataTable[i].pm25Percent;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay1;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent1;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay2;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent2;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay3;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent3;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay4;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent4;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay5;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent5;
                result += dataTable[i].rankDay1 == null ? "" : dataTable[i].rankDay6;
                result += dataTable[i].rankPercent1 == null ? "" : dataTable[i].rankPercent6;
                if (result != "") {
                    dataTable[i].timeYear = timeYear;
                    dataTable[i].timeInterval = timeInterval;
                    saveParams.push(dataTable[i]);
                }
            }

            if (saveParams.length == 0) {
                layer.msg("不能保存空数据");
                return;
            }

            $.ajax({
                url: $.coreApiPath + "/assessment/save",
                type: "POST",
                contentType: 'application/json;charset=utf-8', //设置请求头信息
                dataType: "json",
                data: JSON.stringify(saveParams),    //将Json对象序列化成Json字符串，JSON.stringify()原生态方法
                success: function (data) {
                    if (data.erroCode === 2000) {
                        window.location.href = $.ctx + "/cityData/districtS_Manager";
                    } else {
                        layer.msg("保存失败！");
                    }
                },
                error: function (res) {
                    layer.msg("保存失败！");
                }
            });
        },
        backToManageer: function () {
            window.location.href = ctx + "/cityData/districtS_Manager";
        },
    }
});

//箭头方向切换事件(改善、恶化)
function switchArrowDirection(object) {
    if ($(object).hasClass("better-green")) {
        //恶化处理标识
        curHandleCell.arrowUpFlag = -1;
        $(object).removeClass("better-green").addClass("worse-red");
    } else if ($(object).hasClass("worse-red")) {
        //改善处理标识
        curHandleCell.arrowUpFlag = 1;
        $(object).removeClass("worse-red").addClass("better-green");
    }
}

//获取输入值
function setDataOnblur(object, minNumber, maxNumber) {

    //数字再次过滤
    filterDigitalRangeLimit(object, minNumber, maxNumber);

    //当前输入值
    var value = $(object).val();
    //处理对应列
    var clickedColumnName = curHandleCell.clickedColumnName;
    //处理对应行
    var rowKey = curHandleCell.rowKey;

    //重新赋值
    dataTable[rowKey][clickedColumnName] = value;
}

//判断输入值，若首次输入箭头默认向上（优、良）
function setPercentOnblur(object, minNumber, maxNumber) {

    //数字再次过滤
    filterDigitalRangeLimit(object, minNumber, maxNumber);

    //当前输入值
    var value = $(object).val();
    //需要保存的数据,下降时存负值
    var saveValue = value;
    //处理对应列
    var clickedColumnName = curHandleCell.clickedColumnName;
    //处理对应行
    var rowKey = curHandleCell.rowKey;

    var div = $(object).parent();
    var b = $(object).parent().children('b');
    var divParent = $(object).parent().parent();
    var html = '',
        icon = '',
        percent = '';

    //未设置目标值
    if (value == null || value == "") {
        icon = '<b/>'
        percent = '';
    } else if (value == 0) {
        icon = '<b/>';
        percent = '%';
    } else if (!$(b).hasClass("arrow-up") && !$(b).hasClass("arrow-down")) {
        //首次设置目标值且不为空，默认为改善
        icon = '<b class="better-green cursor-p" onclick="switchArrowDirection(this)"></b>';
        percent = '%';
    } else if ($(b).hasClass("worse-red")) {
        //恶化，value存为负数
        saveValue = 0 - Math.abs(value);
        icon = '<b class="worse-red cursor-p" onclick="switchArrowDirection(this)"></b>';
        percent = '%';
    } else {
        //非首次目标值设定且为正
        dataTable[rowKey][clickedColumnName] = saveValue;
        return;
    }
    //重新赋值
    dataTable[rowKey][clickedColumnName] = saveValue;
    var html = '';
    colorSite = '';
    if(saveValue == 0){
        html += '<div style="color:' + colorSite + '; margin-right: 30px">' +
            '<input type="text" class="no-borders bg_none w30 text-right" maxlength="4" ' +
            'onkeyup="filterDigitalRangeLimit(this, 0, 1000)" onblur="setPercentOnblur(this, 0, 1000)" value="' + value + '" />'
            + percent + icon +
            '</div>';
    } else {
        html += '<div style="color:' + colorSite + '">' +
            '<input type="text" class="no-borders bg_none w30 text-right" maxlength="4" ' +
            'onkeyup="filterDigitalRangeLimit(this, 0, 1000)" onblur="setPercentOnblur(this, 0, 1000)" value="' + value + '" />'
            + percent + icon +
            '</div>';
    }
    $(divParent).html(html);
}

//对指定数字范围进程过滤处理
function filterDigitalRangeLimit(object, minNumber, maxNumber) {
    object.value = object.value.replace(/[^0-9-]+/, '');
    var value = object.value;
    if (value != '') {
        value = parseInt(value);
        if (value < minNumber) {
            value = '';
        } else if (value > maxNumber) {
            value = parseInt(value / 10);
        }
        object.value = value;
    }
}