require('angular')
    .module(
    (module.exports = 'cerovueltas.products.list-directive'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-messages')
    ]
    )
    .directive(
        'productsList',
        function () {
            return {
                restrict: 'E',
                template: require('raw-loader!./template.html'),
                scope: {
                    'products': '=',
                    'click': '&'
                }
            }
        }
    );