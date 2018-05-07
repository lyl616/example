// var areaFlag = "1";    //地区标识:1.省；2.市；
var proId = "0"; //省ID，1->省；2->市；
var cityType = "1"; //1.2+26;2.74;3.338
var timeType = 'month';
var go_to = false;

var currentDate = new Date(dayDecre(new Date(), 1));
var day = currentDate.getDate();


var days = getDaysOfYear(currentDate);

var initSETime = {
    month: {
        startTime: initDateTime('month').start,
        endTime: initDateTime('month').end
    },
    year: {
        startTime: initDateTime('year').start,
        endTime: initDateTime('year').end
    },
    custom: {
        startTime: initDateTime('custom').start,
        endTime: initDateTime('custom').end
    }
};

//groupclass 同一个按钮组的class ，index 处于当前组的下标
function addActivebtn(groupclass, index, fg, hideClass) {
    $('.' + groupclass).removeClass('btn-tabinfo');
    $('.' + groupclass + ":eq(" + index + ")").addClass('btn-tabinfo');
    if (fg != 'undefined' && fg) {
        $('.' + hideClass).show();
    } else if (fg != 'undefined' && fg == false) {
        $('.' + hideClass).hide();
    }
}

function addUiBtn(groupclass, index, fg, hideClass) {
    $('.' + groupclass).removeClass('btn-focus');
    $('.' + groupclass + ":eq(" + index + ")").addClass('btn-focus');
    if (fg != 'undefined' && fg) {
        $('.' + hideClass).show();
    } else if (fg != 'undefined' && fg == false) {
        $('.' + hideClass).hide();
    }
}

Vue.component("mycontent", {
    props: ['timetype', 'idx'],
    data: function () {
        return {
            start: "",
            end: ''
        }
    },
    created: function () {
        this.toggle();
    },
    methods: {
        toggle: function () {
            this.$options._linkerCachable = false;
            var temp = makeHtml(this.timetype, this.idx);
            this.$options.template = temp;
        },
        monthYear: function (data, index) {
            var _self = this;
            if (_self.timetype == 'year') {
                addActivebtn('grounp_' + this.idx, 2 - index);
                addActivebtn('grounp_' + this.idx, 2 - index);

            } else if (_self.timetype == 'month') {
                addActivebtn('grounp_' + this.idx, 11 - index);
                addActivebtn('grounp_' + this.idx, 11 - index);
            }
            _self.$dispatch('vuetable:monthYear', data);
        },
        customChange: function (flag) {
            var _self = this;
            _self.$dispatch('vuetable:coustomTime', flag, flag == 4 ? _self.end : _self.start);
        },
        customMonth: function () {
            var _self = this;
            WdatePicker({
                dateFmt: 'yyyy-MM',
                maxDate: '%y-%M',
                autoPickDate: true,
                isShowClear: false,
                onpicked: function () {
                    $(this).blur();
                    _self.customChange(1);
                }
            });
        },
        customYear: function () {
            var _self = this;
            WdatePicker({
                dateFmt: 'yyyy',
                maxDate: '%y',
                autoPickDate: true,
                isShowClear: false,
                onpicked: function () {
                    $(this).blur();
                    _self.customChange(2);
                }
            });
        },
        customStart: function () {
            var _self = this;
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                maxDate: '%y-%M-%d',
                autoPickDate: true,
                isShowClear: false,
                onpicked: function () {
                    $(this).blur();
                    _self.customChange(3);
                }
            });
        },
        customEnd: function () {
            var _self = this;
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                maxDate: '%y-%M-%d',
                isShowClear: false,
                autoPickDate: true,
                onpicked: function () {
                    $(this).blur();
                    _self.customChange(4);
                }
            });
        }
    },
    template: ''
});

Vue.component(
    'custom-action', {
        template: [
            '<a  href="javascript:void(0)" @click="itemAction(\'view\', rowData)">{{rowData.proName}}</a> '
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
                    this.$dispatch('vuetable:rank', data, 'view');
                }
            }
        }
    });

var dayRank_tableColumns = [
    {
        name: '__sequence',
        title: '排序',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'showDetailRow'
    }, {
        name: 'proName',
        title: '省',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'proView'
    }, {
        name: 'cityName',
        visible: true,
        title: '市',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'currentTotal',
        title: '天数',
        sortField: 'currentTotal',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'tongbiRate',
        sortField: 'tongbiRate',
        title: '同比',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'tongBiView'
    }, {
        name: 'huanbiRate',
        title: '环比',
        sortField: 'huanbiRate',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'tongBiView'
    }, {
        name: 'tongbiRank',
        title: '历史同期排名',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }];

Vue.config.debug = false;

/**
 * 重污染天数VUE
 */
var Zdayrank = new Vue({
    el: '#tab-Zdayrank',
    data: {
        dayRank_fields: dayRank_tableColumns,
        dayRank_perPage: 10,
        proId: proId,
        cityType: cityType,
        dayRank_totalDays: '',
        dayRankHtml: "",
        dayRank_timeType: timeType, //month; year; custom
        dayRank_startTime: initSETime.month.startTime,
        dayRank_endTime: initSETime.month.endTime,
        dayRank_pageList: [10, 20, 30, 40, 50],
        content: [10, 20, 30, 40, 50],
        dayRank_sortOrder: [{
            field: 'currentTotal',
            direction: 'desc',
        }],
        multiSort: true,
        dayRank_params: [
            'proId=' + this.proId, "cityType=" + this.cityType, 'timeType=' + timeType, 'startTime=' + initSETime.month.startTime, 'endTime=' + initSETime.month.endTime
        ]
    },
    created: function () {
    },
    events: {
        'vuetable:monthYear': function (data) {
            var _self = this;
            if (data != "") {
                _self.dayRank_startTime = new Date(data).Format("yyyy-MM-dd");
                _self.dayRank_endTime = new Date(data).Format("yyyy-MM-dd");
                _self.refreshTab();
            }
        },
        'vuetable:coustomTime': function (flag, data) {
            var _self = this;
            if (data != "") {
                if (flag == 1 || flag == 2) {
                    //月年
                    _self.dayRank_startTime = new Date(data).Format("yyyy-MM-dd");
                    _self.dayRank_endTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 3) {
                    _self.dayRank_startTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 4) {
                    _self.dayRank_endTime = new Date(data).Format("yyyy-MM-dd");
                }
            }
        },
        'vuetable:rank': function (data, action) {
            var _self = this;
            if (action === 'view') {
                var _self = this;
                _self.proId = data.pro;
                $("#dayRankBack").show();
                _self.refreshTab();
            }
        },
        'vuetable:cell-clicked': function (data, field, event) {
            if (field.name == 'proName' && this.proId == '0') {
                this.oneProRank(data);
            }
        }
    },
    watch: {
        dayRank_startTime: function () {

            var _self = this;
            if (_self.dayRank_timeType == 'month' || _self.dayRank_timeType == 'year') {

                _self.refreshTab();
            } else if (_self.dayRank_timeType == 'custom') {
                if (_self.dayRank_startTime.length < 1 || _self.dayRank_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }

                if (_self.dayRank_startTime > _self.dayRank_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refreshTab();
            }
        },
        dayRank_endTime: function () {
            var _self = this;
            if (_self.dayRank_timeType == 'custom') {
                if (_self.dayRank_startTime.length < 1 || _self.dayRank_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }

                if (_self.dayRank_startTime > _self.dayRank_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refreshTab();
            }
        },
        'dayRank_perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        }
    },
    methods: {
        proView: function (val) {
            return this.proId == "0" ? '<a href="javascript:void(0)">' + val + '</a>' : val;
        },
        tongBiView: function (val) {
            if (val < 0) {
                return '<span class="align-right">' + val + '%</span><b class="arrow-green-up"></b>';
            } else if (val > 0) {
                return '<span class="align-right">' + val + "%</span><b class='arrow-red-dow'></b>";
            } else {
                return '<span class="align-right">' + val + '</span><b></b>';
            }
        },
        oneProRank: function (rowData) {
            this.proId = rowData.pro;
            $("#dayRankBack").show();
            this.refreshTab();
        },
        dayRankBack: function () { //返回
            var _self = this;
            $("#dayRankBack").hide();
            _self.proId = "0";
            _self.refreshTab();
        },
        dayRankMonth: function (i) { //按月查询
            var _self = this;
            addActivebtn('grounp_04', 0);

            _self.dayRank_timeType = "month";
            _self.dayRank_startTime = new Date(monthDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.dayRank_endTime = _self.dayRank_startTime;

            // _self.refreshTab();

        },
        dayRankYear: function (i) { //按年查询
            var _self = this;
            addActivebtn('grounp_04', 1);
            _self.dayRank_timeType = "year";

            _self.dayRank_startTime = new Date(yearDecre2(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.dayRank_endTime = _self.dayRank_startTime;

            // _self.refreshTab();

        },
        dayRankCustom: function (i) { // 任意查询
            var _self = this;
            addActivebtn('grounp_04', 2);
            _self.dayRank_timeType = "custom";

            _self.dayRank_endTime = new Date(dayDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.dayRank_startTime = new Date(monthDecre(_self.dayRank_endTime, 6)).Format("yyyy-MM-dd");

            // _self.refreshTab();

        },
        dayRankPro: function () { //按省份查询 ，默认月
            var _self = this;
            addActivebtn('grounp_02', 0, false, 'num_2');
            addActivebtn('grounp_04', 0);
            _self.proId = "0";
            _self.cityType = "0";
            _self.dayRank_timeType = "custom";

            _self.refreshTab();
        },
        dayRankCity: function () { //按城市 查询
            // var _self = this;
            // $("#dayRankBack").hide();
            // addActivebtn('grounp_02', 1, true, 'num_2');
            // addActivebtn('grounp_04', 0);
            // addActivebtn('grounp_03', 0);
            // _self.proId = "0";
            // _self.cityType = "1";
            // _self.dayRank_timeType = "month";
            //
            //
            // _self.refreshTab();
        },
        dayRankCityType: function (i, j) { //切换城市类型
            var _self = this;
            addActivebtn('grounp_03', i - 1);
            _self.cityType = i;
            _self.refreshTab();
        },
        toggleBtnStatue: function (index) {
            var bestID = document.getElementById('day_best10_echart'),
                badID = document.getElementById('day_bad10_echart');
            if (index) { //最优
                bestID.style.opacity = '1';
                bestID.style.zIndex = '999';
                badID.style.opacity = '0';
                badID.style.zIndex = '1';
                addUiBtn('grounp_01', 0);

            } else { //最差
                badID.style.opacity = '1';
                badID.style.zIndex = '999';
                bestID.style.zIndex = '1';
                bestID.style.opacity = '0';
                addUiBtn('grounp_01', 1);
            }
        },
        initBestChart: function () { //最好
            var _self = this;
            var postData = {
                proId: _self.proId,
                cityType: _self.cityType,
                timeType: _self.dayRank_timeType,
                startTime: new Date(_self.dayRank_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(_self.dayRank_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/best/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    initZdayrankChar(data, "day_best10_echart", _self.cityType);
                },
                errorFn: function (errorMsg) {
                    closeLayreLoader();
                    layer.msg('请求失败！');
                }
            });

        },
        initBadChart: function () { //最差
            var self = this;
            var postData = {
                proId: self.proId,
                cityType: self.cityType,
                timeType: self.dayRank_timeType,
                startTime: new Date(self.dayRank_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.dayRank_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/worst/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    initZdayrankChar(data, "day_bad10_echart", self.cityType);
                }
            });

        },
        initBeterChart: function () { //改善率
            var self = this;
            var postData = {
                proId: self.proId,
                cityType: self.cityType,
                timeType: self.dayRank_timeType,
                startTime: new Date(self.dayRank_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.dayRank_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/rate/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    init_beter_echart(data, "day_beter10_echart", self.cityType);

                }
            });
        },
        refreshTab: function () {
            this.$nextTick(function () {
                this.$broadcast('vuetable:clearTable');
            });
            var _self = this;
            disposeChar("day_best10_echart");
            disposeChar("day_bad10_echart");
            disposeChar("day_beter10_echart");


            if (!calcDate_interval(_self.dayRank_startTime, _self.dayRank_endTime, 'year')) {
                return false;
            }

            // _self.refreshRankColumn();
            _self.initBestChart(); //初始化最好图表
            _self.initBadChart(); //初始化最差的图表
            _self.initBeterChart(); //改善率图表
            _self.initDays();
            _self.dayRank_params = ['proId=' + _self.proId, 'timeType=' + _self.dayRank_timeType, "cityType=" + _self.cityType,
                "startTime=" + _self.dayRank_startTime, "endTime=" + _self.dayRank_endTime];

            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });
        },
        refreshRankColumn: function () {
            var _self = this;
            if (_self.cityType == "0") {

                for (var i = 0; i < _self.dayRank_fields.length; i++) {
                    var fid = _self.dayRank_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = false;
                    }
                    if (fid.name == "proName") {
                        fid.name = '__component:custom-action';
                    }
                }
            } else {

                for (var i = 0; i < _self.dayRank_fields.length; i++) {
                    var fid = _self.dayRank_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = true;
                    }

                    if (fid.name == '__component:custom-action') {
                        fid.name = "proName";
                    }
                }
            }
        },
        initDays: function () {
            var sel = this;
            if (sel.dayRank_timeType == "month") {
                sel.dayRank_totalDays = showTimeDiff(sel.dayRank_timeType, sel.dayRank_startTime) + '天';
            } else if (sel.dayRank_timeType == "year") {
                sel.dayRank_totalDays = showTimeDiff(sel.dayRank_timeType, sel.dayRank_startTime) + '天';
            } else {
                sel.dayRank_totalDays = GetDateDiff(sel.dayRank_endTime, sel.dayRank_startTime) + '天';
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

/**
 * 初始化 最优最差 chars
 * @param data
 * @param id
 * @param flag     //省ID，1->省；2->市；
 */
function initZdayrankChar(data, id, flag) {

    var myChart = echarts.init(document.getElementById(id));
    var titleTemp = "省份TOP10排名";
    if (flag != "0") {
        titleTemp = "城市TOP10排名";
    }
    var option = {
        title: {
            text: titleTemp, //此值根据城市和省份的选项，切换为 省份TOP10，城市TOP10
            textStyle: {
                fontSize: '12'
            },
            left: '35%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params))
                var itemName = obj[0].name;
                var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";

                for (var i = 0; i < obj.length; i++) {
                    str = str + "<div class=\"tooltip-data\" ><b style=\"color: " + obj[i].color + ";\"> &bull;</b> " +
                        obj[i].seriesName + ":" + obj[i].value + "</div><br/> ";
                }
                return str;
            }
        },
        color: ['#2F6DBA', '#00BFE4', '#00DCD8'],
        legend: {
            data: ['当前', '同期', '上期'],
            right: '10px',
            selectedMode: false
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: data.nameList,
            // splitNumber: 10,
            axisLabel: {
                interval: 0,
                rotate: '30',
                margin: 8
            },
            textStyle: {
                color: '#fff',
                fontSize: '10'
            }
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: ['0%', '5%'],
        }],
        series: [{
            name: '当前',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: "#2F6DBA"
                }
            },
            data: data.currentTotalList
        },
            {
                name: '同期',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: "#00BFE4"
                    }
                },
                data: data.tongbiTotalList
            },
            {
                name: '上期',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: "#00DCD8"
                    }
                },
                data: data.huanbiTotalList
            }
        ]
    };
    myChart.setOption(option);
}

/**
 * 初始化改善率问题
 * @param data
 * @param id
 */
function init_beter_echart(data, id, flag) {
    var myChart = echarts.init(document.getElementById(id));
    var title = '省份改善TOP5排名';
    if (flag != "0") {
        title = '城市改善TOP5排名';
    }
    var option = {
        title: {
            text: title,
            textStyle: {
                fontSize: '12'
            },
            left: 'center'
        },
        legend: {
            data: [{
                name: ' ',
                icon: 'image://' + $.ctx + '/resources/img/gaisan.png',
                onclick: function () {

                }
            }],
            right: '4%',
            itemWidth: 120,
            selectedMode: false
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var obj = JSON.parse(JSON.stringify(params));
                var data = obj[0].data;
                var ld = "改善率";
                if (data >= 0) {
                    ld = "改善率";
                } else {
                    ld = "恶化率";
                }
                return obj[0].name + "<br/> <b style=\"color: " + obj[0].color + ";\"> &bull;</b>  " + ld + "  : " + Math.abs(data) + "%";
            }
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: '30',
                margin: 8
            },
            textStyle: {
                color: '#fff',
                fontSize: '10'
            },
            data: data.nameList
        }],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            },
            boundaryGap: ['0%', '5%'],

        },
        series: [{
            name: ' ',
            type: 'bar',
            barWidth: '22',
            data: data.rateList,
            itemStyle: {
                normal: {
                    color: function (params) {
                        // if (params.dataIndex > 4) {
                        if (params.data >= 0) {
                            //最差
                            return '#71E0B9';
                        } else {
                            //最好
                            return '#EF6E83';
                        }
                    }
                }
            }
        }]
    };

    myChart.setOption(option);
}

/************************************************************/

var proIdB = "0"; //省ID，1->省；2->市；
var cityTypeB = "1"; //1.2+26;2.74;3.338
/**
 * 优良天数VUE
 */
var excellentDayrank = new Vue({
    el: '#tab-ExcellentDayrank',
    data: {
        drate_fields: dayRank_tableColumns,
        drate_sortOrder: [{
            field: 'currentTotal',
            direction: 'desc',
        }],
        drate_totalDays: '',
        multiSort: true,
        proId: proIdB,
        cityType: cityTypeB,
        drate_timeType: timeType,//时间类型: hour;day;month;year
        drate_startTime: initSETime.month.startTime,
        drate_endTime: initSETime.month.endTime,
        drate_perPage: 10,
        drate_pageList: [10, 20, 30, 40, 50],
        drate_params: [
            'proId=' + this.proId, 'timeType=' + timeType, "cityType=" + this.cityType, "startTime=" + initSETime.month.startTime,
            "endTime=" + initSETime.month.endTime
        ]
    },
    created: function () {
        // this.initDrateBestChart(); //初始化最好图表
        // this.initDrateBadChart(); //初始化最差的图表
        // this.initDrateBeterChart(); //改善率图表
        // this.initDrateDays();
    },
    events: {
        'vuetable:monthYear': function (data) {
            var _self = this;
            if (data != "") {
                _self.drate_startTime = data;
                _self.drate_endTime = data;
            }
        }, 'vuetable:coustomTime': function (flag, data) {
            var _self = this;
            if (data != "") {
                if (flag == 1 || flag == 2) {
                    //月年
                    _self.drate_startTime = new Date(data).Format("yyyy-MM-dd");
                    _self.drate_endTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 3) {
                    _self.drate_startTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 4) {
                    _self.drate_endTime = new Date(data).Format("yyyy-MM-dd");
                }
            }
            // console.log("start:" + _self.drate_startTime + " end:" + _self.drate_endTime);
        },
        'vuetable:rank': function (data, action) { //点击省份查询城市
            var _self = this;
            if (action === 'view') {
                var _self = this;
                for (var i = 0; i < _self.drate_fields.length; i++) {
                    var fid = _self.drate_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = true;
                    }

                    if (fid.name == '__component:custom-action') {
                        fid.name = "proName";
                    }
                }
                $("#drateBack").show();
                _self.proIdB = "0";
                _self.cityTypeB = "0";

                _self.initDrateBestChart(); //初始化最好图表
                _self.initDrateBadChart(); //初始化最差的图表
                _self.initDrateBeterChart(); //改善率图表

                // _self.drate_params = ['proId=' + data.pro, 'timeType=' + timeTypeB, "cityType=0"];
                _self.dayRank_params = ['proId=' + data.pro, 'timeType=' + _self.dayRank_timeType, "cityType=" + _self.cityType,
                    "startTime=" + _self.dayRank_startTime, "endTime=" + _self.dayRank_endTime];
                _self.initDrateDays();
                _self.$nextTick(function () {
                    _self.$broadcast('vuetable:refresh');
                });
            }
        },
        'vuetable:cell-clicked': function (data, field, event) {
            if (field.name == 'proName' && this.proId == '0') {
                this.oneProRank(data);
            }
        }
    },
    watch: {
        drate_startTime: function () {
            var _self = this;
            if (_self.drate_timeType == 'month' || _self.drate_timeType == 'year') {
                _self.refrechDrateTab();
            } else if (_self.drate_timeType == 'custom') {
                if (_self.drate_startTime.length < 1 || _self.drate_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }
                if (_self.drate_startTime > _self.drate_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refrechDrateTab();
            }
        }, drate_endTime: function () {
            var _self = this;
            if (_self.drate_timeType == 'custom') {
                if (_self.drate_startTime.length < 1 || _self.drate_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }

                if (_self.drate_startTime > _self.drate_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refrechDrateTab();
            }
        },
        'drate_perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        }
    },
    methods: {
        proView: function (val) {
            return this.proId == "0" ? '<a href="javascript:void(0)">' + val + '</a>' : val;
        },
        tongBiView: function (val) {
            if (val > 0) {
                return '<span class="align-right">' + val + '%</span><b class="arrow-green-up"></b>';
            } else if (val < 0) {
                return '<span class="align-right">' + val + '%</span><b class="arrow-red-dow"></b>';
            } else {
                return '<span class="align-right">' + val + '</span>';
            }
        },
        oneProRank: function (rowData) {
            this.proId = rowData.pro;
            $("#drateBack").show();
            this.refrechDrateTab();
        },
        drateBack: function () { //返回
            var _self = this;
            $("#drateBack").hide();
            _self.proId = "0";
            _self.refrechDrateTab();
        },
        drateMonth: function (i) {
            var _self = this;
            addActivebtn('grounp_14', 0); //按月查询
            _self.drate_timeType = "month";
            _self.drate_startTime = new Date(monthDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            // _self.refrechDrateTab();
        },
        drateYear: function (i) { //按年查询
            var _self = this;
            addActivebtn('grounp_14', 1);
            _self.drate_timeType = "year";
            _self.drate_startTime = new Date(yearDecre2(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.drate_endTime = _self.drate_startTime;
            // _self.refrechDrateTab();

        }, drateCustom: function (i) { //任意时间
            var _self = this;
            addActivebtn('grounp_14', 2);
            _self.drate_timeType = "custom";

            _self.drate_endTime = new Date(dayDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.drate_startTime = new Date(monthDecre(_self.drate_endTime, 6)).Format("yyyy-MM-dd");

            // _self.refrechDrateTab();

        },
        dratePro: function () { //按省份查询
            var _self = this;
            addActivebtn('grounp_12', 0, false, 'num_22');
            addActivebtn('grounp_13', 0);
            addActivebtn('grounp_14', 0);
            _self.proId = "0";
            _self.cityType = "0";
            _self.drate_timeType = "custom";

            _self.refrechDrateTab();
        },
        drateCity: function () { //按城市 查询
            // var _self = this;
            // $("#drateBack").hide();
            // addActivebtn('grounp_12', 1, true, 'num_22')
            // addActivebtn('grounp_13', 0);
            // addActivebtn('grounp_14', 0);
            // _self.proId = "0";
            // _self.cityType = "1";
            // _self.drate_timeType = "month";

            // _self.refrechDrateTab();
        },
        drateCityType: function (i, j) { //切换城市类型

            var _self = this;
            addActivebtn('grounp_13', i - 1);
            _self.proId = "0";
            _self.cityType = i;
            _self.refrechDrateTab();

        },
        toggleBtnStatueB: function (index) {
            var bestID = document.getElementById('drate_best10_echart'),
                badID = document.getElementById('drate_bad10_echart');
            if (index) { //最优
                bestID.style.opacity = '1';
                bestID.style.zIndex = '999';
                badID.style.opacity = '0';
                badID.style.zIndex = '1';
                addUiBtn('grounp_11', 0);
                this.initDrateBestChart();
            } else { //最差
                badID.style.opacity = '1';
                badID.style.zIndex = '999';
                bestID.style.zIndex = '1';
                bestID.style.opacity = '0';
                addUiBtn('grounp_11', 1);
                this.initDrateBadChart();
            }
        },
        refrechDrateTab: function () {

            var _self = this;

            disposeChar("drate_best10_echart");
            disposeChar("drate_bad10_echart");
            disposeChar("drate_beter10_echart");

            _self.$nextTick(function () {
                _self.$broadcast('vuetable:clearTable');
            });


            if (!calcDate_interval(_self.drate_startTime, _self.drate_endTime, 'year')) {
                return false;
            }
            // _self.refreshColumn();
            _self.initDrateBestChart(); //初始化最好图表
            _self.initDrateBadChart(); //初始化最差的图表
            _self.initDrateBeterChart(); //改善率图表

            _self.initDrateDays();
            _self.drate_params = ['proId=' + _self.proId, 'timeType=' + _self.drate_timeType, "cityType=" + _self.cityType,
                "startTime=" + _self.drate_startTime, "endTime=" + _self.drate_endTime];
            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });
        },
        refreshColumn: function () {
            var _self = this;
            if (_self.cityType == "0") {
                for (var i = 0; i < _self.drate_fields.length; i++) {
                    var fid = _self.drate_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = false;
                    }
                    if (fid.name == "proName") {
                        fid.name = '__component:custom-action';
                    }
                }
            } else {
                for (var i = 0; i < _self.drate_fields.length; i++) {
                    var fid = _self.drate_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = true;
                    }

                    if (fid.name == '__component:custom-action') {
                        fid.name = "proName";
                    }
                }
            }
        },
        siteWidth: function (id) {
            var widthV = window.innerWidth * 0.47;
            $('#' + id).css("width", widthV + 'px');
        },
        initDrateBestChart: function () { //改善率最好        	
            var self = this;
            var postData = {
                proId: self.proId,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/goodday/best/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    self.siteWidth('drate_best10_echart');
                    initZdayrankChar(data, "drate_best10_echart", self.cityType);
                },
                errorFn: function (errorMsg) {
                    layer.msg('请求失败！');
                }
            });

        },
        initDrateBadChart: function () { //改善率最差
            var self = this;
            var postData = {
                proId: self.proId,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/goodday/worst/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    self.siteWidth('drate_bad10_echart');
                    initZdayrankChar(data, "drate_bad10_echart", self.cityType);
                },
                errorFn: function (errorMsg) {
                    closeLayreLoader();
                    layer.msg('请求失败！');
                }
            });

        },
        initDrateBeterChart: function () { //改善率最好
            var self = this;
            var postData = {
                proId: self.proId,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/goodday/rate/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    self.siteWidth('drate_beter10_echart');
                    init_beter_echart(data, "drate_beter10_echart", self.cityType);
                }
            });
        },
        initDrateDays: function () {
            var sel = this;
            if (sel.drate_timeType == "month") {
                sel.drate_totalDays = showTimeDiff(sel.drate_timeType, sel.drate_startTime) + "天";
            } else if (sel.drate_timeType == "year") {
                sel.drate_totalDays = showTimeDiff(sel.drate_timeType, sel.drate_startTime) + "天";
            } else {
                sel.drate_totalDays = GetDateDiff(sel.drate_endTime, sel.drate_startTime) + "天";

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

var pollutionTableColumns = [
    {
        name: '__sequence',
        title: '排序',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'showDetailRow'
    }, {
        name: 'proName',
        title: '省',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'proView'
    }, {
        name: 'cityName',
        visible: true,
        title: '市',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'currentTotal',
        title: '浓度',
        sortField: 'currentTotal',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'tongbiRate',
        sortField: 'tongbiRate',
        title: '同比',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'tongBiView'
    }, {
        name: 'huanbiRate',
        title: '环比',
        sortField: 'huanbiRate',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'tongBiView'
    }, {
        name: 'tongbiRank',
        title: '历史同期排名',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }];
/**
 * AQCI VUE
 */
var cityAqciRank = new Vue({
    el: '#tab-aqci-rank',
    data: {
        drate_fields: pollutionTableColumns,
        drate_sortOrder: [{
            field: 'currentTotal',
            direction: 'asc',
        }],
        drate_totalDays: '',
        multiSort: true,
        proId: '0',
        cityType: '1',
        pollution: 'aqci',
        drate_timeType: 'month',//时间类型: hour;day;month;year
        drate_startTime: initSETime.month.startTime,
        drate_endTime: initSETime.month.endTime,
        drate_perPage: 10,
        drate_pageList: [10, 20, 30, 40, 50],
        drate_params: [
            'proId=' + this.proId, 'timeType=' + timeType, "cityType=" + this.cityType, "startTime=" + initSETime.month.startTime,
            "endTime=" + initSETime.month.endTime, 'pollution=' + this.pollution
        ]
    },
    created: function () {
        this.refreshAll();
    },
    events: {
        'vuetable:monthYear': function (data) {
            var _self = this;
            if (data != "") {
                _self.drate_startTime = data;
                _self.drate_endTime = data;
            }
        }, 'vuetable:coustomTime': function (flag, data) {
            var _self = this;
            if (data != "") {
                if (flag == 1 || flag == 2) {
                    //月年
                    _self.drate_startTime = new Date(data).Format("yyyy-MM-dd");
                    _self.drate_endTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 3) {
                    _self.drate_startTime = new Date(data).Format("yyyy-MM-dd");
                }
                if (flag == 4) {
                    _self.drate_endTime = new Date(data).Format("yyyy-MM-dd");
                }
            }
        },
        'vuetable:cell-clicked': function (data, field, event) {
            if (field.name == 'proName' && this.proId == '0') {
                this.oneProRank(data);
            }
        }
    },
    watch: {
        drate_startTime: function () {
            var _self = this;
            if (_self.drate_timeType == 'month' || _self.drate_timeType == 'year') {
                _self.refreshAll();
            } else if (_self.drate_timeType == 'custom') {
                if (_self.drate_startTime.length < 1 || _self.drate_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }
                if (_self.drate_startTime > _self.drate_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refreshAll();
            }
        }, drate_endTime: function () {
            var _self = this;
            if (_self.drate_timeType == 'custom') {
                if (_self.drate_startTime.length < 1 || _self.drate_endTime.length < 1) {
                    layer.msg("开始或结束时间不能为空！")
                    return false;
                }

                if (_self.drate_startTime > _self.drate_endTime) {
                    layer.msg("开始时间不能大于结束时间！");
                    return false;
                }

                _self.refreshAll();
            }
        },
        'drate_perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        }
    },
    methods: {
        proView: function (val) {
            return this.proId == "0" ? '<a href="javascript:void(0)">' + val + '</a>' : val;
        },
        tongBiView: function (val) {
            if (val < 0) {
                return '<span class="align-right">' + val + '%</span><b class="arrow-green-up"></b>';
            } else if (val > 0) {
                return '<span class="align-right">' + val + '%</span><b class="arrow-red-dow"></b>';
            } else {
                return '<span class="align-right">' + val + '</span><b></b>';
            }
        },
        oneProRank: function (rowData) {
            this.proId = rowData.pro;
            $("#aqciBack").show();
            this.refreshAll();
        },
        drateBack: function () { //返回
            var _self = this;
            $("#aqciBack").hide();
            _self.proId = "0";
            _self.refreshAll();
        },
        drateMonth: function (i) {
            var _self = this;
            addActivebtn('grounp_24', 0); //按月查询
            _self.drate_timeType = "month";
            _self.drate_startTime = new Date(monthDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            // _self.refrechDrateTab();
        },
        drateYear: function (i) { //按年查询
            var _self = this;
            addActivebtn('grounp_24', 1);
            _self.drate_timeType = "year";
            _self.drate_startTime = new Date(yearDecre2(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.drate_endTime = _self.drate_startTime;
            // _self.refrechDrateTab();

        }, drateCustom: function (i) { //任意时间
            var _self = this;
            addActivebtn('grounp_24', 2);
            _self.drate_timeType = "custom";

            _self.drate_endTime = new Date(dayDecre(myDate.date, 1)).Format("yyyy-MM-dd");
            _self.drate_startTime = new Date(monthDecre(_self.drate_endTime, 6)).Format("yyyy-MM-dd");

            // _self.refrechDrateTab();

        },
        dratePro: function () { //按省份查询
            var _self = this;
            addActivebtn('grounp_12', 0, false, 'num_22');
            addActivebtn('grounp_13', 0);
            addActivebtn('grounp_14', 0);
            _self.proId = "0";
            _self.cityType = "0";
            _self.drate_timeType = "custom";

            _self.refreshAll();
        },
        drateCity: function () { //按城市 查询
            // var _self = this;
            // $("#drateBack").hide();
            // addActivebtn('grounp_12', 1, true, 'num_22')
            // addActivebtn('grounp_13', 0);
            // addActivebtn('grounp_14', 0);
            // _self.proId = "0";
            // _self.cityType = "1";
            // _self.drate_timeType = "month";

            // _self.refrechDrateTab();
        },
        drateCityType: function (i, j) { //切换城市类型

            var _self = this;
            addActivebtn('grounp_23', i - 1);
            _self.proId = "0";
            _self.cityType = i;
            _self.refreshAll();

        },
        changePollution: function (i, p) { //切换污染物
            addActivebtn('grounp_25', i - 1);
            this.pollution = p;
            if (p == 'aqci') {
                addActivebtn('grounp_24', 0); //按月查询
                this.drate_timeType = "month";
                //时间不变化主动刷新
                if (this.drate_startTime != new Date(monthDecre(myDate.date, 1)).Format("yyyy-MM-dd")) {
                    this.drate_startTime = new Date(monthDecre(myDate.date, 1)).Format("yyyy-MM-dd");
                } else {
                    this.refreshAll()
                }
            } else {
                this.refreshAll();
            }
        },
        toggleBtnStatueB: function (index) {
            var bestID = document.getElementById('aqci_best10_echart'),
                badID = document.getElementById('aqci_bad10_echart');
            if (index) { //最优
                bestID.style.opacity = '1';
                bestID.style.zIndex = '999';
                badID.style.opacity = '0';
                badID.style.zIndex = '1';
                addUiBtn('grounp_21', 0);
                this.initDrateBestChart();
            } else { //最差
                badID.style.opacity = '1';
                badID.style.zIndex = '999';
                bestID.style.zIndex = '1';
                bestID.style.opacity = '0';
                addUiBtn('grounp_21', 1);
                this.initDrateBadChart();
            }
        },
        refreshAll: function () {

            var _self = this;

            disposeChar("aqci_best10_echart");
            disposeChar("aqci_bad10_echart");
            disposeChar("aqci_goodrate10_echart");

            _self.$nextTick(function () {
                _self.$broadcast('vuetable:clearTable');
            });


            if (!calcDate_interval(_self.drate_startTime, _self.drate_endTime, 'year')) {
                return false;
            }
            // _self.refreshColumn();
            _self.initDrateBestChart(); //初始化最好图表
            _self.initDrateBadChart(); //初始化最差的图表
            _self.initDrateBeterChart(); //改善率图表

            _self.initDrateDays();
            _self.drate_params = ['proId=' + _self.proId, 'timeType=' + _self.drate_timeType, "cityType=" + _self.cityType,
                "startTime=" + _self.drate_startTime, "endTime=" + _self.drate_endTime, "pollution=" + _self.pollution];
            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });
        },
        refreshColumn: function () {
            var _self = this;
            if (_self.cityType == "0") {
                for (var i = 0; i < _self.drate_fields.length; i++) {
                    var fid = _self.drate_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = false;
                    }
                    if (fid.name == "proName") {
                        fid.name = '__component:custom-action';
                    }
                }
            } else {
                for (var i = 0; i < _self.drate_fields.length; i++) {
                    var fid = _self.drate_fields[i];
                    if (fid.name == "cityName") {
                        fid.visible = true;
                    }

                    if (fid.name == '__component:custom-action') {
                        fid.name = "proName";
                    }
                }
            }
        },
        siteWidth: function (id) {
            var widthV = window.innerWidth * 0.47;
            $('#' + id).css("width", widthV + 'px');
        },
        initDrateBestChart: function () { //改善率最好
            var self = this;
            var postData = {
                proId: self.proId,
                pollution: self.pollution,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/best/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    self.siteWidth('aqci_best10_echart');
                    initZdayrankChar(data, "aqci_best10_echart", self.cityType);
                },
                errorFn: function (errorMsg) {
                    layer.msg('请求失败！');
                }
            });

        },
        initDrateBadChart: function () { //改善率最差
            var self = this;
            var postData = {
                proId: self.proId,
                pollution: self.pollution,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/worst/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    closeLayreLoader();
                    self.siteWidth('aqci_bad10_echart');
                    initZdayrankChar(data, "aqci_bad10_echart", self.cityType);
                },
                errorFn: function (errorMsg) {
                    closeLayreLoader();
                    layer.msg('请求失败！');
                }
            });

        },
        initDrateBeterChart: function () { //改善率最好
            var self = this;
            var postData = {
                proId: self.proId,
                pollution: self.pollution,
                cityType: self.cityType,
                timeType: self.drate_timeType,
                startTime: new Date(self.drate_startTime).Format("yyyy-MM-dd"),
                endTime: new Date(self.drate_endTime).Format("yyyy-MM-dd")
            };
            initLayerLoaderMsg("加载");
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + "/envrank/badday/rate/top",
                dataType: "json",
                data: postData,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    self.siteWidth('aqci_goodrate10_echart');
                    init_beter_echart(data, "aqci_goodrate10_echart", self.cityType);
                }
            });
        },
        initDrateDays: function () {
            var sel = this;
            if (sel.drate_timeType == "month") {
                sel.drate_totalDays = showTimeDiff(sel.drate_timeType, sel.drate_startTime) + "天";
            } else if (sel.drate_timeType == "year") {
                sel.drate_totalDays = showTimeDiff(sel.drate_timeType, sel.drate_startTime) + "天";
            } else {
                sel.drate_totalDays = GetDateDiff(sel.drate_endTime, sel.drate_startTime) + "天";

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

function clickById(id) {
    $("#" + id).click();
}

/**
 * 初始化 html
 * @param timeType
 * @param tabIndex
 */
function makeHtml(timeType, tabIndex) {
    var date = new Date();
    var html = "";
    if (timeType == "month") {
        var time = new Date(monthDecre(date, 1)).Format("yyyy-MM");
        html = '<input v-model="start" value="' + time + '" class="form-control btn-xs Wdate" @click="customMonth" type="text" @change="customChange"/>';
    } else if (timeType == "year") {
        var time = new Date(yearDecre2(date, 1)).Format("yyyy");
        html = '<input v-model="start" value="' + time + '" class="form-control btn-xs Wdate" @click="customYear" type="text" @change="customChange"/>';
    } else if (timeType == "custom") {
        var end = new Date(dayDecre(date, 1)).Format("yyyy-MM-dd");
        var start = new Date(monthDecre(end, 6)).Format("yyyy-MM-dd");
        html = '<input v-model="start" value="' + start + '"  class="form-control btn-xs Wdate" @click="customStart" type="text" @change="customChange"   placeholder="开始时间" /> ' +
            '  <span class="input-group-addon" style="width:13px; padding: 0 5px; margin-left: -1px;">-</span>  ' +
            '<input v-model="end" value="' + end + '" class="form-control btn-xs Wdate" type="text" @click="customEnd" @change="customChange"  placeholder="结束时间" />';
    }
    return html;

}

function getDaysOfYear(currentDate) {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var x = 0,
        y = 0,
        z = 28; //数据的初始化
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) //闰年判断
    {
        z = 29;
    }
    switch (month) //对月份进行核对
    {

        case 1:
            x = 0, z = 0;
            break;
        case 2:
            x = 1, z = 0;
            break;
        case 3:
            x = 1;
            break;
        case 4:
            x = 2;
            break;
        case 5:
            x = 2, y = 1;
            break;
        case 6:
            x = 3, y = 1;
            break;
        case 7:
            x = 3, y = 2;
            break;
        case 8:
            x = 4, y = 2;
            break;
        case 9:
            x = 5, y = 2;
            break;
        case 10:
            x = 5, y = 3;
            break;
        case 11:
            x = 6, y = 3;
            break;
        case 12:
            x = 6, y = 4;
            break;

    }
    return 31 * x + 30 * y + z + day; //天数的计算公式
}

/**
 * 初始化时间
 * @param index
 * @returns {{start: string, end: string}}
 */
function initDateTime(index) {
    var startTime = '',
        endTime = '';
    var nowDate = myDate.date;
    switch (index) {
        case 'month': {
            startTime = endTime = new Date(monthDecre(nowDate, 1)).Format("yyyy-MM-dd");
        }
            break;
        case 'year': {
            startTime = endTime = new Date(yearDecre2(nowDate, 1)).Format("yyyy-MM-dd");
        }
            break;
        case 'custom': {
            endTime = new Date(dayDecre(nowDate, 1)).Format("yyyy-MM-dd");
            startTime = new Date(monthDecre(endTime, 6)).Format("yyyy-MM-dd");
        }
            break;
    }
    return {
        start: startTime,
        end: endTime
    };
}


function showTimeDiff(type, startTime) {

    var now = new Date();
    var show = new Date(startTime);
    var day = 0;
    if (type == 'month') {
        var nowMonth = now.getMonth();
        var starMonth = show.getMonth();
        if (nowMonth == starMonth) {
            day = now.getDate();
            if (day == 1) {
                day = 0;
            }
            else {
                day = day - 1;
            }
        } else {
            day = getCountDaysByMonth(show);
        }

    }
    else if (type == 'year') {
        var nowYear = now.getFullYear();
        var showYear = show.getFullYear();
        if (nowYear == showYear) {
            day = getDaysOfYear(now);
            if (day == 1) {
                day = 0;
            }
            else {
                day = day - 1;
            }
        } else {
            day = isLeapYear(showYear);
        }
    }
    return day;

}
