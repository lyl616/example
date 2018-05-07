var report = "";
var curr_city = parent.cityId,
    curr_pro = parent.provinceId,
    curr_city_name = parent.cityName;
var map = "";
var no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/no_select.png', new BMap.Size(24, 24));
var is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/is_select.png', new BMap.Size(24, 24));
$(function () {
    function initWdateVal(domId, time) {
        var result = "";
        initWDatetime(domId, "yyyy年", time);
        result = myDate.formatDate(time, "yyyy年");
        return result;
    }

    var start = new Date(myDate.year, myDate.month - 1, myDate.day);
    initSEndTime = {
        tabcount: {
            startTime: initWdateVal('startTime', start)
        }
    };
    Vue.component('__radio_stationId', {
        template: '<input type="radio" name="__radio_stationId" @change="toggleRadio(rowData)" :checked="this.$parent.rowSelected(rowData, \'__checkbox:stationId\')"> ',
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        methods: {
            toggleRadio: function (rowData) {
                this.$parent.$parent.selectStation(rowData['stationId']);
            }
        }
    });
    var tableColumns = [{
        name: '__component:__radio_stationId',
        dataClass: 'text-center',
        chkNum: 20
    },
        {
            name: 'stationName',
            title: '站点名称',
            titleClass: 'text-center',
            dataClass: 'text-center'
        },
        {
            name: 'stationId',
            title: '站点编号',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }
    ];
    Vue.config.debug = false;
    Vue.use(Vuetable);
    report = new Vue({
        el: "#content",
        data: {
            //表格的绑定数据项
            tabTypeName: '', //记录当前tab标签的名称
            tabbyDistrict: {
                byDistrictData: [], //区域统计，表格数据
                byDistrictColumns: [{
                    field: 'month',
                    width: 60,
                    columnAlign: 'center',
                    isFrozen: true,
                    isResize: true
                },
                    {
                        field: 'aqi',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.aqi);
                        }
                    },
                    {
                        field: 'aqimom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqimom);
                        }
                    },
                    {
                        field: 'aqiyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqiyoy);
                        }
                    },
                    {
                        field: 'pm25',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm25);
                        }
                    },
                    {
                        field: 'pm25mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25mom);
                        }
                    },
                    {
                        field: 'pm25yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25yoy);
                        }
                    },
                    {
                        field: 'pm10',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm10);
                        }
                    },
                    {
                        field: 'pm10mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10mom);
                        }
                    },
                    {
                        field: 'pm10yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10yoy);
                        }
                    },
                    {
                        field: 'co',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.co);
                        }
                    },
                    {
                        field: 'comom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.comom);
                        }
                    },
                    {
                        field: 'coyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.coyoy);
                        }
                    },
                    {
                        field: 'so2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.so2);
                        }
                    },
                    {
                        field: 'so2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2mom);
                        }
                    },
                    {
                        field: 'so2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2yoy);
                        }
                    },
                    {
                        field: 'no2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.no2);
                        }
                    },
                    {
                        field: 'no2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2mom);
                        }
                    },
                    {
                        field: 'no2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2yoy);
                        }
                    },
                    {
                        field: 'o3',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.o3);
                        }
                    },
                    {
                        field: 'o3mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3mom);
                        }
                    },
                    {
                        field: 'o3yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3yoy);
                        }
                    }
                ], //区域统计，列数据
                byDistrictRows: [
                    [{
                        fields: ['month'],
                        title: '月份',
                        titleAlign: 'center',
                        rowspan: 2
                    },
                        {
                            fields: ['aqi', 'aqimom', 'aqiyoy'],
                            title: 'AQI',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm25', 'pm25mom', 'pm25yoy'],
                            title: 'PM<sub>2.5</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm10', 'pm10mom', 'pm10yoy'],
                            title: 'PM<sub>10</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['co', 'comom', 'coyoy'],
                            title: 'CO',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['so2', 'so2mom', 'so2yoy'],
                            title: 'SO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['no2', 'no2mom', 'no2yoy'],
                            title: 'NO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['o3', 'o3mom', 'o3yoy'],
                            title: 'O<sub>3</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        }
                    ],
                    [{
                        fields: ['aqi'],
                        title: '浓度',
                        titleAlign: 'center'
                    },
                        {
                            fields: ['aqimom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['aqiyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['co'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['comom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['coyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        }
                    ]
                ], //区域统计，行数据
            },
            tabbyStation: {
                byStationData: [], //站点统计，表格数据
                byStationColumns: [{
                    field: 'month',
                    width: 60,
                    columnAlign: 'center',
                    isFrozen: true,
                    isResize: true
                },
                    {
                        field: 'aqi',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.aqi);
                        }
                    },
                    {
                        field: 'aqimom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqimom);
                        }
                    },
                    {
                        field: 'aqiyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqiyoy);
                        }
                    },
                    {
                        field: 'pm25',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm25);
                        }
                    },
                    {
                        field: 'pm25mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25mom);
                        }
                    },
                    {
                        field: 'pm25yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25yoy);
                        }
                    },
                    {
                        field: 'pm10',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm10);
                        }
                    },
                    {
                        field: 'pm10mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10mom);
                        }
                    },
                    {
                        field: 'pm10yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10yoy);
                        }
                    },
                    {
                        field: 'co',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.co);
                        }
                    },
                    {
                        field: 'comom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.comom);
                        }
                    },
                    {
                        field: 'coyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.coyoy);
                        }
                    },
                    {
                        field: 'so2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.so2);
                        }
                    },
                    {
                        field: 'so2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2mom);
                        }
                    },
                    {
                        field: 'so2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2yoy);
                        }
                    },
                    {
                        field: 'no2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.no2);
                        }
                    },
                    {
                        field: 'no2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2mom);
                        }
                    },
                    {
                        field: 'no2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2yoy);
                        }
                    },
                    {
                        field: 'o3',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.o3);
                        }
                    },
                    {
                        field: 'o3mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3mom);
                        }
                    },
                    {
                        field: 'o3yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3yoy);
                        }
                    }
                ], //区域统计，列数据
                byStationRows: [
                    [{
                        fields: ['month'],
                        title: '月份',
                        titleAlign: 'center',
                        rowspan: 2
                    },
                        {
                            fields: ['aqi', 'aqimom', 'aqiyoy'],
                            title: 'AQI',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm25', 'pm25mom', 'pm25yoy'],
                            title: 'PM<sub>2.5</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm10', 'pm10mom', 'pm10yoy'],
                            title: 'PM<sub>10</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['co', 'comom', 'coyoy'],
                            title: 'CO',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['so2', 'so2mom', 'so2yoy'],
                            title: 'SO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['no2', 'no2mom', 'no2yoy'],
                            title: 'NO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['o3', 'o3mom', 'o3yoy'],
                            title: 'O<sub>3</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        }
                    ],
                    [{
                        fields: ['aqi'],
                        title: '浓度',
                        titleAlign: 'center'
                    },
                        {
                            fields: ['aqimom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['aqiyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['co'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['comom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['coyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        }
                    ]
                ], //区域统计，行数据
            },
            allDpageIndex: 1, //当前页数
            allDpageSize: 10, //每页多少条
            allDtotal: 0, //总记录个数
            taballDistrict: {
                allDistrictData: [], //全部区县，表格数据
                allDistrictColumns: [{
                    field: 'custome',
                    title: '序号',
                    width: 50,
                    titleAlign: 'center',
                    columnAlign: 'center',
                    formatter: function (rowData, rowIndex, pagingIndex, field) {
                        return pagingIndex + rowIndex + 1
                    },
                    isFrozen: true,
                    isResize: true
                },
                    {
                        field: 'name',
                        width: 60,
                        columnAlign: 'center',
                        isFrozen: true,
                        isResize: true
                    },
                    {
                        field: 'aqi',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.aqi);
                        }
                    },
                    {
                        field: 'aqimom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqimom);
                        }
                    },
                    {
                        field: 'aqiyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqiyoy);
                        }
                    },
                    {
                        field: 'pm25',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm25);
                        }
                    },
                    {
                        field: 'pm25mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25mom);
                        }
                    },
                    {
                        field: 'pm25yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25yoy);
                        }
                    },
                    {
                        field: 'pm10',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm10);
                        }
                    },
                    {
                        field: 'pm10mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10mom);
                        }
                    },
                    {
                        field: 'pm10yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10yoy);
                        }
                    },
                    {
                        field: 'co',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.co);
                        }
                    },
                    {
                        field: 'comom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.comom);
                        }
                    },
                    {
                        field: 'coyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.coyoy);
                        }
                    },
                    {
                        field: 'so2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.so2);
                        }
                    },
                    {
                        field: 'so2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2mom);
                        }
                    },
                    {
                        field: 'so2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2yoy);
                        }
                    },
                    {
                        field: 'no2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.no2);
                        }
                    },
                    {
                        field: 'no2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2mom);
                        }
                    },
                    {
                        field: 'no2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2yoy);
                        }
                    },
                    {
                        field: 'o3',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.o3);
                        }
                    },
                    {
                        field: 'o3mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3mom);
                        }
                    },
                    {
                        field: 'o3yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3yoy);
                        }
                    }
                ], //区域统计，列数据
                allDistrictRows: [
                    [{
                        fields: ['custome'],
                        title: '序号',
                        titleAlign: 'center',
                        rowspan: 2
                    },
                        {
                            fields: ['name'],
                            title: '区县',
                            titleAlign: 'center',
                            rowspan: 2
                        },
                        {
                            fields: ['aqi', 'aqimom', 'aqiyoy'],
                            title: 'AQI',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm25', 'pm25mom', 'pm25yoy'],
                            title: 'PM<sub>2.5</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm10', 'pm10mom', 'pm10yoy'],
                            title: 'PM<sub>10</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['co', 'comom', 'coyoy'],
                            title: 'CO',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['so2', 'so2mom', 'so2yoy'],
                            title: 'SO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['no2', 'no2mom', 'no2yoy'],
                            title: 'NO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['o3', 'o3mom', 'o3yoy'],
                            title: 'O<sub>3</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        }
                    ],
                    [{
                        fields: ['aqi'],
                        title: '浓度',
                        titleAlign: 'center'
                    },
                        {
                            fields: ['aqimom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['aqiyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['co'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['comom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['coyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        }
                    ]
                ], //全部区县，行数据
            },
            allSpageIndex: 1, //当前页数
            allSpageSize: 10, //每页多少条
            allStotal: 0, //总记录个数
            taballStation: {
                allStationData: [], //全部区县，表格数据
                allStationColumns: [{
                    field: 'custome',
                    title: '序号',
                    width: 50,
                    titleAlign: 'center',
                    columnAlign: 'center',
                    formatter: function (rowData, rowIndex, pagingIndex, field) {
                        return (report.allSpageIndex - 1) * report.allSpageSize + rowIndex + 1
                    },
                    isFrozen: true,
                    isResize: true
                },
                    {
                        field: 'stationId',
                        width: 150,
                        columnAlign: 'center',
                        isFrozen: true,
                        isResize: true
                    },
                    {
                        field: 'name',
                        width: 150,
                        columnAlign: 'center',
                        isFrozen: true,
                        isResize: true
                    },
                    {
                        field: 'aqi',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.aqi);
                        }
                    },
                    {
                        field: 'aqimom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqimom);
                        }
                    },
                    {
                        field: 'aqiyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.aqiyoy);
                        }
                    },
                    {
                        field: 'pm25',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm25);
                        }
                    },
                    {
                        field: 'pm25mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25mom);
                        }
                    },
                    {
                        field: 'pm25yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm25yoy);
                        }
                    },
                    {
                        field: 'pm10',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.pm10);
                        }
                    },
                    {
                        field: 'pm10mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10mom);
                        }
                    },
                    {
                        field: 'pm10yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.pm10yoy);
                        }
                    },
                    {
                        field: 'co',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.co);
                        }
                    },
                    {
                        field: 'comom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.comom);
                        }
                    },
                    {
                        field: 'coyoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.coyoy);
                        }
                    },
                    {
                        field: 'so2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.so2);
                        }
                    },
                    {
                        field: 'so2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2mom);
                        }
                    },
                    {
                        field: 'so2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.so2yoy);
                        }
                    },
                    {
                        field: 'no2',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.no2);
                        }
                    },
                    {
                        field: 'no2mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2mom);
                        }
                    },
                    {
                        field: 'no2yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.no2yoy);
                        }
                    },
                    {
                        field: 'o3',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatPollutionValue(rowData.o3);
                        }
                    },
                    {
                        field: 'o3mom',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3mom);
                        }
                    },
                    {
                        field: 'o3yoy',
                        width: 100,
                        columnAlign: 'center',
                        formatter: function (rowData, index) {
                            return report.formatRateValue(rowData.o3yoy);
                        }
                    }
                ], //区域统计，列数据
                allStationRows: [
                    [{
                        fields: ['custome'],
                        title: '序号',
                        titleAlign: 'center',
                        rowspan: 2
                    },
                        {
                            fields: ['stationId'],
                            title: '站点编号',
                            titleAlign: 'center',
                            rowspan: 2
                        },
                        {
                            fields: ['name'],
                            title: '站点名称',
                            titleAlign: 'center',
                            rowspan: 2
                        },
                        {
                            fields: ['aqi', 'aqimom', 'aqiyoy'],
                            title: 'AQI',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm25', 'pm25mom', 'pm25yoy'],
                            title: 'PM<sub>2.5</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['pm10', 'pm10mom', 'pm10yoy'],
                            title: 'PM<sub>10</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['co', 'comom', 'coyoy'],
                            title: 'CO',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['so2', 'so2mom', 'so2yoy'],
                            title: 'SO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['no2', 'no2mom', 'no2yoy'],
                            title: 'NO<sub>2</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        },
                        {
                            fields: ['o3', 'o3mom', 'o3yoy'],
                            title: 'O<sub>3</sub>',
                            titleAlign: 'center',
                            colspan: 3
                        }
                    ],
                    [{
                        fields: ['aqi'],
                        title: '浓度',
                        titleAlign: 'center'
                    },
                        {
                            fields: ['aqimom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['aqiyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm25yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['pm10yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['co'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['comom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['coyoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['so2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['no2yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3'],
                            title: '浓度',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3mom'],
                            title: '环比',
                            titleAlign: 'center'
                        },
                        {
                            fields: ['o3yoy'],
                            title: '同比',
                            titleAlign: 'center'
                        }
                    ]
                ], //全部区县，行数据
            },
            //数据实用
            tabActivefg: false, //用于标识右侧的面板是否可以展示
            btnStatue: {
                allDistrict: {
                    better: true, //最好
                    worst: false //最差
                },
                allStation: {
                    better: true, //最好
                    worst: false //最差
                }
            },
            //vuetable常用
            fields: tableColumns,
            params: {
                'wzz': '',
                'khz': '',
                'ycz': '',
                'pcz': '',
                'vocz': '',
                'districts': '',
                'stationId': '',
                'city': curr_city
            },
            districtSelect: "",
            //for map
            mapOpenStatus: {
                isActive: false,
                noActive: true
            },
            isMapOpen: false, //地图是否打开
            markers: [], //所有选择的站点信
            stationList: [], //列表加载完成后的数据 信息
            default_station: '6010,1010', //默认微站类型
            selected_district: '-1',
            district_list: [],
            startTime: initSEndTime.tabcount.startTime,
            stationType: -1,
            stationTypeList: [],
            stationName: "",
            // stationName:-1,
            stationName_list: [],
            btn_toogle_statue: 0,
            dataList_byDistrict: [], //区县的区县列表数据
            dataList_byStation: [], //区县站点数据
            chartBtnStatus: {
                'byDistrict': 'aqi',
                'byStation': 'aqi',
                'allDistrict': 'aqi',
                'allStation': 'aqi',
                'top10_allDistrict': 1,
                'top10_allStation': 1
            },
            dataQueryStatus: {
                'byDistrict': false,
                'byStation': false,
                'allDistrict': false,
                'allStation': false
            },
            districtList: [],
            khstationList: [],
            wzstationList: [],
            pcstationList: [],
            ycstationList: [],
            wz_all: true, //true为选，false为不选
            district_all: true, //true为选，false为不选
            kh_all: false,
            pc_all: false,
            yc_all: false,
            khli: [],
            wzli: [],
            ycli: [],
            pcli: [],
            districtli: [],
            stationId: "", //右侧查询
            districts: "0", //选中的行政区域 0 未选择 1 全选  其它 id 字符串
            allFunctions: {},
        },
        created: function () {
            var that = this;
            that.initAllFunctions();
            that.initDistrictList();
            that.initStationTypeList();
            that.initOther();
        },
        events: {
            'vuetable:row-clicked': function (dataItem, event) {
                this.selectStation(dataItem['stationId']);
            }
        },
        watch: {
            khli: function () {
                this.kh_all = this.khli.length == this.khstationList.length;
            },
            wzli: function () {
                this.wz_all = this.wzli.length == this.wzstationList.length;
            },
            pcli: function () {
                this.pc_all = this.pcli.length == this.pcstationList.length;
            },
            ycli: function () {
                this.yc_all = this.ycli.length == this.ycstationList.length;
            },
            districtli: function () {
                if (this.districtli.length == this.districtList.length) {
                    this.district_all = true;
                    this.districts = "1";
                } else {
                    if (this.districtli.length == 0) {
                        this.districts = "0";
                    } else {
                        this.districts = this.districtli.join(",");
                    }
                    this.district_all = false;
                }
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
            initOther: function () {
                var that = this;
                var cityId = parent.cityId;
                ajax($.coreApiPath + "/monitor/station/" + cityId, {
                    parents: ""
                }, function (data) {
                    if (data != null) {
                        var wz = data.wz; //微站
                        if (typeof(wz) != undefined && wz.length > 0) {
                            that.fillArray(that.wzstationList, wz);
                            for (var i = 0; i < that.wzstationList.length; i++) {
                                var stationId = that.wzstationList[i].id.toString();
                                that.wzli.push(stationId);
                            }
                        }
                        var kh = data.kh; //考核站
                        if (typeof(kh) != undefined && kh.length > 0) {
                            that.fillArray(that.khstationList, kh);
                        }
                        var pc = data.pc; //爬虫
                        if (typeof(pc) != undefined && pc.length > 0) {
                            that.fillArray(that.pcstationList, pc);
                        }
                        var yc = data.yc; //扬尘
                        if (typeof(yc) != undefined && pc.length > 0) {
                            that.fillArray(that.ycstationList, yc);
                        }
                        var district = data.district; //区域
                        if (district == undefined || district.length == 0) {
                            district = that.district_list;
                        }
                        if (typeof(district) != undefined && district.length > 0) {
                            for (var i = 0; i < district.length; i++) {
                                var code = {
                                    id: district[i].id,
                                    name: district[i].name
                                };
                                that.districtList.push(code);
                            }
                            for (var i = 0; i < that.districtList.length; i++) {
                                var stationId = that.districtList[i].id.toString();
                                that.districtli.push(stationId);
                            }
                        }
                        that.getReqParam();
                    }
                });
            },
            initStationTypeList: function () {
                ///////////////查询站点类型////////////////
                CommonUtil.ajax({
                    type: "post",
                    url: $.coreApiPath + '/rest/station/getSelectData',
                    dataType: "json",
                    async: false,
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (data) {
                        that.stationTypeList = data.siteType;
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('查询站点类型失败！');
                    }
                });
            },
            initDistrictList: function () {
                var that = this;
                var url = $.coreApiPath + "/domain/cascade/" + curr_city;
                var param = {};
                ajax_get_msg(url, param, "加载", function (data) {
                    if (data.erroCode == 2000) {
                        var data = data.result;
                        var list = [];
                        if (data.domainDTO[0].cityType == '1') {
                            list = data.cityList;
                        } else if (data.domainDTO[0].cityType == '2') {
                            list = data.districtList;
                        } else {
                            list = data.districtList;
                        }
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].id != '' && list[i].id != null) {
                                that.district_list.push({
                                    id: list[i].id,
                                    name: list[i].domainName,
                                    text: list[i].domainName
                                });
                            }
                        }
                    }

                });
            },
            tabChange: function (index, queryType) {
                this.tabActivefg = index;
                this.$refs['tab' + queryType].resize();
                if (queryType == 'byDistrict' || queryType == 'byStation') {
                    if ($("#startTime_" + queryType).val() == "") {
                        $("#startTime_" + queryType).val(new Date().Format("yyyy年"))
                    }
                } else {
                    if ($("#startTime_" + queryType).val() == "") {
                        $("#startTime_" + queryType).val(new Date(myDate.year, myDate.month - 2, myDate.day).Format("yyyy年MM月"));
                    }
                }
            },
            fillArray: function (arr, data) {
                for (var i = 0; i < data.length; i++) {
                    var code = {
                        id: data[i].code,
                        name: data[i].name
                    };
                    arr.push(code);
                }
            },
            popWindwoShow: function (id) {
                $('#' + id).toggle();
            },
            calcSCreenSize: function () {
                var widthS = window.innerWidth;
                return widthS;
            },
            toogleContianer: function () {
                $('.rel-btn-toogle span').removeClass('btn-jt-left');
                $('.rel-btn-toogle span').removeClass('btn-jt-right');
                if (!this.btn_toogle_statue) { //右侧的菜单收起
                    $("#layui-layer" + this.layer_id).css("width", "100%");
                    $('.panel-left').addClass('min-sucerData-left');
                    $('.panel-right').addClass('rel-list-zcontent-hide');
                    $('.rel-btn-toogle').addClass('rel-btn-toogle-hide');
                    $('.rel-btn-toogle span').addClass('btn-jt-left');
                    this.btn_toogle_statue = 1;
                    //顺便关闭地图
                    if (this.mapOpenStatus.isActive) {
                        this.openMap();
                    }
                } else { //右侧菜单弹出
                    $("#layui-layer" + this.layer_id).css("width", (this.calcSCreenSize() - 200) + "px");
                    $('.panel-left').removeClass('min-sucerData-left');
                    $('.panel-right').removeClass('rel-list-zcontent-hide');
                    $('.rel-btn-toogle').removeClass('rel-btn-toogle-hide');
                    $('.rel-btn-toogle span').addClass('btn-jt-right');
                    this.btn_toogle_statue = 0;
                }
            },
            clk_kh_all: function () {
                var _self = this;
                var newVal = [];
                if (!_self.kh_all) {
                    for (var i = 0; i < _self.khstationList.length; i++) {
                        var stationId = _self.khstationList[i].id.toString();
                        newVal.push(stationId);
                    }
                }
                _self.khli = newVal;
            },
            clk_wz_all: function () {
                var _self = this;
                var newVal = [];
                if (!_self.wz_all) {
                    for (var i = 0; i < _self.wzstationList.length; i++) {
                        var stationId = _self.wzstationList[i].id.toString();
                        newVal.push(stationId);
                    }
                }
                _self.wzli = newVal;
            },
            clk_pc_all: function () {
                var _self = this;
                var newVal = [];
                if (!_self.pc_all) {
                    for (var i = 0; i < _self.pcstationList.length; i++) {
                        var stationId = _self.pcstationList[i].id.toString();
                        newVal.push(stationId);
                    }
                }
                _self.pcli = newVal;
            },
            clk_yc_all: function () {
                var _self = this;
                var newVal = [];
                if (!_self.yc_all) {
                    for (var i = 0; i < _self.ycstationList.length; i++) {
                        var stationId = _self.ycstationList[i].id.toString();
                        newVal.push(stationId);
                    }
                }
                _self.ycli = newVal;
            },
            clk_district_all: function () {
                var _self = this;
                var newVal = [];
                if (!_self.district_all) {
                    for (var i = 0; i < _self.districtList.length; i++) {
                        var stationId = _self.districtList[i].id.toString();
                        newVal.push(stationId);
                    }
                }
                _self.districtli = newVal;
            },
            selectStation: function (id) {
                this.$refs.vuetable.selectedTo = [id];
                if (this.mapOpenStatus.isActive) {
                    this.showSelectMarker();
                }
            },
            getSelectedStationId: function () {
                var stationId = '';
                if (this.$refs.vuetable.selectedTo.length > 0) {
                    stationId = this.$refs.vuetable.selectedTo[0];
                }
                return stationId;
            },
            openMap: function () {
                var that = this;
                if (this.mapOpenStatus.noActive) {
                    var widthSite;
                    if (this.btn_toogle_statue) { //右侧的菜单收起
                        widthSite = "100%";
                    } else {
                        widthSite = (that.calcSCreenSize() - 230) + 'px';
                    }
                    var winfg = layer.open({
                        skin: 'surverWindmap',
                        title: false,
                        type: 1, //代表了展示的内容的类型
                        anim: 1, //图层动画类型
                        shade: false, //是否显示遮罩层
                        id: "chartsContent",
                        content: $('#mapHtml'),
                        offset: 'l',
                        area: [widthSite, '88%'],
                        maxmin: false,
                        move: false,
                        closeBtn: false,
                        shade: 0,
                        success: function () {
                            that.isMapOpen = true;
                            that.initMap();
                        },
                        cancel: function () {
                            that.isMapOpen = false;
                            map = "";
                        }
                    });
                    that.layer_id = winfg;
                    layer.style(winfg, {
                        left: '10px',
                        top: '140px'
                    });
                } else {
                    layer.closeAll(); //疯狂模式，关闭所有层
                    $("#mapHtml").hide();
                }
                this.mapOpenStatus.isActive = !this.mapOpenStatus.isActive;
                this.mapOpenStatus.noActive = !this.mapOpenStatus.noActive;
            },
            initMap: function () {
                var _self = this;
                if (map == "") {
                    map = new BMap.Map("allmap", {
                        minZoom: 8,
                        maxZoom: 14,
                        enableMapClick: false
                    }); // 创建Map实例
                }
                var navigationControl = new BMap.NavigationControl({
                    // 靠左上角位置
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    // LARGE类型
                    type: BMAP_NAVIGATION_CONTROL_SMALL,
                    // 启用显示定位
                    // enableGeolocation: true
                });
                map.addControl(navigationControl);
                map.centerAndZoom(curr_city_name, 11); // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
                if (_self.stationList && _self.stationList.length > 0) { //如果加载有数据 则显示所有站点信息
                    _self.addMarkers();
                } else {
                    _self.clearMarkers();
                    return false;
                }
                if (_self.markers.length > 0 && _self.$refs.vuetable.selectedTo.length > 0) {
                    _self.showSelectMarker();
                }
                //_self.initDrawingManager(); //初始化圈选功能
            },
            addMarkers: function () {
                var _self = this;
                _self.clearMarkers();
                $.each(_self.stationList, function (i, station) {
                    var sid = station.stationId;
                    var marker = new BMap.Marker(new BMap.Point(station.lng, station.lat), {
                        icon: no_select_icon
                    });
                    marker.isSelect = false;
                    marker.id = sid;
                    _self.addMarkClick(marker);
                    // 将标注添加到地图中
                    var obj = {
                        id: sid,
                        marker: marker
                    };
                    marker.addEventListener("mouseover", function () {
                        if (!station.district) {
                            station.district = '';
                        }
                        if (!station.addr) {
                            station.addr = '';
                        }
                        var content = station.stationTypeName + ' ' + station.stationName + ' [' + station.stationId + '] ' + station.district + '<br>' + station.addr;
                        openStationWin(station.lat, station.lng, content);
                    });
                    marker.addEventListener("mouseout", function () {
                        map.closeInfoWindow();
                    });
                    map.addOverlay(marker);
                    _self.markers.push(obj);
                });
            },
            addMarkClick: function (marker) {
                var _self = this;
                marker.addEventListener('click', function () {
                    var prevSel = _self.$refs.vuetable.selectedTo;
                    if (prevSel && prevSel.length > 0 && prevSel[0] != this.id) {
                        $.each(_self.markers, function (n, obj) {
                            if (obj.id == prevSel[0]) {
                                obj.marker.isSelect = false;
                                obj.marker.setIcon(no_select_icon);
                            }
                        });
                    }
                    _self.$refs.vuetable.selectedTo = [this.id];
                    this.isSelect = true;
                    this.setIcon(is_select_icon);
                    for (i in _self.stationList) {
                        if (_self.stationList[i].stationId == this.id) {
                            //$('#station_info_list').scrollTop((i - 1) * 33); //将滚动条滚动到指定的位置
                            var staList = $('#station_info_list');
                            staList.scrollTop(staList.scrollTop() + $("tr[item-index='" + i + "']", staList).offset().top - staList.height() / 2);
                        }
                    }
                });
            },
            clearMarkers: function () {
                var _self = this;
                $.each(_self.markers, function (n, obj) {
                    map.removeOverlay(obj.marker);
                });
                _self.markers = [];
            },
            clearSelectMarker: function () {
                var _self = this;
                var prevSel = _self.$refs.vuetable.selectedTo;
                if (prevSel.length > 0 && prevSel[0] != this.id) {
                    $.each(_self.markers, function (n, obj) {
                        if (obj.id == prevSel[0]) {
                            obj.marker.isSelect = false;
                            obj.marker.setIcon(no_select_icon);
                        }
                    });
                }
            },
            showSelectMarker: function () {
                var _self = this;
                var prevSel = _self.$refs.vuetable.selectedTo;
                var prevSelVal = prevSel && prevSel.length > 0 ? prevSel[0] : '';
                $.each(_self.markers, function (n, obj) {
                    var marker = obj.marker;
                    if (marker.isSelect && prevSelVal != obj.id) {
                        marker.isSelect = false;
                        marker.setIcon(no_select_icon);
                    } else if (!marker.isSelect && prevSelVal == obj.id) {
                        marker.isSelect = true;
                        marker.setIcon(is_select_icon);
                    }
                });
            },
            searchStation: function () {
                this.getReqParam();
            },
            queryStations: function () { //查询站点信息
                this.getReqParam();
                this.popWindwoShow('categ_popwindow');
            },
            resiteSelStations: function () {
                var _self = this;
                _self.khli = [];
                _self.wzli = [];
                _self.ycli = [];
                _self.pcli = [];
                _self.districtli = [];
            },
            getReqParam: function () {
                var _self = this;
                _self.params = {
                    'wzz': _self.wzli.join(","),
                    'khz': _self.khli.join(","),
                    'ycz': _self.ycli.join(","),
                    'pcz': _self.pcli.join(","),
                    'vocz': '',
                    'districts': _self.districts,
                    'stationId': _self.stationId,
                    'city': curr_city
                };
                _self.selectedTo = [];
                _self.$nextTick(function () {
                    _self.$refs.vuetable.refresh(); //_self.$broadcast('vuetable:refresh');
                });
            },
            onRightLoadSuccess: function (response) {
                var _self = this;
                response = response.data;
                if (response.erroCode == 2000) {
                    _self.stationList = response.result.data;
                    _self.initMap();
                } else {
                    _self.stationList = [];
                    _self.initMap();
                }
            },
            onRightLoading: function () {
                jQuery(this.$refs.vuetable.$el).addClass("vuetable-wrapper loading");
            },
            onRightLoaded: function () {
                jQuery(this.$refs.vuetable.$el).removeClass("vuetable-wrapper loading");
            },
            transformRight: function (response) {
                var transformed = {}
                transformed.pagination = {
                    from: 1
                };
                transformed.data = []
                response = response.result.data;
                for (var i = 0; i < response.length; i++) {
                    transformed['data'].push({
                        stationId: response[i].stationId,
                        stationName: response[i].stationName
                    })
                }
                return transformed;
            },
            addActivebtn: function (groupclass, index, fg, hideClass) {
                //groupclass 同一个按钮组的class ，index 处于当前组的下标
                $('.grounp_' + groupclass).removeClass('btn-tabinfo');
                $('.grounp_' + groupclass + ":eq(" + index + ")").addClass('btn-tabinfo');
            },
            toggleBtnStatue: function (group, key) {
                this.chartBtnStatus[group] = key;
                var pollutionArr = ['aqi', 'pm25', 'pm10', 'co', 'so2', 'no2', 'o3'];
                var index = arrAryIndex(pollutionArr, key);
                if (index < 0)
                    index = key;
                if (group.indexOf('_') >= 0) {
                    var subType = group.substring(0, group.indexOf('_'));
                    var group = group.substring(group.indexOf('_') + 1);
                    this.btnStatue[group].better = key == 1;
                    this.btnStatue[group].worst = key == 0;
                    this.initCharts(group, subType);
                } else {
                    this.addActivebtn(group, index);
                    this.initCharts(group);
                }
            },
            assembleData: function (data, r) {
                var _self = this;
                var tablePagination = {
                    total: r.result.totalCount,
                    per_page: r.result.perPage,
                    current_page: r.result.page,
                    last_page: Math.ceil(r.result.totalCount / r.result.perPage),
                    from: (r.result.page - 1) * r.result.perPage + 1,
                    to: Math.min(r.result.page * r.result.perPage, r.result.totalCount)
                };
                if (this.tabTypeName == 'allDistrict') {
                    this.allDtotal = tablePagination.total;
                } else if (this.tabTypeName == 'allStation') {
                    this.allStotal = tablePagination.total;
                }
                var fields = ['', '', 'stationId', 'name', 'aqi', 'aqimom', 'aqiyoy',
                    'pm25', 'pm25mom', 'pm25yoy', 'pm10', 'pm10mom', 'pm10yoy',
                    'co', 'comom', 'coyoy', 'so2', 'so2mom', 'so2yoy',
                    'no2', 'no2mom', 'no2yoy', 'o3', 'o3mom', 'o3yoy'
                ];
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var rowData = {};
                    for (var j = 0; j < fields.length; j++) {
                        if (fields[j] != '') {
                            rowData[fields[j]] = row[j];
                        }
                    }
                    datas.push(rowData);
                }
                return {
                    'page': tablePagination,
                    'dataVal': datas
                }
            },
            pageChange: function (pageIndex) {
                if (this.tabTypeName == 'allDistrict') {
                    this.allDpageIndex = pageIndex;
                    this.queryHistoryDataAnalysis('allDistrict', pageIndex);
                } else if (this.tabTypeName == 'allStation') {
                    this.allSpageIndex = pageIndex;
                    this.queryHistoryDataAnalysis('allStation', pageIndex);
                }
            },
            pageSizeChange: function (pageSize) {
                if (this.tabTypeName == 'allDistrict') {
                    this.allDpageIndex = 1;
                    this.allDpageSize = pageSize;
                    this.queryHistoryDataAnalysis('allDistrict', 1, pageSize);
                } else if (this.tabTypeName == 'allStation') {
                    this.allSpageIndex = 1;
                    this.allSpageSize = pageSize;
                    this.queryHistoryDataAnalysis('allStation', 1, pageSize);
                }
            },
            queryHistoryDataAnalysis: function (queryType, page, perPage) {
                //	debugger
                this.tabTypeName = queryType;
                var _self = this;
                if (queryType == 'byStation') {
                    $("#select_station").html("已选站点为：--");
                }
                $("#show_body_" + queryType).html("");
                var postData = {
                    cityId: curr_city,
                    queryType: queryType
                };
                var allQuery = false;
                if (queryType == 'byDistrict') {
                    if (!_self.districtSelect) {
                        layer.msg("请选择要查询数据的区县");
                        return false;
                    }
                    postData['district'] = _self.districtSelect;
                } else if (queryType == 'byStation') {
                    var stationName = this.getSelectedStationId();
                    if ("" == stationName || null == stationName) {
                        layer.msg("请输入站点名称/编号");
                        return false;
                    }
                    postData['station_id'] = stationName;
                } else {
                    allQuery = true;
                }
                var selDate = $("#startTime_" + queryType).val();
                if ("" == selDate || null == selDate) {
                    layer.msg("请选择" + (allQuery ? "年月" : "年份"));
                    return false;
                }
                selDate = selDate.replace(/[^0-9]/ig, "");
                postData['selYear'] = allQuery ? selDate.substring(0, 4) : selDate;
                if (allQuery)
                    postData['selMonth'] = selDate.substring(4, 6);
                if (allQuery) {
                    postData['page'] = page === undefined ? 1 : page;
                    postData['perPage'] = perPage === undefined ? 10 : perPage;
                }
                if (this.btn_toogle_statue == 0) {
                    this.toogleContianer();
                }
                if (!this.mapOpenStatus.noActive) {
                    this.openMap(); //如果地图处理打开状态，关闭地图
                }
                var url = $.coreApiPath + "/statistics/getHistoryDataAnalysisNew";
                this.dataQueryStatus[queryType] = true;
                ajax_post(url, postData, function (r) {
                    if (r.code == 2000) {
                        var html = "";
                        var data = r.result.list;
                        if (queryType == 'byStation') {
                            _self.dataList_byStation = data;
                            $("#select_station").html("已选站点为：" + r.result.district + "  " + r.result.addr + r.result.stationName + "  [" + r.result.stationId + "]");
                            var sTechType = r.result.sTechType;
                            if (sTechType == "1010") {//如果 是单参站点
                                $('.grounp_byStation').removeClass('btn-info').addClass("btn-dis").attr("disabled", "disabled");
                                $(".grounp_byStation:eq(0)").removeAttr("disabled").removeClass("btn-dis");
                                $(".grounp_byStation:eq(1)").removeAttr("disabled").removeClass("btn-dis");
                                _self.toggleBtnStatue('byStation', 'aqi');
                            } else {
                                $('.grounp_byStation').removeAttr("disabled").removeClass("btn-dis");
                            }
                        } else if (queryType == 'byDistrict') {
                            _self.dataList_byDistrict = data;
                        }
                        if (allQuery) { //判断是全部检索，需要单独添加分页设置
                            var getVal = _self.assembleData(data, r);
                            switch (queryType) {
                                case 'allDistrict': {
                                    _self.taballDistrict.allDistrictData = getVal.dataVal;
                                }
                                    break;
                                case 'allStation': {
                                    _self.taballStation.allStationData = getVal.dataVal;
                                }
                                    break;
                            }
                        } else {
                            var getVal = _self.assembleData(data, r);
                            for (var i = 0; i < data.length; i++) {
                                getVal.dataVal[i]['month'] = data[i][1]; //取出来月份
                            }
                            switch (queryType) {
                                case 'byDistrict': {
                                    _self.tabbyDistrict.byDistrictData = getVal.dataVal;
                                }
                                    break;
                                case 'byStation': {
                                    _self.tabbyStation.byStationData = getVal.dataVal;
                                }
                                    break;
                            }
                        }
                        _self.initCharts(queryType);
                    } else {
                        if (queryType == 'byStation') {
                            $("#select_station").html("");
                            _self.tabbyStation.byStationData == [];
                        } else if (queryType == 'byDistrict') {
                            $("#select_station").html("");
                            _self.tabbyDistrict.byDistrictData == [];
                        }
                        layer.msg("未查询到相关信息！");
                        return false;
                    }
                });
            },
            formatPollutionValue: function (tdVal) {
                return tdVal == null || tdVal == "" || tdVal == "-" ?
                    '--' : tdVal;
            },
            formatRateValue: function (tdVal) {
                //debugger
                var text = '';
                if (tdVal.indexOf("-") != -1 && tdVal.length > 1) {
                    text += "<div class=\"downgreen \">" + tdVal + "%" + "<b class=\"arrow-green-up\"></b></div>";
                } else {
                    if (tdVal == null || tdVal == "" || tdVal == "-") {
                        text += "--";
                    } else if (tdVal == "0.00") {
                        text += "<div class=\"ggreen\">" + tdVal + "%" + "</div>";
                    } else {
                        text += "<div class=\"upgred\">" + tdVal + "%" + "<b class=\"arrow-red-dow\"></b></div>";
                    }
                }
                return text;
            },
            onPaginationData_allDistrict: function (tablePagination) {
                this.$refs.paginationInfo_allDistrict.setPaginationData(tablePagination);
                this.$refs.pagination_allDistrict.setPaginationData(tablePagination);
            },
            onChangePage_allDistrict: function (page) {
                this.queryHistoryDataAnalysis('allDistrict', page, undefined);
            },
            onPaginationData_allStation: function (tablePagination) {
                this.$refs.paginationInfo_allStation.setPaginationData(tablePagination);
                this.$refs.pagination_allStation.setPaginationData(tablePagination);
            },
            onChangePage_allStation: function (page) {
                this.queryHistoryDataAnalysis('allStation', page, undefined);
            },
            initCharts: function (queryType, flag) {
                if (this.dataQueryStatus[queryType]) {
                    if (queryType == 'byDistrict' || queryType == 'byStation') {
                        this.initChartsQuerySingle(queryType, flag);
                    } else {
                        this.initChartsQueryAll(queryType, flag);
                    }
                }
            },
            initChartsQueryAll: function (queryType, flag) {
                this.initChartsTop10(queryType);
                if (flag != 'top10')
                    this.initChartsTop5(queryType);
            },
            initChartsTop5: function (queryType, flag) {
                var _self = this;
                var url = $.coreApiPath + "/statistics/findYoYRateTop5";
                var postData = {
                    cityId: curr_city,
                    queryType: queryType,
                    pollutionType: _self.chartBtnStatus[queryType],
                };
                var selDate = $("#startTime_" + queryType).val();
                if ("" == selDate || null == selDate) {
                    layer.msg("请选择年月");
                    return false;
                }
                selDate = selDate.replace(/[^0-9]/ig, "");
                postData['selYear'] = selDate.substring(0, 4);
                postData['selMonth'] = selDate.substring(4, 6);
                ajax_post(url, postData, function (r) {
                    if (r.code == 2000) {
                        var data = r.result;
                        var chartDom = document.getElementById('echart_top5_' + queryType);
                        var myChart = echarts.init(chartDom);
                        $(chartDom).resize(function () {
                            myChart.resize();
                        });
                        var valueListImprove = [];
                        var valueListWorsen = [];
                        $.each(data.valueList, function (i, v) {
                            valueListImprove.push(i < 5 ? -v : "");
                            valueListWorsen.push(i < 5 ? "" : -v);
                        });
                        var option = {
                            title: {
                                text: (queryType == 'allDistrict' ? '区县' : '站点') + _self.chartBtnStatus[queryType].toUpperCase() + '同比改善Top5排名',
                                textStyle: {
                                    fontSize: '12'
                                },
                                left: '35%'
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter: function (params) {
                                    var obj = JSON.parse(JSON.stringify(params))
                                    var itemName = obj[0].name;
                                    if (itemName) {
                                        var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
                                        for (var i = 0; i < obj.length; i++) {
                                            if (obj[i].value != '') {
                                                str = str + "<div class=\"tooltip-data\" ><b style=\"color: " + obj[i].color + ";\"> &bull;</b> " +
                                                    obj[i].seriesName + ":" + obj[i].value + (obj[i].seriesName != '浓度' ? '%' : '') + "</div><br/> ";
                                            }
                                        }
                                        return str;
                                    }
                                    return null;
                                }
                            },
                            color: ['#71E0B9', '#EF6E83'],
                            backgroundColor: '#fff',
                            legend: {
                                data: ['改善', '恶化'],
                                right: '10px',
                                selectedMode: false
                            },
                            grid: {
                                left: '4%',
                                right: '4%',
                                bottom: '10%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data: data.nameList,
                                axisLabel: {
                                    interval: 0,
                                    rotate: '30',
                                    margin: 8
                                },
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '10'
                                }
                            }],
                            yAxis: [{
                                type: 'value',
                                boundaryGap: ['0%', '5%']
                            }],
                            series: [{
                                name: '改善',
                                type: 'bar',
                                barWidth: 12,
                                stack: 'one',
                                itemStyle: {
                                    normal: {
                                        color: '#71E0B9'
                                    }
                                },
                                smooth: true,
                                data: valueListImprove
                            },
                                {
                                    name: '恶化',
                                    type: 'bar',
                                    barWidth: 12,
                                    stack: 'one',
                                    itemStyle: {
                                        normal: {
                                            color: '#EF6E83'
                                        }
                                    },
                                    smooth: true,
                                    data: valueListWorsen
                                }
                            ]
                        };
                        myChart.setOption(option);
                    }
                });
            },
            initChartsTop10: function (queryType, flag) {
                var _self = this;
                var url = $.coreApiPath + "/statistics/findPollutionTop10";
                var topType = _self.chartBtnStatus['top10_' + queryType] == 1 ? 'best' : 'worst';
                var postData = {
                    cityId: curr_city,
                    queryType: queryType,
                    pollutionType: _self.chartBtnStatus[queryType],
                    topType: topType
                };
                var selDate = $("#startTime_" + queryType).val();
                if ("" == selDate || null == selDate) {
                    layer.msg("请选择年月");
                    return false;
                }
                selDate = selDate.replace(/[^0-9]/ig, "");
                postData['selYear'] = selDate.substring(0, 4);
                postData['selMonth'] = selDate.substring(4, 6);
                ajax_post(url, postData, function (r) {
                    if (r.code == 2000) {
                        var data = r.result;
                        var chartDom = document.getElementById('echart_top10_' + queryType);
                        var myChart = echarts.init(chartDom);
                        $(chartDom).resize(function () {
                            myChart.resize();
                        });
                        var option = {
                            title: {
                                text: (queryType == 'allDistrict' ? '区县' : '站点') + _self.chartBtnStatus[queryType].toUpperCase() + ' Top10排名',
                                textStyle: {
                                    fontSize: '12'
                                },
                                left: '35%'
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter: function (params) {
                                    var obj = JSON.parse(JSON.stringify(params))
                                    var itemName = obj[0].name;
                                    if (itemName) {
                                        var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
                                        for (var i = 0; i < obj.length; i++) {
                                            var value = '';
                                            if (obj[i].seriesName == null || obj[i] == "") {
                                                value = '--';
                                            } else {
                                                value = obj[i].value;
                                            }
                                            str = str + "<div class=\"tooltip-data\" ><b style=\"color: " + obj[i].color + ";\"> &bull;</b> " +
                                                obj[i].seriesName + ":" + value + "</div><br/> ";
                                        }
                                        return str;
                                    }
                                    return null;
                                }
                            },
                            color: [topType == 'best' ? '#3FAE70' : '#B31403'],
                            backgroundColor: '#fff',
                            grid: {
                                left: '4%',
                                right: '4%',
                                bottom: '10%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data: data.nameList,
                                axisLabel: {
                                    interval: 0,
                                    rotate: '30',
                                    margin: 8
                                },
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '10'
                                }
                            }],
                            yAxis: [{
                                type: 'value',
                                boundaryGap: ['0%', '5%']
                            }],
                            series: [{
                                name: _self.chartBtnStatus[queryType].toUpperCase(),
                                type: 'bar',
                                barWidth: 12,
                                itemStyle: {
                                    normal: {
                                        color: topType == 'best' ? '#3FAE70' : '#B31403'
                                    }
                                },
                                smooth: true,
                                data: data.valueList
                            }]
                        };
                        myChart.setOption(option);
                    }
                });
            },
            initChartsQuerySingle: function (queryType, flag) {
                var _self = this;
                var data = {
                    nameList: [],
                    momList: [],
                    yoyList: [],
                    dataList: []
                };
                var pollutionArr = ['aqi', 'pm25', 'pm10', 'co', 'so2', 'no2', 'o3'];
                var index = arrAryIndex(pollutionArr, _self.chartBtnStatus[queryType]);
                var dataArray = queryType == 'byDistrict' ? _self.dataList_byDistrict : _self.dataList_byStation;
                $.each(dataArray, function (i, row) {
                    data.nameList.push(row[1]);
                    data.dataList.push(row[4 + index * 3]);
                    data.momList.push(row[4 + index * 3 + 1]);
                    data.yoyList.push(row[4 + index * 3 + 2]);
                });
                var polutionLevel, colorsLevel = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023'];
                switch (pollutionArr[index].toUpperCase()) {
                    case 'PM10': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 50,
                            color: colorsLevel[0]
                        }, {
                            gt: 50,
                            lte: 150,
                            color: colorsLevel[1]
                        }, {
                            gt: 150,
                            lte: 250,
                            color: colorsLevel[2]
                        }, {
                            gt: 250,
                            lte: 350,
                            color: colorsLevel[3]
                        }, {
                            gt: 350,
                            lte: 420,
                            color: colorsLevel[4]
                        }, {
                            gt: 420,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'PM25': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 35,
                            color: colorsLevel[0]
                        }, {
                            gt: 35,
                            lte: 75,
                            color: colorsLevel[1]
                        }, {
                            gt: 75,
                            lte: 115,
                            color: colorsLevel[2]
                        }, {
                            gt: 115,
                            lte: 150,
                            color: colorsLevel[3]
                        }, {
                            gt: 150,
                            lte: 250,
                            color: colorsLevel[4]
                        }, {
                            gt: 250,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'O3': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 160,
                            color: colorsLevel[0]
                        }, {
                            gt: 160,
                            lte: 200,
                            color: colorsLevel[1]
                        }, {
                            gt: 200,
                            lte: 300,
                            color: colorsLevel[2]
                        }, {
                            gt: 300,
                            lte: 400,
                            color: colorsLevel[3]
                        }, {
                            gt: 400,
                            lte: 800,
                            color: colorsLevel[4]
                        }, {
                            gt: 800,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'SO2': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 150,
                            color: colorsLevel[0]
                        }, {
                            gt: 150,
                            lte: 500,
                            color: colorsLevel[1]
                        }, {
                            gt: 500,
                            lte: 650,
                            color: colorsLevel[2]
                        }, {
                            gt: 650,
                            lte: 800,
                            color: colorsLevel[3]
                        }, {
                            gt: 800,
                            lte: 1600,
                            color: colorsLevel[4]
                        }, {
                            gt: 1600,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'CO': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 5,
                            color: colorsLevel[0]
                        }, {
                            gt: 5,
                            lte: 10,
                            color: colorsLevel[1]
                        }, {
                            gt: 10,
                            lte: 35,
                            color: colorsLevel[2]
                        }, {
                            gt: 35,
                            lte: 60,
                            color: colorsLevel[3]
                        }, {
                            gt: 60,
                            lte: 90,
                            color: colorsLevel[4]
                        }, {
                            gt: 90,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'AQI':
                    case 'AQI2': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 50,
                            color: colorsLevel[0]
                        }, {
                            gt: 50,
                            lte: 100,
                            color: colorsLevel[1]
                        }, {
                            gt: 100,
                            lte: 150,
                            color: colorsLevel[2]
                        }, {
                            gt: 150,
                            lte: 200,
                            color: colorsLevel[3]
                        }, {
                            gt: 200,
                            lte: 300,
                            color: colorsLevel[4]
                        }, {
                            gt: 300,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'NO2': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 100,
                            color: colorsLevel[0]
                        }, {
                            gt: 100,
                            lte: 200,
                            color: colorsLevel[1]
                        }, {
                            gt: 200,
                            lte: 700,
                            color: colorsLevel[2]
                        }, {
                            gt: 700,
                            lte: 1200,
                            color: colorsLevel[3]
                        }, {
                            gt: 1200,
                            lte: 2340,
                            color: colorsLevel[4]
                        }, {
                            gt: 2340,
                            color: colorsLevel[5]
                        }];
                    }
                        break;
                    case 'VOCS': {
                        polutionLevel = [{
                            gt: 0,
                            lte: 400,
                            color: colorsLevel[0]
                        }, {
                            gt: 400,
                            lte: 1000,
                            color: colorsLevel[1]
                        }, {
                            gt: 1000,
                            color: colorsLevel[2]
                        }];
                    }
                        break;
                }
                var chartDom = document.getElementById('echart_' + queryType);
                var myChart = echarts.init(chartDom);
                $(chartDom).resize(function () {
                    myChart.resize();
                });
                var titleTemp = _self.chartBtnStatus[queryType].toUpperCase(); //"TOP10";
                var option = {
                    /*
					title: {
					    text: titleTemp,
					    textStyle: {
					        fontSize: '12'
					    },
					    left: '35%'
					},//*/
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            var obj = JSON.parse(JSON.stringify(params))
                            var itemName = obj[0].name;
                            if (itemName) {
                                var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
                                for (var i = 0; i < obj.length; i++) {
                                    var value = '';
                                    if (obj[i].value == null || obj[i].value == '' || obj[i].value == '-') {
                                        value = '--';
                                    } else {
                                        value = obj[i].value + (obj[i].seriesName != '浓度' ? '%' : '');
                                    }
                                    str = str + "<div class=\"tooltip-data\" ><b style=\"color: " + obj[i].color + ";\"> &bull;</b> " +
                                        obj[i].seriesName + ":" + value + "</div><br/> ";
                                }
                                return str;
                            }
                            return null;
                        }
                    },
                    color: ['#006400', '#2F6DBA', '#00DDD8'],
                    backgroundColor: '#fff',
                    legend: {
                        data: ['浓度', '环比', '同比'],
                        left: '20%', //'10px',
                        selectedMode: false
                    },
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.nameList,
                        axisLabel: {
                            interval: 0,
                            rotate: '30',
                            margin: 8
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: '10'
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '浓度',
                        boundaryGap: ['0%', '5%'],
                        splitNumber: 5,
                        splitLine: {
                            show: false
                        }
                    },
                        {
                            type: 'value',
                            name: '比率',
                            boundaryGap: ['0%', '5%'],
                            splitNumber: 5,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        }
                    ],
                    visualMap: {
                        show: false,
                        top: 0,
                        right: 190,
                        orient: 'horizontal',
                        pieces: polutionLevel,
                        outOfRange: {
                            color: '#000'
                        },
                        seriesIndex: 0,
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    series: [{
                        name: '浓度',
                        type: 'line',
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: {
                                color: "#00E400"
                            }
                        },
                        smooth: true,
                        data: data.dataList
                    },
                        {
                            name: '环比',
                            type: 'bar',
                            yAxisIndex: 1,
                            barWidth: 12,
                            itemStyle: {
                                normal: {
                                    color: "#2F6DBA"
                                }
                            },
                            data: data.momList
                        },
                        {
                            name: '同比',
                            type: 'bar',
                            yAxisIndex: 1,
                            barWidth: 12,
                            itemStyle: {
                                normal: {
                                    color: "#00DDD8"
                                }
                            },
                            data: data.yoyList
                        }
                    ]
                };
                myChart.setOption(option);
            }
        }
    });
});
$(document).bind('click', function (e) {
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    while (elem) {
        if (elem.id && elem.id == 'category-station') {
            return;
        }
        elem = elem.parentNode;
    }
    $('.categ_popwindow').hide();
})