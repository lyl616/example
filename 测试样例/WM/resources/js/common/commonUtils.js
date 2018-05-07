/*!
 * 
 * 前端工具类
 * 2016.12.29
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
        : typeof define === 'function' && define.amd ? define(factory)
        : (global.CommonUtil = factory());
}(this, function () {
    'use strict';

    function CommonUtil(options) {
        _init(options);
    }

    /**
     * 初始化
     *
     * @param options
     * @returns
     */
    function _init(options) {
        $.ajaxSetup({
            complete: function (XMLHttpRequest, textStatus) {
                try {
                    var text = XMLHttpRequest.responseText// $.parseJSON(XMLHttpRequest.responseText);
                    if (text.indexOf('蛙鸣科技 | 登录') != -1) {
                        window.location = CommonUtil.path + '/pages/login.jsp';
                    }
                } catch (e) {

                }
                ;
            },
            statusCode: {
                404: function () {
                    if (console) {
                        console.log('数据获取/输入失败，没有此服务。404');
                    }
                },
                504: function () {
                    if (console) {
                        console.log('数据获取/输入失败，服务器没有响应。504');
                    }
                },
                500: function () {
                    if (console) {
                        console.log('服务器有误。500');
                    }
                }
            }
        });
    }

    /** ******实例方法************ */
    /**
     * 实例方法
     */
    CommonUtil.prototype.doSames = function () {

    }
    /** ******静态方法************ */
    /**
     * json转数组方法，只处理一层
     */
    CommonUtil.json2Array = function (json) {
        var arr = [];
        for (var item in json) {
            if (json[item] || json[item] == 0) {
                arr.push(item + '=' + json[item]);
            }
        }
        return arr;
    }
    /**
     * 日志方法
     */
    CommonUtil.log = function (msg) {
        console.log(msg);
    }
    /**
     * 日期格式化，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
     * 年(y)可以用 1-4
     * 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    CommonUtil.dateFormater = function (date, fmt) {
        date = date || new Date();
        var o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
            "H+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    /**
     * ajax请求
     *
     * @params options 参数对象
     */
    CommonUtil.ajax = function (options) {
        options = options || {};
        // this.log('ajax url:' + options.url);
        options.type = options.type || 'post';
        options.sucessFn = options.sucessFn || function () {
        };
        options.errorFn = options.errorFn || function () {
        };
        options.dataType = options.dataType || 'json';
        options.contentType = options.contentType || 'application/json; charset=UTF-8';
        options.data = JSON.stringify(options.data);// 参数序列化
        // this.log('ajax options:' + JSON.stringify(options));
        _ajax(options.url, options).done(function (resp) {
            options.sucessFn(resp);
        }).fail(function (err) {
            CommonUtil.log(err);
            options.errorFn(err);
            closeLayreLoader();
        });
    }

    function _ajax(url, options) {
        return $.ajax(options).then(function (resp) {
            // 成功回调
            if (resp.erroCode == '2000') {
                return resp.result; // 直接返回要处理的数据，作为默认参数传入之后done()方法的回调
            } else if (resp.erroCode == '4000') {
                window.location = CommonUtil.path + '/pages/login.jsp';
            } else {
                return $.Deferred().reject(resp.erroMsg); // 返回一个失败状态的deferred对象，把错误代码作为默认参数传入之后fail()方法的回调
            }
        }, function (err) {
            // 失败回调
            CommonUtil.log(err.status); // 打印状态码
        });
    }

    CommonUtil.setCookie = function (key, val, path) {
        if (!path) path = "/";
        document.cookie = key + "=" + val + "; expires=Session; path=" + path;  //设置cookie
    };
    CommonUtil.getCookie = function (key) {
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    };
    CommonUtil.deleteCookie = function (key) {
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
    };
    CommonUtil.getQueryParameter = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return "";
    };
    CommonUtil.getFunctionRole = function (success) {
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                success(data);
            }
        });
    };
    // url前缀
    CommonUtil.path = '';
    CommonUtil.version = '1.0.0';
    return CommonUtil;
}));