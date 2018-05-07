var tableColumns = [
    {
        name: '__checkbox:equipmentId',
        width: '40px'
    },
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '60px'
    },

    {
        name: 'equipmentId',
        title: "设备编号",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'mountStatus',
        title: "绑定状态",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'mountTime',
        title: '绑定时间',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'formatDate|yyyy-MM-dd HH:mm:ss'
    },
    {
        name: 'mountTime',
        title: '解绑时间',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'formatDate|yyyy-MM-dd HH:mm:ss'
    }
]

var tableColmUnMount = [
    {
        name: '__checkbox:id',
        width: '40px'
    },
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center',
        dataClass: 'text-center',
        width: '60px'
    },

    {
        name: 'equipmentId',
        title: "设备编号",
        titleClass: 'text-center',
        dataClass: 'text-center'
    },
    {
        name: 'sTechType',
        title: '设备类型',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'sTechTypeFmt'
    }, {
        name: 'equipmentType',
        title: '终端类型 ',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: 'equipmentTypeFmt'
    },
    {
        name: 'status',
        title: '设备状态',
        titleClass: 'text-center',
        dataClass: 'text-center'
    }
]

Vue.use(Vuetable);
Vue.config.productionTip = false;
var monitorVM = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        fieldsHis: tableColumns,
        fieldsUnMount: tableColmUnMount,
        tableHeight: 'auto', //设置表格可滚动的区域高度
        moreParamsHis: {},
        moreParams: {},
        fillFormHis: "transformHis",
        trackByUnMount: "equipmentId",
        fillFormUnmount: "transformUnMount",
        paginationComponent: 'vuetable-pagination',
        noDataTemplate: '没有相关的数据',
        perPage: 10,
        loadOnStart: false,
        map: "",
        isEdit: 0,
        showPic: 2,
        images: [],
        selectedTo: [],
        newprolist: [],
        newcitylist: [],
        newdislist: [],
        //新增监测 点对象
        newstation: {
            id: "",
            stationId: "",
            stationName: "",
            projectId: "",
            pro: -1,
            city: -1,
            district: -1,
            equipmentType: -1,
            stationType: -1,
            addr: "",
            status: -1,
            poleId: '',
            ammeterNo: '',
            latReal: '',
            lngReal: '',
            lat: '',
            lng: '',
            mark: '',
            equipLat: null,
            equipLatGps: null,
            equipLng: null,
            equipLngGps: null
        },
        bdMarker: null,
        gpsMarker: null,
        equipmentTypeList: [], //监测点种类
        equipmentTypeList1: [], //终端类
        sTechTypeList: [], ////设备类型
        show: false,
        showStations: false,
        showMaphtml: "展开地图",
        stationTypeList: [],
        statusList: [],
        projectList: [],
        equipmentIds: [],
        checkAll: false,
        allFunctions: {},
        cityCenter: "", //回显示地图中心点
        mountHisData: [] //绑定设备的列表数据
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
        transformHis: function (response) {
            var transformed = {}
            transformed.pagination = {
                total: response.result.pagination.total,
                per_page: response.result.pagination.per_page,
                current_page: response.result.pagination.current_page,
                last_page: response.result.pagination.last_page,
                next_page_url: response.result.pagination.next_page_url,
                prev_page_url: response.result.pagination.prev_page_url,
                from: response.result.pagination.from,
                to: response.result.pagination.to
            }

            transformed.data = []
            response = response.result.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].equipmentId,
                    equipmentId: response[i].equipmentId,
                    mountStatus: response[i].mountStatus,
                    mountTime: response[i].mountTime
                })
            }
            return transformed
        },
        transformUnMount: function (response) {
            var transformed = {}
            transformed.pagination = {
                total: response.result.pagination.total,
                per_page: response.result.pagination.per_page,
                current_page: response.result.pagination.current_page,
                last_page: response.result.pagination.last_page,
                next_page_url: response.result.pagination.next_page_url,
                prev_page_url: response.result.pagination.prev_page_url,
                from: response.result.pagination.from,
                to: response.result.pagination.to
            }

            transformed.data = []
            response = response.result.data
            for (var i = 0; i < response.length; i++) {
                transformed['data'].push({
                    id: response[i].equipmentId,
                    equipmentId: response[i].equipmentId,
                    equipmentType: response[i].equipmentType,
                    status: response[i].status,
                    sTechType: response[i].sTechType
                })
            }
            return transformed
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'D MMM YYYY' : fmt
            return moment(value, 'YYYY-MM-DD').format(fmt)
        },
        onLoadSuccessHis: function (response) {
            this.$refs.paginationInfo.setPaginationData(response.data)
        },
        onLoadSuccess: function (response) {
            this.$refs.paginationInfo.setPaginationData(response.data)
        },
        onPaginationDataHis: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePageHis: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        initMap: function () {
            var _self = this;
            if (sid != null && sid != '') {
                for (var i = 0; i < _self.newcitylist.length; i++) {
                    if (_self.newcitylist[i].id == _self.newstation.city) {
                        _self.cityCenter = _self.newcitylist[i].name;
                    }
                }
                if (_self.cityCenter != "") {
                    _self.map = initMyBMapWithMaxMin("monitoringMap", _self.cityCenter, 8, 4, 14);
                } else {
                    _self.map = initMyBMapWithMaxMin("monitoringMap", parent.cityName, 8, 4, 14);
                }
            } else {
                _self.map = initMyBMapWithMaxMin("monitoringMap", parent.cityName, 8, 4, 14);
            }
        },
        showNewMarker: function (lat, lng) {
            var _self = this;
            if (_self.bdMarker != null) {
                _self.map.removeOverlay(_self.bdMarker);
                _self.mkBdMarker(_self.newstation.lngReal, _self.newstation.latReal);
                // 将标注添加到地图中
                _self.map.addOverlay(_self.bdMarker);
            }
        },
        addMarker: function () {
            var _self = this;
            if (_self.map != "") {
                _self.map.clearOverlays();
                if (_self.newstation.lngReal != "" && _self.newstation.lngReal != null && _self.newstation.latReal != "" && _self.newstation.latReal != null) {
                    var point =new BMap.Point(_self.newstation.lngReal, _self.newstation.latReal);
                    _self.mkBdMarker(_self.newstation.lngReal, _self.newstation.latReal);
                    // 将标注添加到地图中
                    _self.map.addOverlay(_self.bdMarker);
                    // _self.map.setCenterAndZoom(point,7)
                    _self.map.setCenter(point);

                }
                //设备上传的经纬度
                if (_self.newstation.equipLat != "" && _self.newstation.equipLat != null && _self.newstation.equipLng != "" && _self.newstation.equipLng != null) {
                    var marker_gps = new BMap.Icon($.ctx + '/resources/img/sprite/marker_gps.png', new BMap.Size(24, 24));
                    _self.gpsMarker = new BMap.Marker(new BMap.Point(_self.newstation.equipLng, _self.newstation.equipLat), {
                        icon: marker_gps
                    });
                    var gpsInfoWindow = new BMap.InfoWindow("<div>静态经纬度<br/>经度：" + _self.newstation.equipLngGps + "<br/>纬度：" + _self.newstation.equipLatGps + "</div>");
                    _self.gpsMarker.addEventListener("mouseover", function () {
                        this.openInfoWindow(gpsInfoWindow);
                    });
                    _self.gpsMarker.addEventListener("mouseout", function () {
                        _self.map.closeInfoWindow();
                    });
                    // 将标注添加到地图中
                    _self.map.addOverlay(_self.gpsMarker);
                }
            }
        },
        mkBdMarker: function (lngReal, latReal) {
            var _self = this;
            var point =new BMap.Point(lngReal, latReal);
            var bk_marker_icon = new BMap.Icon($.ctx + '/resources/img/sprite/marker_bd.png', new BMap.Size(24, 24));
            _self.bdMarker = new BMap.Marker(point, {
                icon: bk_marker_icon
            });
            var bk_marker_infoWin = new BMap.InfoWindow("<div>静态经纬度<br/>经度：" + lngReal + "<br/>纬度：" + latReal + "</div>");
            _self.bdMarker.addEventListener("mouseover", function () {
                this.openInfoWindow(bk_marker_infoWin);
            });
            _self.bdMarker.addEventListener("mouseout", function () {
                _self.map.closeInfoWindow();
            });
        },
        pictureManager: function () {
            var _self = this;
            $("#photostab").hide();
            $("#pho").show();
            _self.initFileUplad();
            $('#addPicModal').modal('show');
        },
        goReView: function () {
            var _self = this;
            _self.showPic = 1;
            _self.images = [];
            $.ajax({
                type: "post",
                url: $.backendApiPath + '/wmstation/image/' + sid,
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                success: function (data) {
                    if (data.erroCode === 2000) {
                        var _images = data.result.map(function (d) {
                            d.isselect = false;
                            return d;
                        });
                        _self.showHaveImages(_images);
                        for (var i = 0; i < _images.length; i++) {
                            _self.images.push(_images[i].wmUrl);
                        }
                    } else {
                        //错误码2000：成功，3000：失败，4000：未登录或者登陆超时，5000：没有权限
                    }
                },
                error: function (errorMsg) {
                    console.log("error:::::::::/rest/station/getImages/" + stationId);
                }
            });
        },
        showAddPic: function () {
            var _self = this;
            _self.showPic = 2;
        },
        initFileUplad: function () {
            var _self = this;
            $("#uploadFileIpt").fileinput({
                uploadUrl: $.coreApiPath + "/rest/station/batchUpload",
                // uploadUrl: coreApiPath + "/manage/station/batchUpload",
                allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
                overwriteInitial: false,
                previewSettings: {
                    image: {
                        width: "50px",
                        height: "50px"
                    },
                },
                maxFileSize: 3000,
                maxFilesNum: 10,
                language: 'zh',
                previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
                slugCallback: function (filename) {
                    return filename.replace('(', '_').replace(']', '_');
                },
                uploadExtraData: function (previewId, index) { //额外参数的关键点
                    var obj = {};
                    obj.id = _self.newstation.stationId;
                    return obj;
                }
            }).on("fileuploaded", function (event, data) {
                getStationPics(_self.newstation.stationId);
            });
        },
        savePics: function () {
            $('#addPicModal').modal('hide');
        },
        saveStationBase: function () {
            var _self = this;
            if (_self.validateFrm()) {
                var url = coreApiPath + "/manage/station/save";
                var contentType = 'application/json; charset=UTF-8';
                post_ajax(url, JSON.stringify(_self.newstation), "保存", contentType, function (response) {

                    if (response.erroCode == 2000) {
                        layer.msg("保存成功")
                        _self.newstation = response.result;
                        disabledByDomId("stationId");
                    } else if (response.erroCode == 3000) {
                        layer.msg(response.erroMsg);
                        return false;
                    }
                });

            }
        },
        saveStationImages: function () {
            var _self = this;
            if (_self.validateFrm()) {
                var url = coreApiPath + "/rest/station/imagesUpload";
                var contentType = 'application/json; charset=UTF-8';
                var params = {
                    "stationId": _self.newstation.stationId,
                    "images": _self.images
                }
                post_ajax(url, JSON.stringify(params), "保存图片", contentType, function (response) {
                    if (response.erroCode == 2000) {
                        layer.msg("保存图片成功");
                        setTimeout(function () {
                            $("#stationListCollapse").click();
                        }, 1000)
                    } else {
                        layer.msg(response.erroMsg);
                        return false;
                    }
                });

            }
        },
        goBack: function () {
            window.location.href = ctx + "/system/equipment/monitoring/index";
        },
        validateFrm: function () {
            var _self = this;

            if (_self.newstation.stationName == "" || _self.newstation.stationName == null) {
                layer.msg("监测点名称不能为空");
                return false;
            }
            if (_self.newstation.stationId == "" || _self.newstation.stationId == null) {
                layer.msg("监测点编号不能为空");
                return false;
            }
            if (_self.newstation.projectId == null || _self.newstation.projectId == ''
                || _self.newstation.projectId == -1) {
                layer.msg("请选择所属项目");
                return false;
            }
            if (_self.newstation.equipmentType == -1) {
                layer.msg("请选择监测点种类");
                return false;
            }

            if (_self.newstation.stationType == -1) {
                layer.msg("请选择监测点类型");
                return false;
            }
            if (_self.newstation.pro == -1) {
                layer.msg("请选择省");
                return false;
            }
            if (_self.newstation.city == -1) {
                layer.msg("请选择城市");
                return false;
            }
            if (_self.newstation.district == -1) {
                layer.msg("请选择区域");
                return false;
            }

            if (_self.isEdit == 1 && $("#optionStatus").val() == -1) {
                layer.msg("请选择监测点状态");
                return false;
            }

            if (_self.newstation.lngReal == "" || _self.newstation.lngReal == null) {
                layer.msg("经度为空");
                return false;
            }
            if (_self.newstation.latReal == "" || _self.newstation.latReal == null) {
                layer.msg("纬度不能为空");
                return false;
            }
            return true;

        },
        showMap: function () {
            var _self = this;
            _self.show = !(_self.show);
            if (_self.show) {
                if (_self.map == "") {
                    _self.initMap();
                    _self.addMarker();
                }
                _self.showMaphtml = "收回地图";
            } else {
                _self.showMaphtml = "展开地图"
            }

        },
        viewMonitor: function () { //展示监测 点
            var _self = this;
            if (sid != null && sid != "") {
                //修改监测点显示监测点状态
                $("#div-status").show();
                _self.isEdit = 1;//修改标识

                _self.newstation.id = sid;
                $("#pageName").html("修改监测点");
                disabledByDomId("stationId");
                var url = coreApiPath + "/manage/station/findStationById";
                ajax_get(url, {
                    stationId: sid
                }, function (data) {
                    if (data.erroCode == 2000) {
                        _self.newstation = data.result;
                        // _self.newstation.stationType = data.result.stationType + "";
                        _self.newstation.id = sid;

                        //获取监测点状态
                        ajax_get(coreApiPath + "/config/type", {
                            type: 31
                        }, function (data) {
                            _self.statusList = [];
                            if (data.erroCode = 2000) {
                                $.each(data.result, function (index, val) {
                                    var selected = _self.newstation.status == val.code ? 'selected' : '';
                                    //修改非未激活状态的监测点，监测点状态列表不展示未激活
                                    if (_self.newstation.id == '' || _self.newstation.status == 3) {
                                        $("#optionStatus").append("<option value='" + val.code + "' " + selected + ">" + val.name + "</option>");
                                    } else {
                                        if (_self.newstation.status != 3 && val.code != 3) {
                                            $("#optionStatus").append("<option value='" + val.code + "' " + selected + ">" + val.name + "</option>");
                                        }
                                    }
                                });
                            }
                        });
                    }
                })
            } else {
                $("#pageName").html("添加监测点");
                removeAttrByDomId("stationId", "disabled");
            }

        }, //查看监测点
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
        },
        equipmentMountTab: function () {
            var _self = this;
            _self.mountHis();

            _self.$refs.vuetable._data.selectedTo = [];
            _self.moreParams = {
                equipmentType: _self.newstation.equipmentType,
                projectId: _self.newstation.projectId
            };
            _self.$nextTick(function () {
                _self.$refs.vuetable.refresh()
            })
        },
        mountHis: function () {
            var _self = this;
            var url = coreApiPath + "/manage/station/historyMount";
            var contentType = 'application/json; charset=UTF-8';
            var params = {
                page: 1,
                perPage: 1000,
                stationId: this.newstation.stationId
            };
            post_ajax(url, JSON.stringify(params), "加载", contentType, function (data) {
                _self.equipmentIds = [];
                if (data.erroCode == 2000) {
                    _self.mountHisData = data.result.data;
                }
            })
        },
        checkAllEquipment: function (event) {
            var _self = this;
            if (event.target.checked) {
                _self.equipmentIds = [];
                $.each(_self.mountHisData, function (idx, val) {
                    _self.equipmentIds.push(val.equipmentId);
                })
            } else {
                _self.equipmentIds = [];
            }
        }, //绑定设备
        mountEquipment: function () {
            var _self = this;
            if (_self.selectedTo.length == 0) {
                layer.msg("请选择要绑定的设备！")
                return false;
            } else if (_self.selectedTo.length > 1) {
                layer.msg("一次只能绑定一台设备！")
                return false;
            }

            layer.confirm('确定绑定选中的设备吗?<br/>监测点状态&nbsp&nbsp&nbsp&nbsp' +
                '<input type="radio" name="umountStatus" checked="true" value="0">不变&nbsp&nbsp' +
                '<input type="radio" name="umountStatus" value="1">正常', {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var umountStatus = document.getElementsByName("umountStatus");
                    var changeStatus = 0;
                    for (var i = 0; i < umountStatus.length; i++) {
                        if (umountStatus[i].checked) {
                            changeStatus = umountStatus[i].value;
                        }
                    }
                    var params = {
                        stationId: _self.newstation.stationId,
                        equipmentId: _self.selectedTo.join(","),
                        changeStatus: changeStatus
                    };
                    var url = coreApiPath + '/manage/station/mount';
                    ajax_post_msg(url, params, "绑定", function (data) {
                        if (data.erroCode === 2000) {
                            layer.msg("绑定成功！");
                            _self.equipmentMountTab();
                        } else {
                            layer.msg("绑定失败,请联系管理员！");
                            return false;
                        }
                    });

                }
            });

        }, //解绑设备
        unMountEquipment: function () {
            var _self = this;
            if (_self.equipmentIds.length == 0) {
                layer.msg("请选择要解绑的设备！")
                return false;
            } else if (_self.equipmentIds.length > 1) {
                layer.msg("一次只能解绑一台设备！")
                return false;
            }

            layer.confirm('确定解绑选中的设备吗?<br/>监测点状态&nbsp&nbsp&nbsp&nbsp' +
                '<input type="radio" name="umountStatus" checked="true" value="0">不变&nbsp&nbsp' +
                '<input type="radio" name="umountStatus" value="1">休眠', {
                title: '提示',
                btn: ['确定', '取消'], // 按钮
                yes: function (index) {
                    var umountStatus = document.getElementsByName("umountStatus");
                    var changeStatus = 0;
                    for (var i = 0; i < umountStatus.length; i++) {
                        if (umountStatus[i].checked) {
                            changeStatus = umountStatus[i].value;
                        }
                    }
                    var params = {
                        stationId: _self.newstation.stationId,
                        equipmentId: _self.equipmentIds.join(","),
                        changeStatus: changeStatus
                    };
                    var url = coreApiPath + '/manage/station/unmount';
                    ajax_post_msg(url, params, "解绑", function (data) {
                        if (data.erroCode === 2000) {
                            layer.msg("解绑成功！");
                            _self.equipmentMountTab();
                            _self.equipmentIds = [];
                        } else {
                            layer.msg("解绑失败,请联系管理员！");
                            return false;
                        }
                    });

                }
            });

        },
        sTechTypeFmt: function (value) {
            return this.sTechTypeList.find(function (option) {
                return option.code == value;
            }).name;
        },
        equipmentTypeFmt: function (value) {
            return this.equipmentTypeList1.find(function (option) {
                return option.id == value;
            }).name;
        },
        removeImageCallBack: function (file) {
            //删除之后更新图片浏览器
            $('#imagesContent').viewer('destroy').viewer('update');
            //删除地址数组
            var index = this.images.indexOf(file.wmUrl);
            if (index > -1) {
                this.images.splice(index, 1);
            }
        },
        initImagesUpload: function () {
            var _self = this;
            //浏览图片
            $.fn.viewer.setDefaults({
                selectorImg: '.viewerImgClass',
                title: true,
                url: 'data-original',
                zIndex: 10002
            });
            //上传图片
            var webUploader = $('#imagesUpload').diyUpload({
                url: $.backendApiPath + '/file/upload',
                auto: true,
                success: function (data, file) {
                    if (data.erroCode != 2000) {
                        webUploader.trigger('uploadError', file, "Server error");
                    } else {
                        //成功更新图片浏览器和地址数组
                        $("#fileBox_" + file.id).find("img").attr("data-original", data.result.urlPrefix + data.result.url);
                        $('#imagesContent').viewer('destroy').viewer('update');
                        _self.images.push(data.result.url);
                        file.wmUrl = data.result.url;
                    }
                },
                error: function (err, file) {
                    $("#fileBox_" + file.id).remove();
                    layer.msg("上传文件" + file.name + "失败！！！");
                },
                removeCallback: _self.removeImageCallBack,
                buttonText: '',
                accept: {
                    title: "Images",
                    extensions: 'gif,jpg,jpeg,bmp,png'
                },
                thumb: {
                    width: 120,
                    height: 90,
                    quality: 100,
                    allowMagnify: true,
                    crop: true
                }
            });
            //查询站点已有图片
            if (sid) {
                _self.goReView();
            }
        },
        showHaveImages: function (_images) {
            var _self = this;
            //展示已经保存的图片
            for (var i = 0; i < _images.length; ++i) {
                $('#imagesUpload').showHaveFile(_images[i].id, _images[i].fullUrl, _images[i].wmUrl, _self.removeImageCallBack);
            }
            //更新图片浏览器
            $('#imagesContent').viewer('destroy').viewer('update');
        }
    },
    mounted: function () {
        var _self = this;
        _self.initAllFunctions();

        //30监测点种类  4监测点类型，12设备状态，11设备类型，31监测点状态,14终端类型等...
        ajax_get(coreApiPath + "/manage/station/configAddPage", {}, function (data) {
            _self.equipmentTypeList = [];
            _self.statusList = [];
            _self.sTechTypeList = [];
            _self.equipmentTypeList1 = [];

            if (data.erroCode = 2000) {

                //解析监测点种类type=30
                $.each(data.result.equipmentTypeList, function (index, val) {
                    _self.equipmentTypeList.push({
                        id: val.code,
                        name: val.name
                    });
                });

                //解析设备状态type=12
                $.each(data.result.equipmentStatusList, function (index, val) {
                    _self.statusList.push({
                        id: val.code,
                        name: val.name
                    });
                });

                //解析设备类型type=11
                $.each(data.result.sTechTypeList, function (index, val) {
                    _self.sTechTypeList.push({
                        code: val.code,
                        name: val.name
                    });
                });

                //解析终端类型type=14
                $.each(data.result.productTypeList, function (index, val) {
                    _self.equipmentTypeList1.push({
                        id: val.code,
                        name: val.name
                    });
                });
            }
        });

        ajax_get(coreApiPath + "/sysproject/getProjectByUserId", {}, function (data) {
            _self.projectList = [];
            $.each(data, function (index, val) {
                _self.projectList.push({
                    id: val.id,
                    name: val.name
                });
            });
        });

        //初始化 省份信息
        ajax_get(coreApiPath + "/domain/cascade/0", {}, function (data) {
            _self.newprolist = [];
            if (data.erroCode = 2000) {
                $.each(data.result.provinceList, function (index, val) {
                    _self.newprolist.push({
                        id: val.id,
                        name: val.domainName
                    });
                });
            }
        });
        _self.viewMonitor();
        _self.initImagesUpload();
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
        'newstation.latReal': function () {
            var _self = this;
            if (_self.newstation.latReal != "" && _self.newstation.latReal != null && _self.newstation.lngReal != "" && _self.newstation.lngReal != null) {
                _self.showNewMarker(_self.newstation.latReal, _self.newstation.lngReal);
            }
        },
        'newstation.lngReal': function () {
            var _self = this;
            if (_self.newstation.latReal != "" && _self.newstation.latReal != null && _self.newstation.lngReal != "" && _self.newstation.lngReal != null) {
                _self.showNewMarker(_self.newstation.latReal, _self.newstation.lngReal);
            }
        },
        'newstation.pro': function () {
            var _self = this;
            if (_self.newstation.pro == -1) {
                return false;
            }
            _self.newcitylist = [];
            _self.newdislist = [];
            ajax_get(coreApiPath + "/domain/child/" + _self.newstation.pro, {}, function (data) {
                if (data.erroCode = 2000) {
                    $.each(data.result, function (index, val) {
                        _self.newcitylist.push({
                            id: val.id,
                            name: val.domainName
                        });
                    });
                }

            });
        },
        'newstation.city': function () {
            var _self = this;
            if (_self.newstation.city != -1) {

                ajax_get(coreApiPath + "/domain/child/" + _self.newstation.city, {}, function (data) {
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
        'newstation.equipmentType': function () {
            var _self = this;
            if (_self.newstation.equipmentType == 0) {
                _self.showStations = true;
            } else {
                _self.showStations = false;
            }
            //监测点类型
            _self.stationTypeList = [];
            if (_self.newstation.equipmentType != -1) {
                ajax_get(coreApiPath + "/config/type", {
                    type: _self.newstation.equipmentType
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
        'equipmentIds': function () {
            var _self = this;
            if (_self.equipmentIds.length == _self.mountHisData.length) {
                _self.checkAll = true;
            } else {
                _self.checkAll = false;
            }
        },
        'showPic': function () {
            if (this.showPic == 2) {
                $("#photostab").hide();
                $("#pho").show();
                this.initFileUplad();
            } else {
                $("#photostab").show();
                $("#pho").hide();
            }
        }
    }
});

Event.$on("selectedToIds", function (data) {
    monitorVM.selectedTo = data;
}.bind(this));