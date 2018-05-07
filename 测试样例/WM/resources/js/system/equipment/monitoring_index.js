$("#pageName").html("监测点管理");
var date = new Date();
date.setDate(date.getDate());
var endDate = date.Format("yyyy-MM-dd");
var startDate = dayDecre(endDate, 6);


var tableColumns = [
    {
        name: '__checkbox:id',
        width: '30px',
        titleClass: 'text-center',
        dataClass: 'text-center',
        title: 'checkbox'
    },
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '50px'
    },
    {
        name: 'stationId',
        title: '监测点编号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'stationIdFmt'
    },
    {
        name: 'stationName',
        title: '监测点名称',
        titleClass: 'text-center',
        dataClass: 'text-center text-overflow',
        width: '150px'
    },
    {
        name: 'projectId',
        title: '所属项目',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'projectFormat',
        width: '150px'
    },
    {
        name: 'equipmentId',
        title: '绑定设备',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'proName',
        title: '省市区',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '150px'
    },
    {
        name: 'equipmentType',
        title: '监测点种类',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'equipmentTypeFormat'
    },
    {
        name: 'stationTypeName',
        title: '监测点类型',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'status',
        title: '监测点状态',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'statusFormat'
    },
    {
        name: 'equipmentStatus',
        title: '设备状态',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'equipmentStatusFormat'
    },
    {
        name: 'lngReal',
        title: '经度',
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'latReal',
        title: '纬度',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
]

var table01 = [
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '50px'
    },
    {
        name: 'stationId',
        title: '监测点编号', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
    {
        name: 'stationName',
        title: '监测点名称', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
    {
        name: 'projectId',
        title: '所属项目', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'projectFormat',
        width: '16%'
    },
    {
        name: 'proName',
        title: '省市区', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
    {
        name: 'status',
        title: '当前状态', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%',
        callback: 'statusFormat'
    },
    {
        name: 'equipmentId',
        title: '当前绑定设备', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
    {
        name: 'operatorResult',
        title: '操作', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%',
        callback: 'optFormat'
    },
    {
        name: 'hisEquipmentId',
        title: '绑定/解绑设备编号', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
    {
        name: 'operateTime',
        title: '操作时间', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    }, {
        name: 'operatorName',
        title: '操作人', //区县
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '16%'
    },
];


Vue.use(Vuetable);
var monitorVM = new Vue({
    el: '#app',
    data: {
        loading: '',
        moreParams: {status: 2},
        hismoreParams: {},
        fields: tableColumns,
        fieldsHistory: table01,
        tableHeight: 'auto',
        fillFormRight: "transformRight",
        vuetableFields: false,
        paginationComponent: 'vuetable-pagination',
        // paginationComponent2: 'vuetable-pagination2',
        perPage: 10,
        newprolist: [],
        newcitylist: [],
        newdislist: [],
        currTab: 1,
        station: {
            "stationIdOrName": "",
            "equipmentId": "",
            "equipmentType": "-1",
            "stationType": -1,
            "pro": -1,
            "city": -1,
            "district": -1,
            "projectId": -1,
            "status": 2,
            "mountStatus": -1
        },
        his_station: {
            stationId: "",
            projectId: -1,
            pro: -1,
            city: -1,
            district: -1,
            equipmentId: "",
            operatorResult: "-1",
            operator: "",
            startTime: startDate,
            endTime: endDate
        },
        stationTypeList: [],
        equipmentTypeList: [],
        statusList: [],
        equipmentStatusList: [],
        projectList: [],
        allProjectList: [],//所有项目(包含未删除和已删除的项目)
        orgList: [],
        allFunctions: {},
        editStation: false,
        importProjectId: '' //导入站点的项目
    },
    watch: {

        'perPage': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        'paginationComponent': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        },
        'his_station.pro': function () {
            var _self = this;
            _self.proChange(2, _self.his_station.pro);
        },
        'his_station.city': function () {
            var _self = this;
            _self.cityChange(2, _self.his_station.city);
        },
        'station.pro': function () {
            var _self = this;
            _self.proChange(1, _self.station.pro);
        },
        'station.city': function () {
            var _self = this;
            _self.cityChange(1, _self.station.city);
        },
        'station.equipmentType': function () {
            var _self = this;
            if (_self.station.equipmentType != -1) {
                _self.stationTypeList = [];
                _self.station.stationType = -1;
                ajax_get(coreApiPath + "/config/type", {
                    type: _self.station.equipmentType
                }, function (data) {
                    if (data.erroCode = 2000) {
                        $.each(data.result, function (index, val) {
                            _self.stationTypeList.push({
                                id: val.code,
                                name: val.name
                            });
                        });
                    }
                });
            }
        },
        'station.mountStatus': function () {
            if (this.station.mountStatus == '2') {
                this.station.equipmentId = '';
                $("#searchName").attr("disabled", "disabled");
            } else {
                $("#searchName").removeAttr("disabled");
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
                    if (_self.allFunctions['ROLE_FUN_102_01_10'] != undefined) {
                        _self.editStation = true;
                    }
                    if (!('ROLE_FUN_102_01_01' in _self.allFunctions) && ('ROLE_FUN_102_01_02' in _self.allFunctions)) {
                        _self.currTabFg(2);
                    }
                } else {
                    _self.allFunctions = {};
                    _self.editStation = false;
                }
            });
        },
        proChange: function (flag, pro) {
            var _self = this;
            _self.newcitylist = [];
            _self.newdislist = [];
            if (flag == 1) {
                _self.station.district = -1
                _self.station.city = -1
            } else {
                _self.his_station.district = -1
                _self.his_station.city = -1
            }

            if (pro == -1) {
                return false;
            } else {
                ajax_get(coreApiPath + "/domain/child/" + pro, {}, function (data) {
                    if (data.erroCode = 2000) {
                        $.each(data.result, function (index, val) {
                            _self.newcitylist.push({
                                id: val.id,
                                name: val.domainName
                            });

                            // if (val.id == parent.cityId) {
                            //     _self.station.city = parent.cityId;
                            // _self.his_station.city = parent.cityId;
                            // }
                        });
                    }

                });
            }
        },
        cityChange: function (flag, city) {
            var _self = this;
            _self.newdislist = [];

            if (flag == 1) {
                _self.station.district = -1
            } else {
                _self.his_station.district = -1
            }
            if (city != -1) {
                ajax_get(coreApiPath + "/domain/child/" + city, {}, function (data) {
                    if (data.erroCode = 2000) {
                        $.each(data.result, function (index, val) {
                            _self.newdislist.push({
                                id: val.id,
                                name: val.domainName
                            });
                        });
                    }
                });
            }

        },
        currTabFg: function (index) {
            var _self = this;
            _self.currTab = index;
            if (index == 2) {
                _self.hismoreParams = _self.his_station;
            }
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        transformRight: function (response) {
            var transformRight = {}
            var page = response.pagination;
            transformRight.paginationRightTable = {
                total: page.total,
                per_page: page.per_page,
                current_page: page.current_page,
                last_page: page.last_page,
                next_page_url: page.next_page_url,
                prev_page_url: page.prev_page_url,
                from: page.from,
                to: page.to
            }
            transformRight.data = [];
            response = response.data;
            for (var i = 0; i < response.length; i++) {
                transformRight['data'].push({
                    id: response[i].stationId,
                    stationId: response[i].stationId,
                    stationName: response[i].stationName,
                    projectId: response[i].projectId,
                    pro: response[i].pro,
                    proName: response[i].proName + "/" + response[i].cityName + "/" + response[i].districtName,
                    city: response[i].city,
                    cityName: response[i].cityName,
                    district: response[i].district,
                    districtName: response[i].districtName,
                    status: response[i].status,
                    equipmentStatus: response[i].equipmentStatus,
                    equipmentId: response[i].equipmentId,
                    operatorResult: response[i].operatorResult,
                    hisEquipmentId: response[i].hisEquipmentId,
                    operateTime: response[i].operateTime,
                    cityName: response[i].cityName,
                    operator: response[i].operator,
                    operatorName: response[i].operatorName
                })
            }

            return transformRight
        },
        transform: function (response) {
            var transformed = {}
            var page = response.pagination;
            transformed.pagination = {
                total: page.total,
                per_page: page.per_page,
                current_page: page.current_page,
                last_page: page.last_page,
                next_page_url: page.next_page_url,
                prev_page_url: page.prev_page_url,
                from: page.from,
                to: page.to
            }
            transformed.data = []
            response = response.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].stationId,
                    stationId: response[i].id + "|" + response[i].stationId,
                    stationName: response[i].stationName,
                    equipmentId: response[i].equipmentId,
                    projectId: response[i].projectId,
                    pro: response[i].pro,
                    city: response[i].city,
                    district: response[i].district,
                    proName: response[i].proName + "/" + response[i].cityName +
                    ((response[i].districtName == null) ? "" : "/" + response[i].districtName),
                    equipmentType: response[i].equipmentType,
                    stationTypeName: response[i].stationTypeName,
                    stationType: response[i].stationType,
                    status: response[i].status,
                    equipmentStatus: response[i].equipmentStatus,
                    latReal: response[i].latReal,
                    lngReal: response[i].lngReal

                })
            }
            return transformed
        },
        onCellMouseEnter: function (data, field, event) {
            if (field.dataClass.indexOf("text-overflow") != -1) {
                if (data[field.name] != "" && data[field.name] != null && data[field.name].length > 9) {
                    layer.tips(data[field.name], event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }
        },
        onCellMouseLeave: function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
        onLoadSuccess: function (response) {
            this.$refs.paginationInfo.setPaginationData(response.data)
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        onLoadError: function (response) {
            console.log(response.data.message);
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        stationIdFmt: function (value) {

            if (value == null || value.length == "") {
                return "";
            } else {
                var data = value.split("|");
                if (this.editStation)
                    return '<a href="' + ctx + '/system/equipment/monitoring/add?id=' + data[1] + '">' + data[1] + '</a>';
                else
                    return data[1];
            }
        },
        addMonitor: function () { //新增
            window.location.href = ctx + "/system/equipment/monitoring/add?id=";
        },
        stationTypeFormat: function (value) {
            return this.stationTypeList.find(function (option) {
                return option.id == value;
            }).name;
        },
        statusFormat: function (value) {
            if (value >= 0) {
                return this.statusList.find(function (option) {
                    return option.id == value;
                }).name;
            }
        },
        equipmentStatusFormat: function (value) {
            var equipmentStatus = this.equipmentStatusList.find(function (option) {
                return option.id == value;
            });
            if (equipmentStatus != null && equipmentStatus != undefined) {
                return equipmentStatus.name;
            } else {
                return '';
            }
        },
        optFormat: function (value) {
            if (value == "1") {
                return "新增";
            } else if (value == "2") {
                return "修改";
            } else if (value == "3") {
                return "删除";
            } else if (value == "4") {
                return "上线";
            } else if (value == "5") {
                return "下线";
            } else if (value == "6") {
                return "绑定设备";
            } else if (value == "7") {
                return "解绑设备";
            } else {
                return "";
            }
        },
        projectFormat: function (value) {
            if (!value) {
                return "";
            }
            var project = this.allProjectList.find(function (option) {
                return option.id == value;
            });

            if (project != null && project != undefined) {
                return project.name;
            } else {
                return '';
            }
        },
        equipmentTypeFormat: function (value) {
            return this.equipmentTypeList.find(function (option) {
                return option.id == value;
            }).name;
        },
        showImportModal: function () {
            $('#importStationModal').modal('show');
        },
        // 上传操作
        importFile: function () {
            if (!this.importProjectId) {
                layer.msg("请选择项目！");
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
                            $('#importStationModal').modal('hide');
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
        updateStatus: function (status) { //上下线
            var _self = this;
            //默认2 上线
            var opt = "上线";
            var url = coreApiPath + '/manage/station/online';
            if (status == '1') {
                opt = "下线";
                url = coreApiPath + '/manage/station/offline';
            }
            var selectTo = _self.$refs.vuetable._data.selectedTo;
            console.log(selectTo);
            if (selectTo.length < 1) {
                layer.msg("请选择" + opt + "的监测点！");
                return false;
            } else if (selectTo.length > 1) {
                layer.msg("只能选择一个" + opt + "的监测点！");
                return false;
            }
            layer.confirm("确定" + opt + "选中的监测点吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var params = {
                        stationIds: selectTo.join(",")
                    };
                    ajax_post_msg(url, params, "保存", function (data) {
                        if (data.erroCode === 2000) {
                            layer.msg(opt + "成功！");
                            _self.$nextTick(function () {
                                _self.$refs.vuetable.refresh()
                            });
                            _self.$refs.vuetable._data.selectedTo = [];
                        } else {
                            layer.msg(opt + "失败！");
                            return false;
                        }
                    })

                }
            });
        },
        deleteByIds: function () { //批量删除

            var _self = this;
            var selectTo = _self.$refs.vuetable._data.selectedTo;

            if (selectTo.length < 1) {
                layer.msg("请选择要删除的监测点！");
                return false;
            }
            var url = coreApiPath + '/manage/station/delete';
            layer.confirm("确定删除选中的监测点吗?", {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var params = {
                        stationIds: selectTo.join(",")
                    };
                    ajax_post_msg(url, params, "删除", function (data) {
                        if (data.erroCode === 2000) {
                            layer.msg("删除成功！");
                            _self.$nextTick(function () {
                                _self.$refs.vuetable.refresh()
                            });
                            _self.$refs.vuetable._data.selectedTo = [];
                        } else if (data.erroCode === 3000) {
                            layer.msg(data.erroMsg);
                            _self.$nextTick(function () {
                                _self.$refs.vuetable.refresh()
                            });
                            _self.$refs.vuetable._data.selectedTo = [];

                            return false;
                        } else {
                            layer.msg("删除失败！");
                            return false;
                        }
                    })

                }
            });
        },
        stationSearch: function () {
            var _self = this;
            _self.moreParams = {};
            if (_self.station.stationIdOrName != "" && _self.station.stationIdOrName != null) {
                _self.moreParams.stationIdOrName = _self.station.stationIdOrName;
            }
            if (_self.station.projectId != -1 && _self.station.projectId != "-1" && _self.station.projectId != "") {
                _self.moreParams.projectId = _self.station.projectId;
            }
            if (_self.station.pro != -1) {
                _self.moreParams.pro = _self.station.pro;
            }
            if (_self.station.city != -1) {
                _self.moreParams.city = _self.station.city;
            }
            if (_self.station.district != -1) {
                _self.moreParams.district = _self.station.district;
            }
            if (_self.station.status != -1) {
                _self.moreParams.status = _self.station.status;
            }
            if (_self.station.mountStatus != -1) {
                _self.moreParams.mountStatus = _self.station.mountStatus;
            }
            if (_self.station.stationType != -1) {
                _self.moreParams.stationType = _self.station.stationType;
            }
            if (_self.station.equipmentType != -1) {
                _self.moreParams.equipmentType = _self.station.equipmentType;
            }

            if (_self.station.equipmentId != "" && _self.station.equipmentId != null) {
                _self.moreParams.equipmentId = _self.station.equipmentId;
            }

            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            })

        },
        stationHisSearch: function () {
            var _self = this;
            _self.hismoreParams = _self.his_station;
            if (_self.hismoreParams.startTime > _self.hismoreParams.endTime) {
                layer.msg("开始时间不能大于结束时间");
                return false;
            }
            if (!calcDate_interval(_self.hismoreParams.startTime, _self.hismoreParams.endTime, '3month')) {
                return false;
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            })
        },

    },
    beforeMount: function () {
        var _self = this;
        _self.initAllFunctions();

    },
    mounted: function () {
        var _self = this;
        //30监测点种类  4监测点类型，12设备状态，11设备类型，31监测点状态,14终端类型等...
        ajax_get(coreApiPath + "/config/type", {
            type: 30
        }, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.equipmentTypeList.push({
                        id: val.code,
                        name: val.name
                    });
                });
            }
        });

        ajax_get(coreApiPath + "/config/type", {
            type: 31
        }, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.statusList.push({
                        id: val.code,
                        name: val.name
                    });
                });
            }
        });

        ajax_get(coreApiPath + "/config/type", {
            type: 12
        }, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result, function (index, val) {
                    _self.equipmentStatusList.push({
                        id: val.code,
                        name: val.name
                    });
                });
            }
        });

        ajax_get(coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
            $.each(data, function (index, val) {
                _self.projectList.push({
                    id: val.id,
                    name: val.name
                });
            });

        });

        ajax_get(coreApiPath + "/sysproject/listAllProject", {}, function (data) {
            $.each(data, function (index, val) {
                _self.allProjectList.push({
                    id: val.id,
                    name: val.name
                });
            });

        });

        //初始化 省份信息
        ajax_get(coreApiPath + "/domain/cascade/0", {}, function (data) {
            if (data.erroCode = 2000) {
                $.each(data.result.provinceList, function (index, val) {

                    _self.newprolist.push({
                        id: val.id,
                        name: val.domainName
                    });
                    // if (val.id == parent.provinceId) {
                    //     _self.station.pro = parent.provinceId;
                    // _self.his_station.pro = parent.provinceId;
                    // }

                });
            }
        });
    }
});


function initTime(flag) {

    var _self = this,
        datafmt = 'yyyy-MM-dd',
        maxDateSite = '%y-%M-%d';

    if (flag == "1") {
        WdatePicker({
            dateFmt: datafmt,
            maxDate: maxDateSite,
            onpicked: function () {
                monitorVM.his_station.startTime = $dp.cal.getDateStr(datafmt);
                $dp.$("startTime").blur();
            }
        });
    } else {
        WdatePicker({
            dateFmt: datafmt,
            maxDate: maxDateSite,
            onpicked: function () {
                monitorVM.his_station.endTime = $dp.cal.getDateStr(datafmt);
                $dp.$("endTime").blur();
            }
        });
    }

}