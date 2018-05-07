//动态计算页面高度,防止出现滚动条
function calcOverflowH(index, objV, vh) {
    //0(id) ,1 (class) ,objV 是要设置的对象 ，vh 是要减去的距离顶部的间距   
    var scrrenW = document.documentElement.clientHeight;
    var h = scrrenW - vh;
    if(index == 0) {
        $("#" + objV).height(h + "px"); //直接设置元素的高
        //$().css("height",scrrenW-vh+"px");
    } else {
        $("." + objV).height(h + "px"); //直接设置元素的高
    }
}

function getObjSize(index, obj) {
    var objsize = {
        "w": 0,
        "h": 0
    };
    if(index == 0) {
        objsize.w = $("#" + obj).width();
        objsize.h = $("#" + obj).height();
    } else {
        objsize.w = $("." + obj).width();
        objsize.h = $("." + obj).height();
    }
    return objsize;
}

function changeTheme(color) { //更换框架主题
    switch(color) {
        case 0:
        { //白色
            console.log("白色");
            $("body").removeClass("theme-black");
            $("body").addClass("theme-gray");

        }
            break;
        case 1:
        { //黑色
            console.log("黑色");
            $("body").removeClass("theme-gray");
            $("body").addClass("theme-black");
        }
            break;
    }
}
//layer 弹窗控件 ，包括alert 控件



function isIP(ip) {

    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g // 匹配IP地址的正则表达式
    if (re.test(ip)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256
            && RegExp.$4 < 256)
            return true;
    }
    return false;
}
/**
 * 切换是否可以
 * @param element    显示/隐藏的元素
 * @param time        淡入/淡出时间，默认为500毫秒
 */
function changeVisibility(element, time, action) {
    if (!$.isNumeric(time)) {
        time = 500;
    }
    if (!$.isFunction(action)) {
        action = function () {
        };
    }
    if (element.is(":hidden")) {
        element.show(time, action);
    } else {
        element.hide(time, action);
    }
}


var dev = {
    data: {},
    simpleDateFormat: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),//季度
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    addData: function (name, value) {
        this.data[name] = value;
    },
    getData: function () {
        return this.data;
    },
    emptyData: function () {
        this.data = {};
    },
    removeData: function (name) {
        delete this.data[name];
        return this.data;
    },
    postData: function (url, callBack) {
        $.ajax({
            url: url,
            method: "post",
            dataType: "json",
            data: this.data,
            success: function (responseData) {
                callBack(responseData);
            }
        });
    }
};


/** ******************************张春伟******************************* */
/**
 * 初始化行政区
 * city_id :城市的ID
 */
function initDistrict(city_id) {
    var url = $.coreApiPath + "/history/getDistrict";
    var param = {
        "cityId": city_id
    };
    var opt = document.getElementById("district1");
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            opt.options.add(new Option("全部", "-1"));
            for (var i = 0; i < data.length; i++) {
                opt.options.add(new Option(data[i].district, data[i].id));
            }
        });
    }
}
/**
 * 初始化站点类别
 * type 站点类别
 */
function initStationType(domId, type) {
    var url = $.coreApiPath + "/history/getStationType";
    var param = {
        "type": type
    };
    var opt = document.getElementById(domId);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            opt.options.add(new Option("全部", "-1"));
            for (var i = 0; i < data.length; i++) {
                opt.options.add(new Option(data[i].name, data[i].code));
            }
        });
    }
}


/**
 * 初始化站点类别
 * type 站点类别
 */
function initStationType(domId, type, sTechType) {
    var url = $.coreApiPath + "/history/getStationType";
    var param = {
        "type": type
    };
    var opt = document.getElementById(domId);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            opt.options.add(new Option("全部", "-1"));
            for (var i = 0; i < data.length; i++) {
                opt.options.add(new Option(data[i].name, data[i].code));
            }
        });
    }
}

/**
 * 初始化省
 *
 * @param pro
 *            -1 默认选中 否则选中pro
 */
function initPrrovince(id, pro, all) {
    var url = $.coreApiPath + "/user/pros";
    var opt = $("#" + id);
    opt.empty();
    if (all) {
        opt.append("<option value='-1' selected='selected'>全部</option>");
    }
    $.getJSON(url).success(function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].province + "</option>");
            }
            if (pro != "-1") {
                opt.find("option[value='" + pro + "']").attr("selected", true);
            }
        }
    });
}

/**
 * 初始化城市
 *
 * @param pro_id
 * @param city
 *            如果不是-1 则选中传过来的city
 */
function initCityByProId(id, pro_id, city, all) {
    if (pro_id == "" || pro_id == null) {
        return;
    }
    var url = $.coreApiPath + "/user/cities";
    var param = {
        "provinceId": pro_id
    };
    var opt = $("#" + id);
    opt.empty();
    if (all) {
        opt.append("<option value='-1' selected='selected'>全部</option>");
    }
    $.getJSON(url, param).success(function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].city + "</option>");
            }
            if (city != "-1") {
                opt.find("option[value='" + city + "']").attr("selected", true);
            }
        }
    });
}

/**
 *
 * @param {Object} option
 * id  string dom ID
 * all Boolean 是否增加全部选项
 * url 请求地址
 * value option value 返回json对象中的属性值
 * text option显示名称
 */
function initSelect(option) {
    var opt = $("#" + option.id);
    opt.empty();
    if (option.all) {
        opt.append("<option value='-1'>全部</option>");
    }
    $.ajax({
        type: "get",
        dataType: "json",
        url: $.coreApiPath + "/" + option.url,
        success: function (data) {
            $.each(data, function (i, n) {
                var opthtml = "";
                if (option.defaultValue == n[option.value]) {
                    opthtml = "<option value='" + n[option.value] + "' selected>"
                        + n[option.text] + "</option>";
                } else {
                    opthtml = "<option value='" + n[option.value] + "'>" + n[option.text],
                        +"</option>";
                }
                opt.append(opthtml);
            });
        }
    });
}


function initSelect2(option) {
    var opt = $("#" + option.id);
    opt.empty();
    opt.html("");
    if (option.all) {
        opt.append("<option value='-1'>全部</option>");
    }
    ajax(option.url, option.postData, function (data) {
        var opthtml = "";
        $.each(data, function (i, n) {

            if (option.defaultValue == n[option.value]) {
                opthtml += "<option value='" + n[option.value] + "' selected>"
                    + n[option.text] + "</option>";
            } else {
                opthtml += "<option value='" + n[option.value] + "'>" + n[option.text],
                    +"</option>";
            }
            // opt.append(opthtml);
        });
        opt.html(opthtml);
    });
}

function clearAllCheckBoxByClass(classes) {
    $("."+classes+" input[type=checkbox]").each(function(){
        $(this).attr("checked",false);
    });
}


