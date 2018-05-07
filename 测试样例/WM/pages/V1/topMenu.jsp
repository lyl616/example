

<c:set var="coreApiPath" value="${requestScope.coreApiContextPath}"/>
<c:set var="backendApiPath" value="${requestScope.backendApiContextPath}"/>
<script type="text/javascript" src="${ctx}/resources/js/common/commonUtils.js"></script>
<script type="text/javascript">
    $.ctx = "${ctx}";
    $.coreApiPath = "${requestScope.coreApiContextPath}";
    $.backendApiPath = "${requestScope.backendApiContextPath}";
    parent['cityId'] = CommonUtil.getCookie("cityId");
    parent['domainId'] = CommonUtil.getCookie("cityId");
    parent['provinceId'] = CommonUtil.getCookie("provinceId");
    parent['cityName'] = decodeURI(CommonUtil.getCookie("cityName"));
    var userId = CommonUtil.getCookie("userId");
    parent['userId'] = userId;
</script>
<div class="frame-menu">
    <div class="pull-left" id="zlight-nav">
        <ul id="zlightmenu">
            <li id="menuParentLi">
				<span href="2015-10-28/juqery-nav677020150824/index.html">
						<img src="${ctx}/resources/img/system/logo.png" class="logo-img"/>
						<b class="text"></b>
				</span>
            </li>
        </ul>
    </div>
    <!--菜单开始-->
    <ul class="venus-menu">
    </ul>
    <!--菜单结束-->
    <div class="down-menu pull-right" style="width: 73px;">
		<span class="curr-menu m-l-10" id='currUser' onclick="toogleMenu('userSelect','currUser')">
			<div class="icon-usertool"></div>
		</span>
        <ul id="userSelect" style="z-index: 99999999">
            <li>
                <a href="#" onclick="changePwd()">密码修改</a>
            </li>
            <li>
                <a onclick="logout()" href="javascript:void(0)">退出</a>
            </li>
        </ul>
    </div>
    <div class="down-menu pull-right">
		<span class="curr-menu" id="currCity" onclick="toogleMenu('citySelect','currCity')">
            <span id="cityNameSpan">&nbsp;</span>
		<i class="icon-down m-l-5"></i>
		</span>
        <ul id="citySelect">
            <li>
            </li>
        </ul>
    </div>
    <div class="pull-right telecom-logo"><img src="${ctx}/resources/img/whiteLogo-Chengdu.png"/></div>
    <div class="top-pname hidden" id="pageName"></div>
</div>
<div class="frame-menu-place"></div>
<script type="text/javascript">
    //未登录跳转到登录页
    if (!CommonUtil.getCookie("access_token")) {
        window.location.href = $.ctx + "/login"
    }
    CommonUtil.path = $.ctx;
    var menuUrl = $.backendApiPath + "/function/getFunctionByUserId";
    var currentUrl = window.location.href.split("?")[0];
    $("#cityNameSpan").text(parent['cityName']);
    $("#currUser").attr('title', CommonUtil.getCookie("userName"));
    moveToggledrayMenu();

    function toogleMenu(id, targetid) {
        $("#" + id).show();
        $(document).bind('click', function (e) {
            var e = e || window.event; //浏览器兼容性
            var elem = e.target || e.srcElement;
            while (elem) { //循环判断至跟节点，防止点击的是div子元素
                if (elem.id && elem.id == targetid) {
                    return;
                }
                elem = elem.parentNode;
            }
            $('#' + id).hide(); //点击的不是div或其子元素
        });
    }

    function moveToggledrayMenu() { //下拉菜单当移出按钮的时候关闭下拉菜单
        $(".down-menu").click(function () {
            $(this).children('ul').toggleClass('dn');
        });
    }

    //菜单效果
    $['fn']['maps'] = function (_0x2091x1) {
        var _0x2091x2 = {
            speed: 300
        };
        $['extend'](_0x2091x2, _0x2091x1);
        var _0x2091x3 = 0;
        $('.venus-menu')['find']('li')['each'](function () {
            if ($(this)['children']('ul')['length'] > 0) {
                // $(this)['append']('<span class=\'indicator\'>+</span>');
            }
        });
        $('.venus-menu')['prepend']('<li class=\'showhide\'><span class=\'title\'>Menu</span><span class=\'icon\'><em></em><em></em><em></em><em></em></span></li>');
        _0x2091x4();
        $(window)['resize'](function () {
            _0x2091x4();
        });

        function _0x2091x4() {
            $('.venus-menu')['find']('li, a')['unbind']();
            $('.venus-menu')['find']('ul')['hide'](0);
            _0x2091x8();
            _0x2091x5();
            // if (window['innerWidth'] <= 768) {//在页面的宽度小于768的时候，重置菜单为手机端显示样式
//              _0x2091x7();
//              _0x2091x6();
//              if (_0x2091x3 == 0) {
//                  $('.venus-menu > li:not(.showhide)')['hide'](0);
//              }
            ;
            // } else {
            // _0x2091x8();
            //  _0x2091x5();
            // }
        }

        function _0x2091x5() {
            $('.venus-menu')['find']('ul')['removeClass']('slide-left');
            $('.venus-menu li')['bind']('mouseover', function () {
                $(this)['children']('ul')['stop'](true, true)['fadeIn'](_0x2091x2['speed'])['addClass']('zoom-out');
            })['bind']('mouseleave', function () {
                $(this)['children']('ul')['stop'](true, true)['fadeOut'](_0x2091x2['speed'])['removeClass']('zoom-out');
            });
        };

        function _0x2091x6() {
            $('.venus-menu')['find']('ul')['removeClass']('zoom-out');
            $('.venus-menu li:not(.showhide)')['each'](function () {
                if ($(this)['children']('ul')['length'] > 0) {
                    $(this)['children']('a')['bind']('click', function () {
                        if ($(this)['siblings']('ul')['css']('display') == 'none') {
                            $(this)['siblings']('ul')['slideDown'](300)['addClass']('slide-left');
                            _0x2091x3 = 1;
                        } else {
                            $(this)['siblings']('ul')['slideUp'](300)['removeClass']('slide-left');
                        }
                        ;
                    });
                }
                ;
            });
        };

        function _0x2091x7() {
            $('.venus-menu > li.showhide')['show'](0);
            $('.venus-menu > li.showhide')['bind']('click', function () {
                if ($('.venus-menu > li')['is'](':hidden')) {
                    $('.venus-menu > li')['slideDown'](300);
                    _0x2091x3 = 1;
                } else {
                    $('.venus-menu > li:not(.showhide)')['slideUp'](300);
                    $('.venus-menu > li.showhide')['show'](0);
                    _0x2091x3 = 0;
                }
                ;
            });
        };

        function _0x2091x8() {
            $('.venus-menu > li')['show'](0);
            $('.venus-menu > li.showhide')['hide'](0);
        };
    };

    //菜单初始化
    function initMenu(data) {
        var html = "";
        for (i in data) {
            var firstData = data[i];
            if (!firstData.menuName) {
                continue;
            }
            if (currentUrl.endsWith(firstData.menuUrl)) {
                var menuHtml = '<li>' + '<a class="menu-level-1 active" href="' + firstData.menuUrl + '">' + firstData.menuName;
                $("#pageName").text(firstData.menuName);
            } else {
                var menuHtml = '<li>' + '<a class="menu-level-1" href="' + firstData.menuUrl + '">' + firstData.menuName;
            }
            menuHtml += '</a>';
            if (firstData.childList) {
                menuHtml += '<ul class="border-radius-2">';
                for (j in firstData.childList) {
                    var secondData = firstData.childList[j];
                    if (!secondData.menuName) {
                        continue;
                    }
                    if (currentUrl.endsWith(secondData.menuUrl)) {
                        menuHtml += '<li>' + '<a class="menu-level-2 active" href="' + secondData.menuUrl + '">' + secondData.menuName;
                        $("#pageName").text(secondData.menuName);
                    } else {
                        menuHtml += '<li>' + '<a class="menu-level-2" href="' + secondData.menuUrl + '">' + secondData.menuName;
                    }
                    menuHtml += '</a>';
                    if (secondData.childList) {
                        menuHtml += '<ul class="menuClass3 border-radius-3">';
                        for (x in secondData.childList) {
                            var thirdData = secondData.childList[x];
                            if (!thirdData.menuName) {
                                continue;
                            }
                            if (currentUrl.endsWith(thirdData.menuUrl)) {
                                menuHtml += '<li>' + '<a class="menu-level-3 active" href="' + thirdData.menuUrl + '">' + thirdData.menuName;
                                $("#pageName").text(thirdData.menuName);
                            } else {
                                menuHtml += '<li>' + '<a class="menu-level-3" href="' + thirdData.menuUrl + '">' + thirdData.menuName;
                            }
                            menuHtml += '</a>';
                            if (thirdData.childList) {
                                menuHtml += '<ul class="menuClass4 border-radius-3">';
                                for (y in thirdData.childList) {
                                    var fourthData = thirdData.childList[y];
                                    if (!fourthData.menuName) {
                                        continue;
                                    }
                                    if (currentUrl.endsWith(fourthData.menuUrl)) {
                                        menuHtml += '<li>' + '<a class="menu-level-4 active" href="' + fourthData.menuUrl + '">' + fourthData.menuName;
                                        $("#pageName").text(fourthData.menuName);
                                    } else {
                                        menuHtml += '<li>' + '<a class="menu-level-4" href="' + fourthData.menuUrl + '">' + fourthData.menuName;
                                    }
                                    menuHtml += '</a>';
                                }
                                menuHtml += '</ul>';
                            }
                        }
                        menuHtml += '</ul>';
                    }
                }
                menuHtml += '</ul>';
            }
            menuHtml += '</li>';
            html += menuHtml;
        }
        $(".venus-menu").html(html);

        $(".venus-menu .active").parents("li").not($("#menuParentLi")[0]).find('>a').addClass("active");
        var _topA = $($(".venus-menu .active").parents("li").not($("#menuParentLi")[0]).find('>a')[0]);
        //处理顶部长短不一
        if (_topA.text().length == 1) {
            _topA.css('background-size', '25% 2px');
        }
        if (_topA.text().length == 2) {
            _topA.css('background-size', '50% 2px');
            _topA.css('background-position-x', '50%');
        }
        if (_topA.text().length == 3) {
            _topA.css('background-size', '75% 2px');
        }
        $(function ($) {
            $('.venus-menu').maps();
        });
    }

    //加载菜单数据
    $.ajax({
        type: "GET",
        url: menuUrl,
        data: {
            "userId": userId
        },
        dataType: "json",
        success: function (data) {
            if (data.erroCode == 2000) {
                initMenu(data.result);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.responseText.indexOf("invalid_token") > -1) {
                window.location.href = $.ctx + "/logout"
            }
        }
    });

    //城市切换
    var changeCity = function (cityId, provinceId, cityName) {
        CommonUtil.setCookie("cityId", cityId);
        CommonUtil.setCookie("provinceId", provinceId);
        CommonUtil.setCookie("cityName", encodeURI(cityName));
        window.location.reload(true);
    }

    //城市数据获取
    $.ajax({
        type: "GET",
        url: $.coreApiPath + "/domain/getDomains",
        dataType: "json",
        success: function (data) {
            if (data.erroCode == 2000) {
                var cityHtml = "";
                for (var i in data.result) {
                    var domainInfo = data.result[i];
                    if (domainInfo.domainName) {
                        cityHtml += '<li><a href="javascript:void(0)" id="' + domainInfo.id + '" ' +
                            'onclick="changeCity(\'' + domainInfo.id + '\', \'' + domainInfo.parentId + '\', \'' + domainInfo.domainName + '\')">' +
                            domainInfo.domainName +
                            '</a></li>';
                    }
                }
                $("#citySelect").html(cityHtml);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.responseText.indexOf("invalid_token") > -1) {
                window.location.href = $.ctx + "/logout"
            }
        }
    });

    //获取系统配置
    // $.ajax({
    //     type: "GET",
    //     url: $.backendApiPath + '/config/landingtitle',
    //     dataType: "json",
    //     success: function (json) {
    //         if (json.erroCode == 2000) {
    //             $('#menuParentLi b').text(json.result.systemName);
    //         } else {
    //             layer.msg('网络错误', function () {
    //             });
    //         }
    //     },
    //     error: function (XMLHttpRequest, textStatus, errorThrown) {
    //         if (XMLHttpRequest.responseText.indexOf("invalid_token") > -1) {
    //             window.location.href = $.ctx + "/logout"
    //         }
    //     }
    // });

    //登出
    var logout = function () {
        layer.msg('正在退出', {
            icon: 16,
            shade: 0.01
        });
        var logoutUrl = $.coreApiPath + '/rest/logout';
        $.ajax({
            type: "POST",
            url: logoutUrl,
            dataType: "json",
            success: function (data) {
                window.location.href = $.ctx + "/logout";
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.location.href = $.ctx + "/logout";
            }
        });
    };
    //收回所有select


</script>
<%@include file="../pwd.jsp" %>