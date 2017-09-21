require('angular')
    .module(
    (module.exports = 'cerovueltas.home'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router')
    ]
    )
    .config(
    ($stateProvider) => {
        $stateProvider.state({
            name: 'cerovueltas.home',
            url: '/',
            views: {
                '@': {
                    template: require('raw-loader!./view.html')
                }
            }
        });
    }
);