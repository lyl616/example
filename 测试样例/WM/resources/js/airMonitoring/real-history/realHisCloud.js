var totalCount;
function getCloudImg() {
    var cloudImg, _self = airMonitoringVM;
    ajax_get($.backendApiPath + "/config/cloudimg", {}, function (data) {
        if (data.erroCode == 2000) {
            _self.cloudImg = data.result;
        } else {
            _self.cloudImg = "url_error"
        }
        _self.showCloudWindyInfo();
    });
}


function showDownLoadHtml() {
    var _self = airMonitoringVM;
    var start, end;
    if (_self.queryStationParams.dateType == 2) { //小时
        start = _self.timeTypeStartEnd.hour.end;
        end = hourIncre(_self.timeTypeStartEnd.hour.start, -1);
        totalCount = GetHourDiff(end, start);
    } else { //天
        start = _self.timeTypeStartEnd.day.end;
        end = _self.timeTypeStartEnd.day.start;
        totalCount = GetDateDiff(end, start);
    }
    showTime = start;
    var title_type = _self.queryStationParams.valueType.toUpperCase(),
        num = _self.queryStationParams.valueType.replace(/[^0-9]/ig, "") == '25' ? '2.5' : _self.queryStationParams.valueType.replace(/[^0-9]/ig, ""),
        vl = title_type.replace(/\d+/g, '');
    var title = "";
    if (_self.queryStationParams.dateType == 2) {
        $("#zipName").val(new Date(start).Format("yyyy-MM-dd HH") + "时至" + new Date(end).Format("yyyy-MM-dd HH") + "时" + vl + num + "浓度空间分布图");
    } else {
        $("#zipName").val(start + "至" + end + vl + num + "浓度空间分布图");
    }
    title = start + " 至 " + end + " " + vl + "<sub>" + num + "</sub> 浓度空间分布图";
    $("#picsTitle").html(title);
    $("#dvalueModal").modal('show');
    var firstShowCount = 24;
    if (totalCount < firstShowCount) {
        firstShowCount = totalCount;
    }
    _self.appendrealTable(firstShowCount);
    _self.scrollLoadPic(totalCount);
}

function appendTable(showCount) {
    var _self = airMonitoringVM;
    var bodytd_limit = '', body_html = '', interval_type;
    var picFmt = "yyyyMMdd";

    if (_self.queryStationParams.dateType == 2) {
        interval_type = 'hour';
    } else if (_self.queryStationParams.dateType == 3) {
        interval_type = 'day';
    }
    var stationtype = _self.rPanelSType,
        arithmetic = "Neareast_RBF";
    for (var i = 0; i < showCount; i++) {
        var seltime = converTimeFormat(showTime);
        var picTimeTime = seltime.Format(picFmt);
        var imgurl = _self.cloudImg + _self.currentCity + "/" + stationtype + "/" + _self.queryStationParams.pollutionType + "/" + arithmetic + "/" + interval_type + "/" + _self.getPicTimeFmt(seltime) + ".png";

        var imgId = _self.currentCity + "/" + stationtype + "/" + _self.queryStationParams.pollutionType + "/" + arithmetic + "/" + interval_type + "/" + _self.getPicTimeFmt(seltime) + ".png";
        body_html += '<div class = "pic_selt pic_seltfffbor" > ';
        body_html += '<input type = "hidden"  name="pic" id="' + imgId + '" value="-1" / > ';
        if (_self.queryStationParams.dateType == 2) {
            body_html += '<span>' + seltime.Format("yyyy-MM-dd HH时") + '</span> ';
            showTime = hourIncre(showTime, 1);
        } else {
            body_html += '<span>' + showTime + '</span> ';
            showTime = dayIncre(showTime, 1);
        }
        body_html += '<img src = "' + imgurl + '"  onerror="notFind(\'' + imgId + '\');" / > ';
        body_html += '</div>';
    }
    $("#pic_scroll").append(body_html);
    _self.picClk();
}


function scrollPics() {
    var _self = airMonitoringVM;
    $("#pic_scroll").scroll(function (event) {
        var viewH = $(this).height(), //可见高度
            contentH = $(this).get(0).scrollHeight, //内容高度
            scrollTop = $(this).scrollTop(); //滚动高度
        if (scrollTop / (contentH - viewH) >= 1) {
            var cnt = totalCount - 24 - 12 * _self.scrollCont; //判断是否还有图片加载
            if (cnt > 0) {
                if (cnt < 12) {
                    _self.appendrealTable(cnt);
                } else {
                    _self.appendrealTable(12);
                }
                _self.scrollCont++;
            } else {
                if (_self.showMsg) {
                    _self.isshowAllDownloadBtn = true;
                    layer.msg("没有了哦！");
                    _self.showMsg = false;
                }
                return false;
            }
        }
    });
}

function clickCloudPicture() {
    var _self = airMonitoringVM;
    $(".pic_selt").click(function () {
        if ($($(this).children("input").get(0)).val() != "0") {
            if ($(this).hasClass("pic_seltfffbor")) {
                $(this).removeClass("pic_seltfffbor");
                $(this).addClass("pic_selta4dbor");
                $(this).children('input').val("1");
            } else {
                $(this).addClass("pic_seltfffbor");
                $(this).removeClass("pic_selta4dbor");
                $(this).children('input').val("-1");
            }

        } else {
            $(this).addClass("pic_seltfffbor");
            $(this).removeClass("pic_selta4dbor");
            $(this).children('input').val("0");
        }
        _self.showSelectCnt();
    });
}

function seeALLPic() {
    var _self = airMonitoringVM;
    var selAll = $("#selAll").val();
    if (selAll == "全部选中") {
        $(".pic_selt input[name='pic']").each(function () {
            if ($(this).val() != "0") {
                $(this).val("1");
                $(this).parent('.pic_selt').removeClass("pic_seltfffbor").addClass("pic_selta4dbor");
            }
        });
        $("#selAll").val("取消全部选中");
    } else {
        // $(" .pic_selt input[name='pic']").val("-1");
        $(".pic_selt input[name='pic']").each(function () {
            if ($(this).val() != "0") {
                $(this).val("-1");
            }
        });
        $("#selAll").val("全部选中");
        $(".pic_selt").removeClass("pic_selta4dbor").addClass("pic_seltfffbor");
    }
    _self.showSelectCnt();
}


function converTimeFormat(time) {
    if (time != null) {
        time = time.replace("-", "/");
        time = time.replace("-", "/");
        return new Date(time);
    }
    return null;
}