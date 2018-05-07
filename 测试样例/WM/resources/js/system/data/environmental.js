$(document).ready(function () {
    var now = new Date();
    $("#startTime").val(new Date(dayDecre(now, 1)).Format("yyyy-MM-dd HH:mm:ss"));
    $("#endTime").val(now.Format("yyyy-MM-dd HH:mm:ss"));

    var tableColumns = [{
        name: 'stationId',
        title: '站点ID'
    }, {
        name: 'city',
        title: '城市'
    }, {
        name: 'time',
        title: '时间'
    }, {
        name: 'lng',
        title: '经度'
    }, {
        name: 'lat',
        title: '纬度'
    },
//    {
//        name: 'aqi',
//        title: 'AQI'
//    },
        {
            name: 'pm25',
            title: 'PM25'
        }, {
            name: 'pm10',
            title: 'PM10'
        }, {
            name: 'co',
            title: 'CO'
        }, {
            name: 'so2',
            title: 'SO2'
        }, {
            name: 'o3',
            title: 'O3'
        }, {
            name: 'no2',
            title: 'NO2'
        }];

    Vue.config.debug = true;
    var initStartTime_ = (new Date()).getTime() - 60 * 60 * 1000;
    var initEndTime_ = (new Date()).getTime();
    var initStartTimeFormat_ = new Date(initStartTime_).getFullYear() + "-"
        + (new Date(initStartTime_).getMonth() + 1) + "-" + new Date(initStartTime_).getDate()
        + " " + new Date(initStartTime_).getHours() + ":" + new Date(initStartTime_).getMinutes()
        + ":" + new Date(initStartTime_).getSeconds();
    var initEndTimeFormat_ = new Date(initEndTime_).getFullYear() + "-"
        + (new Date(initEndTime_).getMonth() + 1) + "-" + new Date(initEndTime_).getDate()
        + " " + new Date(initEndTime_).getHours() + ":" + new Date(initEndTime_).getMinutes()
        + ":" + new Date(initEndTime_).getSeconds();
    new Vue({
        el: '#content',
        data: {
            startTime: initStartTimeFormat_,
            endTime: initEndTimeFormat_,
            prolist: [],
            citylist: [],
            province: -1,
            city: -1,
            stationTypeList: [],
            stationId: '',
            stationType: 'all',
            queryType: 1,
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            params: ['stationQueryType=1',
                'provinceId=-1', 'cityId=-1', 'startTime=' + initStartTime_, 'endTime=' + initEndTime_],
            fileDownloadUrl: ''
        },
        created: function () {
            var that = this;
            CommonUtil.ajax({
                type: "get",
                url: $.coreApiPath + '/domain/cascade/' + parent.domainId,
                dataType: "json",
                sucessFn: function (data) {
                    if (data) {
                        that.prolist = data.provinceList;
                        that.province = data.provinceList[0].id;
                        that.citylist = data.cityList;
                        that.city = data.cityList[0].id;
                        that.search();
                    }
                },
                errorFn: function (errorMsg) {
                    layer.msg('网络或服务器异常，请稍后重试！');
                }
            });
            CommonUtil.ajax({
                type: "post",
                url: $.coreApiPath + '/rest/station/getSelectData',
                dataType: "json",
                async: false,
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    that.stationTypeList = data.siteType;
                },
                errorFn: function (errorMsg) {
                    layer.msg('网络或服务器异常，请稍后重试！');
                }
            });
        },
        watch: {
            perPage: function () {
                this.search();
            },
            province: function () {
                var that = this;
                if (that.prolist.length < 2) {
                    return;
                }
                if (this.province == -1) {
                    this.citylist = [];
                } else {
                    CommonUtil.ajax({
                        type: "get",
                        url: $.coreApiPath + '/domain/child/' + that.province,
                        dataType: "json",
                        sucessFn: function (data) {
                            if (data) {
                                that.citylist = data;
                                if (data.length > 0) {
                                    that.city = data[0].id;
                                }
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                }
            }
        },
        methods: {
            search: function () {
                this.startTime = $('#startTime').val();
                this.endTime = $('#endTime').val();
                this.stationId = $('#stationId').val();
                this.params = [];
                var conditionData = {
                    provinceId: this.province,
                    cityId: this.city,
                    stationQueryType: this.queryType,
                    stationId: this.stationId
                };

                if (this.stationType != 'all') {
                    conditionData.stationType = this.stationType;
                }
                if (this.startTime) {
                    conditionData.startTime = this.startTime;
                }
                if (this.endTime) {
                    conditionData.endTime = this.endTime;
                }
                if (conditionData.startTime > conditionData.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }

                var sp = CommonUtil.json2Array(conditionData);
                for (var i = 0; i < sp.length; i++) {
                    this.params.push(sp[i]);
                }
                this.$nextTick(function () {
                    this.$broadcast('vuetable:refresh');
                });
            },
            exportExcel: function () {
                var _self = this;
                this.startTime = $('#startTime').val();
                this.endTime = $('#endTime').val();
                this.stationId = $('#stationId').val();

                if (!this.startTime || !this.endTime || this.province == -1 || this.city == -1) {
                    layer.msg('请输入筛选条件以免数据量过大！');
                    return;
                }

                var OutPutFileUrl = $.coreApiPath + '/rest/data/exportStationData?';

                var conditionData = {};

                conditionData.provinceId = _self.province;
                OutPutFileUrl = OutPutFileUrl + 'provinceId=' + conditionData.provinceId;

                conditionData.cityId = _self.city;
                OutPutFileUrl = OutPutFileUrl + '&cityId=' + conditionData.cityId;

                conditionData.stationQueryType = this.queryType;
                OutPutFileUrl = OutPutFileUrl + '&stationQueryType=' + this.queryType;

                conditionData.stationId = this.stationId;
                OutPutFileUrl = OutPutFileUrl + '&stationId=' + this.stationId;

                if (_self.startTime) {
                    conditionData.startTime = _self.startTime;
                    OutPutFileUrl = OutPutFileUrl + '&startTime=' + conditionData.startTime;
                }
                if (_self.endTime) {
                    conditionData.endTime =_self.endTime;
                    OutPutFileUrl = OutPutFileUrl + '&endTime=' + conditionData.endTime;
                }
                if (conditionData.startTime > conditionData.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                var dayNum = 30;
                if ((conditionData.endTime - conditionData.startTime) > 1000 * 60 * 60 * 24 * dayNum) {
                    layer.msg('导出数据请选择小于等于30天的数据！');
                    return;
                }

                //改用新的下载模式，直接下载
                $("#exportForm").attr("action", OutPutFileUrl);
                $("#exportForm").submit();
                layer.msg('正在导出数据，请稍等...');

                //先上传到fastdfs后再下载
                // layer.load(1);
                // CommonUtil.ajax({
                //     type: "post",
                //     url: $.coreApiPath + '/rest/data/exportData/station',
                //     data: conditionData,
                //     dataType: "json",
                //     contentType: 'application/json; charset=UTF-8',
                //     sucessFn: function (data) {
                //         layer.closeAll('loading');
                //         if (data) {
                //             that.fileDownloadUrl = data;
                //             that.$nextTick(function () {
                //                 document.getElementById("dowload").click();
                //             });
                //         }
                //         else {
                //             layer.msg('不好意思，报表导出失败了...');
                //         }
                //     },
                //     errorFn: function (errorMsg) {
                //         layer.closeAll('loading');
                //         layer.msg('不好意思，报表导出失败了...');
                //     }
                // });
            },
            // 设置分页样式
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
});
