var report_type = [];
var report_category = [];
var report_district = [];
var report = "";
var initSEndTime = {
    day: {
        startTime: ResetcalcTime('day_startTime', initDateTime('day').start, 'day'),
        endTime: ResetcalcTime('day_endTime', initDateTime('day').end, 'day')
    },
    week: {
        startTime: ResetcalcTime('week_startTime', initDateTime('week').start, 'week'),
        endTime: ResetcalcTime('week_endTime', initDateTime('week').end, 'week')
    },
    month: {
        startTime: ResetcalcTime('month_startTime', initDateTime('month').start, 'month'),
        endTime: ResetcalcTime('month_endTime', initDateTime('month').end, 'month')
    },
    qt: {
        startTime: ResetcalcTime('qt_startTime', initDateTime('qt').start, 'qt'),
        endTime: ResetcalcTime('qt_endTime', initDateTime('qt').end, 'qt')
    },
    year: {
        startTime: ResetcalcTime('year_startTime', initDateTime('year').start, 'year'),
        endTime: ResetcalcTime('year_endTime', initDateTime('year').end, 'year')
    }
};

$(function () {

    $("#report_pro").val(parent.provinceId);
    $("#report_city").val(parent.cityId);

    myDate.format = 'yyyy年MM月dd日';

    var tableColumns = ['__checkbox:id',
        {
            name: '__sequence',
            title: '序号'
        },
        {
            name: 'reportName',
            title: '报告名称'
        },
        {
            name: 'district',
            title: '区域'
        },
        {
            name: 'createBy',
            title: '上传人'
        },
        {
            name: 'createDt',
            title: '上传时间'
        }, {
            name: 'status',
            title: '报告状态',
            callback: 'report_status'
        }, {
            name: 'modifyBy',
            title: '删除人',
            visible: false
        },
        {
            name: 'modifyDt',
            title: '删除时间',
            visible: false
        }, {
            name: '__component:custom-action',
            title: '操作',
            titleClass: 'text-center',
            dataClass: 'custom-action text-center'
        }
    ];

    Vue.component(
        'custom-action', {
            template: [
                '<div>',
                '<button class="btn btn-info" title="查看" @click="itemAction(\'edit-view\', rowData)">查看</button> ',
                // '<button class="btn btn-warning btn-outline btn-xs" title="下载" @click="itemAction(\'edit-download\', rowData)">下载</button> ',
                '<button class="btn btn-warning" style="display: {{rowData.status == 1 ? \'none\' : \'inline\'}};" title="恢复" @click="itemAction(\'edit-renew\', rowData)">恢复</button>',
                '</div>'
            ].join(''),
            props: {
                rowData: {
                    type: Object,
                    required: true
                }
            },
            methods: {
                itemAction: function (action, data) {
                    if (action === 'edit-view') {
                        this.$dispatch('vuetable:report', data, 'view');
                    } else if (action === 'edit-renew') {
                        this.$dispatch('vuetable:report', data, 'renew');
                    }
                }
            }
        });

    Vue.config.debug = false;
    report = new Vue({
        el: "#content",
        data: {
            report_type: report_type, //报告类型
            upload_selected_type: '-1',
            report_category: report_category, //报表类型 日报 月、周、季、年报
            selected_category: '-1',
            report_name: null,
            ////////////新增5个tab 的开始结束日期///////////////
            fg_curr_tm: 'day',
            day_startTime: initSEndTime.day.startTime,
            day_endTime: initSEndTime.day.endTime,
            week_startTime: initSEndTime.week.startTime,
            week_endTime: initSEndTime.week.endTime,
            month_startTime: initSEndTime.month.startTime,
            month_endTime: initSEndTime.month.endTime,
            qt_startTime: initSEndTime.qt.startTime,
            qt_endTime: initSEndTime.qt.endTime,
            year_startTime: initSEndTime.year.startTime,
            year_endTime: initSEndTime.year.endTime,
            //          startTime: start_time_,
            //          endTime: end_time_,
            adminFlag: '1', //0代表一般用户 1代表管理员
            selected_r_status: '1', //报告默认状态“可用” 【0，1】
            //显示全部省、市、区 parentDomainType: "",//顶部选择区域数据类型 1-省 2-市 3-县
            prolist: [], //省份列表
            province: -1, //省份绑定值
            citylist: [], //城市列表
            //显示全部省、市、区 citylistCache: [], //顶部选市级数据时暂存市列表
            city: -1, //城市绑定值
            districtlist: [], //县列表
            //显示全部省、市、区 districtlistCache: [], //顶部选区级数据时暂存市列表
            district: -1, //县绑定值
            ////////////////上传内容//////////////
            upload_report_name: null,
            upload_startTime: '',
            upload_endTime: '',
            upload_report_category: '-1',
            upload_report_province: -1, //省份
            upload_report_prolist: [], //上传省列表
            upload_report_city: -1, //城市
            upload_report_citylist: [], //上传城市列表
            upload_report_district: -1, //区、县
            upload_report_districtlist: [], //上传区县列表
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            rows: [],
            report_url: "", //上传文件的文件路径
            // 选中的数据
            selectedTo: [],
            allFunctions: {},
            report: {
                upload: false,
                delete: false
            },
            params: ['type=' + type, 'category=', 'pro=-1', 'city=-1', 'district=-1',
                'queryBeginTime= ' + initSEndTime.day.startTime, 'queryEndTime=' + initSEndTime.day.endTime, 'reportName=', 'adminFlag=1', 'status=1'
            ],
            monthInterval: '',
            ow365Url: ''
        },

        events: {
            'vuetable:report': function (data, action) {
                var that = this;
                if (action === 'view') {
                    var url = this.ow365Url + location.protocol + '//' + location.host + $.backendApiPath + '/file/view/' + data.reportUrl;
                    window.open(url);
                } else if (action === 'download') {
                    var url = $.coreApiPath + "/report/file/download/" + data.id;
                    window.open(url);
                } else if (action === 'delete') {
                    layer.confirm("确定删除选中的报表吗?", {
                        title: '提示',
                        btn: ['确定', '取消'], // 按钮
                        yes: function (index) {
                            var ids = [];
                            for (var i = 0; i < this.selectedTo.length; i++) {
                                ids.push(this.selectedTo[i]);
                            }
                            var recordIds = ids.join(",");
                            layer.confirm("确定删除选中的报告吗?", {
                                title: '提示',
                                btn: ['确定', '取消'], // 按钮
                                yes: function (index) {

                                    ajax($.coreApiPath + '/statistics/batchDelete', {
                                        recordIds: recordIds
                                    }, function (data) {
                                        if (data.erroCode === 2000) {
                                            layer.msg("删除成功！");
                                            that.$nextTick(function () {
                                                that.$broadcast('vuetable:refresh');
                                            });
                                        } else {
                                            //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                            layer.msg("删除失败！");
                                            return false;
                                        }
                                    })

                                }
                            });
                        }
                    });
                } else if (action === 'renew') {
                    layer.confirm("确定恢复选中的报告吗?", {
                        title: '提示',
                        btn: ['确定', '取消'], // 按钮
                        yes: function (index) {
                            ajax($.coreApiPath + '/statistics/recoverReport', {
                                recordId: data.id
                            }, function (data) {
                                if (data.erroCode === 2000) {
                                    layer.msg("恢复成功！");
                                    that.$nextTick(function () {
                                        that.$broadcast('vuetable:refresh');
                                    });
                                } else {
                                    //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                    layer.msg("恢复失败，请稍候再试！");
                                    return false;
                                }
                            })
                        }
                    });
                }
            }
        },
        watch: {
            selected_r_status: function () {
                var _self = this;
                _self.setSearchfg();
                if (_self.selected_r_status == 1) {
                    $(".renew").hide();
                    $("#deleteReport").show();
                } else {
                    $(".renew").show();
                    $("#deleteReport").hide();
                }

                for (var j = 0; j < _self.fields.length; j++) {
                    var fieldName = _self.fields[j].name;
                    if (fieldName == 'modifyBy' || fieldName == 'modifyDt')
                        if (_self.selected_r_status == 1) {
                            _self.fields[j].visible = false;
                        } else {
                            _self.fields[j].visible = true;
                        }
                }
            },
            province: function () {
                if (this.prolist.length < 2) {
                    return;
                }
                var that = this;
                if (this.province == -1) {
                    this.citylist = [];
                    this.city = -1;
                    this.districtlist = [];
                    this.district = -1;
                } else {
                    /*显示全部省、市、区  if(parseInt(this.parentDomainType) >= 2){//顶部选择市级数据
                        this.citylist = this.citylistCache;
                        this.city = this.citylist[0].id;
                        this.districtlist = [];
                    }
                    else{//*/

                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/domain/child/' + that.province,
                        dataType: "json",
                        sucessFn: function (data) {
                            if (data) {
                                that.citylist = that.convertDomainList(data, 'city');
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                    this.city = -1;
                    //显示全部省、市、区  }
                    /*
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/rest/station/getCity/' + that.province,
                        dataType: "json",
                        contentType: 'application/json; charset=UTF-8',
                        sucessFn: function(data) {
                            that.citylist = data;
                        },
                        errorFn: function(errorMsg) {
                            layer.msg('请求失败！');
                        }
                    });
                    //*/
                }
                //this.city = -1;
            },
            city: function () {
                if (this.citylist.length < 2) {
                    return;
                }
                var that = this;
                if (that.city == -1) {
                    //that.citylist = [];
                    this.districtlist = [];
                    this.district = -1;
                } else {
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/domain/child/' + that.city,
                        dataType: "json",
                        sucessFn: function (data) {
                            if (data) {
                                that.districtlist = that.convertDomainList(data, 'district');
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                    this.district = -1;

                    /*显示全部省、市、区  if(parseInt(this.parentDomainType) >= 3){//顶部选择区级数据
                        this.districtlist = this.districtlistCache;
                        this.district = this.districtlist[0].id;
                    }
                    else{
                        var param = {
                            cityId: that.city
                        };
                        ajax($.coreApiPath + "/pollution/districts", param, function(data) {
                            if(data.length) {
                                for(var i in data) {
                                    var city_info = {
                                        id: '',
                                        district: ''
                                    };
                                    if(data[i].id != '' && data[i].id != null) {
                                        city_info.id = data[i].id;
                                        city_info.district = data[i].district;
                                        that.districtlist.push(city_info);
                                    }
                                }
                            }
                        });
                    }//*/
                }
            },
            upload_report_province: function () {
                if (this.upload_report_prolist.length < 2) {
                    return;
                }
                var that = this;
                if (this.upload_report_province == -1) {
                    this.upload_report_citylist = [];
                    this.upload_report_districtlist = [];
                    this.upload_report_city = -1;
                } else {
                    /*显示全部省、市、区if(parseInt(this.parentDomainType) >= 2){//顶部选择市级数据
                        this.upload_report_citylist = this.citylistCache;
                        this.upload_report_city = this.upload_report_citylist[0].id;
                        this.upload_report_districtlist = [];
                    }
                    else{//*/
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/domain/child/' + that.upload_report_province,
                        dataType: "json",
                        sucessFn: function (data) {
                            if (data) {
                                that.upload_report_citylist = that.convertDomainList(data, 'city');
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                    this.upload_report_city = -1;
                    //显示全部省、市、区}
                    /*
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/rest/station/getCity/' + that.upload_report_province,
                        dataType: "json",
                        contentType: 'application/json; charset=UTF-8',
                        sucessFn: function(data) {
                            that.upload_report_citylist = data;
                        },
                        errorFn: function(errorMsg) {
                            layer.msg('请求失败！');
                        }
                    });//*/
                }
                //this.upload_report_city = -1;
            },
            upload_report_city: function () {
                if (this.upload_report_citylist.length < 2) {
                    return;
                }
                var that = this;
                if (that.upload_report_city == -1) {
                    //this.upload_report_citylist = [];
                    this.upload_report_districtlist = [];
                    this.upload_report_district = -1;
                } else {
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/domain/child/' + that.upload_report_city,
                        dataType: "json",
                        sucessFn: function (data) {
                            if (data) {
                                that.upload_report_districtlist = that.convertDomainList(data, 'district');
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                    this.upload_report_district = -1;

                    /*显示全部省、市、区 if(parseInt(this.parentDomainType) >= 3){//顶部选择区级数据
                        this.upload_report_districtlist = this.districtlistCache;
                        this.upload_report_district = this.upload_report_districtlist[0].id;
                    }
                    else{
                        var param = {
                            cityId: that.upload_report_city
                        };
                        ajax($.coreApiPath + "/pollution/districts", param, function(data) {
                            if(data.length) {
                                for(var i in data) {
                                    var city_info = {
                                        id: '',
                                        district: ''
                                    };
                                    if(data[i].id != '' && data[i].id != null) {
                                        city_info.id = data[i].id;
                                        city_info.district = data[i].district;
                                        that.upload_report_districtlist.push(city_info);
                                    }
                                }
                            }
                        });
                    }//*/
                }
            },
            perPage: function () {

                this.setSearchfg();
            },
            selected_district: function () {
                this.setSearchfg();
            },
            selected_category: function () {
                this.setSearchfg();
            },
            upload_selected_type: function () {
                $(".upload_endtime_container").hide();
                switch (this.upload_selected_type) {
                    case '-1': {
                        this.upload_startTime = '';
                        this.upload_endTime = '';
                    }
                        break;
                    case 'day': //日报
                    {
                        uploadReport(6, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'week': //周报
                    {
                        uploadReport(7, 'upload_startTime', 'upload_endTime');
                        $(".upload_endtime_container").show();
                    }
                        break;
                    case 'month': //月报
                    {
                        uploadReport(8, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'qt': //季报
                    {
                        uploadReport(9, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'year': //年报
                    {
                        uploadReport(10, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                }
            }
        },
        ready: function () {

            var that = this;
            that.initAllFunctions();
            CommonUtil.ajax({
                type: "get",
                url: $.coreApiPath + '/domain/cascade/' + parent.cityId,//显示全部省、市、区  + parent.domainId,
                dataType: "json",
                sucessFn: function (data) {
                    if (data) {
                        //省列表取值
                        that.prolist = that.convertDomainList(data.provinceList, 'province');
                        that.province = that.prolist[0].id;
                        that.upload_report_province = that.prolist[0].id;
                        that.upload_report_prolist = that.prolist;
                        //市列表取值
                        that.citylist = that.convertDomainList(data.cityList, 'city');
                        that.upload_report_citylist = that.citylist;
                        //区列表取值
                        that.districtlist = that.convertDomainList(data.districtList, 'district');
                        that.upload_report_districtlist = that.districtlist;
                        if (data.domainDTO[0].cityType < 2) {
                            //当前区域是省
                            that.citylist.splice(0, 0, {id: -1, city: '请选择'});
                        }
                        if (data.domainDTO[0].cityType < 3) {
                            //当前区域是市
                            that.districtlist.splice(0, 0, {id: -1, district: '请选择'});
                        }
                        that.city = that.citylist[0].id;
                        that.upload_report_city = that.citylist[0].id;
                        that.district = that.districtlist[0].id;
                        that.upload_report_district = that.districtlist[0].id;
                    }
                    that.setSearchfg();
                },
                errorFn: function (errorMsg) {
                    layer.msg('网络或服务器异常，请稍后重试！');
                }
            });
            /*
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + '/rest/station/getProvince',
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function(data) {
                    that.prolist = data;
                    that.upload_report_prolist = data;
                },
                errorFn: function(errorMsg) {
                    layer.msg('未查询到数据！');
                }
            });
            //*/

            var url = $.coreApiPath + "/dictionary/dictionaryType";
            var param = {
                "type": 93
            };

            ajax(url, param, function (data) {
                if (data != null && data.length > 0) {
                    if (data.length) {

                        for (var i in data) {
                            var config_type = {
                                code: '',
                                text: ''
                            };
                            if (data[i].code != '' && data[i].id != null) {
                                config_type.code = data[i].code;
                                config_type.text = data[i].name;
                                that.report_category.push(config_type);
                            }
                        }
                    }
                }
            });

            var param2 = {
                "type": 92
            };
            ajax(url, param2, function (data) {
                if (data != null && data.length > 0) {
                    if (data.length) {

                        for (var i in data) {
                            var config_type = {
                                code: '',
                                text: ''
                            };
                            if (data[i].id != '' && data[i].id != null) {
                                config_type.code = data[i].code;
                                config_type.text = data[i].name;
                                that.report_type.push(config_type);
                            }
                        }
                    }
                }
            })
            ajax_get($.coreApiPath + '/report/file/viewUrl', {}, function (json) {
                if (json.erroCode == 2000) {
                    that.ow365Url = json.result;
                }
            })
        },
        methods: {
            initAllFunctions: function () {
                var _self = this;
                var url = $.coreApiPath + "/role/functionRole";
                ajax_get(url, {}, function (data) {
                    if (data.erroCode == 2000) {
                        _self.allFunctions = data.result;
                        _self.report.upload = _self.allFunctions['ROLE_FUN_103_06_01'] != undefined;
                        _self.report.delete = _self.allFunctions['ROLE_FUN_103_06_02'] != undefined;
                    } else {
                        _self.allFunctions = {};
                        _self.report = {upload: false, delete: false};
                    }
                });
            },
            convertDomainList: function (domainList, nameProp) {
                var ret = [];
                $.each(domainList, function (i, e) {
                    var ne = {
                        "id": e.id
                    };
                    ne[nameProp] = e.domainName;
                    ret.push(ne);
                });
                return ret;
            },
            setSearchfg: function () {
                var that = this;
                var timefg = that.returnSEndTime(that.fg_curr_tm),
                    start = timefg.start,
                    end = timefg.end,
                    type = timefg.type;
                that.reportSearch(start, end, type);
            },
            returnSEndTime: function (index) {
                switch (index) {
                    case "day": {
                        return {
                            start: this.day_startTime,
                            end: this.day_endTime,
                            type: 'day'
                        }
                    }
                        break;
                    case "week": {
                        return {
                            start: this.week_startTime,
                            end: this.week_endTime,
                            type: 'week'
                        }
                    }
                        break;
                    case "month": {
                        return {
                            start: this.month_startTime,
                            end: this.month_endTime,
                            type: 'month'
                        }
                    }
                        break;
                    case "qt": {
                        return {
                            start: this.qt_startTime,
                            end: this.qt_endTime,
                            type: 'qt'
                        }
                    }
                        break;
                    case "year": {
                        return {
                            start: this.year_startTime,
                            end: this.year_endTime,
                            type: 'year'
                        }
                    }
                        break;
                }
            },
            setCurrTimefg: function (fg) {
                clearAllCheckBoxByClass("checkbox_id");
                switch (fg) {
                    case 'day': {
                        this.fg_curr_tm = 'day';
                    }
                        break;
                    case 'week': {
                        this.fg_curr_tm = 'week';
                    }
                        break;
                    case 'month': {
                        this.fg_curr_tm = 'month';
                    }
                        break;
                    case 'qt': {
                        this.fg_curr_tm = 'qt';
                    }
                        break;
                    case 'year': {
                        this.fg_curr_tm = 'year';
                    }
                        break;
                }
                if (fg == 'qt') {
                    this.monthInterval = setInterval(function () {
                        if ($('iframe')[0]) {
                            $('iframe').contents().find('.MMenu + .yminput, .NavImgl, .NavImgll').hide();
                        }
                    }, 50);
                } else {
                    clearInterval(this.monthInterval);
                }
                this.setSearchfg();
            },
            totransformDate: function (dateV) {
                dateV = dateV.replace(/([^\u0000-\u00FF])/g, '-'); //替换掉中文
                dateV = dateV.replace(/(\D*$)/g, ''); //去掉结尾的多余 -
                return dateV;
            },
            reportSearch: function (start, end, type) {
                var Nstart = this.totransformDate(start),
                    Nend = this.totransformDate(end);
                var dateStart = new Date(Nstart),
                    dateEnd = new Date(Nend);
                var start_year = dateStart.getFullYear(),
                    start_month = dateStart.getMonth() + 1,
                    start_day = dateStart.getDate(),
                    end_year = dateEnd.getFullYear(),
                    end_month = dateEnd.getMonth() + 1,
                    end_day = dateEnd.getDate();
                var d_value_year = end_year - start_year, //年的差值
                    d_value_month = end_month - start_month, //月的差值
                    d_value_day = end_day - start_day; //天的差值
                //console.log("差的  年 " + d_value_year + "   月 " + d_value_month + "  日" + d_value_day)
                var that = this;
                var param = {
                    type: type,
                    category: that.selected_category,
                    pro: that.province,
                    city: that.city,
                    district: that.district,
                    queryBeginTime: start,
                    queryEndTime: end,
                    reportName: that.report_name,
                    status: that.selected_r_status,
                    adminFlag: '1'
                };
                if (param.queryBeginTime > param.queryEndTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                if (param.queryBeginTime != param.queryEndTime) {
                    switch (type) {
                        case 'day': {
                            if (d_value_year == 0) { //一年内的时间判断
                                if (d_value_month > 1) {
                                    layer.msg("查询时间不能超过一个月！");
                                    return;
                                } else if (d_value_month == 1) {
                                    if (d_value_day >= 1) {
                                        layer.msg("查询时间不能超过一个月");
                                        return;
                                    }
                                }
                            } else if (d_value_year == 1) { //跨年 12月 -1月
                                if (d_value_month == -11) {
                                    if (d_value_day >= 1) {
                                        layer.msg("查询时间不能超过一个月");
                                        return;
                                    }
                                } else {
                                    layer.msg("查询时间不能超过一个月");
                                    return;
                                }

                            } else {
                                layer.msg("查询时间不能超过一个月！");
                                return;
                            }
                        }
                            break;
                        case 'qt': //不得大于3个季度
                        {
                            if (d_value_year == 1) {
                                if (d_value_month >= 0) {
                                    layer.msg("查询时间不能超过一年！");
                                    return;
                                }
                            } else if (d_value_year > 1) {
                                layer.msg("查询时间不能超过一年");
                                return;
                            }
                        }
                            break;
                        case 'week':
                        case 'month': {
                            if (d_value_year == 1) {
                                if (d_value_month >= 1) {
                                    layer.msg("查询时间不能超过一年！");
                                    return;
                                } else if (d_value_month == 0) {
                                    if (d_value_day > 1) {
                                        layer.msg("查询时间不能超过一年");
                                        return;
                                    }
                                }
                            } else if (d_value_year > 1) {
                                layer.msg("查询时间不能超过一年");
                                return;
                            }
                        }
                            break;
                    }
                }

                var sp = CommonUtil.json2Array(param);
                for (var i = 0; i < sp.length; i++) {
                    this.params.push(sp[i]);
                }
                that.$nextTick(function () {
                    that.$broadcast('vuetable:refresh');
                });
            },
            refreshTab: function () {
                var that = this;
                that.$nextTick(function () {
                    that.$broadcast('vuetable:refresh');
                });
            },
            report_status: function (value) {
                return value == '1' ? '可用' : '不可用'
            },
            clearInputfile: function (id) {
                //初始上传文件控件
                $("li[id^='fileBox']").remove();
                $(".upload-pick").show();
                this.initFilesUpload();
                $('#' + id).modal('show');
                $('#file-1').fileinput('reset');
                $('#file-1').fileinput('enable');
                document.getElementById("reportUploadFrm").reset(); //重置表单
                $("#upload_endtime_container").hide();
                this.report_url = ''; //清空上传文件路径
                this.upload_startTime = '';
                this.upload_endTime = '';
                //uploadReport(6, 'upload_startTime', 'upload_endTime'); //重置默认“日报”的日期
            },
            closeFileModal: function (id) {
                $('#' + id).modal('hide');
            },
            selected_type_change: function () {
                $("#upload_endtime_container").hide();
                switch (this.upload_selected_type) {
                    case '-1': {
                        this.upload_startTime = '';
                        this.upload_endTime = '';
                    }
                        break;
                    case 'day': //日报
                    {
                        uploadReport(6, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'week': { //周报
                        uploadReport(7, 'upload_startTime', 'upload_endTime');
                        $("#upload_endtime_container").show();
                    }
                        break;
                    case 'month': //月报
                    {
                        uploadReport(8, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'qt': //季报
                    {
                        uploadReport(9, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                    case 'year': //年报
                    {
                        uploadReport(10, 'upload_startTime', 'upload_endTime');
                    }
                        break;
                }
            },
            mulDelete: function () {
                var that = this;
                if (this.selectedTo.length == 0) {
                    layer.msg('请先选择要删除的报告');
                    return;
                } else {

                    var ids = [];
                    for (var i = 0; i < this.selectedTo.length; i++) {
                        ids.push(this.selectedTo[i]);
                    }
                    var recordIds = ids.join(",");
                    layer.confirm("确定删除选中的报告吗?", {
                        title: '提示',
                        btn: ['确定', '取消'], // 按钮
                        yes: function (index) {

                            ajax($.coreApiPath + '/statistics/batchDelete', {
                                recordIds: recordIds
                            }, function (data) {
                                if (data.erroCode === 2000) {
                                    layer.msg("删除成功！");
                                    that.$nextTick(function () {
                                        that.$broadcast('vuetable:refresh');
                                    });
                                } else {
                                    //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                    layer.msg("删除失败！");
                                    return false;
                                }
                            })

                        }
                    });
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
            removeImageCallBack: function (file) {
                //附件url删除
                this.report_url = "";
            },
            initFilesUpload: function () {
                var _self = this;
                this.report_url = "";
                //上传图片
                var webUploader = $('#filesUpload').diyUpload({
                    url: $.backendApiPath + '/file/upload',
                    auto: true,
                    success: function (data, file) {
                        if (data.erroCode != 2000) {
                            webUploader.trigger('uploadError', file, "Server error");
                        } else {
                            //上传成功
                            _self.report_url = data.result.url;
                            file.wmUrl = data.result.url;
                        }
                    },
                    error: function (err, file) {
                        $("#fileBox_" + file.id).remove();
                        layer.msg("上传文件" + file.name + "失败！！！");
                    },
                    removeCallback: _self.removeImageCallBack,
                    buttonText: '',
                    accept: {
                        title: "Files",
                        extensions: 'pdf,doc,docx,xls,xlsx'
                    },
                    //最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
                    fileNumLimit: 1,
                    fileSingleSizeLimit: 10 * 1024 * 1024,
                    thumb: {
                        width: 120,
                        height: 90,
                        quality: 100,
                        allowMagnify: true,
                        crop: true
                    }
                });
            }
        }
    });
});

/**
 * 文件上传  保存
 */
function reportUpload() {
    var upload_selected_type = report.upload_selected_type;
    if (upload_selected_type == "-1") {
        layer.msg("请选择所报告类别！");
        return false;
    }

    var upload_report_province = report.upload_report_province;
    if (upload_report_province == "-1") {
        layer.msg("请选择省！");
        return false;
    }

    var upload_report_city = report.upload_report_city;
    if (upload_report_city == "-1") {
        layer.msg("请选择城市！");
        return false;
    }

    var upload_report_category = report.upload_report_category;
    if (upload_report_category == "-1") {
        layer.msg("请选择报告类型！");
        return false;
    }

    if (report.upload_startTime == "" || report.upload_startTime == null) {
        layer.msg("请选择报告时间！");
        return false;
    }

    if (report_type == "week") {
        var upload_endTime = report.upload_endTime;
        report.upload_endTime = upload_endTime;
        if (upload_startTime >= upload_endTime) {
            layer.msg("报告开始时间必须小于结束时间！");
            return false;
        }
    }

    var queryBeginTime = report.upload_startTime;
    var queryEndTime = $("#upload_endTime").val();
    report.upload_endTime = queryEndTime;

    var report_url = report.report_url;
    if (report_url == "") {
        layer.msg("请上传报告后保存！");
        return false;
    }
    var fileName = '';
    for (var i = 0; i < report.upload_report_citylist.length; i++) {
        if (report.upload_report_citylist[i].id == upload_report_city) {
            fileName += report.upload_report_citylist[i].city + "_";
        }
    }
    var upload_report_district = report.upload_report_district;
    if (upload_report_district != '-1') {
        for (var j = 0; j < report.upload_report_districtlist.length; j++) {
            if (report.upload_report_districtlist[j].id == upload_report_district) {
                fileName += report.upload_report_districtlist[j].district + "_";
            }
        }
    }

    switch (report.upload_report_category) {
        case "1": {
            fileName += "监测数据";
        }
            break;
        case "2": {
            fileName += "监测数据分析";
        }
            break;
        case "3": {
            fileName += "空气质量及污染趋势";
        }
            break;
    }
    switch (report.upload_selected_type) {
        case "day": {
            fileName += "日报_" + report.upload_startTime;
        }
            break;
        case "week": {
            fileName += "周报_" + report.upload_startTime + "-" + report.upload_endTime;
        }
            break;
        case "month": {
            fileName += "月报_" + report.upload_startTime;
        }
            break;
        case "qt": {
            fileName += "季报_" + report.upload_startTime;
        }
            break;
        case "year": {
            fileName += "年报_" + report.upload_startTime;
        }
            break;
    }
    $("#report_name").val(fileName);
    var postData = serializeObject("reportUploadFrm");
    CommonUtil.ajax({
        type: "post",
        url: $.coreApiPath + "/statistics/savePploadReport",
        dataType: "json",
        async: false,
        data: postData,
        contentType: 'application/json; charset=UTF-8',
        sucessFn: function (r) {

            if (r) {
                layer.msg("保存成功");
                closeModalCallBack("UploadModal", clearUpload);
                report.refreshTab();

            } else {
                layer.msg('网络或服务器异常，请稍后重试！');
                return false;
                //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
            }

        },
        errorFn: function (errorMsg) {
            layer.msg('网络或服务器异常，请稍后重试！');
        }
    });
}