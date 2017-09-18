require('angular')
    .module(
    (module.exports = 'cerovueltas.shops.detail.zones.create'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../../../../api'),
        require('../../../../right-sidenav')
    ]
    )
    .config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'shops.detail.zones.create',
            url: '/create',
            resolve: {
                zone: () => {
                    return {};
                },
                openSidenav: (RightSidenavService) => {
                    return RightSidenavService.open().then(() => {
                        return RightSidenavService.lock();
                    });
                }
            },
            onEnter: (openSidenav) => {},
            onExit: (RightSidenavService) => {
                RightSidenavService.unlock().then(() => RightSidenavService.close());
            },
            views: {
                'right-sidenav@': {
                    template: require('raw-loader!./right-sidenav.html'),
                    controllerAs: 'ctrl',
                    controller: function CreateZoneRightSidenavController(API, $state, shop, zone, $scope) {
                        this.area = 0;
                        this.zone = zone;

                        this.canConfirm = () => {
                            return this.zone.name && this.zone.geo && this.area > 0;
                        };

                        this.confirm = () => {
                            if (!this.canConfirm()) return;

                            API
                            .zones
                            .create(zone.name, zone.geo, shop._id)
                            .then(() => $state.go('^.list', {}, { reload: true }));
                        };

                        $scope.$watch(() => zone.geo, (geo) => {
                            if (geo) this.area = require('turf').area(geo);
                        });
                    }
                },
                'map-child@shops.detail.zones': {
                    template: require('raw-loader!./map-child.html'),
                    controllerAs: 'ctrl',
                    controller: function (zone) {
                        this.features = {};

                        this.newFeature = (feature) => {
                            this.features['new'] = feature;
                            zone.geo = feature.geometry;
                        };
                    }
                }
            }
        });
    })