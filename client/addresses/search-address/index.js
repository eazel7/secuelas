require('angular')
    .module(
    (module.exports = 'cerovueltas.addressess.search-address'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('../../api')
    ]
    )
    .directive(
    'searchAddress',
    () => {
        return {
            restrict: 'E',
            scope: {
                'results': '=',
                'select': '&'
            },
            template: require('raw-loader!./template.html'),
            controllerAs: 'ctrl',
            controller: function SearchAddressDirectiveController(API, $scope) {
                this.searchText = '';

                this.selectAddress = (address) => $scope.select({ $address: address });

                $scope.$watch(
                    () => {
                        return this.searchText;
                    },
                    require('underscore').throttle(
                        (searchText) => {
                            this.searching = true;

                            API.addresses.search(searchText).then((results) => {
                                this.results = results;
                                this.searching = false;
                            }, (err) => {
                                this.searching = false;
                            })
                        },
                        1000
                    ));
            }
        }
    }
    )