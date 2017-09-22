require('angular')
.module(
    (module.exports = 'cerovueltas.addresses'),
    [
        require('./sidenav-view'),
        require('./create')
    ]
)
.config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'cerovueltas.addresses',
            abstract: true,
            url: '/addresses'
        });
    }
);