var curr_city = parent.cityId,
    curr_city_name = parent.cityName;

function initWdateVal(domId, time, fm) {
    var result = "";
    initWDatetime(domId, fm, time);
    result = myDate.formatDate(time, fm);
    return result;
}

function totransformDate(dateV) {
    dateV = dateV.replace(/([^\u0000-\u00FF])/g, '-'); //替换掉中文
    dateV = dateV.split(' ');
    dateV[0] = dateV[0].replace(/(\D*$)/g, ''); //去掉结尾的多余 -：为yyyy-MM-dd
    dateV[1] = dateV[1].replace(/(\D*$)/g, ''); //去掉结尾的多余 -:为HH:mm
    dateV[1] = dateV[1].replace('-', ":");
    dateV[1] = dateV[1] + ":00";
    var NdateV = dateV[0] + " " + dateV[1];
    //console.log("设置的查询时间      " + NdateV);
    return NdateV;
}

function timeToConvert(stringTime) {
    var timestamp = new Date(stringTime).getTime();
    //console.log("转换时间后            " + timestamp);
    return timestamp;
}

function judge_textarea() {
    var msg = $("#closeWarnMsg").val();
    var get_msg = rTrim(msg);
    var letter_num = 200 - get_msg.length,
        input_msg = '';
    //	console.log("letter_num  " + letter_num + "   字符个数    " + get_msg.length);
    if (letter_num == 0) {
        input_msg = get_msg.substring(0, 200);
        $("#closeWarnMsg").prop("value", input_msg);
        $("#msg_num").html("0");
    } else if (letter_num > 0) {
        $("#msg_num").html(letter_num);
    } else if (letter_num < 0) {
        layer.msg('输入的内容不得大于200字！');
        input_msg = get_msg.substring(0, 200);
        $("#closeWarnMsg").prop("value", input_msg);
        var n_sg = $("#closeWarnMsg").val();
        $("#msg_num").html("0");
    }
}

//////////监听实时检测，弹窗滚动条的滚动事件

function bindtable_real() {
    $("#real_pop-table .grid-body").scroll(function (event) {
        var viewH = $(this).height(), //可见高度
            contentH = $(this).get(0).scrollHeight, //内容高度
            scrollTop = $(this).scrollTop(); //滚动高度
        if (scrollTop / (contentH - viewH) >= 1) {
            //			console.log("滚动到底部，剩余记录条数    " + realwarn.real_pop_table.table.length);
            if (real_pep_pagenum <= realwarn.real_pop_table.table.length) {
                curr_page++;
                appendrealTable(realwarn.real_pop_table, 'real_table');
            } else {
                layer.msg("没有数据加载了！");
            }
        }
    });
}

//去掉字串右边的空格 
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

var realstart = new Date(myDate.year, myDate.month - 1, myDate.day),
    historyStart = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour - 24),
    historyEnd = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour),
    initSEndTime = {
        tabhistory: {
            startTime: initWdateVal('startTime', historyStart, 'yyyy-MM-dd hh'),
            endTime: initWdateVal('startTime', historyEnd, 'yyyy-MM-dd hh')
        }
    };

var real_pop_tableColumns = [{
    name: 'rowNum',
    title: '序号',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'lastOccurTime',
    title: '异常时间',
    titleClass: 'text-center',
    dataClass: 'text-center'
},
    {
        name: '', //count
        title: '',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: '',
        title: '',
        titleClass: 'text-center',
        dataClass: 'text-center',
        visible: false
    },
    {
        name: 'exceptionType', //
        title: '阈值',
        titleClass: 'text-center',
        dataClass: 'text-center',
        visible: false
    }
];

///////////////////////实时弹窗 end //////////////////////////
var real_tableColumns = [{
    name: '__sequence',
    title: '序号',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'stationId',
    sortField: 'stationId',
    title: '站点编号',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'title',
    title: '告警类型',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'currentGrade',
    sortField: 'currentGrade',
    title: '告警级别',
    titleClass: 'text-center',
    dataClass: 'text-center',
    callback: 'alarmLevelCallback'
}, {
    name: 'polutionType',
    title: '污染类型',
    titleClass: 'text-center',
    dataClass: 'text-center',
    callback: "dealPollution"
}, {
    name: 'count',
    title: '异常次数',
    sortField: 'count',
    titleClass: 'text-center',
    sortField: 'count',
    dataClass: 'text-center'
}, {
    name: 'lastOccurTime',
    title: '最后一次异常时间',
    sortField: 'lastOccurTime',
    titleClass: 'text-center ',
    dataClass: 'text-center'
},
    {
        name: '__component:real-action',
        title: '操作',
        width: '200px',
        titleClass: 'text-center w200 ',
        dataClass: 'text-center w200 '
    }
];

function pop_widnow_title(val) {
    switch (val) {
        case 1: {
            return '连续0值';
        }
            break;
        case 2: {
            return '连续不变值';
        }
            break;
        case 3: {
            return '数据缺失';
        }
            break;
        case 4: {
            return '超过阈值上限';
        }
            break;
        case 5: {
            return '超过阈值下限';
        }
            break;
        case 6: {
            return '颗粒物倒挂';
        }
            break;
        case 7: {
            return '异常检测离群值';
        }
            break;
        case 8: {
            return '数据断线';
        }
            break;
    }
}

var real_pep_pagenum = 1, //表格序号
    page_num_real = 10, //每页多少条数据
    curr_page = 0; //当前页码
function appendrealTable(data, id) {
    var bodytd_limit = '',
        body_html = '';
    var m = 1;
    var dataArrlength = ((curr_page * page_num_real) + page_num_real < data.table.length) ? (curr_page * page_num_real) + page_num_real : data.table.length;
    for (var i = curr_page * page_num_real; i < dataArrlength; i++) {
        m = 1;
        body_html += '<tr>' + '<td><div class="datagrid-cell cell-c' + (m++) + '">' + (real_pep_pagenum++) + '</div></td><td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].rtc_time + '</div></td>';
        for (var j in data.table[i].data_value) {
            if (j == 'limit') { //交换limit 字段值，并将置为最后一列
                bodytd_limit = '<td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].data_value[j] + '</div></td>';
            } else {
                body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].data_value[j] + '</div></td>';
            }
        }
        if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
            body_html += bodytd_limit; //添加最后一列 ，阈值
        }
        body_html += '</tr>';
    }
    $("#" + id + ' .datagrid-btable tbody').append(body_html);
}

function init_realpopTable(data, id) {
    $("#" + id).empty(); //清空table 中的heml 内容
    real_pep_pagenum = 1;
    curr_page = 0;
    var k = 2;
    var bodytd_limit = '';
    var head_html = '<div class="grid-head">' +
        '<div class="grid-head-inner">' +
        '<table class="data-table">' +
        '<tbody>' +
        '<tr class="data-table-row">' +
        '<td>' +
        '<div class="datagrid-cell cell-c1">' +
        '序号' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<div class="datagrid-cell cell-c2">' +
        '异常时间' +
        '</div>' +
        '</td>';

    for (var i = 0; i < data.tableTitle.length; i++) {
        if (data.tableTitle[i] != 'limit') {
            //			console.log(data.tableTitle[i]);
            var am = '';
            if (data.tableTitle[i] == '--') {
                am = '污染物';
            } else {
                if (realwarn.real_radio_Pcategory == '1') {
                    am = toChangePollution_Val(data.tableTitle[i]);
                } else {
                    am = data.tableTitle[i];
                }
            }
            head_html += '<td><div class="datagrid-cell cell-c' + (++k) + '">' + am + '</div></td>'
        }
    }
    if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
        head_html += '<td><div class="datagrid-cell cell-c' + (++k) + '">阈值</div></td>'; //确保‘阈值’在最后一列
    }
    head_html += '</tr></tbody></table></div></div>';
    ////////////////////////////////////
    var body_html = '<div class="grid-body"><table class="datagrid-btable"><tbody>';
    var num = data.table.length >= page_num_real ? page_num_real : data.table.length;
    var m = 1,
        limittbody_td = '';
    for (var i = 0; i < num; i++) {
        m = 1;
        body_html += '<tr>' + '<td><div class="datagrid-cell cell-c' + (m++) + '">' + (real_pep_pagenum++) + '</div></td><td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].rtc_time + '</div></td>';
        for (var j in data.table[i].data_value) {
            if (j == 'limit') { //交换limit 字段值，并将置为最后一列
                limittbody_td = data.table[i].data_value[j];
            } else {
                body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].data_value[j] + '</div></td>';
            }
        }
        if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
            body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + limittbody_td + '</div></td>'; //添加最后一列 ，阈值
        }
        body_html += '</tr>';
    }
    body_html += '</tbody></table></div>';
    ////////////////////////////////////
    $("#" + id).html(head_html + body_html);
    bindtable_real();
}

Vue.component(
    'real-action', {
        template: '',
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        created: function () {
            var _self = realwarn;
            var view = '<button type="button" class="btn btn-xs btn-info" @click="real_showModel(\'real_detailModal\',rowData)">查看</button>';
            var detail = '<button type="button" class="btn btn-xs btn-info m-l-10" @click="open_Ntab(rowData)">详细分析</button>';
            var close = '<button type="button" class="btn btn-xs btn-danger m-l-10" @click="real_closeWarn(\'real_detailModal\',rowData)">关闭告警</button>';
            if (_self.showReal.view && _self.showReal.detail && _self.showReal.close) {
                this.$options.template = view + detail + close;
            }
            else if (_self.showReal.view && !_self.showReal.detail && !_self.showReal.close) {
                this.$options.template = view;
            }
            else if (!_self.showReal.view && _self.showReal.detail && !_self.showReal.close) {
                this.$options.template = detail;
            }
            else if (!_self.showReal.view && !_self.showReal.detail && _self.showReal.close) {
                this.$options.template = close;
            }
            else if (!_self.showReal.view && _self.showReal.detail && _self.showReal.close) {
                this.$options.template = detail + close;
            }
            else if (_self.showReal.view && !_self.showReal.detail && _self.showReal.close) {
                this.$options.template = view + close;
            } else if (_self.showReal.view && _self.showReal.detail && !_self.showReal.close) {
                this.$options.template = view + detail;
            }
        },
        methods: {
            real_showModel: function (id, rowData) {
                realwarn.real_pop_table = null;
                $('#' + id).modal('show');
                $("#" + id + " h4").html('');
                realwarn.real_pop_stationid = rowData.stationId;
                realwarn.real_pop_original_type =  rowData.exceptionTypeName;
                realwarn.real_pop_original_Grade = realwarn.alarmLevelCallback(rowData.currentGrade);
                realwarn.real_pop_original_count = rowData.count;
                realwarn.real_pop_original_polutionType = rowData.polutionType.toUpperCase();
                realwarn.real_pop_last_OccurTime = rowData.lastOccurTime;
                rowData.polutionType = rowData.polutionType.toUpperCase();
                realwarn.real_pop_original_polutionType = realwarn.dealPollution(rowData.polutionType);

                var url = $.coreApiPath + '/warn/data/details/1/' + rowData.id;
                ajax(url, '', function (data) {
                    if (data != null && data.result) {
                        $("#" + id + " h4").html(pop_widnow_title(data.result.exceptionType));
                        if (data.result.station) {
                            realwarn.real_pop_address = data.result.station.addr;
                        }
                        else {
                            realwarn.real_pop_address = '';
                        }

                        realwarn.echartInit(data.result, rowData.polutionType.toUpperCase()); //初始化弹窗图表
                        init_realpopTable(data.result, 'real_table');
                        realwarn.real_pop_table = data.result;
                    }
                });
            },
            open_Ntab: function (rowData) {
                window.open($.ctx + '/stationAnalysis/surveyData?stationId=' + rowData.stationId + '&stationType=' + rowData.stationType + "&stechType=" + rowData.stechType); //添加页面跳转的链接参数
            },
            real_closeWarn: function (id, rowData) {
                layer.open({
                    type: 1,
                    title: '关闭告警', //不显示标题栏
                    closeBtn: false,
                    area: '500px;',
                    shade: 0.8,
                    id: 'layuipro', //设定一个id，防止重复弹出
                    resize: false,
                    btn: ['确定', '取消'],
                    yes: function (index, layero) { //点击确定按钮
                        var msg = $("#closeWarnMsg").val();
                        msg = rTrim(msg);
                        if (msg.length > 0 && msg.length <= 200) { //输入的文字内容小于 200字
                            var url = $.coreApiPath + "/warn/data/close/" + rowData.id,
                                param = {
                                    content: msg
                                };
                            ajax(url, param, function (data) {
                                //刷新表格
                                if (data.erroCode == 2000) {
                                    layer.msg('关闭告警成功！');
                                    layer.close(index);
                                    realwarn.$nextTick(function () {
                                        realwarn.$broadcast('vuetable:refresh');
                                    });
                                }
                            });
                        } else if (msg.length == 0) {
                            layer.msg('请输入关闭告警内容！');
                        }
                    },
                    btnAlign: 'c',
                    moveType: 1, //拖拽模式，0或者1
                    content: '<div class="pd10" style="line-height: 22px;  width:100%; background-color: #fff; color: #333;"><textarea id=\'closeWarnMsg\' onKeyUp=\'judge_textarea()\' style=" height:200px; width:100%;" placeholder="请输入告警原因分析、处理方法、处理结果等内容！(最多200字)"></textarea></div><div style="height:20px; line-height:20px; font-size:12px; margin-left:10px;"><span>还可以输入：</span><span id="msg_num" style="font-weight: bold;color: red;">200</span><span> 个字符</span></div>',
                    success: function (layero) {
                        $("#closeWarnMsg").prop("value", '');
                        //console.log("弹窗打开！");
                    }
                });
            },

        }
    });

Vue.config.debug = false;
var realwarn = new Vue({
    el: "#tab-realWarnCount",
    data: {
        allFunctions: {}, //权限列表
        real_pop_table: null,
        real_warn_type: '-1', //实时告警类型的默认值“全部”
        real_warn_type_list: [], //实时告警类型列表
        real_warn_grade: '-1', //告警级别
        real_warn_grade_list: [], //告警级别列表
        real_radio_Pcategory: '1', //告警污染，气象类别默认值
        real_pollution_type: '-1', //污染类型
        real_weather_type: '-1', //污染类型
        real_station_num: '', //站点编号
        real_fields: real_tableColumns,
        real_perPage: 10,
        real_pageList: [10, 20, 30, 40, 50],
        real_params: [
            'stationId=-1', //站点id
            'polutionType=-1', //污染类型
            'city=' + curr_city, //城市
            'exceptionType=-1', //告警类型
            'currentGrade=-1', //告警级别
            'startTime=-1',
            'endTime=-1',
            'source=11'
        ],
        real_closeWarnMsg: '', //告警弹窗的填写关闭条件
        real_pop_stationid: '', //站点id
        real_pop_original_type: '', //告警类型
        real_pop_original_Grade: '', //告警级别
        real_pop_original_count: '', //告警次数
        real_pop_original_polutionType: '', //污染类型
        real_pop_last_OccurTime: '', //最后一次异常时间
        real_pop_address: '', //站点地址
        real_weather_warn_type_list: [], //气象告警类型
        real_wrw_warn_type_list: [], //污染物告警类型
        showReal: {
            view: false,
            detail: false,
            close: false
        }
    },
    beforeCompile: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
                _self.showReal.view = _self.allFunctions['ROLE_FUN_101_02_01'] != undefined;
                _self.showReal.detail = _self.allFunctions['ROLE_FUN_101_02_02'] != undefined;
                _self.showReal.close = _self.allFunctions['ROLE_FUN_101_02_03'] != undefined;
                console.log(_self.showReal)
            } else {
                _self.allFunctions = {};
                _self.showReal = {
                    view: false,
                    detail: false,
                    close: false
                };
            }
        });
    },
    ready: function () {
        var that = this;
        var url = $.coreApiPath + "/dictionary/dictionaryType";
        ////////////////告警级别////////////////
        var param = {
            "type": 28
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
                            that.real_warn_type_list.push(config_type);
                            that.real_wrw_warn_type_list.push(config_type);
                        }
                    }
                }
            }
        });
        ///////////////告警类型//////////////
        param = {
            "type": 27
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
                            that.real_warn_grade_list.push(config_type);
                        }
                    }
                }
            }
        });

        that.realSearch();
    },
    events: {
        'vuetable:load-success': function () {
            if (!("ROLE_FUN_003_01" in this.allFunctions)) {
                $("button:contains('详细分析')").remove();
            }
        }
    },
    watch: {
        real_perPage: function () {
            this.realSearch();
        },
        real_radio_Pcategory: function () {
            var index = null;
            for (var i = 0; i < this.real_fields.length; i++) {
                if (this.real_fields[i].name == 'polutionType') {
                    index = i;
                }
            }
            if (this.real_radio_Pcategory == '1') {
                this.real_fields[index].title = '污染类型';
                this.real_warn_type_list = this.real_wrw_warn_type_list;
            } else {
                this.real_fields[index].title = '气象类型';
                this.changeweather();
            }
            this.realSearch();
        }
    },
    methods: {
        changeweather: function () {
            var a = this.real_warn_type_list;
            for (var i = 0; i < a.length; i++) {
                if (a[i].code == '4' || a[i].code == '5') {
                    this.real_weather_warn_type_list.push(a[i]);
                }
            }
            this.real_warn_type_list = this.real_weather_warn_type_list;
        },
        dealPollution: function (data) {
            if (data == '--') {
                return data;
            } else {
                var html = '',
                    ndata = data,
                    num_pollution = '',
                    str_pollution = '';
                if (data.indexOf('/') != -1) {
                    if (this.real_radio_Pcategory == '1') {
                        var ndata = data.split('/');
                        for (var i = 0; i < ndata.length; i++) {
                            dataVal = ndata[i].toUpperCase();
                            num_pollution = getnumber(dataVal);
                            str_pollution = getletter(dataVal);
                            if (num_pollution == 25) {
                                num_pollution = 2.5;
                            }
                            html += (i + 1) == ndata.length ? str_pollution + "<sub>" + num_pollution + "</sub> " : html += str_pollution + "<sub>" + num_pollution + "</sub>  /  ";
                            ;
                        }
                    } else {
                        html += data;
                    }

                } else {
                    if (this.real_radio_Pcategory == '1') {
                        data = data.toUpperCase();
                        num_pollution = getnumber(data);
                        str_pollution = getletter(data);
                        if (num_pollution == 25) {
                            num_pollution = 2.5;
                        }
                        html += str_pollution + "<sub>" + num_pollution + "</sub>  ";
                    } else {
                        html += data;
                    }
                }
                return html;
            }
        },
        alarmLevelCallback: function (data) {
            if (data == 1) {
                return '一级';
            }
            if (data == 2) {
                return '二级';
            }
            if (data == 3) {
                return '三级';
            }
            return '';
        },
        compareExcexs: function (dataexcexs, compareVal, key) {
            var val = null;
            var styleSite = {
                value: 0,
                symbol: 'emptyCircle',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: "red",
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    }
                }
            };
            for (var i = 0; i < dataexcexs.length; i++) {
                if (compareVal == dataexcexs[i]) { //x轴有符合条件的点，push高亮点设置
                    styleSite.value = key;
                    val = styleSite;
                    return val;
                }
            }
        },
        createseriesVal: function (data) {
            var dataJson = new Array(); //x轴，y轴的坐标值
            var style = [];
            if (data.xs && data.excexs) {
                var dataX = data.xs,
                    dataexcexs = data.excexs; //异常值，需要标亮显示
                for (var i in data.dataValue) {
                    var lineval = {
                        name: i,
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#4db3ec'
                            }
                        },
                        data: ''
                    };
                    dataJson = [];
                    for (var k = 0; k < data.dataValue[i].length; k++) {
                        var compresult = this.compareExcexs(dataexcexs, dataX[k], data.dataValue[i][k]);
                        if (compresult != null) {
                            dataJson.push(compresult); //插入异常值，并高亮显示
                        } else {
                            dataJson.push(data.dataValue[i][k]);
                        }
                    }
                    lineval.data = dataJson;
                    style.push(lineval);
                }
            }
            return style;
        },
        echartInit: function (data, pollutiontype) {
            var myChart = echarts.init(document.getElementById('warnDetailChart'));
            if (data.exceptionType == 8) {
                document.getElementById('warnDetailChart').style.display = 'none'; //隐藏曲线显示
            }
            if (data.dataValue && data.exceptionType != 8) {
                document.getElementById('warnDetailChart').style.display = 'block'; //隐藏曲线显示
                var seriesVal = this.createseriesVal(data);
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#87c2e4'
                            }
                        }
                    },
                    grid: {
                        top: '30px',
                        left: '8%',
                        right: '10%',
                        bottom: '40px',
                        containLabel: true
                    },
                    dataZoom: [{
                        type: 'slider',
                        showDetail: false,
                        dataBackgroundColor: '#eae6f2', // 底色
                        fillerColor: '#f7f7f7', // 选中的颜色
                        handleColor: "#65c2e7", // 滑块颜色
                        height: "35px",
                        width: "78%",
                        x: "12%",
                        y: "86%"
                    }],
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: data.xs.map(function (str) {
                            return str.replace(' ', '\n')
                        })
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: seriesVal
                };
                myChart.setOption(option);
            }

        },
        realSearch: function () {
            var polutionType_Val = '',
                real_s_num = '',
                real_source = '';
            if (this.real_radio_Pcategory == 1) {
                real_source = '11';
                polutionType_Val = this.real_pollution_type;
            } else {
                real_source = '12';
                polutionType_Val = this.real_weather_type;
            }
            if (this.real_station_num == '') {
                real_s_num = '-1';
            } else {
                real_s_num = this.real_station_num;
            }
            var param = {
                stationId: real_s_num, //站点类型
                polutionType: polutionType_Val, //污染类型
                city: curr_city, //城市
                exceptionType: this.real_warn_type, //告警类型
                currentGrade: this.real_warn_grade, //告警级别
                startTime: '-1',
                endTime: '-1',
                source: real_source
            };
            if (param.startTime > param.endTime) {
                layer.msg('开始时间不能大于结束时间！');
                return;
            }
            var sp = CommonUtil.json2Array(param);
            for (var i = 0; i < sp.length; i++) {
                this.real_params.push(sp[i]);
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
    }
});
//////////////以下历史告警//////////////////
var history_tableColumns = [{
    name: '__sequence',
    title: '序号',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'stationId',
    title: '站点编号',
    sortField: 'stationId',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'title',
    title: '告警类型',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'currentGrade',
    title: '告警级别',
    sortField: 'currentGrade',
    titleClass: 'text-center',
    dataClass: 'text-center',
    callback: 'alarmLevelCallback'
}, {
    name: 'polutionType',
    title: '污染类型',
    titleClass: 'text-center',
    dataClass: 'text-center',
    callback: 'dealPollution'
}, {
    name: 'count',
    title: '异常次数',
    sortField: 'count',
    titleClass: 'text-center',
    dataClass: 'text-center'
}, {
    name: 'lastOccurTime',
    title: '最后一次异常时间',
    sortField: 'lastOccurTime',
    titleClass: 'text-center',
    dataClass: 'text-center'
},
    {
        name: 'closeTime',
        title: '关闭时间',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'closeBy',
        title: '操作人',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: '__component:history-action',
        title: '操作',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];
Vue.component(
    'history-action', {
        template: '<button type="button" class="btn btn-xs btn-info" @click="history_showModel(\'history_detailModal\',rowData)">查看</button>',
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        methods: { //action, data
            history_showModel: function (id, rowData) {
                historywarn.history_pop_table = null;
                //console.log("722");
                $('#' + id).modal('show');
                $("#" + id + " h4").html('');
                $('#history_pop-table').scrollTop(0);
                historywarn.history_pop_stationid = rowData.stationId;
                historywarn.history_pop_original_type = rowData.exceptionTypeName;
                historywarn.history_pop_original_Grade = historywarn.alarmLevelCallback(rowData.currentGrade);
                historywarn.history_pop_original_count = rowData.count;
                historywarn.history_pop_last_OccurTime = rowData.lastOccurTime;
                historywarn.history_pop_last_OccurcloseTime = rowData.closeTime;
                historywarn.history_pop_Occur_people = rowData.closeBy;
                historywarn.history_pop_close_msg = rowData.remark;
                rowData.polutionType = rowData.polutionType.toUpperCase();
                historywarn.history_pop_original_polutionType = historywarn.dealPollution(rowData.polutionType);

                var url = $.coreApiPath + '/warn/data/details/2/' + rowData.id;
                ajax(url, '', function (data) {
                    if (data != null && data.result) {
                        historywarn.history_pop_address = data.result.station.addr;
                        $("#" + id + " h4").html(pop_widnow_title(data.result.exceptionType));
                        historywarn.echartInit(data.result, rowData.polutionType.toUpperCase()); //初始化弹窗图表
                        init_historypopTable(data.result, 'history_table');
                        historywarn.history_pop_table = data.result;
                    }
                });
            }
        }
    });
var history_pep_pagenum = 1, //表格序号
    page_num_history = 10, //每页多少条数据
    curr_page_history = 0; //当前页码
function tohistorySearch() {
    historywarn.historySearch();
}

function bindtable_history() {
    $("#history_pop-table .grid-body").scroll(function (event) {
        var viewH = $(this).height(), //可见高度
            contentH = $(this).get(0).scrollHeight, //内容高度
            scrollTop = $(this).scrollTop(); //滚动高度
        if (scrollTop / (contentH - viewH) >= 1) {
            //			console.log("滚动到底部，剩余记录条数    " + historywarn.history_pop_table.table.length + "   序号的个数" + history_pep_pagenum);
            if (history_pep_pagenum <= historywarn.history_pop_table.table.length) {
                curr_page_history++;
                appendhistoryTable(historywarn.history_pop_table, 'history_table');
            } else {
                layer.msg("没有数据加载了！");
            }
        }
    });
}

function appendhistoryTable(data, id) {
    var bodytd_limit = '',
        body_html = '';
    var m = 1;
    var dataArrlength = ((curr_page_history * page_num_history) + page_num_history < data.table.length) ? (curr_page_history * page_num_history) + page_num_history : data.table.length;
    //console.log("    " + ((curr_page_history * page_num_history) + page_num_history) + "          " + data.table.length + "      结果      " + dataArrlength);
    for (var i = curr_page_history * page_num_history; i < dataArrlength; i++) {
        m = 1;
        body_html += '<tr>' + '<td><div class="datagrid-cell cell-c' + (m++) + '">' + (history_pep_pagenum++) + '</div></td><td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].rtc_time + '</div></td>';
        for (var j in data.table[i].data_value) {
            if (j == 'limit') { //交换limit 字段值，并将置为最后一列
                bodytd_limit = data.table[i].data_value[j];
            } else {
                body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].data_value[j] + '</div></td>';
            }
        }
        if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
            body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + bodytd_limit + '</div></td>'; //添加最后一列 ，阈值
        }
        body_html += '</tr>';
    }
    $("#" + id + ' .datagrid-btable tbody').append(body_html);

}

function init_historypopTable(data, id) {
    $("#" + id).empty(); //清空table 中的heml 内容
    history_pep_pagenum = 1;
    curr_page_history = 0;
    var k = 2;
    var bodytd_limit = '';
    var head_html = '<div class="grid-head">' +
        '<div class="grid-head-inner">' +
        '<table class="data-table">' +
        '<tbody>' +
        '<tr class="data-table-row">' +
        '<td>' +
        '<div class="datagrid-cell cell-c1">' +
        '序号' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<div class="datagrid-cell cell-c2">' +
        '异常时间' +
        '</div>' +
        '</td>';

    for (var i = 0; i < data.tableTitle.length; i++) {
        if (data.tableTitle[i] != 'limit') {
            var am = '';
            if (data.tableTitle[i] == '--') {
                am = '污染物';
            } else {
                if (historywarn.history_radio_Pcategory == '1') {
                    am = toChangePollution_Val(data.tableTitle[i]);
                } else {
                    am = data.tableTitle[i];
                }
            }
            head_html += '<td><div class="datagrid-cell cell-c' + (++k) + '">' + am + '</div></td>'
        }
    }
    if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
        head_html += '<td><div class="datagrid-cell cell-c' + (++k) + '">阈值</div></td>'; //确保‘阈值’在最后一列
    }
    head_html += '</tr></tbody></table></div></div>';
    ////////////////////////////////////
    var body_html = '<div class="grid-body"><table class="datagrid-btable"><tbody>';
    var num = data.table.length >= page_num_history ? page_num_history : data.table.length;
    var m = 1,
        limittbody_td = '';
    for (var i = 0; i < num; i++) {
        m = 1;
        body_html += '<tr>' + '<td><div class="datagrid-cell cell-c' + (m++) + '">' + (history_pep_pagenum++) + '</div></td><td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].rtc_time + '</div></td>';
        for (var j in data.table[i].data_value) {
            if (j == 'limit') { //交换limit 字段值，并将置为最后一列
                limittbody_td = data.table[i].data_value[j];
            } else {
                body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + data.table[i].data_value[j] + '</div></td>';
            }
        }
        if (data.exceptionType == 4 || data.exceptionType == 5 || data.exceptionType == 9) {
            body_html += '<td><div class="datagrid-cell cell-c' + (m++) + '">' + limittbody_td + '</div></td>'; //添加最后一列 ，阈值
        }
        body_html += '</tr>';
    }
    body_html += '</tbody></table></div>';
    ////////////////////////////////////
    $("#" + id).html(head_html + body_html);
    bindtable_history();
}

var historywarn = new Vue({
    el: "#tab-historyWarnCount",
    data: {
        history_pop_table: null,
        multiSort: true,
        history_warn_type: '-1', //告警类型的默认值“全部”
        history_warn_type_list: [], //实时告警类型列表
        history_warn_grade: '-1', //告警级别
        history_warn_grade_list: [], //告警级别列表
        history_radio_Pcategory: '1', //告警污染，气象类别默认值
        history_pollution_type: '-1', //污染类型
        history_weather_type: '-1', //气象污染类型
        history_station_num: '', //站点编号
        history_fields: history_tableColumns,
        history_perPage: 10,
        history_pageList: [10, 20, 30, 40, 50],
        history_params: [
            'stationId=-1', //站点id
            'polutionType=-1', //污染类型
            'city=' + curr_city, //城市
            'exceptionType=-1', //告警类型
            'currentGrade=-1', //告警级别
            'startTime=' + initSEndTime.tabhistory.startTime,
            'endTime=' + initSEndTime.tabhistory.endTime,
            'source=12'
        ],
        history_startTime: initSEndTime.tabhistory.startTime,
        history_endTime: initSEndTime.tabhistory.endTime,
        history_closeWarnMsg: '', //告警弹窗的填写关闭条件
        history_closeWarnMsg: '', //告警弹窗的填写关闭条件
        history_pop_stationid: '', //站点id
        history_pop_original_type: '', //告警类型
        history_pop_original_Grade: '', //告警级别
        history_pop_original_count: '', //告警次数
        history_pop_original_polutionType: '', //污染类型
        history_pop_last_OccurTime: '', //最后一次异常时间
        history_pop_last_OccurcloseTime: '', //最后一次异常关闭时间
        history_pop_Occur_people: '',
        history_pop_address: '', //站点地址
        history_pop_close_msg: '', //关闭告警的原因
        histroy_weather_warn_type_list: [],
        histroy_wrw_warn_type_list: []
    },
    ready: function () { //vue对象创建 完成
        var that = this;
        that.history_warn_type_list = realwarn.real_warn_type_list;
        that.histroy_wrw_warn_type_list = realwarn.real_warn_type_list; //污染物告警类型

        that.history_warn_grade_list = realwarn.real_warn_grade_list;
    },
    events: { //事件
    },
    watch: { //监听

        history_perPage: function () {
            this.historySearch();
        },
        history_radio_Pcategory: function () {
            var index = null;
            for (var i = 0; i < this.history_fields.length; i++) {
                if (this.history_fields[i].name == 'polutionType') {
                    index = i;
                }
            }
            if (this.history_radio_Pcategory == '1') {
                this.history_fields[index].title = '污染类型';
                this.history_warn_type_list = this.histroy_wrw_warn_type_list;

            } else {
                this.history_fields[index].title = '气象类型';
                this.changeweather();
            }
            this.historySearch();
        }
    },
    methods: {
        changeweather: function () {
            var a = this.history_warn_type_list;
            for (var i = 0; i < a.length; i++) {
                if (a[i].code == '4' || a[i].code == '5') {
                    this.histroy_weather_warn_type_list.push(a[i]);
                }
            }
            this.history_warn_type_list = this.histroy_weather_warn_type_list;
        },
        dealPollution: function (data) {
            if (data == '--') {
                return data;
            } else {
                var html = '',
                    ndata = data,
                    num_pollution = '',
                    str_pollution = '';
                if (data.indexOf('/') != -1) {
                    if (this.history_radio_Pcategory == '1') {
                        var ndata = data.split('/');
                        for (var i = 0; i < ndata.length; i++) {
                            dataVal = ndata[i].toUpperCase();
                            num_pollution = getnumber(dataVal);
                            str_pollution = getletter(dataVal);
                            if (num_pollution == 25) {
                                num_pollution = 2.5;
                            }
                            html += (i + 1) == ndata.length ? str_pollution + "<sub>" + num_pollution + "</sub> " : html += str_pollution + "<sub>" + num_pollution + "</sub>  /  ";
                            ;
                        }
                    } else {
                        html += data;
                    }

                } else {
                    if (this.history_radio_Pcategory == '1') {
                        data = data.toUpperCase();
                        num_pollution = getnumber(data);
                        str_pollution = getletter(data);
                        if (num_pollution == 25) {
                            num_pollution = 2.5;
                        }
                        html += str_pollution + "<sub>" + num_pollution + "</sub>  ";
                    } else {
                        html += data;
                    }
                }
                return html;
            }
        },
        alarmLevelCallback: function (data) {
            if (data == 1) {
                return '一级';
            }
            if (data == 2) {
                return '二级';
            }
            if (data == 3) {
                return '三级';
            }
            return '';
        },
        compareExcexs: function (dataexcexs, compareVal, key) {
            var val = null;
            var styleSite = {
                value: 0,
                symbol: 'emptyCircle',
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: "red",
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    }
                }
            };
            for (var i = 0; i < dataexcexs.length; i++) {
                if (compareVal == dataexcexs[i]) { //x轴有符合条件的点，push高亮点设置
                    styleSite.value = key;
                    val = styleSite;
                    return val;
                }
            }
        },
        createseriesVal: function (data) {
            var dataJson = new Array(); //x轴，y轴的坐标值
            var style = [];
            if (data.xs && data.excexs) {
                var dataX = data.xs,
                    dataexcexs = data.excexs; //异常值，需要标亮显示
                for (var i in data.dataValue) {
                    var lineval = {
                        name: i,
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#4db3ec'
                            }
                        },
                        data: ''
                    };
                    dataJson = [];
                    for (var k = 0; k < data.dataValue[i].length; k++) {
                        var compresult = this.compareExcexs(dataexcexs, dataX[k], data.dataValue[i][k]);
                        if (compresult != null) {
                            dataJson.push(compresult); //插入异常值，并高亮显示
                        } else {
                            dataJson.push(data.dataValue[i][k]);
                        }
                    }
                    lineval.data = dataJson;
                    style.push(lineval);
                }
            }
            return style;
        },
        echartInit: function (data, pollutiontype) {
            var myChart = echarts.init(document.getElementById('historywarnDetailChart'));
            if (data.exceptionType == 8) {
                document.getElementById('historywarnDetailChart').style.display = 'none'; //隐藏曲线显示
            }
            if (data.dataValue && data.exceptionType != 8) {
                document.getElementById('historywarnDetailChart').style.display = 'block'; //隐藏曲线显示
                var seriesVal = this.createseriesVal(data);
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#87c2e4'
                            }
                        }
                    },
                    //toolbox: {
                    //	feature: {
                    //	saveAsImage: {}
                    //		}
                    //},
                    grid: {
                        top: '30px',
                        left: '8%',
                        right: '10%',
                        bottom: '40px',
                        containLabel: true
                    },
                    dataZoom: [{
                        type: 'slider',
                        showDetail: false,
                        dataBackgroundColor: '#eae6f2', // 底色
                        fillerColor: '#f7f7f7', // 选中的颜色
                        handleColor: "#65c2e7", // 滑块颜色
                        height: "35px",
                        width: "78%",
                        x: "12%",
                        y: "86%"
                    }],
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: data.xs.map(function (str) {
                            return str.replace(' ', '\n')
                        })
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: seriesVal
                };
                myChart.setOption(option);
            }
        },
        stationo_limit: function () {
            var station_num = this.history_station_num,
                seachVal = true;
            sation_num = $.trim(station_num);
            if (station_num == '') { //为空有一个月限制
                seachVal = this.month_limit(this.history_startTime, this.history_endTime);
            }
            return seachVal;
        },
        month_limit: function (start, end) { //超一个月的控制
            var Nstart = totransformDate(start),
                Nend = totransformDate(end);
            var dateStart = new Date(Nstart),
                dateEnd = new Date(Nend);
            var start_year = dateStart.getFullYear(),
                start_month = dateStart.getMonth() + 1,
                start_day = dateStart.getDate(),
                start_hour = dateStart.getHours(),
                start_minuts = dateStart.getMinutes(),
                end_year = dateEnd.getFullYear(),
                end_month = dateEnd.getMonth() + 1,
                end_day = dateEnd.getDate(),
                end_hour = dateEnd.getHours(),
                end_minuts = dateEnd.getMinutes();
            var d_value_year = end_year - start_year, //年的差值
                d_value_month = end_month - start_month, //月的差值
                d_value_day = end_day - start_day, //天的差值
                d_value_hour = end_hour - start_hour, //小时的差值
                d_value_minuts = end_minuts - start_minuts; //分钟的差值
            if (d_value_year == 0) { //一年内的时间判断
                if (d_value_month > 1) {
                    layer.msg("查询时间不能超过一个月！");
                    return false;
                } else if (d_value_month == 1) {
                    if (d_value_day >= 1) {
                        layer.msg("查询时间不能超过一个月");
                        return false;
                    } else {
                        if (d_value_hour >= 1) {
                            layer.msg("查询时间不能超过一个月");
                            return false;
                        } else {
                            if (d_value_minuts >= 1) {
                                layer.msg("查询时间不能超过一个月");
                                return false;
                            }
                        }
                    }
                }
            } else if (d_value_year == 1) { //跨年 12月 -1月
                if (d_value_month == -11) {
                    if (d_value_day >= 1) {
                        layer.msg("查询时间不能超过一个月");
                        return false;
                    } else {
                        if (d_value_hour >= 1) {
                            layer.msg("查询时间不能超过一个月");
                            return false;
                        } else {
                            if (d_value_minuts >= 1) {
                                layer.msg("查询时间不能超过一个月");
                                return false;
                            }
                        }
                    }
                } else {
                    layer.msg("查询时间不能超过一个月");
                    return false;
                }
            } else {
                layer.msg("查询时间不能超过一个月！");
                return false;
            }
            return true;
        },
        historySearch: function () {
            var fg = this.stationo_limit(); //验证站点编号的时间一月限制
            if (fg) {
                var polutionType_Val = '',
                    history_s_num,
                    history_source;
                if (this.history_radio_Pcategory == 1) {
                    history_source = "11"; //污染物
                    polutionType_Val = this.history_pollution_type;
                } else {
                    history_source = "12"; //气象数据
                    polutionType_Val = this.history_weather_type;
                }
                if (this.history_station_num == '') {
                    history_s_num = '-1';
                } else {
                    history_s_num = this.history_station_num;
                }
                var startTime = this.history_startTime;
                var endTime = this.history_endTime;
                var param = {
                    stationId: history_s_num, //站点类型
                    polutionType: polutionType_Val, //污染类型
                    city: curr_city, //城市
                    exceptionType: this.history_warn_type, //告警类型
                    currentGrade: this.history_warn_grade, //告警级别
                    startTime: startTime,
                    endTime: endTime,
                    source: history_source
                };
                if (param.startTime > param.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                var sp = CommonUtil.json2Array(param);
                for (var i = 0; i < sp.length; i++) {
                    this.history_params.push(sp[i]);
                }
                this.$nextTick(function () {
                    this.$broadcast('vuetable:refresh');
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
        }
    }
});