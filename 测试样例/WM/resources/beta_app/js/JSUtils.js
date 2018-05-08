/**
 * Created by yulongliu on 2016/11/21.
 */

var wm_dictionary = "wm_dictionary";

$(function () {
    $.fn.setForm = setForm;
    $.fn.cleanForm = cleanForm;
});

/**
 * @author LiuYuLong
 * 扩展字符串去除空格方法
 */
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

var projectName = getProjectName();

/**
 * @author LiuYuLong
 * @version 2015-06-12 下午16:32:50
 * @param form
 * 通过返回的json数据 填充表格
 * @param jsonValue
 */
function setForm(jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("input[name='" + name + "']");
        if ($oinput.attr("type") == "radio" ||
            $oinput.attr("type") == "checkbox") {
            $oinput.each(function () {
                if (Object.prototype.toString.apply(ival) == '[object Array]') { // 是复选框，并且是数组
                    for (var i = 0; i < ival.length; i++) {
                        if ($(this).val() == ival[i])
                            $(this).attr("checked", "checked");
                    }
                } else {
                    if ($(this).val() == ival)
                        $(this).attr("checked", "checked");
                }
            });
        } else if ($oinput.attr("type") == "textarea") { // 多行文本框
            obj.find("[name='" + name + "']").html(ival);
        } else {
            obj.find("[name='" + name + "']").val(ival);
        }
    });
}

function setProp(id, alias, jsonValue) {
    var obj = $("#" + id);
    $.each(jsonValue, function (name, ival) {
        var cobj = obj.find("#" + alias + name);
        if (cobj.hasClass(wm_dictionary)) {
            var dname = getDictionaryById(ival, function (dic) {
                cobj.html(dic.name);
            });
        } else {
            cobj.html(ival);
        }
    });
}

/**
 *
 * 序列化表单为对象
 *
 * @author LiuYuLong
 * @version 2015-06-12 下午16:32:50
 * @param form
 *            需要序列化的表单
 * @returns 表单值对象
 */
function serializeObject(form) {
    if (!($.type(form) === "object")) {
        form = $("#" + form);
    }
    var o = {};
    $.each(form.serializeArray(), function (index) {
        if (this['value'] != undefined && this['value'].length > 0) { // 如果表单项的值非空，才进行序列化操作
            if (o[this['name']]) {
                o[this['name']] = o[this['name']] + "," + this['value'];
            } else {
                o[this['name']] = this['value'];
            }
        }
    });
    return o;
}

/**
 *
 * TODO js获取项目名称 /mapt.. Date 2015年6月12日下午2:27:31 Author liuylong
 */
function getProjectName() {
    // 获取主机地址之后的目录，如： uimcardprj/share/meun.html
    var pathName = window.document.location.pathname;
    var projectName = pathName
        .substring(0, pathName.substr(1).indexOf('/') + 1);
    return projectName;
}

//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.html
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.html
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

/**
 *
 * TODO //对Date的扩展，将 Date 转化为指定格式的String //月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用
 * 1-2 个占位符， //年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) //例子： //(new
 * Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 //(new
 * Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18 Date
 * 2015年6月23日下午1:31:48 Author liuylong
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
                (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 解决ie8不支持Date()的问题
 * @author LiuYuLong
 * @param dateString
 * @param format
 * @returns {*}
 */
function dateFormat(dateString, format) {

    if (!dateString) return "";

    var time = new Date(dateString.replace(/-/g, '/').replace(/T|Z/g, ' ').trim());

    var o = {

        "M+": time.getMonth() + 1, //月份

        "d+": time.getDate(), //日

        "h+": time.getHours(), //小时

        "H+": time.getHours(), //小时

        "m+": time.getMinutes(), //分

        "s+": time.getSeconds(), //秒

        "q+": Math.floor((time.getMonth() + 3) / 3), //季度

        "S": time.getMilliseconds() //毫秒

    };

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o)

        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    return format;

}

/**********************************对Ajax方式进行封装Start**************************************************/
/**
 * 以post方式请求 不带加载效果
 * @author LiuYuLong
 * @param url
 *            请求地址
 * @param posData
 *            请求参数
 * @param callBk
 *            回调函数
 */
function ajax(url, posData, callBk) {
    $.ajax({
        type: "POST",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: posData,
        success: function (data) {
            callBk(data);
        },
        error: function (err) {
            console.info(err);
        }
    });
}

/**
 * 以post方式请求
 * @author LiuYuLong
 * @param url
 *            请求地址
 * @param postData
 *            请求参数
 * @param callBK
 *            回调函数
 */
function ajax_post(url, postData, callBK) {
    $.ajax({
        type: "POST",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: postData,
        beforeSend: initLayerLoader, // 发送请求
        complete: closeLayreLoader, // 请求完成
        success: function (data) {
            callBK(data);
        },
        error: function (err) {
            console.info(err);
        }
    });
}

/**
 * @author LiuYuLong
 * ajax post提交
 * @param url 请求地址
 * @param postData  请求参数
 * @param opt 执行操作如  保存、删除、修改等
 * @param callbk 回调函数
 */
function ajax_post_msg(url, postData, opt, callbk) {
    $.ajax({
        type: "POST",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: postData,
        beforeSend: initLayerLoaderMsg(opt), // 发送请求
        complete: closeLayreLoader, // 请求完成
        success: function (data) {
            callbk(data);
        },
        error: function (err) {
            console.info(err);
        }
    });
}

function alphaWindow_10s(msg) { //10秒自动关闭
    // layer.open({
    //     content: 'msg',
    //     time: 10000, //10s后自动关闭
    //     btn: ['确定'],
    //     btnAlign: 'c'
    // });
}

function ajax_post_info(url, postData, opt, callbk, err) {
    $.ajax({
        type: "POST",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: postData,
        beforeSend: initLayerLoaderMsg(opt), // 发送请求
        complete: closeLayreLoader, // 请求完成
        success: function (data) {
            callbk(data);
        },
        error: function (err) {
            alphaWindow_10s(err);
        }
    });
}

/**
 * 以get方式请求
 * @author LiuYuLong
 * @param url
 *            请求地址
 * @param postData
 *            请求参数
 * @param callBk
 *            回调函数
 */
function ajax_get(url, postData, callBk) {
    $.ajax({
        type: "GET",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: postData,
        success: function (data) {
            callBk(data);
        },
        error: function (err) {
            console.info(err);
        }
    });
}

/**
 * @author LiuYuLong
 * @param url 请求地址
 * @param postData  请求参数
 * @param opt 执行操作如  保存、删除、修改等
 * @param callbk 回调函数
 */
function ajax_get_msg(url, postData, opt, callBk) {
    $.ajax({
        type: "GET",
        // timeout : 60000,
        url: url,
        dataType: 'JSON',

        data: postData,
        beforeSend: initLayerLoaderMsg(opt), // 发送请求
        complete: closeLayreLoader, // 请求完成
        success: function (data) {
            callBk(data);
        },
        error: function (err) {
            console.info(err);
        }
    });
}

var load = "undefined";

/**
 * 添加加载效果
 */
function initLayreLoader() {
    load = layer.open({
        content: "加载中...！",
        icon: 16,
        time: 0,
        shade: 0.01
    });
}

/**
 * @author LiuYuLong
 * 添加加载效果
 */
function initLayerLoader() {
    load = layer.open({
        content: "加载中...！",
        icon: 16,
        time: 0,
        shade: 0.01
    });
}

/**

 * 加载完毕
 */
function closeLayreLoader() {
    if (load != "undefined") {
        layer.close(load);
        load = "undefined";
    }
}

/**

 * 执行是动画
 * @param opt 执行操作如  保存、删除、修改等
 */
function initLayerLoaderMsg(opt) {
    load = layer.open({
        content: opt + "中，请稍候！……",
        icon: 16,
        time: 0,
        shade: 0.01
    });
}

/**
 * @author LiuYuLong
 * 加载完毕
 */
function closeLayreLoader() {
    if (load != "undefined") {
        layer.close(load);
        load = "undefined";
    }
}

/**********************************对Ajax方式进行封装End**************************************************/
/**
 *
 * 用以验证form表单 其中 form表单中的标签包含require属性和desc属性 require=true标示此表单不能为空 desc描述标签名称
 *
 * @author LiuYuLong
 * @param formId
 *            表单ID
 *
 * @param type
 *            类型
 * @return {TypeName}
 */
function validForm(formId, type) {
    var flag = true;
    if (formId == null || formId == '') {
        flag = false;
        return flag;
    }
    var inputTags = $("form[id='" + formId + "'] input[require='true']");
    $.each(inputTags, function (i, tag) {
        var f = true;
        if (type) {
            if (type == 1) {
                var r = $(tag).attr("readonly");
                var d = $(tag).attr("disabled");
                if (r || d) {
                    f = false;
                }
            }
        }
        if (f) {
            var t = $(tag).attr("type");
            if (!t)
                t = "text";
            if ("text" == t) {
                if (null == tag.value || tag.value == '' || tag.value == '0' || tag.value.trim().length == 0) {
                    flag = false;
                    alert("请输入" + $(tag).attr("desc") + "!");
                    return flag;
                }
            } else {
                var v = $("input[name=" + $(tag).attr("name") + "]:checked").val();
                if (!v) {
                    flag = false;
                    alert("请选择" + $(tag).attr("desc") + "!");

                    return flag;
                }
            }
        }
    });
    if (!flag)
        return flag;
    var selectTags = $("form[id='" + formId + "'] select[require='true']");
    $.each(selectTags, function (i, tag) {
        var f = true;
        if (type) {
            if (type == 1) {
                var r = $(tag).attr("readonly");
                var d = $(tag).attr("disabled");
                if (r || d) {
                    f = false;
                }
            }
        }
        if (f) {
            var value = "";
            try {
                value = $(tag).combobox('getValue');
            } catch (e) {
                value = tag.value;
            }
            if (value == null || value == '') {
                alert("请选择" + $(tag).attr("desc") + "!");

                flag = false;
                return flag;
            }
        }
    });
    if (!flag)
        return flag;
    var textareaTags = $("form[id='" + formId + "'] textarea[require='true']");
    $.each(textareaTags, function (i, tag) {
        var f = true;
        if (type) {
            if (type == 1) {
                var r = $(tag).attr("readonly");
                var d = $(tag).attr("disabled");
                if (r || d) {
                    f = false;
                }
            }
        }
        if (f) {
            if (tag.value == null || tag.value == '' || tag.value.trim().length == 0) {
                alert("请输入" + $(tag).attr("desc") + "!");
                flag = false;
                return flag;
            }
        }
    });
    return flag;
}

/**
 * * 编码规则:1) ~43~48~45~4e~48~41~4f 2) ^7a0b^7389 字符编码,解决传输出现乱码问题
 *
 * @author liuyulong
 */
function encode(strIn) {
    var intLen = strIn.length;
    var strOut = "";
    var strTemp;

    for (var i = 0; i < intLen; i++) {
        strTemp = strIn.charCodeAt(i);
        if (strTemp > 255) {
            tmp = strTemp.toString(16);
            for (var j = tmp.length; j < 4; j++)
                tmp = "0" + tmp;
            strOut = strOut + "^" + tmp;
        } else {
            if (strTemp < 48 || (strTemp > 57 && strTemp < 65) ||
                (strTemp > 90 && strTemp < 97) || strTemp > 122) {
                tmp = strTemp.toString(16);
                for (var j = tmp.length; j < 2; j++)
                    tmp = "0" + tmp;
                strOut = strOut + "~" + tmp;
            } else {
                strOut = strOut + strIn.charAt(i);
            }
        }
    }
    return (strOut);
}

/**
 * 格式化时间戳 为 yyyy-MM-dd HH:mm:ss格式
 *
 * @param ns
 * @returns {String}
 */
function getLocalTime(ns) {

    var d = new Date(ns);
    var year = d.getFullYear();
    var month = (d.getMonth() + 1) + "";
    if (month.length == 1) {
        month = "0" + month;
    }

    var day = (d.getDate()) + "";
    if (day.length == 1) {
        day = "0" + day;
    }

    var hour = (d.getHours()) + "";
    if (hour.length == 1) {
        hour = "0" + hour;
    }

    var minutes = (d.getMinutes()) + "";
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    var sec = (d.getSeconds()) + "";
    if (sec.length == 1) {
        sec = "0" + sec;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" +
        sec;
}

/**
 * 获取时间中的小时
 *
 * @param dataStr
 * @returns
 */
function getStrDateHour(dataStr) {
    var date = new Date(Date.parse(dataStr.replace(/-/g, "/")));
    return date.getHours();
}

/**
 * 获取时间中的日
 *
 * @param dataStr
 * @returns
 */
function getStrDateDay(dataStr) {
    var date = new Date(Date.parse(dataStr.replace(/-/g, "/")));
    return date.getDate();
}

/**
 * 获取时间中的月
 *
 * @param dataStr
 * @returns
 */
function getStrDateMonth(dataStr) {
    var date = new Date(Date.parse(dataStr.replace(/-/g, "/")));
    return date.getMonth();
}

/**
 * 获取时间中的年
 *
 * @param dataStr
 * @returns
 */
function getStrDateYearh(dataStr) {
    var date = new Date(Date.parse(dataStr.replace(/-/g, "/")));
    return date.getFullYear();
}

/**
 * 计算时间相差月数
 * @author LiuYuLong
 *
 * @param {Object}
 *            date1
 * @param {Object}
 *            date2
 */
function getMonthNumber(date1, date2) {
    // 默认格式为"20030303"
    var date1 = date1.Format("yyyyMM");
    var date2 = date2.Format("yyyyMM");
    var year1 = date1.substr(0, 4);
    var year2 = date2.substr(0, 4);
    var month1 = date1.substr(4, 2);
    var month2 = date2.substr(4, 2);
    var len = (year2 - year1) * 12 + (month2 - month1);
    return Math.abs(len);
}

/**
 * 获取两个时间相差的天数
 */
function GetDateDiff(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/")))
        .getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return dates + 1;
}

/**
 * 计算两个日期相隔的小时数
 *
 * @param startDate
 * @param endDate
 * @returns
 */
function GetHourDiff(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/")));
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/")));
    var date3 = startTime.getTime() - endTime.getTime();
    // 计算出小时数
    var hours = Math.floor(date3 / (3600 * 1000));
    return hours + 1;
}

function getMonthsDiff(date2, date1) {
    // 用-分成数组
    date1 = date1.split("-");
    date2 = date2.split("-");
    // 获取年,月数
    var year1 = parseInt(date1[0]);
    var month1 = parseInt(date1[1]);
    var year2 = parseInt(date2[0]);
    var month2 = parseInt(date2[1]);
    // 通过年,月差计算月份差
    var months = (year2 - year1) * 12 + (month2 - month1);
    return months;
}

function getYearDiff(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/")));
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/")));

    // 用-分成数组
    return startTime.getFullYear() - endTime.getFullYear();
}

/**
 * 获取当前日期 格式 yyyy-MM-dd HH：00:00
 *@author LiuYuLong
 * @param myDate
 * @returns {String}
 */
function getCurDateDay(myDate) {
    var y = myDate.getFullYear();
    var m = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate
        .getMonth() + 1;
    var d = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
    var h = myDate.getHours();
    var cur_date = y + '-' + m + '-' + d + ' ' + h + ':00:00';
    return cur_date;
}

/**
 * 获取当前日期
 *
 * @param myDate
 *            当前日期
 * @param reg
 *            指定格式
 * @returns
 */
function getCurDateDayByRge(myDate, reg) {
    return new Date(myDate).Format(reg);
}

/**
 * 获取当前时间 几天的
 *
 * @param myDate
 *            当前时间
 * @param m
 *            前几天
 */
function getCurDateDayDecre(myDate, m) {
    var preDate = new Date(myDate.getTime() - 24 * 60 * 60 * 1000 * m);
    y = preDate.getFullYear();
    m = preDate.getMonth() + 1 < 10 ? '0' + (preDate.getMonth() + 1) : preDate
        .getMonth() + 1;
    d = preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate();
    h = preDate.getHours();
    cur_date = y + '-' + m + '-' + d + ' ' + h + ':00:00';
    return cur_date;
}

/**
 * 在时间 myDate上退m天
 *
 * @param myDate
 * @param m
 *            间隔天数
 * @param reg
 * @returns
 */
function getCurDateDayDecreByReg(myDate, m, reg) {
    var preDate = new Date(myDate.getTime() - 24 * 60 * 60 * 1000 * m);
    y = preDate.getFullYear();
    m = preDate.getMonth() + 1 < 10 ? '0' + (preDate.getMonth() + 1) : preDate
        .getMonth() + 1;
    d = preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate();
    h = preDate.getHours();
    cur_date = y + '-' + m + '-' + d + ' ' + h + ':00:00';
    return new Date(cur_date).Format(reg);

}

/**
 * 在已知时间s上另加h 小时
 *
 * @param date
 * @param h
 *            间隔小时
 * @returns {String}
 */
function hourIncre(s, h) {
    var date = new Date(Date.parse(s.replace(/-/g, "/")));
    //	var date = new Date(s);
    date = date.setHours(date.getHours() + h);
    return new Date(date).Format("yyyy-MM-dd HH:mm:ss");
    //	return date.Format("yyyy-MM-dd HH:mm:ss");
}

function hourIncreWithReg(s, h, reg) {
    var date = new Date(Date.parse(s.replace(/-/g, "/")));
    //	var date = new Date(s);
    date = date.setHours(date.getHours() + h);
    return new Date(date).Format(reg);
}

/**
 * 在已知时间s上往前推 h 小时
 *
 * @param s
 * @param h
 * @returns {String}
 */
function hourDecre(s, h) {
    date = datasplit(s);
    //var date = new Date(s);
    date = date.setHours(date.getHours() - h);
    return new Date(date).Format("yyyy-MM-dd HH");
}

function datasplit(s) {
    var arr = s.split(/[- : \/]/),
        date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return date;
}


/**
 * 在已知s时间 上加 上m天
 *
 * @param s
 *            当时时间
 * @param m
 *            间隔天
 * @returns {String}
 */
function dayIncre(s, m) {
    var date = new Date(s);
    date = date.setDate(date.getDate() + m);
    return new Date(date).Format("yyyy-MM-dd");
}

/**
 * 在指定日期s 往前退m天
 *
 * @param s
 * @param m
 * @returns
 */
function dayDecre(s, m) {
    var date = new Date(s);
    date = date.setDate(date.getDate() - m);
    return new Date(date).Format("yyyy-MM-dd");
}

function dayDecreWithReg(s, m, reg) {
    var date = new Date(s);
    date = date.setDate(date.getDate() - m);
    return new Date(date).Format(reg);
}

/**
 * 已经月份s上加h月
 *
 * @param s
 * @param h
 * @returns {String}
 */

function monthIncre(s, m) {
    var d = new Date(s).Format("yyyy-MM-dd");
    var ds = d.split('-'), _d = ds[2] - 0;
    var nextM = new Date(ds[0], ds[1] - 1 + m + 1, 0);
    var max = nextM.getDate();
    d = new Date(ds[0], ds[1] - 1 + m, _d > max ? max : _d);
    return d.toLocaleDateString().match(/\d+/g).join('-')
    // var date = new Date(s);
    // date = date.setMonth(date.getMonth() + h);
    // return new Date(date).Format("yyyy-MM");
}

/**
 * 已经月份s上减h月
 *
 * @param s
 * @param h
 * @returns {String}
 */
function monthDecre(s, m) {

    var d = new Date(s).Format("yyyy-MM-dd");
    var ds = d.split('-'), _d = ds[2] - 0;
    var nextM = new Date(ds[0], ds[1] - 1 - m + 1, 0);
    var max = nextM.getDate();
    d = new Date(ds[0], ds[1] - 1 - m, _d > max ? max : _d);
    return d.toLocaleDateString().match(/\d+/g).join('-')
    // var date = new Date(s);
    // date = date.setMonth(date.getMonth() - h);
    // return new Date(date).Format("yyyy-MM");
}

/**
 * 已经年份s 往前退 h年
 *@author LiuYuLong
 * @param s
 * @param h
 * @returns {String}
 */
function yearIncre(s, h) {
    var date = new Date(s);
    date = date.setFullYear(date.getFullYear() + h);
    return new Date(date).Format("yyyy");
}

/**
 * 已知年份s 减 h年
 *
 * @param s
 * @param h
 * @returns
 */
function yearDecre(s, h) {
    var date = new Date(s);
    date = date.setFullYear(date.getFullYear() - h);
    return new Date(date).Format("yyyy");
}

/**
 * form表单加载数据
 *
 * @param {Object}
 *            form
 * @param {Object}
 *            obj
 * @param {Object}
 *            otherObj
 * @author liuyulong
 * @date 2015-09-25 11:04:12
 */
function loadFormData(form, obj, otherObj) {
    var f = null;
    if ((typeof form) === "object") {
        f = form;
    }
    if ((typeof form) === "string") {
        f = document.getElementById(form);
    }
    obj = obj || {};
    for (var n in obj) {
        if (f[n]) {
            f[n].value = obj[n];
        }
    }
    otherObj = otherObj || {};
    for (var other in otherObj) {
        if (obj[otherObj[other]] && f[other] &&
            (typeof otherObj[other]) == "string") {
            f[other].value = obj[otherObj[other]];
        }
    }
}

/**
 * 为指定元素赋值
 *
 * @param id
 * @param val
 */
function toIdVal(id, val) {
    $("#" + id).val(val);
}

function searPageFormSubmit() {
    $("#pageNum").val("1");
    $("#pageForm").submit();
}

/**
 * 清空form的input
 *
 * @param id
 */
function cleanForm(id) {
    $(':input', "#" + id).not(':button, :submit, :reset, :hidden').val('')
        .removeAttr('checked').removeAttr('selected');
}

function isNull(value) {
    return null == value || '' == value || undefined == value ||
    'null' == value ? true : false;
}

/**
 * 初始化数据字典里的下拉值
 *
 * @param id
 *            初始化的 DOM id
 * @param type
 *            数年字典类型
 * @param selVal
 *            默认选中的值
 * @param all
 *            是否显示全部选项 value -1 text 全部
 */
function initTypsByType(id, type, selVal, all) {
    var opt = $("#" + id);
    opt.empty();
    if (type == "-1") {
        return false;
    }

    if (all != -1) {
        opt.append("<option value=\"-1\">全部</option>");
    }
    var url = $.coreApiPath + "/dictionary/dictionaryType";
    var param = {
        "type": type
    };
    $.getJSON(url, param).success(
        function (data) {
            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    opt.append("<option value=\"" + data[i].id + "\">" +
                        data[i].name + "</option>");
                }
                if (selVal != -1) {
                    selectValue(id, selVal);
                }
            }
        });
}

/**
 * 初始化数据字典里的下拉值
 *
 * @param id
 *            初始化的 DOM id
 * @param type
 *            数年字典类型
 * @param selVal
 *            默认选中的值
 * @param all
 *            是否显示全部选项 value -1 text 全部
 */
function initTypsByPid(id, type, selVal, all) {
    var opt = $("#" + id);
    opt.empty();
    if (type == "-1") {
        return false;
    }
    if (all != -1) {
        opt.append("<option value=\"-1\">全部</option>");
    }
    var url = coreApiPath + "/dictionary/dictionaryPid";
    var param = {
        "pid": type
    };
    $.getJSON(url, param).success(
        function (data) {
            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    opt.append("<option value=\"" + data[i].id + "\">" +
                        data[i].name + "</option>");
                }
                if (selVal != -1) {
                    selectValue(id, selVal);
                }
            }
        });
}

/**
 * 下拉菜单默认选中某个值
 *
 * @param id
 *            下拉标签的ID
 * @param selVal
 *            默认选中的值
 */
function selectValue(id, selVal) {
    $("#" + id).find("option[value='" + selVal + "']").attr("selected", true);
}

/**
 * 保存页面级存储信息
 *
 * @param cityName
 * @param cityId
 * @param provinceName
 * @param provinceId
 */
function saveCitySessionStorage(cityName, cityId, provinceName, provinceId) {
    if (cityName != null)
        sessionStorage.setItem("currentCityName", cityName);
    if (cityId != null)
        sessionStorage.setItem("currentCityId", cityId);
    if (provinceName != null)
        sessionStorage.setItem("currentProvinceName", provinceName);
    if (provinceId != null)
        sessionStorage.setItem("currentProvinceId", cityId);
}

/**
 * 清除页面级存储信息
 *
 * @param cityName
 * @param cityId
 * @param provinceName
 * @param provinceId
 */
function clearCitySessionStorage() {
    sessionStorage.removeItem("currentCityName");
    sessionStorage.removeItem("currentCityId");
    sessionStorage.removeItem("currentProvinceName");
    sessionStorage.removeItem("currentProvinceId");
}

/**
 *
 */
function hideDomById(id) {
    $("#" + id).hide();
}

/**
 * 获取指定日期的天数
 *@author LiuYuLong
 * @param s
 * @returns
 */
function getDayOfMonth(year, month) {
    // var d = new Date(s);
    // var year = d.getFullYear();
    // var m = d.getMonth() + 1;
    var d1 = new Date(year, month, 0);
    return d1.getDate();
}

/**
 * 清空 echars 表格数据
 *@author LiuYuLong
 * @param domId
 */
function clearChar(domId) {
    var myChar = echarts.init(document.getElementById(domId));
    myChar.clear();
}

/**
 * 图表释放------------------- // doubleLineChar.dispose();
 *
 * @param domId
 */
function disposeChar(domId) {
    var myChar = echarts.init(document.getElementById(domId));
    myChar.dispose();
}

/**
 * 初始化 开始结束时间
 * @author LiuYuLong
 *
 * @param day
 *            从当前天数往前推的天数
 */
function initStartEndDate(day) {
    var date = new Date();
    $("#endTime").val(getCurDateDay(date));
    $("#startTime").val(getCurDateDayDecre(date, day));
}

function initStartEndDateWithReg(myDate, day, reg) {
    endTime = getCurDateDayByRge(myDate, reg);
    startTime = dayDecreWithReg(myDate, day, reg);
    $("#startTime").val(startTime);
    $("#endTime").val(endTime);
}

/**
 * 按年份初始化开始结束date时间
 * @author LiuYuLong
 *
 * @param date
 *            开始时间 div
 * @param startDomId
 *            开始时间 div
 * @param endDomId
 *            结束时间 div
 * @param year
 *            间隔年份 正值
 */
function initStartEndTimeByYear(date, startDomId, endDomId, year) {
    var endTime = getCurDateDayByRge(date, "yyyy");
    var startTime = yearDecre(date, year);
    $("#" + startDomId).val(startTime);
    $("#" + endDomId).val(endTime);
}

/**
 * 按月分份初始化开始结束date时间
 *
 * @param date
 *            开始时间 div
 * @param startDomId
 *            开始时间 div
 * @param endDomId
 *            结束时间 div
 * @param month
 *            间隔月份
 */
function initStartEndTimeByMonth(date, startDomId, endDomId, month) {
    var reg = "yyyy-MM";
    var endTime = new Date(date).Format(reg);
    var startTime = monthDecre(date, month);
    $("#" + startDomId).val(startTime);
    $("#" + endDomId).val(endTime);
}

/**
 * 按月分份初始化开始结束date时间
 * @author LiuYuLong
 *
 * @param返回格式
 * @param date
 *            开始时间 div
 * @param startDomId
 *            开始时间 div
 * @param endDomId
 *            结束时间 div
 * @param day
 *            间隔天数
 */
function initStartEndTimeByDay(date, startDomId, endDomId, day, reg) {
    // var endTime = new Date(date).Format(reg);
    // var startTime = dayDecreWithReg(date, day, reg);
    endTime = dayDecreWithReg(date, 1, reg);
    startTime = dayDecreWithReg(date, day + 1, reg);
    $("#" + startDomId).val(startTime);
    $("#" + endDomId).val(endTime);
}

/**
 * 按月分份初始化开始结束date时间
 *
 * @param date
 *            开始时间 div
 * @param startDomId
 *            开始时间 div
 * @param endDomId
 *            结束时间 div
 * @param hour
 *            间隔年份 正值
 */
function initStartEndTimeByHour(date, startDomId, endDomId, hour) {
    var reg = "yyyy-MM-dd HH";
    var endTime = new Date(date).Format(reg);
    var startTime = hourDecre(date, hour);
    $("#" + startDomId).val(startTime);
    $("#" + endDomId).val(endTime);
}

/**
 * 初始化 my97Date样式
 *@author LiuYuLong
 * @param startDomId
 * @param endDomId
 */
function initWateStyle(startDomId, endDomId) {
    $('#' + startDomId).unbind('focus', WdatePicker);
    $('#' + endDomId).unbind('focus', WdatePicker);
    $('#' + startDomId).bind('focus', function () {

        WdatePicker({

            dateFmt: $("#97DateTimeFmt").val(),
            maxDate: '#F{$dp.$D(\'' + endDomId + '\')}',
            autoPickDate: true
        });
    });
    $('#' + endDomId).bind('focus', function () {
        WdatePicker({
            dateFmt: $("#97DateTimeFmt").val(),
            minDate: '#F{$dp.$D(\'' + startDomId + '\')}',
            autoPickDate: true
        });
    });

}

function initDoubleWateStyle(startDomId, endDomId, fmt) {
    $('#' + startDomId).unbind('focus', WdatePicker);
    $('#' + endDomId).unbind('focus', WdatePicker);

    $('#' + startDomId).bind('focus', function () {

        WdatePicker({
            dateFmt: fmt,
            maxDate: '#F{$dp.$D(\'' + endDomId + '\')}',
            autoPickDate: true
        });
    });
    $('#' + endDomId).bind('focus', function () {
        WdatePicker({
            dateFmt: fmt,
            minDate: '#F{$dp.$D(\'' + startDomId + '\')}',
            autoPickDate: true
        });
    });
}

/**
 * 初始化Ztree
 * @param treeId
 * @param treeSetting
 * @param data
 */
function initMyZTree(treeId, treeSetting, data) {
    return $.fn.zTree.init($("#" + treeId), treeSetting, data);
}

function clearZTreeCheck(treeId) {

    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.checkAllNodes(false);
    // treeObj.cancelSelectedNode();
}

/**
 * 默认选中 ztree 指定节点》》》》去除级联勾选>>勾选完成后恢复
 * @author YuLong
 * @param treeObj  ztree对象
 * @param ids   选中的ids
 */
function chkYlZTreeByIds(treeObj, ids) {
    treeObj.setting.check.chkboxType = {
        "Y": "",
        "N": ""
    };
    var nodes = treeObj.transformToArray(treeObj.getNodes());
    $.each(nodes, function (i, item) {
        $.each(ids, function (j, value) {
            if (nodes[i].id == ids[j]) {
                treeObj.checkNode(nodes[i], true, true);
            }
        });
    });
    treeObj.setting.check.chkboxType = {
        "Y": "s",
        "N": "s"
    };
}

/**
 *
 * 获取所有选中的names 和ids
 * @param treeId
 * @param treeNode
 * @returns {{names: Array, ids: Array}}
 */
function getYlTreeCheckItems(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId),
        nodes = zTree.getCheckedNodes(true),
        names = [], ids = [];
    if (nodes.length > 0) {
        for (var i = 0, l = nodes.length; i < l; i++) {
            names.push(nodes[i].name);
            ids.push(nodes[i].id);
        }
    }
    return {names: names, ids: ids};
}


/**
 * 默认选中 ztree 指定节点》》》》默认级联勾选
 * @author YuLong
 * @param treeObj  ztree对象
 * @param ids   选中的ids
 */
function chkYlZTreeByIdsAll(treeObj, ids) {
    var nodes = treeObj.transformToArray(treeObj.getNodes());
    $.each(nodes, function (i, item) {
        $.each(ids, function (j, value) {
            if (nodes[i].id == ids[j]) {
                treeObj.checkNode(nodes[i], true, true);
            }
        });
        if (item.attr != undefined && item.attr[0] == "N") {
            treeObj.setChkDisabled(item, true);
        }
    });
}

/**
 * 扩展 remove方法
 * @param valcom-map.js
 */
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

/**
 * 供销毁 zTree 的方法。
 * @author LiuYuLong
 * @param treeId
 */
function destroyMyZTree(treeId) {
    $.fn.zTree.destroy(treeId);
}

/**
 * 隐藏父对象的input框
 * @author yulongliu
 * @param treeId
 */
function hideParentInput(treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var nodes = zTree.transformToArray(zTree.getNodes());
    for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        for (var j = 0; j < nodes.length; j++) {
            if (id == nodes[j].pId) {
                var node = zTree.getNodeByParam("id", id, null);
                node.nocheck = true;
                zTree.updateNode(node);
            }
        }
    }
}

/**
 * 对数组 进行扩展 hasVal方法
 *
 * @author liuyulong
 * @param val
 * @returns {boolean}
 */
Array.prototype.hasVal = function (val) {
    var flag = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * 通过id 获取下面所有 选中的checkbox
 *    @author LiuYuLong
 * @param id
 * @returns {Array}
 */
function getSelCheckbox(id) {
    var ids = [];
    $("#" + id + " input[type='checkbox']:checked").each(function () {
        ids.push($(this).val());
    });
    return ids;
}

/**
 * 移除指定元素的 某类属性
 *  $("#userAddSBtn").removeAttr("disabled");
 * @param domId
 * @param attr
 */
function removeAttrByDomId(domId, attr) {
    $("#" + domId).removeAttr(attr);
}

/**
 *禁用某个dom
 * @author LiuYuLong
 */
function disabledByDomId(domId) {

    $("#" + domId).attr("disabled", "disabled");
}

/**
 * 获取所有选中的ids
 * @author LiuYuLong
 * @param nodes 所有选中的nodes节点
 * @returns {string}
 */
function getCheckNodeIds(nodes) {
    var nodeId = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].id != "-1") {
            nodeId += nodes[i].id + ",";
        }
    }
    if (nodeId.length > 0)
        nodeId = nodeId.substring(0, nodeId.length - 1);
    return nodeId;
}

function closeModal(id) {
    $('#' + id).modal('hide');
}

function closeModalCallBack(id, callBack) {
    $('#' + id).modal('hide');
    if (callBack) {
        callBack();
    }
}

function openModal(id) {
    $('#' + id).modal('show');
}

function ModalShow(id) {
    $("#" + id).modal("show");
}

/*日期初始化 工具*/
function initWDatetime(id, fm, data) {
    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: fm,
            autoPickDate: data,
            onpicked: function () {
                $dp.$(id).value = $dp.cal.getDateStr(fm)
                $dp.$(id).blur();
            }
        });
    });
}

//转换为时间戳
function timeToConvert(stringTime) {
    var timestamp = new Date(stringTime).getTime();
    //console.log("转换时间后            " + timestamp);
    return timestamp;
}

function initWDateDay(id) {
    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年MM月dd日',
            autoPickDate: true,
            isShowClear: false,
            isShowToday: false,
            maxDate: '%y-%M-%d'
        });
    });
}

/**
 * 初始化月历样式
 * @param id
 */
function initWDateWeek(id) {

    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');

    if (id.indexOf("start") != -1) {
        $('#' + id).bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy年MM月dd日',
                isShowClear: false,
                isShowToday: false,
                specialDays: [0],
                opposite: true,
                firstDayOfWeek: 1,
                disabledDays: ['2$', '3$', '4$', '5$', '6$', '1$']
            })
        });
    } else if (id.indexOf("end") != -1) {
        $('#' + id).bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy年MM月dd日',
                isShowClear: false,
                isShowToday: false,
                specialDays: [0],
                opposite: true,
                firstDayOfWeek: 1,
                disabledDays: ['2$', '3$', '4$', '5$', '0$', '1$']
            })
        });
    } else {
        $('#' + id).bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy年MM月dd日',
                isShowClear: false,
                isShowToday: false,
                specialDays: [0],
                opposite: true,
                firstDayOfWeek: 1,
                disabledDays: ['2$', '3$', '4$', '5$', '6$', '1$']
            })
        });
    }

}

/**
 * 初始化两个 日期格式
 * @param start
 * @param end
 */
function initWDateWeek(start, end) {
    $('#' + start).unbind('focus');
    $('#' + end).unbind('focus');
    $('#' + start).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年MM月dd日',
            isShowClear: false,
            specialDays: [0],
            opposite: true,
            isShowToday: false,
            firstDayOfWeek: 1,
            onpicked: function () {
                var datetime = $dp.cal.getDateStr();
                //获取星期几，控件提供的方法
                var d_start = -$dp.cal.getP('w', 'w');
                var d_end = d_start + 7;
                //计算一周的开始日期和结束日期，这个方法文档说返回的是字符串，但是实际中返回的是控件定义的时间对象，所以后面得自己转换成字符串

                var date_end = $dp.$DV(datetime, {
                    d: d_end
                });

                $("#" + end).val(dateToString(date_end));
            },
            // maxDate: '#F{$dp.$D(\'' + end + '\',{d:-6});}',
            maxDate: '%y-%M-%d',
            disabledDays: ['2$', '3$', '4$', '5$', '6$', '1$']
        })
    });

    $('#' + end).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年MM月dd日',
            isShowClear: false,
            isShowToday: false,
            specialDays: [0],
            opposite: true,
            firstDayOfWeek: 1,
            minDate: '#F{$dp.$D(\'' + start + '\',{d:6});}',
            maxDate: '#F{$dp.$D(\'' + start + '\',{d:6});}',
            disabledDays: ['2$', '3$', '4$', '5$', '0$', '1$']
        })
    });

}

function funccc(id) {
    $dp.$('' + id).value = $dp.cal.getP('y') + $dp.cal.getP('W', 'WW');
}

/**
 * 初始化月 时间 格式
 * @param id
 */
function initWDateMonth(id) {
    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年MM月',
            autoPickDate: true,
            isShowClear: false,
            isShowToday: false,
            maxDate: '%y-%M-%d'
        });
    });
}

function initWDate_for_dd(id) {
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd',
            maxDate: '%y-%M-%d',
            autoPickDate: true
        });
    });
}

function initWDate_for_hh(id) {
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:00',
            maxDate: '%y-%M-%d %H:%m',
            autoPickDate: true
        });
    });
}

/**
 * 初始化季度 时间 格式
 * @param id
 */
function initWDateQuarterly(id) {
    var d = new Date();
    var str = (d.getFullYear() - 1) + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年M季度',
            isQuarter: true,
            isShowOK: false,
            isShowClear: false,
            isShowToday: false,
            disabledDates: ['....-0[5-9]-..', '....-1[0-2]-..'],
            startDate: '%y-01-01'
        });
    });
}

function initWDateYear(id) {
    // $('#' + id).unbind('focus', WdatePicker);
    $('#' + id).unbind('focus');
    $('#' + id).bind('focus', function () {
        WdatePicker({
            dateFmt: 'yyyy年',
            autoPickDate: true,
            isShowClear: false,
            isShowToday: false,
            maxDate: '%y-%M-%d'
        });
    });
}

function ResetcalcTime(domId, time, opt) {
    var result = "";
    if (opt != 'qt') {
        result = myDate.formatDate(time, myDate.format);
    } else {
        initWDateQuarterly(domId);
        result = time.getFullYear() + "年" + getQuarterByMonth(time.getMonth()) + "季度";
    }
    return result;
}

function calcTime(domId, time, opt) {

    var result = "";
    if (opt != 'qt') {
        if (opt == 'day') {
            initWDateDay(domId);
        } else if (opt == 'month') {
            initWDateMonth(domId);
        } else if (opt == 'week') {
            initWDateWeek(domId);
        } else if (opt == 'year') {
            initWDateYear(domId);
        }
        result = myDate.formatDate(time, myDate.format);
    } else {
        initWDateQuarterly(domId);
        result = time.getFullYear() + "年" + getQuarterByMonth(time.getMonth()) + "季度";
    }
    return result;
}

//获得本季度的开始月份
function getQuarterByMonth(month) {
    var quarter = 1;
    if (1 <= month && month <= 3) {
        quarter = 1;
    } else if (4 <= month && month <= 6) {
        quarter = 2;
    } else if (7 <= month && month <= 9) {
        quarter = 3;
    } else if (10 <= month && month <= 12) {
        quarter = 4;
    }
    return quarter;
}

/**
 控件返回的时间对象转换成字符串输出
 控件的时间对象有y,M,d,H,m,s属性，分别返回年，月，日，时，分，秒
 */
function dateToString(date) {
    var strdate = "";
    strdate = strdate + date.y + "年";
    var M = date.M >= 10 ? date.M : ("0" + date.M);
    strdate = strdate + M;
    var d = date.d >= 10 ? date.d : ("0" + date.d);
    strdate = strdate + "月" + d + "日";
    return strdate;
}

//计算两个时间的差值,并判断不能超过一定的界限

function calcDate_interval(start, end, type) {
    var Nstart = start,
        Nend = end;
    var dateStart = new Date(Nstart),
        dateEnd = new Date(Nend);
    var start_year = dateStart.getFullYear(),
        start_month = dateStart.getMonth() + 1,
        start_day = dateStart.getDate(),
        start_hour = dateStart.getHours(),
        end_year = dateEnd.getFullYear(),
        end_month = dateEnd.getMonth() + 1,
        end_day = dateEnd.getDate(),
        end_hour = dateEnd.getHours();
    var d_value_year = end_year - start_year, //年的差值
        d_value_month = end_month - start_month, //月的差值
        d_value_day = end_day - start_day, //天的差值
        d_value_hour = end_hour - start_hour; //小时的差值
    //console.log("差的  年 " + d_value_year + "   月 " + d_value_month + "  日" + d_value_day + " 时 " + d_value_hour)
    switch (type) {
        case '1month_hh': {
            if (d_value_year == 0) { //一年内的时间判断
                if (d_value_month > 1) {
                    layer.open({
                        content: "查询时间不能超过一个月！"
                    });
                    return false;
                } else if (d_value_month == 1) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过一个月！"
                        });
                        return false;
                    } else if (d_value_day == 0) {
                        if (d_value_hour >= 1) {
                            layer.open({
                                content: "查询时间不能超过一个月！"
                            });
                            return false;
                        }
                    }
                }
            } else if (d_value_year == 1) { //跨年 12月 -1月
                if (d_value_month == -11) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过一个月！"
                        });
                        return false;
                    } else if (d_value_day == 0) {
                        if (d_value_hour >= 1) {
                            layer.open({
                                content: "查询时间不能超过一个月！"
                            });
                            return false;
                        }
                    }
                } else {
                    layer.open({
                        content: "查询时间不能超过一个月！"
                    });
                    return false;
                }
            } else {
                layer.open({
                    content: "查询时间不能超过一个月！"
                });
                return false;
            }
        }
            break;
        case '30day': {
            var daynum = 30;
            var get_s_time = new Date(end),
                get_e_time = new Date(start);
            if ((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {
                layer.open({
                    content: '查询时间不得大于' + daynum + '天！'
                });
                return false;
            }
        }
            break;
        case '1day': {
            var daynum = 1;
            var get_s_time = new Date(end),
                get_e_time = new Date(start);
            if ((get_s_time - get_e_time) > 1000 * 60 * 60 * 24 * daynum) {

                layer.open({
                    content: '查询时间不得大于' + daynum + '天！'
                });
                return false;
            }
        }
            break;
        case '1month': {
            if (d_value_year == 0) { //一年内的时间判断
                if (d_value_month > 1) {
                    layer.open({
                        content: "查询时间不能超过一个月！"
                    });
                    return false;
                } else if (d_value_month == 1) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过一个月！"
                        });
                        return false;
                    }
                }
            } else if (d_value_year == 1) { //跨年 12月 -1月
                if (d_value_month == -11) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过一个月！"
                        });
                        return false;
                    }
                } else {
                    layer.open({
                        content: "查询时间不能超过一个月！"
                    });
                    return false;
                }
            } else {
                layer.open({
                    content: "查询时间不能超过一个月！"
                });
                return false;
            }
        }
            break;
        case '3month': {
            if (d_value_year == 0) { //一年内的时间判断
                if (d_value_month > 3) {
                    layer.open({
                        content: "查询时间不能超过三个月！"
                    });
                    return false;
                } else if (d_value_month == 3) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过三个月！"
                        });
                        return false;
                    }
                }
            } else if (d_value_year == 1) { //跨年 12月 -1月
                if (d_value_month == -10) {
                    if (d_value_day >= 1) {
                        layer.open({
                            content: "查询时间不能超过三个月！"
                        });
                        return false;
                    }
                } else {
                    layer.open({
                        content: "查询时间不能超过三个月！"
                    });
                    return false;
                }
            } else {
                layer.open({
                    content: "查询时间不能超过三个月！"
                });
                return false;
            }
        }
            break;
        case 'year': {
            if (d_value_year == 1) {
                if (d_value_month >= 1) {
                    layer.open({
                        content: "查询时间不能超过一年！"
                    });
                    return false;
                } else if (d_value_month == 0) {
                    if (d_value_day > 1) {
                        layer.open({
                            content: "查询时间不能超过一年！"
                        });
                        return false;
                    }
                }
            } else if (d_value_year > 1) {
                layer.open({
                    content: "查询时间不能超过一年！"
                });
                return false;
            }
        }
            break;
    }
    return true;
}

/**
 * 清除地图上markers
 * @param map
 * @param markers
 * @private
 */
function _clear_markers_map(map, markers) {
    $.each(markers, function (n, marker) {
        map.removeOverlay(marker);
    });
    markers = [];
}

function getnumber(value) { //获取数字
    var num = value.replace(/[^0-9]/ig, "");
    return num;
}

function getletter(value) { //获取字母
    var letter = value.replace(/[^a-z]+/ig, "");
    return letter;
}

function toChangePollution_Val(value) {
    var num_pollution = getnumber(value),
        str_pollution = getletter(value);
    if (num_pollution == 25) {
        num_pollution = 2.5;
    }
    var html = str_pollution.toUpperCase() + "<sub>" + num_pollution + "</sub>  ";
    return html;
}

//去掉字串右边的空格
function rTrim(str) {
    var iLength = str.length;
    if (str.charAt(iLength - 1) == " ") {
        //如果字串右边第一个字符为空格
        str = str.slice(0, iLength - 1); //将空格从字串中去掉
        //这一句也可改成 str = str.substring(0, iLength - 1);
        str = rTrim(str); //递归调用
    }
    return str;
}


/**
 * 展示污物 处理下标、大小写问题
 * @param type
 * @returns {*}
 */
function showUpper(type) {
    if (type == null || type == "" || type == 'undefined') {
        return "";
    }
    if (type == "aqi") {
        return "标准AQI"
    } else if (type == "aqi2") {
        return "AQI";
    } else {
        var pollutionType = type.toUpperCase(),
            num = pollutionType.replace(/[^0-9]/ig, ""),
            vl = pollutionType.replace(/\d+/g, '');
        if (num == "25") {
            num = "2.5";
        }
        return vl + "<sub>" + num + "</sub>";
    }
}


function titlePollution(value) {
    var num_pollution = getnumber(value),
        str_pollution = getletter(value).toUpperCase();
    if (num_pollution == 25) {
        num_pollution = 2.5;
    }
    var titleHtml = str_pollution + num_pollution;
    return titleHtml;
}