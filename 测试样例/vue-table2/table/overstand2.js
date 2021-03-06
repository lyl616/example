/**
 * Created by yulongliu on 2017/12/3.
 */
var report = "";
$(function () {



    //当前所选城市
    var currentCityId = 3700800;

    var tableColumns = [{
        name: '__sequence',
        title: '序号',
        titleClass: 'text-center'
    }, {
        name: 'stationName',
        title: '站点名称',
        titleClass: 'text-center'
    }, {
        name: 'stationId',
        title: '站点编号',
        titleClass: 'text-center'
    }, {
        name: 'num',
        title: '超标次数',
        titleClass: 'text-center'
    }, {
        name: 'lastTime',
        title: '最后超标时间',
        titleClass: 'text-center',
        dataClass: 'text-center',
        callback: "formatDate"
    }];


    Vue.use(Vuetable);
    /* eslint-disable no-new */
    var vm = new Vue({
        el: '#app',
        components: {},
        data: {
            loading: '',
            searchFor: '',
            moreParams: {

            },
            fields: tableColumns,
            tableHeight: '600px',
            vuetableFields: false,
            sortOrder: [{
                field: 'stationId',
                direction: 'asc',
            }],
            multiSort: true,
            paginationComponent: 'vuetable-pagination',
            perPage: 10,
            paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)',

        },
        watch: {
            'perPage': function (val, oldVal) {
                this.$nextTick(function () {
                    this.$refs.vuetable.refresh()
                })
            },
            'paginationComponent': function (val, oldVal) {
                this.$nextTick(function () {
                    this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
                })
            }
        },
        methods: {
            transform: function (data) {
                var transformed = {}
                transformed.pagination = {
                    total: data.total,
                    per_page: data.per_page,
                    current_page: data.current_page,
                    last_page: data.last_page,
                    next_page_url: data.next_page_url,
                    prev_page_url: data.prev_page_url,
                    from: data.from,
                    to: data.to
                }

                transformed.data = []
                data = data.data
                for (var i = 0; i < data.length; i++) {
                    transformed['data'].push({
                        id: data[i].id,
                        name: data[i].name,
                        nickname: data[i].nickname,
                        email: data[i].email,
                        age: data[i].age,
                        birthdate: data[i].birthdate,
                        gender: data[i].gender,
                        address: data[i].address.line1 + ' ' + data[i].address.line2 + ' ' + data[i].address.zipcode
                    })
                }

                return transformed
            },
            showSettingsModal: function () {
                var self = this
                $('#settingsModal').modal({
                    detachable: true,
                    onVisible: function () {
                        $('.ui.checkbox').checkbox()
                    }
                }).modal('show')
            },
            showLoader: function () {
                this.loading = 'loading'
            },
            hideLoader: function () {
                this.loading = ''
            },
            allCap: function (value) {
                return value.toUpperCase()
            },
            formatDate: function (value, fmt) {
                if (value === null) return ''
                fmt = (typeof(fmt) === 'undefined') ? 'D MMM YYYY' : fmt
                return moment(value, 'YYYY-MM-DD').format(fmt)
            },
            gender: function (value) {
                return value === 'M'
                    ? '<span class="ui teal label"><i class="male icon"></i>Male</span>'
                    : '<span class="ui pink label"><i class="female icon"></i>Female</span>'
            },
            showDetailRow: function (value) {
                var icon = this.$refs.vuetable.isVisibleDetailRow(value) ? 'down' : 'right'
                return [
                    '<a class="show-detail-row">',
                    '<i class="chevron circle ' + icon + ' icon"></i>',
                    '</a>'
                ].join('')
            },
            setFilter: function () {
                this.moreParams = {
                    'filter': this.searchFor
                }
                this.$nextTick(function () {
                    this.$refs.vuetable.refresh()
                })
            },
            resetFilter: function () {
                this.searchFor = ''
                this.setFilter()
            },
            preg_quote: function (str) {

                return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
            },
            highlight: function (needle, haystack) {
                return haystack.replace(
                    new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
                    '<span class="highlight">$1</span>'
                )
            },
            rowClassCB: function (data, index) {
                return (index % 2) === 0 ? 'odd' : 'even'
            },
            onCellClicked: function (data, field, event) {
                console.log('cellClicked', field.name)
                if (field.name !== '__actions') {
                    this.$refs.vuetable.toggleDetailRow(data.id)
                }
            },
            onCellDoubleClicked: function (data, field, event) {
                console.log('cellDoubleClicked:', field.name)
            },
            onLoadSuccess: function (response) {
                // set pagination data to pagination-info component
                this.$refs.paginationInfo.setPaginationData(response.data)

                var data = response.data.data
                if (this.searchFor !== '') {
                    for (var n in data) {
                        data[n].name = this.highlight(this.searchFor, data[n].name)
                        data[n].email = this.highlight(this.searchFor, data[n].email)
                    }
                }
            },
            onLoadError: function (response) {
                if (response.status == 400) {
                    sweetAlert('Something\'s Wrong!', response.data.message, 'error')
                } else {
                    sweetAlert('Oops', E_SERVER_ERROR, 'error')
                }
            },
            onPaginationData: function (tablePagination) {
                this.$refs.paginationInfo.setPaginationData(tablePagination)
                this.$refs.pagination.setPaginationData(tablePagination)
            },
            onChangePage: function (page) {
                this.$refs.vuetable.changePage(page)
            },
            onInitialized: function (fields) {
                // console.log('onInitialized', fields)
                this.vuetableFields = fields
            },
            onDataReset: function () {
                console.log('onDataReset')
                this.$refs.paginationInfo.resetData()
                this.$refs.pagination.resetData()
            }
        }
    })
});