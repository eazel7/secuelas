require('angular')
    .module(
    (module.exports = 'cerovueltas.shops.create'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../../api'),
        require('../../map'),
        require('../../right-sidenav')
    ]
    )
    .config(
    [
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider.state({
                name: 'shops.create',
                url: '/create',
                resolve: {
                    mapCenter: function () {
                        return {
                            lat: -34.63772760271713,
                            lng: -58.45138549804693,
                            zoom: 11
                        };
                    },
                    warehouses: () => {
                        return [];
                    },
                    openSidenav: function (RightSidenavService) {
                        return RightSidenavService.open()
                            .then(function () {
                                return RightSidenavService.lock();
                            })
                    }
                },
                onEnter: function (openSidenav) {
                },
                onExit: function (RightSidenavService) {
                    return RightSidenavService.close()
                        .then(function () {
                            return RightSidenavService.unlock();
                        })
                },
                views: {
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controller: function (mapCenter, warehouses, $state) {
                            this.center = mapCenter;
                            this.warehouses = warehouses;
                        },
                        controllerAs: 'ctrl'
                    },
                    'right-sidenav@': {
                        template: require('raw-loader!./right-sidenav.html'),
                        controllerAs: 'ctrl',
                        controller:
                        function ($scope, API, $state, warehouses, mapCenter) {
                            var ctrl = this;

                            ctrl.confirm = function () {
                                API
                                    .shops
                                    .create(
                                    ctrl.shop.name,
                                    ctrl.shop.address,
                                    ctrl.shop.location
                                    )
                                    .then(() => $state.go('shops.list', {}, { reload: true }));
                            }

                            ctrl.shop = {
                                name: '',
                                address: ''
                            };

                            $scope.$watch(function () {
                                return ctrl.shop.address;
                            }, function (address) {
                                API.addresses.search(address).then(function (results) {
                                    results.forEach(function (result) {
                                        warehouses[0] = {
                                            temp: true,
                                            lat: Number(result.location.latitude),
                                            lon: Number(result.location.longitude),
                                            _id: 't' + Math.floor(Math.random() * 1000),
                                            icon: {
                                                iconUrl: require('../shop.png'),
                                                iconSize: [48, 48],
                                                iconAnchor: [23, 47],
                                                popupAnchor: [0, -36]
                                            }
                                        };

                                        ctrl.shop.location = require('turf').point([
                                            Number(result.location.longitude),
                                            Number(result.location.latitude)
                                        ]).geometry;

                                        mapCenter.zoom = 15;
                                        mapCenter.lat = Number(result.location.latitude);
                                        mapCenter.lng = Number(result.location.longitude);
                                    });
                                }, function (err) {
                                    delete ctrl.shop.location;

                                    warehouses.splice(0, warehouses.length);
                                })
                            });
                        }
                    },
                }
            });
        }
    ]
    );