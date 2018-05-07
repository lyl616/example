/**
 * 站点显示与隐藏
 */
function stationIsCover() {
    var _self = airMonitoringVM;
    _self.showStation = !_self.showStation;
    if (_self.showStation) {
        for (var i = -1; i <= 6; i++) {
            if (i == -1) {
                _self.showLevel[i] = false; //改当前状态
            } else {
                _self.showLevel[i] = true; //改当前状态
            }
        }
    } else {
        for (var i = -1; i <= 6; i++) {
            _self.showLevel[i] = false; //改当前状态
        }
    }
    _self.showMarkers();
}


/**
 * 点击选中某一类 站点
 * @param str
 */
function select_item(str) {
    var _self = airMonitoringVM;
    _self.isDesablePClound = false; //开启  污染云图的可用状态
    switch (str) {
        case 'wz':
            _self.wz_all = true;
            _self.kh_all = false;
            _self.yc_all = false;
            _self.pc_all = false;

            _self.selectStationTpye.valueType = 'wz';
            _self.selectStationTpye.stechType = '-1';
            _self.selectStationTpye.pnametemp = '微站';
            _self.selectStationTpye.nametemp = '';
            _self.rPanelSType = 'wz';
            break;

        case 'kh':
            _self.wz_all = false;
            _self.kh_all = true;
            _self.yc_all = false;
            _self.pc_all = false;
            _self.selectStationTpye.valueType = 'kh';
            _self.selectStationTpye.stechType = '98';
            _self.selectStationTpye.pnametemp = '考核站';
            _self.selectStationTpye.nametemp = '';
            _self.rPanelSType = 'kh';
            break;
        case 'yc':
            if (_self.queryStationParams.pollutionType == 'pm10') {
                _self.wz_all = false;
                _self.kh_all = false;
                _self.yc_all = true;
                _self.pc_all = false;
                _self.selectStationTpye.valueType = 'yc';
                _self.selectStationTpye.stechType = '101';
                _self.selectStationTpye.pnametemp = '扬尘站';
                _self.selectStationTpye.nametemp = '';
                _self.isDesablePClound = true; //关闭
            }
            break;
        case 'pc':
            _self.wz_all = false;
            _self.kh_all = false;
            _self.yc_all = false;
            _self.pc_all = true;
            _self.selectStationTpye.valueType = 'pc';
            _self.selectStationTpye.stechType = '99';
            _self.selectStationTpye.pnametemp = '爬虫站';
            _self.selectStationTpye.nametemp = '';
            _self.isDesablePClound = true; //关闭

            break;

    }
    _self.selectStationTpye.stationType = "-1";

    _self.clk_wz_all();
    _self.clk_kh_all();
    _self.clk_yc_all();
    _self.clk_pc_all();
}


/**
 * 选中某一类下 一小类站点
 * @param item
 * @param str
 * @param event
 */
function select_single_item(item, str, event) {
    var _self = airMonitoringVM;
    _self.isDesablePClound = false; //开启  污染云图的可用状态
    _self.selectStationTpye.valueType = str;
    _self.selectStationTpye.stationType = item.id;
    switch (str) {
        case 'wz':
            _self.selectStationTpye.stechType = '-1';
            _self.selectStationTpye.pnametemp = '微站';
            _self.rPanelSType = 'wz';
            break;
        case 'kh':
            _self.selectStationTpye.pnametemp = '考核站';
            _self.selectStationTpye.stechType = '98';
            _self.rPanelSType = 'kh';
            break;
        case 'yc':
            _self.selectStationTpye.pnametemp = '扬尘站';
            _self.selectStationTpye.stechType = '101';
            _self.isDesablePClound = true; //关闭  污染云图的可用状态
            break;
        case 'pc':
            _self.selectStationTpye.pnametemp = '爬虫';
            _self.selectStationTpye.stechType = '99';
            _self.isDesablePClound = true; //关闭  污染云图的可用状态
            break;

    }

    _self.selectStationTpye.nametemp = item.name;
    //取消其他的选中项,并给当前的点击对象添加活动属性
    $(".list-station *").removeClass("active");
    $(".list-station .dd span").removeClass("bluefont");
    $(".list-station").addClass("addClass");
    $(event.target).parent().parent().addClass("active");
    $(event.target).addClass('bluefont');
}

/**
 * 站点检索
 * @param ev
 */
function checkStationInfo(ev) {
    var _self = airMonitoringVM;
    if (ev.keyCode != 13) { //非回车键的时候执行
        if (_self.stationIdOrName) {
            _self.search_down_list = [];
            var params = {
                doMainId: parent.domainId,
                district: _self.queryStationParams.district,
                queryStationType: _self.queryStationParams.valueType, //站点类型 0 微站   yc 扬尘  kh考核 all  全部
                sTechType: _self.queryStationParams.stechType, //站点种类
                stationType: _self.queryStationParams.stationType, //站点类型
                stationIdOrName: _self.stationIdOrName
            };
            var dataType = 'application/json; charset=UTF-8';
            $.ajax({
                type: "POST",
                url: $.coreApiPath + '/stationNew/search/staions',
                dataType: 'JSON',
                contentType: dataType,
                data: JSON.stringify(params),
                success: function (data) {
                    if (data.data && data.data.length != 0) {
                        data.data.forEach(function (item, index, arr) {
                            if (checkStationObj(_self.search_down_list, item.stationId)) {
                                _self.search_down_list.push({
                                    id: item.stationId,
                                    text: item.stationName
                                });
                            }
                        });
                        _self.isShowDownList = true; //重置是否展示下拉搜索框的状态 （开启）
                    } else {
                        console.log("获取数据失败");
                        _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
                    }
                },
                error: function (err) {
                    console.info(err);
                }
            });
        } else {
            _self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
        }
    }

}