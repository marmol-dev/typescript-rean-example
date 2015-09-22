'use strict';
var fs = require('fs');
var https = require('https');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var passport = require('passport');
var _RDBStore = require('express-session-rethinkdb');
var RDBStore = _RDBStore(session);
var flash = require('connect-flash');
var config_1 = require('./config');
var config = config_1.default.getInstance();
var consolidate = require('consolidate');
var path = require('path');
function default_1(db) {
    var app = express();
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.facebookAppId = config.facebook.clientID;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers['host'] + req.url;
        next();
    });
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    app.set('showStackError', true);
    app.engine('server.view.html', consolidate[config.templateEngine]);
    app.set('view engine', 'server.view.html');
    app.set('views', './app/views');
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        app.set('view cache', false);
    }
    else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride(null));
    app.use(cookieParser());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new RDBStore({
            connectOptions: {
                db: config.db.db,
                host: config.db.host,
                port: config.db.port
            },
            table: config.db.sessionTable,
            sessionTimeout: 86400000,
            flushInterval: 60000
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');
    app.use(express.static(path.resolve('./public')));
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath)).default(app);
    });
    app.use(function (err, req, res, next) {
        if (!err)
            next(null);
        else {
            console.error(err.stack);
            res.status(500).render('500', {
                error: err.stack
            });
        }
    });
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });
    if (process.env.NODE_ENV === 'secure') {
        console.log('Securely using https protocol');
        var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');
        var httpsServer = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);
        return httpsServer;
    }
    return app;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=express.js.map