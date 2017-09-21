require('angular')
    .module(
    (module.exports = 'cerovueltas.products.list'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-messages'),
        require('../../left-sidenav')
    ]
    )
    .run(
    [
        'LeftSidenavLinks',
        function (LeftSidenavLinks) {
            LeftSidenavLinks.push({
                name: 'Productos',
                stateName: 'cerovueltas.products.list',
                first: true
            });
        }
    ]
    )
    .config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'cerovueltas.products.list',
                url: '/',
                resolve: {
                    filter: (shops) => {
                        return {
                            shop: shops.length ? shops[0]._id : null
                        };
                    },
                    shops: (API) => {
                        return API.shops.list();
                    }
                },
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controllerAs: 'ctrl',
                        controller: function ShopsListViewController (API, filter, $scope) {
                            this.products = [];

                            $scope.$watch(() => filter, (filter) => {
                                API.products.listByShop(filter.shop)
                                    .then((products) => {
                                        this.products = products;
                                    });
                            });
                        }
                    },
                    'top-toolbar@': {
                        template: require('raw-loader!./top-toolbar.html'),
                        controllerAs: 'ctrl',
                        controller: function ShopsListTopToolbarController (shops, filter) {
                            this.shops = shops;
                            this.filter = filter;
                        }
                    }
                }
            })
        }
    ]
    );