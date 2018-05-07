/**
 * 初始化数据字典里的下拉值
 *
 * @param id 初始化的 DOM id
 * @param type 数年字典类型
 * @param selVal 默认选中的值
 * @param all 是否显示全部选项 value -1 text 全部
 */
function getDictionaryByType(id, type, selVal, all) {
    var opt = $("#" + id);
    opt.empty();
    if (all) {
        opt.append("<option value='-1' selected='selected'>全部</option>");
    }
    var url = $.coreApiPath + "/dictionary/dictionaryType";
    var param = {
        "type": type
    };
    $.getJSON(url, param).success(function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].name + "</option>");
            }
            if (selVal != -1) {
                selectValue(id, selVal);
            }
        }

    });
}

function getDictionary(option) {
    var opt = $("#" + option.id);
    opt.empty();
    if (option.all) {
        var tit = "全部";
        if (option.allText) {
            tit = option.allText;
        }
        opt.append("<option value='-1' selected='selected'>" + tit + "</option>");
    }
    var url = $.coreApiPath + "/dictionary/dictionaryType";
    var param = {
        "type": option.type
    };
    $.getJSON(url, param).success(function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var value = "";
                var txt = "";
                if (option.value) {
                    value = data[i][option.value];
                } else {
                    value = data[i].id;
                }
                if (option.txt) {
                    txt = data[i][txt];
                } else {
                    txt = data[i].name;
                }
                opt.append("<option value=\"" + value + "\">" + txt + "</option>");
            }
            if (option.default != -1) {
                selectValue(id, option.default);
            }
        }
        if (option.complete) {
            option.complete();
        }
    });
}

/**
 * 初始化数据字典里的下拉值(绑定code为value值)
 *
 * @param option eg: {id:"station_type",type:4,defaultVlaue:-1,all:false,complete:function(){//回调函数}}
 */
function getDictionaryCode(option) {
    var opt = $("#" + option.id);
    opt.empty();
    if (option.all) {
        var tit = "全部";
        if (option.allText) {
            tit = option.allText;
        }
        opt.append("<option value='-1' selected='selected'>" + tit + "</option>");
    }
    var url = $.coreApiPath + "/dictionary/dictionaryType";
    var param = {
        "type": option.type
    };
    $.getJSON(url, param).success(function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].code + "\">" + data[i].name + "</option>");
            }
            if (option.defaultVlaue != -1) {
                opt.val(option.defaultVlaue);
                //selectValue(id, option.defaultVlaue);
            }
        }
        if (option.complete) {
            option.complete();
        }
    });
}
/**
 * 获取数据字典
 * @param id
 * @param fun 回调方法
 */
function getDictionaryById(id, fun) {
    $.ajax({
        type: "get",
        url: $.coreApiPath + "/dictionary/query/id/" + id,
        async: true,
        success: fun
    });
}

/*****************************张春伟 start **********************************/
/**
 * 设备类型(贺晨钊版)
 * @param opts json 格式
 *
 *  opts.objID      option 创建id
 *  opts.type       下拉框类型
 *    opts.parentID   parentid
 *    opts.cityID     城市id
 *    opts.proID      省ID
 *  opts.districtID 区县id
 *    opts.isAll      是否添加'全部'
 *    opts.callBack   回调
 * 下拉框的value eg: code_id 把code和id拼装在一起
 */
function backwrite_select_option(opts) {//更改select的option 选项值，并将pm2.5改为pm25
    var id = opts.objID;
    var type = opts.type;
    var city = opts.cityID;
    var hideAQI = opts.hideAQI;
    var pro = opts.proID;
    //	var parent = opts.parentID;
    //	var dist   = opts.districtID;
    var isAll = opts.isAll;
    var callBack = opts.callBack;

    var url = $.coreApiPath + "/dictionary/diviceType";
    var param = {
        type: type,
        city: city,
        pro: pro
        //		parent : parent
    };
    var opt = document.getElementById(id);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            if (isAll) {
                opt.options.add(new Option("全部", "-1_1"));
            }
            for (var i = 0; i < data.length; i++) {
                var t = data[i].code;
                if ((t == "aqi"||t=="aqi2") && !hideAQI) {
                    opt.options.add(new Option(data[i].name, t));
                } else {
                    opt.options.add(new Option(data[i].name, t));
                }
            }
            if (callBack != null) {
                callBack(data);
            }
            //          $("#"+id).change();
        });
    }
}

function init_s_stech_type_option(opts) {
    var id = opts.objID;
    var type = opts.type;
    var city = opts.cityID;
    var pro = opts.proID;
    //	var parent = opts.parentID;
    //	var dist   = opts.districtID;
    var isAll = opts.isAll;
    var callBack = opts.callBack;

    var url = $.coreApiPath + "/dictionary/diviceType";
    var param = {
        type: type,
        city: city,
        pro: pro
        //		parent : parent
    };
    var opt = document.getElementById(id);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;
        $.getJSON(url, param).success(function (data) {
            if (isAll) {
                opt.options.add(new Option("全部", "-1_1"));
            }

            for (var i = 0; i < data.length; i++) {
                opt.options.add(new Option(data[i].name, data[i].code + "_" + data[i].id));
            }
            if (callBack != null) {
                callBack(data);
            }
            $("#" + id).change();
        });
    }
}
/**
 * 站点类型(贺晨钊版)
 * @param opts json 格式
 *
 *  opts.objID      option 创建id
 *  opts.type       下拉框类型
 *    opts.parentID   parentid
 *    opts.cityID     城市id
 *    opts.proID      省ID
 *  opts.districtID 区县id
 *    opts.isAll      是否添加'全部'
 *    opts.callBack   回调
 * 下拉框的value eg: code_id 把code和id拼装在一起
 */
function init_station_type_option(opts) {

    var id = opts.objID;
    var parent = opts.parentID;
    //	var type   = opts.type;
    //	var city   = opts.cityID;
    //	var pro    = opts.proID;
    //	var dist   = opts.districtID;
    var isAll = opts.isAll;
    var callBack = opts.callBack;

    var url = $.coreApiPath + "/dictionary/stationType";
    var param = {
        parent: parent
        //			type   : type,
        //			city   : city,
        //			pro    : pro,
        //			district:dist
    };
    var opt = document.getElementById(id);
    if (opt != null && typeof(opt) != 'undefined') {
        opt.options.length = 0;

        $.ajax({
            url: url,
            async: false, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
            type: "POST",
            dataType: "json",
            data: param,
            success: function (data) {
                if (isAll) {
                    opt.options.add(new Option("全部", "-1_1"));
                }

                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        opt.options.add(new Option(data[i].name, data[i].code + "_" + data[i].id));
                    }
                    if (callBack != null) {
                        callBack(data);
                    }
                }
            }
        });
    }
}

/*****************************张春伟 end   **********************************/