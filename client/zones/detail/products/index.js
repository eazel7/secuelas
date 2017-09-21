require('angular')
.module(
    (module.exports = 'cerovueltas.zones.detail.products'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('./add'),
        require('../../../api'),
        require('../../../right-sidenav'),
        require('../../../products/list')
    ]
)
.config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'cerovueltas.zones.detail.products',
            url: '/products',
            resolve: {
                zoneProducts: (API, zone) => API.products.listByZone(zone._id),
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
                'top-toolbar@': {
                    template: require('raw-loader!./top-toolbar.html')
                },
                'right-sidenav@': {
                    template: require('raw-loader!./right-sidenav.html'),
                    controllerAs: 'ctrl',
                    controller: function (zoneProducts) {
                        this.zoneProducts = zoneProducts;
                    }
                }
            }
        })
    }
);