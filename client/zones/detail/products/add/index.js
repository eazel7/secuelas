require('angular')
    .module(
    (module.exports = 'cerovueltas.zones.detail.products.add'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../../../api'),
        require('../../../../products/list')
    ]
    )
    .config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'zones.detail.products.add',
            url: '/add',
            resolve: {
                products: (API, zone) => API.products.listByShop(zone.shop)
            },
            views: {
                'top-toolbar@': {
                    template: ''
                },
                'right-sidenav@': {
                    template: require('raw-loader!./right-sidenav.html'),
                    controllerAs: 'ctrl',
                    controller: function ($state, products, zone, API) {
                        this.products = products;

                        this.add = (product) => {
                            API.zones.addProduct(zone._id, product._id)
                            .then(() => $state.go('^', {}, {reload: true}));
                        };
                    }
                }
            }
        })
    }
    );