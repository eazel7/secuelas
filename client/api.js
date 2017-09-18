require('angular')
    .module(
    (module.exports = 'cerovueltas.api'),
    [
        require('./local-storage')
    ]
    )
    .service(
    'API',
    [
        '$http',
        'LocalStorage',
        function ($http, LocalStorage) {
            const description = require('api-description!');

            function methodFor(service, method) {
                return function () {
                    var params = {};

                    for (var i = 0; i < arguments.length; i++) {
                        params[description[service][method][i]] = arguments[i];
                    }

                    return $http.post('api/' + encodeURIComponent(service) + '/' + encodeURIComponent(method),
                        params,
                        {
                            headers: {
                                'cerovueltas': LocalStorage.userToken
                            }
                        })
                        .then(function (data) {
                            return data.data;
                        }, function (data) {
                            throw (data && data.data ? data.data : data);
                        });
                }
            }

            for (var service in description) {
                var proxy = this[service] = {};

                for (var method in description[service]) {
                    proxy[method] = methodFor(service, method)
                }
            }
        }
    ]
    );