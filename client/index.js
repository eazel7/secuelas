require('./style.scss');

const angular = require('angular');

angular
    .module(
    (module.exports = 'cerovueltas'),
    [
        require('./left-sidenav'),
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
        ($stateProvider, $urlRouterProvider) => {
            $urlRouterProvider.when('', '/');

            $stateProvider.state({
                name: 'cerovueltas',
                abstract: true
            })
        }
    );
    
var doc = angular
    .element(document);

doc
    .ready(function () {
        angular
            .bootstrap(document, ['cerovueltas']);
    });