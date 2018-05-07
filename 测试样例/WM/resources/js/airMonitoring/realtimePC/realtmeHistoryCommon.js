/**
 * 全局变量
 */
var STATION_TYPE_ALL = 'all'; //站点类型 全部
var STATION_TYPE_WZ = 'wz'; //站点类型 微站
var STATION_TYPE_KH = 'kh'; //站点类型 考核站
var STATION_TYPE_PC = 'pc'; //站点类型 爬虫站
var STATION_TYPE_YC = 'yc'; //站点类型 扬尘站

var myDate = new DateHelp({
    date: new Date()
});

var weatherVM, currentTime, showTime = ""; //currentTime当前时间
var station_rpanelType = 'wz-kh';
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

var pollutionTypeAQIList = [{
    id: "aqi",
    name: "AQI"
},
    {
        id: "pm25",
        name: "PM<sub>2.5</sub>"
    },
    {
        id: "pm10",
        name: "PM<sub>10</sub>"
    },
    {
        id: "so2",
        name: "SO<sub>2</sub>"
    },
    {
        id: "no2",
        name: "NO<sub>2</sub>"
    },
    {
        id: "co",
        name: "CO"
    },
    {
        id: "o3",
        name: "O<sub>3</sub>"
    }
];
var pollutionTypeAQI2List = [{
    id: "aqi2",
    name: "AQI",
    isDisable: false
},
    {
        id: "aqi",
        name: "标准AQI",
        isDisable: false
    },
    {
        id: "pm25",
        name: "PM<sub>2.5</sub>",
        isDisable: false
    },
    {
        id: "pm10",
        name: "PM<sub>10</sub>",
        isDisable: false
    },
    {
        id: "so2",
        name: "SO<sub>2</sub>",
        isDisable: false
    },
    {
        id: "no2",
        name: "NO<sub>2</sub>",
        isDisable: false
    },
    {
        id: "co",
        name: "CO",
        isDisable: false
    },
    {
        id: "o3",
        name: "O<sub>3</sub>",
        isDisable: false
    }
];
var tableColumns = [{
    name: '__sequence',
    width: '45px',
    title: '序号',
    titleClass: 'text-center',
    dataClass: 'text-center'
},
    {
        name: 'stationId',
        title: '站点编号',
        titleClass: 'text-center ',
        dataClass: 'text-center tovf'
    },
    {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-center ',
        dataClass: 'text-center tovf'
    },
    {
        name: 'addr',
        title: ' 地址',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {

        name: 'stationTypeName',
        width: '80px',
        title: "站点类型",
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];
var pollution_local_markers_map = {};
var pollution_markers_map = {};

var mapCenter = parent.cityName;
var city = parent.cityId;
Vue.use(Vuetable);
weatherVM = new Vue({
    el: '#content',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {},
        fields: tableColumns,
        tableHeight: 'auto',
        vuetableFields: false,
        sortOrder: [{
            field: 'stationId',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        map: null,
        mapType: 1, //1
        ctrl: null, //
        drawingManager: null,
        markers: {
            "-1": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
        },
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
            }
        },
        showLevel: {
            "-1": true,
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true,
            "6": true,
        },
        timeControl: initTime.conrolTime,
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
        queryParams: {
            doMainId: parent.domainId,
            district: -1,
            queryStationType: "wz",
            pollutionType: 'pm25',
            //equipmentType: "0",暂未发现使用地方
            sTechType: '-1',
            stationType: '-1',
            dateType: 2, //2  (小时)  3 (天)
            // currentTime: new Date().Format("yyyy-MM-dd HH:00:00")
            currentTime: initTime.hour.end
        },
        timeType: {
            "hour": {
                isActive: true,
                noActive: false
            },
            "day": {
                isActive: false,
                noActive: true
            }
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
        pollutionBtnIsdisable: false, //启用右下角图例的 可点击
        btnStatus: {
            "aqi": {
                isActive: false,
                noActive: true
            },
            "aqi2": {
                isActive: false,
                noActive: true
            },
            'pm25': {
                isActive: true,
                noActive: false
            },
            'pm10': {
                isActive: false,
                noActive: true
            },
            'so2': {
                isActive: false,
                noActive: true
            },
            'no2': {
                isActive: false,
                noActive: true
            },
            'o3': {
                isActive: false,
                noActive: true
            },
            'co': {
                isActive: false,
                noActive: true
            }
        },
        pollutionTypeList: pollutionTypeAQI2List,
        resultData: [],
        drawingSearch: {
            slt_overlays: [],
            slt_stations_name: [],
            slt_stations_id: []
        },
        pollutionSource_type_html: [], //污染源类型html
        stationFgBtnStatus: { // 站点开关控制按钮状态
            isActive: true,
            noActive: false
        },
        //////////////
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
        distanceToolobj: null,
        isshowAllDownloadBtn: false, //下载污染云图按钮，是否开启
        allFunctions: {},
        siteParam: {}
    },
    mounted: function () {
        var _self = this;
        _self.initAllFunctions();
        _self.initMap();
        _self.addMapCloudImg(); //在地图上添加一个云图叠加的位置

        //第一次获取微站的进度条的时间限制
        this.getCalcDataTime('hour');

    },
    watch: {
        'rPanelSType': function () {
            if (this.pCloundBtnStatus.status.isActive) { //污染云图的按钮为开启状态
                this.showCloudWindyInfo();
            }
        },
        'timeControl': function () { //日期控件时间的更改
            this.changeprogStatue();
        },
        'queryParams.currentTime': function () { //监控时间的改变
            console.log("364");
            //debugger
            queryData(this.queryParams);
        },
        'queryParams.pollutionType': function () {
            // console.log("选择的污染值改变    ", this.queryParams.pollutionType);
            if (this.pCloundBtnStatus.status.isActive) { //当“污染云图”按钮的状态为开启状态时，重新叠加云图
                this.showCloudWindyInfo();
            }
        },
        'psdropListShowBtn.status.noActive': function () { //清空“已勾选的污染源”和地图上的叠加污染源状态
            if (this.psdropListShowBtn.status.noActive) { //“污染源按钮”状态不可用状态
                this.clearChkChenked();
                this.psdropListShowBtn.pSelectHtmlIsShow = false; //污染源选择列表隐藏
            }
        },
        'pCloundBtnStatus.status.isActive': function () {
            if (this.pCloundBtnStatus.status.isActive) { //‘污染云图’当前状态为活动状态
                this.map.addOverlay(this.imageLayer);
                this.getCloudImg();
            } else {
                this.map.removeOverlay(this.imageLayer);
            }
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
        getYearmonthday: function (time) {
            var t = new Date(time);
            var timeHtml = t.getFullYear() + '-';
            timeHtml += t.getMonth() < 10 ? '0' + (t.getMonth() + 1) + '-' : (t.getMonth() + 1) + '-';
            timeHtml += t.getDate() < 10 ? '0' + t.getDate() : t.getDate();
            return timeHtml;
        },
        changeprogStatue: function () {
            if (progres01.type) {
                if (this.queryParams.dateType == 2) {
                    this.getprogressParam('hour');
                    getCityTendency();
                } else {
                    this.getprogressParam('day');
                    getCityTendency();
                }
                reSiteTime(this.queryParams.dateType, this.timeControl);
            }
        },
        getCalcDataTime: function (timeType) {
            var _self = this;
            $.ajax({
                type: "get",
                url: $.coreApiPath + "/stationNew/datatime",
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
        getprogressParam: function (timeType) {
            var stechType = '';
            if (window.staRankVM) {
                if (staRankVM.s_tech_type.indexOf('微站') != -1) {
                    stechType = 'wz';
                } else if (staRankVM.s_tech_type.indexOf('爬虫') != -1) {
                    stechType = 'pc';
                } else if (staRankVM.s_tech_type.indexOf('扬尘') != -1) {
                    stechType = 'yc';
                } else if (staRankVM.s_tech_type.indexOf('考核') != -1 || staRankVM.s_tech_type.indexOf('全部') != -1) {
                    stechType = 'kh';
                }
            } else {
                stechType = 'wz';
            }
            if (timeType == 'hour') {
                var gettime = this.getYearmonthday(this.siteParam.result.hour.wzCalcEndTime);
                if (this.timeControl >= gettime) { //判断是否大于竖线的位置时间
                    this.timeControl = gettime;
                    initTime.currTime = this.siteParam.result.hour.wzCalcEndTime; //竖线的位置
                }
                initTime.currTooltip = this.siteParam.result.hour[stechType + 'CalcEndTime'];
            } else {
                if (this.timeControl > this.siteParam.result.day[stechType + 'CalcEndTime']) {
                    this.timeControl = this.siteParam.result.day[stechType + 'CalcEndTime'];
                }
                initTime.daycurrTime = this.timeControl;
                initTime.daycurrTooltip = this.timeControl;
            }
            this.queryParams.currentTime = initTime.currTooltip;
        },
        stationIsCover: function () {
            stopAllPlay();
            this.stationFgBtnStatus.isActive = !this.stationFgBtnStatus.isActive;
            this.stationFgBtnStatus.noActive = !this.stationFgBtnStatus.noActive;
            //debugger
            for (var i = -1; i <= 6; i++) {
                this.showLevel[i] = !this.showLevel[i]; //改当前状态
                this.showMarkers();
            }
            for (var j in this.pollutionBtnStatus) {
                this.pollutionBtnStatus[j].isActive = !this.pollutionBtnStatus[j].isActive;
                this.pollutionBtnStatus[j].noActive = !this.pollutionBtnStatus[j].noActive;
            }
            this.pollutionBtnIsdisable = !this.pollutionBtnIsdisable;
        },
        ////////////////////污染云图下载列表////////////////
        viewPics: function () { //打开差值图预览窗口
            this.isshowAllDownloadBtn = false; //隐藏“全部选中污染云图按钮”
            ////////////按钮状态样式切换//////////
            this.pCloundDownloadStatus.isActive = !this.pCloundDownloadStatus.isActive;
            this.pCloundDownloadStatus.noActive = !this.pCloundDownloadStatus.noActive;
            this.clearPicsModal();
            this.getCloudDownLoadImg();

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
            var start, end, totalCount;
            if (this.queryParams.dateType == 2) { //小时
                start = this.timeTypeStartEnd.hour.end;
                end = this.timeTypeStartEnd.hour.start;
                totalCount = GetHourDiff(end, start) - 1;
            } else { //天
                start = this.timeTypeStartEnd.day.end;
                end = this.timeTypeStartEnd.day.start;
                totalCount = GetDateDiff(end, start);
            }
            showTime = start;
            var title_type = this.queryParams.pollutionType.toUpperCase(),
                num = this.queryParams.pollutionType.replace(/[^0-9]/ig, "") == '25' ? '2.5' : this.queryParams.pollutionType.replace(/[^0-9]/ig, ""),
                vl = title_type.replace(/\d+/g, '');
            var title = "";
            if (this.queryParams.dateType == 2) {
                $("#zipName").val(new Date(start).Format("yyyy-MM-dd HH") + "时至" + new Date(end).Format("yyyy-MM-dd HH") + "时" + vl + num + "浓度空间分布图");
            } else {
                $("#zipName").val(start + "至" + end + vl + num + "浓度空间分布图");
            }
            title = start + " 至 " + end + " " + vl + "<sub>" + num + "</sub> 浓度空间分布图";
            $("#picsTitle").html(title);
            $("#dvalueModal").modal('show');
            var firstShowCount = 24;
            if (totalCount < firstShowCount) {
                firstShowCount = totalCount;
            }
            this.appendrealTable(firstShowCount);
            this.scrollLoadPic(totalCount);
        },
        scrollLoadPic: function (totalCount) {
            $("#pic_scroll").scroll(function (event) {
                //debugger
                // console.log("滚动");
                var viewH = $(this).height(), //可见高度
                    contentH = $(this).get(0).scrollHeight, //内容高度
                    scrollTop = $(this).scrollTop(); //滚动高度
                if (scrollTop / (contentH - viewH) >= 1) {
                    var cnt = totalCount - 24 - 12 * weatherVM.scrollCont; //判断是否还有图片加载
                    if (cnt > 0) {
                        if (cnt < 12) {
                            weatherVM.appendrealTable(cnt);
                        } else {
                            weatherVM.appendrealTable(12);
                        }
                        console.log("添加");
                        weatherVM.scrollCont++;
                    } else {
                        if (weatherVM.showMsg) {
                            weatherVM.isshowAllDownloadBtn = true;
                            layer.msg("没有了哦！");
                            weatherVM.showMsg = false;
                        }
                        return false;
                    }
                }
            });
        },
        converTimeFormat: function (time) {
            if (time != null) {
                time = time.replace("-", "/");
                time = time.replace("-", "/");
                return new Date(time);
            }
            return null;
        },
        appendrealTable: function (showCount) { //创建显示图片
            var bodytd_limit = '',
                body_html = '';
            var picFmt = "yyyyMMdd";
            var interval_type,
                _self = this;
            if (_self.queryParams.dateType == 2) {
                interval_type = 'hour';
                showTime = hourIncre(showTime, 1);
            } else if (_self.queryParams.dateType == 3) {
                interval_type = 'day';
                showTime = dayIncre(showTime, 1);
            }
            var stationtype = this.rPanelSType,
                arithmetic = "Neareast_RBF";
            for (var i = 0; i < showCount; i++) {
                var seltime = this.converTimeFormat(showTime);
                var picTimeTime = seltime.Format(picFmt);
                var imgurl = this.cloudImg + city + "/" + stationtype + "/" + _self.queryParams.pollutionType + "/" + arithmetic + "/" + interval_type + "/" + this.getPicTimeFmt(seltime) + ".png";

                var imgId = city + "/" + stationtype + "/" + _self.queryParams.pollutionType + "/" + arithmetic + "/" + interval_type + "/" + this.getPicTimeFmt(seltime) + ".png";
                body_html += '<div class = "pic_selt pic_seltfffbor" > ';
                body_html += '<input type = "hidden"  name="pic" id="' + imgId + '" value="-1" / > ';
                if (_self.queryParams.dateType == 2) {
                    body_html += '<span>' + seltime.Format("yyyy-MM-dd HH时") + '</span> ';
                    showTime = hourIncre(showTime, 1);
                } else {
                    body_html += '<span>' + showTime + '</span> ';
                    showTime = dayIncre(showTime, 1);
                }
                body_html += '<img src = "' + imgurl + '"  onerror="notFind(\'' + imgId + '\');" / > ';
                body_html += '</div>';
            }
            $("#pic_scroll").append(body_html);
            this.picClk();
        },
        picClk: function () { //差值弹窗 图片选中效果
            var _self = this;
            $(".pic_selt").click(function () {
                if ($($(this).children("input").get(0)).val() != "0") {
                    if ($(this).hasClass("pic_seltfffbor")) {
                        $(this).removeClass("pic_seltfffbor");
                        $(this).addClass("pic_selta4dbor");
                        $(this).children('input').val("1");
                    } else {
                        $(this).addClass("pic_seltfffbor");
                        $(this).removeClass("pic_selta4dbor");
                        $(this).children('input').val("-1");
                    }

                } else {
                    $(this).addClass("pic_seltfffbor");
                    $(this).removeClass("pic_selta4dbor");
                    $(this).children('input').val("0");
                }
                _self.showSelectCnt();
            });

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
            var selAll = $("#selAll").val();
            if (selAll == "全部选中") {
                // $(" .pic_selt input[name='pic']").val("1");
                $(".pic_selt input[name='pic']").each(function () {
                    if ($(this).val() != "0") {
                        $(this).val("1");
                        $(this).parent('.pic_selt').removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
                    }
                });
                $("#selAll").val("取消全部选中");
                // $(".pic_selt").removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
            } else {
                // $(" .pic_selt input[name='pic']").val("-1");
                $(".pic_selt input[name='pic']").each(function () {
                    if ($(this).val() != "0") {
                        $(this).val("-1");
                        // $(this).parent('.pic_selt').removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
                    }
                });
                $("#selAll").val("全部选中");
                $(".pic_selt").removeClass("pic_selta4dbor").addClass("pic_seltfffbor");
            }
            this.showSelectCnt();
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
        ////////////////////左下污染云图控制面板开始//////////
        showpCloundPicture: function () {
            stopAllPlay();
            this.pCloundBtnStatus.status.isActive = !this.pCloundBtnStatus.status.isActive;
            this.pCloundBtnStatus.status.noActive = !this.pCloundBtnStatus.status.noActive;
        },
        addMapCloudImg: function () {
            var _self = this;
            $.get($.backendApiPath + '/domain/citybound/' + parent.cityId, function (data) {
                var h = new BMap.Point(data.result.lowLng, data.result.lowLat),
                    m = new BMap.Point(data.result.highLng, data.result.highLat);
                _self.imageLayer = new BMap.GroundOverlay(new BMap.Bounds(h, m), {
                    opacity: 0.6
                });
                _self.map.addOverlay(_self.imageLayer);
            });

        },
        getPicTimeFmt: function (timeParam) {
            var _self = this;
            if (_self.queryParams.dateType == 2) {
                return new Date(timeParam).Format("yyyyMMddHH");
            } else {
                return new Date(timeParam).Format("yyyyMMdd");
            }
        },
        showCloudWindyInfo: function () {
            //debugger
            var _self = this;
            var interval_type = 'hour'; //小时
            if (_self.queryParams.dateType == 2) {
                interval_type = 'hour';
            } else if (_self.queryParams.dateType == 3) {
                interval_type = 'day';
            }
            var stationtype = this.rPanelSType,
                arithmetic = "Neareast_RBF";
            var imgurl = _self.cloudImg + city + "/" + stationtype + "/" + _self.queryParams.pollutionType + "/" + arithmetic + "/" + interval_type +
                "/" + _self.getPicTimeFmt(_self.queryParams.currentTime) + ".png";
            _self.imageLayer.V.parentNode.style.zIndex = '0'; //修改污染云图zIndex 层级
            _self.imageLayer.setImageURL(imgurl);
        },
        getCloudImg: function () {
            var cloudImg, _self = this;
            ajax_get($.backendApiPath + "/config/cloudimg", {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.cloudImg = data.result;
                } else {
                    _self.cloudImg = "url_error"
                }
                _self.showCloudWindyInfo();
            });
        },
        /////////////左下污染源控制面板开始//////////////////
        other_click_hide: function () {
            $(document).bind('click', function (e) {
                var e = e || window.event; //浏览器兼容性
                var elem = e.target || e.srcElement;
                while (elem) { //循环判断至跟节点，防止点击的是div子元素
                    if (elem.id && elem.id == 'pollutionSource') {
                        return;
                    }
                    elem = elem.parentNode;
                }
                weatherVM.psdropListShowBtn.pSelectHtmlIsShow = false; //展示右侧的污染源选择列表 (隐藏)
            });
        },
        clearChkChenked: function () {
            var obj = document.getElementById('pollutionSource').getElementsByTagName('input');
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    obj[i].checked = false;
                    var isLocal = (obj[i].id == obj[i].name);
                    if (obj[i].name == "POI") { // 清除海量点
                        cleanPointCollection();
                    } else { // 清除本地 污染点
                        this.clear_map_pollution_markers(obj[i].id, isLocal);
                    }
                }
            }
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
                        this.add_baidu_pollution_markers(code);
                    } else {
                        if (value == "POI") {
                            this.getPointCollection();
                        } else {
                            this.query_pollution_markers(code);
                        }
                    }
                } else { //清除 选 中
                    if (value == "POI") { // 清除海量点
                        cleanPointCollection();
                    } else { // 清除本地 污染点
                        this.clear_map_pollution_markers(code, isLocal);
                    }
                }
            }
        },
        add_baidu_pollution_markers: function (searchKey) { //添加本地污染源
            if (searchKey.length > 0) {
                var options = {
                    renderOptions: {
                        map: this.map,
                        selectFirstResult: false
                    },
                    onMarkersSet: function (array) {
                    }
                };
                var local = new BMap.LocalSearch(this.map, options);
                local.disableAutoViewport();
                local.search(searchKey);
                pollution_local_markers_map[searchKey] = local;
            }
        },
        add_pollution_markers: function (code, datas, onclickFunc) {
            var markers = [],
                _self = this;
            var size = 30;
            if (bigScreen_flg) {
                size = 90;
            }
            $.each(datas, function (index, data) {
                var point = new BMap.Point(data.lng, data.lat);
                icon_path = $.ctx + "/resources/img/pollutions/" + data.typeCode + ".png";
                var markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
                    imageSize: new BMap.Size(size, size)
                });
                var marker = new BMap.Marker(point, {
                    icon: markIcon
                });
                marker.obj = data.id;
                marker.onclick = onclickFunc;
                _self.map.addOverlay(marker);
                markers.push(marker);
            });
            pollution_markers_map[code] = markers;
        },
        query_pollution_markers: function (code) {
            var city = parent.cityId,
                url = $.backendApiPath + "/pollutionrepo/pollutions/" + city + "/" + code;
            var _self = this;
            var load = layer.msg('加载中', {
                icon: 16,
                shade: 0.01
            });
            if (code.length > 0) {
                ajax_get(url, {}, function (data) {
                    _self.add_pollution_markers(code, data, function (e) {
                        var target = e.currentTarget;
                        var obj_data = target.obj;
                        showPollutionInModal(obj_data);
                    });
                    layer.close(load);
                });
            }
        },
        getPointCollection: function () {
            var url = $.backendApiPath + "/pollutionrepo/pollutions/" + parent.cityId;
            var load = layer.msg('加载中', {
                icon: 16,
                shade: 0.01
            });
            ajax_get(url, {}, function (r) {
                if (r.erroCode == 2000) {
                    addPointCollection(r.result, weatherVM.map);
                }
                layer.close(load);
            });
        },
        clear_map_pollution_markers: function (code, isLocal) { //清除污染源marker
            var _self = this;
            if (isLocal) {
                pollution_local_markers_map[code].clearResults();
            } else {
                if (pollution_markers_map[code]) {
                    $.each(pollution_markers_map[code], function (n, marker) {
                        _self.map.removeOverlay(marker);
                    });
                }
            }
        },
        showPollutionselect: function () { //点击“污染源”按钮对选择下拉菜单的操作
            stopAllPlay();
            this.psdropListShowBtn.pSelectIsShow = !this.psdropListShowBtn.pSelectIsShow; //展示右侧的污染源选择列表
            this.psdropListShowBtn.status.isActive = !this.psdropListShowBtn.status.isActive; //当前的按钮的活动状态
            this.psdropListShowBtn.status.noActive = !this.psdropListShowBtn.status.noActive; //当前的按钮的活动状态
        },
        showPolltionPanel: function () {
            this.psdropListShowBtn.pSelectHtmlIsShow = !this.psdropListShowBtn.pSelectHtmlIsShow;
            this.other_click_hide();
        },
        /////////////左下地图控制面板end//////////////////
        changeShowLevel: function (level, leveltype) {
            //debugger
            stopAllPlay();
            var _self = this;
            _self.showLevel[level] = !_self.showLevel[level]; //改当前状态
            _self.showMarkers();
            this.pollutionBtnStatus[leveltype].isActive = !this.pollutionBtnStatus[leveltype].isActive;
            this.pollutionBtnStatus[leveltype].noActive = !this.pollutionBtnStatus[leveltype].noActive;
        },
        initCurrentTime: function () {
            stopAllPlay();
            var _self = this,
                datafmt = 'yyyy-MM-dd',
                maxDateSite = '%y-%M-%d';
            if (_self.queryParams.dateType == 3) { //时间类型为天的时候
                maxDateSite = '%y-%M-{%d-1}';
            }
            WdatePicker({
                dateFmt: datafmt,
                maxDate: maxDateSite,
                onpicked: function () {
                    _self.timeControl = $dp.cal.getDateStr(datafmt);
                    $dp.$("timeControl").blur();
                }
            });
        },
        timeTypeChange: function (type) {
            stopAllPlay(); //暂停播放进度
            var _self = this,
                temp_type = (type == 'hour') ? "2" : "3";
            _self.queryParams.dateType = temp_type;
            //监听的部分
            if (type == "hour") {
                _self.getCalcDataTime('hour');
            } else if (type == "day") { //如果为天，需要判断是否是当前天
                initProgressDay();
                _self.getCalcDataTime('day');
                if (_self.timeControl == initTime.conrolTime) {
                    _self.timeControl = initTime.prevDayTime; //如果为当前时间将自动切换到：当前时间的上一天
                }
            }
            reSiteTime(_self.queryParams.dateType, _self.timeControl); //重置时间
            if (_self.pCloundBtnStatus.status.isActive) { //当“污染云图”按钮的状态为开启状态时，重新叠加云图
                _self.showCloudWindyInfo();
            }

            if (type == "hour") {
                $("#progres01").show();
                $("#progres03").hide();
                _self.pollutionTypeList = pollutionTypeAQI2List;
                //debugger
                initTime.currTooltip = new Date(this.timeControl).Format("yyyy-MM-dd 00:00:00");
                _self.queryParams.currentTime = initTime.currTooltip;
                //重置为日期控件的选中日期的00点开始
                SetProgressTime('progres01', progres01, true);
                SetProgressTime('progres02', progres02, true);
            } else if (type == "day") {
                $("#progres01").hide();
                $("#progres03").show();
                _self.pollutionTypeList = pollutionTypeAQIList;
                if (_self.queryParams.pollutionType == "aqi2") {
                    _self.queryParams.pollutionType == "aqi";
                }
                _self.queryParams.currentTime = initTime.hour.end;
                SetProgressTime('progres03', progres03, false);
                SetProgressTime('progres04', progres04, false);
            }
            _self.changeBtnStatus(type, this.timeType);
        },
        toggleBtnActive: function (type, arr) { //多按钮状态切换
            arr[type].isActive = !arr[type].isActive;
            arr[type].noActive = !arr[type].noActive;
        },
        changeBtnStatus: function (type, arr) { //单按钮类型切换
            var _self = this;
            $.each(arr, function (i, item) {
                item.isActive = false;
                item.noActive = true;
            })
            arr[type].isActive = true;
            arr[type].noActive = false;
        },
        changePollution: function (type) {
            //debugger
            var _self = this;
            _self.queryParams.pollutionType = type;
            _self.changeBtnStatus(type, _self.btnStatus); //修改按钮的样式显示状态
            console.log("974");
            queryData(_self.queryParams);
            staRankVM.getStationRank();
            stopAllPlay();
        },
        initMap: function () { //初始化地图
            var _self = this;
            _self.map = initMyBMapWithMaxMin("baidumap", mapCenter, 10, 5, 15);
            // var NavigationControl = new BMap.NavigationControl({
            //     offset: new BMap.Size(10, 185),
            //     anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            //     type: BMAP_NAVIGATION_CONTROL_ZOOM
            // });
            // _self.map.addControl(NavigationControl);
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
        traffic: function () { //显示交通
            var _self = this;
            if (_self.map == null) {
                _self.initMap();
            }
            if (_self.ctrl != null) {
                _self.ctrl.remove();
                _self.ctrl = null;
                return;
            }
            _self.ctrl = new BMapLib.TrafficControl();
            _self.map.addControl(_self.ctrl);
            _self.ctrl.showTraffic();
            _self.toggleBtnActive('mapLight', _self.mapControl);
        },
        distanceTool: function () { //显示测距工具

            var _self = this;
            if (_self.map == null) {
                _self.initMap();
            }
            if (_self.distanceToolobj != null) {
                _self.distanceToolobj.close();
                _self.distanceToolobj = null;
                return;
            }
            _self.distanceToolobj = new BMapLib.DistanceTool(_self.map);
            _self.distanceToolobj.open();
            _self.toggleBtnActive('mapRuler', _self.mapControl);
        },
        zoomUp: function () {

            var _self = this;
            //debugger
            if (_self.map == null) {
                _self.initMap();
            }

            var zoom = _self.map.getZoom()
            _self.map.setZoom(zoom + 1);

        },
        zoomDown: function () {

            var _self = this;
            //debugger
            if (_self.map == null) {
                _self.initMap();
            }

            var zoom = _self.map.getZoom()
            _self.map.setZoom(zoom - 1);

        },
        openDrawingManager: function () {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            this.drawingManager.open();
        },
        initDrawingManager: function () {
            var _self = this;
            if (_self.map == null) {
                _self.initMap();
            }
            _self.toggleBtnActive('mapOperat', _self.mapControl);
            var options = {
                renderOptions: {
                    map: _self.map,
                    selectFirstResult: false
                },
                onSearchComplete: function (results) {
                    _self.resultData = [];
                    $('#slt_tabs a[href="#concentration"]').tab('show');
                    stopAllPlay();
                    // initRealHisDataCharts(results, _self.drawingSearch, _self.queryParams.pollutionType);
                    //getAirData();
                    localSearch.clearResults();
                    _self.resultData = [];
                    if (results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            for (var j = 0; j < results[i].getCurrentNumPois(); j++) {
                                var r = results[i].getPoi(j);
                                _self.resultData.push({
                                    "title": r.title,
                                    "address": r.address,
                                    "keyword": results[i].keyword,
                                    "lng": r.point.lng,
                                    "lat": r.point.lat
                                });
                            }
                        }
                    }
                    // openDrawAndInitTab(results);
                    $("#rectangleWin").modal('show');
                }
            };
            localSearch = new BMap.LocalSearch(_self.map, options);
            localSearch.disableAutoViewport();
            localSearch = new BMap.LocalSearch(_self.map, options);
            localSearch.disableAutoViewport();
            _self.drawingManager = new BMapLib.DrawingManager(_self.map, {
                isOpen: false, // 是否开启绘制模式
                enableDrawingTool: false, // 是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_LEFT, // 位置
                    offset: new BMap.Size(570, 5), // 偏离值
                    scale: 0.8, // 工具栏缩放比例
                    drawingModes: [BMAP_DRAWING_RECTANGLE]
                }
            });
            _self.drawingManager.addEventListener('rectanglecomplete', function (e, d_overlay) {
                d_overlay.hide();
                _self.drawingManager.close();
                _self.toggleBtnActive('mapOperat', _self.mapControl);
                _self.clearSearch();
                var stationIds = [];
                var overlays = _self.map.getOverlays();
                for (var i = 0; i < overlays.length; i++) {
                    var overlay = overlays[i];
                    if (d_overlay.containPoint(overlay.point)) {
                        _self.drawingSearch.slt_overlays.push(overlay);
                        if (overlay.obj) {
                            _self.drawingSearch.slt_stations_name.push(overlay.obj.stationName);
                            _self.drawingSearch.slt_stations_id.push(overlay.obj.stationId + "@" + overlay.obj.stationName + "@" + overlay.obj.stationType);
                            stationIds.push(overlay.obj.stationId);
                        }
                    }
                }
                if (_self.drawingSearch.slt_overlays.length > 20) {
                    layer.msg("请选择20个站点以内！");
                    return;
                }

                _self.moreParams = {
                    stationIds: stationIds.join(",")
                };
                _self.$nextTick(function () {
                    _self.$refs.vuetable.refresh()
                });
                var myKeys = ["餐馆", "加油站", "电厂", "钢厂", "汽车站"];
                localSearch.searchInBounds(myKeys, d_overlay.getBounds());
            });
            _self.openDrawingManager();

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
        addMarkers: function (data) {
            //debugger
            var _self = this;
            _self.clearMarkers();
            if (data) {
                if (data.length > 0) {
                    $.each(data, function (n, data) {
                        //debugger
                        if (data.lat != null && data.lng != null) {
                            _self.mkMarkers(data, function (e) {
                                var target = e.currentTarget;
                                var obj_data = target.obj;
                                popWindowShow(obj_data, _self.queryParams);
                                stopAllPlay();
                            }, n);
                        }
                    });
                    _self.showMarkers();
                }
            }
        },
        mkMarkers: function (data, callBK, index) {
            var _self = this;
            // 创建地图标注
            var icon_path,
                markIcon,
                size = 60,
                City_icon_url = '',
                icon_path = $.ctx + "/resources/img/cityimage/";
            switch (city) {
                case '370800':
                case '510100': {
                    City_icon_url = city;
                }
                    break;
                default: {
                    City_icon_url = "default";
                }
                    break;
            }
            var level = data.baseLevel == null ? "-1" : data.baseLevel;
            var stationType = data.stationType;
            var stechType = data.stechType;
            icon_path += City_icon_url + "/";
            if (stationType == '99' || stechType == '99') {
                icon_path += "mark_sprite_gk_" + level + ".png";
                size = size + size * 0.4;
            } else if (stationType == '98' && stechType == '98') {
                icon_path += "mark_sprite_sk_" + level + ".png";
                size = size + size * 0.2;
            } else if (stationType == '97' || stechType == '97') {
                size = size * 0.8;
                icon_path += "mark_sprite_s_" + level + ".png";
            } else if (stationType == '101') {
                size = size * 0.8;
                icon_path += "mark_sprite_yc_" + level + ".png";
            } else if (stationType < 90 && stechType == 1010) {
                size = size * 0.8;
                icon_path += "mark_sprite_d_" + level + ".png";
            } else if (stationType < 90 && stechType == 6010) {
                size = size * 0.8;
                icon_path += "mark_sprite_six_" + level + ".png";
            }

            markIcon = new BMap.Icon(icon_path, new BMap.Size(size, size), {
                imageSize: new BMap.Size(size, size)
            });

            var point = new BMap.Point(data.lng, data.lat);
            var marker = new BMap.Marker(point, {
                icon: markIcon
            }); // 创建标注
            marker.obj = data;
            var stationId = data.stationId;
            marker.title = stationId;
            marker.onclick = callBK;
            _self.markers[level].push(marker);
            _self.map.addOverlay(marker);
        },
        siteStationJump: function (mk) {
            if (window.staRankVM && window.staRankVM.jumpMarker_list) {
                for (var i = 0; i < staRankVM.jumpMarker_list.length; i++) {
                    if (staRankVM.jumpMarker_list[i] == mk.obj.stationId) {
                        mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画©
                    }
                }
            }
        },
        clearMarkers: function () {
            var _self = this;
            $.each(_self.markers, function (key, values) {
                // console.log(key);
                if (values.length > 0) {
                    $.each(values, function (i, val) {
                        _self.map.removeOverlay(val);
                    });
                }
                _self.markers[key] = [];
            });
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
                                _self.map.addOverlay(mk);
                                _self.siteStationJump(mk);
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
        onLoadSuccess: function (response) { //加载成功，相关数据初始化
            this.$refs.paginationInfo.setPaginationData(response.data);
        },
        onLoadError: function (response) {
            console.log("onLoadError:::::::" + response.data.message)
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
    }
});

function notFind(imgId) {

    var _self = this;
    var img = event.srcElement;
    img.src = $.ctx + "/resources/img/cloud/none.png";
    img.onerror = null; //控制不要一直跳动
    document.getElementById(imgId).value = "0";
    // _self.showSelectCnt();
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

function reSiteTime(timeType, startTime) {
    var temp_type = "hour";
    if (timeType == 3) {
        temp_type = "day";
    }
    var time = getNewTime(temp_type, startTime);
    if (temp_type == "hour") {
        //console.log("hour类型进度面板");
        //重置进度条控件的起止时间 和  对应大面板的起止时间
        progres01.startTime = progres02.startTime = time.hour.end;
        progres01.endTime = progres02.endTime = time.hour.start;

        SetProgressTime('progres01', progres01, true); //小面板
        SetProgressTime('progres02', progres02, true); //大面板
        //重置对应大的进度面板的起止时间id, ScrollBar, fg
        progressTimeStop(progres01.objID, progres01, 'hour');
        progressTimeStop(progres02.objID, progres02, 'hour');
    } else if (temp_type == "day") {
        //
        //console.log("天类型进度面板");
        //重置进度条控件的起止时间 和  对应大面板的起止时间
        progres03.startTime = progres04.startTime = time.day.end;
        progres03.endTime = progres04.endTime = time.day.start;

        SetProgressTime('progres03', progres03, false); //小面板
        SetProgressTime('progres04', progres04, false); //大面板
        progressTimeStop(progres03.objID, progres03, 'day');
        progressTimeStop(progres04.objID, progres04, 'day');

    }
}