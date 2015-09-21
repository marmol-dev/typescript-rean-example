'use strict';
var passport = require('passport');
var passport_google_oauth_1 = require('passport-google-oauth');
var config_1 = require('../config');
var config = config_1.default.getInstance();
var users_server_controller_1 = require('../../app/controllers/users.server.controller');
var users = users_server_controller_1.default.getInstance();
function default_1() {
    passport.use(new passport_google_oauth_1.OAuth2Strategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        passReqToCallback: true
    }, function (req, accessToken, refreshToken, profile, done) {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        var providerUserProfile = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            providerIdentifierField: 'id',
            providerData: providerData
        };
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=google.js.map