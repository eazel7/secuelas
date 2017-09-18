require('angular')
    .module(
    (module.exports = 'cerovueltas.shops.list-directive'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../../api')
    ]
    )
    .directive(
    'shopsList',
    function () {
        return {
            template: require('raw-loader!./template.html'),
            restrict: 'E',
            scope: {
                'shops': '='
            }
        }
    }
    )