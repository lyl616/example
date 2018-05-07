var cityId = parent.cityId;
var provinceId = parent.provinceId;
var cityName = parent.cityName;
var drawingManager = "";
var map = "";
var myDate = new DateHelp({
        date: new Date(), //从此日期开始计算
        format: 'yyyy-MM-dd hh:mm'
    }),
    initSEndTime = {
        startTime: initradioDate().start,
        endTime: initradioDate().end
    };
var ChartsArr = [];

function initradioDate() {
    var start = new Date(myDate.year, myDate.month - 1, myDate.day - 1, myDate.hour, myDate.minus),
        end = new Date(myDate.year, myDate.month - 1, myDate.day, myDate.hour, myDate.minus);
    myDate.format = 'yyyy-MM-dd hh:mm';
    start = myDate.formatDate(start, myDate.format);
    end = myDate.formatDate(end, myDate.format);
    return {
        start: start,
        end: end
    };
}

var no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/no_select.png', new BMap.Size(24, 24));
var is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/is_select.png', new BMap.Size(24, 24));

var wz_no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/wz_no_select.png', new BMap.Size(24, 24));
var wz_is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/wz_is_select.png', new BMap.Size(24, 24));
var kh_no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/kh_no_select.png', new BMap.Size(24, 24));
var kh_is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/kh_is_select.png', new BMap.Size(24, 24));
var pc_no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/pc_no_select.png', new BMap.Size(24, 24));
var pc_is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/pc_is_select.png', new BMap.Size(24, 24));
var yc_no_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/yc_no_select.png', new BMap.Size(24, 24));
var yc_is_select_icon = new BMap.Icon($.ctx + '/resources/img/stationAnalysis/yc_is_select.png', new BMap.Size(24, 24));
var stationIcons = {
    '_1010': [wz_no_select_icon, wz_is_select_icon],
    '_6010': [wz_no_select_icon, wz_is_select_icon],
    '_99': [pc_no_select_icon, pc_is_select_icon],
    '_98': [kh_no_select_icon, kh_is_select_icon],
    '_101': [yc_no_select_icon, yc_is_select_icon]
};

var tableColumns = [{
    name: '__checkbox:selectId',
    chkNum: 20
},
    {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-left',
        dataClass: 'text-left'
    },
    {
        name: 'stationId',
        title: '站点编号',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
];
var CheckboxArr = ['aqi', 'pm25', 'pm10', 'co', 'so2', 'o3', 'no2', 'no'];
var surverytable = new Vue({
        el: '#content',
        data: {
            search_down_list: [],
            searchDb: [],
            isShowDownList: false, //是否显示下拉搜索内容框
            fields: tableColumns,
            selectedTo: [],
            itemStation: '',
            chkNum: 20, //选择上限
            selectedStationNum: 0,
            params: [
                'wzz=',
                'khz=',
                'ycz=',
                'pcz=',
                'vocz=',
                'districts=',
                'stationId=',
                'city=' + cityId
            ],
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
            mapOpenStatus: {
                isActive: false,
                noActive: true
            },
            threeKisActive: {
                isActive: true,
                noActive: false
            },
            threeKilometre: "0",//false, //三公里选择
            showPagination: false,
            querypollutionType: ['aqi2', 'aqi', 'pm25', 'pm10', 'co', 'so2', 'o3', 'no2'],
            selecttoggle: 0, //默认勾选全部
            cityName: cityName,
            markers: [], //所有选择的站点信
            isOpen: false, //地图是否打开
            // drawingManager: "",//地图圈选的工具
            stationList: [], //列表加载完成后的数据 信息
            singleMulti: 2, //1 item  类型， 2 axis
            day_startTime: initSEndTime.startTime, //计算kb值的计算范围，开始和结束时间
            day_endTime: initSEndTime.endTime,
            btn_toogle_statue: 0,
            districtList: [],
            khstationList: [],
            wzstationList: [],
            pcstationList: [],
            ycstationList: [],
            wz_all: true,//true为选，false为不选
            district_all: true, //true为选，false为不选
            kh_all: false,
            pc_all: true,
            yc_all: false,
            khli: [],
            wzli: [],
            ycli: [],
            pcli: [],
            districtli: [],
            displayWind: 0, //是否展示风向
            stationId: "", //右侧查询
            stationIdOrName: "", //右侧查询显示ID或者名称
            districts: "0", //选中的行政区域 0 未选择 1 全选  其它 id 字符串
            timeType: "hour", //5minute,10minute,hour;
            layer_id: 0,
            allPpollutionType: ['aqi2', 'aqi', 'pm25', 'pm10', 'co', 'so2', 'o3', 'no2', 'no']
        },
        created: function () {
            var that = this;
            ajax($.coreApiPath + "/monitor/station/" + cityId, {
                parents: ""
            }, function (data) {
                if (data != null) {
                    var wz = data.wz; //微站
                    if (typeof(wz) != undefined && wz.length > 0) {
                        that.fillArray(that.wzstationList, wz);
                        for (var i = 0; i < that.wzstationList.length; i++) {
                            var stationId = that.wzstationList[i].id.toString();
                            that.wzli.push(stationId);
                        }
                    }
                    var kh = data.kh; //考核站
                    if (typeof(kh) != undefined && kh.length > 0) {
                        that.fillArray(that.khstationList, kh);
                    }
                    var pc = data.pc; //爬虫
                    if (typeof(pc) != undefined && pc.length > 0) {
                        that.fillArray(that.pcstationList, pc);
                        for (var i = 0; i < that.pcstationList.length; i++) {
                            var stationId = that.pcstationList[i].id.toString();
                            that.pcli.push(stationId);
                        }
                    }
                    var yc = data.yc; //扬尘
                    if (typeof(yc) != undefined && pc.length > 0) {
                        that.fillArray(that.ycstationList, yc);
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
                    that.dealStationTypeSel();
                    that.getReqParam();
                }
            });
        },
        watch: {
            'day_startTime': function () {
                this.checkTime();
            },
            'day_endTime': function () {
                this.checkTime();
            },
            'selectedTo': function () {
                var _self = this;
                if (_self.selectedTo.length == 0) {
                    _self.threeKilometre = "0";//false;
                    $("#threeKMSel").val("0");//自动绑定无效？
                    _self.btnStatus['mapbtnclear'].noActive = true;
                    _self.btnStatus['mapbtnclear'].isActive = false;
                } else {
                    _self.btnStatus['mapbtnclear'].noActive = false;
                    _self.btnStatus['mapbtnclear'].isActive = true;
                }
                if (_self.selectedTo.length == 1) {
                    _self.threeKisActive['isActive'] = true;
                    _self.threeKisActive['noActive'] = false;
                } else {
                    _self.threeKisActive['noActive'] = true;
                    _self.threeKisActive['isActive'] = false;
                }
                if (_self.isOpen)
                    _self.showSelectMarker();
            },
            querypollutionType: function () {
                var arrLength = this.querypollutionType.length;
                if (arrLength == 9) {
                    this.selecttoggle = 1; //“全选”勾选
                } else if (arrLength != 8) {
                    this.selecttoggle = -1; //取消“全选”勾选
                }
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
            khli: function () {
                if (this.khli.length == this.khstationList.length) {
                    this.kh_all = true;
                } else {
                    this.kh_all = false;
                }
            },
            wzli: function () {
                if (this.wzli.length == this.wzstationList.length) {
                    this.wz_all = true;
                } else {
                    this.wz_all = false;
                }
            },
            pcli: function () {
                if (this.pcli.length == this.pcstationList.length) {
                    this.pc_all = true;
                } else {
                    this.pc_all = false;
                }
            },
            ycli: function () {
                if (this.ycli.length == this.ycstationList.length) {
                    this.yc_all = true;
                } else {
                    this.yc_all = false;
                }
            },
            selecttoggle: function () { //监控“全部”是都勾选
                if (this.selecttoggle == 1) {
                    this.querypollutionType = ['aqi2', 'aqi', 'pm25', 'pm10', 'co', 'so2', 'o3', 'no2', 'no'];
                } else if (this.selecttoggle == 0) {
                    this.querypollutionType = [];
                }
            }
        },
        methods: {
            btnToogleStatue: function () {
                for (var i = 0; i < ChartsArr.length; i++) {
                    ChartsArr[i].resize();
                }
            },
            checkTime: function () {
                var _self = this;
                if (_self.day_startTime == "" || _self.day_endTime == "") return false;
                if (!oneHour(_self.day_startTime, _self.day_endTime)) {
                    $("#1minute").attr("disabled", true);
                    $("#5minute").attr("disabled", true);
                    $("#10minute").attr("disabled", true);
                } else {
                    $('#1minute').removeAttr("disabled");
                    $('#5minute').removeAttr("disabled");
                    $('#10minute').removeAttr("disabled");
                }
            },
            btnStatusChange2: function (str1, str2) {
                var _self = this;
                var obj1 = _self.btnStatus[str1];
                var obj2 = _self.btnStatus[str2];
                obj1.isActive = true;
                obj1.noActive = false;
                obj2.isActive = false;
                obj2.noActive = true;
                if (str1 == 'tooltipDand') {
                    _self.singleMulti = 1;
                    if (_self.displayWind) {
                        $.each(ChartsArr, function (i, char) {
                            var option = {
                                tooltip: tooltip_item_windy()
                            };
                            char.setOption(option);
                        })
                    } else {
                        $.each(ChartsArr, function (i, char) {
                            var option = {
                                tooltip: tooltip_item()
                            };
                            char.setOption(option);
                        })
                    }
                } else if (str1 == 'tooltipMultid') {
                    _self.singleMulti = 2;
                    if (_self.displayWind) {
                        $.each(ChartsArr, function (i, char) {
                            var option = {
                                tooltip: tooltip_axis_windy()
                            };
                            char.setOption(option);
                        })
                    } else {
                        $.each(ChartsArr, function (i, char) {
                            var option = {
                                tooltip: tooltip_axis()
                            };
                            char.setOption(option);
                        })
                    }
                }
            },
            StatusChange: function (str1) {
                var obj;
                obj = this.btnStatus[str1];
                obj.isActive = !obj.isActive;
                obj.noActive = !obj.noActive;
            },
            dealStationTypeSel: function () { //判断传递的站点类型，并勾选对应站点

                try {
                    if (stechType) {
                        //重置全选项
                        this.clk_wz_all();
                        this.pc_all = true;
                        this.clk_pc_all();
                        this.kh_all = true;
                        this.clk_kh_all();
                        this.ycli = [];
                        if (stechType == '6010' || stechType == '1010') //微站
                        {
                            this.wz_all = false;
                            this.clk_wz_all();
                        } else if (stechType == '99') { //爬虫
                            this.pc_all = false;
                            this.clk_pc_all();
                        } else if (stechType == '98') { //考核
                            this.kh_all = false;
                            this.clk_kh_all();
                        } else if (stechType == '101') { //扬尘
                            this.ycli = ['101'];
                        }
                    } else {
                        //console.log("没有跳转");
                    }
                } catch (e) {
                    console.log(e.message);
                }

            },
            calcSCreenSize: function () {
                var widthS = window.innerWidth;
                return widthS;
            },
            calcStationIcon: function (sid, forSelected) {
                var stechType = '';
                if (sid.indexOf(',') > 0) {
                    var sta = sid.split(",");
                    stechType = sta[1];
                }
                else {
                    $.each(this.stationList, function (i, sta) {
                        if (sid == sta.stationId)
                            stechType = sta.s_techType;
                    });
                }
                var icons = stationIcons['_' + stechType];
                if (icons == null)
                    icons = [no_select_icon, is_select_icon];
                return icons[forSelected ? 1 : 0];
            },
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
                        id: "chartsContent",
                        content: $('#mapHtml'),
                        offset: 'l',
                        area: [widthSite, '90%'],
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
                        top: '100px',
                        left: '10px'
                    });
                } else {
                    layer.closeAll(); //疯狂模式，关闭所有层
                }
                this.mapOpenStatus.isActive = !this.mapOpenStatus.isActive;
                this.mapOpenStatus.noActive = !this.mapOpenStatus.noActive;
            },
            initMap: function () {
                var _self = this;
                if (map == "") {
                    map = new BMap.Map("allmap", {
                        minZoom: 8,
                        maxZoom: 14,
                        enableMapClick: false
                    }); // 创建Map实例
                    areaMapPC(cityId);
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
                map.centerAndZoom(_self.cityName, 11); // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

                if (_self.stationList.length > 0) { //如果加载有数据 则显示所有站点信息
                    _self.addMarkers();
                } else {
                    _self.clearMarkers();
                    return false;
                }
                if (_self.markers.length > 0 && _self.selectedTo.length > 0) {
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
                        icon: _self.calcStationIcon(sid, false)//no_select_icon
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
                        $('.BMap_pop>img').hide();
                        if (!station.district) {
                            station.district = '';
                        }
                        if (!station.addr) {
                            station.addr = '';
                        }
                        var icon = _self.calcStationIcon(this.id, true);
                        var iconUrl = icon.imageUrl;
                        //var content = station.stationTypeName + ' ' + station.stationName + ' [' + station.stationId + '] ' + station.district + '<br>' + station.addr;
                        var content = '<div><div>' +
                            '<image style="width:20px;height:20px" src="' + iconUrl + '"></image>' +
                            '<span>' + station.stationName + ' [' + station.stationId + ']</span>' +
                            '<span style="float:right">' + station.stationTypeName + '</span>' +
                            '<div style="padding-top:5px;border-top:solid 1px #eee">' + station.district + ' ' + station.addr + '</div>' +
                            '</div>';
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
                    var icon = no_select_icon;
                    if (this.isSelect) { //取消选中
                        icon = _self.calcStationIcon(this.id, false);//no_select_icon;
                        this.isSelect = false;
                        _self.selectItem(this.id, 0);
                    } else {
                        if (_self.selectedTo.length < 20) {
                            icon = _self.calcStationIcon(this.id, true);//is_select_icon;
                            this.isSelect = true;
                            _self.selectItem(this.id, 1);
                        } else {
                            layer.msg("最多只能选择20个站点！");
                            return false;
                        }
                    }
                    this.setIcon(icon);
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
                _self.selectedTo = [];
                //_self.clearAllChars();
            },
            showSelectMarker: function () {
                var _self = this;
                if (_self.selectedTo.length == 0) {
                    $.each(_self.markers, function (n, obj) {
                        var marker = obj.marker;
                        if (marker.isSelect) {
                            marker.isSelect = false;
                            marker.setIcon(_self.calcStationIcon(marker.id, false));//no_select_icon);
                        }
                    });
                } else {
                    $.each(_self.markers, function (n, obj) {
                        var marker = obj.marker;
                        if (marker.isSelect) {
                            marker.isSelect = false;
                            marker.setIcon(_self.calcStationIcon(marker.id, false));//no_select_icon);
                        }
                        $.each(_self.selectedTo, function (n, val) {
                            var sid = val.split(",")[0];
                            if (sid == obj.id) {
                                marker.isSelect = true;
                                marker.setIcon(_self.calcStationIcon(val, true));//is_select_icon);
                            }
                        });
                    });
                }
            },
            selectItem: function (id, flag) {
                var _self = this;
                if (_self.stationList.length > 0) {
                    $.each(_self.stationList, function (index, val) {
                        if (val.stationId == id && id != "") {
                            if (flag == 1) {
                                _self.$refs.vuetable.selectId(val.selectId);
                            } else {
                                _self.$refs.vuetable.unselectId(val.selectId);
                            }
                        }
                    });
                }
            },
            resiteSelStations: function () {
                var _self = this;
                _self.khli = [];
                _self.wzli = [];
                _self.ycli = [];
                _self.pcli = [];
                _self.districtli = [];
            },
            getReqParam: function () {
                var _self = this;
                _self.params = [
                    'wzz=' + _self.wzli.join(","),
                    'khz=' + _self.khli.join(","),
                    'ycz=' + _self.ycli.join(","),
                    'pcz=' + _self.pcli.join(","),
                    'vocz=',
                    'districts=' + _self.districts,
                    'stationId=' + "",//_self.stationId,
                    'city=' + cityId
                ];
                _self.selectedTo = [];
                _self.$nextTick(function () {
                    _self.$broadcast('vuetable:refresh');
                });
            },
            defaultSelitem: function (id) { //勾选默认传递过来的站点值
                this.$refs.vuetable.selectId(id);
            },
            checkStationInfo: function (ev) {
                if (ev.keyCode != 13) { //非回车键的时候执行
                    var _self = this;
                    if (this.stationIdOrName) {
                        this.search_down_list.splice(0, this.search_down_list.length);
                        for (var i = 0; i < this.searchDb.length; ++i) {
                            var item = this.searchDb[i];
                            if (item.id.indexOf(this.stationIdOrName) != -1){
                                item.text = item.id;
                                this.search_down_list.push(item);
                            } else if(item.text.indexOf(this.stationIdOrName) != -1) {
                                this.search_down_list.push(item);
                            }
                        }
                        if (this.search_down_list.length > 0) {
                            _self.isShowDownList = true; //重置是否展示下拉搜索框的状态 （开启）
                        } else {
                            _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                        }
                    } else {
                        _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                    }
                }
            },
            searchStation: function (stationIdOrName) {
                this.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                var index = stationIdOrName.indexOf('&');
                stationId = stationIdOrName.slice(0,index);
                this.stationIdOrName = stationIdOrName.slice(index+1);
                var cells = $('#station_info_list tbody td');
                cells.css('color', '');
                var found = false;
                $.each(cells, function (i, d) {
                    if (!found && $(d).text().indexOf(stationId) >= 0) {
                        found = true;
                        var staList = $('#station_info_list');
                        staList.scrollTop(staList.scrollTop() + $(d).offset().top - staList.height() / 2);
                        $(d).parent().children('td').css('color', '#f00');
                    }
                });
                if (!found) {
                    layer.msg('没有找到“' + stationId + '”');
                }
            }
            ,
            queryStations: function () { //查询站点信息
                this.getReqParam();
                this.popWindwoShow('categ_popwindow');
            }
            ,
            closeMapRmenu: function () {
                this.btn_toogle_statue = 0; //重置右侧的菜单为关闭状态
                this.toogleContianer(); //关闭右侧的菜单
                this.mapOpenStatus.noActive = false; //重置地图为关闭状态
                this.mapOpenStatus.isActive = true; //重置地图为关闭状态
                this.openMap(); //关闭地图
            }
            ,
            search: function () { //查询拆线信息
                var _self = this;
                if (_self.querypollutionType.length <= 0) {
                    layer.msg("请选择污染物类型！");
                    return;
                }
                if (_self.day_startTime > _self.day_endTime) {
                    layer.msg("开始日期不能大于结束日期！");
                    return;
                }
                if (_self.timeType == 'hour' && !calcDate_interval(_self.day_startTime, _self.day_endTime, '30day')) {
                    return;
                } else if ((_self.timeType == '5minute' || _self.timeType == '10minute') && !calcDate_interval(_self.day_startTime, _self.day_endTime, '1day')) {
                    return;
                } else if (_self.timeType == '1minute' && !calcDate_interval(_self.day_startTime, _self.day_endTime, '1day')) {
                    return;
                }
                if (_self.selectedTo.length <= 0) {
                    layer.msg("请选择要查询的站点，上限为20个！");
                    //_self.clearAllChars();
                    return false;
                }
                var drsStationIds = [];
                var priStationIds = [];
                $.each(_self.selectedTo, function (i, val) {
                    var arr = val.split(",");
                    if (arr[1] == "6010" || arr[1] == '1010') {
                        drsStationIds.push(arr[0]);
                    } else {
                        priStationIds.push(arr[0]);
                    }
                });
                var url = $.coreApiPath + "/detection/list";
                var params = {
                    "city": cityId,
                    "displayWind": _self.displayWind,
                    "drsStationIds": drsStationIds.length > 0 ? drsStationIds.join(",") : "-1",
                    "priStationIds": priStationIds.length > 0 ? priStationIds.join(",") : "-1",
                    "pollutionTypes": _self.querypollutionType.length > 0 ? _self.querypollutionType.join(",") : "",
                    "endTime": _self.day_endTime,
                    "startTime": _self.day_startTime,
                    "timeType": _self.timeType
                };
                _self.closeMapRmenu();
                _self.clearAllChars();
                initLayerLoaderMsg("加载");
                CommonUtil.ajax({
                    type: "post",
                    url: $.coreApiPath + "/detection/list",
                    dataType: "json",
                    data: params,
                    contentType: 'application/json; charset=UTF-8',
                    sucessFn: function (dataMap) {
                        closeLayreLoader();
                        if (_self.displayWind == 0) {
                            initCharsWithoutWindy(dataMap, _self.singleMulti);
                        } else {
                            initCharsWithWindy(dataMap, _self.singleMulti);
                        }
                        //surverytable.closeMapRmenu();
                    },
                    errorFn: function (errorMsg) {
                        _self.clearAllChars();
                        closeLayreLoader();
                        //surverytable.closeMapRmenu();
                        layer.msg('请求失败！');
                    }
                });
            }
            ,
            clearAllChars: function () {
                var _self = this;
                for (var i = 0; i < _self.allPpollutionType.length; i++) {
                    disposeChar("dataChart-" + _self.allPpollutionType[i]);
                    $("#char-" + _self.allPpollutionType[i]).hide();
                }
            }
            ,
            clk_kh_all: function () {
                var _self = this;
                if (!_self.kh_all) {
                    for (var i = 0; i < _self.khstationList.length; i++) {
                        var stationId = _self.khstationList[i].id.toString();
                        _self.khli.push(stationId);
                    }
                } else {
                    _self.khli = [];
                }
            }
            ,
            clk_district_all: function () {
                var _self = this;
                if (!_self.district_all) {
                    for (var i = 0; i < _self.districtList.length; i++) {
                        var stationId = _self.districtList[i].id.toString();
                        _self.districtli.push(stationId);
                    }
                } else {
                    _self.districtli = [];
                }
            }
            ,
            addActiveClass: function (index) {
                $('.time_btn .btn-time').removeClass("btn-tabinfo");
                $('.time_btn .btn-time').removeClass("btn-white");
                $('.time_btn .btn-time').addClass("btn-white");
                $('.time_btn .btn-time:eq(' + (index - 1) + ')').addClass('btn-tabinfo');
                $('.time_btn .btn-time:eq(' + (index - 1) + ')').removeClass('btn-white');
            }
            ,
            showType: function (type) {
                var _self = this;
                _self.addActiveClass(type);
                $("#diplayWin").attr("disabled", true);
                if (type == 1) {
                    _self.timeType = "1minute";
//              _self.khli = [];
//              _self.ycli = [];
//              _self.pcli = [];
                    _self.removelayWin();
                } else if (type == 2) {
                    _self.timeType = "5minute";
//              _self.khli = [];
//              _self.ycli = [];
//              _self.pcli = [];
                    _self.removelayWin();
                } else if (type == 3) {
                    _self.timeType = "10minute";
//              _self.khli = [];
//              _self.ycli = [];
//              _self.pcli = [];
                    _self.removelayWin();
                } else if (type == 4) {
                    _self.timeType = "hour";
                    $('#diplayWin').removeAttr("disabled");
                }
                _self.search();
            }
            ,
            removelayWin: function () {
                $("#diplayWin").removeClass("btn-tabinfo").addClass("btn-white");
                this.displayWind = 0;
            }
            ,
            diplayWin: function () {
                var _self = this;
                if ($("#diplayWin").hasClass("btn-tabinfo")) {
                    $("#diplayWin").removeClass("btn-tabinfo").addClass("btn-white");
                    _self.displayWind = 0;
                } else {
                    $("#diplayWin").removeClass("btn-white").addClass("btn-tabinfo");
                    _self.displayWind = 1;
                }
                _self.search();
            }
            ,
            clk_wz_all: function () {
                var _self = this;
                if (!_self.wz_all) {
                    for (var i = 0; i < _self.wzstationList.length; i++) {
                        var stationId = _self.wzstationList[i].id.toString();
                        _self.wzli.push(stationId);
                    }
                } else {
                    _self.wzli = [];
                }
            }
            ,
            clk_pc_all: function () {
                var _self = this;
                if (!_self.pc_all) {
                    for (var i = 0; i < _self.pcstationList.length; i++) {
                        var stationId = _self.pcstationList[i].id.toString();
                        _self.pcli.push(stationId);
                    }
                } else {
                    _self.pcli = [];
                }
            }
            ,
            clk_yc_all: function () {
                var _self = this;
                if (!_self.yc_all) {
                    for (var i = 0; i < _self.ycstationList.length; i++) {
                        var stationId = _self.ycstationList[i].id.toString();
                        _self.ycli.push(stationId);
                    }
                } else {
                    _self.ycli = [];
                }
            }
            ,
            fillArray: function (arr, data) {
                for (var i = 0; i < data.length; i++) {
                    var code = {
                        id: data[i].code,
                        name: data[i].name
                    };
                    arr.push(code);
                }
            }
            ,
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
                    $("#layui-layer" + this.layer_id).css("width", (this.calcSCreenSize() - 200) + "px");
                    $('.panel-left').removeClass('min-sucerData-left');
                    $('.panel-right').removeClass('rel-list-zcontent-hide');
                    $('.rel-btn-toogle').removeClass('rel-btn-toogle-hide');
                    $('.rel-btn-toogle span').addClass('btn-jt-right');
                    this.btn_toogle_statue = 0;
                }
                this.btnToogleStatue();
            }
            ,
            popWindwoShow: function (id) {
                $('#' + id).toggle();
            }
            ,
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
                        var temp = _self.selectedTo;
                        $.each(temp, function (i, item) {
                            var sid = item.split(",")[0];
                            if (!slt_overlays.hasVal(sid)) {
                                slt_overlays.push(sid);
                            }
                        })
                        if (slt_overlays.length > 20) {
                            layer.msg("最多只能选择20个站点！");
                            return;
                        } else {
                            $.each(_self.markers, function (n, obj) {
                                var marker = obj.marker;
                                if (marker.isSelect) {
                                    marker.isSelect = false;
                                    marker.setIcon(_self.calcStationIcon(marker.id, false));//no_select_icon);
                                }
                                $.each(slt_overlays, function (j, stationId) {
                                    if (stationId == obj.id) {
                                        marker.isSelect = true;
                                        marker.setIcon(_self.calcStationIcon(marker.id, true));//is_select_icon);
                                        _self.selectItem(stationId, 1);
                                    }
                                });
                            });
                        }
                    }
                });
            }
            ,
            threeKM: function (event) {
                var _self = this;
                if (map == "") {
                    _self.initMap();
                }
                if (_self.threeKilometre != "0") {
                    if (_self.selectedTo == 0) {
                        layer.msg("请选择一个扩大半径的中心点！");
                        return false;
                    } else if (_self.selectedTo.length > 1) {
                        layer.msg("只能选择一个中心点！");
                        return false;
                    } else {
                        var sid = _self.selectedTo[0].split(",")[0];
                        var containPoints = [];
                        $.each(_self.stationList, function (index, item) {
                            if (item.stationId == sid && sid != "") { //查找站点获取经纬度
                                var point = new BMap.Point(item.lng, item.lat);
                                var bounds = getBounds(map, point, _self.threeKilometre);//3000);
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
                        if (containPoints.length <= 1) {
                            //layer.msg("3公里内未关联到相关站点！");
                            layer.msg($("#threeKMSel option:selected").text() + "内未关联到相关站点！");
                            return false;
                        } else {
                            var temp = _self.selectedTo;
                            $.each(temp, function (i, item) {
                                var sid = item.split(",")[0];
                                if (!containPoints.hasVal(sid)) {
                                    containPoints.push(sid);
                                }
                            });
                            if (containPoints.length > 20) {
                                _self.threeKilometre = "0";
                                $("#threeKMSel").val("0");//自动绑定无效？
                                event.target.checked = false;
                                ////////修改三公里的，展示样式
                                this.threeKisActive['noActive'] = false;
                                this.threeKisActive['isActive'] = true;
                                layer.msg("最多只能选择20个站点！");
                                return false;
                            } else {
                                $.each(_self.markers, function (n, obj) {
                                    var marker = obj.marker;
                                    if (marker.isSelect) {
                                        marker.isSelect = false;
                                        marker.setIcon(_self.calcStationIcon(marker.id, false));//no_select_icon);
                                    }
                                    $.each(containPoints, function (j, stationId) {
                                        if (stationId == obj.id) {
                                            marker.isSelect = true;
                                            marker.setIcon(_self.calcStationIcon(marker.id, true));//is_select_icon);
                                            _self.selectItem(stationId, 1);
                                        }
                                    });
                                });
                                ////////修改三公里的，展示样式
                                this.threeKisActive['isActive'] = true;
                                this.threeKisActive['noActive'] = false;
                                _self.singleSelected = "";
                                //_self.threeKilometre = "0";
                                //$("#threeKMSel").val("0");//自动绑定无效？
                            }
                        }
                    }
                }
            }
        },
        events: {
            'vuetable:load-success':

                function (response) {
                    var _self = this;
                    if (response.erroCode == 2000) {
                        _self.stationList = response.result.data;
                        _self.initMap();
                        if (_self.searchFor !== '' && _self.stationList.length > 0) {
                            for (i in _self.stationList) {
                                if (_self.stationList[i].stationId == stationId && stationId != "") {
                                    stationId = _self.stationList[i].selectId;
                                    _self.defaultSelitem(stationId);
                                    //从实时监测、告警跳转过来时，不直接搜索    this.search();
                                    $('#station_info_list').scrollTop(i * 33); //将滚动条滚动到指定的位置
                                    return;
                                }
                            }
                        }
                        //数据保存到搜索库
                        this.searchDb.splice(0, this.searchDb.length);
                        for (var i = 0; i < this.stationList.length; ++i) {
                            this.searchDb.push({
                                id: this.stationList[i].stationId,
                                text: this.stationList[i].stationName
                            });
                        }
                    } else {
                        _self.stationList = [];
                        _self.initMap();
                    }
                }
        }
    })
;

function openDrawingManager() {
    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    drawingManager.open();
    surverytable.StatusChange('mapbtnCirclex');
}

function clearSelectMarker() {
    surverytable.clearSelectMarker();
    // surverytable.StatusChange('mapbtnclear');
}

function removeStationid(val) {
    for (var i = 0; i < surverytable.selectedTo.length; i++) {
        if (val == surverytable.selectedTo[i]) {
            surverytable.selectedTo.splice(i, 1);
        }
    }
}

$(document).bind('click', function (e) {
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    while (elem) {
        if (elem.id && elem.id == 'category-station') {
            return;
        }
        elem = elem.parentNode;
    }
    $('.categ_popwindow').hide();
})

/**
 * 有风向叠加
 * @param dataMap
 */
function yaxisTitle(key) {
    var chartsTitle = titlePollution(key);
    switch (key) {
        case 'co': {
            chartsTitle += ' (mg/m³)';
        }
            break;
        case 'no':
        case 'no2':
        case 'o3':
        case 'pm10':
        case 'pm25':
        case 'so2': {
            chartsTitle += ' (μg/m³)';
        }
            break;
        case 'aqi2': {
            chartsTitle = "AQI";
        }
            break;
        case 'aqi': {
            chartsTitle = "标准AQI";
        }
            break;
    }
    return chartsTitle;
}

var dims = {};
var keys = {};
var lend_windy = [];

function initCharsWithWindy(dataMap, singleMulti) {
    ChartsArr = [];
    keys = dataMap.keys;
    // lend = new Array();
    var directionMap = {};
    echarts.util.each(
        ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'],
        function (name, index) {
            directionMap[name] = Math.PI / 8 * index;
        }
    );
    dims = {};
    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];
        dims[key] = i;
        if (i > 3) {
            lend_windy[i - 4] = key.split("$")[1];
        }
    }
    var arrowSize = 18;
    var weatherIconSize = 45;

    function renderArrow(param, api) {
        var point = api.coord([
            api.value(dims.time),
            api.value(dims.windSpeed)
        ]);
        return {
            type: 'path',
            shape: {
                pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                x: -arrowSize / 2,
                y: -arrowSize / 2,
                width: arrowSize,
                height: arrowSize
            },
            rotation: directionMap[api.value(dims.R)],
            position: point,
            style: api.style({
                stroke: '#555',
                lineWidth: 1
            })
        };
    }

    //遍历数组信息
    $.each(dataMap.series, function (key, values) {
        var rowData = values;
        if (rowData.length > 0) {

            var windData = echarts.util.map(rowData, function (entry) {
                var arr = new Array()
                for (var i in keys) {
                    if (i < 4) {
                        var key = keys[i];
                        arr[i] = entry[key];
                    }
                }
                return arr;
            });


            var lineData = echarts.util.map(rowData, function (entry) {
                var arr = new Array()
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var rdata = entry[key];
                    if ((rdata + "").indexOf("*") != -1) {
                        var d2 = parseInt(rdata.replace(/[*]/ig, ""));
                        if (isNaN(d2)) {
                            d2 = "-";
                        }
                        arr[i] = d2;
                        arr[keys.length + i] = "*";

                    } else {
                        arr[i] = rdata;
                        arr[keys.length + i] = "-";
                    }


                }
                return arr;
            });

            option = {
                legend: {
                    top: 30,
                    data: lend_windy
                },
                tooltip: singleMulti == 1 ? tooltip_item_windy() : tooltip_axis_windy(),
                toolbox: toolBox_dataZoom(),
                dataZoom: dataZoom_inside,
                grid: {
                    top: 95,
                    bottom: 66,
                    left: 80,
                    right: 50
                },
                xAxis: {
                    type: 'time',
                    maxInterval: 3600 * 1000 * 24,
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                visualMap: {
                    type: 'piecewise',
                    show: false,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 10,
                    pieces: [{
                        lt: 999,
                        color: '#3095FF',
                        label: '微风（小于 999 m/s）'
                    }],
                    seriesIndex: 0,
                    dimension: 1
                },
                yAxis: [{
                    name: yaxisTitle(key),
                    nameLocation: 'middle',
                    nameGap: 50,
                    boundaryGap: [0, 0.1],
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                }, {
                    name: '风速（m/s）',
                    nameLocation: 'middle',
                    nameGap: 28,
                    boundaryGap: [0, 0.1],
                    axisLine: {
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                }],
                series: [{
                    yAxisIndex: 1,
                    type: 'custom',
                    renderItem: renderArrow,
                    encode: {
                        x: dims.time,
                        y: dims.windSpeed
                    },
                    data: windData,
                    z: 3
                },
                    {
                        yAxisIndex: 1,
                        type: 'line',
                        symbol: 'none',
                        encode: {
                            x: dims.time,
                            y: dims.windSpeed
                        },
                        lineStyle: {
                            normal: {
                                color: '#aaa',
                                type: 'dotted'
                            }
                        },
                        data: windData,
                        z: 1
                    }
                ]
            };

            $.each(keys, function (i, val) {
                console.log(i, val)
                if (i >= 4) {
                    option.series[i - 2] = {
                        yAxisIndex: 0,
                        type: 'line',
                        name: val.split("$")[1],
                        encode: {
                            x: dims.time,
                            y: dims[val]
                        },
                        symbolSize: 5,
                        data: lineData,
                        itemStyle: {
                            normal: {
                                color: myColors[i - 4]
                            },
                            emphasis: {
                                color: myColors[i - 4]
                            }
                        },
                        z: 10
                    };
                }
            });

            $("#char-" + key).show();
            var chartId = "dataChart-" + key;
            var e1 = echarts.init(document.getElementById(chartId));
            e1.hideLoading();
            e1.group = 'group1';
            e1.setOption(option);
            ChartsArr.push(e1);
        }
        echarts.connect('group1');
    });
}

//排序
function dataSort(data) {
    var compare = function (obj1, obj2) {
        var val1 = obj1.value[1] == '--' ? 0 : obj1.value[1],
            val2 = obj2.value[1] == '--' ? 0 : obj2.value[1];
        if (val1 < val2) { //val1 放于val2 之后
            return 1;
        } else if (val1 > val2) { //val1 放于val2 之前
            return -1;
        } else {
            return 0;
        }
    };
    return data.sort(compare);
}

function dataSortWind(data) {
    var compare = function (obj1, obj2) {
        var val1 = obj1.value == '--' ? 0 : obj1.value,
            val2 = obj2.value == '--' ? 0 : obj2.value;
        if (val1 < val2) { //val1 放于val2 之后
            return 1;
        } else if (val1 > val2) { //val1 放于val2 之前
            return -1;
        } else {
            return 0;
        }
    };
    return data.sort(compare);
}

//无风向叠加 @param dataMap
function initCharsWithoutWindy(dataMap, singleMulti) {
    ChartsArr = [];
    var j = 0;
    $.each(dataMap, function (key, values) {
        var result = values;
        var option = {
            tooltip: singleMulti == 1 ? tooltip_item() : tooltip_axis(),
            toolbox: toolBox_dataZoom(),
            dataZoom: dataZoom_inside,
            legend: {
                top: 30,
                data: []
            },
            grid: {
                top: 95,
                bottom: 66,
                left: 80,
                right: 20
            },
            xAxis: [{
                type: "category",
                boundaryGap: !1,
                data: [],
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            }],
            yAxis: [{
                name: yaxisTitle(key),
                nameLocation: 'middle',
                nameGap: 50,
                boundaryGap: [0, 0.1],
                type: "value",
                axisLabel: {
                    formatter: "{value}"
                },
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            }],
            series: []
        };
        //////////////////////////////

        var category = result.category;
        var series = result.series;

        option.legend.data = result.legend;
        option.xAxis[0].data = category;

        if (series.length > 0) {
            $.each(series, function (inx, val) {
                var sdata = val.data;
                var dd = [];
                for (var i = 0; i < sdata.length; i++) {
                    if ((sdata[i] + "").indexOf("*") != -1) {
                        var d2 = parseInt(sdata[i].replace(/[*]/ig, ""));
                        if (isNaN(d2)) {
                            d2 = "-";
                        }
                        dd[i] = [category[i], d2, "*"];
                    } else {
                        dd[i] = [category[i], sdata[i], 0];
                    }
                }
                var arr = {
                    name: val.name,
                    type: 'line',
                    data: dd,
                    symbolSize: 5, encode: {
                        x: 0,
                        y: 1
                    },
                    itemStyle: {
                        normal: {
                            color: myColors[inx]
                        },
                        emphasis: {
                            color: myColors[inx]
                        }
                    }
                };
                option.series.push(arr)


            });

            $("#char-" + key).show();
            var myChar = echarts.init(document.getElementById("dataChart-" + key));
            myChar.hideLoading();
            myChar.group = 'group1';
            myChar.setOption(option);
            ChartsArr.push(myChar);
        }


        echarts.connect('group1');
    });
}


function oneHour(start, end) {
    var get_s_time = new Date(end),
        get_e_time = new Date(start);
    if ((get_s_time - get_e_time) <= 1000 * 60 * 60 * 24) {
        return true;
    } else {
        return false;
    }
}