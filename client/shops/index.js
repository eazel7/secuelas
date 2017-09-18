const turf = require('turf');

require('angular')
    .module(
    (module.exports = 'cerovueltas.shops'),
    [
        require('angular-ui-router'),
        require('./list'),
        require('./create'),
        require('./detail')
    ]
    )
    .config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'shops',
                url: '/shops',
                abstract: true
            })
        }
    ]
    );