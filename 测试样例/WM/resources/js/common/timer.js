/**
 * 定时器 播放相关公共js
 */

// 定时器
/** *****************************定时器播放************************************************* */

/**
 * 点击播放事件
 */
function timerPlay() {
    timerCheck();
    // 点击播放
    if ($("#btn-play").hasClass("glyphicon-play")) {// 点击后播放
        if (!is_change) {
            is_change = true;
        }
        $("#btn-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
    } else if ($("#btn-play").hasClass("glyphicon-pause")) {// 暂停
        if (is_change) {
            is_change = false;
        }
        $("#btn-play").removeClass("glyphicon-pause").addClass("glyphicon-play");
    }
}

/**
 * 点击播放难播放时间 是不是改变
 */
function timerCheck() {
    var bgPlayTime = $("#startTime").val();
    var endPlayTime = $("#endTime").val();

    if (startTime != bgPlayTime) {
        startTime = bgPlayTime;
        currentTime = startTime;
        if (interval == 1) {
            currentTime = currentTime.substring(0, 13);
        }
        start_index = 0;
        show_tipbar();
    }
    if (endTime != endPlayTime) {
        endTime = endPlayTime;
    }
    resetTimerParams();
}

/**
 * 重置Timer参数
 */
function resetTimerParams() {
    interval = $("#interval").val();
    startTime = $("#startTime").val();
    endTime = $("#endTime").val();
    if (currentTime == "") {
        currentTime = startTime;// 默认第一帧数据为开始时间
        if (interval == 1) {
            currentTime = currentTime.substring(0, 13);
        }
    }
    if (endTime != "" && endTime.length > 0 && startTime != "" && startTime.length > 0) {
        if (endTime <= startTime) {
            if (endTime == startTime) {
                layer.msg("开始结束时间不能一致，请重新选择");
            } else {
                layer.msg("开始时间不能大于结束时间，请重新选择");
            }
            is_change = false;
            $("#btn-play").removeClass("glyphicon-pause").addClass("glyphicon-play");

            setTimeout("clear_tipbar()", 500)
            return false;
        }
        if (interval == 1) {
            var end = endTime.substring(0, 13) + ":00:00";
            var start = startTime.substring(0, 13) + ":00:00";
            totalCount = GetHourDiff(end, start);
        } else if (interval == 2) {
            totalCount = GetDateDiff(endTime, startTime);
        } else if (interval == 3) {
            totalCount = getMonthsDiff(endTime, startTime);
        } else if (interval == 4) {
            totalCount = getYearDiff(endTime, startTime);
        }
        if (totalCount <= 0) {
            is_change = false;
            return;
        }

    } else {
        is_change = false;
        $("#btn-play").removeClass("glyphicon-pause").addClass("glyphicon-play");
        return;
    }
}


// 下一帧
function go_next() {
    start_index++;

    if (start_index > totalCount) {
        start_index = 0;
        start_index++;
        currentTime = startTime;
        if (interval == 1) {
            currentTime = currentTime.substring(0, 13) + ":00:00";
        }
    }
    if (interval == 1) {
        currentTime = hourIncre(startTime.substring(0, 13) + ":00:00", start_index - 1);
        currentTime = currentTime.substring(0, 13);
    } else if (interval == 2) {
        currentTime = dayIncre(startTime, start_index - 1);
    } else if (interval == 3) {
        currentTime = monthIncre(startTime, start_index - 1);
    } else if (interval == 4) {
        currentTime = yearIncre(startTime, start_index - 1);
    }

}

// 上一帧
function go_pre() {
    start_index--;
    if (start_index <= 0) {
        start_index = totalCount;
        currentTime = endTime;
        if (interval == 1) {
            currentTime = currentTime.substring(0, 13);
        }
    }
    if (interval == 1) {
        currentTime = hourIncre(startTime.substring(0, 13) + ":00:00", start_index - 1);
        currentTime = currentTime.substring(0, 13);
    } else if (interval == 2) {
        currentTime = dayIncre(startTime, start_index - 1);
    } else if (interval == 3) {
        currentTime = monthIncre(startTime, start_index - 1);
    } else if (interval == 4) {
        currentTime = yearIncre(startTime, start_index - 1);
    }

}

/**
 * 显示进度条
 *
 * @param start_index
 *            当前循环下标
 * @param totalCount
 *            总数
 * @param currentTime
 *            当前播放(查询)的时间
 */
function show_tipbar() {
    var newValue = (start_index / totalCount) * 100; // 读取进度条现有值并计算出新值

    resetProg(newValue);

    var nowDate = currentTime;
    if (interval == 1) {
        nowDate = nowDate.substring(0, 13) + ":00";
    }
    $("#nowDate").html(nowDate);
}

function resetProg(now) {
    var val = now;
    if (now == 0) {
        //$('.fixedTimebar .progress-label').css("left", (val.toFixed(2) - 6) + "%");
    } else {
        if (checkRate(now) && now != 0) {
            if (now > 98) {
                val = 98;
            }
            if (now < 6) {
                val = 6;
            }
            $(".progress-label").text(now.toFixed(2) + "%");
            //$('.fixedTimebar .progress-label').css("left", (val.toFixed(2) - 6) + "%");
            $("#progressbar").progressbar("option", "value", now); // 设置进度条新值

        }
    }
}


function checkRate(val) {
    var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
    if (!re.test(val + "")) {
        return false;
    }
    return true;
}

/**
 * 进度条复位
 */
function clear_tipbar() {
    var nowDate = $("#startTime").val();
    if (interval == 1) {
        nowDate = nowDate.substring(0, 13) + ":00";
    }
    $("#nowDate").html(nowDate);
    $(".progress-label").text("0%");
    $('.fixedTimebar .progress-label').css("left", "0");
    $("#progressbar").progressbar("option", "value", 0);
    _clear_map_markers();
}
