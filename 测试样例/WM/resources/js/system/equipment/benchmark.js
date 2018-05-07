var tableColumns = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center'
    },
    {
        name: 'stationId',
        title: '监测点编号',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stationName',
        title: '监测点名称',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stationType', //count
        title: '站点类型',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stType',
        title: '设备类型',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'pcd',
        title: '省市区',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ref_station_1',
        title: '标站1',
        titleClass: 'text-center',
        dataClass: 'text-center'

    },
    {
        name: 'ratio_1',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'ref_station_2',
        title: '标站2',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ratio_2',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'ref_station_3',
        title: '标站3',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ratio_3',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'insTime',
        title: '寻标时间',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'operator',
        title: '操作人',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];

function rTrim(str) {
    var iLength = str.length;
    if (str.charAt(iLength - 1) == " ") {
        //如果字串右边第一个字符为空格
        str = str.slice(0, iLength - 1); //将空格从字串中去掉
        //这一句也可改成 str = str.substring(0, iLength - 1);
        str = rTrim(str); //递归调用
    }
    return str;
}


new Vue({
    el: "#tabs-container",
    data: {
        allFunctions: {},
        showRealTab: false,
        showHisTab: false,
        realActive: true,
        historyActive: false,
    },
    beforeCompile: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                var showResult = getShowResult(_self.allFunctions);
                _self.showRealTab = showResult.showRealTab;
                _self.showHisTab = showResult.showHisTab;
                _self.realActive = showResult.realActive;
                _self.historyActive = showResult.historyActive;
            } else {
                _self.allFunctions = {};
                _self.showRealTab = false;
                _self.showHisTab = false;
                _self.realActive = false;
                _self.historyActive = false;
            }
        });

    }, mounted: function () {

    }
});


function getShowResult(allFunctions) {
    var showRealTab = allFunctions['ROLE_FUN_102_03_01_01'] != undefined;
    var showHisTab = allFunctions['ROLE_FUN_102_03_01_02'] != undefined;
    var showBenchmarkTip = allFunctions['ROLE_FUN_102_03_01_03'] != undefined;
    var realActive = false;
    var historyActive = false;
    if (showRealTab && showHisTab) {
        realActive = true;
        historyActive = false;
    } else if (!showRealTab && showHisTab) {
        realActive = false;
        historyActive = true;
    } else if (showRealTab && !showHisTab) {
        realActive = true;
        historyActive = false;
    }
    return {
        showRealTab: showRealTab,
        showBenchmarkTip: showBenchmarkTip,
        showHisTab: showHisTab,
        realActive: realActive,
        historyActive: historyActive
    }
}

Vue.config.debug = false;
var vbenchmarkVM = new Vue({
    el: '#tab-benchmark',
    data: {
        initTable: true,
        perPage: 10, //初始化每页显示多少条
        showPagination: true, //是否真是分页
        pageList: [10, 20, 30, 40, 50], //分页选项
        fields: tableColumns, //表格的表头设置
        prolist: [],
        citylist: [], //
        province: -1, //
        city: -1, //
        stationType: -1,
        stationTypeList: [], //站点类型
        deviceType: -1,
        deviceTypeList: [],
        selStation: '',
        params: [
            'provinceId=' + parent.provinceId,
            'cityId=' + parent.cityId,
            'sTechType=-1',
            'stationType=-1',
            'stationId=-1'
        ],
        loadOnStart: true,
        allFunctions: {},
        showReal: false,
        realActive: false,
        showBenchmarkTip: false
    },
    beforeCompile: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;

                var showResult = getShowResult(_self.allFunctions);
                _self.showReal = showResult.showRealTab;
                _self.showBenchmarkTip = showResult.showBenchmarkTip;
                _self.realActive = showResult.realActive;


            } else {
                _self.allFunctions = {};
                _self.showReal = false;
                _self.showBenchmarkTip = false;
            }
        });
    },
    ready: function () {
        var that = this;
        CommonUtil.ajax({
            type: "get",
            url: $.coreApiPath + '/domain/cascade/0',
            dataType: "json",
            sucessFn: function (data) {
                if (data) {
                    that.prolist = data.provinceList;
                    that.province = -1;
                    for (var i in that.prolist) {
                        if (that.prolist[i].id == parent.provinceId) {
                            that.province = parent.provinceId;
                        }
                    }
                    if (that.province == -1) {
                        that.province = data.provinceList[0].id;
                    }
                }
            },
            errorFn: function (errorMsg) {
                layer.msg('网络或服务器异常，请稍后重试！');
            }
        });

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
                layer.msg('');
            }
        });
    },
    events: {},
    watch: {
        perPage: function () {
            this.$broadcast('vuetable:refresh');
        },
        province: function () {
            var that = this;
            if (that.prolist.length < 2) {
                return;
            }
            if (this.province == -1) {
                this.citylist = [];
            } else {
                CommonUtil.ajax({
                    type: "get",
                    url: $.coreApiPath + '/domain/child/' + that.province,
                    dataType: "json",
                    sucessFn: function (data) {
                        if (data) {
                            that.citylist = data;
                            that.city = -1;
                            for (var i in that.citylist) {
                                if (that.citylist[i].id == parent.cityId) {
                                    that.city = parent.cityId;
                                }
                            }
                            if (that.city == -1) {
                                that.city = data[0].id;
                            }
                            var url = $.coreApiPath + "/dictionary/diviceType2?type=11&city=" + that.city + "&pro=" + that.province;
                            $.get(url, function (data) {
                                that.deviceTypeList = data;
                            });
                            if (that.initTable) {
                                that.search();
                                that.initTable = false;
                            }

                        }
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('网络或服务器异常，请稍后重试！');
                    }
                });
            }
        },
        selStation: function () {
            var msg = rTrim(this.selStation);
            var letter_num = 50 - msg.length;
            if (letter_num == 0) {
                this.selStation = msg.substring(0, 50);
            } else if (letter_num < 0) {
                this.selStation = msg.substring(0, 50);
                layer.msg('输入的内容不得大于50字！');
            }
        },
    },
    methods: {
        convert_val: function (val) {
//		if(val==''){
//		return val
//		}
            if (val == 0.00) {
                return ''
            }
            var valHtml = Math.floor(val * 100);
            //			alert(valHtml)
            return valHtml + '%';
        },
        search: function () {
            var stationIdVal = this.selStation;
            if (stationIdVal == '') {
                stationIdVal = '-1';
            }
            var param = {
                provinceId: this.province,
                cityId: this.city,
                sTechType: this.deviceType,
                stationType: this.stationType,
                stationId: stationIdVal
            };
            if (param.startTime > param.endTime) {
                layer.msg('开始时间不能大于结束时间！');
                return;
            }
            var sp = CommonUtil.json2Array(param);
            for (var i = 0; i < sp.length; i++) {
                this.params.push(sp[i]);
            }
            this.$nextTick(function () {
                this.$broadcast('vuetable:refresh');
            });

        },
        paginationConfig: function (componentName) {
            if (componentName == 'vuetable-pagination') {
                this.$broadcast('vuetable-pagination:set-options', {
                    wrapperClass: 'pagination',
                    icons: {
                        first: '',
                        prev: '',
                        next: '',
                        last: ''
                    },
                    activeClass: 'active',
                    linkClass: 'btn btn-white',
                    pageClass: 'btn btn-white'
                });
            }
        },

        showtip: function () {
            CommonUtil.ajax({
                type: "get",
                url: $.coreApiPath + '/benchmark/searchMark/' + this.city,
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    if (data == 'ok') {
                        layer.msg('寻找标杆任务已下发，<br/>请10分钟后进行查询新标杆信息!');
                    }
                },
                errorFn: function (errorMsg) {
                    layer.msg('请求失败！');
                }
            });
        }
    },
    events: {
        'vuetable:cell-mouseenter': function (data, field, event) {
            var fieldNname = field.name;
            if (fieldNname == 'stationName') {
                var tip = '';
                if (data['addr'] == '') {
                    tip = '站点地址待上传';
                } else {
                    tip = data['addr'];
                }
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
            /////////鼠标移入标站显示标站详细
            if (fieldNname == 'ref_station_1') {
                if (data['ref_station_1_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_1_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }

            if (fieldNname == 'ref_station_2') {
                if (data['ref_station_2_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_2_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }

            if (fieldNname == 'ref_station_3') {
                if (data['ref_station_3_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_3_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
        },
        'vuetable:cell-mouseleave': function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        }
    }
});

var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy-MM-dd hh:mm'
});

var start = new Date(myDate.year, myDate.month - 1, myDate.day - 6, myDate.hour, 0),
    end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
var initSEndTime = {
    startTime: myDate.formatDate(start, "yyyy-MM-dd"),
    endTime: myDate.formatDate(end, "yyyy-MM-dd")
};


var historyTableColumns = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center'
    },
    {
        name: 'stationId',
        title: '监测点编号',
        sortField: 'stationId',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stationName',
        title: '监测点名称',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stationType', //count
        title: '站点类型',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'stType',
        title: '设备类型',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'pcd',
        title: '省市区',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ref_station_1',
        title: '标站1',
        titleClass: 'text-center',
        dataClass: 'text-center'

    },
    {
        name: 'ratio_1',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'ref_station_2',
        title: '标站2',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ratio_2',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'ref_station_3',
        title: '标站3',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'ratio_3',
        title: '权重',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'convert_val'
    },
    {
        name: 'insTime',
        title: '寻标时间',
        sortField: 'insTime',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'operator',
        title: '操作人',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];

new Vue({
    el: '#tab-history-benchmark',
    data: {
        initTable: true,
        perPage: 10, //初始化每页显示多少条
        showPagination: true, //是否真是分页
        pageList: [10, 20, 30, 40, 50], //分页选项
        fields: historyTableColumns, //表格的表头设置
        prolist: [],
        citylist: [], //
        province: -1, //
        city: -1, //
        stationType: -1,
        stationTypeList: [], //站点类型
        deviceType: -1,
        deviceTypeList: [],
        selStation: '',
        startTime: initSEndTime.startTime,
        endTime: initSEndTime.endTime,
        operator: '',
        params: [
            'provinceId=' + parent.provinceId,
            'cityId=' + parent.cityId,
            'sTechType=-1',
            'hisFlag=1',
            'stationType=-1',
            'operator=',
            'startTime=' + initSEndTime.startTime,
            'endTime=' + initSEndTime.startTime + ' 23:59:59',
            'stationId=-1'
        ],
        showHistory: false,
        historyActive: false,
        allFunctions: {}
    },
    beforeCompile: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;

                var showResult = getShowResult(_self.allFunctions);
                _self.showHistory = showResult.showHisTab;

                _self.historyActive = showResult.historyActive;
                if (_self.historyActive) {
                    _self.loadOnStart = true;
                }
            } else {
                _self.allFunctions = {};
                _self.showHistory = false;
                _self.historyActive = false;
            }
        });
    },
    ready: function () {
        var that = this;
        CommonUtil.ajax({
            type: "get",
            url: $.coreApiPath + '/domain/cascade/0',
            dataType: "json",
            sucessFn: function (data) {
                if (data) {
                    that.prolist = data.provinceList;
                    that.province = -1;
                    for (var i in that.prolist) {
                        if (that.prolist[i].id == parent.provinceId) {
                            that.province = parent.provinceId;
                        }
                    }
                    if (that.province == -1) {
                        that.province = data.provinceList[0].id;
                    }
                }
            },
            errorFn: function (errorMsg) {
                layer.msg('网络或服务器异常，请稍后重试！');
            }
        });

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
                layer.msg('');
            }
        });
    },
    events: {},
    watch: {
        perPage: function () {
            this.$broadcast('vuetable:refresh');
        },
        province: function () {
            var that = this;
            if (that.prolist.length < 2) {
                return;
            }
            if (this.province == -1) {
                this.citylist = [];
            } else {
                CommonUtil.ajax({
                    type: "get",
                    url: $.coreApiPath + '/domain/child/' + that.province,
                    dataType: "json",
                    sucessFn: function (data) {
                        if (data) {
                            that.citylist = data;
                            that.city = -1;
                            for (var i in that.citylist) {
                                if (that.citylist[i].id == parent.cityId) {
                                    that.city = parent.cityId;
                                }
                            }
                            if (that.city == -1) {
                                that.city = data[0].id;
                            }
                            var url = $.coreApiPath + "/dictionary/diviceType2?type=11&city=" + that.city + "&pro=" + that.province;
                            $.get(url, function (data) {
                                that.deviceTypeList = data;
                            });
                            if (that.initTable) {
                                that.search();
                                that.initTable = false;
                            }

                        }
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('网络或服务器异常，请稍后重试！');
                    }
                });
            }
        },
        selStation: function () {
            var msg = rTrim(this.selStation);
            var letter_num = 50 - msg.length;
            if (letter_num == 0) {
                this.selStation = msg.substring(0, 50);
            } else if (letter_num < 0) {
                this.selStation = msg.substring(0, 50);
                layer.msg('输入的内容不得大于50字！');
            }
        },
    },
    methods: {
        convert_val: function (val) {
            if (val == 0.00) {
                return ''
            }
            var valHtml = Math.floor(val * 100);
            return valHtml + '%';
        },
        search: function () {
            var stationIdVal = this.selStation;
            if (stationIdVal == '') {
                stationIdVal = '-1';
            }
            var param = {
                provinceId: this.province,
                cityId: this.city,
                sTechType: this.deviceType,
                stationType: this.stationType,
                operator: this.operator,
                startTime: this.startTime,
                endTime: this.endTime,
                hisFlag: 1,
                stationId: stationIdVal
            };
            if (param.startTime > param.endTime) {
                layer.msg('开始时间不能大于结束时间！');
                return;
            }
            if (!calcDate_interval(param.startTime, param.endTime, '1month')) {
                return;
            }
            var sp = CommonUtil.json2Array(param);
            for (var i = 0; i < sp.length; i++) {
                if (sp[i].indexOf('endTime') > -1) {
                    this.params.push(sp[i] + ' 23:59:59');
                } else {
                    this.params.push(sp[i]);
                }

            }
            this.$nextTick(function () {
                this.$broadcast('vuetable:refresh');
            });

        },
        paginationConfig: function (componentName) {
            if (componentName == 'vuetable-pagination') {
                this.$broadcast('vuetable-pagination:set-options', {
                    wrapperClass: 'pagination',
                    icons: {
                        first: '',
                        prev: '',
                        next: '',
                        last: ''
                    },
                    activeClass: 'active',
                    linkClass: 'btn btn-white',
                    pageClass: 'btn btn-white'
                });
            }
        },
    },
    events: {
        'vuetable:cell-mouseenter': function (data, field, event) {
            var fieldNname = field.name;
            if (fieldNname == 'stationName') {
                var tip = '';
                if (data['addr'] == '') {
                    tip = '站点地址待上传';
                } else {
                    tip = data['addr'];
                }
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
            /////////鼠标移入标站显示标站详细
            if (fieldNname == 'ref_station_1') {
                if (data['ref_station_1_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_1_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }

            if (fieldNname == 'ref_station_2') {
                if (data['ref_station_2_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_2_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }

            if (fieldNname == 'ref_station_3') {
                if (data['ref_station_3_name'] == '') {
                    return;
                }
                tip = '';
                tip = data['ref_station_3_name'];
                layer.tips(tip, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
        },
        'vuetable:cell-mouseleave': function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        }
    }
});