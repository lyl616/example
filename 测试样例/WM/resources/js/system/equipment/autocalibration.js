var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy-MM-dd HH:mm'
});
var kb_result_list = [];
var tableColumns = [
    {
        name: '__checkbox:id',
        callback: 'tooggleCheckbox',
        callbackitem: 'tooggleCheckbox'
    },
    {
        name: 'station_id',
        title: '监测点编号',
        titleClass: 'text-center w8sc',
        dataClass: 'text-center w8sc'
    }, {
        name: 'station_name',
        title: '监测点名称',
        titleClass: 'text-center w8sc',
        dataClass: 'text-center w8sc'
    }, {
        name: 'equipment_id',
        title: '设备编号',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    }, {
        name: 'pollution_type', //count
        title: '传感器',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc',
        callback: 'dealview'
    },
    {
        name: 'k_ori',
        title: '设备K值',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'k_new',
        title: '训练K值',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'b_ori',
        title: '设备B值',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'b_new',
        title: '训练B值',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'evaluation_n',
        title: '实际误差',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'evaluation_o',
        title: '模拟误差',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'ins_time',
        title: '训练集',
        titleClass: 'text-center w12sc',
        dataClass: 'text-center w12sc'
    },
    {
        name: 'action_time',
        title: '下发时间',
        titleClass: 'text-center w12sc',
        dataClass: 'text-center w12sc'
    },
    {
        name: 'operator',
        title: '下发人',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'
    },
    {
        name: 'status',
        title: '下发结果',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'

    }
];
Vue.config.debug = false;

var arr = ['pm25', 'pm10', 'co', 'so2', 'o3', 'no2'],
    initSEndTime = {
        startTime: initradioDate().start,
        endTime: initradioDate().end,
        startTime1: initradioDate().start1,
        endTime1: initradioDate().end1
    };

function initradioDate() {
    var start = new Date(myDate.year, myDate.month - 1, myDate.day - 6, myDate.hour, myDate.minus),
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, myDate.minus);
    myDate.format = 'yyyy-MM-dd';
    var start2 = myDate.formatDate(start, myDate.format);
    var end2 = myDate.formatDate(end, myDate.format);
    var start1 = myDate.formatDate(start, 'yyyy-MM-dd hh:00');
    var end1 = myDate.formatDate(end, 'yyyy-MM-dd hh:00');
    return {
        start: start2,
        end: end2,
        start1: start1,
        end1: end1
    };
}

function other_click_hide() { //点击其他地方，隐藏kb值计算下拉框
    $(document).bind('click', function (e) {
        var e = e || window.event; //浏览器兼容性
        var elem = e.target || e.srcElement;
        while (elem) { //循环判断至跟节点，防止点击的是div子元素
            if (elem.className && (elem.className == 'drop-down-a' || elem.id == 'kb_continer')) {
                return;
            }
            elem = elem.parentNode;
        }
        $('.kb_popwindow').hide(); //点击的不是div或其子元素
    });
}

other_click_hide();

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

    }
});


var autocorect = new Vue({
    el: '#tab-autocorect',
    data: {
        amcCity: [],//已寻标城市
        initTable: true,
        perPage: 10, //初始化每页显示多少条
        showPagination: true, //是否真是分页
        pageList: [10, 20, 30, 40, 50], //分页选项
        fields: tableColumns, //表格的表头设置
        prolist: [],
        citylist: [], //
        autoorect_projectList: [], //
        province: -1, //
        city: -1, //
        selecttoggle: 1, //默认勾选全部
        querypollutionType: ['pm25', 'pm10', 'co', 'so2', 'o3', 'no2'],
        station_id: '', //站点的id
        done_people: '', //下发人
        kb_Result_type: -1, //下发KB值
        kb_Result_type_list: [],
        day_startTime: initSEndTime.startTime1, //计算kb值的计算范围，开始和结束时间
        day_endTime: initSEndTime.endTime1,
        kb_pollution: 'pm25', //kb值计算的污染类型值
        calc_currtime: '',
        selectedTo: [], //选中的数据
        rows: [],
        params: [
            'operator=-1',
            'stationId=-1',
            'kbResult=-1',
            'pollutionTypes=' + arr,
            'pro=' + this.province,
            'city=' + this.city
        ],
        loadOnStart: false,
        allFunctions: {},
        showReal: false,
        realActive: false,
        showKBxf: false,
        showKBjs: false
    },
    beforeCompile: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                var showResult = getShowResult(_self.allFunctions);
                _self.showReal = showResult.showRealTab;
                _self.realActive = showResult.realActive;

                _self.showKBxf = showResult.showKBxf;
                _self.showKBjs = showResult.showKBjs;


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
            contentType: 'application/json; charset=UTF-8',
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
                        that.province = that.prolist[0].id;
                    }
                }
            },
            errorFn: function (errorMsg) {
                layer.msg('未查询到数据！');
            }
        }); //查询省

        if (kb_result_list.length > 0) {
            that.kb_Result_type_list = kb_result_list;
        }
        else {
            var param = {
                "type": 29
            };
            ajax($.coreApiPath + "/dictionary/dictionaryType", param, function (data) {
                if (data != null && data.length > 0) {
                    if (data.length) {
                        kb_result_list = [];
                        for (var i in data) {
                            var config_type = {
                                code: '',
                                text: ''
                            };
                            if (data[i].code != '' && data[i].id != null) {
                                config_type.id = data[i].code;
                                config_type.text = data[i].name;
                                kb_result_list.push(config_type);

                            }
                        }
                        that.kb_Result_type_list = kb_result_list;
                    }
                }
            });
        }
        ajax_get($.coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
            that.autoorect_projectList = [];
            for (var i = 0; i < data.length; i++) {
                that.autoorect_projectList.push({id: data[i].id, name: data[i].name})
                // option_project.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
            }
        })
        //查询已寻标城市
        ajax_get($.coreApiPath + "/amc/city", {}, function (data) {
            if (data.erroCode == 2000) {
                that.amcCity = data.result;
            }
        });
    },
    watch: {
        perPage: function () {
            this.$broadcast('vuetable:refresh');
        },
        selecttoggle: function () { //监控“全部”是都勾选
            if (this.selecttoggle == 1) {
                this.querypollutionType = ['pm25', 'pm10', 'co', 'so2', 'o3', 'no2'];
            } else if (this.selecttoggle == 0) {
                this.querypollutionType = [];
            }
        },
        querypollutionType: function () {
            var arrLength = this.querypollutionType.length;
            if (arrLength == 6) {
                this.selecttoggle = 1;
            } else if (arrLength != 6) {
                this.selecttoggle = -1;
            }
        },
        station_id: function () {
            var msg = rTrim(this.station_id);
            var letter_num = 50 - msg.length;
            if (letter_num == 0) {
                this.station_id = msg.substring(0, 50);
            } else if (letter_num < 0) {
                this.station_id = msg.substring(0, 50);
                layer.msg('输入的内容不得大于50字！');
            }
        },
        province: function () {
            var that = this;
            if (that.prolist.length < 2) {
                return;
            }
            if (this.province == -1) {
                this.citylist = [];
                //				this.districtlist = [];
            } else {
                CommonUtil.ajax({
                    type: "get",
                    url: $.coreApiPath + '/domain/child/' + that.province,
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
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
                            if (that.initTable) {
                                that.search();
                                that.initTable = false;
                            }
                        }
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('请求失败！');
                    }
                });
            }
            this.city = -1;
        }
    },
    methods: {
        dealview: function (val) {
            return toChangePollution_Val(val);
        },
        show_kbWindow: function () {
            $('.kb_popwindow').toggle();
        },
        calc_kb: function () { //计算KB值
            var that = this;
            if (this.province == -1) {
                layer.msg("请选择省份");
                return;
            }
            if (this.city == -1) {
                layer.msg("请选择城市");
                return;
            }
            if (this.kb_pollution == -1) {
                layer.msg("请选择污染类型");
                return;
            }
            if (this.day_startTime > this.day_endTime) {
                layer.msg("开始时间不能大于结束时间！");
                return;
            }
            if (this.amcCity.indexOf(parseInt(this.city)) < 0) {
                layer.msg("您所选的城市未寻标！");
                return;
            }

            if(!calcDate_interval(this.day_startTime, this.day_endTime, '1month_hh')){
            	return;
            }
            var time1 = timeToConvert(this.day_startTime),
                time2 = timeToConvert(this.day_endTime);
            var url = $.coreApiPath + '/amc/calc/' + this.province + '/' + this.city + "/" + time1 + "/" + time2 + '/' + this.kb_pollution + "/";
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                anync: true,
                success: function (data) {
                    if (data.erroCode == 2000) {
                        that.show_kbWindow();
                        layer.msg('已成功下发校准命令，<br/>请稍等一段时间查看。', {
                            icon: 1
                        });
                        ///////////刷新页面table 列表////////////

                    } else if (data.erroCode == 400) {
                        layer.msg(data.erroMsg);
                        //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                    }
                },
                error: function () {
                    layer.msg("发生意外，计算失败，请重新计算！");
                }
            });

        },
        confirm_done: function () {
            var that = this;
            if (this.selectedTo.length == 0) {
                layer.msg('请先选择要下发K/b值的站点！');
                return;
            }
            var ids = [];
            for (var i = 0; i < this.selectedTo.length; i++) {
                if (this.selectedTo[i] != null) {
                    ids.push(this.selectedTo[i]);
                }
            }
            layer.confirm("是否进行K/B值校准？", {
                title: '温馨提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    $.ajax({
                        type: "post",
                        url: $.coreApiPath + '/amc/sendKB?ids=' + ids,
                        dataType: "json",
                        data: JSON.stringify(ids),
                        contentType: 'application/json; charset=UTF-8',
                        success: function (data) {
                            if (data.erroCode == 2000) {
                                layer.msg('已成功下发校准命令，<br/>请稍等一段时间查看。', {
                                    icon: 1
                                });
                                that.search();
                                layer.close(index);
                            } else {
                                //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                layer.close(index);
                            }
                        },
                        error: function (errorMsg) {
                            console.log('3000');
                            layer.close(index);
                        }
                    });
                }
            });
        },
        search: function () {

            this.selectedTo = [];
            var s_id = (this.station_id != '') ? this.station_id : -1,
                q_t = (this.querypollutionType != '') ? this.querypollutionType : -1,
                kb_t = (this.kb_Result_type != '') ? this.kb_Result_type : -1,
                d_p = (this.done_people != '') ? this.done_people : -1;
            var param = {
                projectId: $("#option_project").val(),
                stationId: s_id, //站点类型
                pollutionTypes: q_t, //污染类型
                city: this.city, //城市
                pro: this.province,
                kbResult: kb_t,
                operator: d_p
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
        }
    },
    events: {
        'vuetable:cell-mouseenter': function (data, field, event) {
            var fieldNname = field.name,
                val = data[fieldNname];
            if (fieldNname == 'station_name') {
                layer.tips(data.addr, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
            if (fieldNname == 'ins_time') {
                var str = data.begin_time + "<br/>" + data.end_time;
                layer.tips(str, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
        },
        'vuetable:cell-mouseleave': function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        'vuetable:load-success': function (response) {
            var data = response.result.data;
            for (n in data) {
                //var index = data[n].itemNumber;
                if (data[n].status == '成功' || data[n].status == '发送中') {
                    $('td.vuetable-checkboxes').eq(n).empty();
                    data[n].id = null;
                }
            }
        }
    }
});

//-----------------------------------------历史校准记录-------------------------------------------------------
var historytableColumns = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center w3p5sc',
        dataClass: 'text-center w3p5sc'
    },

    {
        name: 'station_id',
        sortField: 'station_id',
        title: '监测点编号',
        titleClass: 'text-center w6p2sc',
        dataClass: 'text-center w6p2sc'
    }, {
        name: 'station_name',
        title: '监测点名称',
        titleClass: 'text-center w7sc',
        dataClass: 'text-center w7sc'
    },
    {
        name: 'pollution_type', //count
        title: '传感器',
        titleClass: 'text-center w4p4sc',
        dataClass: 'text-center w4p4sc',
        callback: 'dealview'
    },
    {
        name: 'k_ori',
        title: '设备K值',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'k_new',
        title: '训练K值',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'b_ori',
        title: '设备B值',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'b_new',
        title: '训练B值',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'evaluation_n',
        title: '实际误差',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'evaluation_o',
        title: '模拟误差',
        titleClass: 'text-center w5p5sc',
        dataClass: 'text-center w5p5sc'
    },
    {
        name: 'tranTime',
        title: '训练集',
        titleClass: 'text-center w10p6sc',
        dataClass: 'text-center w10p6sc'
    },
    {
        name: 'hitory_time',
        sortField: 'hitory_time',
        title: '计算时间',
        titleClass: 'text-center w10p6sc',
        dataClass: 'text-center w10p6sc'
    },
    {
        name: 'batch_operator',
        title: '计算人',
        titleClass: 'text-center w4p4sc',
        dataClass: 'text-center w4p4sc'
    },
    {
        name: 'action_time',
        sortField: 'action_time',
        title: '下发时间',
        titleClass: 'text-center w10p6sc',
        dataClass: 'text-center w10p6sc'
    },
    {
        name: 'operator',
        title: '下发人',
        titleClass: 'text-center w4p4sc',
        dataClass: 'text-center w4p4sc'
    },
    {
        name: 'status',
        title: '下发结果',
        titleClass: 'text-center w6sc',
        dataClass: 'text-center w6sc'

    }
];

//当前没有提供历史功能，先屏蔽
var history_vorect = new Vue({
    el: '#tab-history-corect',
    data: {
        history_perPage: 10, //初始化每页显示多少条
        sortOrder: [{//默认 “下发K/B值”，就按照下发时间倒序+传感器+监测点编号升序排
            field: 'action_time',
            direction: 'desc'
        }, {
            field: 'pollution_type',
            direction: 'asc'
        }, {
            field: 'station_id',
            direction: 'asc'
        }
        ],
        multiSort: true,
        showPagination: true, //是否真是分页
        history_pageList: [10, 20, 30, 40, 50], //分页选项
        history_fields: historytableColumns, //表格的表头设置
        history_prolist: [],
        history_pro: -1,
        history_citylist: [], //
        his_projectList: [],
        his_result_list: [], //
        history_city: -1, //
        history_selecttoggle: 1, //默认勾选全部
        history_params: [
            'projectId=-1',
            'city=' + this.history_city,
            'stationId=-1',
            'kbResult=-1',
            'opt=1',
            'pollutionTypes=' + arr,
            'operator=-1',
            'startTime=' + initSEndTime.startTime,
            'endTime=' + initSEndTime.endTime + ' 23:59:59'
        ],
        history_query_params: {
            projectId: "-1",
            city: parent.cityId,
            kbResult: "-1",
            pollutionTypes: arr,
            stationId: "",
            operator: "",
            startTime: initSEndTime.startTime,
            endTime: initSEndTime.endTime,
            opt: "1"
        },
        loadOnStart: false,
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

            } else {
                _self.allFunctions = {};
                _self.showHistory = false;
                _self.historyActive = false;
            }
        });
    },
    ready: function () {
        var _self = this;
        if (kb_result_list.length > 0) {
            _self.his_result_list = kb_result_list;
        }
        else {
            var param = {
                "type": 29
            };
            ajax($.coreApiPath + "/dictionary/dictionaryType", param, function (data) {
                if (data != null && data.length > 0) {
                    if (data.length) {
                        kb_result_list = [];
                        for (var i in data) {
                            var config_type = {
                                code: '',
                                text: ''
                            };
                            if (data[i].code != '' && data[i].id != null) {
                                config_type.id = data[i].code;
                                config_type.text = data[i].name;
                                kb_result_list.push(config_type);
                            }
                        }
                        _self.his_result_list = kb_result_list;
                    }
                }
            });
        }


        if (autocorect.prolist.length > 0) {
            _self.history_prolist = autocorect.prolist;
            if (_self.history_pro == -1) {
                _self.history_pro = _self.history_prolist[0].id;
            }
        } else {
            CommonUtil.ajax({
                type: "get",
                url: $.coreApiPath + '/domain/cascade/0',
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    if (data) {
                        _self.history_prolist = data.provinceList;
                        _self.history_pro = -1;
                        for (var i in _self.history_prolist) {
                            if (_self.history_prolist[i].id == parent.provinceId) {
                                _self.history_pro = parent.provinceId;
                            }
                        }
                        if (_self.history_pro == -1) {
                            _self.history_pro = _self.history_prolist[0].id;
                        }
                    }
                },
                errorFn: function (errorMsg) {
                    layer.msg('未查询到数据！');
                }
            }); //查询省
        }


        if (autocorect.autoorect_projectList.length > 0) {
            _self.his_projectList = autocorect.autoorect_projectList;
        } else {
            ajax_get($.coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
                _self.his_projectList = [];
                for (var i = 0; i < data.length; i++) {
                    _self.his_projectList.push({id: data[i].id, name: data[i].name})
                    // option_project.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
                }
            })
        }
    },
    watch: {
        history_perPage: function () {
            this.$broadcast('vuetable:refresh');
        },
        history_selecttoggle: function () { //监控“全部”是都勾选
            if (this.history_selecttoggle == 1) {
                this.history_query_params.pollutionTypes = ['pm25', 'pm10', 'co', 'so2', 'o3', 'no2'];
            } else if (this.history_selecttoggle == 0) {
                this.history_query_params.pollutionTypes = [];
            }
        },
        'history_query_params.pollutionTypes': function (value) {
            var arrLength = this.history_query_params.pollutionTypes.length;
            if (arrLength == 6) {
                this.history_selecttoggle = 1;
            } else if (arrLength != 6) {
                this.history_selecttoggle = -1;
            }
        }, 'history_query_params.opt': function (value) {
            var _self = this;
            var opt = this.history_query_params.opt;
            if (opt == 1) {//kb值下发
                _self.sortOrder = [{
                    field: 'action_time',
                    direction: 'desc'
                }, {
                    field: 'pollution_type',
                    direction: 'asc'
                }, {
                    field: 'station_id',
                    direction: 'asc'
                }];
                _self.loadHisTable(true);
            } else if (opt == 2) {//kb值计算
                _self.sortOrder = [{
                    field: 'begin_time',
                    direction: 'desc'
                }, {
                    field: 'pollution_type',
                    direction: 'asc'
                }, {
                    field: 'station_id',
                    direction: 'asc'
                }];
                _self.loadHisTable(true);
            }
        },
        history_station_id: function () {
            var msg = rTrim(this.history_station_id);
            var letter_num = 50 - msg.length;
            if (letter_num == 0) {
                this.history_station_id = msg.substring(0, 50);
            } else if (letter_num < 0) {
                this.history_station_id = msg.substring(0, 50);
                layer.msg('输入的内容不得大于50字！');
            }
        },
        history_pro: function () {
            var that = this;
            if (that.history_pro.length < 2) {
                return;
            }
            if (this.history_pro == -1) {
                this.history_citylist = [];
                //				this.districtlist = [];
            } else {
                CommonUtil.ajax({
                    type: "get",
                    url: $.coreApiPath + '/domain/child/' + that.history_pro,
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (data) {
                        if (data) {
                            that.history_citylist = data;
                            that.history_city = -1;
                            for (var i in that.history_citylist) {
                                if (that.history_citylist[i].id == parent.cityId) {
                                    that.history_city = parent.cityId;
                                }
                            }
                            if (that.history_city == -1) {
                                that.history_city = data[0].id;
                            }
                            if (that.initTable) {
                                that.search();
                                that.initTable = false;
                            }
                        }
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('请求失败！');
                    }
                });
            }
            this.history_city = -1;
        }
    },
    methods: {
        dealview: function (val) {
            return toChangePollution_Val(val);
        },
        loadHisTable: function (flag) {
            var _self = this;
            if (flag) {//是否需要验证
                if (_self.history_query_params.startTime > _self.history_query_params.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                if(!calcDate_interval(_self.history_query_params.startTime,_self.history_query_params.endTime, '1month')){
                	return;
                }
                if (_self.history_pro == "-1") {
                    layer.msg("请选择省")
                    return false;
                }
                if (_self.history_city == "-1") {
                    layer.msg("请选择城市！");
                    return false;
                }
            }
            _self.history_params = [];

            _self.history_query_params.city = _self.history_city;

            var sp = CommonUtil.json2Array(_self.history_query_params);
            for (var i = 0; i < sp.length; i++) {
                if (sp[i].indexOf('endTime') > -1) {
                    _self.history_params.push(sp[i] + ' 23:59:59');
                } else {
                    _self.history_params.push(sp[i]);
                }
            }
            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
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
        }
    },
    events: {
        'vuetable:cell-mouseenter': function (data, field, event) {
            var fieldNname = field.name,
                val = data[fieldNname];
            if (fieldNname == 'station_name') {
                layer.tips(data.addr, event.srcElement, {
                    tips: 1,
                    time: 0
                });
            }
        },
        'vuetable:cell-mouseleave': function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        'vuetable:load-success': function (response) {
            var data = response.result.data;
            for (n in data) {
                //var index = data[n].itemNumber;
                if (data[n].status == '成功' || data[n].status == '发送中') {
                    $('td.vuetable-checkboxes').eq(n).empty();
                    data[n].id = null;
                }
            }
        }
    }
});


function loadReal() {
    autocorect.search();
}

function loadHis() {
    history_vorect.loadHisTable(false);
}


function getShowResult(allFunctions) {
    var showRealTab = allFunctions['ROLE_FUN_102_03_02_01'] != undefined;
    var showHisTab = allFunctions['ROLE_FUN_102_03_02_02'] != undefined;
    var showKBxf = allFunctions['ROLE_FUN_102_03_02_03'] != undefined;
    var showKBjs = allFunctions['ROLE_FUN_102_03_02_04'] != undefined;
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
        showKBxf: showKBxf,
        showKBjs: showKBjs,
        showHisTab: showHisTab,
        realActive: realActive,
        historyActive: historyActive
    }
}