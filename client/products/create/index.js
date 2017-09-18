require('angular')
    .module(
    (module.exports = 'cerovueltas.products.create'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-messages'),
        require('../../api')
    ]
    )
    .config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                resolve: {
                    product: function (shops) {
                        return {
                            name: '',
                            description: '',
                            shop: shops[0] ? shops[0]._id : null
                        };
                    },
                    shops: function (API) {
                        return API.shops.list();
                    }
                },
                name: 'products.create',
                url: '/create',
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controllerAs: 'ctrl',
                        controller: function (product, shops) {
                            this.product = product;
                            this.shops = shops;
                        }
                    },
                    'top-toolbar@': {
                        template: require('raw-loader!./top-toolbar.html'),
                        controllerAs: 'ctrl',
                        controller: function (product, shops, API, $state) {
                            var ctrl = this;

                            this.canConfirm = () => {
                                return product && product.name && product.description && product.shop;
                            };

                            this.confirm = function () {
                                if (!ctrl.canConfirm()) return;

                                API
                                .products
                                .create(
                                    product.name,
                                    product.description,
                                    product.shop
                                )
                                .then(function () {
                                    $state.go('^.list');
                                });
                            };
                        }
                    }
                }
            })
        }
    ]
    );