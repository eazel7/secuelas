const jsonParser = require('body-parser').json();

function App(frontendApi, api) {
    var app = require('express')();

    app.post('/api/:service/:method',
        jsonParser,
        (req, res, next) => {
            var method = frontendApi[req.params.service].constructor.prototype[req.params.method];

            var args = require('origami-js-function-helpers').getFunctionArgumentNames(method)
                .map((argName) => {
                    return req.body[argName];
                });

            method.apply(frontendApi[req.params.service], args)
                .then((result) => {
                    res.json(result);
                }, (err) => {
                    res.status(400).send(err ? err.toString() : 'Error');
                })
        });

    app.use(require('serve-static')(require('path').join(__dirname, 'dist')));

    return app;
}

module.exports = App;