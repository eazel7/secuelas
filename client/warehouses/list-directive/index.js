require('angular')
    .module(
    (module.exports = 'cerovueltas.warehouses.list-directive'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons')
    ]
    )
    .directive(
    'warehousesList',
    function () {
        return {
            template: require('raw-loader!./template.html'),
            restrict: 'E',
            scope: {
                'warehouses': '='
            }
        }
    }
    )