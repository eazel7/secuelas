require('angular')
.module(
    (module.exports = 'cerovueltas.local-storage'),
    []
)
.service(
    'LocalStorage',
    [
        '$window',
        function ($window) {
            return $window.localStorage;
        }
    ]
);