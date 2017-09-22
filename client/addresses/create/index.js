require('angular')
    .module(
    (module.exports = 'cerovueltas.addresses.create'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../search-address')
    ]
    )
    .config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'cerovueltas.addresses.create',
            url: '/create',
            resolve: {
                features: () => []
            },
            views: {
                '@': {
                    template: require('raw-loader!./template.html'),
                    controllerAs: 'ctrl',
                    controloler: function CreateAddressRightSidenavController(features) {
                        this.selectAddress = function (address) {
                            features.splice(0, features.length, address.geo);
                        };
                    }
                },
                'right-sidenav@': {
                    template: require('raw-loader!./right-sidenav.html'),
                    controllerAs: 'ctrl',
                    controloler: function CreateAddressRightViewController(features) {
                        this.features = features;
                    }
                }
            },
            resolve: {
                openRightSidenav: (RightSidenavService) => {
                    RightSidenavService.open().then(() => RightSidenavService.lock());
                }
            },
            onEnter: (openRightSidenav) => { }
        })
    }
    )