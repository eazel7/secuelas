module.exports = function (content) {
    const VM2 = require('vm2').NodeVM;
    function APIDescriptionLoader(options) { }

    const vm = new VM2({
        'require': {
            external: true
        },
        root: __dirname
    });

    var apiIndex = require.resolve('../../frontend-api');
    var api = vm.run(`module.exports = require('${apiIndex}')`);

    var services = {};

    for (var serviceName in api) {
        var service = services[serviceName] = {};

        for (var methodName in api[serviceName].prototype) {
            var method = api[serviceName].prototype[methodName];

            service[methodName] = require('origami-js-function-helpers').
            getFunctionArgumentNames(method)
            .filter((argName) => argName != 'userToken');
        }
    }

    return 'module.exports = ' + JSON.stringify(services);
};
