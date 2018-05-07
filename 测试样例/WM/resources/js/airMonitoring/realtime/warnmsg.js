function getWarnMsg(cityId){
	$.ajax({
		type:"get",
		url:$.coreApiPath+"/realtime/warnmsg/"+cityId+"/",
		success : function(datas){
			var html = '';
			$.each(datas,function(index,data){
				html += '<p class="tab-content-2">';
				html += '<a href="javascript:void(0)" style="color: #ff0000;" data-toggle="modal">['+data.levelName+']</a>';
				html += '<span style="color: #000000;">'+data.warningContent+'</span>';
				html += '</p>';
			});
			$("#ios").html(html);
		}
	});
}
