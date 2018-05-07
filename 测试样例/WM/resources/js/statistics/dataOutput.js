var map = "";
var drawingManager = "";
var vueContent = null;
$(document).ready(function () {
    var curr_city = parent.cityId;
    var curr_pro = parent.provinceId;
    var curr_city_name = parent.cityName;
    var cityName = parent.cityName;
    var tableColumns = [{
        name: "number",
        title: "序号",
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'stationId',
        title: '站点编号',
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'equipmentId',
        title: '设备编号',
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'city',
        title: '市',
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'district',
        title: '区/县',
        titleClass: 'text-center',
        dataClass: "text-center"
    }, {
        name: 'dataTime',
        title: '数据时间',
        titleClass: 'text-center',
        dataClass: "text-center"
    },
        {
            name: 'aqi2',
            title: 'AQI',
            callback: 'AQIFmt',
            titleClass: 'text-center',
            dataClass: 'text-center'
        }, {
            name: 'aqi',
            title: '标准AQI',
            callback: 'AQIFmt',
            titleClass: 'text-center',
            dataClass: 'text-center'
        },
        {
            name: 'pm25',
            title: 'PM25 （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        }, {
            name: 'pm10',
            title: 'PM10 （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        }, {
            name: 'so2',
            title: 'SO2 （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'no2',
            title: 'NO2 （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'co',
            title: 'CO （mg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        }, {
            name: 'o3',
            title: 'O3 （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'o3H8',
            title: 'O3_8H （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'o3H1Max',
            title: 'O3_1H(Max) （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'o3H8Max',
            title: 'O3_8H(Max) （μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        }, {
            name: 'temperatureOut',
            title: '温度 \n（℃）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'humidityOut',
            title: '湿度 \n（%RH）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'windPower',
            title: '风速 （m/s）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'windDirection',
            title: '风向 \n（°）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'pressure',
            title: '气压\n（hPa）',
            titleClass: 'text-center',
            dataClass: "text-center"
        },
        {
            name: 'vocs',
            title: 'TVOC（μg/m³）',
            titleClass: 'text-center',
            dataClass: "text-center"
        }
    ];

    //右侧的列表的表格
    var tableRight = [{
        //name: "__sequence",
        //title: "序号"
        name: '__checkbox:stationId'
    }, {
        name: 'stationId',
        title: '站点编号'
    }, {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-left',
        dataClass: "text-left"
    }];

    function calcTime(domId, time, dt) {
        if (dt == 'day') {
            myDate.format = "yyyy-MM-dd";
            //initWDatetime(domId, "yyyy-MM-dd", time);
        } else if (dt == 'minus') {
            myDate.format = "yyyy-MM-dd hh:mm";
            //initWDatetime(domId, "yyyy-MM-dd HH:mm", time);
        } else if (dt == 'hour') {
            myDate.format = "yyyy-MM-dd hh:00"; //:mm:ss
            //initWDatetime(domId, "yyyy-MM-dd HH:00", time); //:mm:ss
        }
        var result = myDate.formatDate(time, myDate.format);
        return result;
    }

    Vue.config.debug = false;
    var start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, myDate.hour);
    var end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour);

    var initStartTimeFormat_ = calcTime("startTime", start, 'hour'),
        initEndTimeFormat_ = calcTime("endTime", end, 'hour');
    var timeVal = '';
    Vue.use(Vuetable);
    Vue.config.productionTip = false;
    var no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/no_select.png', new BMap.Size(24, 24));
    var is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/is_select.png', new BMap.Size(24, 24));
    vueContent = new Vue({
        el: '#content',
        data: {
            startTime: initStartTimeFormat_,
            endTime: initEndTimeFormat_,
            queryType: 'hour', //查询时间类型  minute-分   hour-小时  day-天
            queryStationType: ['6010,1010'], //
            querypollutionType: [], //要查 询的污染物类型
            isExportExcel: false,
            isExportCvs: false,
            allFunctions: {},
            stationList: [], //列表加载完成后的数据 信息
            districtList: [], //区列表
            khstationList: [], //考核类型列表
            wzstationList: [], //微站类型列表
            pcstationList: [], //爬虫类型列表
            ycstationList: [], //扬尘类型列表
            wz_all: true, //微站类型全选 true为选，false为不选
            district_all: true, //区县全选 true为选，false为不选
            kh_all: false, //考核类型全选
            pc_all: false, //爬虫类型全选
            yc_all: false, //场尘类型全选
            khli: [], //考核类型多选
            wzli: [], //微站类型多选
            ycli: [], //扬尘类型多选
            pcli: [], //爬虫类型多选
            districtli: [], //区县多选
            stationId: "", //右侧查询
            districts: "0", //选中的行政区域 0 未选择 1 全选  其它 id 字符串
            threeKilometre: false, //三公里选择
            selectedToRight: [],
            isOpen: false, //地图是否打开
            markers: [], //所有选择的站点
            mapOpenStatus: { //地图的开启状态
                isActive: false,
                noActive: true
            },
            threeKisActive: {
                isActive: true,
                noActive: false
            },
            btnStatus: {
                "tooltipDand": { //tooltip 的单点信息展示
                    isActive: false,
                    noActive: true
                },
                "tooltipMultid": { //tooltip 的多点信息展示
                    isActive: true,
                    noActive: false
                },
                'mapbtnDanx': {
                    isActive: false,
                    noActive: true
                },
                'mapbtnCirclex': {
                    isActive: false,
                    noActive: true
                },
                'mapbtnclear': {
                    isActive: true,
                    noActive: false
                }
            },
            btn_toogle_statue: 0, //收缩按钮的活动状态

            fields: tableColumns,
            fieldRight: tableRight,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            params: [ //vuetable默认请求值
                'provinceId=-1', //省
                'cityId=-1', //市id
                'district=-1', //县id
                'stationType=-1', //站点类型
                'sTechType=6010,1010', //微站默认
                'timeType=hour', //默认分钟
                'stationId=-1', //不用
                'weatherType=', //污染物类型
                'startTime=' + initStartTimeFormat_,
                'endTime=' + initEndTimeFormat_
            ],
            paramsRight: { //右侧列表的表格传递参数
                'wzz': "",
                'khz': "",
                'ycz': "",
                'pcz': "",
                'vocz': "",
                'districts': "",
                'stationId': "",
                'city': curr_city
            },
            paginationComponent: 'vuetable-pagination',
            apiUrl: $.coreApiPath + '/statistics/queryData',
            fileDownloadUrl: '',
            tableClass: 'table'
        },
        mounted: function () {
            var _self = this;
            _self.initAllFunctions();
            _self.initStationTypeList();
            _self.initMonitorSation();
            _self.resetVisiable();
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
            },
            selectedToRight: function () {
                var _self = this;
                if (_self.selectedToRight.length == 0) {
                    _self.threeKilometre = false;
                    _self.btnStatus['mapbtnclear'].noActive = true;
                    _self.btnStatus['mapbtnclear'].isActive = false;
                } else {
                    _self.btnStatus['mapbtnclear'].noActive = false;
                    _self.btnStatus['mapbtnclear'].isActive = true;
                }
                if (_self.selectedToRight.length == 1) {
                    _self.threeKisActive['isActive'] = true;
                    _self.threeKisActive['noActive'] = false;
                } else {
                    _self.threeKisActive['noActive'] = true;
                    _self.threeKisActive['isActive'] = false;
                }
                if (_self.isOpen)
                    _self.showSelectMarker();
            },
            'perPage': function (val, oldVal) {
                this.$nextTick(function () {
                    this.$refs.vuetable.refresh()
                });
                this.search();
            },
            'paginationComponent': function (val, oldVal) {
                this.$nextTick(function () {
                    this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
                })
            },
            queryStationType: function () {
                var _self = this;
                if (_self.queryStationType == '6010,1010' || _self.queryStationType == '') {
                    $(".time_m").show();
                } else {
                    $(".time_m").hide();
                }
            },
            queryType: function () {
                var _self = this;
                var start, end;
                $(".other_s").show();
                var filterHidePollType = [];
                switch (_self.queryType) {
                    case "minute": {
                        start = new Date(myDate.year, myDate.month - 1, myDate.day - 1, myDate.hour, myDate.minus);
                        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, myDate.minus);
                        _self.startTime = calcTime("startTime", start, 'minus');
                        _self.endTime = calcTime("endTime", end, 'minus');
                        $(".other_s").hide();
                        filterHidePollType = ['aqi', 'aqi2', 'o3H8', 'o3H1Max', 'o3H8Max'];
                    }
                        break;
                    case "hour": {
                        start = new Date(myDate.year, myDate.month - 1, myDate.day - 7, myDate.hour);
                        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour);
                        _self.startTime = calcTime("startTime", start, 'hour');
                        _self.endTime = calcTime("endTime", end, 'hour');
                        filterHidePollType = ['o3H1Max', 'o3H8Max'];
                    }
                        break;
                    case "day": {
                        start = new Date(myDate.year, myDate.month - 1, myDate.day - 31);
                        end = new Date(myDate.year, myDate.month - 1, myDate.day - 1);
                        _self.startTime = calcTime("startTime", start, 'day');
                        _self.endTime = calcTime("endTime", end, 'day');
                        filterHidePollType = ['aqi2', 'o3', 'o3H8'];
                    }
                        break;
                }
                $.each(filterHidePollType, function (i, t) {
                    _self.querypollutionType.removeByValue(t);
                });
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
            initStationTypeList: function () {
                var _self = this;
                ///////////////查询站点类型////////////////
                CommonUtil.ajax({
                    type: "post",
                    url: $.coreApiPath + '/rest/station/getSelectData',
                    dataType: "json",
                    async: false,
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (data) {
                        _self.stationTypeList = data.siteType;
                    },
                    errorFn: function (errorMsg) {
                        layer.msg('查询站点类型失败！');
                    }
                });
            },
            initMonitorSation: function () {
                var _self = this;
                var cityId = curr_city;
                ajax($.coreApiPath + "/monitor/station/" + cityId, {
                    parents: ""
                }, function (data) {
                    if (data != null) {
                        var wz = data.wz; //微站
                        if (typeof(wz) != undefined && wz.length > 0) {
                            _self.fillArray(_self.wzstationList, wz);
                            for (var i = 0; i < _self.wzstationList.length; i++) {
                                var stationId = _self.wzstationList[i].id.toString();
                                _self.wzli.push(stationId);
                            }
                        }
                        var kh = data.kh; //考核站
                        if (typeof(kh) != undefined && kh.length > 0) {
                            _self.fillArray(_self.khstationList, kh);
                        }
                        var pc = data.pc; //爬虫
                        if (typeof(pc) != undefined && pc.length > 0) {
                            _self.fillArray(_self.pcstationList, pc);
                        }
                        var yc = data.yc; //扬尘
                        if (typeof(yc) != undefined && pc.length > 0) {
                            _self.fillArray(_self.ycstationList, yc);
                        }
                        var district = data.district; //区域
                        if (typeof(district) != undefined && district.length > 0) {
                            for (var i = 0; i < district.length; i++) {
                                var code = {
                                    id: district[i].id,
                                    name: district[i].name
                                };
                                _self.districtList.push(code);
                            }
                            for (var i = 0; i < _self.districtList.length; i++) {
                                var stationId = _self.districtList[i].id.toString();
                                _self.districtli.push(stationId);
                            }
                        }
                        _self.searchStation();
                    }
                });
            },
            setTableClass: function () {
                return this.tableClass;
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
            //点击收缩按钮，收缩左右两边面板
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
                    $("#layui-layer" + this.layer_id).css("width", (this.calcSCreenSize() - 240) + "px");
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
            threeKM: function (event) {
                var _self = this;
                if (map == "") {
                    _self.initMap();
                }
                if (!_self.threeKilometre) {
                    if (_self.selectedToRight.length == 0) {
                        layer.msg("请选择一个3公里的中心点！");
                        return false;
                    } else if (_self.selectedToRight.length > 1) {
                        layer.msg("只能选择一个中心点！");
                        return false;
                    } else {
                        var sid = _self.selectedToRight[0];
                        var containPoints = [];
                        $.each(_self.stationList, function (index, item) {
                            if (item.stationId == sid && sid != "") { //查找站点获取经纬度
                                var point = new BMap.Point(item.lng, item.lat);
                                var bounds = getBounds(map, point, 3000);
                                $.each(_self.stationList, function (i, station) {
                                    var pt = new BMap.Point(station.lng, station.lat);
                                    var id = station.stationId;
                                    if (bounds.containsPoint(pt)) {
                                        containPoints.push(id);
                                    }
                                });
                                return false;
                            }
                        });
                        if (containPoints.length < 1) {
                            layer.msg("3公里内未关联到相关站点！");
                            return false;
                        } else {
                            var temp = _self.selectedToRight;
                            $.each(temp, function (i, item) {
                                var sid = item.split(",")[0];
                                if (!containPoints.hasVal(sid)) {
                                    containPoints.push(sid);
                                }
                            });
                            /*
                             if (containPoints.length > 20) {
                             _self.threeKilometre = false;
                             event.target.checked = false;
                             ////////修改三公里的，展示样式
                             this.threeKisActive['noActive'] = false;
                             this.threeKisActive['isActive'] = true;
                             layer.msg("最多只能选择20个站点！");
                             return false;
                             } else //*/
                            {
                                /*
                                 $.each(_self.markers, function (n, obj) {
                                 var marker = obj.marker;
                                 if (marker.isSelect) {
                                 marker.isSelect = false;
                                 marker.setIcon(no_select_icon);
                                 }
                                 $.each(containPoints, function (j, stationId) {
                                 if (stationId == obj.id) {
                                 marker.isSelect = true;
                                 marker.setIcon(is_select_icon);
                                 _self.selectItem(stationId, 1);
                                 }
                                 });
                                 });//*/
                                _self.setSelectedStations(containPoints);

                                ////////修改三公里的，展示样式
                                this.threeKisActive['isActive'] = true;
                                this.threeKisActive['noActive'] = false;
                                _self.singleSelected = "";
                                _self.threeKilometre = false;
                            }
                        }
                    }
                }
            },
            //重新计算页面宽度，并重置两个面板的大小
            calcSCreenSize: function () {
                var widthS = window.innerWidth;
                return widthS;
            },
            searchStation: function () {
                var _self = this;
                _self.paramsRight = {
                    'wzz': _self.wzli.join(","),
                    'khz': _self.khli.join(","),
                    'ycz': _self.ycli.join(","),
                    'pcz': _self.pcli.join(","),
                    'vocz': "",
                    'districts': _self.districts,
                    'stationId': _self.stationId,
                    'city': curr_city
                };
                _self.$nextTick(function () {
                    _self.selectedToRight = [];
                    _self.$refs.vuetableRight._data.selectedTo = [];
                    _self.$refs.vuetableRight.refresh(); //.$broadcast('vuetable:refresh');
                });
            },
            queryStations: function () { //点击“确定”按钮的样式
                this.searchStation();
                this.popWindwoShow('categ_popwindow');
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
            transform: function (response) {
                var transformed = {};
                if (response.code == 2000) {
                    response = response.result;
                    transformed.pagination = {
                        total: response.pagination.total,
                        per_page: response.pagination.per_page,
                        current_page: response.pagination.current_page,
                        last_page: response.pagination.last_page,
                        next_page_url: response.pagination.next_page_url,
                        prev_page_url: response.pagination.prev_page_url,
                        from: response.pagination.from,
                        to: response.pagination.to
                    };
                    transformed.data = []
                    response = response.data;
                    for (var i = 0; i < response.length; i++) {
                        transformed['data'].push(response[i])
                    }
                }
                return transformed;
            },
            addSelectStation: function (station) {
                this.selectedToRight.push(station);
                this.$refs.vuetableRight.selectedTo = this.selectedToRight;
            },
            removeSelectStation: function (station) {
                this.selectedToRight.removeByValue(station);
                this.$refs.vuetableRight.selectedTo = this.selectedToRight;
            },
            setSelectedStations: function (stations) {
                this.selectedToRight = stations;
                this.$refs.vuetableRight.selectedTo = this.selectedToRight;
            },
            onRightCheckToggled: function () {
                this.selectedToRight = this.$refs.vuetableRight.selectedTo;
                //this.showSelectMarker();
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
                jQuery(this.$refs.vuetableRight.$el).addClass("vuetable-wrapper loading");
            },
            onRightLoaded: function () {
                jQuery(this.$refs.vuetableRight.$el).removeClass("vuetable-wrapper loading");
            },
            //打开地图的弹窗
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
                        id: "chartsContent", //需要关闭的弹窗的id
                        content: $('#mapHtml'),
                        offset: 'l',
                        area: [widthSite, '88%'],
                        maxmin: false,
                        move: false,
                        closeBtn: false,
                        shade: 0,
                        success: function () {
                            that.isOpen = true;
                            that.initMap();
                        },
                        cancel: function () {
                            that.isOpen = false;
                            map = "";
                        }
                    });
                    that.layer_id = winfg;
                    layer.style(winfg, {
                        top: '140px',
                        left: '10px'
                    });
                } else {
                    layer.closeAll(); //疯狂模式，关闭所有层
                    $("#mapHtml").hide();
                }
                this.mapOpenStatus.isActive = !this.mapOpenStatus.isActive;
                this.mapOpenStatus.noActive = !this.mapOpenStatus.noActive;
            },
            //初始化地图
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
                if (_self.markers.length > 0 && _self.selectedToRight.length > 0) {
                    _self.showSelectMarker();
                }
                _self.initDrawingManager(); //初始化圈选功能
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
                    if (this.isSelect) {
                        _self.removeSelectStation(this.id);
                        this.isSelect = false;
                        this.setIcon(no_select_icon);
                    } else {
                        _self.addSelectStation(this.id);
                        this.isSelect = true;
                        this.setIcon(is_select_icon);
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
                $.each(_self.markers, function (n, obj) {
                    if (obj.marker.isSelect) {
                        obj.marker.isSelect = false;
                        obj.marker.setIcon(no_select_icon);
                    }
                });
                _self.setSelectedStations([]);
                _self.StatusChange('mapbtnclear');
            },
            showSelectMarker: function () {
                var _self = this;
                var prevSel = _self.selectedToRight;
                //var prevSelVal = prevSel && prevSel.length > 0 ? prevSel[0] : '';
                $.each(_self.markers, function (n, obj) {
                    var marker = obj.marker;
                    if (marker.isSelect && !prevSel.hasVal(obj.id)) {
                        marker.isSelect = false;
                        marker.setIcon(no_select_icon);
                    } else if (!marker.isSelect && prevSel.hasVal(obj.id)) {
                        marker.isSelect = true;
                        marker.setIcon(is_select_icon);
                    }
                });
            },

            initDrawingManager: function () {
                var _self = this;
                drawingManager = new BMapLib.DrawingManager(map, {
                    isOpen: false, // 是否开启绘制模式
                    enableDrawingTool: false, // 是否显示工具栏
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_TOP_LEFT, // 位置
                        offset: new BMap.Size(570, 5), // 偏离值
                        scale: 0.8, // 工具栏缩放比例
                        drawingModes: [BMAP_DRAWING_RECTANGLE]
                    }
                });
                drawingManager.addEventListener('rectanglecomplete', function (e, d_overlay) {
                    d_overlay.hide();
                    drawingManager.close();
                    _self.btnStatus['mapbtnCirclex'].noActive = true;
                    _self.btnStatus['mapbtnCirclex'].isActive = false;
                    var slt_overlays = [];
                    var overlays = map.getOverlays();
                    for (var i = 0; i < overlays.length; i++) {
                        var overlay = overlays[i];
                        if (d_overlay.containPoint(overlay.point)) {
                            slt_overlays.push(overlay.id);
                        }
                    }
                    if (slt_overlays.length > 0) {
                        var temp = _self.selectedToRight;
                        $.each(temp, function (i, item) {
                            if (!slt_overlays.hasVal(item)) {
                                slt_overlays.push(item);
                            }
                        })
                        /*
                         if (slt_overlays.length > 20) {
                         layer.msg("最多只能选择20个站点！");
                         return;
                         } else//*/
                        {
                            $.each(_self.markers, function (n, obj) {
                                var marker = obj.marker;
                                if (marker.isSelect) {
                                    marker.isSelect = false;
                                    marker.setIcon(no_select_icon);
                                }
                                $.each(slt_overlays, function (j, stationId) {
                                    if (stationId == obj.id) {
                                        marker.isSelect = true;
                                        marker.setIcon(is_select_icon);
                                        //_self.selectItem(stationId, 1);
                                    }
                                });
                            });
                        }
                        _self.setSelectedStations(slt_overlays);
                    }
                });
            },
            openDrawingManager: function () {
                drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
                drawingManager.open();
                this.StatusChange('mapbtnCirclex');
            },
            StatusChange: function (str1) {
                var obj;
                obj = this.btnStatus[str1];
                obj.isActive = !obj.isActive;
                obj.noActive = !obj.noActive;
            },
            popWindwoShow: function (id) {
                $('#' + id).toggle();
            },
            onPaginationData: function (tablePagination) {
                this.$refs.paginationInfo.setPaginationData(tablePagination)
                this.$refs.pagination.setPaginationData(tablePagination)
            },
            onChangePage: function (page) {
                this.$refs.vuetable.changePage(page)
            },
            onLoadSuccess: function (response) {
                var _self = this;
                response = response.data;
                if (response.code == 2000 && response.result.data.length > 0) {
                    removeAttrByDomId("exportExcel", "disabled");
                    removeAttrByDomId("exportCvs", "disabled");
                    _self.showDataColoumn();
                } else {
                    disabledByDomId("exportExcel");
                    disabledByDomId("exportCvs");
                    _self.$nextTick(function () {
                        _self.$refs.vuetable.resetData(); //_self.$broadcast('vuetable:clearTable');
                    });
                }
            },
            onCellMouseEnter: function (rowData, field, event) {
                var fieldNname = field.name;
                var value = rowData[fieldNname];
                if (value == "" || value == null) return false;
                if (fieldNname == 'aqi' || fieldNname == "aqi2") {
                    var val = value.split("$");
                    if (val[1] != null && val[1] != "") {
                        layer.tips(val[1], event.srcElement, {
                            tips: 1,
                            time: 0
                        });
                    }
                }
            },
            onCellMouseLeave: function (rowData, field, event) {
                layer.closeAll('tips'); //关闭所有的tips层
            },
            showLoader: function () {
                initLayerLoader();
                this.loading = 'loading';
            },
            hideLoader: function () {
                this.loading = '';
                closeLayreLoader();
            },
            resetVisiable: function () {
                var _self = this;
                var hideWeatherType = ['aqi2', 'aqi', 'no2', 'pm25', 'pm10', 'co', 'so2', 'o3', 'o3H8', 'o3H1Max', 'o3H8Max', 'windPower', 'windDirection', 'temperatureOut', 'humidityOut', 'pressure', 'vocs', 'equipmentId'];
                for (var i = 0; i < hideWeatherType.length; i++) {
                    for (var j = 0; j < _self.fields.length; j++) {
                        if (hideWeatherType[i] == _self.fields[j].name) {
                            _self.$refs.vuetable.hideField(j);
                            //_self.fields[j].visible = false;
                        }
                    }
                }
            },
            showDataColoumn: function () {
                var _self = this;
                for (var i = 0; i < _self.querypollutionType.length; i++) {
                    for (var j = 0; j < _self.fields.length; j++) {
                        if (_self.querypollutionType[i] == _self.fields[j].name) {
                            _self.$refs.vuetable.showField(j);
                            //_self.fields[j].visible = true;
                        }
                    }
                }
            },
            search: function () {
                var _self = this;
                var conditionData = {
                    //provinceId: _self.province, //省
                    domainId: curr_city, //市id
                    //district: _self.district, //县id
                    //stationType: _self.stationType, //站点类型
                    //sTechType: _self.queryStationType, //微站默认
                    timeType: _self.queryType, //默认小时
                    stationIds: _self.selectedToRight.join(','), //不用
                    weatherType: _self.querypollutionType.join(','), //污染物类型
                    startTime: _self.startTime,
                    endTime: _self.endTime
                };
                if (_self.querypollutionType.length < 1) {
                    layer.msg("请选择污染物类型！");
                    return false;
                }
                if (_self.selectedToRight.length < 1) {
                    layer.msg("请选择站点！");
                    return false;
                }

                //if(conditionData.provinceId == '-1') {
                //	layer.msg('请选择省份！');
                //	return;
                //}

                //if(conditionData.cityId == '-1') {
                //	layer.msg('请选择城市！');
                //	return;
                //}
                if (!_self.querypollutionType) {
                    layer.msg('请选择污染物！');
                    return;
                }
                if (conditionData.startTime > conditionData.endTime) {
                    layer.msg('开始时间不能大于结束时间');
                    return;
                }
                conditionData.weatherType = conditionData.weatherType.replace("equipmentId", "").replace(",,", ",");
                var daynum = 0,
                    tipmsg = '';
                var timeStr = conditionData.endTime.length == 10 ?
                    " 00:00:00" :
                    (conditionData.endTime == 13 ?
                        ":00:00" :
                        ":00");
                var get_s_time = new Date(conditionData.endTime + timeStr),
                    get_e_time = new Date(conditionData.startTime + timeStr);
                conditionData.startTime = get_e_time.Format("yyyy-MM-dd HH:mm:ss");
                conditionData.endTime = get_s_time.Format("yyyy-MM-dd HH:mm:ss");
                //				var a = get_s_time - get_e_time; //当前时间差（秒）
                //

                var b = 1000 * 60 * 60 * 24 * daynum; //30天时间值（秒）
                switch (conditionData.timeType) {
                    case 'minute': {
                        daynum = 1; //0.25;
                        tipmsg = '分钟数据';
                        //if((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {
                        //	layer.msg('查询【' + tipmsg + '】不得大于6小时！');
                        //	return;
                        //}
                    }
                        break;
                    case 'hour': {
                        daynum = 31; //7;
                        tipmsg = '小时数据';
                    }
                        break;
                    case 'day': {
                        daynum = 366; //31;
                        tipmsg = '天数据';
                    }
                        break;
                }
                if ((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {
                    layer.msg('导出报表查询【' + tipmsg + '】不得大于' + daynum + '天！');
                    return;
                }
                _self.resetVisiable();
                if (_self.btn_toogle_statue == 0) {
                    _self.toogleContianer();
                }
                if (!this.mapOpenStatus.noActive) {
                    _self.openMap();
                }

                _self.params = conditionData;
                _self.$nextTick(function () {
                    _self.$refs.vuetable.refresh(); //.$broadcast('vuetable:refresh');
                });
            },
            exportExcel: function (exportName) {
                // debugger
                var _self = this;
                var OutPutType = '';
                var conditionData = {
                    //provinceId: _self.province, //省
                    domainId: curr_city, //市id
                    //district: _self.district, //县id
                    //stationType: _self.stationType, //站点类型
                    //sTechType: _self.queryStationType, //微站默认
                    timeType: _self.queryType, //默认小时
                    stationIds: _self.selectedToRight.join(','), //不用
                    weatherType: _self.querypollutionType.join(','), //污染物类型
                    startTime: _self.startTime,
                    endTime: _self.endTime
                };
                if (_self.querypollutionType.length < 1) {
                    layer.msg("请选择污染物类型！");
                    return false;
                }
                if (_self.selectedToRight.length < 1) {
                    layer.msg("请选择站点！");
                    return false;
                }
                if (conditionData.startTime > conditionData.endTime) {
                    layer.msg('开始时间不能大于结束时间');
                    return;
                }
                if (exportName == 'excel') {
                    OutPutType = $.coreApiPath + '/statistics/exportData?';
                } else {
                    OutPutType = $.coreApiPath + '/statistics/exportData/cvs?';
                }

                var daynum = 0,
                    tipmsg = '';
                var timeStr = conditionData.endTime.length == 10 ?
                    " 00:00:00" :
                    (conditionData.endTime == 13 ?
                        ":00:00" :
                        ":00");
                var get_s_time = new Date(conditionData.endTime + timeStr),
                    get_e_time = new Date(conditionData.startTime + timeStr);
                conditionData.startTime = get_e_time.Format("yyyy-MM-dd HH:mm:ss");
                conditionData.endTime = get_s_time.Format("yyyy-MM-dd HH:mm:ss");

                switch (conditionData.timeType) {
                    case 'minute': {
                        daynum = 1; //0.25;
                        tipmsg = '分钟数据';
                        //if((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {
                        //	layer.msg('查询【' + tipmsg + '】不得大于6小时！');
                        //	return;
                        //}
                    }
                        break;
                    case 'hour': {
                        daynum = 31; //7;
                        tipmsg = '小时数据';
                    }
                        break;
                    case 'day': {
                        daynum = 366; //31;
                        tipmsg = '天数据';
                    }
                        break;
                }
                if ((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {
                    layer.msg('导出报表查询【' + tipmsg + '】不得大于' + daynum + '天！');
                    return;
                }
                conditionData.weatherType = conditionData.weatherType.replace("equipmentId", "").replace(",,", ",");
                var OutPutFileUrl = OutPutType +
                    //'provinceId=' + conditionData.provinceId +
                    '&domainId=' + conditionData.domainId +
                    //'&district=' + conditionData.district +
                    //'&stationType=' + conditionData.stationType +
                    '&timeType=' + conditionData.timeType +
                    //'&sTechType=' + conditionData.sTechType + //微站默认
                    '&stationIds=' + conditionData.stationIds + //
                    '&weatherType=' + conditionData.weatherType + //污染物类型
                    '&startTime=' + conditionData.startTime +
                    '&endTime=' + conditionData.endTime;
                CommonUtil.ajax({
                    type: "post",
                    url: $.coreApiPath + '/statistics/exportCheck',
                    dataType: "json",
                    data: conditionData,
                    //beforeSend: initLayerLoader, // 发送请求
                    //complete: closeLayreLoader, // 请求完成
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (data) {
                        switch (data) {
                            case 1: {
                                window.location.href = OutPutFileUrl;
                            }
                                break;
                            case -2: {
                                layer.msg('当前查询条件为空！');
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
            },
            AQIFmt: function (value) {
                if (value != null && value != "") {
                    var arr = value.split("$");
                    if (arr[1] != "" && arr[1] != null) {
                        return arr[0] + "*";
                    }
                    return arr[0];
                }
            }
        }
    });
});

function showDatePicker(id) {
    WdatePicker.call(this, {
        dateFmt: myDate.format.replace("hh", "HH"),
        maxDate: '%y-%M-%d',
        onpicked: function () {
            if ('startTime' == id) {
                vueContent.startTime = $dp.cal.getDateStr(myDate.format.replace("hh", "HH"));
            } else {
                vueContent.endTime = $dp.cal.getDateStr(myDate.format.replace("hh", "HH"));
            }
        }
    });
}