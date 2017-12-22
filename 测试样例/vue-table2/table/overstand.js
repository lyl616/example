

var  E_SERVER_ERROR = 'Error communicating with the server'


var
    tableColumns = [
        {
            name: '__checkbox:id',
            width: '30px',
            title: 'checkbox'
        },
        {
            name: '__sequence',
            title: '序号',
            titleClass: 'right aligned',
            dataClass: 'right aligned',
            width: '50px'
        },
        {
            name: 'stationId',
            title: '监测点编号',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'stationName',
            title: '监测点名称',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'projectId',
            title: '所属项目',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'equipmentId',
            title: '监测点管理（新）',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'proName',
            title: '省市区',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'sTechType',
            title: '监测点种类',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'stationType',
            title: '监测点类型',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'status',
            title: '监测点状态',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        }, {
            name: 'lngReal',
            title: '经度',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        },
        {
            name: 'latReal',
            title: '纬度',
            titleClass: 'right aligned',
            dataClass: 'right aligned'
        }
    ]





Vue.use(Vuetable);
/* eslint-disable no-new */
var  vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {},
        fields: tableColumns,
        tableHeight: '400px',
        vuetableFields: false,
        sortOrder: [{
            field: 'id',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)',
    },
    watch: {
        'perPage':function (val, oldVal) {
            this.$nextTick(function() {
                this.$refs.vuetable.refresh()
            })
        },
        'paginationComponent':function (val, oldVal) {
            this.$nextTick(function() {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        }
    },
    methods: {
        transform:function   (response) {
            var  transformed = {}
            var page=response.pagination;
            transformed.pagination = {
                total: page.total,
                per_page: page.per_page,
                current_page: page.current_page,
                last_page: page.last_page,
                next_page_url: page.next_page_url,
                prev_page_url: page.prev_page_url,
                from: page.from,
                to: page.to
            }

            transformed.data = []
            response = response.data
            for (var  i = 0; i < response.length; i++) {
                transformed['data'].push({
                        id: response[i].id,
                        stationId: response[i].stationId,
                        stationName: response[i].stationName,
                        projectId: response[i].projectId,
                        pro: response[i].pro,
                        city: response[i].city,
                        district: response[i].district,
                        proName: response[i].proName + "/" + response[i].cityName + "/" + response[i].districtName,
                        sTechType: response[i].sTechType,
                        stationType: response[i].stationType,
                        status: response[i].status,
                        latReal: response[i].latReal,
                        lngReal: response[i].lngReal

                })
            }

            return transformed
        },
        showLoader :function() {
            this.loading = 'loading'm
        },
        hideLoader :function() {
            this.loading = ''
        },

        onLoadSuccess :function(response) {
            // set pagination data to pagination-info component
            this.$refs.paginationInfo.setPaginationData(response.data)
            console.log(response.data)


        },
        onLoadError :function(response) {
            if (response.status == 400) {
                sweetAlert('Something\'s Wrong!', response.data.message, 'error')
            } else {
                sweetAlert('Oops', E_SERVER_ERROR, 'error')
            }
        },
        onPaginationData :function(tablePagination) {

            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },onChangePage (page) {
            this.$refs.vuetable.changePage(page)
        }
    },
})
