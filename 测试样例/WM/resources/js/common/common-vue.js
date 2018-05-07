var vm = new Vue({
    el: '#content',
    data: {
        isShow: false,
        allFunctions: {}
    }, mounted: function () {
        var _self = this;
        var url = $.coreApiPath + "/role/functionRole";
        ajax_get(url, {}, function (data) {
            if (data.erroCode == 2000) {
                _self.allFunctions = data.result;
            }
        });


    },
    methods: {

    }

});
