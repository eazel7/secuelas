require('angular')
.module(
    (module.exports = 'cerovueltas.warehouses'),
    [
        require('angular-ui-router'),
        require('./detail')
    ]
)
.config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'cerovueltas.warehouses',
                url: '/warehouses',
                abstract: true
            })
        }
    ]
);