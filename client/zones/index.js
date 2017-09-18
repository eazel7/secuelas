require('angular')
.module(
    (module.exports = 'cerovueltas.zones'),
    [   
        require('angular-ui-router'),
        require('./detail')
    ]
)
.config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'zones',
            abstract: true,
            url: '/zones'
        })
    }
);