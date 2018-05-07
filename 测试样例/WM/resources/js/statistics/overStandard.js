var report = "";
$(function () {
    //当前所选城市
    var currentCityId = parent.cityId;

    function initWdateVal(domId, time) {
        var result = "";
        initWDatetime(domId, "yyyy-MM-dd HH:mm", time);
        result = myDate.formatDate(time, "yyyy-MM-dd hh:mm");
        return result;
    }

    var start = new Date(myDate.year, myDate.month - 1, myDate.day, 0),
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour),
        initSEndTime = {
            three: {
                startTime: initWdateVal('three_startTime', start),
                endTime: initWdateVal('three_endTime', end)
            },
            four: {
                startTime: initWdateVal('four_startTime', start),
                endTime: initWdateVal('four_endTime', end)
            }
        };
    myDate.format = 'yyyy-MM-dd';
    var tableColumns = [{
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center'
    }, {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-center'
    }, {
        name: 'stationId',
        title: '站点编号',
        titleClass: 'text-center'
    }, {
        name: 'num',
        title: '超标次数',
        titleClass: 'text-center'
    }, {
        name: 'lastTime',
        title: '最后超标时间',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: "formatDate"
    }, {
        name: '__component:custom-action',
        title: '操作',
        titleClass: 'text-center',
        dataClass: 'custom-action text-center'
    }];
    Vue.component(
        'custom-action', {
            template: ["<div>",
                '<button class="btn btn-info" title="查看" @click="itemAction(\'view\', rowData)">查看</button> ',
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
                    if (action === 'view') {
                        this.$dispatch('vuetable:view', data);
                    }
                }
            }
        });
    Vue.config.debug = false;
    report = new Vue({
        el: "#content",
        data: {
            //默认弹框显示详情，不显示反馈
            showDetail: true,
            showDetailDiv: 'block',
            showFeedback: false,
            showFeedbackDiv: 'none',
            //反馈列表
            feedbackList: [],
            feedbackDetail: "",
            //详情站点编号
            detailStationId: "",
            //污染超标查询结果总数
            level3Total: "",
            level4Total: "",
            //污染等级
            pollutionLevel: 3,
            //污染类型列表
            pollutionTypeList: [],
            //tab 3 的搜索条件
            //站点数据
            three_queryStationType: ['6010,1010'],
            //污染物类型
            three_pollutionType: 0,
            three_startTime: initSEndTime.three.startTime,
            three_endTime: initSEndTime.three.endTime,
            three_fields: tableColumns,
            //tab 4 的搜索条件
            four_queryStationType: ['6010,1010'],
            four_pollutionType: 0,
            four_startTime: initSEndTime.four.startTime,
            four_endTime: initSEndTime.four.endTime,
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            pop_pollution_time: '',
            pop_pollution_name: '',
            pop_pollution_type: '',
            pop_pollution_id: '',
            //列表查询参数
            queryParam: [
                "startTime=" + initSEndTime.three.startTime,
                "endTime=" + initSEndTime.three.endTime,
                "pollutionLevel=" + 3,
                "pollutionType=" + 0,
                "stationType=" + "6010,1010",
                "cityId=" + currentCityId
            ]
        },
        ready: function () {
            var that = this;
            //查询污染物类型列表
            var url = $.coreApiPath + "/analysis/overproof/pollutionType";
            ajax_get(url, {}, function (resultJson) {
                if (resultJson.length > 0) {
                    for (var i in resultJson) {
                        if (resultJson[i].name) {
                            that.pollutionTypeList.push(resultJson[i]);
                            var type = CommonUtil.getQueryParameter('type');
                            if (type == '4') {
                                $('#forthTab').click();
                                that.setOverproofLevel(4);
                            } else {
                                that.setOverproofLevel(3);
                            }
                        }
                    }
                }
            })
        },
        events: {
            'vuetable:view': function (data) {
                var that = this;
                var queryParams = {};
                var pollutionType = 0;
                //重新显示详情
                this.clickDetail();
                //清空反馈列表
                this.feedbackList = [];
                queryParams["stationId"] = data.stationId;
                this.detailStationId = data.stationId;
                if (that.pollutionLevel == 3) {
                    pollutionType = that.three_pollutionType;
                    queryParams["pollutionType"] = that.three_pollutionType;
                    queryParams["pollutionLevel"] = 3;
                    queryParams["startTime"] = this.three_startTime;
                    queryParams["endTime"] = this.three_endTime;
                }
                if (that.pollutionLevel == 4) {
                    queryParams["pollutionType"] = this.four_pollutionType;
                    queryParams["pollutionLevel"] = 4;
                    queryParams["startTime"] = this.four_startTime;
                    queryParams["endTime"] = this.four_endTime;
                }
                //获取详情数据
                var detailUrl = $.coreApiPath + "/analysis/overproof/detail";
                ajax_get(detailUrl, queryParams, function (resultJson) {
                    if (resultJson.erroCode == 2000) {
                        that.echartInit(data, resultJson.result, queryParams);
                        that.detailTableRender(resultJson.result.overproofList);
                        that.modelShow("detailModal");
                    } else {
                        layer.msg(resultJson.erroMsg);
                    }
                });
                //获取反馈数据
                var feedbackUrl = $.coreApiPath + "/analysis/overproof/feedback";
                $.ajax({
                    type: "GET",
                    url: feedbackUrl,
                    dataType: 'JSON',
                    data: {
                        "stationId": data.stationId
                    },
                    success: function (resultJson) {
                        if (resultJson.erroCode == 2000) {
                            for (var i in resultJson.result) {
                                if (resultJson.result[i].detail) {
                                    that.feedbackList.push(resultJson.result[i]);
                                }
                            }
                        }
                    }
                });
            },
            'vuetable:load-success': function (ajaxResult) {
                //查询成功把结果总数取出
                if (this.pollutionLevel == 3) {
                    this.level3Total = ajaxResult.result.totalNum;
                }
                if (this.pollutionLevel == 4) {
                    this.level4Total = ajaxResult.result.totalNum;
                }
            }
        },
        watch: {
            perPage: function () {
                this.Search();
            },
            three_pollutionType: function () {
                this.Search();
            },
            four_pollutionType: function () {
                this.Search();
            }
        },
        methods: {
            /**
             * 画折线图
             * @param rowData 查看行数据
             * @param chartData 折现x,y行数据
             * @param queryParams ajax查询参数
             */
            getnumber: function (value) { //获取数字
                var num = value.replace(/[^0-9]/ig, "");
                return num;
            },
            getletter: function (value) { //获取字母
                var letter = value.replace(/[^a-z]+/ig, "");
                return letter;
            },
            echartInit: function (rowData, chartData, queryParams) {
                var myChart = echarts.init(document.getElementById('hour24Chart'));
                var dataVal = chartData.pollutionName.toUpperCase();
                var num_pollution = this.getnumber(dataVal);
                var str_pollution = this.getletter(dataVal);
                console.log(num_pollution);
                if (num_pollution == 25) {
                    num_pollution = 2.5;
                }
                var html = str_pollution + "<sub>" + num_pollution + "</sub>";
                this.pop_pollution_name = rowData.stationName;
                this.pop_pollution_time = queryParams.startTime + " - " + queryParams.endTime;
                this.pop_pollution_id = rowData.stationId;
                this.pop_pollution_type = html;

                var option = {

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {
                                "title": "下载"
                            }
                        }
                    },
                    grid: {
                        top: '40px',
                        left: '0px',
                        right: '3%',
                        bottom: '20px',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: chartData.xList,
                        axisLabel: {
                            formatter: function (value, idx) {
                                return value.substr(0, 13);
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: chartData.pollutionName,
                        type: 'line',
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                color: '#4db3ec'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#daeffa'
                                }, {
                                    offset: 1,
                                    color: '#daeffa'
                                }])
                            }
                        },
                        data: chartData.yList
                    }]
                };
                myChart.setOption(option);
            },
            /**
             * 加载详细信息表格数据
             * @param dataList 数据列表
             */
            detailTableRender: function (dataList) {
                $("#detailTable > tbody").empty();
                for (var i in dataList) {
                    if (dataList[i].rtcTime) {
                        var dt = new Date(dataList[i].rtcTime);
                        var t = CommonUtil.dateFormater(dt, "yyyy-MM-dd HH:mm");
                        $("#detailTable > tbody").append('<tr><td class="text-center">' + (parseInt(i) + 1) +
                            '</td><td class="text-center">' + t +
                            '</td><td class="text-center">' + dataList[i].pollutionValue + '</td></tr>');
                    }
                }
            },
            modelShow: function (id) {
                $('#' + id).modal('show');
            },
            Search: function () {
                var that = this;
                var params = {};
                if (this.pollutionLevel == 3) {
                    params = {
                        "cityId": currentCityId,
                        "startTime": this.three_startTime,
                        "endTime": this.three_endTime,
                        "pollutionLevel": 3,
                        "pollutionType": this.three_pollutionType,
                        "stationType": this.three_queryStationType
                    }
                }
                if (this.pollutionLevel == 4) {
                    params = {
                        "cityId": currentCityId,
                        "startTime": this.four_startTime,
                        "endTime": this.four_endTime,
                        "pollutionLevel": 4,
                        "pollutionType": this.four_pollutionType,
                        "stationType": this.four_queryStationType
                    }
                }
                if (params.startTime > params.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                if (!params.stationType || $.trim(params.stationType) == "") {
                    layer.msg('站点类别不能为空！', function () {
                    });
                    if (this.pollutionLevel == 3) that.level3Total = "";
                    if (this.pollutionLevel == 4) that.level4Total = "";
                    that.$broadcast('vuetable:clearTable');
                    return;
                }
                var sp = CommonUtil.json2Array(params);
                that.queryParam = [];
                for (var i = 0; i < sp.length; i++) {
                    that.queryParam.push(sp[i]);
                }
                that.$nextTick(function () {
                    that.$broadcast('vuetable:refresh');
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
            //修改污染等级
            setOverproofLevel: function (level) {
                this.pollutionLevel = level;
                this.Search();
            },
            //格式化日期
            formatDate: function (d) {
                {
                    var dt = new Date(d.replace(/-/, "/"));
                    return CommonUtil.dateFormater(dt, "yyyy-MM-dd HH:mm");
                }
            },
            //反馈按钮触发
            clickFeedback: function () {
                this.showDetail = false;
                this.showFeedback = true;
                this.showDetailDiv = 'none';
                this.showFeedbackDiv = 'block';
                $("#chartTitle").hide();
            },
            //详情按钮触发
            clickDetail: function () {
                this.showDetail = true;
                this.showFeedback = false;
                this.showDetailDiv = 'block';
                this.showFeedbackDiv = 'none';
                $("#chartTitle").show();
            },
            saveFeedback: function () {
                var that = this;
                if (!$.trim(this.feedbackDetail)) {
                    layer.msg('反馈不能为空！', function () {
                    });
                    return;
                }
                //添加反馈信息
                var postData = {
                    "stationId": that.detailStationId,
                    "detail": that.feedbackDetail
                };
                var addUrl = $.coreApiPath + "/analysis/overproof/feedback/add";
                ajax_post(addUrl, postData, function (resultJson) {
                    if (resultJson.erroCode == 2000) {
                        that.feedbackList.push({
                            "detail": that.feedbackDetail,
                            "insTime": resultJson.result
                        });
                        that.feedbackDetail = "";
                    }
                });
            }
        }
    });
});