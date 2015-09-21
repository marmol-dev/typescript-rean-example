'use strict';
var passport = require('passport');
var passport_linkedin_1 = require('passport-linkedin');
var config_1 = require('../config');
var config = config_1.default.getInstance();
var users_server_controller_1 = require('../../app/controllers/users.server.controller');
var users = users_server_controller_1.default.getInstance();
function default_1() {
    passport.use(new passport_linkedin_1.Strategy({
        consumerKey: config.linkedin.clientID,
        consumerSecret: config.linkedin.clientSecret,
        callbackURL: config.linkedin.callbackURL,
        passReqToCallback: true,
        profileFields: ['id', 'first-name', 'last-name', 'email-address']
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
            provider: 'linkedin',
            providerIdentifierField: 'id',
            providerData: providerData
        };
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=linkedin.js.map