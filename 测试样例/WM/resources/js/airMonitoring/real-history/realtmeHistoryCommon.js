var initTime = {
    'hour': {
        start: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day, 24, 0, 0), 'yyyy-MM-dd hh:mm:ss'),
        end: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 4, 0, 0, 0), 'yyyy-MM-dd hh:mm:ss'),
    },
    "day": {
        start: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 1), 'yyyy-MM-dd'),
        end: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 30), 'yyyy-MM-dd'),
    },
    currTime: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, 0, 0), 'yyyy-MM-dd hh:mm:ss'), //小时用到的时间格式（竖线）
    conrolTime: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day), 'yyyy-MM-dd'), //天用到的时间格式（竖线）
    prevDayTime: myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 1), 'yyyy-MM-dd')
}
var airMonitoringVM = "";


parent.cityName = "济宁";
parent.cityId = 370800;
$(function () {
    airMonitoringVM = new Vue({
        el: '#content',
        data: {
            aqiFirst2: '',
            circleValueArr: [91, 96, 25, 132, 19, 33, 0.8, 147],
            circleLevelArr: [2, 2, 1, 2, 1, 1, 1, 1],
            pullutionText: ['AQI', '标准AQI', 'PM25', 'PM10', 'SO2', 'NO2', 'CO', 'O3', 'TVOC', 'CO2', 'NO', '噪音'],
            numbers: [], //设置的圆环的个数
            leftpane: {
                'noActive': true,
                'isActive': false
            },
            mappane: {
                'noActive': true,
                'isActive': false
            },
            openFullmappane: {
                'noActive': false,
                'isActive': false,
                'fullIsActive': false
            },
            leftblockNum: 0, //左侧一屏可以显示的个数
            showLevel: {
                "-1": false,
                "1": true,
                "2": true,
                "3": true,
                "4": true,
                "5": true,
                "6": true
            },
            pollutionBtnStatus: {
                'lx': { //离线
                    isActive: true,
                    noActive: false
                },
                'y': { //优
                    isActive: true,
                    noActive: false,
                },
                'l': { //良
                    isActive: true,
                    noActive: false
                },
                'q': { //轻度
                    isActive: true,
                    noActive: false
                },
                'z': { //中度
                    isActive: true,
                    noActive: false
                },
                'zd': { //重度
                    isActive: true,
                    noActive: false
                },
                'yz': { //严重
                    isActive: true,
                    noActive: false
                }
            },
            markers: {
                "-1": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
            },
            showToolBox: true,
            mapControl: {
                'difMap': {
                    isActive: false,
                    noActive: false
                },
                'mapOperat': {
                    isActive: false,
                    noActive: false
                },
                'mapRuler': {
                    isActive: false,
                    noActive: false
                },
                "mapLight": {
                    isActive: false,
                    noActive: false
                },
                "mapTool": {
                    isActive: false,
                    noActive: true
                },
                "mapStaiontype": {
                    isActive: false,
                    noActive: true
                },
                'timeChange': {
                    isActive: false,
                    noActive: true
                },
                'cloundDownload': {
                    isActive: false,
                    noActive: true
                },
                'timeForday': {
                    isActive: false
                },
                'timeForhour': {
                    isActive: true
                }
            },
            timeTypeStartEnd: {
                "hour": {
                    start: initTime.hour.start,
                    end: initTime.hour.end
                },
                "day": {
                    start: initTime.day.start,
                    end: initTime.day.end
                }
            },
            queryStationParams: {
                domainId: parent.domainId,
                district: -1,
                pollutionType: 'pm25',
                valueType: "all", //查询的站点数据类型 all-全部 wz-微站 kh-考核站 yc-扬尘站 pc-爬虫站
                stechType: '-1',
                stationType: '-1',
                dateType: 2, //数据时间类型 1-分钟数据 2-小时数据 3-天数据 4-月数据 5-年数据 ,
                topNumber: -1,
                currentTime: initTime.hour.end,
                order: "desc"
            },
            currentCity: "-1",
            cityName: "",
            currentPollutionType: 'pm25', //当前选中污染物类型
            stationDetail: {
                stationId: '', //站点详情--站点ID
                stationName: '', //站点详情--站点名称
                stationTypeName: '', //站点详情--站点类型名称
                addr: '', //地址
                tvoc: '', //tvoc
                co2: '',
                aqi: '',
                temperature: '',
                humidity: '',
                windPower: '',
                windDirection: '',
                pressure: '',
            },
            sort: {
                desc: true,
                asc: false
            },
            stationIdOrName: "",
            isShowDownList: false,
            map: null,
            mapType: 1,
            selectMarker: null, //点击的marker
            infoBox: null, //搜索展示的旗帜窗口
            searchMarker: null, //点击的marker
            zoom: 10, ///地图的初始化级别
            cirCleMarker: null,
            cirCle: 600,
            iconSize: 16, //图标的大小
            clkMarker: null,
            ctrl: null,
            drawingManager: null,
            //进度条控制云图部分
            pCloundBtnStatus: {
                'status': {
                    isActive: false,
                    noActive: true
                }
            },
            airDataMap: [], //存储污染云图的获取数据值
            imageLayer: '', //地图上需要叠加污染云图的img 对象
            isDesablePClound: false,
            cloudImg: "", //污染云图，展示的图片路径
            pCloundDownloadStatus: { //污染云图下载状态
                isActive: false,
                noActive: true
            },
            scrollCont: 0, //滚动加载次数
            showMsg: true,
            rPanelSType: 'wz-kh', //右侧面板的站点类型
            isshowAllDownloadBtn: false, //下载污染云图按钮，是否开启
            showStation: true,
            stationFgBtnStatus: { // 站点开关控制按钮状态
                isActive: true,
                noActive: false
            },
            ////////污染源部分//////
            psdropListShowBtn: {
                'status': {
                    isActive: false,
                    noActive: true
                },
                'pSelectIsShow': false,
                'pSelectHtmlIsShow': false
            },
            psdropListHtml: cus_pollutions, //初始化污染源列表，展示的html 的数据内容
            pSourceChxVal: [], //绑定的污染源选中的值
            // 地图控制
            wzli: [],
            khli: [],
            ycli: [],
            pcli: [],
            districtli: [],
            districtList: [],
            khstationList: [],
            wzstationList: [],
            pcstationList: [],
            ycstationList: [],
            staionRankList: [],
            wz_all: true, //true为选，false为不选
            kh_all: true,
            pc_all: true,
            yc_all: true,
            district_all: true, //true为选，false为不选
            dropDownstechType: '6010 99 98 101', //地图站点类型列表，设置选中的大类
            allselectedStation: [], //站点列表中所有选中的站点类型
            allselectedStationView: [],
            selectStationTpye: {
                valueType: "all", //查询的站点数据类型 all-全部 wz-微站 kh-考核站 yc-扬尘站 pc-爬虫站
                stechType: '-1',
                stationType: '-1',
                pname: "",
                name: "",
                district: -1,
                districtName: ''
            },
            // 进度条部分
            timeType: {
                "hour": {
                    noActive: false
                },
                "day": {
                    noActive: true
                }
            },
            timeControlVal: initTime.conrolTime,
            s_tech_type: '0|微站', //站点类型
            siteParam: {},
            rPanelSType: 'wz-kh', //右侧面板的站点类型
            search_down_list: [],
            judgeSscreen: false, //判断是否小屏
            openActiveTab: {
                isActive: true,
                noActive: false
            },
            isShowshowBtn: false, //是否展示“展开”按钮
            isYC: true, //是不是扬尘
            ptypeList: [],
            ptype: 'pm25',
            char: {
                result: {},
                stationId: "",
                sTechType: "",
                rtcTime: ""
            },
            allFunctions: {}, //保存所有用户权限
            surveyUrl: null, //
            hasSurveyRole: null, //是否有权监测点数据
        },
        beforeMount: function () {
            var _self = this;
            _self.currentCity = parent.cityId;

            var _self = this;
            var url =   "../../json/airMonitoring/role_functionRole.json";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                    _self.hasSurveyRole = hasKey(_self.allFunctions, 'ROLE_FUN_003_01');
                }
            });
        },
        mounted: function () {
            var _self = this;
            for (var i = 18; i > 0; i--) {
                this.numbers.push(i);
            }
            _self.initAllCity();
            _self.initPopStationList();
            //初始顶端配置
            // _self.queryStationList(); //重复请求，想办法处理
            _self.autoCalcModelheight();
            _self.tabtagClick(); //绑定tab标签的点击事件
            _self.initCircleBars();
            _self.muiltCircle();
            //初始化日期控件
            _self.initdatepicker();
            _self.switchTable();
            //第一次获取微站的进度条的时间限制
            _self.getCalcDataTime('hour');
        },
        watch: {
            'judgeSscreen': function () {
                var scrrenHeight = $(window).height(),
                    toptenH = $("#topten").height() + $('#forecastChar').height() + 122;
                $('#windyroseEchart').css("height", (scrrenHeight - toptenH) + "px");
                var resourceChart = echarts.init(document.getElementById('windyroseEchart'));
                resourceChart.resize();
            },
            'zoom': function () {
                var _self = this;
                var zoom = _self.zoom;
                _self.showMarkers();
                _self.addCircle();
            },
            'rPanelSType': function () {
                if (this.pCloundBtnStatus.status.isActive) { //污染云图的按钮为开启状态
                    this.showCloudWindyInfo();
                }
            },
            'pCloundBtnStatus.status.isActive': function () {
                if (this.pCloundBtnStatus.status.isActive) { //‘污染云图’当前状态为活动状态
                    this.mapControl.cloundDownload.isActive = true;
                    this.map.addOverlay(this.imageLayer);
                    this.getCloudImg();
                } else {
                    this.mapControl.cloundDownload.isActive = false;
                    this.map.removeOverlay(this.imageLayer);
                }
            },
            'psdropListShowBtn.status.isActive': function () {
                if (!this.psdropListShowBtn.status.isActive) {
                    this.clearPollutions();

                    $("#drop-panel-nav input[type='checkbox']").each(function () {
                        if (this.checked) {
                            this.checked = false;
                        }
                    });
                }
            },
            'currentCity': function (val) {
                var _self = this;
                if (_self.currentCity != "-1") {
                    _self.initAirMap(); //初始化地图
                    // _self.getCityWzLast();
                    _self.initTopten(); //初始化top10的站点排名
                    _self.initwindyroseEchart(); //风玫瑰图
                    _self.initWeatherForecastEchart(); //气象预报
                }
            },
            'leftpane.isActive': function () {
                var _self = this;
                if (this.leftpane.isActive) {
                    $('.ui-rh-circle').show();
                } else {
                    $('.ui-rh-circle').each(function (index, item) {
                        if (index >= _self.leftblockNum) {
                            $(this).hide();
                        }
                    });
                }
            },
            'timeControlVal': function () { //日期控件时间的更改
                this.changeprogStatue();
                this.queryStationList();
                console.log("timeControlVal>>queryStationList");
            },
            'queryStationParams.order': function () {
                var _self = this;
                var order = _self.queryStationParams.order;
                _self.staionRankList = sortFun(_self.staionRankList, order);
            }
        },
        methods: {
            initCircleBars: function () {
                var _self = this;
                for (var i = 1; i < 12; i++) {
                    var id = "barPie";
                    if (i < 10) {
                        id += "0" + i;
                    } else {
                        id += i;
                    }
                    _self.initCircleProgress(id);
                }

            },
            resiteStechType: function () { //切换右侧面板的 “站点类型”下拉列表值
                var _self = this;
                this.changeprogStatue();
                switch (_self.queryStationParams.valueType) {
                    case 'kh': {
                        _self.isDesablePClound = false; //开启  污染云图的可用状态
                        _self.rPanelSType = "kaohe"; //记录下当前的站点类型
                    }
                        break;
                    case 'wz': {
                        _self.isDesablePClound = false; //开启    污染云图的可用状态
                        _self.rPanelSType = 'wz' //记录下当前的站点类型
                    }
                        break;
                    case 'yc': {
                        _self.isDesablePClound = true; //禁用  污染云图的可用状态
                        //////////重置“污染源”按钮的活动状态
                        _self.pCloundBtnStatus.status.noActive = true;
                        _self.pCloundBtnStatus.status.isActive = false;
                    }
                        break;
                    case 'pc': {
                        _self.isDesablePClound = true; //禁用    污染云图的可用状态
                        //////////重置“污染源”按钮的活动状态
                        _self.pCloundBtnStatus.status.noActive = true;
                        _self.pCloundBtnStatus.status.isActive = false;
                    }
                        break;
                    case 'all': {
                        _self.isDesablePClound = false; //开启  污染云图的可用状态
                        _self.rPanelSType = "wz-kh"; //记录下当前的站点类型
                    }
                        break;
                }
                if (_self.queryStationParams.dateType == 3) { //站点为天的时候要请求一次数据
                    //_self.initStationTypeList();
                }
            },
            resitepBtnStatus: function (fg) { //根据站点的类型，重置左边按钮的disable状态
                if (fg) { //扬尘
                    for (var i = 0; i < this.pollutionTypeList.length; i++) {
                        if (this.pollutionTypeList[i].id != 'pm10') {
                            this.pollutionTypeList[i].isDisable = true;
                        }
                    }
                    this.changePollution('pm10');
                } else { //非扬尘站
                    for (var i = 0; i < this.pollutionTypeList.length; i++) {
                        this.pollutionTypeList[i].isDisable = false;
                    }
                }
            },
            changePollution: function (type) {
                var _self = this;
                _self.queryStationParams.pollutionType = type;
                _self.queryStationList();
                console.log("changePollution>>queryStationList");
                stopAllPlay();
            },
            getCalcDataTime: function (timeType) {
                var _self = this;
                $.ajax({
                    type: "get",
                    url: "../../json/airMonitoring/dataTime.json",
                    async: false,
                    success: function (data) {
                        if (data.erroCode == 2000) {
                            //debugger
                            _self.siteParam = data;
                            _self.getprogressParam(timeType);
                        }
                    }
                });
            },
            getYearmonthday: function (time) {
                var t = new Date(time);
                var timeHtml = t.getFullYear() + '-';
                timeHtml += t.getMonth() < 10 ? '0' + (t.getMonth() + 1) + '-' : (t.getMonth() + 1) + '-';
                timeHtml += t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
                return timeHtml;
            },

            getprogressParam: function (timeType) {
                var stechType = 'wz',
                    aboutStationParam = this.queryStationParams.valueType;
                if (aboutStationParam.indexOf('wz') != -1) {
                    stechType = 'wz';
                } else if (aboutStationParam.indexOf('pc') != -1) {
                    stechType = 'pc';
                } else if (aboutStationParam.indexOf('yc') != -1) {
                    stechType = 'yc';
                } else if (aboutStationParam.indexOf('kh') != -1 || aboutStationParam.indexOf('all') != -1) {
                    stechType = 'kh';
                }
                if (timeType == 'hour') {
                    var gettime = this.getYearmonthday(this.siteParam.result.hour.wzCalcEndTime);
                    if (this.timeControlVal >= gettime) { //判断是否大于竖线的位置时间
                        this.timeControlVal = gettime;
                        initTime.currTime = this.siteParam.result.hour.wzCalcEndTime; //竖线的位置
                    }
                    initTime.currTooltip = this.siteParam.result.hour[stechType + 'CalcEndTime'];
                } else {
                    if (this.timeControlVal > this.siteParam.result.day[stechType + 'CalcEndTime']) {
                        this.timeControlVal = this.siteParam.result.day[stechType + 'CalcEndTime'];
                    } else {
                        this.queryStationList();
                    }
                    initTime.daycurrTime = this.timeControlVal;
                    initTime.daycurrTooltip = this.timeControlVal;
                }
                this.queryStationParams.currentTime = initTime.currTooltip;
            },
            changeprogStatue: function () {
                if (progres01.type) {
                    if (this.queryStationParams.dateType == 2) {
                        this.getprogressParam('hour');
                        getCityTendency();
                    } else {
                        this.getprogressParam('day');
                        getCityTendency();
                    }
                    reSiteTime(this.queryStationParams.dateType, this.timeControlVal);
                }
            },
            timeTypeChange: function (type) {
                stopAllPlay(); //暂停播放进度
                var _self = this,
                    temp_type = (type == 'hour') ? "2" : "3";
                _self.queryStationParams.dateType = temp_type;
                _self.mapControl.timeChange.isActive = false;
                _self.mapControl.timeChange.noActive = true;
                //监听的部分
                if (type == "hour") {
                    if (_self.mapControl.timeForhour.isActive) {
                        return;
                    }
                    _self.mapControl.timeForhour.isActive = true;
                    _self.mapControl.timeForday.isActive = false;
                    _self.getCalcDataTime('hour');
                } else if (type == "day") { //如果为天，
                    if (_self.mapControl.timeForday.isActive) {
                        return;
                    }
                    _self.mapControl.timeForhour.isActive = false;
                    _self.mapControl.timeForday.isActive = true;
                    initProgressDay();
                    _self.getCalcDataTime('day');
                    if (_self.timeControlVal == initTime.conrolTime) {
                        _self.timeControlVal = initTime.prevDayTime; //如果为当前时间将自动切换到：当前时间的上一天
                    }
                }
                reSiteTime(_self.queryStationParams.dateType, _self.timeControlVal); //重置时间
                if (_self.pCloundBtnStatus.status.isActive) { //当“污染云图”按钮的状态为开启状态时，重新叠加云图
                    _self.showCloudWindyInfo();
                }
                if (type == "hour") {
                    $("#progres01").show();
                    $("#progres03").hide();
                    //debugger
                    initTime.currTooltip = new Date(this.timeControlVal).Format("yyyy-MM-dd 00:00:00");
                    _self.queryStationParams.currentTime = initTime.currTooltip;
                    //重置为日期控件的选中日期的00点开始
                    SetProgressTime('progres01', progres01, true);

                } else if (type == "day") {
                    $("#progres01").hide();
                    $("#progres03").show();
                    if (_self.queryStationParams.pollutionType == "aqi2") {
                        _self.queryStationParams.pollutionType == "aqi";
                    }
                    _self.queryStationParams.currentTime = initTime.hour.end;
                    SetProgressTime('progres03', progres03, false);
                }
                _self.closeTabtag(); //关闭详情
                _self.closeInfoBox(); //关闭旗帜
            },
            autoCalcModelheight: function () {
                var _self = this;
                var scrrenHeight = $(window).height(),
                    leftHeight = scrrenHeight - 62;
                this.leftblockNum = parseInt(leftHeight / 85);
                $('.ui-rh-circle').each(function (index, item) {
                    if (index >= _self.leftblockNum) {
                        $(this).hide();
                    }
                });
                var rightHeight = scrrenHeight - 608;
                $('#windyroseEchart').css("height", rightHeight + "px");
                $('.map-content').css("height", (scrrenHeight - 75) + 'px');
                $('.map-container').css("height", (scrrenHeight - 65) + 'px');
                $(".ui-rh-leftpane").css("height", leftHeight + "px");
                //右侧第三个tab
                $("#hourFor48char").css("height", (scrrenHeight - 385) / 2 + "px");
                $("#particulateschar").css("height", (scrrenHeight - 385) / 2 + "px");
                //右侧tab 2
                $("#stationList").css("height", (scrrenHeight - 110) + "px");

            },
            muiltCircle: function () { //判断“展开”按钮是否显示
                var scrrenHeight = $(window).height() - 40;
                if (scrrenHeight <= 696) //屏幕高和圆圈的总高对比
                {
                    this.isShowshowBtn = true;
                }
            },
            resiteleftWidth: function () {
                this.leftpane.noActive = !this.leftpane.noActive;
                this.leftpane.isActive = !this.leftpane.isActive;
                this.mappane.noActive = !this.mappane.noActive;
                this.mappane.isActive = !this.mappane.isActive;
                stopAllPlay();
            },
            recalcroseCharH: function () {

            },
            //微站城市数据API加六参
            getCityWzLast: function () {
                var _self = this;
                $.getJSON('../../json/airMonitoring/wzlast.json', {
                    cityId: _self.currentCity
                }, function (json) {
                    if (json.erroCode == 2000) {
                        if (json.result) {
                            _self.circleValueArr[0] = json.result.aqi2;
                            _self.circleLevelArr[0] = json.result.aqi2Level;
                            _self.circleValueArr[1] = json.result.aqi;
                            _self.circleLevelArr[1] = json.result.aqiLevel;
                            _self.circleValueArr[2] = json.result.pm25;
                            _self.circleLevelArr[2] = json.result.pm25Level;
                            _self.circleValueArr[3] = json.result.pm10;
                            _self.circleLevelArr[3] = json.result.pm10Level;
                            _self.circleValueArr[4] = json.result.so2;
                            _self.circleLevelArr[4] = json.result.so2Level;
                            _self.circleValueArr[5] = json.result.no2;
                            _self.circleLevelArr[5] = json.result.no2Level;
                            _self.circleValueArr[6] = json.result.co;
                            _self.circleLevelArr[6] = json.result.coLevel;
                            _self.circleValueArr[7] = json.result.o3;
                            _self.circleLevelArr[7] = json.result.o3Level;
                            _self.aqiFirst2 = json.result.aqiFirst2;
                            console.log( _self.circleLevelArr)
                        }
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            initcityMonthEchart: function () {
                var _self = this;
                $.getJSON($.backendApiPath + '/citydata/avgmonth/chart', {
                    cityId: _self.currentCity
                }, function (json) {
                    if (json.erroCode == 2000) {
                        initCityMonthCompareChar('cityMonthEchart', json.result)
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            //加载站点详情
            loadStationDataDetail: function (stationId, sTechType, rtcTime) {
                var _self = this;
                var timeType = 'hour'; //小时
                if (_self.queryStationParams.dateType == 2) {
                    timeType = 'hour';
                } else if (_self.queryStationParams.dateType == 3) {
                    timeType = 'day';
                }
                ajax_get('../../json/airMonitoring/station_detail.json', {
                    stationId: stationId,
                    sTechType: sTechType,
                    rtcTime: rtcTime
                }, function (json) {
                    var result = json.result;
                    $(".ui-rh-tabs-show li:eq(2)").show();
                    _self.stationDetail.stationId = result.stationId;
                    _self.stationDetail.aqi = result.aqi == null ? "--" : result.aqi;
                    _self.stationDetail.stationName = result.stationName;
                    _self.stationDetail.stationTypeName = result.stationTypeName;
                    _self.stationDetail.addr = result.addr;
                    _self.stationDetail.tvoc = result.tvoc == null ? "--" : result.tvoc;
                    _self.stationDetail.co2 = result.co2 == null ? "--" : result.co2;
                    _self.stationDetail.temperature = result.temperature == null ? "--" : result.temperature;
                    _self.stationDetail.humidity = result.humidity == null ? "--" : result.humidity;
                    _self.stationDetail.windPower = result.windPower == null ? "--" : result.aqi;
                    _self.stationDetail.windDirection = result.windDirection == null ? "--" : result.windDirection;
                    _self.stationDetail.pressure = result.pressure == null ? "--" : result.pressure;
                    _self.initsamePolltuionbar(result);
                });

                _self.initDetail48HourChar(stationId, sTechType, _self.curcurrentTime);
            },
            initAirMap: function () {
                var _self = this;
                _self.map = initMyBMapWithMaxMin('allmap', _self.cityName, _self.zoom, 8, 16);
                _self.map.setMapStyle({
                    styleJson: myStyleJson
                });
                _self.addMapCloudImg(); //在地图上添加一个云图叠加的位置

                //添加区县边界
                $.get ('../../resources/js/airMonitoring/domainbounds/' + _self.currentCity + '_map.json', function (json) {
                    var count = json.length; //行政区域的点有多少个
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(json[i][0], {
                            fillColor: '',
                            // icons:[icons],
                            strokeWeight: 1.5, //设置多边形边线线粗
                            strokeOpacity: 1, //设置多边形边线透明度0-1
                            StrokeStyle: "dashed", //设置多边形边线样式为实线或虚线，取值 solid 或 dashed
                            strokeColor: "#7c91d4" //设置多边形边线颜色
                            // enableMassClear: false
                        });
                        _self.map.addOverlay(ply); //添加覆盖物
                    }
                });

                function checkhHtml5() {
                    if (typeof(Worker) === "undefined") {
                        if (navigator.userAgent.indexOf("MSIE 9.0") <= 0) {
                            alert("定制个性地图示例：IE9以下不兼容，推荐使用百度浏览器、chrome、firefox、safari、IE10");
                        }
                    }
                }

                checkhHtml5();
            },
            queryStationList: function () {
                var _self = this;
                if (_self.map == null) {
                    _self.initAirMap();
                }
                _self.clearMarkers();
                var url =  "../../json/airMonitoring/stations.json";
                var contentType = 'application/json; charset=UTF-8';
                post_ajax(url, JSON.stringify(_self.queryStationParams), "加载", contentType, function (response) {
                    if (response.erroCode == 2000) {
                        _self.curcurrentTime = response.result.currentTime;
                        var data = response.result.data;
                        _self.staionRankList = [];
                        _self.clearMarkers();
                        if (data.length > 0) {
                            $.each(data, function (n, station) {
                                _self.staionRankList.push({
                                    stationName: station.stationName,
                                    stationId: station.stationId,
                                    districtName: station.districtName,
                                    stationTypeName: station.stationTypeName,
                                    leftClass: "stationLbg" + (station.baseLevel == null ? "-1" : station.baseLevel),
                                    stechType: station.stechType,
                                    curcurrentTime: _self.curcurrentTime,
                                    pvalue: station.pvalue,
                                    dd2: showUpper(_self.queryStationParams.pollutionType) + '：' + station.pvalue
                                });
                                _self.staionRankList = sortFun(_self.staionRankList, _self.queryStationParams.order);
                                if (station.lat != null && station.lng != null) {
                                    _self.mkMarkers(station);
                                }
                            });
                            _self.showMarkers();
                        }
                    } else if (response.erroCode == 3000) {
                        layer.msg(response.erroMsg);
                        return false;
                    }
                });
            },
            addCircle: function () {
                var _self = this;
                var station = _self.clkMarker.obj;

                if (station == null) return;
                if (_self.cirCleMarker != null) {
                    _self.map.removeOverlay(_self.cirCleMarker);
                    _self.cirCleMarker = null;
                }
                var point = new BMap.Point(station.lng, station.lat);

                var level = station.baseLevel == null ? "-1" : station.baseLevel;
                var color = getCircleColor(level)
                _self.cirCleMarker = new BMap.Circle(point, _self.cirCle, {
                    fillColor: color,
                    strokeColor: color,
                    strokeWeight: 1,
                    fillOpacity: 0.25,
                    strokeOpacity: 1
                }); //设置覆盖物的参数，中心坐标，半径，颜色
                _self.map.addOverlay(_self.cirCleMarker); //在地图上显示圆形覆盖物

            },
            mkMarkers: function (station) {
                var _self = this;
                var markIcon = _self.mkMarkerIcon(station);
                var point = new BMap.Point(station.lng, station.lat);
                var marker = new BMap.Marker(point, {
                    icon: markIcon
                }); // 创建标注
                marker.obj = station;

                marker.addEventListener("click", function () {
                    _self.showStationDetailTab();
                    _self.loadStationDataDetail(station.stationId, station.stechType, _self.curcurrentTime);
                    // _self.clearClkMarker();
                    _self.clkMarker = marker;
                    _self.map.centerAndZoom(point, 15);
                    _self.iconSize = 20;
                    _self.closeInfoBox(); //关闭旗帜
                    _self.stationIdOrName = ''; //清除输入框
                    _self.addCircle();
                    _self.surveyUrl = $.ctx + '/stationAnalysis/surveyData?stationId=' + station.stationId + '&stationType=' + station.stationType + "&stechType=" + station.stechType; //添加页面跳转的链接参数
                    stopAllPlay(); //暂停播放进度

                });

                var level = station.baseLevel == null ? "-1" : station.baseLevel;
                _self.markers[level].push(marker);
            },
            clearClkMarker: function () {
                var _self = this;
                if (_self.clkMarker != null) { //如果已经点击过其它站点则清除
                    _self.map.removeOverlay(_self.clkMarker);
                    // _self.clkMarker.setIcon(_self.mkMarkerIcon(_self.clkMarker.obj));
                    // _self.map.addOverlay(_self.clkMarker);
                    _self.clkMarker = null;
                }

                if (_self.cirCleMarker != null) {
                    _self.map.removeOverlay(_self.cirCleMarker);
                    _self.cirCleMarker = null;
                }
            },
            mkMarkerIcon: function (station) {
                var _self = this;
                var level = station.baseLevel == null ? "-1" : station.baseLevel;
                var _showLev = level;
                if (level == "-1") {
                    _showLev = 7
                }
                var _stype = "wz";

                if (station.stechType == "98") {
                    _stype = "kh";
                }
                if (station.stechType == "101") {
                    _stype = "yc";
                }
                if (station.stechType == "99") {
                    _stype = "gk";
                }
                var _picSize = _self.iconSize;
                if (_picSize > 16) {
                    _picSize = 24;
                }

                var icon_path =  "../../resources/img/airdata/marker/" + _stype + _picSize + "-" + _showLev + ".png";
                var size = _self.iconSize;
                //国控图标单独处理
                if (_stype == "gk") {
                    if (_picSize == 16) {
                        size = 24;
                    }
                    if (_picSize == 24) {
                        size = 32;
                    }
                }
                return new BMap.Icon(icon_path, new BMap.Size(size, size), {
                    imageSize: new BMap.Size(size, size)
                });

            },
            mkWaterMarkerIcon: function (station) { //创建水波纹图标
                var _self = this;
                var _showLev = station.baseLevel == null ? "-1" : station.baseLevel;

                if (_showLev == "-1") {
                    _showLev = 7
                }
                var icon_path =  "../../resources/img/airdata/new/" + _showLev + ".gif";
                var size = 120;
                return new BMap.Icon(icon_path, new BMap.Size(size, size), {
                    imageSize: new BMap.Size(size, size)
                });

            },
            showClkMarker: function () { //
                var _self = this;
                if (_self.clkMarker != null) {
                    var sid = _self.clkMarker.obj.stationId;
                    $.each(_self.showLevel, function (key, isShow) { //遍历所有 marker取出 stationId相等的station
                        var arr = _self.markers[key]; //取出要某一类的marker
                        if (arr.length > 0) {

                            if (arr.length > 0) {
                                $.each(arr, function (i, mk) {
                                    var st = mk.obj;
                                    if (st.stationId == sid) {
                                        _self.map.removeOverlay(mk);
                                        mk.setIcon(_self.mkWaterMarkerIcon(st));
                                        _self.map.addOverlay(mk);
                                    }
                                })
                            }

                        }
                    });

                }
            },
            showMarkers: function () {
                var _self = this;
                $.each(_self.showLevel, function (key, isShow) { //遍历是否显示某一类站点信息				//debugger
                    var arr = _self.markers[key]; //取出要添加的marker
                    if (arr) {
                        if (isShow) { //如果 显示，则添加到地图上
                            if (arr.length > 0) {
                                $.each(arr, function (i, mk) {
                                    _self.map.removeOverlay(mk);

                                    mk.setIcon(_self.mkMarkerIcon(mk.obj));
                                    _self.map.addOverlay(mk);
                                })
                            }
                        } else {
                            if (arr.length > 0) {
                                $.each(arr, function (i, mk) {
                                    _self.map.removeOverlay(mk);
                                })
                            }
                        }
                    }
                });
            },
            clearMarkers: function () {
                var _self = this;
                $.each(_self.markers, function (key, values) {
                    if (values.length > 0) {
                        $.each(values, function (i, val) {
                            _self.map.removeOverlay(val);
                        });
                    }
                    _self.markers[key] = [];
                });
            },
            changeShowLevel: function (level, leveltype) {
                stopAllPlay();
                var _self = this;
                _self.showLevel[level] = !_self.showLevel[level]; //改当前状态
                _self.showMarkers();
                this.pollutionBtnStatus[leveltype].isActive = !this.pollutionBtnStatus[leveltype].isActive;
                this.pollutionBtnStatus[leveltype].noActive = !this.pollutionBtnStatus[leveltype].noActive;
            },
            showpCloundPicture: function () {
                this.pCloundBtnStatus.status.isActive = !this.pCloundBtnStatus.status.isActive;
                this.pCloundBtnStatus.status.noActive = !this.pCloundBtnStatus.status.noActive;
            },
            showCloudWindyInfo: function () {
                var _self = this;
                var interval_type = 'hour'; //小时
                if (_self.queryStationParams.dateType == 2) {
                    interval_type = 'hour';
                } else if (_self.queryStationParams.dateType == 3) {
                    interval_type = 'day';
                }
                var stationtype = _self.rPanelSType,
                    arithmetic = "Neareast_RBF";
                var imgurl = _self.cloudImg + _self.currentCity + "/" + stationtype + "/" +
                    _self.queryStationParams.pollutionType + "/" + arithmetic + "/" + interval_type +
                    "/" + _self.getPicTimeFmt(_self.queryStationParams.currentTime) + ".png";
                _self.imageLayer.V.parentNode.style.zIndex = '0'; //修改污染云图zIndex 层级
                //imgurl = 'http://58.83.189.232:18090/370800/wz-kh/pm25/Neareast_RBF/hour/2018041307.png';
                _self.imageLayer.setImageURL(imgurl);
            },
            getPicTimeFmt: function (timeParam) {
                var _self = this;
                if (_self.queryStationParams.dateType == 2) {
                    return new Date(timeParam).Format("yyyyMMddHH");
                } else {
                    return new Date(timeParam).Format("yyyyMMdd");
                }
            },
            addMapCloudImg: function () {
                var _self = this;
                $.get("../../json/airMonitoring/city_bound_370800.json", function (data) {
                    var h = new BMap.Point(data.result.lowLng, data.result.lowLat),
                        m = new BMap.Point(data.result.highLng, data.result.highLat);
                    _self.imageLayer = new BMap.GroundOverlay(new BMap.Bounds(h, m), {
                        opacity: 0.6
                    });
                    _self.map.addOverlay(_self.imageLayer);
                });
            },
            getCloudImg: function () {
                getCloudImg();
            },
            tabtagClick: function () {
                var _self = this;
                $(".ui-rh-tabs-content-show .ui-tabcontent").hide();
                $(".ui-rh-tabs-content-show .ui-tabcontent").hide();
                $(".ui-rh-tabs-show li:eq(2)").hide();
                $(".ui-rh-tabs-content-show div:first").fadeIn();
                $('.ui-rh-tabs-show a').click(function (e) {
                    e.preventDefault();
                    _self.openActiveTab.isActive = false;
                    _self.openActiveTab.noActive = true;
                    $(".ui-rh-tabs-content-show .ui-tabcontent").hide();
                    $(".ui-rh-tabs-show li").attr("class", "");
                    $(this).parent().attr("class", "current");
                    $('#' + $(this).attr('targetName')).fadeIn();
                });
            },
            stationIsCover: function () {
                stationIsCover();
                stopAllPlay(); //暂停播放进度
            },
            initTopten: function () {
                realHisTop10Char();
            },
            initWeatherForecastEchart: function () {
                var _self = this;
                $.getJSON('../../json/airMonitoring/airforecast.json', {
                    domainId: _self.currentCity
                }, function (json) {
                    if (json.erroCode == 2000) {
                        initWeatherForecastChar('cityMonthEchart', json.result)
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            initwindyroseEchart: function () {
                var _self = this;
                $.getJSON( '../../json/airMonitoring/windyroseEchart.json', {
                    domainId: _self.currentCity
                }, function (json) {
                    if (json.erroCode == 2000) {
                        initWindyroseEchart('windyroseEchart', json.result);
                    } else {
                        layer.msg('网络错误', function () {
                        });
                    }
                });
            },
            initsamePolltuionbar: function (data) {
                realHistInitsamePolltuionbar(data);
            },
            //48小时气体和颗粒物浓度
            initDetail48HourChar: function (stationId, sTechType, rtcTime) {
                var _self = this;
                var timeType = 'hour'; //小时
                if (_self.queryStationParams.dateType == 2) {
                    timeType = 'hour';
                } else if (_self.queryStationParams.dateType == 3) {
                    timeType = 'day';
                }
                ajax_get($.backendApiPath + '/stationdata/range/' + timeType, {
                    stationId: stationId,
                    sTechType: sTechType,
                    rtcTime: rtcTime,
                    hour: 48
                }, function (json) {
                    if (json.erroCode == 2000) {
                        var result = json.result; //污染浓度48小时
                        if (result != null) {

                            _self.char.result = result;
                            _self.char.rtcTime = rtcTime;
                            _self.char.sTechType = sTechType;
                            _self.char.stationId = stationId;

                            initAQI48HoursChar('hourFor48char', result.rtcTime, result[_self.ptype], _self.ptype);

                            //颗粒物48小时
                            initParticulates48Char('particulateschar', result);
                        } else {
                            disposeChar('hourFor48char');
                            disposeChar('particulateschar');
                        }
                    }
                });
            },
            showhourFor48char: function () {
                var _self = this;
                initAQI48HoursChar('hourFor48char', _self.char.result.rtcTime, _self.char.result[_self.ptype], _self.ptype);
            },
            mapTypeChange: function () { //切换地图类型
                var _self = this;
                if (_self.mapType == 1) {
                    _self.mapType = 2
                    _self.weixing();
                } else {
                    _self.mapType = 1;
                    _self.ditu();
                }
                _self.toggleBtnActive('difMap', _self.mapControl);
            },
            ditu: function () {
                this.map.setMapType(BMAP_NORMAL_MAP);
            },
            weixing: function () {
                this.map.setMapType(BMAP_SATELLITE_MAP);
            },
            popToolbox: function () {
                var _self = this;
                _self.toggleBtnActive('mapTool', _self.mapControl);
                _self.showToolBox = !_self.showToolBox;
                stopAllPlay(); //暂停播放进度
            },
            traffic: function () { //显示交通
                var _self = this;
                if (_self.map == null) {
                    _self.initAirMap();
                }
                _self.toggleBtnActive('mapLight', _self.mapControl);
                _self.toggleBtnActive('mapTool', _self.mapControl);

                if (!_self.showToolBox) {
                    _self.showToolBox = true;
                }

                if (_self.ctrl != null) {
                    _self.ctrl.remove();
                    _self.ctrl = null;
                    return;
                }
                _self.ctrl = new BMapLib.TrafficControl();
                _self.map.addControl(_self.ctrl);
                _self.ctrl.showTraffic();

            },
            distanceTool: function () { //显示测距工具
                var _self = this;
                if (_self.map == null) {
                    _self.initAirMap();
                }
                _self.toggleBtnActive('mapRuler', _self.mapControl);
                _self.toggleBtnActive('mapTool', _self.mapControl);

                if (!_self.showToolBox) {
                    _self.showToolBox = true;
                }
                if (_self.distanceToolobj != null) {
                    _self.distanceToolobj.close();
                    _self.distanceToolobj = null;
                    return;
                }
                _self.distanceToolobj = new BMapLib.DistanceTool(_self.map);
                _self.distanceToolobj.open();
            },
            zoomUp: function () {
                var _self = this;
                if (_self.map == null) {
                    _self.initAirMap();
                }
                var zoom = _self.map.getZoom()
                _self.zoom = zoom + 1;
                _self.map.setZoom(_self.zoom);
            },
            zoomDown: function () {
                var _self = this;
                if (_self.map == null) {
                    _self.initAirMap();
                }
                var zoom = _self.map.getZoom()
                _self.zoom = zoom - 1;
                _self.map.setZoom(_self.zoom);
            },
            toggleBtnActive: function (type, arr) { //多按钮状态切换
                arr[type].isActive = !arr[type].isActive;
                arr[type].noActive = !arr[type].noActive;
            },
            openDrawingManager: function () {
                this.drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
                this.drawingManager.open();
            },
            initDrawingManager: function () {
                initDrawingManager();
            },
            closeResultModal: function () {
                this.clearSearch();
            },
            clearSearch: function () {
                this.resultData = [];
                this.drawingSearch = {
                    slt_overlays: [],
                    slt_stations_name: [],
                    slt_stations_id: []
                };
            },

            //获取用户所有城市
            initAllCity: function () {
                this.cityName = parent.cityName;
                this.currentCity = parent.cityId;
                this.initAirMap();
            },
            popStationtypebox: function () {
                this.mapControl.mapStaiontype.isActive = !this.mapControl.mapStaiontype.isActive;
                this.mapControl.mapStaiontype.noActive = !this.mapControl.mapStaiontype.noActive;

                this.showSelectStationType();
                stopAllPlay();
            },
            showSelectStationType: function () {
                var _self = this;
                var valueType = _self.queryStationParams.valueType;// = 'all';
                var stationType = _self.queryStationParams.stationType;// = '-1';

                $(".list-station *").removeClass("active");
                $(".list-station .dd span").removeClass("bluefont");

                if (_self.queryStationParams.pollutionType == "pm10") {
                    $(".list-station .dl .yc").attr("disabled", "disabled");
                }
                if (valueType == "all") {
                    _self.dealStationTypeSel();
                } else {
                    $("#type_" + valueType).addClass("active");
                    if (stationType == -1) {
                        _self.selt_cage(valueType);
                    } else {
                        $("#" + valueType + "_" + stationType).addClass("bluefont");
                    }
                }


            },
            showpCloundDownload: function () {
                this.mapControl.cloundDownload.isActive = !this.mapControl.cloundDownload.isActive;
                this.mapControl.cloundDownload.noActive = !this.mapControl.cloundDownload.noActive;
                stopAllPlay(); //暂停播放进度
            },
            timePaneChange: function () {
                this.mapControl.timeChange.isActive = !this.mapControl.timeChange.isActive;
                this.mapControl.timeChange.noActive = !this.mapControl.timeChange.noActive;

                stopAllPlay(); //暂停进度条的播放
            },
            maptoolOther_click: function () {
                var _self = this;
                $(document).bind('click', function (e) {
                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;
                    //debugger
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && elem.id == 'drop-down-stationtype' ||
                            elem.id && elem.id == 'mapTool' ||
                            elem.id && elem.id == 'pollutionSelectPanel' ||
                            elem.id && elem.id == "mapStationtype") {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    airMonitoringVM.mapControl.mapStaiontype.noActive = true;
                    airMonitoringVM.mapControl.mapStaiontype.isActive = false;

                    airMonitoringVM.mapControl.mapTool.noActive = true; // 地图工具
                    airMonitoringVM.mapControl.mapTool.isActive = false; //
                    airMonitoringVM.showToolBox = true; //

                    airMonitoringVM.psdropListShowBtn.pSelectIsShow = false; //展示右侧的污染源选择列表
                    // airMonitoringVM.psdropListShowBtn.status.isActive = false; //当前的按钮的活动状态
                    // airMonitoringVM.psdropListShowBtn.status.noActive = true; //当前的按钮的活动状态
                    airMonitoringVM.psdropListShowBtn.pSelectHtmlIsShow = false;

                });
            },
            stationTypeOther_click: function () {
                var _self = this;
                $(document).bind('click', function (e) {
                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;
                    //debugger
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && elem.id == 'drop-down-stationtype' || elem.id && elem.id == "mapStationtype") {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    airMonitoringVM.mapControl.mapStaiontype.noActive = true; //展示右侧的污染源选择列表 (隐藏)
                    airMonitoringVM.mapControl.mapStaiontype.isActive = false; //展示右侧的污染源选择列表 (隐藏)
                });
            },
            pollutionSourceOther_click: function () {
                var _self = this;
                $(document).bind('click', function (e) {
                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;
                    //debugger
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && elem.id == 'pollutionSelectPanel' || elem.id && elem.id == "mapPpollutionS") {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    airMonitoringVM.psdropListShowBtn.status.noActive = true; //展示右侧的污染源选择列表 (隐藏)
                    // airMonitoringVM.psdropListShowBtn.status.isActive = false; //展示右侧的污染源选择列表 (隐藏)
                });
            },
            timedropdownOther_click: function () {
                var _self = this;
                $(document).bind('click', function (e) {
                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;
                    //debugger
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && elem.id == 'drop-down-maptime' || elem.className && elem.id == "mapTime") {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    airMonitoringVM.mapControl.timeChange.noActive = true; //展示右侧的污染源选择列表 (隐藏)
                });
            },
            //污染源部分
            showPollutionselect: function () { //点击“污染源”按钮对选择下拉菜单的操作
                // stopAllPlay();
                this.psdropListShowBtn.pSelectIsShow = !this.psdropListShowBtn.pSelectIsShow; //展示右侧的污染源选择列表
                this.psdropListShowBtn.status.isActive = !this.psdropListShowBtn.status.isActive; //当前的按钮的活动状态
                this.psdropListShowBtn.status.noActive = !this.psdropListShowBtn.status.noActive; //当前的按钮的活动状态
                if (this.psdropListShowBtn.pSelectHtmlIsShow) {
                    this.psdropListShowBtn.pSelectHtmlIsShow = false;
                }
                if (this.psdropListShowBtn.pSelectIsShow) {
                    this.psdropListShowBtn.status.isActive = true;
                    this.psdropListShowBtn.status.noActive = false;
                }
                stopAllPlay(); //暂停播放进度
            },
            showPolltionPanel: function () {
                this.psdropListShowBtn.pSelectHtmlIsShow = !this.psdropListShowBtn.pSelectHtmlIsShow;
                //this.other_click_hide();
            },
            pSourceCheckboxSelect: function (id, name, domEle) {
                var code = id,
                    value = name,
                    isLocal = (code == value),
                    hasChk = domEle.target.checked,
                    vcity = parent.cityId;
                if (!isNull(code)) {
                    if (hasChk) { //选 中
                        if (isLocal) {
                            add_baidu_pollution_markers(code);
                        } else {
                            if (value == "POI") {
                                getPointsCollection();
                            } else {
                                query_pollutions_markers(code);
                            }
                        }
                    } else { //清除 选 中
                        if (value == "POI") { // 清除海量点
                            cleanPointsCollection();
                        } else { // 清除本地 污染点
                            clear_map_pollutions_markers(code, isLocal);
                        }
                    }
                }
            },
            clearPollutions: function () {
                var _self = this;
                cleanPointsCollection();
                $.each(_self.psdropListHtml, function (i, values) {
                    if (values.name == "重点源") {
                        var child = values.child;
                        $.each(child, function (n, item) {
                            clear_map_pollutions_markers(item.code, false);
                        });
                    }
                })
            },
            closeTabtag: function (event) {
                var _self = this;
                if (event) event.stopPropagation();
                //站点详情显示时才切换到top 10
                if (!$('#tab3').is(':hidden')) {
                    // $("#stationListTab").click();
                    $('#tab1').show();
                    $(".ui-rh-tabs-show li").removeClass('current');
                    $(".ui-rh-tabs-show li:eq(0)").attr('class', 'current');
                    _self.openActiveTab.isActive = true;
                    _self.openActiveTab.noActive = false;
                }
                $('#tab3').hide();
                $(".ui-rh-tabs-show li:eq(2)").hide();
                _self.clearClkMarker();
            },
            //站点类型选则控制
            fillArray: function (arr, data, parentName) {
                for (var i = 0; i < data.length; i++) {
                    var code = {
                        id: data[i].code,
                        name: data[i].name,
                        pname: parentName
                    };
                    arr.push(code);
                }
            },
            dealStationTypeSel: function () { //判断传递的站点类型，并勾选对应站点
                if (this.dropDownstechType) {
                    //重置全选项
                    if (this.dropDownstechType.indexOf('6010') != -1 || this.dropDownstechType.indexOf('1010') != -1) //微站
                    {
                        this.wz_all = true;
                        this.clk_wz_all();
                    }
                    if (this.dropDownstechType.indexOf('99') != -1) { //爬虫
                        this.pc_all = true;
                        this.clk_pc_all();
                    }
                    if (this.dropDownstechType.indexOf('98') != -1) { //考核
                        this.kh_all = true;
                        this.clk_kh_all();
                    }
                    if (this.queryStationParams.pollutionType == "pm10") {
                        if (this.dropDownstechType.indexOf('101') != -1) { //扬尘
                            this.yc_all = true;
                            this.clk_yc_all();
                        }
                    } else {
                        this.yc_all = false;
                        this.addActivetag('yc', false);
                        $(".list-station .dl .yc").attr("disabled", "disabled");

                    }
                }
            },
            initPopStationList: function () {
                var that = this;
                ajax("../../json/airMonitoring/stationType.json" , {
                    parents: ""
                }, function (data) {
                    //debugger
                    if (data != null) {
                        var wz = data.wz; //微站
                        if (typeof(wz) != undefined && wz.length > 0) {
                            that.fillArray(that.wzstationList, wz, '微站');
                            for (var i = 0; i < that.wzstationList.length; i++) {
                                var stationId = that.wzstationList[i].id.toString();
                                that.wzli.push(stationId);
                            }
                        }
                        var kh = data.kh; //考核站
                        if (typeof(kh) != undefined && kh.length > 0) {
                            that.fillArray(that.khstationList, kh, '考核');
                        }
                        var pc = data.pc; //爬虫
                        if (typeof(pc) != undefined && pc.length > 0) {
                            that.fillArray(that.pcstationList, pc, '爬虫');
                            for (var i = 0; i < that.pcstationList.length; i++) {
                                var stationId = that.pcstationList[i].id.toString();
                                that.pcli.push(stationId);
                            }
                        }
                        var yc = data.yc; //扬尘
                        if (typeof(yc) != undefined && pc.length > 0) {
                            that.fillArray(that.ycstationList, yc, '扬尘');
                            that.ycli.push(that.ycstationList[0].id.toString());
                        }
                        var district = data.district; //区域
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
                    }
                });
                that.ptypeList = [];
                $.get("../../json/airMonitoring/station_detail.json", function (data) {
                    that.ptypeList = data;
                });
            },
            gernerateId: function (type, id) {
                return type + "_" + id;
            },
            clk_wz_all: function () {
                var _self = this;

                if (_self.wz_all) {
                    _self.addActivetag('wz', true);
                } else {
                    _self.addActivetag('wz', false);
                }
            },
            clk_pc_all: function () {
                var _self = this;
                if (_self.pc_all) {
                    _self.addActivetag('pc', true);
                } else {
                    _self.addActivetag('pc', false);
                }
            },
            clk_kh_all: function () {
                var _self = this;
                if (_self.kh_all) {
                    _self.addActivetag('kh', true);
                } else {
                    _self.addActivetag('kh', false);
                }
                //并同时取消其他的选中状态（大分类和小分类）
            },
            clk_yc_all: function () {
                var _self = this;

                if (_self.yc_all && _self.flag) {
                    _self.addActivetag('yc', true);
                } else {
                    _self.addActivetag('yc', false);
                }
            },
            addActivetag: function (str, fg) {
                if (fg) {
                    $(".list-station ." + str).addClass("active");
                    $(".list-station ." + str + " .dd span").addClass("bluefont");
                } else {
                    $(".list-station ." + str).removeClass("active");
                    $(".list-station ." + str + " .dd span").removeClass("bluefont");
                }
            },
            //全选
            selallItem: function (item, str) {
                var _self = this;
                _self.selectStationTpye.valueType = 'all';
                _self.selectStationTpye.stechType = '-1';
                _self.selectStationTpye.stationType = '-1';
                _self.dropDownstechType = '6010 99 98 101';
                _self.selectStationTpye.pnametemp = '';
                _self.selectStationTpye.nametemp = '';
                _self.isDesablePClound = false; //开启  污染云图的可用状态
                _self.rPanelSType = "wz-kh"; //记录下当前的站点类型
                _self.dealStationTypeSel();

            },
            //单选选
            selsingleItem: function (item, str, event) { //记录单独的站点类型选中项
                select_single_item(item, str, event);
            },
            //选择一类
            selt_cage: function (str) {
                select_item(str);
            },
            cancelStationListView: function () {
                this.mapControl.mapStaiontype.isActive = false;
                this.mapControl.mapStaiontype.noActive = true;

            },
            StationListView: function () { //站点类型筛选确定
                var _self = this;
                _self.selectStationTpye.pname = _self.selectStationTpye.pnametemp;
                _self.selectStationTpye.name = _self.selectStationTpye.nametemp;
                this.mapControl.mapStaiontype.isActive = false;
                this.mapControl.mapStaiontype.noActive = true;
                this.initQueryStationParams();
                _self.closeTabtag(); //关闭圈圈
                _self.closeInfoBox(); //关闭旗帜
                this.changeprogStatue();//更改进度条的站点类型后进度条的显示
                this.queryStationList();
            },
            clearStationType: function (flag) {//右侧站点列表关闭按钮事件
                var _self = this;
                if (flag == 1) {
                    _self.selectStationTpye.valueType = 'all';
                    _self.selectStationTpye.stechType = '-1';
                    _self.selectStationTpye.stationType = '-1';
                    _self.selectStationTpye.pnametemp = '';
                    _self.selectStationTpye.nametemp = '';
                    _self.selectStationTpye.pname = '';
                    _self.selectStationTpye.name = '';
                    //设置默认值（微站爬虫考核置为选择状态
                    this.wz_all = true;
                    this.pc_all = true;
                    this.kh_all = true;
                    this.clk_wz_all();
                    this.clk_pc_all();
                    this.clk_kh_all();
                    //判断是否污染洛渡为pm10，如果是，扬尘为选中状态
                    if (this.queryStationParams.pollutionType == "pm10") {
                        this.yc_all = true;
                        this.clk_yc_all();
                    } else {
                        this.yc_all = false;
                        this.clk_yc_all();
                    }
                } else if (flag == 2) {
                    _self.selectStationTpye.districtName = "";
                    _self.selectStationTpye.district = "-1";
                }


                _self.initQueryStationParams();
                _self.queryStationList();
                stopAllPlay();
            },
            initQueryStationParams: function () {
                var _self = this;
                _self.queryStationParams.valueType = _self.selectStationTpye.valueType;
                _self.queryStationParams.stechType = _self.selectStationTpye.stechType;
                _self.queryStationParams.stationType = _self.selectStationTpye.stationType;
                _self.queryStationParams.district = _self.selectStationTpye.district
                var districtObj = _self.districtList.find(function (option) {
                    return option.id == _self.selectStationTpye.district;
                });
                _self.selectStationTpye.districtName = districtObj == null ? '' : districtObj.name;
            },
            initdatepicker: function () {
                var _self = this;
                $('#datetimepicker').datetimepicker({
                    lang: 'ch',
                    timepicker: false,
                    format: 'Y-m-d',
                    formatDate: 'Y/m/d',
                    onSelectDate: function (ct, $i) {
                        ct = ct.dateFormat('Y-m-d');
                        airMonitoringVM.timeControlVal = ct;
                        airMonitoringVM.changeprogStatue();
                    }
                });
            },
            showDatetimepicker: function () {
                $('#datetimepicker').datetimepicker('show');

            },
            closeDatetimePicker: function () {
                $('#datetimepicker').datetimepicker('hide');
                stopAllPlay();
            }, ////////////////////污染云图下载列表////////////////
            viewPics: function () { //打开差值图预览窗口
                // this.isshowAllDownloadBtn = false; //隐藏“全部选中污染云图按钮”
                ////////////按钮状态样式切换//////////
                this.pCloundDownloadStatus.isActive = !this.pCloundDownloadStatus.isActive;
                this.pCloundDownloadStatus.noActive = !this.pCloundDownloadStatus.noActive;
                this.clearPicsModal();
                this.getCloudDownLoadImg();
                stopAllPlay(); //暂停播放进度
            },
            getCloudDownLoadImg: function () {
                var _self = this;
                ajax_get($.backendApiPath + "/config/cloudimg", {}, function (data) {
                    if (data.erroCode == 2000) {
                        _self.cloudImg = data.result;
                    } else {
                        _self.cloudImg = "url_error"
                    }
                    _self.appendDownImgHtml();
                });
            },
            appendDownImgHtml: function () {
                showDownLoadHtml();
            },
            scrollLoadPic: function (totalCount) {
                scrollPics();
            },
            appendrealTable: function (showCount) { //创建显示图片
                appendTable(showCount);
            },
            picClk: function () { //差值弹窗 图片选中效果
                clickCloudPicture();
            },
            closePicsModal: function () {
                ///////重置污染云图下载按钮的展示样式
                this.pCloundDownloadStatus.isActive = false;
                this.pCloundDownloadStatus.noActive = true;
                this.clearPicsModal();
                this.scrollCont = 0;
                this.showMsg = true;
                $("#dvalueModal").modal('hide');
            },
            clearPicsModal: function () {
                $("#pic_scroll").html(""); //清空所有图片
                $("#picsTitle").html(""); //标题
                $("#zipName").val(""); //下载文件名称
                $("#select_ids").val(""); //所有选中的id
                $("#selCnt").html(""); //展示选中的张数
                $("#selAll").val("全部选中");
            },
            selAll_pic: function () { //全选和取消全选
                seeALLPic();
            },
            showSelectCnt: function () { //展示选中云图
                var i = 0;
                var ids = "";
                $(".pic_selt input[name='pic']").each(function () {
                    if ($(this).val() == "1") {
                        i++;
                        ids += this.id + ",";
                    }
                });
                if (ids.length > 0) {
                    ids = ids.substring(0, ids.length - 1);
                }
                $("#select_ids").val(ids);
                $("#selCnt").html("已选中" + i + "张");
            },
            downLoadPics: function () {
                var files = $("#select_ids").val();
                if (files == "" || files.left < 1) {
                    layer.msg("请选择下进行下载的图片");
                } else {
                    document.getElementById("picDownForm").submit();
                }
            },
            searchStation: function (text) {
                var _self = this;
                _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                _self.stationIdOrName = text;
                _self.clearClkMarker();
            },
            clkSearchStation: function (id, text) {
                var _self = this;
                _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                _self.stationIdOrName = text;
                _self.showSearchStation(id);
                _self.closeTabtag(); //关闭详情
                stopAllPlay();
            },
            showStationDetailTab: function () {
                //隐藏其他
                $(".ui-rh-tabs-show li").attr("class", "");
                $('#tab1').hide();
                $('#tab2').hide();
                $(".ui-rh-tabs-show li:eq(2)").attr("class", "current");
                $('#tab3').show();
            },
            showSearchStation: function (stationId) {
                var _self = this;

                _self.closeInfoBox();
                var station = null;
                $.each(_self.showLevel, function (key, isShow) { //遍历所有 marker取出 stationId相等的station
                    var arr = _self.markers[key]; //取出要某一类的marker
                    if (arr.length > 0) {
                        $.each(arr, function (i, mk) {
                            var st = mk.obj;
                            if (st.stationId == stationId) {
                                station = st;
                                return;
                            }
                        })
                    }
                });
                if (station != null) {
                    _self.infoBox = _self.initInfoBox(station);
                    var point = new BMap.Point(station.lng, station.lat);
                    _self.map.centerAndZoom(point, 13);
                    _self.searchMarker = new BMap.Marker(point);
                    var marker = new BMap.Marker(point);
                    _self.map.setCenter(point);
                    _self.infoBox.open(marker);
                    _self.surveyUrl = $.ctx + '/stationAnalysis/surveyData?stationId=' + station.stationId + '&stationType=' + station.stationType + "&stechType=" + station.stechType; //添加页面跳转的链接参数
                }
                stopAllPlay();
            },
            toSurveyData: function () {
                if (this.surveyUrl != null) {
                    stopAllPlay();
                    window.open(this._self.surveyUrl);
                }
            },
            closeInfoBox: function () {
                var _self = this;
                if (_self.infoBox != null) {
                    _self.infoBox.close();
                    _self.infoBox = null;
                    _self.searchMarker = null;
                }
            },
            initInfoBox: function (station) {
                var _self = this;

                var level = station.baseLevel == null ? "-1" : station.baseLevel;
                if (level == "-1") {
                    level = "7";
                }
                var src =  "../../resources/img/airdata/new/p" + level + ".png";

                var addr = station.addr == null ? '' : station.addr;
                if (addr.length > 36) {
                    addr = addr.substring(0, 35) + "...";
                }
                var html = '<div id="infoBox" class="ibfobox" style="background: url(' + src + ') no-repeat;">' +
                    '    <div class="info-st1"  >' + station.stationName + ' [' + station.stationId + ']</div>\n' +
                    '    <div  class="info-addr">' + station.stationTypeName + '</div>\n' +
                    '    <div class="info-addr">' + addr + '</div>';
                return new BMapLib.InfoBox(_self.map, html, {
                    closeIconMargin: "1px 1px 0 0;position:relative;left: 110px;top: 26px;z-index:999",
                    enableAutoPan: false,
                    align: INFOBOX_AT_TOP,
                    closeIconUrl: "../..//resources/img/close.png"
                });
            },
            checkStationInfo: function (ev) {
                checkStationInfo(ev);
                stopAllPlay(); //暂停播放进度
            },
            switchTable: function () {
                var _self = this;
                _self.flag = false;
                $(".ui-rh-circle ").click(function (e) {
                    $(".ui-rh-circle").removeClass("border-shadow");
                    $(this).addClass("border-shadow");
                    _self.currentPollutionType = this.id;
                    _self.initTopten();

                    if (_self.currentPollutionType != 'pm10'
                        && _self.queryStationParams.stechType == '101') {
                        //扬尘站PM10切换到其他污染类型，选择所有站点类型
                        _self.queryStationParams.valueType = 'all';
                        _self.queryStationParams.stechType = '-1';
                        _self.queryStationParams.stationType = '-1';
                        //同时更新选择站点类型状态
                        _self.selectStationTpye.valueType = 'all';
                        _self.selectStationTpye.stechType = '-1';
                        _self.selectStationTpye.stationType = '-1';
                        _self.selectStationTpye.pnametemp = '';
                        _self.selectStationTpye.nametemp = '';
                        _self.selectStationTpye.pname = '';
                        _self.selectStationTpye.name = '';
                        _self.wz_all = true;
                        _self.kh_all = true;
                        _self.pc_all = true;
                        _self.yc_all = false;
                    }
                    _self.queryStationParams.pollutionType = this.id;
                    if (_self.currentPollutionType == 'pm10') {
                        _self.flag = true;
                    }
                    _self.ptype = this.id;
                    _self.queryStationList();
                    if (_self.map == null) {
                        _self.initAirMap();
                    }
                    _self.map.centerAndZoom(_self.cityName, 10);
                    _self.closeTabtag(); //关闭详情
                    stopAllPlay(); //暂停播放进度
                });
            },
            sortStationInfo: function () {
                this.queryStationParams.order = (this.queryStationParams.order == "desc" ? "asc" : "desc");
                this.sort.asc = !this.sort.asc;
                this.sort.desc = !this.sort.desc;
                stopAllPlay();
            },
            openfullScrren: function () { //开启全屏
                this.openFullmappane.noActive = !this.openFullmappane.noActive;
                this.openFullmappane.isActive = !this.openFullmappane.isActive;
                if (this.openFullmappane.isActive && this.mappane.isActive) {
                    this.openFullmappane.fullIsActive = true;
                } else {
                    this.openFullmappane.fullIsActive = false;
                }
                stopAllPlay(); //暂停播放进度
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
                        itemsCount = itemsCount > 17 ? 17 : itemsCount;
                        //CO SO2 按不同等级改变圆环颜色 1级50%，逐级加10%
                        var itemIdx = Math.round(itemsCount * ((50 + (pollutionInfo.level - 1) * 10) / 100) * t);
                        //No2 1级占40%
                        if (currentBarPie.id == 'p6_barPie' && pollutionInfo.level == 1) {
                            itemIdx = Math.round(itemsCount * (40 / 100) * t);
                        }
                        //AQI AQI2和PM2.5计算方式
                        if (currentBarPie.id == 'p1_barPie' || currentBarPie.id == 'p2_barPie' || currentBarPie.id == 'p3_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 500) * t);
                        }
                        //PM10计算方式
                        if (currentBarPie.id == 'p4_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 600) * t);
                        }
                        //O3计算方式
                        if (currentBarPie.id == 'p8_barPie') {
                            itemIdx = Math.round(itemsCount * (pollutionInfo.toValue / 1000) * t);
                        }
                        itemIdx = itemIdx > 17 ? 17 : itemIdx;
                        var currObj = document.getElementById(currentBarPie.id + 'Item' + itemIdx);
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
        }
    });
    airMonitoringVM.maptoolOther_click();
    airMonitoringVM.stationTypeOther_click();
    airMonitoringVM.pollutionSourceOther_click();
    airMonitoringVM.timedropdownOther_click();
});

function reSiteTime(timeType, startTime) {

    var temp_type = "hour";
    if (timeType == 3) {
        temp_type = "day";
    }
    var time = getNewTime(temp_type, startTime);
    if (temp_type == "hour") {
        //重置进度条控件的起止时间 和  对应大面板的起止时间
        progres01.startTime = time.hour.end;
        progres01.endTime = time.hour.start;
        airMonitoringVM.timeTypeStartEnd.hour.start = time.hour.start;
        airMonitoringVM.timeTypeStartEnd.hour.end = time.hour.end;
        SetProgressTime('progres01', progres01, true); //小面板
        progressTimeStop(progres01.objID, progres01, 'hour');

    } else if (temp_type == "day") { //
        //重置进度条控件的起止时间 和  对应大面板的起止时间
        progres03.startTime = time.day.end;
        progres03.endTime = time.day.start;
        airMonitoringVM.timeTypeStartEnd.day.start = time.day.start;
        airMonitoringVM.timeTypeStartEnd.day.end = time.day.end;
        SetProgressTime('progres03', progres03, false); //小面板
        progressTimeStop(progres03.objID, progres03, 'day');
    }
}

function getNewTime(timeType, time) {
    var myDate = new DateHelp({
            date: new Date(time)
        }),
        initTime = {
            'hour': {
                start: '',
                end: ''
            },
            'day': {
                start: '',
                end: ''
            }
        };
    if (timeType == "hour") {
        initTime.hour.start = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day, 24, 0, 0), 'yyyy-MM-dd hh:mm:ss');
        initTime.hour.end = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 4, 0, 0, 0), 'yyyy-MM-dd hh:mm:ss');
    } else {
        initTime.day.start = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day), 'yyyy-MM-dd');
        initTime.day.end = myDate.formatDate(new Date(myDate.year, myDate.month - 1, myDate.day - 29), 'yyyy-MM-dd');
    }
    return initTime;
}

function notFind(imgId) {

    var _self = this;
    var img = event.srcElement;
    img.src =  "../../resources/img/cloud/none.png";
    img.onerror = null; //控制不要一直跳动
    document.getElementById(imgId).value = "0";
    // _self.showSelectCnt();
}

function stopAllPlay() {
    var obj;
    for (var i = 1; i < 4; i++) {
        if (i % 2) {
            obj = $("#progres0" + i);
            var img = obj.find(".progressTime_control");
            $(img).attr("title", "开始");
            $(img).css("background-image", "url(" +  "../../resources/img/maptool/play.png)");
        }
    }
    window.clearInterval(progres01._mProgressTimer);
    if (progres03) {
        window.clearInterval(progres03._mProgressTimer);
    }
}

function showSearchStationInfo(stationId) {
    airMonitoringVM.showSearchStation(stationId);

    //dian单击站点列表内容不展示详细信息
    //airMonitoringVM.showStationDetailTab();
}

function sortFun(data, sort) {
    var objectList = new Array();
    var objectList0 = new Array();

    for (var i = 0; data != null && i < data.length; i++) {
        if (data[i].pvalue < 0 || data[i].pvalue == null || data[i].pvalue == '' || typeof(data[i].pvalue) == 'undefined' || data[i].pvalue == '--') {
            data[i].pvalue = 0;
            objectList0.push(data[i]);
        } else {
            objectList.push(data[i]);
        }
    }
    // 按Value从小到大排序
    objectList.sort(function (a, b) {
        var inta = a.pvalue,
            intb = b.pvalue;
        if (sort == "asc")
            return inta - intb;
        else
            return intb - inta;
    });
    for (var j = 0; objectList0 != null && j < objectList0.length; j++) {
        objectList.push(objectList0[j]);
    }

    return objectList;
}

function checkStationObj(arr, id) {
    var flag = true;
    $.each(arr, function (index, value) {
        if (value.id == id) {
            flag = false;
            return;
        }
    })
    return flag;

}