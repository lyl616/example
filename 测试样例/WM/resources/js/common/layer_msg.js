function modelWindow(msg) { //公告窗，必须关闭才能继续其他操作
	layer.open({
		type: 1,
		title: false, //不显示标题栏
		closeBtn: false,
		area: '300px;',
		shade: 0.8,
		id: 'LAY_layuipro', //设定一个id，防止重复弹出			
		resize: false,
		btn: ['知道了'],
		btnAlign: 'c',
		moveType: 1, //拖拽模式，0或者1			
		content: '<div style="padding: 50px; line-height: 22px; text-align: center; background-color: #fff; color: #000; font-weight: 300;">' + msg + '</div>',
		success: function(layero) {}
	});
}

function alphaWindow(msg) { //10秒自动关闭
	layer.msg(msg, {
		time: 10000, //10s后自动关闭
		btn: ['确定'],
		btnAlign: 'c'
	});
}

function centerWindow(msg) { //居中弹窗
	layer.open({
		type: 1,
		offset: 't', //具体配置参考：offset参数项			
		content: '<div style="padding: 20px 80px;">' + msg + '</div>',
		btn: '确定',
		btnAlign: 'c', //按钮居中			
		shade: 0, //不显示遮罩			
		yes: function() {
			layer.closeAll();
		}
	});
}

function loadingWindow() {
	layer.msg('加载中', {
		icon: 16,
		time: 0,
		shade: 0.01
	});
}
function closeAllLayer(){
	layer.closeAll();
}
