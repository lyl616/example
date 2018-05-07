$(document).ready(function () {
    var now = new Date();
    var endTime = now.Format("yyyy-MM-dd HH:mm:ss");

    var temp = now.setHours(now.getHours() - 7 * 24);
    var startTime = new Date(temp).Format("yyyy-MM-dd HH:mm:ss");
    // alert(startTime + "/" + endTime)

    var tableColumns = [{
        name: 'time',
        title: '时间',
        sortField: 'time'
    }, {
        name: 'temperature',
        title: '温度'
    }, {
        name: 'humidity',
        title: '湿度'
    }, {
        name: 'windPower',
        title: '风力'
    }, {
        name: 'windDirection',
        title: '风向'
    }, {
        name: 'pressure',
        title: '气压'
    }, {
        name: 'rainfall',
        title: '降雨'
    }];

    Vue.config.debug = true;

    new Vue({
        el: '#content',
        data: {
            startTime: startTime,
            endTime: endTime,
            prolist: [],
            citylist: [],
            province: -1,
            city: -1,
            fields: tableColumns,
            perPage: 10,
            pageList: [10, 20, 30, 40, 50],
            params: ['provinceId=-1', 'startTime=' + startTime, "endTime=" + endTime],
            fileDownloadUrl: ''
        },
        created: function () {
            var _self = this;
            CommonUtil.ajax({
                type: "get",
                url: $.backendApiPath + '/domain/cascade/' + parent.domainId,
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                sucessFn: function (data) {
                    _self.prolist = data;
                    if (data) {
                        _self.prolist = data.provinceList;
                        _self.province = data.provinceList[0].id;
                        _self.citylist = data.cityList;
                        _self.city = data.cityList[0].id;
                        _self.search();
                    }
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
                var _self = this;
                if (_self.prolist.length < 2) {
                    return;
                }
                if (_self.province == -1) {
                    _self.citylist = [];
                } else {
                    CommonUtil.ajax({
                        type: "get",
                        url: $.backendApiPath + '/domain/child/' + _self.province,
                        dataType: "json",
                        contentType: 'application/json; charset=UTF-8',
                        sucessFn: function (data) {
                            if (data) {
                                _self.citylist = data;
                                if (data.length > 0) {
                                    _self.city = data[0].id;
                                }
                            }
                        },
                        errorFn: function (errorMsg) {
                            layer.msg('网络或服务器异常，请稍后重试！');
                        }
                    });
                }
                _self.city = -1;
            }
        },
        methods: {
            search: function () {
                var _self = this;
                _self.params = [];
                var conditionData = {};
                conditionData.provinceId = _self.province;
                if (this.city != -1) {
                    conditionData.cityId = _self.city;
                }
                if (_self.startTime) {
                    conditionData.startTime = new Date(
                        _self.startTime).getTime();
                }
                if (this.endTime) {
                    conditionData.endTime = new Date(
                        _self.endTime).getTime();
                }
                if (conditionData.startTime > conditionData.endTime) {
                    layer.msg('开始时间不能大于结束时间！');
                    return;
                }
                var sp = CommonUtil.json2Array(conditionData);
                for (var i = 0; i < sp.length; i++) {
                    _self.params.push(sp[i]);
                }
                _self.$nextTick(function () {
                    _self.$broadcast('vuetable:refresh');
                });

            },
            exportExcel: function () {
                var _self = this;
                if (!_self.startTime || !_self.endTime || _self.province == -1 || _self.city == -1) {
                    layer.msg('请输入筛选条件以免数据量过大！');
                    return;
                }
                var conditionData = {};
                conditionData.provinceId = _self.province;
                var OutPutFileUrl = $.backendApiPath + '/airdata/exportAirData?';
                OutPutFileUrl = OutPutFileUrl + 'provinceId=' + conditionData.provinceId;
                if (_self.city != -1) {
                    conditionData.cityId = _self.city;
                    OutPutFileUrl = OutPutFileUrl + '&cityId=' + conditionData.cityId;
                }
                if (_self.startTime) {
                    conditionData.startTime = new Date(
                        _self.startTime).getTime();
                    OutPutFileUrl = OutPutFileUrl + '&startTime=' + conditionData.startTime;
                }
                if (_self.endTime) {
                    conditionData.endTime = new Date(
                        _self.endTime).getTime();
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
                // window.location.href = OutPutFileUrl;

                //先上传到fastdfs后再下载
                //layer.load(1);
                // CommonUtil.ajax({
                //     type: "post",
                //     url: $.coreApiPath + '/rest/data/exportData/air',
                //     data: conditionData,
                //     dataType: "json",
                //     contentType: 'application/json; charset=UTF-8',
                //     sucessFn: function (data) {
                //         layer.closeAll('loading');
                //         if (data) {
                //             _self.fileDownloadUrl = data;
                //             _self.$nextTick(function () {
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
