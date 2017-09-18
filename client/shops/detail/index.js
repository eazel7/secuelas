require('angular')
    .module(
    (module.exports = 'cerovueltas.shops.detail'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('./zones'),
        require('../../api'),
        require('../../warehouses/list-directive'),
        require('../../products/list-directive'),
        require('../../zones/list-directive')
    ]
    )
    .config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'shops.detail',
                url: '/detail/:shop',
                resolve: {
                    shop: (API, $stateParams) => {
                        return API.shops.getById($stateParams.shop);
                    },
                    products: (API, shop) => {
                        return API.products.listByShop(shop._id);
                    },
                    warehouses: (API, shop) => {
                        return API.warehouses.listByShop(shop._id);
                    },
                    zones: (API, shop) => {
                        return API.zones.listByShop(shop._id);
                    }
                },
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controllerAs: 'ctrl',
                        controller: function (shop, products, warehouses, zones) {
                            this.shop = shop;
                            this.products = products;
                            this.warehouses = warehouses;
                            this.zones = zones;
                        }
                    },
                    'top-toolbar@': {
                        template: require('raw-loader!./top-toolbar.html'),
                        controllerAs: 'ctrl',
                        controller: function ShopDetailTopToolbarController (shop, API, $state) {
                            this.remove = () => {
                                API.shops.remove(shop._id)
                                .then(() => $state.go('shops.list', {}, {reload: true}));
                            };
                        }
                    }
                }
            })
        }
    ]
    )