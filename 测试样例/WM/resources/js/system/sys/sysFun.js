var funIDForGroupTree = null; //功能关系 组关系树使用


var sysFunVM = new Vue({
        el: "#content",
        data: {
            allFunctions: {},
            btns: {
                delAllBtn: false,
                addBtn: false,
                delBtn: false,
                updateBtn: false,
                relationBtn: false
            }, loadOnStart: false
        },
        beforeCreate: function () {
            var _self = this;
            var url = $.coreApiPath + "/role/functionRole";
            ajax_get(url, {}, function (data) {
                if (data.erroCode == 2000) {
                    _self.allFunctions = data.result;
                    _self.btns.delAllBtn = _self.allFunctions['ROLE_FUN_103_05_01'] != undefined;
                    _self.btns.addBtn = _self.allFunctions['ROLE_FUN_103_05_02'] != undefined;

                    _self.btns.delBtn = _self.allFunctions['ROLE_FUN_103_05_03'] != undefined;
                    _self.btns.updateBtn = _self.allFunctions['ROLE_FUN_103_05_04'] != undefined;
                    _self.btns.relationBtn = _self.allFunctions['ROLE_FUN_103_05_05'] != undefined;

                } else {
                    _self.allFunctions = {};
                    _self.btns = {
                        delAllBtn: false,
                        addBtn: false,
                        delBtn: false,
                        updateBtn: false,
                        relationBtn: false
                    };
                }
                _self.loadOnStart = true;
            });
        },
        methods: {},
        mounted: function () {
            if (this.loadOnStart) {
                loadData();
            }
        },
        watch: {
            'loadOnStart': function () {
                if (this.loadOnStart) {
                    loadData();
                }
            }
        }
    })
;


/**
 * 新增Or修改
 */
function saveOrUpdateFun(action) {
    var fatherBody = $(window.document.body);
    var code = fatherBody.find("#code").val();
    if (code == "" || code == null) {
        layer.msg("功能编码不能不空！");
        return false;
    }

    var functionModule = fatherBody.find("#functionModule").val();
    if (functionModule == "" || functionModule == null) {
        layer.msg("功能模块不能为空！");
        return false;
    }
    var functionName = fatherBody.find("#functionName").val();
    if (functionName == "" || functionName == null) {
        layer.msg("功能名称不能为空！");
        return false;
    }
    var functionType = fatherBody.find("#functionType").val();
    if (functionType == "" || functionType == null) {
        layer.msg("功能类型不能为空！");
        return false;
    }
    var functionUrl = fatherBody.find("#functionUrl").val();
    if ((functionType == '2' || functionType == '4') && (functionUrl == "" || functionUrl == null)) {
        layer.msg("路径和Restful类型功能路径不能为空！");
        return false;
    }
    var parentId = fatherBody.find("#parentId").val();
    if (parentId == "" || parentId == null) {
        layer.msg("父级模块未填写！");
        return false;
    }
    var orderNo = fatherBody.find("#orderNo").val();
    if (orderNo == "" || orderNo == null) {
        layer.msg("功能序号不能为空！");
        return false;
    }

    var url = $.coreApiPath;
    if (action == "save") {
        url += "/function/addSysFunction";
    } else if (action == "update") {
        url += "/function/updateSysFunction";
    }
    var frmUserAdd = fatherBody.find("#sysFunAddFrom");
    var postData = frmUserAdd.serialize();

    ajax_post_msg(url, postData, "保存", function (r) {
        if (r.success) {
            closeModal("myModal");
            layer.msg(r.info);
            dataReload();
        } else {
            layer.msg(r.info);
            return false;
        }
        clean_from();
    })

    return false;
}

/**
 * 获取组管理分页列表
 */
var parentId = null;

function getList() {
    table = $("#tab").DataTable({
        "aLengthMenu": [10, 20, 40, 50],
        "searching": false, // 禁用搜索
        "lengthChange": false,
        "paging": true, // 开启表格分页
        "bProcessing": true,
        "bServerSide": true,
        "bAutoWidth": false,
        "sort": "position",
        "deferRender": true, // 延迟渲染
        "bStateSave": false, // 在第三页刷新页面，会自动到第一页
        "iDisplayLength": 10,
        "iDisplayStart": 0,
        "dom": '<l<\'#topPlugin\'>f>rt<ip><"clear">',
        "ordering": false, // 全局禁用排序
        "ajax": {
            "type": "POST",
            "url": $.coreApiPath + "/function/getFunctionsPage",
            "data": function (d) {
                d.parentId = parentId;
                d.functionName = $("#searchName").val();
            }
        },
        "aoColumns": [{
            "title": '<input type="checkbox" name="allChecked" class="dt_chk_all text-center" />',
            "data": "id",
            "orderable": false,
            "className": "text-center",
            "render": function () {
                return '<input type="checkbox" />';
            }
        }, {
            "data": "functionName",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "功能名称",
            "className": "text-center"
        }, {
            "data": "code",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "功能代码",
            "className": "text-center"
        }, {
            "data": "functionLevel",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "功能等级",
            "className": "text-center"
        }, {
            "data": "functionType",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "功能类型",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                // 时间格式化
                return formatFunType(data);
            }
        }, {
            "data": "functionUrl",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "功能URL",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                // if(data==1){
                // return data ='有效';
                // }else{
                // return data ='无效';
                // }
                // return data == 1 ? '有效' : '<font color="red">无效</font>';
                // if (data == 1) {
                // data = "<a href='#' class='upOrderStatus' data-id=" + full.id
                // + ">有效</a>";
                // } else {
                // data = "<a href='#' class='upOrderStatus' data-id=" + full.id
                // + "><font color='red'>无效</font></a>";
                // }
                return data;
            }
        }, {
            "data": "orderNo",
            "orderable": false, // 禁用排序
            "sDefaultContent": "",
            "title": "序号",
            "className": "text-center"
        }, {
            "data": "id",
            "orderable": false, // 禁用排序
            "sDefaultContent": '',
            "title": "操作",
            "className": "text-center",
            "render": function (data, type, full, meta) {
                var delBtn = "";
                var updateBtn = "";
                var relationBtn = "";
                if (sysFunVM.btns.delBtn) {
                    delBtn = '<button id="deleteOne" class="btn btn-danger" data-id=' + data + '>删 除</button>';
                }
                if (sysFunVM.btns.updateBtn) {
                    updateBtn = '<button id="updateOne" class="btn btn-info" data-id=' + JSON.stringify(data) + '>修 改</button>';
                }
                if (sysFunVM.btns.relationBtn) {
                    relationBtn = '<button id="relationBtn"  class="btn btn-info" data-id=' + JSON.stringify(data) + ' data-toggle="modal" data-target="#relation">关系</button>';
                }
                return delBtn + " " + updateBtn + " " + relationBtn;
            }
        }],
        "columnDefs": [{
            "orderable": false, // 禁用排序
            "targets": [0], // 指定的列
            "data": "id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" value="' + data + '" name="id"/>';
            }
        }],
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        initComplete: initComplete,
        drawCallback: function (settings) {
            $('input[name=allChecked]')[0].checked = false; // 取消全选状态
        }
    });
}

/**
 * 表格加载渲染完毕后执行的方法
 *
 * @param data
 */
function initComplete(data) {
    initCheckAll('customselt');

    var delAllBtn = "";
    var addBtn = "";
    if (sysFunVM.btns.delAllBtn) {
        delAllBtn = '<button   class="btn btn-danger m-r-5 m-t-10" id="deleteAll">批量删除</button>';
    }
    if (sysFunVM.btns.addBtn) {
        addBtn = '<button  class="btn btn-info addBtn m-t-10" >新 增</button><iframe id="exp" style="display:none;"></iframe>';
    }

    var topPlugin = delAllBtn + " " + addBtn;
    $("#topPlugin").append(topPlugin);
}

/**
 * 校验数字
 * @param t
 */
function validate(t) {
    var obj = $(t).val();
    if (null != obj && !/^[0-9]*$/.test(obj)) {
        layer.msg('请输入数字');
        $(t).val(null)
    }
}

/**
 * 获得tree数据
 * @param parent_id
 */
function getTree(parent_id) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onExpand: onExpandEvent,
            onClick: onClickEvent
        },
        check: {
            enable: false
        },
        view: {
            dblClickExpand: false //屏蔽掉双击事件
        }
    };
    var url = $.backendApiPath + "/function/getFunctionsTree";
    var param = {
        //		parentId : parent_id
    };
    $.post(url, param, function (data) {
        if (2000 == data.erroCode &&  data.result.length > 0) {
            $.fn.zTree.init($("#treeDemo"), setting, data.result);
        }
    }, "json");
}

/**
 * tree 单击事件
 * @param e
 * @param treeId
 * @param treeNode
 */
function onClickEvent(e, treeId, treeNode) {
    $("#searchName").val(null);
    parentId = treeNode.id;
    table.ajax.reload();
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.expandNode(treeNode);
};

/**
 * tree 展开事件
 * @param e
 * @param treeId
 * @param treeNode
 */
function onExpandEvent(e, treeId, treeNode) {
    $("#searchName").val(null);
    parentId = treeNode.id;
    table.ajax.reload();
}

function closeModal(id) {
    $('#' + id).modal('hide');
}

/**
 * 初始化绑定事件
 */
function initEvent() {
    $(document).delegate('.addBtn', 'click', function () {
        getDictionaryCode({
            id: "functionType",
            type: 18,
            defaultVlaue: -1,
            all: false,
            complete: function () {
            }
        });
        $('#myModal').modal('show');
        $("#saveBtn").removeAttr("onclick");
        $("#saveBtn").attr("onclick", "saveOrUpdateFun('save')");
    });
    $(document).delegate('#deleteOne', 'click', function () {
        var id = $(this).data("id");
        $("#functionId").val(id);
        $("#deleteOneModal").modal('show');
    });
    $(document).delegate('#updateOne', 'click', function () {
        var id_html = '<input type="hidden" id="id" name="id">';
        $(".appendId").empty();
        $(".appendId").append(id_html);
        var id = $(this).data("id");
        $.ajax({
            url: $.coreApiPath + "/function/" + id + "/findById",
            async: true,
            type: "post",
            dataType: "json",
            cache: false, // 不允许缓存
            success: function (r) {
                $("#id").val(r.id);
                $("#code").val(r.code);
                $("#functionLevel").val(r.functionLevel);
                $("#functionModule").val(r.functionModule);
                $("#functionName").val(r.functionName);
                getDictionaryCode({
                    id: "functionType",
                    type: 18,
                    defaultVlaue: r.functionType,
                    all: false,
                    complete: function () {
                    }
                });
                $("#functionUrl").val(r.functionUrl);
                if (r.functionUrl) {
                    $("#functionUrl").removeAttr("disabled");
                }
                $("#orderNo").val(r.orderNo);
                if (r.parentId != null) {
                    $.ajax({
                        url: $.coreApiPath + "/function/" + r.parentId + "/findById",
                        async: true,
                        type: "post",
                        dataType: "json",
                        cache: false, // 不允许缓存
                        success: function (rP) {
                            $("#parentName").val(rP.functionName);
                            $("#parentId").val(rP.id);
                        }
                    });
                }
                $("#saveBtn").removeAttr("onclick");
                $("#saveBtn").attr("onclick", "saveOrUpdateFun('update')");
            }
        });
        $('#myModal').modal('show');
        $("#myModalLabel").text("功能管理 / 修改功能");
    });
    /**
     * 关系按钮
     */
    $(document).delegate('#relationBtn', 'click', function () {
        funIDForGroupTree = $(this).data("id");
        funUserRoleRelation(funIDForGroupTree);

    });
    /**
     * 点击确认删除按钮
     */
    $(document).delegate('#delSubmit', 'click', function () {
        var id = $("#functionId").val();
        $('#deleteOneModal').modal('hide');
        $.ajax({
            url: $.backendApiPath + "/function/delete/" + id,
            async: true,
            type: "post",
            dataType: "json",
            cache: false, // 不允许缓存
            success: function (r) {
                if (r.result) {
                    layer.msg(r.info);
                    dataReload();
                } else {
                    layer.msg(r.info);
                    return false;
                }
            },
            error: function (data) {
                layer.msg("请求异常");
            }
        });
    });
    //批量删除
    $(document).delegate('#deleteAll', 'click', function () {

        var rows = table.rows('.selected');

        var count = rows.count();
        if (count <= 0) {
            layer.msg('请选择要删除的模块');
            return false;
        }
        var theArray = [];

        rows.every(function () {
            theArray.push(this.data().id);
        });
        if (theArray.length < 1) {
            layer.msg("请至少选择一个");
        } else {
            layer.msg('要删除这些功能吗', {
                time: 0 //不自动关闭
                ,
                btn: ['删除', '取消'],
                yes: function (index) {
                    $.ajax({
                        url: $.backendApiPath + "/function/delete/" + theArray.join(","),
                        async: true,
                        type: "post",
                        dataType: "json",
                        cache: false, // 不允许缓存
                        success: function (r) {
                            if (r.result) {
                                layer.msg(r.info);
                            } else {
                                layer.msg(r.info);
                            }
                            dataReload();
                            layer.close(index);
                        },
                        error: function (data) {
                            layer.msg("请求异常");
                        }
                    });
                }
            });

        }
    });

    /**
     * 多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
     */
    $('#tab tbody').on('click', 'tr', function (event) {
        var allChecked = $('input[name=allChecked]')[0]; // 关联全选单选框
        $($(this).children()[0]).children().each(function () {
            if (this.type == "checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox", this).trigger("click"))) {
                if (!this.checked) {
                    this.checked = true;
                    addValue(this);
                    var selected = table.rows('.selected').data().length; // 被选中的行数
                    // 全选单选框的状态处理
                    var recordsDisplay = table.page.info().recordsDisplay; // 搜索条件过滤后的总行数
                    var iDisplayStart = table.page.info().start; // 起始行数
                    if (selected === table.page.len() || selected === recordsDisplay || selected === (recordsDisplay - iDisplayStart)) {
                        allChecked.checked = true;
                    }
                } else {
                    this.checked = false;
                    cancelValue(this);
                    allChecked.checked = false;
                }
            }
        });
        $(this).toggleClass('selected'); // 放在最后处理，以便给checkbox做检测
    });

    /**
     * 全选按钮被点击事件
     */
    $('input[name=allChecked]').click(function () {
        if (this.checked) {
            $('#tab tbody tr').each(function () {
                if (!$(this).hasClass('selected')) {
                    $(this).click();
                }
            });
        } else {
            $('#tab tbody tr').click();
        }
    });
}

/**
 * 单选框被选中时将它的value放入隐藏域
 */
function addValue(para) {
    var userIds = $("input[name=userIds]");
    if (userIds.val() === "") {
        userIds.val($(para).val());
    } else {
        userIds.val(userIds.val() + "," + $(para).val());
    }
}

/**
 * 单选框取消选中时将它的value移除隐藏域
 */
function cancelValue(para) {
    // 取消选中checkbox要做的操作
    var userIds = $("input[name=allChecked]");
    var array = userIds.val().split(",");
    userIds.val("");
    for (var i = 0; i < array.length; i++) {
        if (array[i] === $(para).val()) {
            continue;
        }
        if (userIds.val() === "") {
            userIds.val(array[i]);
        } else {
            userIds.val(userIds.val() + "," + array[i]);
        }
    }
}

/**
 * 清空表单
 */
function clean_from() {
    $(".appendId").empty();
    $('#sysFunAddFrom').cleanForm("sysFunAddFrom");
    $("#parentName").val("作为根功能");
    $("#parentId").val("-1");
}

/**
 * 数据重载
 */
function dataReload() {
    parentId = null;
    table.ajax.reload();
    getTree(null);
}

function loadData() {
    getTree(null);
    getList();
    initEvent();
    formatFunType(1);
    $("#functionType").change(function () {
        var functionType = $("#functionType").val();
        if (functionType == '2' || functionType == '4') {
            //启用地址输入框
            $("#functionUrl").removeAttr("disabled");
        } else {
            //禁用地址输入框
            $("#functionUrl").val();
            $("#functionUrl").attr("disabled", "disabled");

        }
    });
}

/**
 * 检验code
 * @param t
 */
function validateCode(t) {
    var obj = $(t).val();

    var reg = /[\u4e00-\u9fa5]/g;
    if (reg.test(obj)) {
        layer.msg("有中文字符");
        $(t).val(null);
        return false;
    }
    var temp = $(t).val();
    if (temp.toUpperCase().indexOf("ROLE_FUN_") < 0) {
        layer.msg("需要以    ROLE_FUN_  为前缀");
        return false;
    }

    var url = $.coreApiPath + "/function/getCountByCode";
    var postData = {};
    postData.ignoreId = $("#id").val();
    postData.code = obj;
    $.post(url, postData, function (r) {
        if (Number(r.count) > 0) {
            layer.msg("存在相同的code");
            $(t).val(null);
            return false;
        }
    });
}

/**
 * 功能组织管理 角色 人员 组
 * @param funID
 */
function funUserRoleRelation(funID) {
    $("#roleUl").empty();
    $("#userUl").empty();
    $("#treeForGroup").empty();
    var url = $.coreApiPath + "/function/getFunRelation";
    $.post(url, {
        "funId": funID
    }, function (r) {
        var html = "";

        var roleData = r.roles;
        if (roleData != null) {
            html = "";
            for (var i = 0; i < roleData.length; i++) {
                html += '<li class="warning-element">' + roleData[i].name + '</li>';
            }
            $("#roleUl").html(html);
        }

        var userData = r.users;
        if (userData != null) {
            html = "";
            for (var i = 0; i < userData.length; i++) {
                html += '<li class="warning-element">' + userData[i].userName + '</li>';
            }
            $("#userUl").html(html);
        }

        var groupData = r.groups;
        var settingForGroupTree = {
            view: {
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        $.fn.zTree.init($("#treeForGroup"), settingForGroupTree, groupData);
    });
}

/**
 * 搜索
 */
function searchFunData() {
    parentId = null;
    table.ajax.reload();
}

var funTypeData = null;

/**
 * 格式化功能类型
 * @param type
 * @returns
 */
function formatFunType(type) {
    if (funTypeData == null) {
        var url = $.coreApiPath + "/dictionary/dictionaryType";
        var param = {
            "type": 18
        };
        $.ajaxSettings.async = false;
        $.getJSON(url, param).success(function (data) {
            if (data != null && data.length > 0) {
                funTypeData = data;

            }
        });
    }
    for (var i = 0; i < funTypeData.length; i++) {
        if (funTypeData[i].code == type) {
            return funTypeData[i].name;
        }
    }

}