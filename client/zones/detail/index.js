require('angular')
.module(
    (module.exports = 'cerovueltas.zones.detail'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../api'),
        require('./products')
    ]
)
.config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'zones.detail',
            url: '/detail/:zone',
            resolve: {
                zone: ($stateParams, API) => API.zones.getById($stateParams.zone)
            },
            views: {
                'top-toolbar@': {
                    template: require('raw-loader!./top-toolbar.html')
                },
                '@': {
                    template: require('raw-loader!./view.html'),
                    controllerAs: 'ctrl',
                    controller: function (zone) {
                        this.zone = zone;
                    }
                }
            }
        })
    }
);