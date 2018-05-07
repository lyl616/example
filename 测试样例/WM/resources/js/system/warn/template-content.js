$(function() {
	putTemplate();
});

function putTemplate() {
	$(".cus_template").click(function() {
		var hasChk = $(this).is(':checked');
		if(hasChk) {
			var t = $("#messageContent").text() + "[" + $(this).attr("value") + "]";
			$("#messageContent").text(t);
		}
	});
}