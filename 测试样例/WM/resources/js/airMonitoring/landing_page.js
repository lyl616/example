var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy-MM-dd HH:mm:ss'
});

var airMonitoringVM;
$(function () {
    airMonitoringVM = new Vue({
        el: '#content',
        data: {
            bMapChar: null, //地图对象
            circleValueArr: [0, 0, 0, 0, 0, 0, 0],
            circleLevelArr: [0, 0, 0, 0, 0, 0, 0],
            numbers: [], //设置的圆环的个数
            infoList: [],
            cityName: '', //顶部标题城市名称
            currentTime: '', //最新数据时间
            cityType: '区县', //城市级别
            systemName: '', //系统名称
            currentCity: -1, //当前选择的城市ID
            doingNum: 0, //正在进行的勘查工单
            finishNum: 0, //已完成的勘查工单
            allFunctions: {},//保存用户所有权限
            hasAirMonitoring: false,
            thirdOverHref: 'javascript:void(0);', //三级超标链接
            forthOverHref: 'javascript:void(0);', //四级超标链接
            allSurveyJobHref: 'javascript:void(0);', //所有勘查工单
            doingSurveyJobHref: 'javascript:void(0);', //进行中的勘查
            finishSurveyJobHref: 'javascript:void(0);', //已完成的勘查
            topTenHref: 'javascript:void(0);', //区县TOP10跳转地址
            height: {
                scrrenHeight: $(window).height(),
                topTenHeight: 190,
                bestBaddayHeight: 140,
                cityMonthCompareHeight: 140,
            }
        },
        beforeMount: function () {
            var _self = this;
            var url = $.coreApiPath + "/role/functionRole";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                    _self.hasAirMonitoring = _self.allFunctions['ROLE_FUN_02'] != undefined;
                    // ROLE_FUN_001
                    //超标统计权限
                    if (_self.allFunctions['ROLE_FUN_005_04']) {
                        _self.thirdOverHref = $.ctx + '/analysis/overproof';
                        _self.forthOverHref = $.ctx + '/analysis/overproof?type=4';
                    }
                    //勘查管理权限
                    if (_self.allFunctions['ROLE_FUN_006_02']) {
                        _self.allSurveyJobHref = $.ctx + '/surveyjob?type=1';
                        _self.doingSurveyJobHref = $.ctx + '/surveyjob?type=2';
                        _self.finishSurveyJobHref = $.ctx + '/surveyjob?type=3';
                    }
                    //城市数据报告权限
                    if (_self.allFunctions['ROLE_FUN_004_03']) {
                        _self.topTenHref = $.ctx + '/multistation/index?type=1';
                    }
                } else {
                    _self.allFunctions = {};
                    _self.hasAirMonitoring = false;
                }
                hasAirMonitoring = _self.hasAirMonitoring;
            });
        },
        mounted: function () {
            for (var i = 32; i > 0; i--) {
                this.numbers.push(i);
            }
            for (var i = 1; i < 20; i++) {
                this.infoList.push({
                    stationName: "900" + i + "交通" + i,
                    instime: "12:25",
                    info: "pm25在今天早上16点的时候开始升高，将会在明日午间降低。"
                })
            }
            //计算页面的高度
            this.autoCalcModelheight();
            //获取所有城市及默认城市
            // this.initAllCity();
            //初始顶端配置
            // this.initSystemInfo();
            this.currentCity = parent.cityId;
            //定时刷新任务
            this.intervalJob();

        },
        watch: {
            //城市变化初始化数据
            'currentCity': function () {
                if (this.currentCity != -1) {
                    this.initMimap();
                    //城市AQI+六参
                    this.getCityWzLast();
                    //初始超标次数
                    this.getOverproof();
                    //区县AQI TOP 10
                    this.getTopten();
                    //获取天数占比
                    this.initBestBadDay();
                    //月份同比
                    this.cityMonthCompareFunc();
                    //地图数据
                    this.getMapAqi();
                    //勘查工单数据
                    this.getSurveyjobNum();
                    if (!this.currentCity.endsWith('00')) {
                        this.cityType = '站点';
                    }
                }
            }
        },
        methods: {
            autoCalcModelheight: function () {
                var _self = this;
                var rightHeight = _self.height.scrrenHeight - 185;
                _self.height.topTenHeight = rightHeight * 0.32;
                _self.height.bestBaddayHeight = rightHeight * 0.26;
                _self.height.cityMonthCompareHeight = rightHeight * 0.42 - 82;
                $('#topten').css("height", _self.height.topTenHeight + "px");
                $('#bestBadday').css("height", _self.height.bestBaddayHeight + "px");
                $('#cityMonthCompare').css("height", _self.height.cityMonthCompareHeight + "px");
                $(".ui-land-page-right .ui-autoHiehgt-site").css("height", rightHeight + 'px');
                $(".ui-land-page-right .ui-autoHiehgt-site").css("overflow", 'hidden');
                $(".ui-land-page-right .ui-autoHiehgt-site").hover(function () {
                    $(".ui-land-page-right .ui-autoHiehgt-site").css("overflow", 'auto');
                }, function () {
                    $(".ui-land-page-right .ui-autoHiehgt-site").css("overflow", 'hidden');
                });
            },
            initMimap: function () {
                var _self = this;
                this.bMapChar = echarts.init(document.getElementById("container"));
                // 初始化echarts示例mapChart
                $.get(ctx + '/resources/js/airMonitoring/domainbounds/' + _self.currentCity + '.json', function (chinaJson) {
                    echarts.registerMap('shandong', chinaJson); // 注册地图

                    var option = {
                        geo: {
                            label: {
                                show: false
                            },
                            map: 'shandong',
                            scaleLimit: {
                                min: 1,
                                max: 1
                            },
                            emphasis: {
                                label: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#3788dd', //鼠标移入区县的时候显示的颜色
                                    areaColor: '#0a2259', //默认的背景色
                                    shadowBlur: '10', //阴影模糊的大小
                                    shadowColor: '#0a2259',
                                    shadowOffsetY: '15', //阴影的偏移量
                                    borderWidth: 2
                                },
                                emphasis: {
                                    borderColor: '#3788dd', //鼠标移入区县的时候显示的颜色
                                    areaColor: '#0a2259', //默认的背景色
                                    shadowBlur: '10', //阴影模糊的大小
                                    shadowColor: '#0a2259',
                                    shadowOffsetY: '15', //阴影的偏移量
                                    borderWidth: 2
                                }
                            },
                            // hoverAnimation: false,
                            // roam: true,
                            silent: false
                        },
                        series: [{
                            type: 'scatter', // series图表类型
                            coordinateSystem: 'geo', // series坐标系类型
                            showLegendSymbol: false,
                            hoverAnimation: true,
                            symbol: 'circle',
                            symbolSize: 7,
                            itemStyle: {
                                color: function (params) {
                                    var value = params.value[2];
                                    return getColorByValAndType(value, 'aqi')
                                }, label: {
                                    show: false

                                }
                            },
                            data: [] // series数据内容
                        }]
                    }
                    _self.bMapChar.setOption(option);

                    _self.bMapChar.on('click', function (params) {
                        //跳转到监测地图
                        if (_self.hasAirMonitoring) {
                            window.location.href = $.ctx + '/airMonitoring/realtimeHistoryIndex';
                        }
                    });
                });
            },
            initCircleProgress: function (cls) {
                //重置圆环颜色
                $('input[id*="_barPieItem"]').removeAttr('class');
                (function (ELEMENT) {
                    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
                    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
                        var element = this;
                        while (element) {
                            if (window.CP.shouldStopExecution(1)) {
                                break;
                            }
                            if (element.matches(selector))
                                break;
                            element = element.parentElement;
                        }
                        window.CP.exitedLoop(1);
                        return element;
                    };
                }(Element.prototype));
                var barPie = {
                    onChnage: function (e) {
                        if (e.target.name.indexOf('barPieRadioGroup') == -1) {
                            return;
                        }
                        var scopeElm = e.target.closest('.' + cls);
                        barPie.update(scopeElm, +e.target.value);
                        if (!scopeElm.active)
                            scopeElm.querySelector('.barPie__ring').lastElementChild.addEventListener('click', barPie.clickToNull);
                        scopeElm.active = 1;
                    },
                    clickToNull: function () {
                        var that = this;
                        if (this.previousElementSibling.checked)
                            setTimeout(function () {
                                that.previousElementSibling.checked = false;
                                that.closest('.' + cls).querySelector('.barPie__value').innerHTML = '0';
                            }, 0);
                    },
                    update: function (scopeElm, value, speed, extraStep) {
                        if (!scopeElm)
                            return;
                        var valueElm = scopeElm.querySelector('.barPie__value'),
                            inital = +valueElm.innerHTML,
                            delta = value - inital,
                            doin;

                        function step(t, elapsed) {
                            t = 1 - Math.exp(-t * 7);
                            var value = delta * t + inital,
                                remainder = value % 1;
                            if (t > 0.99 && (remainder > 0.9 || remainder < 0.01)) {
                                value = Math.round(value);
                                doin.step = function () {
                                };
                            } else
                                value = value.toFixed(remainder ? 1 : 0);
                            valueElm.innerHTML = value;
                            if (extraStep)
                                extraStep(t);
                        }

                        if (!valueElm.doin) {
                            doin = new Doin(step, speed || 0.33);
                            valueElm.doin = doin;
                        } else
                            doin = valueElm.doin;
                        doin.step = step;
                        doin.run();
                        doin.done = function () {
                            scopeElm.querySelector('.barPie__value').innerHTML = value;
                        };
                    }
                };
                document.addEventListener('change', barPie.onChnage);
                var barPies = document.querySelectorAll('.' + cls);

                setTimeout(lazyCount, 1500);

                function lazyCount() {
                    var currentBarPie, itemsCount;
                    var pollutionInfo = {}, valueElement;

                    function step(t) {
                        itemsCount = itemsCount > 31 ? 31 : itemsCount;
                        //CO SO2 按不同等级改变圆环颜色 1级50%，逐级加10%
                        var itemIdx = Math.round(itemsCount * ((50 + (pollutionInfo.level - 1) * 10) / 100) * t);
                        //No2 1级占40%
                        if (currentBarPie.id == 'p6_barPie' && pollutionInfo.level == 1) {
                            itemIdx = Math.round(itemsCount * (40 / 100) * t);
                        }
                        //AQI和PM2.5计算方式
                        if (currentBarPie.id == 'p1_barPie' || currentBarPie.id == 'p2_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 500) * t);
                        }
                        //PM10计算方式
                        if (currentBarPie.id == 'p3_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 600) * t);
                        }
                        //O3计算方式
                        if (currentBarPie.id == 'p7_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 1000) * t);
                        }
                        itemIdx = itemIdx > 31 ? 31 : itemIdx;
                        var currObj = document.getElementById(currentBarPie.id + 'Item' + itemIdx)
                        currObj.className = pollutionInfo.className; //不同的级别给不同的class 值
                    }

                    for (var i = 0; i < barPies.length; i++) {
                        if (window.CP.shouldStopExecution(2)) {
                            break;
                        }
                        currentBarPie = barPies[i];
                        pollutionInfo.toValue = currentBarPie.dataset.toValue;
                        pollutionInfo.level = currentBarPie.dataset.toLevel;
                        pollutionInfo.className = 'level0' + currentBarPie.dataset.toLevel;
                        valueElement = currentBarPie.querySelector('.barPie__value');
                        if (pollutionInfo.toValue) {
                            itemsCount = currentBarPie.dataset.itemsCount;
                            barPie.update(currentBarPie, pollutionInfo.toValue, 1.5, step);
                        }
                    }
                    window.CP.exitedLoop(2);
                }
            },
            filterCircleValue: function (index) {
                return 100 - (100 / 32 * index);
            },
            filterCircleId: function (value, index, str) {
                return str + (value - 1);
            },
            filterCircleClass: function (value, index, str) {
                return 'barPie__ring__item ' + str + (value - 1);
            },
            //获取用户所有城市
            initAllCity: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/domain/allcity', function (json) {
                    if (json.erroCode == 2000) {
                        //城市列表，下拉使用，首要展示默认城市
                        for (var i = 0; i < json.result.length; ++i) {
                            var city = json.result[i];
                            if (city.isDefault) {
                                _self.cityName = city.cityName;
                                _self.currentCity = city.cityId;
                            }
                        }
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //获取系统名称和微站最新数据时间
            initSystemInfo: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/config/landingtitle', function (json) {
                    if (json.erroCode == 2000) {
                        _self.systemName = json.result.systemName;
                        _self.currentTime = json.result.wzLastTime;
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //城市微站当天超标次数
            getOverproof: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/stationdata/overproof/wztoday', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        $('#retroclockbox1').flipcountdown({
                            size: "xs",
                            tick: function () {
                                var thirdNum = json.result.thirdNum >= 999 ? 999 : json.result.thirdNum;
                                return ('000' + thirdNum).substr(-3);
                            }
                        });
                        $('#retroclockbox2').flipcountdown({
                            size: "xs",
                            tick: function () {
                                var fourthNum = json.result.fourthNum >= 999 ? 999 : json.result.fourthNum;
                                return ('000' + fourthNum).substr(-3);
                            }
                        });
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //区县AQI TOP 10
            getTopten: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/citydata/district/top', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        initTop10Char('topten', json.result, 'district');
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //天数占比
            initBestBadDay: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/citydata/daynum/premonth', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        initBestBaddayChar('bestBadday', json.result)
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //月份同比
            cityMonthCompareFunc: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/citydata/avgmonth/chart', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        initCityMonthCompareChar('cityMonthCompare', json.result)
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //最新站点AQI数据
            getMapAqi: function () {
                //配置地图上的点
                var _self = this;
                $.getJSON($.backendApiPath + '/stationdata/wzaqi/last', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        var myData = [];
                        var data = json.result;
                        if (_self.bMapChar) {
                            $.each(data, function (key, values) {
                                myData.push({name: values.stationName, value: [values.lng, values.lat, values.aqi2]})
                            });
                            var opt = {
                                series: [{
                                    data: myData // series数据内容
                                }]
                            };
                            _self.bMapChar.setOption(opt);
                        }
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //定时刷新任务
            intervalJob: function () {
                var _self = this;
                setInterval(function () {
                    var d = new Date();
                    if (_self.currentCity != -1) {
                        //8分刷新地图数据，超标数据
                        if (d.getMinutes() == 8) {
                            _self.getOverproof();
                            _self.getMapAqi();
                        }
                        //12分刷新区县AQI TOP
                        if (d.getMinutes() == 12) {
                            _self.getTopten();
                            _self.getCityWzLast();
                        }
                    }
                }, 60000);
            },
            //勘查工单数量
            getSurveyjobNum: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/surveyjob/count/' + _self.currentCity, {}, function (json) {
                    if (json.erroCode == 2000) {
                        if (json.result) {
                            _self.doingNum = json.result.doingNum;
                            _self.finishNum = json.result.finishNum;
                        }
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //微站城市数据API加六参
            getCityWzLast: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/citydata/wzlast', {cityId: _self.currentCity}, function (json) {
                    if (json.erroCode == 2000) {
                        if (json.result) {
                            _self.circleValueArr[0] = json.result.aqi2;
                            _self.circleLevelArr[0] = json.result.aqi2Level;
                            _self.circleValueArr[1] = json.result.pm25;
                            _self.circleLevelArr[1] = json.result.pm25Level;
                            _self.circleValueArr[2] = json.result.pm10;
                            _self.circleLevelArr[2] = json.result.pm10Level;
                            _self.circleValueArr[3] = json.result.co;
                            _self.circleLevelArr[3] = json.result.coLevel;
                            _self.circleValueArr[4] = json.result.so2;
                            _self.circleLevelArr[4] = json.result.so2Level;
                            _self.circleValueArr[5] = json.result.no2;
                            _self.circleLevelArr[5] = json.result.no2Level;
                            _self.circleValueArr[6] = json.result.o3;
                            _self.circleLevelArr[6] = json.result.o3Level;
                            $('#p1_barPie').attr('data-to-value', _self.circleValueArr[0]);
                            $('#p1_barPie').attr('data-to-level', _self.circleLevelArr[0]);
                            $('#p2_barPie').attr('data-to-value', _self.circleValueArr[1]);
                            $('#p2_barPie').attr('data-to-level', _self.circleLevelArr[1]);
                            $('#p3_barPie').attr('data-to-value', _self.circleValueArr[2]);
                            $('#p3_barPie').attr('data-to-level', _self.circleLevelArr[2]);
                            $('#p4_barPie').attr('data-to-value', _self.circleValueArr[3]);
                            $('#p4_barPie').attr('data-to-level', _self.circleLevelArr[3]);
                            $('#p5_barPie').attr('data-to-value', _self.circleValueArr[4]);
                            $('#p5_barPie').attr('data-to-level', _self.circleLevelArr[4]);
                            $('#p6_barPie').attr('data-to-value', _self.circleValueArr[5]);
                            $('#p6_barPie').attr('data-to-level', _self.circleLevelArr[5]);
                            $('#p7_barPie').attr('data-to-value', _self.circleValueArr[6]);
                            $('#p7_barPie').attr('data-to-level', _self.circleLevelArr[6]);
                            _self.initCircleProgress('barPie01');
                            _self.initCircleProgress('barPie02');
                            _self.initCircleProgress('barPie03');
                            _self.initCircleProgress('barPie04');
                            _self.initCircleProgress('barPie05');
                            _self.initCircleProgress('barPie06');
                            _self.initCircleProgress('barPie07');
                        }
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            }
        }
    });
});