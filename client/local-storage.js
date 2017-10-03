require('angular')
.module(
    (module.exports = 'local-storage'),
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