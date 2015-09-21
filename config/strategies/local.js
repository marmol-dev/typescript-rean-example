'use strict';
var passport = require('passport');
var passport_local_1 = require('passport-local');
var user_server_model_1 = require('../../app/models/user.server.model');
function default_1() {
    passport.use(new passport_local_1.Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        user_server_model_1.default.getByUsername(username)
            .run()
            .then(function (user) {
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Unknown user or invalid password'
                });
            }
            return done(null, user);
        })
            .then(null, function (err) {
            return done(null, false, {
                message: 'Unknown user or invalid password'
            });
        });
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=local.js.map