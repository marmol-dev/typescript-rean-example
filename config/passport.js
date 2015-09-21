'use strict';
var passport = require('passport');
var user_server_model_1 = require('../app/models/user.server.model');
var path = require('path');
var config_1 = require('./config');
var config = config_1.default.getInstance();
function default_1() {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        user_server_model_1.default.get(id)
            .without(['salt', 'password'])
            .run()
            .then(function (user) {
            done(null, user);
        })
            .then(null, function (err) {
            done(err, null);
        });
    });
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategyPath) {
        var strategy = require(path.resolve(strategyPath)).default;
        strategy();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=passport.js.map