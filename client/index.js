require('./style.scss');

const angular = require('angular');

angular
    .module(
    (module.exports = 'cerovueltas'),
    [
        require('./left-sidenav'),
        require('./right-sidenav'),
        require('./login'),
        require('./products'),
        require('./shops'),
        require('./zones'),
        require('./warehouses')
    ]
    );
    
var doc = angular
    .element(document);

doc
    .ready(function () {
        angular
            .bootstrap(document, ['cerovueltas']);
    });