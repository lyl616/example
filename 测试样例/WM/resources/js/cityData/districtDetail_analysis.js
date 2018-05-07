var E_SERVER_ERROR = 'Error communicating with the server'
var domainId = parent.cityId;

$(function () {
    initGoodDaysChars("month");
    initBadDaysChars("month");
});



var tableColumns = [
    {
        name: '__sequence',
        title: '序号', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '40px'
    },
    {
        name: 'timeInterval',
        width: '98px',
        title: '时段',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'avgValue',
        title: '均值',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '60px'
    },
    {
        name: 'targetV',
        title: '目标',
        titleClass: 'text-center',
        dataClass: "text-center",
        width: '60px'
    },
    {
        name: 'tongbi',
        title: '同比',
        titleClass: 'text-center',
        width: '60px',
        dataClass: "text-center",
        callback: "tongBiView"
    }, {
        name: 'tongbiTag',
        title: "同比目标", //优天数同比
        titleClass: 'text-center',
        dataClass: "text-center",
        width: '70px',
        callback: "tongBiView"

    }
]
Vue.use(Vuetable);
Vue.config.productionTip = false;
var vm = new Vue({
    el: '#content',
    data: {
        tabbyDistrict: {
            tableData: [], //区域统计，表格数据
            columns: [{
                field: 'sequence',
                width:50,
                columnAlign: 'center',
                isFrozen: true,
                isResize: true
            },
                {
                    field: 'timeInterval',
                    width: 100,
                    columnAlign: 'center',
                    isFrozen: true,
                    isResize: true
                },
                {
                    field: 'realData1',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.realData1;
                    }
                },
                {
                    field: 'targetData1',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.targetData1;
                    }
                },
                {
                    field: 'percent1',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.percent1;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'targetPercent1',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.targetPercent1;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'realData2',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.realData2;
                    }
                },
                {
                    field: 'targetData2',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.targetData2;
                    }
                },
                {
                    field: 'percent2',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.percent2;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'targetPercent2',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.targetPercent2;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'realData5',
                    width:70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.realData5;
                    }
                },
                {
                    field: 'targetData5',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.targetData5;
                    }
                },
                {
                    field: 'percent5',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.percent5;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'targetPercent5',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.targetPercent5;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'realData6',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.realData6;
                    }
                },
                {
                    field: 'targetData6',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        return rowData.targetData6;
                    }
                },
                {
                    field: 'percent6',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.percent6;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                },
                {
                    field: 'targetPercent6',
                    width: 70,
                    columnAlign: 'center',
                    formatter: function (rowData, index) {
                        var val = rowData.targetPercent6;
                        if (val < 0) {
                            return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
                        } else if (val > 0) {
                            return val + "%<b class='arrow-green-up'></b>";
                        } else if (val == '0') {
                            return val + "%";
                        } else {
                            return val;
                        }
                    }
                }
            ], //区域统计，列数据
            titleRows: [
                [{
                    fields: ['sequence'],
                    title: '序号',
                    titleAlign: 'center',
                    rowspan: 2
                },
                    {
                        fields: ['timeInterval'],
                        title: '时段',
                        titleAlign: 'center',
                        rowspan: 2
                    },
                    {
                        fields: ['realData1', 'targetData1', 'percent1', 'targetPercent1'],
                        title: '优',
                        titleAlign: 'center',
                        colspan: 4
                    },
                    {
                        fields: ['realData2', 'targetData2', 'percent2', 'targetPercent2'],
                        title: '良',
                        titleAlign: 'center',
                        colspan: 4
                    },
                    {
                        fields: ['realData5', 'targetData5', 'percent5', 'targetPercent5'],
                        title: '重度',
                        titleAlign: 'center',
                        colspan: 4
                    },
                    {
                        fields: ['realData6', 'targetData6', 'percent6', 'targetPercent6'],
                        title: '严重',
                        titleAlign: 'center',
                        colspan: 4
                    }
                ],
                [{
                    fields: ['realData1'],
                    title: '天数',
                    titleAlign: 'center'
                },
                    {
                        fields: ['targetData1'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['percent1'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetPercent1'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['realData2'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetData2'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['percent2'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetPercent2'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['realData5'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetData5'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['percent5'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetPercent5'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['realData6'],
                        title: '天数',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetData6'],
                        title: '目标',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['percent6'],
                        title: '同比',
                        titleAlign: 'center'
                    },
                    {
                        fields: ['targetPercent6'],
                        title: '目标',
                        titleAlign: 'center'
                    }
                ]
            ] //区域统计，行数据
        },
        loading: '',
        searchFor: '',
        moreParams: {//表格查询参数
            city: domainId,
            district: getQueryString("district"),
            timeType: 'month',
        },
        fields: tableColumns,
        tableHeight: 'auto',
        selectedTo: [],
        vuetableFields: false,
        sortOrder: [{
            field: 'timeInterval',
            direction: 'asc',
        }],
        multiSort: true,
        districtName: "",
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)'
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
        },
        'selectedTo': function (val, oldVal) {
        }
    },
    mounted: function () {
        var _self = this;
        _self.moreParams.district = getQueryString("district");
        _self.districtName = getQueryString("districtName");
        $("#pageName").text(_self.districtName + "考核详情");
        _self.refreshTable();
        _self.getEasyTableData();
    },
    methods: {
        clkTimeType: function (timeType, idx) {
            var _self = this;
            _self.moreParams.timeType = timeType;
            $('.timeType').removeClass('btn-info');
            $(".timeType:eq(" + idx + ")").addClass('btn-info');
            _self.refreshTable();
            _self.getEasyTableData();
            initGoodDaysChars(timeType);
            initBadDaysChars(timeType);
        },
        tongBiView: function (val) {
            if (val < 0) {
                return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
            } else if (val > 0) {
                return val + "%<b class='arrow-green-up'></b>";
            } else if (val == '0') {
                return val + "%";
            } else {
                return val + "";
            }
        },
        refreshTable: function () {
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        getEasyTableData: function () {
            var _self = this;
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + '/target/analysis/airDaysAndPercentDetail',
                dataType: "json",
                data: _self.moreParams,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    _self.tabbyDistrict.tableData = data.data;
                }
            });
        },
        transform: function (data) {
            var transformed = {}
            var pagination = data.pagination;
            transformed.pagination = {
                total: pagination.total,
                per_page: pagination.per_page,
                current_page: pagination.current_page,
                last_page: pagination.last_page,
                next_page_url: pagination.next_page_url,
                prev_page_url: pagination.prev_page_url,
                from: pagination.from,
                to: pagination.to
            }
            transformed.data = []
            data = data.data
            for (var i = 0; i < data.length; i++) {
                transformed['data'].push({
                    timeInterval: data[i].timeInterval,
                    avgValue: data[i].realData,
                    tongbi: data[i].percent,
                    targetV: data[i].targetData,
                    tongbiTag: data[i].targetPercent
                })
            }
            //
            initDoubleChar("khChar", data)
            return transformed
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        onLoadSuccess: function (response) {
            // // set pagination data to pagination-info component
            // this.$refs.paginationInfo.setPaginationData(response.data)
            //console.log(response.data)
        },
        onLoadError: function (response) {
            if (response.status == 400) {
                sweetAlert('Something\'s Wrong!', response.data.message, 'error')
            } else {
                sweetAlert('Oops', E_SERVER_ERROR, 'error')
            }
        },
        onPaginationData: function (tablePagination) {
            // this.$refs.paginationInfo.setPaginationData(tablePagination)
            // this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page);
        }
    }
})

/**
 * 指定区县在时间段优良考核
 */
function initGoodDaysChars(timeType) {
    var params = {
        city: domainId,
        district: getQueryString("district"),
        timeType: timeType
    }

    CommonUtil.ajax({
        type: "post",
        url: $.coreApiPath + '/target/analysis/excellentDaysDetail',
        dataType: "json",
        data: params,
        contentType: 'application/json; charset=UTF-8',
        sucessFn: function (data) {
            initDoubleChar('goodDaysChars', data);
        }
    });
}

/**
 * 指定区县在时间段重污染天数考核
 */
function initBadDaysChars(timeType) {
    var params = {
        city: domainId,
        district: getQueryString("district"),
        timeType: timeType
    }

    CommonUtil.ajax({
        type: "post",
        url: $.coreApiPath + '/target/analysis/badDaysDetail',
        dataType: "json",
        data: params,
        contentType: 'application/json; charset=UTF-8',
        sucessFn: function (data) {
            initDoubleChar('badyDaysChars', data);
        }
    });
}


/**
 * 双对比柱图
 * @param id
 */
function initDoubleChar(id, data) {
    var xAxis = [];
    var realData = [];
    var targetData = [];
    for (var i = 0; i < data.length; i++) {
        xAxis.push(data[i].timeInterval);
        realData.push(data[i].realData);
        targetData.push(data[i].targetData);
    }

    var myChart = echarts.init(document.getElementById(id));
    var option = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        dataZoom: dataZoom_start_end(xAxis.length),
        color: ['#3AA5F5', '#FDBF2D'],
        legend: {
            data: ['实际', '目标'],
            right: '48%',
            top: '2%',
            selectedMode: false
        },
        grid: {
            left: '4%',
            right: '4%',
            top: '10%',
            bottom: '80px',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: xAxis,
            axisLabel: {
                interval: 0,
                rotate: '45',
                margin: 8
            },
            textStyle: {
                color: '#fff',
                fontSize: '10'
            }
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: ['0%', '5%'],
        }],
        series: [{
            name: '实际',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: "#3AA5F5"
                }
            },
            data: realData
        },
            {
                name: '目标',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: "#FDBF2D"
                    }
                },
                data: targetData
            }
        ]
    };
    myChart.setOption(option);
}

//给表格增加，鼠标移入的时候出现表格滚动条效果
$(document).ready(function () {
    $(".chunk-body").hover(function () {
        $(this).find(".vuetable-body-wrapper").css("height", '330px');
    }, function () {
        // $(this).find(".vuetable-body-wrapper").css("height", 'auto');
    });
});