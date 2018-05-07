new Vue({
	el: "#content",
	data: {
		count: 0,
		newlist: {
			urlVal: '',
			startTime: '',
			endTime: ''
		},
		list: [{
				urlVal: 'http://58.83.189.152:8085/sortaqi/aggrSortManul/hour',
				startTime: '',
				endTime: ''
			},
			{
				urlVal: 'http://58.83.189.152:8085/sortaqi/aggrSortManul/day',
				startTime: '',
				endTime: ''
			},
			{
				urlVal: 'http://58.83.189.152:8085/sortaqi/aggrSortManul/month',
				startTime: '',
				endTime: ''
			},
			{
				urlVal: 'http://58.83.189.152:8085/sortaqi/aggrSortManul/year',
				startTime: '',
				endTime: ''
			}
		]
	},
	methods: {
		nowReissue: function(index) {
			var curobj = this.list[index];
			var reqUrl = curobj.urlVal + "/" + curobj.startTime + "/" + curobj.endTime;
			console.info(reqUrl);
			$.get(reqUrl, function(data) {
				console.log(data);
			})
		},
		createReissue: function() {
			this.list.push(this.newlist);
            //重新创建一个新的插入变量。此处不可少
			this.newlist = {
				urlVal: '',
				startTime: '',
				endTime: ''
			}
		}
	}
});
