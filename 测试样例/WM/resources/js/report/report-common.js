var myDate = new DateHelp({
    date: new Date(), //从此日期开始计算
    format: 'yyyy年MM月dd日'
});

var type = "day";
var selected_type = "day";

/**
 * 上传表单时间切换
 * @param index
 * @param upload_startTime
 * @param upload_endTime
 */
function uploadReport(index, upload_startTime, upload_endTime) {
    var time_qj = initUploadReportTime(index);
    if (index == 7) {//周处理
        report.upload_startTime = myDate.formatDate(time_qj.start, myDate.format);
        report.upload_endTime = myDate.formatDate(time_qj.end, myDate.format);
        initWDateWeek(upload_startTime, upload_endTime);
    } else {
        report.upload_startTime = calcTime(upload_startTime, time_qj.start, time_qj.selected_type); //开始时间
        report.upload_endTime = calcTime(upload_endTime, time_qj.end, time_qj.selected_type); //结束时间
    }
}

/**
 * 初始化上传时间
 * @param index
 * @returns {{start: string, end: string}}
 */
function initUploadReportTime(index) {
    var start = '', selected_type = '',
        end = '';
    switch (index) {
        case 6: { //up-day
            start = new Date(myDate.year, myDate.month - 1, myDate.day);
            end = new Date(myDate.year, myDate.month - 1, myDate.day);
            selected_type = 'day';
            myDate.format = 'yyyy年MM月dd日';
        }
            break;
        case 7: { //up-week
            var weekDay = new Date(myDate.year, myDate.month - 1, myDate.day).getDay();
            start = new Date(myDate.year, myDate.month - 1, myDate.day - weekDay - 6);
            end = new Date(myDate.year, myDate.month - 1, myDate.day - weekDay);
            selected_type = 'week';
            $("#upload_endtime_container").show();
            myDate.format = 'yyyy年MM月dd日';
        }
            break;
        case 8: { //up-month
            start = new Date(myDate.year, myDate.month - 2, myDate.day);
            end = new Date(myDate.year, myDate.month - 1, myDate.day);
            selected_type = 'month';
            myDate.format = 'yyyy年MM月';
        }
            break;
        case 9: { //up-qt
            start = new Date(myDate.year, myDate.month - 3, 1);
            end = new Date(myDate.year, myDate.month - 3, 1);
            selected_type = 'qt';
            myDate.format = 'yyyy年MM月';
        }
            break;
        case 10: { //up-year
            start = new Date(myDate.year - 1, 1 - 1, 1);
            end = new Date(myDate.year - 1, 11 - 1, 31);
            selected_type = 'year';
            myDate.format = 'yyyy年';
        }
            break;

    }
    return {
        start: start,
        end: end,
        selected_type: selected_type
    }
}

function initDateTime(index) {
    var start = '',
        end = '';       
    switch (index) {
        case 'day': {
            start = new Date(myDate.year, myDate.month - 1, myDate.day - 8);
            end = new Date(myDate.year, myDate.month - 1, myDate.day);
            myDate.format = 'yyyy年MM月dd日';
        }
            break;
        case 'week': {
            var wd = new Date(myDate.year, myDate.month - 1, myDate.day).getDay();
            start = new Date(myDate.year, myDate.month - 1, myDate.day - wd - 27);
            end = new Date(myDate.year, myDate.month - 1, myDate.day - wd);
            myDate.format = 'yyyy年MM月dd日';
        }
            break;
        case 'month': {
            start = new Date(myDate.year, myDate.month - 2, 1);
            end =  new Date(myDate.year, myDate.month - 1, 1);
            myDate.format = 'yyyy年MM月';
        }
            break;
        case 'qt': {
            start = new Date(myDate.year, myDate.month - 6, 1);
            end = new Date(myDate.year, myDate.month - 3, 1);
            myDate.format = 'yyyy年MM月';
        }
            break;
        case 'year': {
            start = new Date(myDate.year - 1, 1 - 1, 1);
            end = new Date(myDate.year - 1, 11 - 1, 31);
            myDate.format = 'yyyy年';
        }
            break;
    }
    return {
        start: start,
        end: end
    }
}


function clearUpload() {
    report.upload_selected_type = "-1";
    report.upload_report_category = "-1";
    // report.upload_report_province = "-1";
    // report.upload_report_city = "-1";
    report.upload_report_district = "-1";
    report.upload_startTime = "";
    report.upload_endTime = "";
    selected_type = 'day';
}