var isShowUpdateBtn = $("#updateBtn").val();
var isShowDelBtn = $("#delBtn").val();
var equipmentIdParam = CommonUtil.getQueryParameter('equipmentId');
var jhtml = "<div>";
// 删除用户按钮的HTMLDOM
if (isShowUpdateBtn == 1) {
    jhtml += '<button class="btn btn-success btn-outline btn-xs" title="修改" @click="itemAction(\'edit-item\', rowData)">修改</button>';
}
if (isShowDelBtn == 1) {
    jhtml += '<button class="btn btn-outline btn-xs btn-danger" title="删除" @click="itemAction(\'delete-item\', rowData)">删除</button>';
}
jhtml += '</div>';

var tableColumns = ['__checkbox:id',

    {
        name: "equipmentId",
        title: "设备编号"
    }, {
        name: 'deviceType',
        title: '类型',
        callback: 'setDevtypelist'
    }, {
        name: 'maintStatus',
        title: '传感器状态',
        callback: 'maintStatusFormat'
    }, {
        name: 'stationId',
        title: '监测点编号'
    }, {
        name: 'status',
        title: '下发结果',
        callback: 'setStatusType'
    }, {
        name: 'ratioReal',
        title: '应用系数'
    }, {
        name: 'realK',
        title: '应用K'
    }, {
        name: 'realOfset',
        title: '应用B'
    }, {
        name: 'realK2',
        title: '应用K2'
    }, {
        name: 'realOfset2',
        title: '应用B2'
    }, {
        name: 'realDate',
        title: '应用数据产生时间',
        callback: "setRealDate"
    }, {
        name: 'sendRealData',
        title: '应用下发成功时间',
        callback: "setRealDate"
    }, {
        name: 'statusLab',
        title: '下发结果',
        callback: 'setStatusType'
    }, {
        name: 'ratioLab',
        title: '实验系数'
    }, {
        name: 'labK',
        title: '实验K'
    }, {
        name: 'labOfset',
        title: '实验B'

    }, {
        name: 'labK2',
        title: '实验K2'
    }, {
        name: 'labOfset2',
        title: '实验B2'
    }, {
        name: 'labDate',
        title: '实验数据产生时间',
        callback: "setLabDate"
    }, {
        name: 'sendLabData',
        title: '实验下发成功时间',
        callback: "setLabDate"
    }
];

Vue.config.debug = false;

var tabHead = new Vue({
    el: '#tab-head',
    data: {
        tabRealTime: false,
        tabHis: false
    },
    beforeCompile: function () {
        //所有权限
        var _self = this;
        CommonUtil.getFunctionRole(function (data) {
            _self.tabRealTime = data.result.hasOwnProperty('ROLE_FUN_102_02_02_09');
            _self.tabHis = data.result.hasOwnProperty('ROLE_FUN_102_02_02_10');
            if (!_self.tabHis) {
                $('#tab-sensorHistory').remove();
            }
            if (!_self.tabRealTime) {
                $('#tab-sensor').remove();
                $('#tab-sensorHistory').addClass('active');
            }
        });
    }
});

Vue.component(
    'custom-action', {
        template: [
            jhtml
        ].join(''),
        props: {
            rowData: {
                type: Object,
                required: true
            }
        },
        methods: {
            itemAction: function (action, data) {
                // 各种操作
                if (action === 'edit-item') {
                    this.$dispatch('vuetable:sensor', data, 'edit');
                }
                if (action === 'delete-item') {
                    this.$dispatch('vuetable:sensor', data, 'del');
                }
            }
        }
    });
var sensorVm = new Vue({
    el: '#tab-sensor',
    data: {
        // 文件名称
        excelFile: '',
        queryCommand: '',
        excelFileQuery: '',
        // 类型
        devtypelist: [],
        // 传感器状态
        maintStatusList: [],
        // 下发状态
        statustypelist: [],
        // 类型
        devtypelistAdd: [],
        // 状态
        statustypelistAdd: [],
        projectList: [],//项目
        searchFor: {
            equipmentId: equipmentIdParam,
            stationId: '',//设备编号
            projectId: '',//项目id
            deviceType: '',
            maintStatus: '',
            status: '',
            deviceId: '',
            sendTime: '',
            dataType: '1'
        },
        fields: tableColumns,
        sortOrder: [{
            field: 'id',
            direction: 'asc'
        }],
        perPage: 10,
        pageList: [
            10, 50, 100, 500
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
        moreParams: ['equipmentId=' + equipmentIdParam],
        allFunctions: {}, //所有权限
    },
    created: function () {
        var options = {};
        var self = this;
        options.type = 'post';
        options.url = $.coreApiPath + '/rest/device/getSelectData';
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

        //传感器状态
        ajax_get($.coreApiPath + "/rest/device/maintStatus", {}, function (data) {
            $.each(data, function (index, val) {
                self.maintStatusList.push({code: val.code, name: val.name});
            });
        });
    },
    watch: {
        'perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        }
    },
    methods: {
        showDialog: function () {
            $("#addSensorForm").validate();
            $('#settingsModal').modal('show');
        },
        // 添加传感器
        addSensor: function () {
            var vv = $("#addSensorForm").validate();
            if (!vv.form()) {
                return;
            }
            var options = {};
            var self = this;
            options.type = this.sensor.id ? 'put' : 'post';
            options.url = $.coreApiPath + '/rest/device';
            options.data = this.sensor;
            options.sucessFn = function (data) {
                CommonUtil.log('sucess!');
                layer.msg('保存成功');
                $('#settingsModal').modal('hide');
                // sensor重置
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
                self.$broadcast('vuetable:refresh');
            };
            options.errorFn = function (err) {
                CommonUtil.log('error!');
                layer.msg('添加失败！');
            };
            CommonUtil.ajax(options);
        },
        exportSensor: function () {

        },
        delsSensor: function () {
            if (this.selectedTo && this.selectedTo.length < 1) {
                layer.msg('请勾选需要删除的传感器！');
                return;
            }
            this.delSensor(this.selectedTo);
        },
        // 删除传感器
        delSensor: function (ids) {
            console.log('delsensor' + ids);
            var msg = ids.length > 1 ? '确定删除所有选中的传感器吗？' : '确定删除传感器吗？';

            var options = {};
            var self = this;
            options.type = 'delete';
            options.url = $.coreApiPath + '/rest/device';
            options.data = ids;
            options.sucessFn = function (data) {
                CommonUtil.log('sucess!');
                self.$broadcast('vuetable:refresh');
            };
            options.errorFn = function (err) {
                CommonUtil.log('error!');
                layer.msg('delete fail！');
            };
            layer.confirm(msg, {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    CommonUtil.ajax(options);
                    layer.close(index);
                }
            });

        },
        // 编辑传感器
        editSensor: function (sensor) {
            $("#addSensorForm").validate();
            console.log('editsensor' + sensor.deviceId);
            // 这里如果能确认列表里的sensor对象数据足够编辑使用，则直接获取就可以了不需要进行一次ajax请求

            var options = {};
            var self = this;
            options.type = 'get';
            options.url = $.coreApiPath + '/rest/device/' + sensor.id;
            options.sucessFn = function (data) {
                CommonUtil.log('get device info sucess!');
                self.sensor = data;
                $('#settingsModal').modal('show');
            };
            options.errorFn = function (err) {
                CommonUtil.log('error!');
                layer.msg('get device info fail！');
            };
            CommonUtil.ajax(options);
        },
        // 打开上传窗口
        showImportFile: function () {
            this.excelFile = '';
            $('#myModalExcel').modal('show');
            $('#myModal').modal('hide');
        },
        // 打开上传窗口
        showImportFileQuery: function () {
            this.excelFileQuery = '';
            $('#myModalExcelQuery').modal('show');
            $('#myModalQuery').modal('hide');
        },
        // 一键补发
        reSend: function () {
            if (this.selectedTo && this.selectedTo.length < 1) {
                layer.msg('请勾选需要补发的传感器数据！');
                return;
            }
            layer.load(2);
            var options = {};
            var self = this;
            options.type = 'post';
            options.url = $.coreApiPath + '/rest/device/reSendOrder?ids=' + this.selectedTo;
            options.sucessFn = function (data) {
                CommonUtil.log('get device info sucess!');
                layer.msg("执行完成");
                layer.closeAll('loading');
                self.$broadcast('vuetable:refresh');
                self.selectedTo.length = 0;
            };
            options.errorFn = function (err) {
                layer.msg("执行失败");
            };
            CommonUtil.ajax(options);
        },
        reGetOrdersResult: function () {//一键获取结果
            layer.load(2);
            var options = {};
            var self = this;
            options.type = 'post';
            options.url = $.coreApiPath + '/rest/device/reGetOrdersResult';
            options.sucessFn = function (data) {
                CommonUtil.log('get device info sucess!');
                layer.closeAll('loading');
                layer.msg("执行完成");
                self.$broadcast('vuetable:refresh');
            };
            options.errorFn = function (err) {
                layer.msg("执行失败");
            };
            CommonUtil.ajax(options);
        },
        // 上传操作
        importFile: function () {
            var excelFile = $('#excelFile').val();
            if (!excelFile) {
                layer.msg("请选择需上传的文件!");
                return false;
            }
            if (excelFile.lastIndexOf('.xlsx') != (excelFile.length - 5)) {
                layer.msg("文件格式不正确，请选择正确的Excel文件(后缀名.xlsx)！");
                return false;
            }
            var _self = this;
            $("#fileUpload").one('submit', function (e) {
                layer.load(2);
                $(this).ajaxSubmit({
                    clearForm: true,
                    dataType: 'json',
                    success: function (json) {
                        if (json.erroCode == 2000) {
                            $('#myModalExcel').modal('hide');
                            layer.closeAll('loading');
                            layer.msg("导入成功！");
                            _self.$broadcast('vuetable:refresh');
                        }
                        else {
                            layer.closeAll('loading');
                            if (json.erroMsg) {
                                layer.open({
                                    title: '提示',
                                    content: json.erroMsg
                                });
                            } else {
                                layer.open({
                                    title: '提示',
                                    content: '服务器正在开小差'
                                });
                            }
                        }
                    }
                });
                return false;
            });
            $("#fileUpload").submit();
        },
        // 上传批量查询操作
        importFileQuery: function () {
            CommonUtil.log('excelFileQuery:' + this.excelFileQuery);
            if (this.excelFileQuery == '') {
                if ($('#excelFileQuery').val() == '') {
                    layer.msg("请选择需上传的文件!");
                    return false;
                } else {
                    this.excelFileQuery = $('#excelFileQuery').val();
                }
            }
            if (this.excelFileQuery.lastIndexOf('.xlsx') != (this.excelFileQuery.length - 5)) {
                layer.msg("文件格式不正确，请选择正确的Excel文件(后缀名.xlsx)！");
                return false;
            }
            var self = this;
            layer.load(2);
            var queryCommand = $("input[name='queryCommand']:checked").val();

            var arrJSONTemp = [];
            var jsn = {};
            jsn.k1 = null;
            jsn.k2 = null;
            jsn.b1 = null;
            jsn.b2 = null;
            jsn.sensorType = "0";
            jsn.coefficient = null;
            arrJSONTemp.push(jsn);
//				var queryValues  = '[{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"0","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"1","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"2","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"3","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"4","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"5","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"6","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"7","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"8","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"9","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"10","coefficient":null},{"k1":null,"k2":null,"b1":null,"b2":null,"sensorType":"11","coefficient":null}]';
            var queryValues = "";

            $.ajaxFileUpload({
                url: $.coreApiPath + "/rest/device/QueryCommadBatch?queryCommand=" + queryCommand + "&queryValues=" + queryValues,
                secureuri: false,
                type: "post",
                dataType: "json",
                data: this.excelFileQuery,
                fileElementId: 'excelFileQuery', // 文件上传域的ID
                success: function (r) {
                    $('#myModalExcelQuery').modal('hide');
                    layer.closeAll('loading');
                    if (r.erroCode == '2000') {
                        layer.msg("导入成功！");
                        self.$broadcast('vuetable:refresh');
                    } else {
                        layer.msg("导入失败！");
                        return false;
                    }
                },
                error: function (data) {
                    // $('#myModalExcelQuery').modal('hide');
                    // layer.closeAll('loading');
                    // layer.msg("请求异常11");
                    layer.msg("导入成功！");
                    self.$broadcast('vuetable:refresh');
                }
            });
        },

        //运维中
        setMaint: function () {
            var _self = this;
            if (_self.selectedTo && _self.selectedTo.length < 1) {
                layer.msg('请勾选要更新状态的传感器！');
                return;
            }

            layer.confirm("确定要将传感器更新为运维中状态吗？", {
                title: '提示信息',
                btn: ['确认', '取消'], // 按钮
                yes: function (index) {
                    _self.updateMaintStatus(3);
                    layer.close(index);
                }
            });
        },

        //运维结束
        setMaintOver: function () {
            var _self = this;
            if (_self.selectedTo && _self.selectedTo.length < 1) {
                layer.msg('请勾选要更新状态的传感器！');
                return;
            }
            layer.confirm("确定要将传感器更新为正常状态吗？", {
                title: '提示信息',
                btn: ['确认', '取消'], // 按钮
                yes: function (index) {
                    _self.updateMaintStatus(2);
                    layer.close(index);
                }
            });
        },

        // 更新传感器运维状态
        updateMaintStatus: function (maintStatus) {
            var _self = this;
            var params = {
                ids: _self.selectedTo.join(","),
                maintStatus: maintStatus
            }
            ajax_post($.coreApiPath + '/rest/device/updateMaintStatus', params, function (data) {
                if (data.erroCode == 2000) {
                    //layer.msg("操作成功！")
                    _self.selectedTo = [];
                    _self.$broadcast('vuetable:refresh');
                } else if (data.erroCode == 3000) {
                    layer.msg(data.erroMsg);
                    //_self.selectedTo = [];
                    return false;
                } else {
                    layer.msg("操作失败！");
                    return false;
                }
            })
        },
        search: function () {
            var _self = this;
            _self.moreParams = [];
            _self.selectedTo = [];
            CommonUtil.log(JSON.stringify(_self.searchFor));
            var sp = CommonUtil.json2Array(_self.searchFor);
            for (var i = 0; i < sp.length; i++) {
                _self.moreParams.push(sp[i]);
            }


            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });
        },

        /**
         * 回调，传感器状态：2正常，3运维中
         */
        maintStatusFormat: function (value) {
            var result = '';
            for (item in this.maintStatusList) {
                if (this.maintStatusList[item].code == value) {
                    result = this.maintStatusList[item].name;
                }
            }
            return result;
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
        setRealDate: function (value) {
            var temp = '2010-01-01 00:00:00';
            if (value != "" && value != null && value != temp)
                return value;
        },
        setLabDate: function (value) {
            var temp = '2010-01-01 00:00:00';
            if (value != "" && value != null && value != temp)
                return value;
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
    },
    // 监听点击事件
    events: {
        'vuetable:sensor': function (data, action) {
            if (action === 'edit') {
                this.editSensor(data);
            }
            if (action === 'del') {
                this.delSensor([data.id]);
            }
        }
    },
    beforeCompile: function () {
        var _self = this;
        CommonUtil.getFunctionRole(function (data) {
            _self.allFunctions = data.result;
        });
    }
});

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
        title: 'web状态',
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
    el: '#tab-sensorHistory',
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
            equipmentId: equipmentIdParam,
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
        moreParams: ['equipmentId=' + equipmentIdParam],
        allFunctions: {}, //所有权限
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
                layer.msg('请选择1条需要补发的传感器数据！');
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
    },
    beforeCompile: function () {
        var _self = this;
        CommonUtil.getFunctionRole(function (data) {
            _self.allFunctions = data.result;
        });
    }
});
