require('angular')
    .module(
    (module.exports = 'cerovueltas.products.detail'),
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
                name: 'cerovueltas.products.detail',
                url: '/detail/:product',
                resolve: {
                    product: ($stateParams, API) => {
                        return API.products.getById($stateParams.product);
                    },
                    shop: (product, API) => {
                        return API.shops.getById(product.shop);
                    }
                },
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controllerAs: 'ctrl',
                        controller: function (product, shop) {
                            this.product = product;
                            this.shop = shop;
                        }
                    }
                }
            })
        }
    ]
    );