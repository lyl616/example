 new Vue({
		el: "#dataCorrect",
		data: {
			list: [{
				checked: false,
				value: 'PM10'				
			}, {
				checked: false,
				value: 'PM25'				
			}],
			updataV:1,
			checkedNames: []
		},
		methods: {
			getChecked: function(event) {
				var val = event.currentTarget.value; //获取当前对象的value
				this.list.filter(function(list2) { //遍历获对应的值
					if(list2.value == val) {
						list2.checked = !list2.checked;
					}
				});
			},
			searchVal:function(){
				var pm10DataClose=false,pm25DataClose=false;
				this.list.filter(function(list2) {
					switch(list2.value) {
						case "PM10":{ pm10DataClose = list2.checked;} break;
						case "PM25":{ pm25DataClose = list2.checked;} break;
					}
				});
				return {pm10DataClose:pm10DataClose,pm25DataClose:pm25DataClose};
			},
			upData:function(){
				var url = restfulBaseURL+"/synEngine/reloadUpdate";		       
				var param = {
					"pm25Update": false,
					"pm10Update": false,
					"pm25Value": this.updataV,
					"pm10Value": this.updataV
				};
				var getParm_1=this.searchVal();	
				param.pm25Update=getParm_1.pm25DataClose;
				param.pm10Update=getParm_1.pm10DataClose;
				var jsonData = JSON.stringify(param);
				$.ajax({
					type: "POST",
					url: url,
					contentType: 'application/json',
					// dataType : 'json',  
					data: jsonData,					
					error: function(request) {
						layer.msg('调整失败');
					},
					success: function(data) {
						layer.msg('调整成功');
					}
				});
			},
			closeData: function() {
				var param = {
					"pm25DataClose": false,
					"pm10DataClose": false
				};
				var getParm_1=this.searchVal();				
				param.pm25DataClose=getParm_1.pm25DataClose;
				param.pm10DataClose=getParm_1.pm10DataClose;				
				var url  = restfulBaseURL+"synEngine/reloadClose";		        
				$.ajax({
					type: "POST",
					url: url,
					data: param,
					error: function(request) {
						layer.msg('调整失败');
					},
					success: function(data) {
						layer.msg('调整成功');
					}
				});

			}
		}
	});

	