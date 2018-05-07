var map = null;
var stationVue = null;
var stationTable = null;
var currentPolutionType = "pm25";

var date = new Date();
var endDate = dayIncre(date.Format("yyyy-MM-dd"), 0);
var startDate = dayDecre(endDate, 6);

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
            _self.tabRealTime = data.result.hasOwnProperty('ROLE_FUN_102_02_01_11');
            _self.tabHis = data.result.hasOwnProperty('ROLE_FUN_102_02_01_12');
            if (!_self.tabHis) {
                $('#tab-equipmentHistory').remove();
            }
            if (!_self.tabRealTime) {
                $('#tab-equipment').remove();
                $('#tab-equipmentHistory').addClass('active');
            }
        });
    }
});

var tableColumns = [
    {
        name: '__checkbox:equipmentId',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    },
    {
        name: 'equipmentId',
        title: '设备编号',
        sortField: 'equipmentId',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'sTechType',
        title: '设备类型',
        callback: 'sTechTypeFmt',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'equipmentType',
        title: '终端类型 ',
        callback: 'equipmentTypeFmt',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'status',
        title: '设备状态',
        callback: 'statusFormat',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'stationId',
        title: '监测点编号',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'stationName',
        title: '监测点名称',
        titleClass: 'text-center col-md-1',
        dataClass: 'text-center col-md-1'
    }, {
        name: 'proCityDis',
        title: '省市县',
        titleClass: 'text-center col-md-2',
        dataClass: 'text-center col-md-2'
    },
    {
        name: '__component:custom-action',
        title: '操作',
        titleClass: 'text-center col-md-3',
        dataClass: 'text-center col-md-3'
    }];


Vue.config.debug = false;

stationVue = new Vue({
    el: '#tab-equipment',
    data: {
        fields: tableColumns,
        searchFor: {
            stationId: '',
            sTechType: '',
            stationType: '',
            status: '',
            pageNo: 0,
            length: 10
        },
        sortOrder: [{
            field: 'id',
            direction: 'asc'
        }],
        perPage: 10,
        pageList: [10, 20, 30, 40, 50],
        rows: [],
        // 选中的数据
        selectedTo: [],
        moreParams: [],
        //设备类型
        sTechTypeList: [],
        //站点类型
        stationtypelist: [],
        //状态
        statustypelist: [],//设备状态
        //终端类型
        equipmentTypeList: [],
        sensortypelist: [],
        projectList: [],
        prolist: [],
        citylist: [],
        dislist: [],
        searchParams: {
            pro: "",
            city: "",
            district: "",
            projectId: "", //项目
            mountStatus: "",//绑定状态
            status: "",//设备状态
            sTechType: "",//设备类型
            equipmentType: 0,//终端类型
            stationIdOrName: "",
            equipmentId: "",
        },
        newstation: {
            "id": "",
            "equipmentId": "",
            "equipmentType": 0,
            "projectId": '',
            "sTechType": '',
            "uploadInternel": '',
            "collectInternel": '',
            "firmwareType": "A1",
            "status": 2,
            "mark": ''
        },
        excelFile: '',
        importProjectId: '', //导入设备的项目
        isOpenSelect: true,
        sensorList: [],
        sensorstatuslist: [],
        editId: 0,
        images: [],
        allFunctions: {}, //所有权限
        currentOldStation: {}  //当前老版站点
    },
    watch: {
        'perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        },
        'searchParams.pro': function () {
            var _self = this;
            if (_self.searchParams.pro != "") {
                ajax_get(coreApiPath + "/domain/child/" + _self.searchParams.pro, {}, function (data) {
                    if (data.erroCode = 2000) {
                        _self.citylist = [];
                        _self.dislist = [];
                        $.each(data.result, function (index, val) {
                            _self.citylist.push({id: val.id, name: val.domainName});
                        });
                    }
                });
                _self.searchParams.city = '';
                _self.searchParams.district = '';
            } else {
                _self.searchParams.city = '';
                _self.searchParams.district = '';
                _self.citylist = [];
                _self.dislist = [];
            }
        },
        'searchParams.city': function () {
            var _self = this;
            if (_self.searchParams.city != "") {
                this.dislist = [];
                ajax_get(coreApiPath + "/domain/child/" + _self.searchParams.city, {}, function (data) {
                    if (data.erroCode = 2000) {
                        $.each(data.result, function (index, val) {
                            _self.dislist.push({id: val.id, name: val.domainName});
                        });
                    }

                });
            } else {
                _self.searchParams.district = '';
                _self.dislist = [];
            }
        },
        searchstatus: function () {
            var _self = this;
            _self.search();
        }

    }, // 监听点击事件
    events: {
        'vuetable:station': function (data, action) {
            var _self = this;
            if (action === 'edit') {//修改
                this.editStation(data);
            }
            else if (action === 'upload') {
                this.uploadPic(data);
            } else if (action === 'oldMulSetCommand') {
                this.oldMulSetCommand(data)
            } else if (action === 'mainting') {
                this.mainting(data)
            } else if (action === 'maintOver') {
                this.maintOver(data)
            } else if (action === 'viewSensor') {
                //查看传感器
                window.open($.ctx + '/sensor/index?equipmentId=' + data.equipmentId);
            }
        },
        'vuetable:load-success': function (response) {
            this.selectedTo = [];
        }
    },
    methods: {
        // 打开上传窗口
        showImportFile: function () {
            this.excelFile = '';
            $('#myModalExcel').modal('show');
            $('#myModal').modal('hide');
        },
        // 批量修改IP窗口
        showBatchModifyIP: function () {
            $('#batchModifyIpModal').modal('show');
        },
        // 上传操作
        importFile: function () {
            if (!this.importProjectId) {
                layer.msg("导入设备的所属项目不能为空！");
                return false;
            }
            var excelFile = $("#excelFile").val();
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
        },//验证传感器 信息，如果存在自动带回
        // 上传操作
        batchModifyIp: function () {
            if (!$('#batchIp').val()) {
                layer.msg("IP地址不能为空！");
                return false;
            }
            if (!$('#batchPort').val()) {
                layer.msg("端口号不能为空！");
                return false;
            }
            var excelFile = $("#batchModifyIpFile").val();
            if (!excelFile) {
                layer.msg("请选择需上传的文件!");
                return false;
            }
            if (excelFile.lastIndexOf('.xlsx') != (excelFile.length - 5)) {
                layer.msg("文件格式不正确，请选择正确的Excel文件(后缀名.xlsx)！");
                return false;
            }
            var _self = this;
            $("#batchModifyIpForm").one('submit', function (e) {
                layer.load(2);
                $(this).ajaxSubmit({
                    clearForm: true,
                    dataType: 'json',
                    success: function (json) {
                        if (json.erroCode == 2000) {
                            $('#batchModifyIpModal').modal('hide');
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
            $("#batchModifyIpForm").submit();
        },
        autoSendor: function (index, sensor) {
            var _self = this;
            var deviceId = sensor.deviceId;
            if (!deviceId) {
                return;
            }
            var ishas = false;
            for (var i = 0; i < _self.sensorList.length; i++) {
                if (i == index) continue;
                if (_self.sensorList[i].deviceId == deviceId) {
                    ishas = true;
                    break;
                }
            }
            if (ishas) {
                layer.msg('该设备下已存在编号为[' + deviceId + ']的传感器');
                return;
            }

            //TODO 根据传感器ID获取传感器信息
            var options = {};
            options.type = 'get';
            options.url = coreApiPath + '/rest/device/get/' + deviceId;
            options.sucessFn = function (data) {
                if (data) {
                    _self.sensorList.$set(index, data);
                }
            };
            options.errorFn = function (err) {
//					CommonUtil.log('error!');
                layer.msg('get device info fail！');
            };
            CommonUtil.ajax(options);
        },
        sensorAdd: function (sensor) {
            this.sensorList.push({
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
            });
        },
        sensorDel: function (index) {
            this.sensorList.splice(index, 1);
        },
        //初始化新增窗口信息
        initForm: function () {
            var _self = this;
            _self.newstation = {
                firmwareType: 'A1',//业务标识
                collectInternel: '',//搜集间隔 ,
                equipmentId: "",
                equipmentType: '',//终端类型
                projectId: "",
                sTechType: '',////设备类型
                status: 2,//设备状态
                uploadInternel: ''//上传间隔
            };
            _self.sensorList = [{}];
            _self.newstation.sTechType = _self.sTechTypeList[0].code;//设备类型
            _self.newstation.equipmentType = _self.equipmentTypeList[0].id;//终端类型

        },
        addStation: function () {
            var _self = this;
            removeAttrByDomId("new_equipmentId", "disabled")
            $("#addModal").modal("show");
            _self.initForm();
            $("#addModalModalLabel").text("添加设备");
        },
        validateNewStationFrm: function () {//保存验证
            var _self = this;
            if (_self.newstation.projectId == "" || _self.newstation.projectId == 0) {
                layer.msg("请选择所属项目！");
                return false;
            }
            if (_self.newstation.equipmentId == "" || _self.newstation.equipmentId == null) {
                layer.msg("设备编号不能为空！");
                return false;
            }
            if (_self.newstation.sTechType == "" || _self.newstation.sTechType == null) {
                layer.msg("表选择设备类型！");
                return false;
            }
            if (_self.newstation.equipmentType == "") {
                layer.msg("表选择终端类型！");
                return false;
            }
            if (_self.newstation.collectInternel == "" || _self.newstation.collectInternel == null) {
                layer.msg("采集间隔不能为空！");
                return false;
            }
            if (_self.newstation.uploadInternel == "" || _self.newstation.uploadInternel == null) {
                layer.msg("上传间隔不能为空！");
                return false;
            }
            return true;
        },
        saveStation: function () {
            var _self = this;
            if (!_self.validateNewStationFrm()) return false;

            //传感器不在这里处理了
            // if (_self.sensorList.length == 1) {
            //     var firstSensor = _self.sensorList[0];
            //     //全为空
            //     var allempty = !(firstSensor.deviceId || firstSensor.deviceName || firstSensor.labK || (firstSensor.labK === 0) ||
            //         firstSensor.deviceType || firstSensor.status || firstSensor.labOfset || (firstSensor.labOfset === 0) || firstSensor.realK ||
            //         (firstSensor.realK === 0) || firstSensor.realOfset || (firstSensor.realOfset === 0));
            //     //全都不为空
            //     var allnotempty = firstSensor.deviceId && firstSensor.deviceName && (firstSensor.labK + '') && firstSensor.deviceType &&
            //         firstSensor.status && (firstSensor.labOfset + '') && (firstSensor.realK + '') && (firstSensor.realOfset + '');
            //     //只有全为空或者全都不为空才可以通过校验
            //     if (!(allempty || allnotempty)) {
            //         layer.msg('传感器信息不能为空');
            //         return false;
            //     }
            // } else {
            //     for (var i = 0; i < _self.sensorList.length; i++) {
            //         var firstSensor = _self.sensorList[i];
            //         if (!(firstSensor.deviceId && firstSensor.deviceName && (firstSensor.labK + '') && firstSensor.deviceType &&
            //             firstSensor.status && (firstSensor.labOfset + '') && (firstSensor.realK + '') && (firstSensor.realOfset + ''))) {
            //             layer.msg('传感器信息不能为空');
            //             return false;
            //         }
            //     }
            // }


            $.ajax({
                type: "post",
                url: coreApiPath + '/equipment/save',
                data: JSON.stringify(_self.newstation),
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (data) {
                    if (data.erroCode === 2000) {
                        layer.msg("保存成功！");
                        if (_self.sensorList.length < 1) {
                            return;
                        }
                        _self.sensorList = _self.sensorList.map(function (sensor) {
                            sensor.stationId = _self.newstation.equipmentId;
                            return sensor;
                        });
                        $.ajax({
                            type: "post",
                            url: $.coreApiPath + '/rest/device/addDevices',
                            data: JSON.stringify(_self.sensorList),
                            dataType: "json",
                            async: false,
                            contentType: 'application/json; charset=UTF-8',
                            success: function (data) {
                                if (data.erroCode === 2000) {
                                    layer.msg('保存成功');
                                    $("#addModal").modal("hide");
                                } else {
                                    layer.msg(data.erroMsg);
                                    //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                                }
                            },
                            error: function (errorMsg) {
                                layer.msg('保存失败');
                            }
                        });
                        _self.search();
                    } else {
                        layer.msg(data.erroMsg);
                        //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                    }
                },
                error: function (errorMsg) {
                    layer.msg('网络错误');
                }
            });
        },
        editStation: function (data) {
            var _self = this;
            var url = coreApiPath + '/equipment/findEquipmentById';
            var equipmentId = data.equipmentId;
            $.ajax({
                type: "get",
                url: url,
                dataType: "json",
                data: {equipmentId: equipmentId},
                contentType: 'application/json; charset=UTF-8',
                success: function (data) {
                    if (data.erroCode = 2000) {
                        $("#addModalModalLabel").text("修改设备");
                        $("#addModal").modal("show");
                        if (_self.newstation.equipmentId != null) {
                            disabledByDomId("new_equipmentId");
                        } else {
                            removeAttrByDomId("new_equipmentId", "disabled")
                        }
                        _self.newstation = data.result;
                        _self.newstation.equipmentType = data.result.equipmentType + "";
                        $.ajax({
                            type: "get",
                            url: coreApiPath + '/rest/device/getByStationId/' + equipmentId,
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            success: function (data) {
                                if (data.erroCode === 2000) {
                                    if (data.result) {
                                        _self.sensorList = data.result;
                                    } else {
                                        _self.sensorList = [{}];
                                    }
                                } else {
                                }
                            },
                            error: function (errorMsg) {
                                console.log('3000--------------/rest/device/getByStationId/----error');
                                _self.sensorList = [{}];
                            }
                        });

                    }
                    else {
                        layer.msg(data.erroMsg);
                        _self.newstation = {};
                        _self.sensorList = [{}];
                        return false;
                    }
                },
                error: function (errorMsg) {
                    _self.newstation = {};
                    _self.sensorList = [{}];
                    console.log('3000');
                }
            });

        },
        deleteStation: function (ids) {
            var _self = this;
            ajax_post_msg(coreApiPath + '/equipment/delete', {equipmentIds: ids}, "删除", function (data) {
                if (data.erroCode == 2000) {
                    layer.msg("删除成功！")
                    _self.$nextTick(function () {
                        _self.$broadcast('vuetable:refresh');
                    });
                } else if (data.erroCode == 3000) {
                    layer.msg(data.erroMsg);
                    _self.$nextTick(function () {
                        _self.$broadcast('vuetable:refresh');
                    });
                    _self.selectedTo = [];
                    return false;
                } else {
                    layer.msg("删除失败！");
                    return false;
                }
            });
        },
        updateEquipmentDeviceStatus: function (equipmentIds, status) {
            var _self = this;
            var params = {
                equipmentIds: equipmentIds,
                status: status
            }
            ajax_post(coreApiPath + '/equipment/updateEquipmentDeviceStatus', params, function (data) {
                if (data.erroCode == 2000) {
                    layer.msg("操作成功！")
                    _self.$nextTick(function () {
                        _self.$broadcast('vuetable:refresh');
                    });
                } else if (data.erroCode == 3000) {
                    layer.msg(data.erroMsg);
                    _self.$nextTick(function () {
                        _self.$broadcast('vuetable:refresh');
                    });
                    _self.selectedTo = [];
                    return false;
                } else {
                    layer.msg("操作失败！");
                    return false;
                }
            });
        },
        mulDelete: function () {
            var _self = this;
            if (_self.selectedTo.length == 0) {
                layer.msg('请先选择要删除的设备');
                return;
            }

            layer.confirm("确定删除选中的设备吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    _self.deleteStation(_self.selectedTo.join(","));
                    layer.close(index);
                }
            });
        },
        oldMulSetCommand: function (data) { //老版下发指令框
            this.currentOldStation = data;
            if (!data.stationId || data.stationId.length != 5) {
                layer.msg("非老版设备不支持此功能!");
                return false;
            }
            //单组分传感器
            if (data.techType == '1010') {
                $("#kbSensorType").attr("disabled", "disabled");
            } else {
                $("#kbSensorType").removeAttr("disabled");
            }
            $("#oldSetCommand").modal("show");
        },
        setOldBaseCommadSel: function () {//老板端站下发基础指令
            var oldBaseCommadSel = $("#oldBaseCommadSel").val();
            if (!oldBaseCommadSel) {
                layer.msg("请选择一个指令!", function () {
                });
                return;
            }
            var params = {};
            params.sids = this.currentOldStation.stationId;
            params.commandType = oldBaseCommadSel;
            ajax_get($.coreApiPath + "/oldstation/command/base", params, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            })
        },
        setOldHistoryCommadSel: function () {//历史数据回调请求
            var value1 = $("#hisCommandStartTime").val();
            var value2 = $("#hisCommandEndTime").val();
            if (!value1 || !value2) {
                layer.msg("开始时间和结束时间不能为空!", function () {
                });
                return;
            }
            var params = {};
            params.stationId = this.currentOldStation.stationId;
            params.value1 = value1;
            params.value2 = value2;
            ajax_get($.coreApiPath + "/oldstation/command/history", {"json": JSON.stringify([params])}, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            })
        },
        setOldModifyIntervalCommand: function () {//修改采集与传输间隔
            var value1 = $("#oldCollectInternel").val();
            var value2 = $("#oldTransferInternel").val();
            if (!value1 || !value2) {
                layer.msg("采集间隔和传输间隔不能为空!", function () {
                });
                return;
            }
            if (value1 < 1 || value1 > 99 || value2 < 1 || value2 > 99) {
                layer.msg("采集间隔和传输间隔数值范围1-99!", function () {
                });
                return;
            }
            if (Math.floor(value1) != value1 || Math.floor(value2) != value2) {
                layer.msg("采集间隔和传输间隔只能为整数!", function () {
                });
                return;
            }
            if (value1 < 10) {
                value1 = "0" + value1;
            }
            if (value2 < 10) {
                value2 = "0" + value2;
            }
            var params = {};
            params.stationId = this.currentOldStation.stationId;
            params.value1 = value1;
            params.value2 = value2;
            ajax_get($.coreApiPath + "/oldstation/command/modifyInterval", {"json": JSON.stringify([params])}, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            });
        },
        setOldModifyKBCommand: function () {//修改KB值指令
            var value1 = $("#kbSensorType").val();
            var value2 = $("#sensorK1").val();
            var value3 = $("#sensorB1").val();
            var value4 = $("#sensorK2").val();
            if (!value1 || !value2 || !value3) {
                layer.msg("传感器或KB值不能为空!", function () {
                });
                return;
            }
            if (value2 < 0.01 || value2 > 9.99 || (value2.toString().split(".")[1] && value2.toString().split(".")[1].length > 2)) {
                layer.msg("K1值范围0.01-0.99，并且只能有2位小数!", function () {
                });
                return;
            }
            if (value3 < -999 || value3 > 999) {
                layer.msg("B1值范围-999-999!", function () {
                });
                return;
            }
            if (Math.floor(value3) != value3) {
                layer.msg("B1值只能为整数!", function () {
                });
                return;
            }
            var params = {};
            params.stationId = this.currentOldStation.stationId;
            params.value1 = value1;
            params.value2 = value2;
            params.value3 = value3;
            if (value1 == 5) {
                if (!value4) {
                    layer.msg("o3时K2值不能为空", function () {
                    });
                    return;
                }
                if (value4 < 0.01 || value4 > 9.99 || (value4.toString().split(".")[1] && value4.toString().split(".")[1].length > 2)) {
                    layer.msg("K2值范围0.01-0.99，并且只能有2位小数!", function () {
                    });
                    return;
                }
                params.value4 = value4;
            }
            ajax_get($.coreApiPath + "/oldstation/command/modifyKB", {"json": JSON.stringify([params])}, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            });
        },
        setOldSensorChannelCommand: function () {//修改传感器通道指令
            var value1 = 0;
            var params = {};
            params.stationId = this.currentOldStation.stationId;
            if (params.stationId < '90001' || params.stationId > '99999') {
                layer.msg("此命令只适用于单组分设备!", function () {
                });
                return;
            }
            if ($('#masterSensor').prop('checked')) {
                value1 += 1;
            }
            if ($('#slaveSensor').prop('checked')) {
                value1 += 2;
            }
            if (value1 < 1) {
                layer.msg("请选择一个传感器!", function () {
                });
                return;
            }
            params.value1 = "0" + value1;
            ajax_get($.coreApiPath + "/oldstation/command/modifyChannel", {"json": JSON.stringify([params])}, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            });
        },
        setOldSensorCodeCommand: function () {//修改端站两个传感器编号
            var value1 = $("#sensorCodeValue1").val();
            var value2 = $("#sensorCodeValue2").val();
            var value3 = $("#sensorCodeValue3").val();
            var value4 = $("#sensorCodeValue4").val();
            var value5 = $("#sensorCodeValue5").val();
            if (!value1 || !value2 || !value3 || !value4 || !value5) {
                layer.msg("数据项不能为空!", function () {
                });
                return;
            }
            if (this.currentOldStation.stationId < '90001' || this.currentOldStation.stationId > '99999') {
                layer.msg("此命令只适用于单组分设备!", function () {
                });
                return;
            }
            var params = {};
            params.stationId = this.currentOldStation.stationId;
            params.value1 = value1;
            params.value2 = value2;
            params.value3 = value3;
            params.value4 = value4;
            params.value5 = value5;
            ajax_get($.coreApiPath + "/oldstation/command/modifyCode", {"json": JSON.stringify([params])}, function (data) {
                if (data) {
                    var result = JSON.parse(data);
                    if (result.code == 9) {
                        layer.msg("指令下发成功");
                    } else {
                        layer.msg(result.message);
                    }
                }
            });
        },
        mainting: function () { //运维中处理
            var _self = this;
            if (_self.selectedTo.length == 0) {
                layer.msg('请先选择要操作的设备');
                return;
            }
            layer.confirm("确定要将这些设备及其全部传感器更新为运维中状态吗?", {
                title: '提示信息',
                btn: ['确认', '取消'], // 按钮
                yes: function (index) {
                    _self.updateEquipmentDeviceStatus(_self.selectedTo.join(","), 3);
                    layer.close(index);
                }
            });
        },
        maintOver: function () { //运维结束处理
            var _self = this;
            if (_self.selectedTo.length == 0) {
                layer.msg('请先选择要操作的设备');
                return;
            }
            layer.confirm("确定要将这些设备及其全部传感器更新为正常状态吗?", {
                title: '提示信息',
                btn: ['确认', '取消'], // 按钮
                yes: function (index) {
                    _self.updateEquipmentDeviceStatus(_self.selectedTo.join(","), 2);
                    layer.close(index);
                }
            });
        },
        mulSetCommand: function () {//打开隐藏域
            var _self = this;
            if (this.selectedTo.length == 0 || this.selectedTo.length > 1) {
                layer.msg('请先选择一个设备进行操作!');
                return;
            }
            $("#setCommand").modal("show");
            $("#setCommandModalLabel").text("设备管理/ 下发命令");

        },
        setBaseCommadSel: function () {//基础命令下发
            var _self = this;

            var stationId = _self.selectedTo[0];

            if (stationId == "") {
                layer.msg("设备站号异常!");
                return false;
            }
            var command = "";
            command = $("#baseCommadSel").val();
            if (command == "") {
                layer.msg("请选择指令类型!");
                return false;
            }
            var number = RandomNumBoth();
            if (communicat_IP_Port == "") {
                layer.msg("未获取到ip地址!");
                return false;
            }
            // var url = "http://" + communicat_IP_Port + '/setCommandV2/baseCommand';
            // url += "&station_id=" + stationId + "&command=" + command + "&number=" + number;
            // $.getJSON($.coreApiPath + '/station/setCommandIndex', {"urlStr": url},
            //     function (data) {
            //         var d = eval('(' + data + ')');
            //         layer.msg(resultMessage(d.result));
            //         $("#baseCommadSel").val("");
            //     }
            // );

            // var url = "http://" + communicat_IP_Port + '/setCommand.s?method=SetBaseCommad';
            // url += "&station_id=" + stationId + "&command=" + command + "&number=" + number;
            $.getJSON($.coreApiPath + '/station/setCommandIndex',
                {"station_id": stationId, "command": command, "number": number, "value": "", "api": "baseCommand"},
                function (data) {
                    var d = eval('(' + data + ')');
                    layer.msg(resultMessage(d.result));
                    $("#baseCommadSel").val("");
                }
            );
        },
        setQueryCommadSel: function () {//查询命令下发
            var _self = this;
            // var selRows = this.rows.filter(function (item) {
            //     return _self.selectedTo.some(function (id) {
            //         return item.id == id;
            //     });
            // });
            // var stationId = "";
            // stationId = selRows[0].equipmentId;
            var stationId = _self.selectedTo[0]
            if (stationId == "") {
                layer.msg("设备站号异常!");
                return false;
            }
            var command = "";
            command = $("#queryCommadSel").val();
            if (command == "") {
                layer.msg("请选择指令类型!");
                return false;
            }
            var number = RandomNumBoth();

            var value = null;
            switch (Number(command)) {
                case 160:
                case 176:
                    var selOptions = $("#example-getting-started").val();
                    if (selOptions == null || selOptions.length == 0) {
                        layer.msg("请选择具体类型!");
                        return false;
                    }
                    var arrJSONTemp = [];
                    for (var i = 0; i < selOptions.length; i++) {
                        var jsn = {};
                        jsn.k1 = null;
                        jsn.k2 = null;
                        jsn.b1 = null;
                        jsn.b2 = null;
                        jsn.sensorType = selOptions[i];
                        jsn.coefficient = null;
                        arrJSONTemp.push(jsn);
                    }
                    if (arrJSONTemp.length == 0 || arrJSONTemp == null) {
                        layer.msg("请选择具体类型!");
                        return false;
                    }
                    value = JSON.stringify(arrJSONTemp);
                    break;

                default:
                    break;
            }

            if (communicat_IP_Port == "") {
                layer.msg("未获取到ip地址!");
                return false;
            }

            // var url = "http://" + communicat_IP_Port + '/setCommand.s?method=QueryCommad';
            // url += "&station_id=" + stationId + "&command=" + command + "&number=" + number + "&value=" + value;
            // $.getJSON($.coreApiPath + '/station/setCommandIndex', {"urlStr": url},
            //     function (data) {
            //         var d = eval('(' + data + ')');
            //         layer.msg(resultMessage(d.result));
            //         $("#queryCommadSel").val("");
            //         $("#setQuery7_8Sel").css("display", "none");
            //     }
            // );

            $.getJSON($.coreApiPath + '/station/setCommandIndex',
                {
                    "station_id": stationId,
                    "command": command,
                    "number": number,
                    "value": value,
                    "api": "queryParamCommand"
                },
                function (data) {
                    var d = eval('(' + data + ')');
                    layer.msg(resultMessage(d.result));
                    $("#queryCommadSel").val("");
                    $("#setQuery7_8Sel").css("display", "none");
                }
            );


        },
        setCommadSel1: function () {//配置命令下发
            var _self = this;
            // var selRows = this.rows.filter(function (item) {
            //     return _self.selectedTo.some(function (id) {
            //         return item.id == id;
            //     });
            // });
            // var stationId = "";
            // stationId = selRows[0].equipmentId;
            var stationId = _self.selectedTo[0]
            if (stationId == "") {
                layer.msg("设备站号异常!");
                return false;
            }
            var command = "";
            command = $("#str").val();
            if (command == "") {
                layer.msg("请选择指令类型!");
                return false;
            }
            var number = RandomNumBoth();
            var value = "";
            switch (Number(command)) {
                case 1:
                    var value1_1 = $("#configValue1_1").val();
                    var value1_2 = $("#configValue1_2").val();
                    if (value1_1 == "" || value1_2 == "") {
                        layer.msg("请填写完整信息");
                        return false;
                    }
                    value = value1_1 + "," + value1_2;
                    break;
                case 2:
                    value = (new Date()).getTime();
                    break;
                case 3:
                    var value3 = $("#configValue3").val();
                    if (value3 == "") {
                        layer.msg("请填写完整信息");
                        return false;
                    }
                    value = value3;
                    break;
                case 4:
                    var value4 = $("#configValue4").val();
                    if (value4 == "") {
                        layer.msg("请填写完整信息");
                        return false;
                    }
                    value = value4;
                    break;
                case 5:
                    var value5 = $("#configValue5").val();
                    if (value5 == "") {
                        layer.msg("请填写完整信息");
                        return false;
                    }
                    value = value5;
                    break;
                case 6:
                    var value6 = $("#configValue6").val();
                    if (value6 == "") {
                        layer.msg("请填写完整信息");
                        return false;
                    }
                    value = value6;
                    break;
                case 176:
//						str_ser();
                    if (ss.length == 0) {
                        layer.msg("未配置信息无法下发");
                        return false;
                    }
                    value = JSON.stringify(ss);
                    ss.length = 0;
                    break;
                case 160:
//						str_ser1();
                    if (ss1.length == 0) {
                        layer.msg("未配置信息无法下发");
                        return false;
                    }
                    value = JSON.stringify(ss1);
                    ss1.length = 0;
                    break;
                case 9:
                    var value9 = $("input[name='radioPm25']:checked").val();
                    if (value9 == "" || value9 == undefined) {
                        layer.msg("未配置信息无法下发");
                        return false;
                    }
                    value = value9;
                    break;
                case 10:
                    var ed1 = $("#ed1").val();
                    var ed2 = $("#ed2").val();
                    var ed3 = $("#ed3").val();
                    var ed4 = $("#ed4").val();
                    var ed5 = $("#ed5").val();
                    if (ed1 == "") {
                        layer.msg("配置一个手机号才能下发");
                        return false;
                    }
                    value = ed1;
                    if (ed2 != "") value += "," + ed2;
                    if (ed3 != "") value += "," + ed3;
                    if (ed4 != "") value += "," + ed4;
                    if (ed5 != "") value += "," + ed5;
                    break;
                case 11:
                    var value11 = $("#configValue11").val().trim();
                    if (value11 == "") {
                        layer.msg("未配置信息无法下发");
                        return false;
                    }
                    var re = /^[a-fA-F0-9]{8}$/;
                    if (!re.test(value11)) {
                        layer.msg("配置信息填写不符合要求，无法下发");
                        return false;
                    }
                    value = value11;
                    break;
                default:
                    layer.msg("未配置任何信息无法下发");
                    return false;
                    break;
            }
            if (communicat_IP_Port == "") {
                layer.msg("未获取到ip地址!");
                return false;
            }
            // var url = "http://" + communicat_IP_Port + '/setCommand.s?method=SetCommad';
            // url += "&station_id=" + stationId + "&command=" + command + "&number=" + number + "&value=" + value;
            // $.getJSON($.coreApiPath + '/station/setCommandIndex', {"urlStr": url},
            //     function (data) {
            //         var d = eval('(' + data + ')');
            //         layer.msg(resultMessage(d.result));
            //         $("#er").css("display", "none")
            //         $("#apps").text("");
            //         $("#str").val("");
            //     }
            // );

            $.getJSON($.coreApiPath + '/station/setCommandIndex',
                {
                    "station_id": stationId,
                    "command": command,
                    "number": number,
                    "value": value,
                    "api": "setParamCommand"
                },
                function (data) {
                    var d = eval('(' + data + ')');
                    layer.msg(resultMessage(d.result));
                    $("#er").css("display", "none")
                    $("#apps").text("");
                    $("#str").val("");
                }
            );

        },
        search: function () {
            var _self = this;
            _self.moreParams = [];
            var params = {};
            if (_self.searchParams.pro != "") {
                params.pro = _self.searchParams.pro;
            }
            if (_self.searchParams.city != "") {
                params.city = _self.searchParams.city;
            }
            if (_self.searchParams.district != "") {
                params.district = _self.searchParams.district;
            }
            console.log(_self.searchParams.projectId)
            if (_self.searchParams.projectId != "") {
                params.projectId = _self.searchParams.projectId;
            }
            if (_self.searchParams.mountStatus != "") {
                params.mountStatus = _self.searchParams.mountStatus;
            }
            if (_self.searchParams.status != "") {
                params.status = _self.searchParams.status;
            }
            if (_self.searchParams.sTechType != "") {
                params.sTechType = _self.searchParams.sTechType;
            }
            if (_self.searchParams.equipmentType != "") {
                params.equipmentType = _self.searchParams.equipmentType;
            }
            if (_self.searchParams.stationIdOrName != "") {
                params.stationIdOrName = _self.searchParams.stationIdOrName;
            }
            if (_self.searchParams.equipmentId != "") {
                params.equipmentId = _self.searchParams.equipmentId;
            }
            var sp = CommonUtil.json2Array(params);
            for (var i = 0; i < sp.length; i++) {
                _self.moreParams.push(sp[i]);
            }
            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });

        },//搜索
        sTechTypeFmt: function (value) {
            return this.sTechTypeList.find(function (option) {
                return option.code == value;
            }).name;
        },
        equipmentTypeFmt: function (value) {
            return this.equipmentTypeList.find(function (option) {
                return option.id == value;
            }).name;
        },
        statusFormat: function (value) {
            return this.statustypelist.find(function (option) {
                return option.id == value;
            }).name;
        },
        formatDate: function (value, fmt) {// 日期格式化
            if (value == null)
                return '';
            fmt = (typeof fmt == 'undefined') ? 'yyyy-MM-dd hh:mm:ss' : fmt;
            return CommonUtil.dateFormater(value, fmt);
        },
        paginationConfig: function (componentName) {// 设置分页样式
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
    ready: function () {
        var _self = this;

        //初始化 省份信息
        ajax_get(coreApiPath + "/domain/cascade/0", {}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result.provinceList, function (index, val) {
                    _self.prolist.push({id: val.id, name: val.domainName});
                });
            }
        });

        //用户所属项目
        ajax_get(coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
            $.each(data, function (index, val) {
                _self.projectList.push({id: val.id, name: val.name});
            });

        });

        //设备类型
        ajax_get(coreApiPath + "/config/type", {type: 11}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.sTechTypeList.push({code: val.code, name: val.name});
                });
            }
        });
        //终端类型
        ajax_get(coreApiPath + "/config/type", {type: 14}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.equipmentTypeList.push({id: val.code, name: val.name});
                });
            }
        });
        //设备状态
        ajax_get(coreApiPath + "/config/type", {type: 12}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.statustypelist.push({id: val.code, name: val.name});
                });
            }
        });


        //传感器
        $.ajax({
            type: "post",
            url: $.coreApiPath + '/rest/device/getSelectData',
            dataType: "json",
            async: false,
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
                if (data.erroCode === 2000) {
                    _self.sensortypelist = data.result.type;
                    _self.sensorstatuslist = data.result.status;
                }
            },
            error: function (errorMsg) {
                console.log("error:::::::::/rest/device/getSelectData");
            }
        });

    },
    beforeCompile: function () {
        //所有权限
        var _self = this;
        CommonUtil.getFunctionRole(function (data) {
            _self.allFunctions = data.result;
            var jhtml = "<div class=\"text-center\"> ";
            if (_self.allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_06')) {
                //修改权限
                jhtml += '<button class="btn btn-info" title="修改" @click="itemAction(\'edit-item\', rowData)">修改</button> ';
            }
            if (_self.allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_10')) {
                //老板端站权限
                jhtml += '<button class="btn btn-info" title="老版端站指令" @click="itemAction(\'set-command\', rowData)">老版端站指令</button> ';
            }
            if (_self.allFunctions.hasOwnProperty('ROLE_FUN_102_02_01_05')) {
                //查看传感器权限
                jhtml += '<button class="btn btn-info" title="查看传感器" @click="itemAction(\'view-sensor\', rowData)">查看传感器</button> ';
            }
            jhtml += '</div>';
            Vue.component(
                'custom-action', {
                    template: jhtml,
                    props: {
                        rowData: {
                            type: Object,
                            required: true
                        }
                    },
                    methods: {
                        itemAction: function (action, data) {
                            if (action === 'edit-item') {
                                this.$dispatch('vuetable:station', data, 'edit');
                            } else if (action === 'upload-item') {
                                this.$dispatch('vuetable:station', data, 'upload');
                            } else if (action === 'set-command') {
                                this.$dispatch('vuetable:station', data, 'oldMulSetCommand');
                            } else if (action === 'mainting-command') {
                                this.$dispatch('vuetable:station', data, 'mainting');
                            } else if (action === 'maint-over-command') {
                                this.$dispatch('vuetable:station', data, 'maintOver');
                            } else if (action === 'view-sensor') {
                                this.$dispatch('vuetable:station', data, 'viewSensor');
                            }
                        }
                    }
                });
            _self.search();
        });
    }
});

var hisTableColumns = [
    {
        name: '__sequence',
        width: '45px',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'equipmentId',
        title: '设备编号',
        sortField: 'equipmentId',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }, {
        name: 'stechType',
        title: '设备类型',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'sTechTypeFmt'
    }, {
        name: 'equipmentType',
        title: '终端类型 ',
        callback: 'equipmentTypeFmt'
    }, {
        name: 'status',
        title: '当前设备状态',
        callback: 'statusFormat'
    }, {
        name: 'stationId',
        title: '监测点编号'
    }, {
        name: 'projectName',
        title: '所属项目'
    }, {
        name: 'operatorResult',
        title: '操作',
        callback: 'operatorResultCallback'
    }, {
        name: 'instructions',
        title: '指令名称'
    }, {
        name: 'operatorDt',
        title: '操作时间',
        sortField: 'operatorDt'
    }, {
        name: 'operator',
        title: '操作人'
    }
];

var equipmentHistoryVm = new Vue({
    el: '#tab-equipmentHistory',
    data: {
        fields: hisTableColumns,
        params: {
            equipmentId: '',
            projectId: '',
            pro: '',
            city: '',
            district: '',
            stationIdOrName: '',
            startTime: startDate,
            endTime: endDate,
            operator: '',
            operatorResult: ''
        },
        sortOrder: [{
            field: 'id',
            direction: 'asc'
        }],
        perPage: 10,
        pageList: [10, 20, 30, 40, 50],
        // 选中的数据
        selectedTo: [],
        //设备类型
        sTechTypeList: [],
        equipmentTypeList: [], //终端类型
        statustypelist: [],//设备状态
        moreParams: ['startTime=' + startDate, 'endTime=' + endDate],
        projectList: [],
        proList: [],
        cityList: [],
        districtList: [],
        operatorResultList: []
    },
    watch: {
        'perPage': function (val, oldVal) {
            this.$broadcast('vuetable:refresh');
        },
        'params.pro': function () {
            var _self = this;
            if (_self.params.pro != "") {
                ajax_get(coreApiPath + "/domain/child/" + _self.params.pro, {}, function (data) {
                    if (data.erroCode = 2000) {
                        _self.cityList = [];
                        _self.districtList = [];
                        $.each(data.result, function (index, val) {
                            _self.cityList.push({id: val.id, name: val.domainName});
                        });
                    }
                });
                _self.params.city = '';
                _self.params.district = '';
            } else {
                _self.params.city = '';
                _self.params.district = '';
                _self.cityList = [];
                _self.districtList = [];
            }
        },
        'params.city': function () {
            var _self = this;
            if (_self.params.city != "") {
                this.districtList = [];
                ajax_get(coreApiPath + "/domain/child/" + _self.params.city, {}, function (data) {
                    if (data.erroCode = 2000) {
                        $.each(data.result, function (index, val) {
                            _self.districtList.push({id: val.id, name: val.domainName});
                        });
                    }

                });
            } else {
                _self.params.district = '';
                _self.districtList = [];
            }
        }

    }, // 监听点击事件
    events: {
        'vuetable:station': function (data, action) {
            var _self = this;
            if (action === 'edit') {//修改
                this.editStation(data);
            }
            else if (action === 'upload') {
                this.uploadPic(data);
            } else if (action === 'oldMulSetCommand') {
                this.oldMulSetCommand(data)
            } else if (action === 'mainting') {
                this.mainting(data)
            } else if (action === 'maintOver') {
                this.maintOver(data)
            }
        },
        'vuetable:load-success': function (response) {
            this.selectedTo = [];
        }
    },
    methods: {
        search: function () {
            var _self = this;
            _self.moreParams = [];
            var sp = CommonUtil.json2Array(this.params);
            for (var i = 0; i < sp.length; i++) {
                _self.moreParams.push(sp[i]);
            }
            _self.$nextTick(function () {
                _self.$broadcast('vuetable:refresh');
            });

        },//搜索
        sTechTypeFmt: function (value) {
            return this.sTechTypeList.find(function (option) {
                return option.code == value;
            }).name;
        },
        operatorResultCallback: function (value) {
            return this.operatorResultList.find(function (option) {
                return option.code == value;
            }).name;
        },
        equipmentTypeFmt: function (value) {
            return this.equipmentTypeList.find(function (option) {
                return option.id == value;
            }).name;
        },
        statusFormat: function (value) {
            return this.statustypelist.find(function (option) {
                return option.id == value;
            }).name;
        },
        formatDate: function (value, fmt) {// 日期格式化
            if (value == null)
                return '';
            fmt = (typeof fmt == 'undefined') ? 'yyyy-MM-dd hh:mm:ss' : fmt;
            return CommonUtil.dateFormater(value, fmt);
        },
        paginationConfig: function (componentName) {// 设置分页样式
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
    ready: function () {
        var _self = this;

        //初始化 省份信息
        ajax_get(coreApiPath + "/domain/cascade/0", {}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result.provinceList, function (index, val) {
                    _self.proList.push({id: val.id, name: val.domainName});
                });
            }
        });

        //用户所属项目
        ajax_get(coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
            $.each(data, function (index, val) {
                _self.projectList.push({id: val.id, name: val.name});
            });

        });

        //设备类型
        ajax_get(coreApiPath + "/config/type", {type: 11}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.sTechTypeList.push({code: val.code, name: val.name});
                });
            }
        });
        //终端类型
        ajax_get(coreApiPath + "/config/type", {type: 14}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.equipmentTypeList.push({id: val.code, name: val.name});
                });
            }
        });
        //设备状态
        ajax_get(coreApiPath + "/config/type", {type: 12}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.statustypelist.push({id: val.code, name: val.name});
                });
            }
        });

        this.operatorResultList.push(
            {
                'code': 1,
                'name': '新增'
            }, {
                'code': 2,
                'name': '修改'
            }, {
                'code': 3,
                'name': '删除'
            }, {
                'code': 4,
                'name': '下发指令'
            }, {
                'code': 5,
                'name': '运维中'
            }, {
                'code': 6,
                'name': '运维结束'
            }
        )
    }
});

var loadCount = 1;


//初始化fileinput控件（第一次初始化）
function op() {
    var photostationid = $("#photostationid").val();
    $("#photostab").hide();
    $("#pho").show();
    if (photostationid != stationVue.editId) {
        $("#photostationid").val(stationVue.editId);
        $("#pho").html('');
        var str = '';
        str = str + '<div class="form-group">';
        str = str + '<input id="file-Portrait1" type="file"  name="file"  multiple data-preview-file-type="any"   data-preview-file-icon=""  data-max-file-count="10">';
        str = str + '</div>';

        $("#pho").append(str);
        $("#file-Portrait1").fileinput({
            uploadUrl: $.coreApiPath + "/rest/station/batchUpload",
            allowedFileExtensions: ['jpg', 'png', 'gif'],
            overwriteInitial: false,
            maxFileSize: 3000,
            maxFilesNum: 10,
            language: 'zh',
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
            slugCallback: function (filename) {
                return filename.replace('(', '_').replace(']', '_');
            },
            uploadExtraData: function (previewId, index) {   //额外参数的关键点
                var obj = {};
                obj.id = stationVue.editId;
                return obj;
            }
        })
        //		       .on("filebatchselected", function(event, files) {
        //		            $(this).fileinput("upload");
        //		        })
            .on("fileuploaded", function (event, data) {
                getStationPics($("#photostationid").val());
            });
        ;
    }
}

function goReView(id) {
    var photostationid = $("#photostationid").val();
    $("#pho").hide();
    $("#photostab").show();
    if (photostationid != stationVue.editId) {
        getStationPics(id);
    }
}

function getStationPics(id) {
    stationVue.images = [];
    $.ajax({
        type: "post",
        url: $.coreApiPath + '/rest/station/getImages/' + id,
        dataType: "json",
        contentType: 'application/json; charset=UTF-8',
        success: function (data) {
            if (data.erroCode === 2000) {
                var _images = data.result.map(function (d) {
                    d.isselect = false;
                    return d;
                })
                for (var i = 0; i < _images.length; i++) {
                    stationVue.images.push(_images[i]);
                }
            } else {
                //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
            }
        },
        error: function (errorMsg) {
            console.log("error:::::::::/rest/station/getImages/" + id);
        }
    });
}


/**********************待研发*************************************/

/**
 * 随机数
 * @returns
 */
function RandomNumBoth() {
    var Range = 32766 - 1;
    var Rand = Math.random();
    var num = 1 + Math.round(Rand * Range); //四舍五入
    return num;
}

/**
 * 下发指令返回结果
 * @param type
 */
function resultMessage(type) {
    var message = "超时";
    switch (Number(type)) {
        case -1:
            message = "参数不完整";
            break;
        case -2:
            message = "设备不在线";
            break;
        case -3:
            message = "其他错误";
            break;
        case 0:
            message = "成功";
            break;
        case 1:
            message = "失败";
            break;
        case 2:
            message = "设备忙";
            break;
        case 3:
            message = "执行超时";
            break;
        case 4:
            message = "参数错误";
            break;
        case 5:
            message = "读写失败";
            break;
        case 6:
            message = "不支持";
            break;
        case 7:
            message = "认证错误";
            break;
        default:
            break;
    }
    return message;
}


