require('./style.scss');

const angular = require('angular');

angular
    .module(
    (module.exports = 'cerovueltas'),
    [
        require('./left-sidenav'),
        require('./addresses-sidenav-view'),
        require('./right-sidenav'),
        require('./home'),
        require('./login'),
        require('./products'),
        require('./shops'),
        require('./zones'),
        require('./warehouses'),
        require('angular-ui-router')
    ]
    )
    .config(
        ($stateProvider, $urlRouterProvider, AddressesLeftSidenavViewTemplate) => {
            $urlRouterProvider.when('', '/');

            $stateProvider.state({
                name: 'cerovueltas',
                abstract: true,
                resolve: {
                    addresses: (API) => {
                        return API.addresses.list();
                    }
                },
                views: {
                    'left-sidenav@': {
                        template: AddressesLeftSidenavViewTemplate,
                        controllerAs: 'ctrl',
                        controller: 'AddressesLeftSidenavVieController'
                    }
                }
            });
        }
    );
    
var doc = angular
    .element(document);

doc
    .ready(function () {
        angular
            .bootstrap(document, ['cerovueltas']);
    });