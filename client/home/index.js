require('angular')
    .module(
    (module.exports = 'secuelas.home'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router')
    ]
    )
    .config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'secuelas.home',
            url: '/',
            views: {
                '@': {
                    template: require('raw-loader!./view.html')
                }
            }
        });
    }
);