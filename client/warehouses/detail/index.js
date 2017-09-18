require('angular')
.module(
    (module.exports = 'cerovueltas.warehouses.detail'),
    [
        require('angular-ui-router'),
        require('angular-material')
    ]
)
.config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'warehouses.detail',
                url: '/detail/:warehouse',
                resolve: {
                    warehouse: function (API, $stateParams) {
                        return API.warehouses.get($stateParams.warehouse);
                    },
                    shop: function (API, warehouse) {
                        return API.shops.getById(warehouse.shop);
                    }
                },
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controller: function (warehouse, shop) {
                            this.warehouse = warehouse;
                            this.shop = shop;
                        },
                        controllerAs: 'ctrl'
                    }
                }
            })
        }
    ]
);