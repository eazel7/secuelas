require('./style.scss');

const angular = require('angular');

angular
    .module(
    (module.exports = 'secuelas'),
    [
        require('./left-sidenav'),
        require('./right-sidenav'),
        require('./home'),
        require('angular-ui-router')
    ]
    )
    .config(
        ($stateProvider, $urlRouterProvider) => {
            $urlRouterProvider.when('', '/');

            $stateProvider.state({
                name: 'secuelas',
                abstract: true,
                resolve: {
                },
                views: {
                }
            });
        }
    );
    
var doc = angular
    .element(document);

doc
    .ready(function () {
        angular
            .bootstrap(document, ['secuelas']);
    });