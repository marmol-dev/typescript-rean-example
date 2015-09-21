'use strict';
var passport = require('passport');
var passport_twitter_1 = require('passport-twitter');
var config_1 = require('../config');
var config = config_1.default.getInstance();
var users_server_controller_1 = require('../../app/controllers/users.server.controller');
var users = users_server_controller_1.default.getInstance();
function default_1() {
    passport.use(new passport_twitter_1.Strategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL,
        passReqToCallback: true
    }, function (req, token, tokenSecret, profile, done) {
        var providerData = profile._json;
        providerData.token = token;
        providerData.tokenSecret = tokenSecret;
        var providerUserProfile = {
            displayName: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            providerIdentifierField: 'id_str',
            providerData: providerData
        };
        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=twitter.js.map