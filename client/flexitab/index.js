require('angular')
.module(
    (module.exports = ('secuelas.flexitab')),
    [
        require('angular-material')
    ]
)
.directive(
    'flexTabs',
    () => {
        return {
            restrict: 'E',
            controllerAs: 'flexitabs',
            template: require('raw-loader!./template.html'),
            controller: function FlexTabsController($rootScope, $mdMedia) {

            }
        }
    }
)