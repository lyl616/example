var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy-MM-dd hh:mm'
});

var curr_pro = parent.provinceId,
    curr_city = parent.cityId,
    req_startTime = '', //请求的开始时间
    req_endTime = '', //请求的结束时间
    initSEndTime = {
        currDay: {
            startTime: initradioDate('1day', 1).start,
            endTime: initradioDate('1day', 1).end
        },
        threeDay: {
            startTime: initradioDate('3day', 1).start,
            endTime: initradioDate('3day', 1).end
        },
        oneWeek: {
            startTime: initradioDate('1week', 1).start,
            endTime: initradioDate('1week', 1).end
        },
        oneMonth: {
            startTime: initradioDate('1month', 1).start,
            endTime: initradioDate('1month', 1).end
        }
    };

$(function () {
    myDate.format = 'yyyy-MM-dd hh:mm';
    Vue.component('my-date-component', {
        props: ["fmt", "maxdate", "starttime", "endtime", "scope"],
        template: [
            '<input id="startTime" v-model="starttime" class="form-control Wdate w150" ' +
            'onfocus="WdatePicker({dateFmt:\'{{fmt}}\', autoPickDate: true,onpicked:function() { $(this).blur(); },maxDate:\'{{maxdate}}\'})" type="text"  />',
            '<span class="input-group-addon" style="width:13px; padding: 0 5px; margin-left: -1px;">-</span>',
            '<input id="endTime" v-model="endtime" class="form-control Wdate w150" type="text" ' +
            'onfocus="WdatePicker({dateFmt:\'{{fmt}}\',autoPickDate: true,onpicked:function() { $(this).blur(); },maxDate:\'{{maxdate}}\'})" />'
        ].join("")
    });

    Vue.component('my-date-component-his', {
        props: ["fmt", "maxdate", "hisstarttime", "hisendtime", "scope"],
        template: [
            '<input id="his-startTime" v-model="hisstarttime" class="form-control Wdate w150" ' +
            'onfocus="WdatePicker({dateFmt:\'{{fmt}}\', autoPickDate: true,onpicked:function() { $(this).blur(); },maxDate:\'{{maxdate}}\'})" type="text"  />',
            '<span class="input-group-addon" style="width:13px; padding: 0 5px; margin-left: -1px;">-</span>',
            '<input id="his-endTime" v-model="hisendtime" class="form-control Wdate w150" type="text" ' +
            'onfocus="WdatePicker({dateFmt:\'{{fmt}}\',autoPickDate: true,onpicked:function() { $(this).blur(); },maxDate:\'{{maxdate}}\'})" />'
        ].join("")
    });

    var tableColumns = [
        {
            name: '__sequence',
            title: '序号',
            titleClass: 'text-center'
        },
        {
            name: 'stationId',
            title: '站点编号',
            sortField: 'stationId',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }, {
            name: 'stationName',
            title: '站点名称',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }, {
            name: 'rtcTime',
            title: '时间',
            sortField: 'rtcTime',
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: 'rtcTimeFormat'
        }, {
            name: 'PM25',
            title: 'PM2.5',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        }, {
            name: 'PM10',
            title: 'PM10',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        }, {
            name: 'SO2',
            title: 'SO2',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'NO2',
            title: 'NO2',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'CO',
            title: 'CO',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'O3',
            title: 'O3',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'O3_8h',
            title: 'O3_8h',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'PM25_24h',
            title: 'PM2.5_24h',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'PM10_24h',
            title: 'PM10_24h',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'pollutionType',
            title: '污染物',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'pollutionFormat'
        },
        {
            name: 'pollutionValue',
            title: '异常值',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'styleFormat'
        },
        {
            name: 'validComment',
            title: '异常类别',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        },
        {
            name: 'valid',
            title: '审核操作',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'validFormat'
        },
        {
            name: 'reason',
            title: '审核原因',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel',
            callback: 'reasonFormat'
        },
        {
            name: 'verifyTime',
            title: '审核时间',
            sortField: 'verifyTime',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        },
        {
            name: 'auditorName',
            title: '审核员',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        }
    ];

    Vue.config.debug = true;

    new Vue({
        el: "#content",
        data: {
            optionValidReason: [{
                value: "0",
                text: "其他"
            }], //审核原因
            validRadio: 1, //数据有效1/无效3，默认3无效
            verifySelectReason: 0,
            showExceptionType: 1, //是否展示异常类别下拉
            validDataBtn: 1, //查询全部或待审核数据按钮
            option_valid: [], //质控类型
            option_category: [], //异常类型
            option_audit: [], //审核操作类型
            option_city: [],//选择城市
            selected_city: "-1",
            selected_hiscity: "-1",
            option_district: [],//选择区县
            option_hisdistrict: [],//选择区县
            selected_district: "-1",
            selected_hisdistrict: "-1",
            selected_valid: "-1",//质控类型
            selected_hisvalid: "-1",//审核操作
            selected_category: '-1',//异常类别
            selected_hiscategory: '-1',
            querydateType: '1day', //时间类型，默认为当天
            querydateTypeHis: '1day', //审核历史时间类型，默认为当天
            autodateType: '',
            queryStationType: ['6010,1010'], //微站、考核站
            querypollutionType: ['PM25', 'PM25_24h', 'PM10', 'PM10_24h', 'CO', 'SO2', 'NO2', 'O3', 'O3_8h'], //污染物类型
            querypollutionTypeHis: ['PM25', 'PM10', 'CO', 'SO2', 'NO2', 'O3'], //审核历史污染物类型
            intervel_time: 1, //1 小时  2 天
            dealTabletime_type: 1,
            verifyReason: "",
            fmt: "yyyy-MM-dd HH:00",
            maxdate: "%y-%M-%d %H%0",
            endtime: '',
            starttime: '',
            hisendtime: '',
            hisstarttime: '',
            day_startTime: '',
            day_endTime: '',
            day_hisStartTime: '',
            day_hisEndTime: '',
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            selpollutionType: 1,
            selpollutionTypeHis: 1,
            searchParams_stationIdOrName: '',//监测点编号或者名称
            searchParams_hisStationIdOrName: '',
            searchParams_auditorName: '',//审核员
            showType: 0,//数据审核：0矩阵，1列表
            historyType: 0,//数据审核0，1数据审核历史
            listColumnsName: ['pollutionType', 'pollutionValue', 'validComment'],
            listHistoryColumnsName: ['pollutionType', 'pollutionValue', 'validComment', 'valid', 'reason', 'verifyTime', 'auditorName'],
            multiSort: true,
            allFunctions: {},
            dataAudit: {
                real: false,
                history: false,
                output: false
            },
            params: [
                'startTime=' + initSEndTime.currDay.startTime,
                'endTime=' + initSEndTime.currDay.endTime,
                'timeType=1',
                'pro=' + curr_pro,
                'city=' + curr_city
            ],
            isRealActive: false
        },
        ready: function () {
            var _self = this;
            _self.initAllFunctions();


            //城市列表
            ajax_get($.coreApiPath + "/domain/getDomains", {}, function (data) {
                if (data.erroCode = 2000) {
                    $.each(data.result, function (index, val) {
                        _self.option_city.push({id: val.id, name: val.domainName});
                    });
                }
            });

            //获取所有质控类别
            ajax_get($.coreApiPath + "/data/verify/validType", {}, function (data) {
                if (data) {
                    _self.option_valid = data;
                }
            });

            //获取所有异常类别
            ajax_get($.coreApiPath + "/data/verify/exceptionType", {}, function (data) {
                if (data) {
                    _self.option_category = data;
                }
            })

        },
        watch: {
            //选择污染物--单个
            querypollutionType: function () {
                var arrLength = this.querypollutionType.length;
                //数据审核
                if (this.intervel_time == 1) {
                    if (arrLength == 9) {
                        this.selpollutionType = 1;
                    } else if (arrLength != 9) {
                        this.selpollutionType = -1;
                    }
                } else if (this.intervel_time == 2) {
                    if (arrLength == 7) {
                        this.selpollutionType = 1;
                    } else if (arrLength != 7) {
                        this.selpollutionType = -1;
                    }
                }
            },

            //审核历史选择污染物--单个
            querypollutionTypeHis: function () {
                var arrLength = this.querypollutionTypeHis.length;
                //数据审核历史
                //小时
                if (this.intervel_histime == 1) {
                    if (arrLength == 6) {
                        this.selpollutionTypeHis = 1;
                    } else if (arrLength != 6) {
                        this.selpollutionTypeHis = -1;
                    }
                }
            },

            //选择污染物--全部
            selpollutionType: function () {
                //全部
                if (this.selpollutionType == 1) {
                    if (this.intervel_time == 1) {
                        //小时
                        this.querypollutionType = ['PM25', 'PM25_24h', 'PM10', 'PM10_24h', 'CO', 'SO2', 'NO2', 'O3', 'O3_8h']; //污染物类型
                    } else if (this.intervel_time == 2) {
                        //天
                        this.querypollutionType = ['O3', 'O3_8h', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型
                    }
                } else if (this.selpollutionType == 0) {
                    this.querypollutionType = [];
                }
            },

            //数据审核历史选择污染物--全部
            selpollutionTypeHis: function () {
                //全部
                if (this.selpollutionTypeHis == 1) {
                    this.querypollutionTypeHis = ['PM25', 'PM10', 'CO', 'SO2', 'NO2', 'O3']; //污染物类型
                } else if (this.selpollutionTypeHis == 0) {
                    this.querypollutionTypeHis = [];
                }
            },

            //数据审核--原因
            verifyReason: function () {
                var msg = rTrim(this.verifyReason);
                var letter_num = 30 - msg.length;
                if (letter_num == 0) {
                    this.verifyReason = msg.substring(0, 30);
                } else if (letter_num < 0) {
                    this.verifyReason = msg.substring(0, 30);
                    layer.msg('输入的内容不得大于30字！');
                }
            },

            //数据有效、数据无效切换事件
            validRadio: function () {
                var self = this;
                if (self.validRadio == 1) {
                    self.optionValidReason = [{
                        value: "0",
                        text: "其他"
                    }];
                    self.verifySelectReason = 0;
                    $("#verifyInputReason").removeAttr("disabled");
                } else if (self.validRadio == 3) {
                    self.optionValidReason = [{
                        value: "0",
                        text: "其他"
                    }, {
                        value: "设备故障",
                        text: "设备故障"
                    }];
                }
                $("#verifyInputReason").show();
            },

            //时间间隔切换事件（小时，天）
            intervel_time: function () {
                var that = this;

                var time = initradioDate(that.querydateType, that.intervel_time);

                that.starttime = time.start;
                that.endtime = time.end;
                that.initFmt();

                that.day_startTime = that.starttime;
                that.day_endTime = that.endtime;

                if (that.intervel_time == 1) {
                    //小时
                    //展示异常类型下拉
                    this.showExceptionType = 1;
                    //污染物类型
                    this.querypollutionType = ['PM25', 'PM25_24h', 'PM10', 'PM10_24h', 'CO', 'SO2', 'NO2', 'O3', 'O3_8h'];
                } else if (that.intervel_time == 2) {
                    //间隔天无异常类别
                    this.selected_category = -1;
                    //不展示异常下拉
                    that.showExceptionType = 0;
                    this.querypollutionType = ['O3', 'O3_8h', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型
                }
                that.initColumn();
            },

            //审核历史时间间隔切换事件（小时，天）
            intervel_histime: function () {
                var that = this;

                var time = initradioDate(that.querydateTypeHis, that.intervel_histime);

                that.hisstarttime = time.start;
                that.hisendtime = time.end;
                that.initFmt();

                that.day_hisStartTime = that.hisstarttime;
                that.day_hisEndTime = that.hisendtime;

                if (that.intervel_histime == 1) {
                    //小时
                    //展示异常类型下拉
                    this.showExceptionType = 1;
                    //历史数据审核
                    this.querypollutionTypeHis = ['O3', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型

                } else if (that.intervel_histime == 2) {
                    //天
                    this.selected_hiscategory = -1;
                    //不展示异常下拉
                    that.showExceptionType = 0;
                    this.querypollutionTypeHis = ['O3', 'O3_8h', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型
                }
                that.initColumn();
            },

            //radioBox选择事件（当天、近三天、近一周、近一月、自定义）
            querydateType: function () {
                var that = this;
                var type = this.querydateType;

                switch (type) {
                    case '1day': {
                        var time = initradioDate(type, that.intervel_time);
                        that.day_startTime = time.start;
                        that.day_endTime = time.end;
                    }
                        break;
                    case '3day': {
                        var time1 = initradioDate(type, that.intervel_time);
                        that.day_startTime = time1.start;
                        that.day_endTime = time1.end;
                    }
                        break;
                    case '1week': {
                        var time2 = initradioDate(type, that.intervel_time);
                        that.day_startTime = time2.start;
                        that.day_endTime = time2.end;
                    }
                        break;
                    case '1month': {
                        var time3 = initradioDate(type, that.intervel_time);
                        that.day_startTime = time3.start;
                        that.day_endTime = time3.end;
                    }
                        break;
                    case 'autosite': {
                        var time4 = initradioDate(type, that.intervel_time);
                        that.day_startTime = that.starttime = time4.start;
                        that.day_endTime = that.endtime = time4.end;
                        that.initFmt();
                    }
                        break;
                }
            },

            //审核历史radioBox选择事件（当天、近三天、近一周、近一月、自定义）
            querydateTypeHis: function () {
                var that = this;
                var type = this.querydateTypeHis;

                switch (type) {
                    case '1day': {
                        var time = initradioDate(type, that.intervel_histime);
                        that.day_hisStartTime = time.start;
                        that.day_hisEndTime = time.end;
                    }
                        break;
                    case '3day': {
                        var time1 = initradioDate(type, that.intervel_histime);
                        that.day_hisStartTime = time1.start;
                        that.day_hisEndTime = time1.end;
                    }
                        break;
                    case '1week': {
                        var time2 = initradioDate(type, that.intervel_histime);
                        that.day_hisStartTime = time2.start;
                        that.day_hisEndTime = time2.end;
                    }
                        break;
                    case '1month': {
                        var time3 = initradioDate(type, that.intervel_histime);
                        that.day_hisStartTime = time3.start;
                        that.day_hisEndTime = time3.end;
                    }
                        break;
                    case 'autosite': {
                        var time4 = initradioDate(type, that.intervel_histime);
                        that.day_hisStartTime = that.hisstarttime = time4.start;
                        that.day_hisEndTime = that.hisendtime = time4.end;
                        that.initFmt();
                    }
                        break;
                }
            },


            //城市选择框事件处理
            selected_city: function () {
                var _self = this;
                if (_self.selected_city != -1) {
                    ajax_get(coreApiPath + "/domain/child/" + _self.selected_city, {}, function (data) {
                        if (data.erroCode = 2000) {
                            _self.option_district = [];
                            $.each(data.result, function (index, val) {
                                _self.option_district.push({id: val.id, text: val.domainName});
                            });
                            _self.selected_district = -1;
                        }
                    });
                }
            },

            //数据审核历史城市选择框事件处理
            selected_hiscity: function () {
                var _self = this;
                if (_self.selected_hiscity != -1) {
                    ajax_get(coreApiPath + "/domain/child/" + _self.selected_hiscity, {}, function (data) {
                        if (data.erroCode = 2000) {
                            _self.option_hisdistrict = [];
                            $.each(data.result, function (index, val) {
                                _self.option_hisdistrict.push({id: val.id, text: val.domainName});
                            });
                            _self.selected_hisdistrict = -1;
                        }
                    });
                }
            },

            //切换页
            perPage: function () {
                this.Search();
            }
        },
        methods: {
            initAllFunctions: function () {
                var _self = this;
                var url = $.coreApiPath + "/role/functionRole";
                ajax_get(url, {}, function (data) {
                    _self.isRealActive = false;
                    if (data.erroCode == 2000) {
                        _self.allFunctions = data.result;
                        var real = hasKey(_self.allFunctions, 'ROLE_FUN_101_01_01');
                        var history = hasKey(_self.allFunctions, 'ROLE_FUN_101_01_02');
                        _self.dataAudit.output = hasKey(_self.allFunctions, 'ROLE_FUN_101_01_03');
                        if (real) {
                            _self.isRealActive = true;
                            _self.dataAudit.real = true;
                        }
                        if (history) {
                            _self.dataAudit.history = true;
                        }
                    } else {
                        _self.allFunctions = {};
                        _self.dataAudit = {
                            real: false,
                            history: false,
                            output: false
                        };
                    }
                });
            },
            initFmt: function () {
                var that = this;
                if ((that.historyType == 0 && that.intervel_time == 1)
                    || (that.historyType == 1 && that.intervel_histime == 1)) {
                    myDate.format = 'yyyy-MM-dd hh:mm';
                    that.fmt = 'yyyy-MM-dd HH:00';
                    that.maxdate = '%y-%M-%d %H:%m';
                } else {
                    myDate.format = 'yyyy-MM-dd';
                    that.fmt = 'yyyy-MM-dd';
                    that.maxdate = '%y-%M-%d';
                }
            },
            initColumn: function () {
                var that = this;
                //数据审核
                if (this.historyType == 0) {
                    //数据审核--矩阵式展示
                    if (this.showType == 0) {
                        var cls = this.querypollutionType;
                        for (var j = 0; j < that.fields.length; j++) {
                            var field = that.fields[j];
                            var fieldName = field.name;
                            if (fieldName != "__sequence" && fieldName != "stationId"
                                && fieldName != "stationName" && fieldName != "rtcTime") {
                                field.visible = cls.hasVal(fieldName);
                                if (fieldName == "O3_8h") {
                                    if (that.dealTabletime_type == 1) {
                                        field.title = "O3_8h";
                                    } else {
                                        field.title = "O3_8h_Max";
                                    }
                                }
                            }
                            if (fieldName == 'PM25_24h' || fieldName == 'PM10_24h') {
                                if (that.dealTabletime_type == 2) {
                                    field.visible = false;
                                }
                            }
                        }
                    } else {
                        //数据审核--列表式展示
                        var cls = this.listColumnsName;
                        for (var j = 0; j < that.fields.length; j++) {
                            var field = that.fields[j];
                            var fieldName = field.name;
                            if (fieldName != "__sequence" && fieldName != "stationId"
                                && fieldName != "stationName" && fieldName != "rtcTime") {
                                field.visible = cls.hasVal(fieldName);
                            }
                        }
                    }

                } else {
                    //数据审核历史
                    var cls = this.listHistoryColumnsName;
                    for (var j = 0; j < that.fields.length; j++) {
                        var field = that.fields[j];
                        var fieldName = field.name;
                        if (fieldName != "__sequence" && fieldName != "stationId"
                            && fieldName != "stationName" && fieldName != "rtcTime") {
                            field.visible = cls.hasVal(fieldName);
                        }
                    }
                }
            },

            //设置数据审核历史：0/1
            setHistoryType: function (historyType) {
                this.historyType = historyType;
                this.showType = 0;
                this.initColumn();
                this.$nextTick(function () {
                    this.$broadcast('vuetable:clearTable');
                });
            },

            Search: function () {
                var that = this;
                var city = '';
                var district = '';
                var valid = '';
                var exceptionType = '';
                var stationIdOrName = '';
                var auditorName = '';
                var intervelTime = '';
                var startTime = '';
                var endTime = '';
                var pollutionTypes = '';

                if (that.historyType == 1) {
                    //历史数据审核
                    city = this.selected_hiscity;
                    district = this.selected_hisdistrict;
                    valid = this.selected_hisvalid;
                    exceptionType = this.selected_hiscategory;
                    stationIdOrName = this.searchParams_hisStationIdOrName;
                    auditorName = this.searchParams_auditorName;
                    intervelTime = this.intervel_histime;
                    pollutionTypes = this.querypollutionTypeHis.join(",");
                    if (that.querydateTypeHis == 'autosite') {
                        that.day_hisStartTime = that.hisstarttime = $("#his-startTime").val();
                        that.day_hisEndTime = that.hisendtime = $("#his-endTime").val();
                        // that.day_hisStartTime = $("#startTime_"+that.historyType).val();
                        // that.day_hisEndTime = $("#endTime_"+that.historyType).val();
                        if (that.day_hisStartTime == '' || that.day_hisEndTime == '') {
                            layer.msg('请指定时间范围！');
                            return;
                        }
                    }
                    startTime = that.day_hisStartTime;
                    endTime = that.day_hisEndTime;

                } else {
                    city = this.selected_city;
                    district = this.selected_district;
                    valid = this.selected_valid;
                    exceptionType = this.selected_category;
                    stationIdOrName = this.searchParams_stationIdOrName;
                    intervelTime = this.intervel_time;
                    pollutionTypes = this.querypollutionType.join(",");
                    if (that.querydateType == 'autosite') {
                        that.day_startTime = that.starttime = $("#startTime").val();
                        that.day_endTime = that.endtime = $("#endTime").val();
                        // that.day_startTime = $("#startTime_"+that.historyType).val();
                        // that.day_endTime = $("#endTime_"+that.historyType).val();
                        if (that.day_startTime == '' || that.day_endTime == '') {
                            layer.msg('请指定时间范围！');
                            return;
                        }
                    }
                    startTime = that.day_startTime;
                    endTime = that.day_endTime;
                }

                if (startTime > endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }

                var moretype = intervelTime;
                this.dealTabletime_type = moretype;
                if (moretype == '2') {
                    moretype = '3month';
                } else {
                    moretype = '1month_hh';
                }

                console.log(" 开始时间    " + startTime + " 结束时间       " + endTime + "    moretype:" + moretype);
                if (!calcDate_interval(startTime, endTime, moretype)) {
                    return;
                }

                var param = {
                    showType: this.showType,//数据审核展示方式，0矩阵式，1列表式
                    historyType: this.historyType,//0数据审核，1数据审核历史
                    timeType: intervelTime,
                    startTime: startTime.length == 10 ? startTime + ' 00:00:00' : startTime + ':00',
                    endTime: endTime.length == 10 ? endTime + ' 00:00:00' : endTime + ':00'
                };

                //城市列表
                if (city != '-1') {
                    param.city = city;
                } else {
                    layer.msg('请选择城市名称');
                    return;
                }

                //行政区
                if (district != '-1') {
                    param.district = district;
                }

                //选择污染浓度
                if (pollutionTypes != '') {
                    param.pollutionTypes = pollutionTypes;
                } else {
                    layer.msg('请选择污染物!');
                    return;
                }

                //质控类型
                if (valid != '-1') {
                    param.valid = valid;
                }

                //异常类型
                if (exceptionType != '-1') {
                    param.exceptionType = exceptionType;
                }

                //监测点编号或者名称
                if (stationIdOrName != '') {
                    param.stationIdOrName = stationIdOrName;
                }

                //审核员
                if (auditorName != '') {
                    param.auditorName = this.searchParams_auditorName;
                }

                //数据待审核
                var sp = CommonUtil.json2Array(param);
                that.params = [];
                for (var i = 0; i < sp.length; i++) {
                    that.params.push(sp[i]);
                }

                that.initColumn();

                that.$nextTick(function () {
                    that.$broadcast('vuetable:refresh');
                });
            },

            //时间格式化
            rtcTimeFormat: function (val) {
                if (val != null && val != "") {
                    if (this.dealTabletime_type == 2) {
                        return new Date(val).Format("yyyy-MM-dd");
                    } else {
                        return new Date(val).Format("yyyy-MM-dd HH:mm");
                    }
                } else {
                    return "";
                }
            },

            styleFormat: function (val) {
                // //历史数据审核
                if (this.historyType == 1) {
                    return val;
                }
                // 1有效 2待审核 3无效
                if (val == "" || val == null) {
                    return "";
                } else {
                    var arr = val.split(",");
                    var styleVal = arr[0];
                    if (arr.length > 3 && arr[3] == 1) {
                        styleVal = "<span style='font-weight:bold'>" + styleVal + "</span>";
                    }
                    if (arr[1] == 1) {
                        return styleVal;
                    } else if (arr[1] == 2) {
                        return "<div class='data-cell-bgset-yellow'>" + styleVal + "</div>";
                    } else if (arr[1] == 3) {

                        return "<div class='data-cell-bgset-gray'>" + styleVal + "</div>";
                    }
                }
            },

            pollutionFormat: function (val) {
                if ("PM2.5" == val) {
                    return "PM<sub>2.5</sub>";
                } else if ("PM10" == val) {
                    return "PM<sub>10</sub>";
                } else if ("SO2" == val) {
                    return "SO<sub>2</sub>";
                } else if ("NO2" == val) {
                    return "NO<sub>2</sub>";
                } else if ("O3" == val) {
                    return "O<sub>3</sub>";
                } else if ("PM2.5_24h" == val) {
                    return "PM<sub>2.5</sub>_24h";
                } else if ("PM10_24h" == val) {
                    return "PM<sub>10</sub>_24h";
                } else if ("O3_8h" == val) {
                    if (this.intervel_time == 2) {
                        //天
                        return "O<sub>3</sub>_8h(Max)";
                    } else {
                        //小时
                        return "O<sub>3</sub>_8h";
                    }
                } else {
                    return val;
                }
            },

            rtcTimeFormat: function (val) { //时间格式化
                if (val != null && val != "") {
                    if (this.dealTabletime_type == 2) {
                        return new Date(val).Format("yyyy-MM-dd");
                    } else {
                        return new Date(val).Format("yyyy-MM-dd HH:mm");
                    }
                } else {
                    return "";
                }
            },

            validFormat: function (value) {
                if (value == null || value == "") {
                    return "";
                } else if (value == 1) {
                    return "有效";
                } else if (value == 3) {
                    return "无效";
                }
            },

            //审核原因
            reasonFormat: function (val) {
                //其他
                if (val != "设备故障") {
                    return "其他";
                } else {
                    return val;
                }
            },

            //下拉原因变化
            changeSelectReason: function () {
                this.verifyReason = "";
                if (this.verifySelectReason == 0) {
                    $("#verifyInputReason").removeAttr("disabled");
                    $("#verifyInputReason").show();
                } else {
                    $("#verifyInputReason").attr("disabled", true);
                    $("#verifyInputReason").hide();
                }
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

            hideModal: function () {
                $("#verifyModal").modal('hide');
                this.validRadio = 1;
                this.verifyReason = "";
            },


            //矩阵显示按钮单击事件处理
            searchMatrix: function () {
                this.showType = 0;
                $("#btn-matrix").removeClass('btn-white');
                $("#btn-matrix").addClass('btn-tabinfo');
                $("#btn-list").removeClass('btn-tabinfo');
                $("#btn-list").addClass('btn-white');
                this.Search();
            },

            // //列表显示按钮单击事件处理
            searchList: function () {
                this.showType = "1";
                $("#btn-matrix").removeClass('btn-tabinfo');
                $("#btn-matrix").addClass('btn-white');
                $("#btn-list").removeClass('btn-white');
                $("#btn-list").addClass('btn-tabinfo');
                this.Search();
            },
            exportData: function () {
                var that = this;
                if (that.querydateType == 'autosite') {
                    that.day_startTime = that.starttime = $("#startTime").val();
                    that.day_endTime = that.endtime = $("#endTime").val();
                    if (that.day_startTime == '' || that.day_endTime == '') {
                        layer.msg('请指定时间范围！');
                        return;
                    }
                }

                if (that.day_startTime > that.day_endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                var moretype = this.intervel_time;
                this.dealTabletime_type = moretype;
                if (moretype == '2') {
                    moretype = '3month';
                } else {
                    moretype = '1month_hh';
                }

                console.log(" 开始时间    " + this.day_startTime + " 结束时间       " + this.day_endTime + "    moretype:" + moretype);
                if (!calcDate_interval(that.day_startTime, that.day_endTime, moretype)) {
                    return;
                }

                var param = {
                    showType: this.showType,//数据审核展示方式，0矩阵式，1列表式
                    timeType: this.intervel_time,
                    startTime: this.day_startTime.length == 10 ? this.day_startTime + ' 00:00:00' : this.day_startTime + ':00',
                    endTime: this.day_endTime.length == 10 ? this.day_endTime + ' 00:00:00' : this.day_endTime + ':00'
                };

                var OutPutType = $.coreApiPath + "/data/verify/exportData?";
                var OutPutFileUrl = OutPutType +
                    'showType=' + param.showType +
                    '&timeType=' + param.timeType +
                    '&startTime=' + param.startTime +
                    '&endTime=' + param.endTime;

                //选择污染浓度
                if (this.querypollutionType != '') {
                    param.pollutionTypes = this.querypollutionType.join(",");
                    OutPutFileUrl = OutPutFileUrl + '&pollutionTypes=' + param.pollutionTypes;
                } else {
                    layer.msg('请选择污染物!');
                    return;
                }

                //输入监测点时，城市可以不选择
                if (this.selected_city != "-1") {
                    param.city = this.selected_city;
                    OutPutFileUrl = OutPutFileUrl + '&city=' + param.city;
                } else if (this.searchParams_stationIdOrName == "") {
                    layer.msg('请选择查询的城市名称');
                    return;
                }

                //行政区
                if (this.selected_district != "-1") {
                    param.district = this.selected_district;
                    OutPutFileUrl = OutPutFileUrl + '&district=' + param.district;
                }

                //质控类型
                if (this.selected_valid != "-1") {
                    param.valid = this.selected_valid;
                    OutPutFileUrl = OutPutFileUrl + '&valid=' + param.valid;
                }

                //异常类型
                if (this.selected_category != "-1") {
                    param.exceptionType = this.selected_category;
                    OutPutFileUrl = OutPutFileUrl + '&exceptionType=' + param.exceptionType;
                }

                //监测点编号或者名称
                if (this.searchParams_stationIdOrName != "") {
                    param.stationIdOrName = this.searchParams_stationIdOrName;
                    OutPutFileUrl = OutPutFileUrl + '&stationIdOrName=' + param.stationIdOrName;
                }

                CommonUtil.ajax({
                    type: "post",
                    url: $.coreApiPath + "/data/verify/exportCheck",
                    dataType: "json",
                    data: param,
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (data) {
                        switch (data) {
                            case 1: {
                                $("#exportForm").attr("action", OutPutFileUrl);
                                $("#exportForm").submit();
                                layer.msg('正在导出，请稍等...');
                            }
                                break;
                            case -2: {
                                layer.msg('当前查询结果为空！');
                            }
                                break;
                            case -3: {
                                layer.msg('导出数据量过大！');
                            }
                                break;
                        }
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('请求失败！');
                    }
                });
            }
        },
        events: {
            'vuetable:cell-clicked': function (data, field, event) {
                var _self = this;
                var fieldNname = field.name;
                var val = data[fieldNname];
                if (val != null && val != "") {
                    var arr = val.split(",");
                    if (arr[1] == 2 || arr.length > 3 && arr[3] == 1) {
                        $("#verifyModal").modal('show');

                        //确定按钮点击
                        $("#verifyConfirmBtn").on("click", function () {
                            //检查是否填写了原因
                            var reason = _self.verifyReason;
                            if (_self.verifySelectReason == 0) {
                                if (!reason || $.trim(reason).length == 0) {
                                    layer.msg('请填写原因！', function () {
                                    });
                                    return;
                                }
                                if ($.trim(reason).length > 30) {
                                    layer.msg('原因长度不能超过30!', function () {
                                    });
                                    return;
                                }
                            } else {
                                reason = _self.verifySelectReason;
                            }
                            var valid = _self.validRadio;
                            //审核参数
                            var param = {};
                            param.result = valid;
                            param.reason = reason;
                            param.dataId = data.id;

                            //列表式
                            if (_self.showType == 1) {
                                if (data["pollutionType"] == "PM2.5") {
                                    param.pollution = "PM25";
                                } else if (data["pollutionType"] == "PM2.5_24h") {
                                    param.pollution = "PM25_24h";
                                } else {
                                    param.pollution = data["pollutionType"];
                                }
                            } else {
                                //矩阵式
                                param.pollution = fieldNname;
                            }

                            param.stationId = data.stationId;
                            param.stationName = data.stationName;
                            param.timeType = _self.intervel_time;
                            param.pollutionValue = val.split(",")[0];
                            param.validComment = val.split(",")[2];
                            param.rtcTime = data.rtcTime;
                            var validResult = valid == 1 ? "有效" : "无效";
                            layer.confirm('是否确认将该数值设置为' + validResult + '?', {
                                btn: ['确认', '取消'] //按钮
                            }, function () {
                                layer.msg('加载中', {
                                    icon: 16,
                                    time: 0,
                                    shade: 0.01
                                });
                                //请求接口
                                $.ajax({
                                    type: 'POST',
                                    url: $.coreApiPath + "/data/verify/confirm",
                                    data: JSON.stringify(param),
                                    dataType: 'json',
                                    contentType: 'application/json; charset=UTF-8'
                                }).then(function (result) {
                                    layer.closeAll('dialog');
                                    // $("#verifyModal").modal('hide');
                                    // _self.validRadio = 1;
                                    // _self.verifyReason = "";
                                    _self.hideModal();
                                    if (result && result.erroCode == 2000) {
                                        if (result.result == 1) {
                                            layer.msg('审核成功');
                                        } else {
                                            layer.msg('已经被其他人审核！');
                                        }
                                        _self.$broadcast('vuetable:reload');
                                    } else {
                                        layer.msg('审核出现异常！');
                                    }
                                });
                            });
                        });
                    }
                }
            },
            'vuetable:cell-mouseenter': function (data, field, event) {
                // console.log(event);
                var fieldNname = field.name;
                var val = data[fieldNname];

                if (val != null && val != "") {
                    var arr = val.split(",");
                    if (arr[1] == 3 || arr[1] == 2 || arr[1] == 1) {
                        if (arr[2] != "") {
                            layer.tips(arr[2], event.srcElement, {
                                tips: 1,
                                time: 0
                            });
                        }
                    }
                }

                if (fieldNname == "reason" && val != "设备故障") {
                    val = "<div style='word-wrap:break-word'>" + val + "</div>";
                    layer.tips(val, event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            },
            'vuetable:cell-mouseleave': function (data, field, event) {
                layer.closeAll('tips'); //关闭所有的tips层
            },
            'vuetable:load-success': function () {
                $(".data-cell-bgset-gray").parent().css("background-color", "#CCCCCC");
                $(".data-cell-bgset-yellow").parent().css("background-color", "#FDE764");
            }
        }
    });

});


var hisTableColumns = [{
    name: '__sequence',
    title: '序号',
    titleClass: 'text-center'
},
    {
        name: 'stationId',
        title: '站点编号',
        sortField: 'stationId',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'rtcTime',
        title: '时间',
        sortField: 'rtcTime',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'rtcTimeFormat'
    }, {
        name: 'pollutionType',
        title: '污染物',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel',
        callback: 'pollutionFormat'
    },
    {
        name: 'pollutionValue',
        title: '异常值',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel'
    },
    {
        name: 'validComment',
        title: '异常类别',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel'
    },
    {
        name: 'valid',
        title: '审核操作',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel',
        callback: 'validFormat'
    },
    {
        name: 'reason',
        title: '审核原因',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel',
        callback: 'reasonFormat'
    },
    {
        name: 'verifyTime',
        title: '审核时间',
        sortField: 'verifyTime',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel'
    },
    {
        name: 'auditorName',
        title: '审核员',
        titleClass: 'text-center',
        dataClass: 'text-center post-rel'
    }
];

//数据审核历史
new Vue({
    el: "#tab-datahistory",
    data: {
        showExceptionType: 1, //是否展示异常类别下拉
        option_hiscategory: [], //异常类型
        option_audit: [], //审核操作类型
        option_hiscity: [],//选择城市
        selected_hiscity: "-1",
        option_hisdistrict: [],//选择区县
        selected_hisdistrict: "-1",
        selected_hisvalid: "-1",//审核操作
        selected_hiscategory: '-1',
        querydateTypeHis: '1day', //审核历史时间类型，默认为当天
        autodateType: '',
        queryStationType: ['6010,1010'], //微站、考核站
        querypollutionTypeHis: ['PM25', 'PM10', 'CO', 'SO2', 'NO2', 'O3'], //审核历史污染物类型
        intervel_time: 1, //1 小时  2 天
        dealTabletime_type: 1,
        verifyReason: "",
        fmt: "yyyy-MM-dd HH:00",
        maxdate: "%y-%M-%d %H%0",
        endtime: '',
        starttime: '',
        hisendtime: '',
        hisstarttime: '',
        day_startTime: '',
        day_endTime: '',
        day_hisStartTime: '',
        day_hisEndTime: '',
        fields: hisTableColumns,
        perPage: 10,
        pageList: [10, 20, 30, 40, 50],
        selpollutionTypeHis: 1,
        searchParams_hisStationIdOrName: '',
        searchParams_auditorName: '',//审核员
        listHistoryColumnsName: ['pollutionType', 'pollutionValue', 'validComment', 'valid', 'reason', 'verifyTime', 'auditorName'],
        multiSort: true,
        params: [
            'startTime=' + initSEndTime.currDay.startTime,
            'endTime=' + initSEndTime.currDay.endTime,
            'timeType=1',
            'pro=' + curr_pro,
            'city=' + curr_city
        ],
        isActive: false
    },
    compiled: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.isActive = false;
                var allFunctions = data.result;
                var real = hasKey(allFunctions, 'ROLE_FUN_101_01_01');
                var history = hasKey(allFunctions, 'ROLE_FUN_101_01_02');
                if (!real && history) {
                    _self.isActive = true;
                }

            } else {
                _self.isActive = false;
            }
        });
    },
    ready: function () {
        var _self = this;
        //城市列表
        ajax_get($.coreApiPath + "/domain/getDomains", {}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.option_hiscity.push({id: val.id, name: val.domainName});
                });
            }
        });

        //获取所有异常类别
        ajax_get($.coreApiPath + "/data/verify/exceptionType", {}, function (data) {
            if (data) {
                _self.option_hiscategory = data;
            }
        });
    },
    watch: {
        //数据审核历史城市选择框事件处理
        selected_hiscity: function () {
            var _self = this;
            if (_self.selected_hiscity != -1) {
                ajax_get(coreApiPath + "/domain/child/" + _self.selected_hiscity, {}, function (data) {
                    if (data.erroCode = 2000) {
                        _self.option_hisdistrict = [];
                        $.each(data.result, function (index, val) {
                            _self.option_hisdistrict.push({id: val.id, text: val.domainName});
                        });
                        _self.selected_hisdistrict = -1;
                    }
                });
            }
        },

        //审核历史选择污染物--单个
        querypollutionTypeHis: function () {
            var arrLength = this.querypollutionTypeHis.length;
            //数据审核历史
            //小时
            if (this.intervel_histime == 1) {
                if (arrLength == 6) {
                    this.selpollutionTypeHis = 1;
                } else if (arrLength != 6) {
                    this.selpollutionTypeHis = -1;
                }
            }
        },
        //数据审核历史选择污染物--全部
        selpollutionTypeHis: function () {
            //全部
            if (this.selpollutionTypeHis == 1) {
                this.querypollutionTypeHis = ['PM25', 'PM10', 'CO', 'SO2', 'NO2', 'O3']; //污染物类型
            } else if (this.selpollutionTypeHis == 0) {
                this.querypollutionTypeHis = [];
            }
        },
        //审核历史时间间隔切换事件（小时，天）
        intervel_histime: function () {
            var that = this;
            var time = initradioDate(that.querydateTypeHis, that.intervel_histime);
            that.hisstarttime = time.start;
            that.hisendtime = time.end;
            that.initFmt();
            that.day_hisStartTime = that.hisstarttime;
            that.day_hisEndTime = that.hisendtime;

            if (that.intervel_histime == 1) {
                //小时
                //展示异常类型下拉
                this.showExceptionType = 1;
                //历史数据审核
                this.querypollutionTypeHis = ['O3', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型

            } else if (that.intervel_histime == 2) {
                //天
                this.selected_hiscategory = -1;
                //不展示异常下拉
                that.showExceptionType = 0;
                this.querypollutionTypeHis = ['O3', 'O3_8h', 'SO2', 'NO2', 'CO', 'PM25', 'PM10']; //污染物类型
            }
            that.initColumn();
        },
        //审核历史radioBox选择事件（当天、近三天、近一周、近一月、自定义）
        querydateTypeHis: function () {
            var that = this;
            var type = this.querydateTypeHis;

            switch (type) {
                case '1day': {
                    var time = initradioDate(type, that.intervel_histime);
                    that.day_hisStartTime = time.start;
                    that.day_hisEndTime = time.end;
                }
                    break;
                case '3day': {
                    var time1 = initradioDate(type, that.intervel_histime);
                    that.day_hisStartTime = time1.start;
                    that.day_hisEndTime = time1.end;
                }
                    break;
                case '1week': {
                    var time2 = initradioDate(type, that.intervel_histime);
                    that.day_hisStartTime = time2.start;
                    that.day_hisEndTime = time2.end;
                }
                    break;
                case '1month': {
                    var time3 = initradioDate(type, that.intervel_histime);
                    that.day_hisStartTime = time3.start;
                    that.day_hisEndTime = time3.end;
                }
                    break;
                case 'autosite': {
                    var time4 = initradioDate(type, that.intervel_histime);
                    that.day_hisStartTime = that.hisstarttime = time4.start;
                    that.day_hisEndTime = that.hisendtime = time4.end;
                    that.initFmt();
                }
                    break;
            }
        },
        //切换页
        perPage: function () {
            this.SearchHis();
        }
    },
    methods: {
        initFmt: function () {
            var that = this;
            if (that.intervel_histime == 1) {
                myDate.format = 'yyyy-MM-dd hh:mm';
                that.fmt = 'yyyy-MM-dd HH:00';
                that.maxdate = '%y-%M-%d %H:%m';
            } else {
                myDate.format = 'yyyy-MM-dd';
                that.fmt = 'yyyy-MM-dd';
                that.maxdate = '%y-%M-%d';
            }
        },
        initColumn: function () {
            var that = this;
            //数据审核历史
            var cls = this.listHistoryColumnsName;
            for (var j = 0; j < that.fields.length; j++) {
                var field = that.fields[j];
                var fieldName = field.name;
                if (fieldName != "__sequence" && fieldName != "stationId"
                    && fieldName != "stationName" && fieldName != "rtcTime") {
                    field.visible = cls.hasVal(fieldName);
                }
            }
        },

        SearchHis: function () {
            var that = this;
            ;
            var city = this.selected_hiscity;
            var district = this.selected_hisdistrict;
            var valid = this.selected_hisvalid;
            var exceptionType = this.selected_hiscategory;
            var stationIdOrName = this.searchParams_hisStationIdOrName;
            var auditorName = this.searchParams_auditorName;
            var intervelTime = this.intervel_histime;
            var pollutionTypes = this.querypollutionTypeHis.join(",");
            if (that.querydateTypeHis == 'autosite') {
                that.day_hisStartTime = that.hisstarttime = $("#his-startTime").val();
                that.day_hisEndTime = that.hisendtime = $("#his-endTime").val();
                if (that.day_hisStartTime == '' || that.day_hisEndTime == '') {
                    layer.msg('请指定时间范围！');
                    return;
                }
            }
            var startTime = that.day_hisStartTime;
            var endTime = that.day_hisEndTime;
            if (startTime > endTime) {
                layer.msg('开始时间不能大于结束时间！');
                return;
            }

            var moretype = intervelTime;
            this.dealTabletime_type = moretype;
            if (moretype == '2') {
                moretype = '3month';
            } else {
                moretype = '1month_hh';
            }
            console.log(" 开始时间    " + startTime + " 结束时间       " + endTime + "    moretype:" + moretype);
            if (!calcDate_interval(startTime, endTime, moretype)) {
                return;
            }

            var param = {
                historyType: 1,
                timeType: intervelTime,
                startTime: startTime.length == 10 ? startTime + ' 00:00:00' : startTime + ':00',
                endTime: endTime.length == 10 ? endTime + ' 00:00:00' : endTime + ':00'
            };

            //城市列表
            if (city != '-1') {
                param.city = city;
            } else {
                layer.msg('请选择城市名称');
                return;
            }

            //行政区
            if (district != '-1') {
                param.district = district;
            }

            //选择污染浓度
            if (pollutionTypes != '') {
                param.pollutionTypes = pollutionTypes;
            } else {
                layer.msg('请选择污染物!');
                return;
            }

            //质控类型
            if (valid != '-1') {
                param.valid = valid;
            }

            //异常类型
            if (exceptionType != '-1') {
                param.exceptionType = exceptionType;
            }

            //监测点编号或者名称
            if (stationIdOrName != '') {
                param.stationIdOrName = stationIdOrName;
            }

            //审核员
            if (auditorName != '') {
                param.auditorName = this.searchParams_auditorName;
            }

            //数据待审核
            var sp = CommonUtil.json2Array(param);
            that.params = [];
            for (var i = 0; i < sp.length; i++) {
                that.params.push(sp[i]);
            }

            that.initColumn();

            that.$nextTick(function () {
                that.$broadcast('vuetable:refresh');
            });
        },

        pollutionFormat: function (val) {
            if ("PM2.5" == val) {
                return "PM<sub>2.5</sub>";
            } else if ("PM10" == val) {
                return "PM<sub>10</sub>";
            } else if ("SO2" == val) {
                return "SO<sub>2</sub>";
            } else if ("NO2" == val) {
                return "NO<sub>2</sub>";
            } else if ("O3" == val) {
                return "O<sub>3</sub>";
            } else if ("PM2.5_24h" == val) {
                return "PM<sub>2.5</sub>_24h";
            } else if ("PM10_24h" == val) {
                return "PM<sub>10</sub>_24h";
            } else if ("O3_8h" == val) {
                if (this.intervel_time == 2) {
                    //天
                    return "O<sub>3</sub>_8h(Max)";
                } else {
                    //小时
                    return "O<sub>3</sub>_8h";
                }
            } else {
                return val;
            }
        },

        //时间格式化
        rtcTimeFormat: function (val) {
            if (val != null && val != "") {
                if (this.dealTabletime_type == 2) {
                    return new Date(val).Format("yyyy-MM-dd");
                } else {
                    return new Date(val).Format("yyyy-MM-dd HH:mm");
                }
            } else {
                return "";
            }
        },

        //审核操作
        validFormat: function (value) {
            if (value == null || value == "") {
                return "";
            } else if (value == 1) {
                return "有效";
            } else if (value == 3) {
                return "无效";
            }
        },

        //审核原因
        reasonFormat: function (val) {
            //其他
            if (val != "设备故障") {
                return "其他";
            } else {
                return val;
            }
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
            var val = data[fieldNname];
            if (fieldNname == "reason" && val != "设备故障") {
                val = "<div style='word-wrap:break-word'>" + val + "</div>";
                layer.tips(val, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
        },
        'vuetable:cell-mouseleave': function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        'vuetable:load-success': function () {
            $(".data-cell-bgset-gray").parent().css("background-color", "#CCCCCC");
            $(".data-cell-bgset-yellow").parent().css("background-color", "#FDE764");
        }
    }
});

function initradioDate(index, time_type) {
    if (time_type == 1) {
        myDate.format = 'yyyy-MM-dd hh:mm';
    } else {
        myDate.format = 'yyyy-MM-dd';
    }
    var start = '',
        end = '';
    switch (index) {
        case '1day': {
            if (time_type == 1) {
                start = new Date(myDate.year, myDate.month - 1, myDate.day, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 1);
                end = new Date(myDate.year, myDate.month - 1, myDate.day - 1);
            }
        }
            break;
        case '3day': {
            if (time_type == 1) {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 3, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 3);
                end = new Date(myDate.year, myDate.month - 1, myDate.day);
            }
        }
            break;
        case '1week': {
            if (time_type == 1) {

                start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 7);
                end = new Date(myDate.year, myDate.month - 1, myDate.day);
            }
        }
            break;
        case '1month': {
            if (time_type == 1) {
                start = new Date(myDate.year, myDate.month - 2, myDate.day, myDate.hour, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 2, myDate.day);
                end = new Date(myDate.year, myDate.month - 1, myDate.day);
            }
        }
            break;
        case 'autosite': {
            var time = autoDateset(time_type);
            start = time.start;
            end = time.end;

        }
            break;
    }
    start = myDate.formatDate(start, myDate.format);
    end = myDate.formatDate(end, myDate.format);
    return {
        start: start,
        end: end
    };
}

function autoDateset(fg) {
    var start, end;
    if (fg == 1) {
        myDate.format = 'yyyy-MM-dd hh:mm';
        start = new Date(myDate.year, myDate.month - 1, myDate.day, 1, 0);
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
    } else {
        myDate.format = 'yyyy-MM-dd';
        start = new Date(myDate.year, myDate.month - 1, myDate.day - 1);
        end = new Date(myDate.year, myDate.month - 1, myDate.day - 1);
    }
    // start = myDate.formatDate(start, myDate.format);
    // end = myDate.formatDate(end, myDate.format);
    return {
        start: start,
        end: end
    };
}