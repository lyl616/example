<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="modal fade" id="pwdChgModal" tabindex="-1" role="dialog" aria-labelledby="pwdChgModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog .modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" onclick="closeChPwdModql()">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="doMainModalLabel">用户管理/密码修改</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" id="pwdChgForm" method="post">

                    <div class="form-group m-b-10">
                        <label for="oldpass" class="m-r-5 form-label text-right">原始密码</label>
                        <input type="password" class="form-control" name="oldpass" id="oldpass">
                    </div>
                    <div class="form-group m-b-10">
                        <label for="newpass" class="m-r-5 form-label text-right">新密码</label>
                        <input type="password" class="form-control" name="newpass" id="newpass">
                    </div>
                    <div class="form-group m-b-10">
                        <label for="newpassAgain" class="m-r-5 form-label text-right">确认新密码</label>
                        <input type="password" class="form-control" name="newpassAgain" id="newpassAgain">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <div class="form-group text-center">
                    <button type="button" class="btn btn-info" id="pwdChSubmit" onclick="updateUserPwd()">确认修改</button>
                    <button type="button" class="btn btn-white" id="pwdChClose" onclick="closeChPwdModql()">关闭</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    function changePwd() {
        document.getElementById('pwdChgForm').reset();
        var $modal = $('#pwdChgModal');
        // 测试 bootstrap 居中
        $modal.on('show.bs.modal', function () {
            var $this = $(this);
            var $modal_dialog = $this.find('.modal-dialog');
            // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
            $this.css('display', 'block');
            $modal_dialog.css({
                'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)
            });
        });
        $('#pwdChgModal').modal('show');
    }

    function updateUserPwd() {
        var oldpass = $("#oldpass").val();
        if (oldpass == null || oldpass == "") {
            layer.msg("认输入原始密码！");
            return false;
        }
        var newpass = $("#newpass").val();
        var newpassAgain = $("#newpassAgain").val();

        if (!validatePwd(newpass)) {
            return false;
        }
        if (newpass == null || newpass == "" || newpassAgain == null || newpassAgain == "") {
            layer.msg("新密码或者确认密码不能为空！");
            return false;
        } else {
            if (newpass != newpassAgain) {
                layer.msg("新密码与确认密码不一致，请确认！");
                return false;
            }
        }

        var postData = {
            oldpass: oldpass,
            newpass: newpass
        };


        var url = coreApiPath + '/sysuser/updatePersonalPwd';
        ajax_post_msg(url, postData, "修改", function (data) {
            if (data.erroCode == 2000) {
                layer.msg(data.result)
                $('#pwdChgModal').modal('hide');
                window.location.href = $.ctx + "/logout";
            } else if (data.erroCode == 3000) {
                layer.msg(data.erroMsg)
                return false;
            }
        });
    }

    /**
     * 关闭窗口
     */
    function closeChPwdModql() {
        $('#pwdChgModal').modal('hide');
        document.getElementById('pwdChgForm').reset();
    }
</script>