require('angular')
.module(
    (module.exports = 'cerovueltas.zones.list-directive'),
    [
        require('angular-material')
    ]
)
.directive(
    'zonesList',
    function () {
        return {
            template: require('raw-loader!./template.html'),
            scope: {
                'zones': '='
            }
        }
    }
)