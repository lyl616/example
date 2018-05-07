$(document).ready(function () {

    var historyTableColumns = ['__checkbox:id',
        {
            name: 'equipmentId',
            title: '设备编号'
        }, {
            name: 'deviceType',
            title: '类型',
            callback: 'setDevtypelist'
        }, {
            name: 'stationId',
            title: '监测点编号'
        }, {
            name: 'status',
            title: 'wab状态',
            callback: 'setStatusType'
        }, {
            name: 'sendRealData',
            title: 'web成功时间'
//        	,
//        callback: 'setStatusType'
        }
        , {
            name: 'ratioReal',
            title: 'web系数'
        }, {
            name: 'realK',
            title: 'webK'
        }, {
            name: 'realOfset',
            title: 'webB'
        }, {
            name: 'statusLab',
            title: 'Lab状态',
            callback: 'setStatusType'
        }, {
            name: 'sendLabData',
            title: 'Lab成功时间'
//        	,
//        callback: 'setStatusType'
        }, {
            name: 'ratioLab',
            title: 'Lab系数'
        }, {
            name: 'labK',
            title: 'labK'
        }, {
            name: 'labOfset',
            title: 'LabB'

        }, {
            name: 'labK2',
            title: 'labK2'
        }, {
            name: 'labOfset2',
            title: 'LabB2'
        }
    ];

    var historyVm = new Vue({
        el: '#content',
        data: {
            // 文件名称
            excelFile: '',
            // 类型
            devtypelist: [],
            // 状态
            statustypelist: [],
            // 类型
            devtypelistAdd: [],
            // 状态
            statustypelistAdd: [],
            projectList: [],//项目
            searchFor: {
                stationId: '',//设备编号
                projectId: '',//项目id
                deviceType: '',
                status: '',
                deviceId: ''
            },
            fields: historyTableColumns,
            sortOrder: [{
                field: 'id',
                direction: 'asc'
            }],
            perPage: 10,
            pageList: [
                10, 20, 30, 40, 50
            ],
            sensor: {
                id: '',
                deviceId: '',
                deviceName: '',
                deviceOrder: '',
                deviceType: '',
                labK: '',
                labK2: '',
                labOfset: '',
                realK: '',
                realK2: '',
                realOfset: '',
                status: ''
            },
            // 选中的数据
            selectedTo: [],
            moreParams: []
        },
        created: function () {
            var options = {};
            var self = this;
            options.type = 'post';
            options.url = $.coreApiPath + '/rest/deviceHistory/getSelectData';
            options.sucessFn = function (data) {
                self.devtypelistAdd = self.devtypelistAdd.concat(data.type);
                self.statustypelistAdd = self.statustypelistAdd.concat(data.status);
                var all = {
                    code: 'all',
                    name: '全部'
                };
                data.type.unshift(all);
                self.devtypelist = data.type;
                data.status.unshift(all);
                self.statustypelist = data.status;
                self.searchFor.deviceType = data.type[0].code;
                self.searchFor.status = data.status[0].code;
                self.sensor.deviceType = self.devtypelistAdd[0].code;
                self.sensor.status = self.statustypelistAdd[0].code;
            };
            options.errorFn = function (err) {
                CommonUtil.log('error!');
            };
            CommonUtil.ajax(options);
            // 窗口关闭
            $('#settingsModal').on('hide.bs.modal', function () {
                self.sensor = {
                    id: '',
                    deviceId: '',
                    deviceName: '',
                    deviceOrder: '',
                    deviceType: self.devtypelistAdd[0].code,
                    labK: '',
                    labK2: '',
                    labOfset: '',
                    realK: '',
                    realK2: '',
                    realOfset: '',
                    status: self.statustypelistAdd[0].code
                };
                $("#addSensorForm  .tooltip.fade.top.in").remove();
            });
            //projectList项目
            ajax_get($.coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
                $.each(data, function (index, val) {
                    self.projectList.push({id: val.id, name: val.name});
                });

            });
        },
        watch: {
            'perPage': function (val, oldVal) {
                this.$nextTick(function () {
                    this.$broadcast('vuetable:refresh');
                });
            }
        },
        methods: {
            showDialog: function () {
                $("#addSensorForm").validate();
                $('#settingsModal').modal('show');
            },
            // 打开上传窗口
            showImportFile: function () {
                this.excelFile = '';
                $('#myModalExcel').modal('show');
                $('#myModal').modal('hide');
            },
            // 一键补发
            reSend: function () {
                var _self = this;
                if (_self.selectedTo && _self.selectedTo.length != 1) {
                    layer.msg('请选择1条需要需要补发的传感器数据！');
                    return;
                }
                var options = {};
                options.type = 'post';
                options.url = $.coreApiPath + '/rest/deviceHistory/reSendOrder?ids=' + _self.selectedTo;
                options.sucessFn = function (data) {
                    CommonUtil.log('get device info sucess!');
                    layer.msg("执行完成");
                    _self.$nextTick(function () {
                        _self.$broadcast('vuetable:refresh');
                    });
                    _self.selectedTo = [];
                };
                options.errorFn = function (err) {
                    layer.msg("执行失败");
                };
                CommonUtil.ajax(options);
            },
            search: function () {
                var _self = this;
                _self.moreParams = [];
                _self.selectedTo = [];
                // CommonUtil.log(JSON.stringify(this.searchFor));
                var sp = CommonUtil.json2Array(_self.searchFor);
                for (var i = 0; i < sp.length; i++) {
                    _self.moreParams.push(sp[i]);
                }

                _self.$nextTick(function () {
                    _self.$broadcast('vuetable:refresh');
                });
            },
            /**
             * 回调，这里可以处理显示情况，如翻译、状态设置、格式化等待
             */
            setStatusType: function (value) {
                var result = '';
                for (item in this.statustypelist) {
                    if (this.statustypelist[item].code == value) {
                        result = this.statustypelist[item].name;
                    }
                }
                return result;
            },
            setDevtypelist: function (value) {
                var result = '未知';
                for (item in this.devtypelist) {
                    if (this.devtypelist[item].code == value) {
                        result = this.devtypelist[item].name;
                    }
                }
                return result;
            },
            // 日期格式化
            formatDate: function (value, fmt) {
                if (value == null)
                    return '';
                fmt = (typeof fmt == 'undefined') ? 'yyyy-MM-dd hh:mm:ss' : fmt;
                return CommonUtil.dateFormater(value, fmt);
            },
            // 设置各行变色
            rowClassCB: function (data, index) {
                return (index % 2) === 0 ? 'positive' : '';
            },
            // 设置分页样式
            paginationConfig: function (componentName) {
                console.log('paginationConfig: ', componentName);
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
