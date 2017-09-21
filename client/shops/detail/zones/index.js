require('angular')
.module(
    (module.exports = 'cerovueltas.shops.detail.zones'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('./create'),
        require('../../../api'),
        require('../../../map')
    ]
)
.config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'cerovueltas.shops.detail.zones',
            url: '/zones',
            resolve: {
                mapCenter: function () {
                    return {
                        lat: -34.63772760271713,
                        lng: -58.45138549804693,
                        zoom: 11
                    };
                },
                warehousesLocations: (warehouses) => {
                    return warehouses.map((warehouse) => {
                        var geo = require('turf').feature(warehouse.geo).geometry;

                        return {
                            temp: true,
                            lat: geo.coordinates[1],
                            lon: geo.coordinates[0],
                            _id: warehouse._id,
                            icon: {
                                iconUrl: require('../../shop.png'),
                                iconSize: [48, 48],
                                iconAnchor: [23, 47],
                                popupAnchor: [0, -36]
                            }
                        };
                    })
                },
                zones: (API, shop) => {
                    return API.zones.listByShop(shop._id);
                }
            },
            views: {
                '@': {
                    template: require('raw-loader!./view.html'),
                    controllerAs: 'ctrl',
                    controller: function (mapCenter, zones, warehousesLocations) {
                        this.mapCenter = mapCenter;
                        this.warehousesLocations = warehousesLocations;
                    }
                },
                'top-toolbar@': {
                    template: require('raw-loader!./top-toolbar.html')
                },
                'map-child@cerovueltas.shops.detail.zones': {
                    template: require('raw-loader!./map-child.html'),
                    controllerAs: 'ctrl',
                    controller: function (zones) {
                        var features = {};

                        zones.forEach((zone) => features[zone._id] = zone.geo);

                        this.features = features;
                    }
                }
            }
        })
    }
)