'use stmodule.exports =rict';
var passport = require('passport');
var passport_github_1 = require('passport-github');
var config_1 = require('../config');
var config = config_1.default.getInstance();
var users_server_controller_1 = require('../../app/controllers/users.server.controller');
var users = users_server_controller_1.default.getInstance();
function default_1() {
    passport.use(new passport_github_1.Strategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        passReqToCallback: true
    }, function (req, accessToken, refreshToken, profile, done) {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        var providerUserProfile = {
            displayName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            providerIdentifierField: 'id',
            providerData: providerData
        };
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=github.js.map