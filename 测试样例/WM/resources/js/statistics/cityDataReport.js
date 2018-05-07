var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy-MM-dd hh:mm'
});

var curr_pro = parent.provinceId,
    curr_city = parent.cityId,
    initSEndTime = {
        fourDay: {
            startTime: initradioDate('4day', 'hour').start,
            endTime: initradioDate('4day', 'hour').end
        },
        oneWeek: {
            startTime: initradioDate('1week', 'hour').start,
            endTime: initradioDate('1week', 'hour').end
        }
    };

var hourHtml = '<input id="startTime" v-model="day_startTime" class="form-control Wdate" style="width: 135px;" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:00\',maxDate:\'%y-%M-%d %H:%m\'})" type="text" /> ' +
    '<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span> ' +
    '<input id="endTime" v-model="day_endTime" class="form-control Wdate" type="text" style="width: 135px;" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:00\',maxDate:\'%y-%M-%d %H:%m\'})" placeholder="结束时间" />';

var dayHtml = '<input id="startTime" v-model="day_startTime"  class="form-control Wdate" style="width: 135px;" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',maxDate:\'%y-%M-%d\'})" type="text" /> ' +
    '<span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span> ' +
    '<input id="endTime" v-model="day_endTime" class="form-control Wdate" type="text" style="width: 135px;" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',maxDate:\'%y-%M-%d\'})" placeholder="结束时间" />';

var allPollutions = ["aqi", "pm25", "pm10", "so2", "no2", "co", "o3"]; //所有污染物信息
$(function () {
    myDate.format = 'yyyy-MM-dd hh:mm';
    var tableColumns = [{
        title: '时间',
        name: 'rtcTime',
        titleClass: 'text-center',
        callback: 'rtcTimeFormat'
    }, {
        title: '站点类型',
        name: 'stationTypeName',
        titleClass: 'text-center',
        dataClass: 'text-center',
        visible: false
    },
        {
            title: '区/县',
            name: 'districtName',
            titleClass: 'text-center',
            dataClass: 'text-center',
            visible: false
        }, {
            title: 'AQI',
            name: 'aqi',
            titleClass: 'text-center',
            dataClass: 'text-center',
            visible: false
        }, {
            title: '首要污染物',
            name: 'aqiFirst',
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: 'dealpolltuion',
            visible: false
        }, {
            title: 'PM2.5',
            name: 'pm25',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }, {
            title: 'PM10',
            name: 'pm10',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }, {
            title: 'SO2',
            name: 'so2',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        },
        {
            title: 'NO2',
            name: 'no2',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        },
        {
            title: 'CO',
            name: 'co',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        },
        {
            title: 'O3',
            name: 'o3',
            titleClass: 'text-center',
            dataClass: 'text-center post-rel'
        }
    ];

    var parameterType = CommonUtil.getQueryParameter('type');
    Vue.config.debug = true;
    var citydata = new Vue({
        el: "#content",
        data: {
            timeHtml: hourHtml,
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            selAllPollution: 0, //‘全选’状态记录:未选
            queryDateType: '4day', //时间类型，默认为当天
            autoDateType: '',
            queryPollutionType: ["pm25", "pm10", "so2", "no2", "co", "o3"], //污染物类型
            intervel_time: 'hour', //1 小时  2 天
            dealTabletime_type: 'hour',
            querysType: 1, //1国家考核、2省内考核、3市内考核、4、微站站点类型、5微站区县类型
            day_startTime: initSEndTime.fourDay.startTime,
            day_endTime: initSEndTime.fourDay.endTime,
            time_change: 1, //小时为1，天为2 ，记录小时和天的切换状态
            option_district: [], //所有区县
            kh_district: [], //市内考核 区县
            district: [], //选中的区县
            stationTypes: [], //选中的站点类型
            option_stationTypes: [], //所有站点类型
            linePollutionType: "pm25", //默认选中的第一个污染物
            listPollutionType: [
                {
                    id: "pm25",
                    code: 'PM2.5'
                },
                {
                    id: "pm10",
                    code: 'PM10'
                },
                {
                    id: "so2",
                    code: 'SO2'
                },
                {
                    id: "no2",
                    code: 'NO2'
                },
                {
                    id: "co",
                    code: 'CO'
                },
                {
                    id: "o3",
                    code: 'O3'
                }
            ], //污染物下拉
            params: [
                'timeType=hour',
                'startTime=' + initSEndTime.fourDay.startTime,
                'endTime=' + initSEndTime.fourDay.endTime,
                'calculateType=1',
                'pollutionTypes=' + allPollutions,
                'districts=',
                'city=' + curr_city,
                'stationTypes='
            ],
            landingPage: false
        },
        beforeCompile: function () {
            if (parameterType == '1') {
                this.landingPage = true;
                this.queryDateType = 'autosite';
            }
        },
        ready: function () {
            var _self = this;
            var param = {
                cityId: curr_city
            };
            ajax($.coreApiPath + "/pollution/districts", param, function (data) {
                _self.option_district = [];
                if (data.length > 0) {
                    for (var i in data) {
                        if (data[i].id != "" && data[i].id != null) {
                            _self.option_district.push({id: data[i].id, text: data[i].district});
                        }
                    }
                    if (parameterType == '1') {
                        $('#districtDiv').click();
                    }
                }
            });

            ajax($.coreApiPath + "/pollution/khdistricts", param, function (data) {
                _self.kh_district = [];
                if (data.length > 0) {
                    for (var i in data) {
                        if (data[i].id != "" && data[i].id != null) {
                            _self.kh_district.push({id: data[i].id, text: data[i].district});
                        }
                    }
                }
            });

            ajax($.coreApiPath + "/rest/station/getSelectData", param, function (data) {
                _self.option_stationTypes = [];
                if (data.erroCode == 2000) {
                    var stationType = data.result.siteType;
                    $.each(stationType, function (index, val) {
                        _self.option_stationTypes.push({code: val.code, text: val.name});
                    });
                }
            });

            if (parameterType != '1') {
                _self.initChars();
            }

        },
        watch: {
            selAllPollution: function () { //全选全不选
                if (this.selAllPollution == 1) {
                    this.queryPollutionType = ["aqi", "pm25", "pm10", "so2", "no2", "co", "o3"];
                    this.listPollutionType = [{
                        id: "aqi",
                        code: 'AQI'
                    },
                        {
                            id: "pm25",
                            code: 'PM2.5'
                        },
                        {
                            id: "pm10",
                            code: 'PM10'
                        },
                        {
                            id: "so2",
                            code: 'SO2'
                        },
                        {
                            id: "no2",
                            code: 'NO2'
                        },
                        {
                            id: "co",
                            code: 'CO'
                        },
                        {
                            id: "o3",
                            code: 'O3'
                        }
                    ];
                    this.linePollutionType = "aqi";
                } else if (this.selAllPollution == 0) {
                    this.queryPollutionType = [];
                    this.listPollutionType = [];
                    this.linePollutionType = "";
                }
            },
            queryPollutionType: function () {
                var _self = this;
                var arrLength = this.queryPollutionType.length;
                if (arrLength == 7) {
                    this.selAllPollution = 1;
                } else if (arrLength != 7) {
                    this.selAllPollution = -1;
                }
                var flag = false;
                _self.listPollutionType = [];
                for (var i = 0; i < allPollutions.length; i++) {

                    if (_self.queryPollutionType.hasVal(allPollutions[i])) {
                        flag = true;
                        var obj = {
                            id: allPollutions[i],
                            code: titlePollution(allPollutions[i])
                        };
                        _self.listPollutionType.push(obj);
                    }
                }
                if (flag) {
                    for (var i = 0; i < allPollutions.length; i++) {
                        if (_self.queryPollutionType.hasVal(allPollutions[i])) {
                            _self.linePollutionType = allPollutions[i];
                            break;
                        }
                    }

                }
            },
            perPage: function () {
                this.search();
            },
            querysType: function () {
                var _self = this;
                _self.district = [];
                _self.stationTypes = [];
                document.getElementById("example15").options.selectedIndex = -1; //回到初始状态
                $("#example15").multiselect('refresh'); //对searchPayState这个下拉框进行重置刷新

                document.getElementById("example13").options.selectedIndex = -1; //回到初始状态
                $("#example13").multiselect('refresh'); //对searchPayState这个下拉框进行重置刷新

                document.getElementById("example14").options.selectedIndex = -1; //回到初始状态
                $("#example14").multiselect('refresh'); //对searchPayState这个下拉框进行重置刷新

                // this.search();

            },
            intervel_time: function () { //时间 类型切换
                var _self = this;
                if (_self.intervel_time == 'hour') {
                    myDate.format = 'yyyy-MM-dd hh:mm';
                } else {
                    myDate.format = 'yyyy-MM-dd';
                }
                var time = initradioDate(_self.queryDateType, _self.intervel_time);
                _self.day_startTime = time.start;
                _self.day_endTime = time.end;
                _self.showTimeHtml();
            },
            queryDateType: function () {
                var _self = this;
                var type = _self.queryDateType;
                switch (type) {
                    case '4day': {
                        var time1 = initradioDate(type, _self.intervel_time);
                        _self.day_startTime = time1.start;
                        _self.day_endTime = time1.end;
                    }
                        break;
                    case '1week': {
                        var time2 = initradioDate(type, _self.intervel_time);
                        _self.day_startTime = time2.start;
                        _self.day_endTime = time2.end;
                    }
                        break;
                    case 'autosite': {
                        var time4 = initradioDate(type, _self.intervel_time);
                        _self.day_startTime = time4.start;
                        _self.day_endTime = time4.end;

                        if (_self.landingPage) {
                            _self.day_startTime = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day, 0, 0), myDate.format);
                            _self.day_endTime = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0), myDate.format);
                        }
                        _self.showTimeHtml();
                    }
                        break;
                }
            }
        },
        methods: {
            initChars: function () {
                var _self = this;
                var postData = {
                    city: curr_city, //城市编号
                    calculateType: _self.querysType, //1国家考核、2省内考核、3市内考核、4、微站站点类型、5微站区县类型
                    timeType: _self.intervel_time,
                    startTime: _self.day_startTime, //开始时间
                    endTime: _self.day_endTime, //结束时间
                    pollutionTypes: allPollutions.join(","),
                    districts: _self.district.length < 1 ? "" : _self.district.join(","),
                    stationTypes: _self.stationTypes.length < 1 ? "" : _self.stationTypes.join(","),
                    linePollutionType: _self.linePollutionType
                };

                /**
                 * 加载曲线
                 */
                ajax_post_msg($.coreApiPath + "/multistation/listMultistationLineData", postData, "加载", function (response) {
                    if (response.erroCode == 2000) {
                        var data = response.result;
                        if (_self.querysType < 3) {
                            showPollutuinChar(data, _self.queryPollutionType, _self.intervel_time);
                        } else {
                            showStationChar(data, _self.intervel_time);
                        }

                    } else {
                        disposeChar("multiStationChar");
                        layer.msg("加载失败");
                        return false;
                    }
                });
            },
            showTimeHtml: function () {
                if (this.intervel_time == 'hour') {
                    this.timeHtml = hourHtml;
                } else {
                    this.timeHtml = dayHtml;
                }
                $("#startTime").val(this.day_startTime);
                $("#endTime").val(this.day_endTime);
            },
            dealpolltuion: function (val) {
                if (val.indexOf('-') != -1) {
                    return val;
                } else {
                    return toChangePollution_Val(val);
                }
            },
            getType: function (id, _this, t, val) {
                //val  1国家考核、2省内考核、3市内考核、4、微站站点类型、5微站区县类型
                var _self = this;
                var a = event.currentTarget;
                $("#" + id + " .btn").removeClass("btn-tabinfo");
                $("#" + id + " .btn").addClass("btn-white");
                $(a).removeClass("btn-white");
                $(a).addClass("btn-tabinfo");
                if (t == 'time') {
                    _self.time_change = 1;
                    _self.intervel_time = val;
                    _self.showTimeHtml();
                } else {
                    _self.time_change = 2;
                    _self.querysType = val; //3 市内考核 4 按站点类型 5按区县

                    _self.queryPollutionType = ['o3', 'so2', 'no2', 'co', 'pm25', 'pm10']; //污染物类型

                    addKhMultiSelect(this);
                    addmultiselect(this);
                    addmultiStationselect(this);

                    if (_self.querysType == 3) { //3 市内考核
                        $(".multiselect-div13").show();
                        $("#linePollutionType").show();
                        $(".multiselect-div").hide();
                        $(".multiselect-stationdiv").hide();

                    } else if (_self.querysType == 5) { //5按区县
                        $(".multiselect-div").show();
                        $("#linePollutionType").show();
                        $(".multiselect-div13").hide();
                        $(".multiselect-stationdiv").hide();

                    } else if (_self.querysType == 4) { //4 按站点类型
                        $(".multiselect-stationdiv").show();
                        $("#linePollutionType").show();
                        $(".multiselect-div").hide();
                        $(".multiselect-div13").hide();
                    } else {
                        $(".multiselect-stationdiv").hide();
                        $(".multiselect-div").hide();
                        $(".multiselect-div13").hide();
                        $("#linePollutionType").hide();
                    }

                    disposeChar("multiStationChar");

                    if (_self.querysType == 3 || _self.querysType == 4 || _self.querysType == 5) {
                        _self.$nextTick(function () {
                            _self.selAllPollution = 1;
                            var selId = _self.querysType == 3
                                ? '#example13' :
                                (_self.querysType == 4 ? '#example15' : '#example14');
                            $(selId).multiselect('selectAll', false);
                            $(selId).multiselect('updateButtonText');
                            _self.$nextTick(function () {
                                _self.search();
                            });
                        });
                    }
                    else {
                        _self.$nextTick(function () {
                            _self.$broadcast('vuetable:clearTable');
                        });
                    }

                }
            },
            dynamicColumn: function () {
                var _self = this;
                var cls = _self.queryPollutionType;
                for (var j = 0; j < _self.fields.length; j++) {
                    var field = _self.fields[j],
                        fieldName = field.name,
                        fieldTitle = field.title;
                    if (fieldName != "rtcTime") {
                        if (_self.querysType == 1 || _self.querysType == 2) {
                            if (fieldTitle == "区/县" || fieldTitle == "站点类型") {
                                field.visible = false;
                            } else if (fieldTitle == "首要污染物") {
                                field.visible = cls.hasVal("aqi");
                            } else {
                                field.visible = cls.hasVal(fieldName);
                            }
                        } else if (_self.querysType == 3 || _self.querysType == 5) {
                            if (fieldTitle == "站点类型") {
                                field.visible = false;
                            } else if (fieldTitle == "区/县") {
                                field.visible = true;
                            } else if (fieldTitle == "首要污染物") {
                                field.visible = cls.hasVal("aqi");
                            } else {
                                field.visible = cls.hasVal(fieldName);
                            }
                        } else if (_self.querysType == 4) {
                            if (fieldTitle == "站点类型") {
                                field.visible = true;
                            } else if (fieldTitle == "区/县") {
                                field.visible = false;
                            } else if (fieldTitle == "首要污染物") {
                                field.visible = cls.hasVal("aqi");
                            } else {
                                field.visible = cls.hasVal(fieldName);
                            }
                        }
                    }
                }
            },
            search: function () {
                var _self = this;
                if (_self.queryPollutionType.length < 1) {
                    layer.msg("请选择污染物类型！");
                    disposeChar("multiStationChar");
                    return false;
                }

                if (_self.querysType == 3 || _self.querysType == 5) {
                    if (_self.district.length < 1) {
                        layer.msg("请选择区县！");
                        disposeChar("multiStationChar");
                        return false;
                    }
                } else if (_self.querysType == 4 && _self.stationTypes.length < 1) {
                    layer.msg("请选择站点类型！");
                    disposeChar("multiStationChar");
                    return false;

                }
                // _self.dynamicColumn();

                if (_self.queryDateType == 'autosite') {
                    _self.day_startTime = $("#startTime").val();
                    _self.day_endTime = $("#endTime").val();
                }

                if (_self.day_startTime > _self.day_endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                var moretype = this.intervel_time,
                    timeobj;
                this.dealTabletime_type = moretype;
                if (moretype == 'day') {
                    moretype = 'year';
                    timeobj = initradioDate(this.queryDateType, 'day');
                } else {
                    moretype = '1month_hh';
                    timeobj = initradioDate(_self.queryDateType, 'hour');
                }
                if (_self.queryDateType != 'autosite') {
                    _self.day_startTime = timeobj.start;
                    _self.day_endTime = timeobj.end;
                }

                if (!calcDate_interval(_self.day_startTime, _self.day_endTime, moretype)) {
                    return;
                }
                if (!this.landingPage || parameterType != '1') {
                    _self.initChars();
                }

                var param = {
                    timeType: _self.intervel_time,
                    calculateType: _self.querysType,
                    city: curr_city,
                    startTime: _self.day_startTime,
                    endTime: _self.day_endTime,
                    pollutionTypes: _self.queryPollutionType,
                    districts: _self.district.length < 1 ? "" : _self.district.join(","),
                    stationTypes: _self.stationTypes.length < 1 ? "" : _self.stationTypes.join(","),
                    linePollutionType: _self.linePollutionType
                };
                var sp = CommonUtil.json2Array(param);
                _self.params = [];
                for (var i = 0; i < sp.length; i++) {
                    _self.params.push(sp[i]);
                }
                _self.$nextTick(function () {
                    _self.$broadcast('vuetable:refresh');
                });
            },
            rtcTimeFormat: function (val) { //时间格式化
                if (val != null && val != "") {
                    if (this.dealTabletime_type == 'hour') {
                        return new Date(val).Format("yyyy-MM-dd HH:mm");
                    } else {
                        return new Date(val).Format("yyyy-MM-dd");
                    }
                } else {
                    return "";
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
            }
        },
        events: {
            'vuetable:load-success': function (response) {
                var _self = this;

                if (response.erroCode == 2000 && response.result.data.length > 0) {
                    _self.dynamicColumn();
                }

                if (this.landingPage) {
                    this.landingPage = false;
                    _self.$nextTick(function () {
                        _self.search();
                    });
                }
            }
        }
    });

});

function initradioDate(index, time_type) {
    var start = '',
        end = '';
    if (time_type == 'hour') {
        myDate.format = 'yyyy-MM-dd hh:mm';
    } else {
        myDate.format = 'yyyy-MM-dd';
    }
    switch (index) {
        case '4day': {
            if (time_type == 'hour') {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 4, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 4, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            }
        }
            break;
        case '1week': {
            if (time_type == 'hour') {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
            } else {
                start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, 1, 0);
                end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
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
    if (fg == 'hour') {
        myDate.format = 'yyyy-MM-dd hh:mm';
        start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, 1, 0);
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
    } else {
        myDate.format = 'yyyy-MM-dd';
        start = new Date(myDate.year, myDate.month - 4, myDate.day, 1, 0);
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0);
    }
    return {
        start: start,
        end: end
    };
}

var colors = ["#DB2727", "#94A1E9", "#FFBF00", "#1ACB18", "#0019A4", "#07D7A0", "#6E00FF", "#A1007E", "#FF7F97", "#AB7526", "#CC5127", "#FF6B00", "#F6F100", "#7ADE00", "#00A4A4", "#3758E1", "#9456A8", "#B200E3", "#FF2A9D", "#535353"];

function showStationChar(data, timeType) {
    disposeChar("multiStationChar");
    var myChar = echarts.init(document.getElementById('multiStationChar'));
    var option = {
        tooltip: {
            trigger: 'axis',
            position: function (point, params, dom, rect, size) {
                //其中params为当前鼠标的位置
                if (point[0] > size.viewSize[0] / 2) {
                    return [point[0] / 2, '10%'];
                } else {
                    return [point[0], '10%'];
                }
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    time = timeType == 'hour' ? new Date(obj[0].name).Format("yyyy/MM/dd HH") : new Date(obj[0].name).Format("yyyy/MM/dd"),
                    str = '<div class="tooltip-tit">' + time + '</div>',
                    fsize = 12;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '--';
                    }
                    if (obj[i].seriesName == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data pull-left\" style=\"width:auto;\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + obj[i].seriesName + ":" + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        legend: {
            left: 'center',
            data: data.legend
        },
        toolbox: {
            show: true,
            right: 20,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: [{
            textStyle: {
                color: '#8392A5'
            },
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            bottom: 10,
            // width: '100%',
            dataBackground: {
                areaStyle: {
                    color: '#8392A5'
                },
                lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5'
                }
            },
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }, {
            type: 'inside',
            disabled: true
        }],
        grid: {
            top: 40,
            left: '1%',
            right: '1%',
            bottom: '50px',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: data.rtcTime,
            axisLabel: {
                textStyle: {
                    fontSize: 10
                },
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    if (timeType == 'hour') {
                        return new Date(value).Format("MM/dd HH");
                    } else {
                        return new Date(value).Format("MM/dd");
                    }
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12
                }
            }
        },
        series: []
    };

    for (var j = 0; j < data.legend.length; j++) {
        var pollution = data.legend[j];
        option.series[j] = {
            name: pollution,
            type: 'line',
            data: data[pollution],
            itemStyle: {
                normal: {
                    color: colors[j]
                },
                emphasis: {
                    color: colors[j]
                }
            }
        };
    }

    myChar.setOption(option);
}

/**
 * 加载国家考核、省内考核 污染浓度 多Y轴曲线
 * @param data
 * @param queryPollutionType
 */
function showPollutuinChar(data, queryPollutionType, timeType) {
    disposeChar("multiStationChar");
    var xAxis = data.rtcTime;
    var myChar = echarts.init(document.getElementById('multiStationChar'));

    var legends = [];
    $.each(allPollutions, function (i, val) {
        if (queryPollutionType.hasVal(val)) {
            legends.push(titlePollution(val));
        }
    });
    var colors = {
        "aqi": "#DB2727",
        "pm25": "#FFBF00",
        "pm10": "#535353",
        "so2": "#6E00FF",
        "no2": "#1ACB18",
        "co": "#3758E1",
        "o3": "#A1007E",
        "no": "#00A4A4"
    };
    var option = {
        tooltip: {
            trigger: 'axis',
            position: function (point, params, dom, rect, size) {
                return [point[0], '10%'];
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params)),
                    fsize = 12,
                    itemName = obj[0].name,
                    time = timeType == 'hour' ? new Date(obj[0].name).Format("yyyy/MM/dd HH") : new Date(obj[0].name).Format("yyyy/MM/dd"),
                    str = '<div class="tooltip-tit">' + time + '</div>';
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].value == undefined) {
                        obj[i].value = '--';
                    }
                    if (obj[i].seriesName == 'CO' && obj[i].value % 1 === 0) {
                        obj[i].value = obj[i].value + '.0';
                    }
                    str += "<div class=\"tooltip-data clear\" style=\"width:100px;\"><b style=\"color: " + obj[i].color + "; \"> &bull;</b><i>" + titlePollution(obj[i].seriesName) + " : " + obj[i].value + "</i>";
                    str += "</div>";
                }
                return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
            }
        },
        legend: {
            left: 'center',
            data: legends
        },
        toolbox: {
            show: true,
            right: 0,
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: [{
            textStyle: {
                color: '#8392A5'
            },
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            bottom: 0,
            dataBackground: {
                areaStyle: {
                    color: '#8392A5'
                },
                lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5'
                }
            },
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }, {
            type: 'inside',
            disabled: true
        }],
        grid: {
            top: '17%',
            left: '1%',
            right: '6%',
            bottom: '50px',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: xAxis,
            axisLabel: {
                formatter: function (value, idx) {
                    if (!value) {
                        return "无时间数据";
                    }
                    if (timeType == 'hour') {
                        return new Date(value).Format("MM/dd HH");

                    } else {
                        return new Date(value).Format("MM/dd");
                    }
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [],
        series: []
    };
    var j = 0;
    for (var i = 0; i < allPollutions.length; i++) {
        var pollution = allPollutions[i];
        if (queryPollutionType.hasVal(pollution)) {

            if (pollution == "aqi") {
                option.yAxis[j] = {
                    name: titlePollution(pollution),
                    type: 'value',
                    position: 'left',
                    splitLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: colors[pollution]
                        },
                        formatter: function (value, idx) {
                            if (!value) {
                                return "";
                            }
                            return new Date(value).Format("dd日HH时");
                        }
                    }
                };
                option.series[j] = {
                    name: titlePollution(pollution),
                    type: 'bar',
                    data: data[pollution],
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: { //设置不同柱子的颜色　　　　　　　　　　　　　
                            color: function (params) {
                                var colorList = ['#00e400', '#ffe800', '#ff7e00', '#ff0000', '#99004c', '#7e0023']; //不同柱的颜色存储
                                if (params.data == 0) {
                                    return '#f7f7f7';
                                } else if (params.data > 0 && params.data <= 50) {
                                    return colorList[0];
                                } else if (params.data > 50 && params.data <= 100) {
                                    return colorList[1];
                                } else if (params.data > 100 && params.data <= 150) {
                                    return colorList[2];
                                } else if (params.data > 150 && params.data <= 200) {
                                    return colorList[3];
                                } else if (params.data > 200 && params.data <= 300) {
                                    return colorList[4];
                                } else if (params.data > 300) {
                                    return colorList[5];
                                }
                            }
                        }
                    }
                };
            } else {
                option.yAxis[j] = {
                    name: titlePollution(pollution),
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    offset: j == 0 ? 0 : (j - 1) * 40,
                    position: j == 0 ? 'left' : 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[pollution]
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12
                        }
                    }
                };
                option.series[j] = {
                    name: titlePollution(pollution),
                    type: 'line',
                    yAxisIndex: j,
                    data: data[pollution],
                    itemStyle: {
                        normal: {
                            color: colors[pollution]
                        },
                        emphasis: {
                            color: colors[pollution]
                        }
                    }
                };
            }
            j++;
        }

    }
    myChar.setOption(option);

}