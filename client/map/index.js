const angular = require('angular');

require('angular-simple-logger');
require('leaflet');
require('lf-ng-md-file-input');
require('leaflet.markercluster');
require('leaflet-draw');
require('ui-leaflet');
require('ui-leaflet-draw');
require('ui-leaflet-layers');

angular.module(
    (module.exports = 'cerovueltas.map'),
    [
        'ui-leaflet'
    ]
)
    .directive(
    'mapLocations',
    function () {
        return {
            restrict: 'E',
            scope: {
                locations: '=mapLocations',
                locationClick: '&mapLocationClick'
            },
            require: ['^map'],
            link: function ($scope, $element, $attributes, $controllers) {
                var mapController = $controllers[0];
                var markers = mapController.markers;

                $scope.$watch('locations', function (locations) {
                    locations = locations || [];

                    var currentIds = locations.map(function (location) {
                        return location._id;
                    });

                    for (var markerId in markers) {
                        if (markerId.indexOf('location_') !== 0) continue;
                        var id = markerId.slice(0, 'location_'.length);

                        if (currentIds.indexOf(id) === -1) delete markers[markerId];
                    }

                    locations.forEach(function (location) {
                        mapController.markers['location_' + location._id] = {
                            click: function () {
                                $scope.locationClick({ $location: location })
                            },
                            group: location.group,
                            icon: location.icon,
                            lat: location.lat,
                            lng: location.lon
                        };
                    });
                }, true);
            }
        }
    }
    )
    .directive(
    'mapFeatures',
    function () {
        return {
            restrict: 'E',
            scope: {
                features: '=',
                featureClick: '&'
            },
            require: ['^map'],
            link: function ($scope, $element, $attributes, $controllers) {
                var mapController = $controllers[0];

                mapController.featureClick = (feature) => {
                    $scope.featureClick({ $feature: feature });
                }

                $scope.$watch('features', function (features) {
                    var data = {};

                    for (var id in features) {
                        data[id] = {
                            data: features[id]
                        }
                    }

                    mapController.geojson = data;
                }, true);

                $scope.$on('$destroy', () => {
                    mapController.geojson.data = {};
                    mapController.featureClick = null;
                });
            }
        }
    }
    )
    .directive(
    'map',
    function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                'center': '=mapCenter'
            },
            template: require('raw-loader!./template.html'),
            controllerAs: 'ctrl',
            controller: function ($scope, leafletData, $timeout) {
                var markers = this.markers = $scope.markers = {};
                var paths = this.paths = $scope.paths = {};
                var geojson = this.geojson = { data: {} };

                $scope.$on('leafletDirectiveGeoJson.click', function (event, leaflet) {
                    var feature = leaflet.model;

                    if (feature.click) feature.click();
                });

                $scope.$on('leafletDirectiveMarker.click', function (event, leaflet) {
                    var marker = leaflet.model;

                    if (marker.click) marker.click();
                });

                $scope.$on('leafletDirectiveDraw.draw:created', (e, payload) => {
                    var geoJson = payload.leafletEvent.layer.toGeoJSON();

                    if (this.newFeature) this.newFeature(geoJson);
                });

                var ctrlCenter = this.center = {};

                $scope.$watch('center', function (center) {
                    angular.extend(ctrlCenter, center);
                }, true);

                $timeout(function () {

                    leafletData.getMap().then(function (map) {
                        map.invalidateSize();
                    });
                }, 1000);
            }
        }
    }
    )
    .directive(
    'mapDraw',
    function () {
        return {
            restrict: 'E',
            scope: {
                'options': '=',
                'newFeature': '&'
            },
            require: ['^map'],
            link: function ($scope, $element, $attributes, $controllers) {
                var mapController = $controllers[0];

                $scope.$watch(() => $scope.options, (options) => {
                    mapController.drawOptions = options;
                });


                mapController.newFeature = (geojson) => $scope.newFeature({ $feature: geojson });

                $scope.$on('$destroy', () => {
                    mapController.drawOptions = false;
                    mapController.newFeature = null;
                });
            }
        }
    }
    );