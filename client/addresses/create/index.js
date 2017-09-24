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
                openRightSidenav: (RightSidenavService) => {
                    RightSidenavService.open().then(() => RightSidenavService.lock());
                },
                features: () => [],
                searchResults: () => []
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
                    controloler: function CreateAddressRightViewController($scope, searchResults, features) {
                        this.features = features;
                        this.searchResults = searchResults;

                        $scope.$watch(() => searchResults, (searchResults) => {
                            for (var i = features.length - 1; i > 0; i--) {
                                if (features[i].searchResult) features.splice(i, 1);
                            }

                            searchResults.forEach(
                                (r) => {
                                    features.push(require('turf').point(r.geo));
                                }
                            );
                        }, true);
                    }
                }
            },
            onEnter: (openRightSidenav) => { }
        })
    }
    )