Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        webUploader: null, //上传文件对象
        editType: editType, //编辑模式 1修改 2反馈
        advisePanelHref: '', //建议面板地址
        surveyResultHref: '', //勘查结果面板地址
        jobCode: pageJobCode, //勘查任务编号
        insTime: '', //发布时间
        publisher: '', //发布人
        state: '', //完成状态
        finishTime: '', //完成时间
        stationList: [], //异常站点
        adviseStartTime: '', //建议开始时间
        adviseEndTime: '', //建议结束时间
        advisePerson: '', //建议人员
        adviseArea: '', //建议区域
        pollutionSource: '', //附近污染源
        feedbacker: '', //反馈人员
        surveyContent: '', //勘查内容
        surveyStartTime: '', //勘查开始时间
        surveyEndTime: '', //勘查结束时间
        surveyPerson: '', //勘查人员
        surveyResult: '', //勘查结果
        files: [], //勘查结果附件
        mobileMonitorList: [] //移动监测
    },
    methods: {
        //保存勘查任务异常站点
        saveErrorStation: function () {
            var _self = this;
            var paramsList = [];
            for (var i = 0; i < this.stationList.length; ++i) {
                var station = this.stationList[i];
                if (!station.stationName) {
                    layer.msg("站点信息不能为空", function () {
                    });
                    return
                }
                if (!station.abnormalStartTime || !station.abnormalEndTime) {
                    layer.msg("异常时间范围不能为空", function () {
                    });
                    return
                }
                if (station.abnormalStartTime > station.abnormalEndTime) {
                    layer.msg("异常开始时间不能大于结束时间", function () {
                    });
                    return
                }
                var startDate = Date.parse(new Date(station.abnormalStartTime));
                var endDate = Date.parse(new Date(station.abnormalEndTime));
                if ((endDate - startDate) > 24 * 3600000) {
                    layer.msg("异常时间范围不能超过24小时", function () {
                    });
                    return
                }
                if (!station.abnormalContent) {
                    layer.msg("异常现象不能为空", function () {
                    });
                    return
                }
                var params = {
                    'stationId': station.stationId,
                    'abnormalStartTime': station.abnormalStartTime,
                    'abnormalEndTime': station.abnormalEndTime,
                    'abnormalContent': station.abnormalContent
                };
                paramsList.push(params);
            }
            post_ajax($.backendApiPath + '/surveyjob/add', JSON.stringify(paramsList), "保存异常点位", 'application/json; charset=UTF-8',
                function (json) {
                    if (json.erroCode === 2000) {
                        _self.jobCode = json.result;
                        layer.msg("保存成功！");
                        setTimeout(function () {
                            window.location.href = $.ctx + '/surveyjob/add?editType=2&jobCode=' + _self.jobCode;
                        }, 1000)
                    } else {
                        layer.msg(json.erroMsg, function () {
                        });
                    }
                });
        },
        //保存勘查建议信息
        saveAdviseInfo: function () {
            var _self = this;
            if (!this.adviseStartTime || !this.adviseEndTime) {
                layer.msg("建议时间范围不能为空", function () {
                });
                return
            }
            if (this.adviseStartTime > this.adviseEndTime) {
                layer.msg("建议开始时间不能大于结束时间", function () {
                });
                return
            }
            if (!this.advisePerson) {
                layer.msg("建议人员不能为空", function () {
                });
                return
            }
            if (!this.adviseArea) {
                layer.msg("建议区域不能为空", function () {
                });
                return
            }
            if (!this.pollutionSource) {
                layer.msg("附近污染源不能为空", function () {
                });
                return
            }
            if (!this.surveyContent) {
                layer.msg("勘查内容不能为空", function () {
                });
                return
            }
            var params = {
                'jobCode': this.jobCode,
                'adviseStartTime': this.adviseStartTime,
                'adviseEndTime': this.adviseEndTime,
                'advisePerson': this.advisePerson,
                'adviseArea': this.adviseArea,
                'pollutionSource': this.pollutionSource,
                'surveyContent': this.surveyContent
            };
            post_ajax($.backendApiPath + '/surveyjob/advise', JSON.stringify(params), "保存建议信息", 'application/json; charset=UTF-8',
                function (json) {
                    if (json.erroCode === 2000) {
                        layer.msg("保存成功！");
                        setTimeout(function () {
                            _self.goBack();
                        }, 1000)
                    } else {
                        layer.msg(json.erroMsg, function () {
                        });
                    }
                });
        },
        //保存勘查结果和移动监测
        saveMobileMonitor: function () {
            var _self = this;
            if (!this.surveyStartTime || !this.surveyEndTime) {
                layer.msg("勘查时间范围不能为空", function () {
                });
                return
            }
            if (this.surveyStartTime > this.surveyEndTime) {
                layer.msg("勘查开始时间不能大于结束时间", function () {
                });
                return
            }
            if (!this.surveyPerson) {
                layer.msg("勘查人员不能为空", function () {
                });
                return
            }
            if (!this.surveyResult) {
                layer.msg("勘查结果不能为空", function () {
                });
                return
            }
            var resultParams = {
                'jobCode': this.jobCode,
                'surveyStartTime': this.surveyStartTime,
                'surveyEndTime': this.surveyEndTime,
                'surveyPerson': this.surveyPerson,
                'surveyResult': this.surveyResult,
                'files': this.files
            };
            if (this.mobileMonitorList.length > 0) {
                for (var i = 0; i < this.mobileMonitorList.length; ++i) {
                    var monitor = this.mobileMonitorList[i];
                    // if (!monitor.monitorId) {
                    //     layer.msg("移动监测设备编号不能为空", function () {
                    //     });
                    //     return
                    // }
                    // if (!monitor.monitorStartTime || !monitor.monitorEndTime) {
                    //     layer.msg("移动监测时间不能为空", function () {
                    //     });
                    //     return
                    // }
                    if (monitor.monitorStartTime > monitor.monitorEndTime) {
                        layer.msg("移动监测开始时间不能大于结束时间", function () {
                        });
                        return
                    }
                    // if (!monitor.monitorAddress) {
                    //     layer.msg("移动监测位置不能为空", function () {
                    //     });
                    //     return
                    // }
                    // if (!monitor.monitorLng || !monitor.monitorLat) {
                    //     layer.msg("经度或纬度不能为空", function () {
                    //     });
                    //     return
                    // }
                    // if (!monitor.monitorContent) {
                    //     layer.msg("移动监测结果描述不能为空", function () {
                    //     });
                    //     return
                    // }
                    monitor.jobCode = this.jobCode;
                }
            }
            var params = {
                resultParams: resultParams,
                mobileMonitorList: this.mobileMonitorList
            }
            post_ajax($.backendApiPath + '/surveyjob/mobile/monitor', JSON.stringify(params), "保存勘查结果", 'application/json; charset=UTF-8',
                function (json) {
                    if (json.erroCode === 2000) {
                        _self.jobCode = json.result;
                        layer.msg("保存成功！");
                        setTimeout(function () {
                            _self.goBack();
                        }, 1000)
                    } else {
                        layer.msg(json.erroMsg, function () {
                        });
                    }
                });
        },
        //查询点位信息
        searchStation: function (station, index) {
            var _self = this;
            if (!station.id) {
                layer.msg('监测点编号不能为空', function () {

                })
                return
            }
            //判断是否已经搜索过此站点
            for (var i = 0; i < _self.stationList.length; ++i) {
                if (_self.stationList[i].stationId == station.id) {
                    layer.msg("您已经搜索过此站点了", function () {
                    });
                    return
                }
            }
            //查询站点信息
            ajax_get($.backendApiPath + "/wmstation/" + station.id, {}, function (json) {
                if (json.erroCode == 2000) {
                    json.result.abnormalStartTime = station.abnormalStartTime;
                    json.result.abnormalEndTime = station.abnormalEndTime;
                    json.result.abnormalContent = station.abnormalContent;
                    json.result.id = station.id;
                    _self.stationList.splice(index, 1, json.result);
                } else {
                    layer.msg(json.erroMsg, function () {
                    });
                }
            });
        },
        //移除点位
        removeStation: function (station, index) {
            this.stationList.splice(index, 1);
            if (this.stationList.length == 0) {
                this.stationList.push({});
            }
        },
        //新增点位
        addStation: function () {
            var _self = this;
            _self.stationList.push({});
        },
        //移除移动监测
        removeMobileMonitor: function (station, index) {
            this.mobileMonitorList.splice(index, 1);
            if (this.mobileMonitorList.length == 0) {
                this.mobileMonitorList.push({});
            }
        },
        //新增移动监测
        addMobileMonitor: function () {
            var _self = this;
            _self.mobileMonitorList.push({});
        },
        removeFileCallBack: function (file) {
            //删除地址数组
            for (var i = 0; i < this.files.length; ++i) {
                if (this.files[i].url == file.wmUrl) {
                    this.files.splice(i, 1);
                }
            }
        },
        initFilesUpload: function () {
            var _self = this;
            //上传附件
            this.webUploader = $('#filesUpload').diyUpload({
                url: $.backendApiPath + '/file/upload',
                auto: true,
                success: function (data, file) {
                    if (data.erroCode != 2000) {
                        _self.webUploader.trigger('uploadError', file, "Server error");
                    } else {
                        //成功
                        $("#fileBox_" + file.id).find("a").attr("href", data.result.urlPrefix + data.result.url);
                        _self.files.push({
                            'jobCode': _self.jobCode,
                            'url': data.result.url,
                            'name': file.name
                        });
                        file.wmUrl = data.result.url;
                    }
                },
                error: function (err, file) {
                    $("#fileBox_" + file.id).remove();
                    layer.msg("上传文件" + file.name + "失败！！！");
                },
                removeCallback: _self.removeFileCallBack,
                buttonText: '',
                accept: {
                    title: "all",
                    extensions: 'pdf,doc,docx,xls,xlsx,3gp,mp4,rmvb,mov,avi,m4v,gif,jpg,jpeg,bmp,png'
                },
                //最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
                fileNumLimit: 5,
                fileSingleSizeLimit: 10 * 1024 * 1024,
                thumb: {
                    width: 120,
                    height: 90,
                    quality: 100,
                    allowMagnify: true,
                    crop: true
                }
            });
        },
        showHaveFiles: function (_files) {
            var _self = this;
            //展示已经保存的图片
            for (var i = 0; i < _files.length; ++i) {
                $('#filesUpload').showHaveFile(_files[i].id, _files[i].fullUrl, _files[i].wmUrl, _self.removeFileCallBack, false, _files[i].name);
            }
            if (this.editType == '4') {
                $(".diyControl").remove();
            }
        },
        //返回列表页
        goBack: function () {
            window.location.href = $.ctx + "/surveyjob";
        }
    },
    mounted: function () {
        var _self = this;
        //初始化上传附件
        this.initFilesUpload();
        if (_self.jobCode) {
            //有勘查任务编号
            _self.advisePanelHref = '#advise-div';
            ajax_get($.backendApiPath + "/surveyjob/" + this.jobCode, {}, function (json) {
                if (json.erroCode == 2000) {
                    _self.state = json.result.state;
                    _self.publisher = json.result.publisher;
                    _self.insTime = json.result.insTime;
                    _self.finishTime = json.result.finishTime;
                    _self.stationList = json.result.stationDTOList;
                    _self.adviseStartTime = json.result.adviseStartTime;
                    _self.adviseEndTime = json.result.adviseEndTime;
                    _self.advisePerson = json.result.advisePerson;
                    _self.adviseArea = json.result.adviseArea;
                    _self.pollutionSource = json.result.pollutionSource;
                    _self.feedbacker = json.result.feedbacker;
                    _self.surveyContent = json.result.surveyContent;
                    _self.surveyStartTime = json.result.surveyStartTime;
                    _self.surveyEndTime = json.result.surveyEndTime;
                    _self.surveyPerson = json.result.surveyPerson;
                    _self.surveyResult = json.result.surveyResult;
                    _self.mobileMonitorList = json.result.monitorDTOList;
                    if (_self.mobileMonitorList.length == 0) {
                        _self.mobileMonitorList.push({});
                    }
                    var fileLen = json.result.attachmentDTOList.length;
                    if (fileLen > 0) {
                        //重置文件数量限制
                        _self.webUploader.option('fileNumLimit', 5 - fileLen);
                        if (fileLen >= 5) {
                            $(".upload-pick").hide();
                        }
                        //显示已上传文件
                        _self.showHaveFiles(json.result.attachmentDTOList);
                        for (var i = 0; i < json.result.attachmentDTOList.length; ++i) {
                            var wmFile = json.result.attachmentDTOList[i];
                            _self.files.push({
                                'jobCode': wmFile.jobCode,
                                'url': wmFile.wmUrl,
                                'name': wmFile.name
                            });
                        }
                    }
                }
            });
        } else {
            //新增空勘查异常点位
            _self.stationList.push({});
        }
        if (_self.editType == '2') {
            $("#advise-panel").click();
        }
        if (_self.editType == '3') {
            $("#result-panel").click();
        }
    },
    watch: {}
});

$(function () {
    if (editType == '1') {
        $("#pageName").text("新建勘查任务");
    }
    if (editType == '2') {
        $("#pageName").text("修改勘查任务");
    }
    if (editType == '3') {
        $("#pageName").text("反馈勘查");
    }
    if (editType == '4') {
        $("#pageName").text("勘查任务详情");
    }
});
