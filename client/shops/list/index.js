require('angular')
.module(
    (module.exports = 'cerovueltas.shops.list'),
    [
        require('angular-ui-router'),
        require('angular-material'),
        require('angular-material-icons'),
        require('../../api'),
        require('../../left-sidenav'),
        require('../list-directive')
    ]
)
.run([
    'LeftSidenavLinks',
    function (LeftSidenavLinks) {
        LeftSidenavLinks.push({
            stateName: 'cerovueltas.shops.list',
            name: 'Locales',
            first: true
        })
    }
])
.config(
    [
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state({
                resolve: {
                    shops: (API) => {
                        return API.shops.list();
                    }
                },
                name: 'cerovueltas.shops.list',
                url: '/',
                views: {
                    'top-toolbar@': {
                        template: require('raw-loader!./top-toolbar.html')
                    },
                    '@': {
                        template: require('raw-loader!./view.html'),
                        controllerAs: 'ctrl',
                        controller: function (shops) {
                            this.shops = shops;
                        }
                    },
                    
                }
            })
        }
    ]
)