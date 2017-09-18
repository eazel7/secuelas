const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

function SingleNodeApp(config, db, api, shopRouterApp, customerApp, wwwApp, loginApp, landingApp, carrierApp) {
    var app = require('express')();

    app.use(require('morgan')('combined'));

    app.use(session({
        cookie: {
            path: '/',
            httpOnly: false,
            secure: true,
            maxAge: null
        },
        secret: config.sessionSecret,
        saveUninitialized: true,
        store: new MongoStore({
            db: db
        })
    }));
    
    var requireLogin = require('./base-app/require-login.js')(config);
    var authRoute = require('./base-app/auth-route.js')(config, api);

    app.use(config.customer, requireLogin, customerApp);

    app.use(config.carrier, requireLogin, carrierApp);

    app.use(config.www, requireLogin, wwwApp);

    app.use(config.landing, requireLogin, landingApp);

    app.use(config.login, loginApp);

    app.use(config.shops, shopRouterApp);
    
    app.use(authRoute);

    app.use(function(req, res, next) {
        res.status(404);
        res.send('not found');
        res.end();
    });

    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(503);
        res.send(err.toString());
        res.end();
    });

    return app;
}

module.exports = SingleNodeApp;
