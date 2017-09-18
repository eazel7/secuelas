require('angular')
.module(
    (module.exports = 'cerovueltas.products'),
    [
        require('angular-ui-router'),
        require('./list'),
        require('./detail'),
        require('./create')
    ]
)
.config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'products',
                url: '/products',
                abstract: true
            })
        }
    ]
);