<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../../includeVue.jsp" %>
<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 用户添加</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <link rel="stylesheet" href="${ctx}/resources/plugins/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
    <link rel="stylesheet" href="${ctx}/resources/plugins/transfer-item/transfer.css" type="text/css">
    <script type="text/javascript" src="${ctx}/resources/plugins/ztree/js/jquery.ztree.all.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/jquery-validation/jquery.validate.min.js"></script>
    <script>
        var uid = "${requestScope.id}";
    </script>

</head>

<body class="ovh">
<%@ include file="../../V1/topMenu.jsp" %>
<div class="f-s-12 ovh pd10 table-scroll" id="app">
    <div class="panel-body">
        <div class="panel-group" id="accordion">
            <div class="panel panel-default">
                <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" href="#baseinfo">
                    <div class="panel-title">
                        <a>基本信息</a>
                    </div>
                </div>
                <div id="baseinfo" class="panel-collapse collapse in">
                    <div class="panel-body">
                        <div class="col-sm-4 m-t-5">
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>登录名</label>
                                    <input type="text" placeholder="请输入登录名" id="userName" class="form-control w200"
                                           v-model="user.userName">
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="userNameError"></span>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>手机号</label>
                                    <input type="text" placeholder="请输入手机号" class="form-control w200"
                                           v-model="user.mobileno">
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="mobilenoError"></span>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right">工作地址</label>
                                    <input type="text" placeholder="请输入工作地址" class="form-control w200"
                                           v-model="user.workAddress">
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="workAddressError"></span>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10 post-rel">
                                    <label class="m-r-5 form-label text-right">系统管理权限</label>
                                    <!--下拉树开始-->
                                    <div class="select-tree w200">
                                        <input id="orgIdList" class="form-control w200" v-model="user.allOrgName"
                                               type="text" value=""/>
                                        <div class="btn-group">
                                            <div class="dropdown-toggle pull-right p-r-10">
                                                <span class="caret" id="orgIdListTree"
                                                      @click="initDownTree('3','orgIdList');"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--下拉树结束-->
                                    <div class="layertip dib" id="tip1" @mouseout="hideTip"
                                         @mouseover="showTip('为需要进行系统配置管理（包括：组织、用户、项目）的用户，分配可管理的组织权限。如果需要管理某组织和该组织下属的子组织，请将两项都选中','tip1')">
                                        <!--tip标识-->
                                    </div>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right">备注</label>
                                    <textarea class="form-control w200" v-model="user.remark"></textarea>
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="remarkError"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 m-t-5">
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>姓名</label>
                                    <input type="text" placeholder="请输入姓名" class="form-control w200"
                                           v-model="user.fullName">
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="fullNameError"></span>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>邮箱</label>
                                    <input type="text" placeholder="请输入邮箱" class="form-control w200"
                                           v-model="user.workEmail">
                                </div>
                                <div class="has-error">
                                    <span class="help-block" v-html="workEmailError"></span>
                                </div>
                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10 post-rel">
                                    <label class="m-r-5 form-label text-right "><i class="gf00 fsn">*</i>所属组织</label>
                                    <!--下拉树开始-->
                                    <div class="select-tree w200">
                                        <input id="orgIdIPT" class="form-control w200" v-model="user.orgName"
                                               type="text" value=""/>
                                        <div class="btn-group">
                                            <div class="dropdown-toggle pull-right p-r-10">
                                                <span class="caret" id="orgIdTree"
                                                      @click="initDownTree('1','orgIdIPT');"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--下拉树结束-->
                                    <div class="has-error">
                                        <span class="help-block" v-html="orgError"></span>
                                    </div>

                                </div>

                            </div>
                            <div class="form-inline">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right">设备管理权限</label>
                                    <!--下拉树开始-->
                                    <div class="select-tree w200">
                                        <input id="projectIdListIPT" class="form-control w200"
                                               v-model="user.allProjectName" type="text" value=""/>
                                        <div class="btn-group">
                                            <div class="dropdown-toggle pull-right p-r-10">
                                                <span class="caret" id="projectIdListTree"
                                                      @click="initDownTree('4','projectIdListIPT');"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layertip dib" id="tip2" @mouseout="hideTip"
                                         @mouseover="showTip('为需要进行设备配置管理（包括：监测点、设备、传感器）的用户，分配可管理的项目权限。','tip2')">
                                        <!--tip标识-->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 m-t-5">
                            <div class="form-inline m-t-5">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>性别</label>
                                    <input type="radio" class="form-control" name="fgsex" v-model="user.gender"
                                           value="1"/><span class="m-r-20">男</span>
                                    <input type="radio" class="form-control" name="fgsex" v-model="user.gender"
                                           value="2"/><span class="m-r-20">女</span>
                                </div>
                            </div>
                            <div class="form-inline m-t-5">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>是否大屏用户</label>
                                    <input type="radio" class="form-control" name="fguser" v-model="user.isBigScreen"
                                           value="1"/><span class="m-r-20">PC</span>
                                    <input type="radio" class="form-control" name="fguser" v-model="user.isBigScreen"
                                           value="2"/><span class="m-r-20">大屏</span>
                                </div>
                            </div>
                            <div class="form-inline m-t-5">
                                <div class="form-group m-b-10">
                                    <label class="m-r-5 form-label text-right"><i class="gf00 fsn">*</i>角色</label>
                                    <div class="select-tree w200">
                                        <input id="roleIdListIPT" class="form-control w200" v-model="user.allRoleName"
                                               type="text" value=""/>
                                        <div class="btn-group">
                                            <div class="dropdown-toggle pull-right p-r-10">
                                                <span class="caret" id="roleIdListTree"
                                                      @click="initDownTree('2','roleIdListIPT');"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="has-error">
                                        <span class="help-block" v-html="roleError"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chunk-footer">
                        <div class="m-t-10 m-b-10 text-center">
                            <button class="btn btn-info m-r-10" @click="saveBase" id="saveBaseBtn">保存</button>
                            <button class="btn btn-white" @click="backToUsers">取消</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" data-toggle="collapse" data-parent="#accordion"
                     v-bind:href="collapseTwoHref">
                    <div class="panel-title">
                        <a v-if="user.userId != '' " id="sysDomainCollapse" @click="initSysDoMainTree">分配区域</a>
                        <span v-else>分配区域</span>
                        <div class="layertip dib" id="tip3" @mouseout="hideTip"
                             @mouseover="showTip('选择行政区时，某行政区与下级行政区是独立的，如果想查看某行政区和其下级行政区的区域时，需要将两个都勾选上。','tip3')">
                            <!--tip标识-->
                        </div>
                    </div>
                </div>
                <div id="collapseTwo" class="panel-collapse collapse">
                    <div class="panel-body ">
                        <div class="chunk-set m-t-10">
                            <div class="chunk-body ">
                                <div class="tab-content XhideYauto" style="height: 360px;">
                                    <!--分配区域树开始-->
                                    <div class="content_wrap">
                                        <div class="zTreeDemoBackground left">
                                            <ul id="domainTree" class="ztree"></ul>
                                        </div>
                                    </div>
                                    <!--分配区域树开始-->
                                </div>
                                <div class="form-control m-l-10 m-b-5">
                                    <label class="m-r-5">默认区域</label>
                                    <select class="form-control" v-model="user.domainId">
                                        <option value="">请选择</option>
                                        <option v-for="item in domainList" v-bind:value="item.id">{{item.domainName}}
                                        </option>
                                    </select>
                                    <div class="layertip dib" id="tip4" @mouseout="hideTip"
                                         @mouseover="showTip('在已选城市群或行政区中选择一个区域，作为登录平台后，实时监测页默认展示的区域。','tip4')">
                                        <!--tip标识-->
                                    </div>
                                </div>
                            </div>
                            <div class="chunk-footer">
                                <div class="m-t-10 m-b-10 text-center">
                                    <button class="btn btn-info m-r-10" @click="saveUserSysDoMain">保存</button>
                                    <button class="btn btn-white" @click="backToUsers">取消</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" data-toggle="collapse" data-parent="#accordion"
                     v-bind:href="collapseThreeHref">
                    <div class="panel-title">
                        <a v-if="user.userId != '' " onclick="" id="stationDomainCollapse">分配监测点</a>
                        <span v-else>分配监测点</span>
                        <div class="layertip dib" id="tip5" @mouseout="hideTip"
                             @mouseover="showTip('用户在查看监测数据时，可以查看哪些监测点的数据，通过选择项目实现对查看监测点的范围控制。','tip5')">
                            <!--tip标识-->
                        </div>
                    </div>
                </div>
                <div id="collapseThree" class="panel-collapse collapse">
                    <div class="panel-body">
                        <!--分配监测点开始-->
                        <div class="chunk-body">
                            <div class="XhideYauto">
                                <div class="ty-transfer">
                                    <div class="fl ty-transfer-list transfer-list-left">
                                        <div class="ty-transfer-list-head">
                                            <div class="ty-tree-text">
                                                <label class="tyue-checkbox-wrapper">
                                                    <input id="leftCheckAll" @click="clickLeftCheckAll" type="checkbox"
                                                           class="transfer-all-check">
                                                    <span class="tyue-checkbox-txt">{{ leftHeaderTitle }} 项目</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="ty-transfer-list-body">
                                            <ul class="ty-tree-select">
                                                <li v-for="(project, index) in leftProjectList">
                                                    <div class="ty-tree-div">
                                                        <label class="tyue-checkbox-wrapper">
                                                            <span class="tyue-checkbox">
                                                                <input v-bind:value="project.projectId"
                                                                       v-model="leftCheckedProjectIdList"
                                                                       type="checkbox" class="tyue-checkbox-input">
                                                            </span>
                                                            <span class="tyue-checkbox-txt">
                                                                {{ project.projectName }}[{{ project.stationSize }}]
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="fl ty-transfer-operation">
                                        <span v-bind:class="{ active: leftCheckedProjectIdList.length > 0, disabled: leftCheckedProjectIdList.length <= 0 }"
                                              @click="transferToRight"
                                              class="ty-transfer-btn-toright to-switch">
                                        </span>
                                        <span v-bind:class="{ active: rightCheckedProjectIdList.length > 0, disabled: rightCheckedProjectIdList.length <= 0 }"
                                              @click="transferToLeft"
                                              class="ty-transfer-btn-toleft to-switch">
                                        </span>
                                    </div>
                                    <div class="fl ty-transfer-list transfer-list-right">
                                        <div class="ty-transfer-list-head">
                                            <div class="ty-tree-text">
                                                <label class="tyue-checkbox-wrapper">
                                                    <input id="rightCheckAll" @click="clickRightCheckAll"
                                                           type="checkbox"
                                                           class="transfer-all-check">
                                                    <span class="tyue-checkbox-txt">{{ rightHeaderTitle }} 项目</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="ty-transfer-list-body">
                                            <ul class="ty-tree-select">
                                                <li v-for="(project, index) in rightProjectList">
                                                    <div class="ty-tree-div">
                                                        <label class="tyue-checkbox-wrapper">
                                                            <span class="tyue-checkbox">
                                                                <input v-bind:value="project.projectId"
                                                                       v-model="rightCheckedProjectIdList"
                                                                       type="checkbox" class="tyue-checkbox-input">
                                                            </span>
                                                            <span class="tyue-checkbox-txt">
                                                                {{ project.projectName }}[{{ project.stationSize }}]
                                                            </span>
                                                        </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="clear">
                                    </div>
                                </div>
                                <div class="chunk-footer">
                                    <div class="m-t-10 m-b-10 text-center">
                                        <button class="btn btn-info m-r-10" @click="saveUserStationProject">保存</button>
                                        <button class="btn btn-white" @click="backToUsers">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--分配监测点结束-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div style="width: 200px; height: 300px;">
    <div id="menuContent" class="dragTreeContent dn post-abs">
        <ul id="downDragtree" class="ztree" style="width:188px; height: 300px;"></ul>
    </div>
</div>
<script type="text/javascript" src="${ctx}/resources/js/system/sys/user_manager_add.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    $(window).resize(function() {
        calcOverflowH(1, "table-scroll", 40);
    });
});
calcOverflowH(1, "table-scroll", 40);
</script>
</body>
</html>