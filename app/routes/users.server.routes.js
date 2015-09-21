'use strict';
var passport = require('passport');
var users_server_controller_1 = require('../../app/controllers/users.server.controller');
function default_1(app) {
    var users = users_server_controller_1.default.getInstance();
    app.route('/users/me').get(users.me);
    app.route('/users').put(users.cleanInput, users.update);
    app.route('/users/accounts').delete(users.removeOAuthProvider);
    app.route('/users/password').post(users.changePassword);
    app.route('/auth/forgot').post(users.forgot);
    app.route('/auth/reset/:token').get(users.validateResetToken);
    app.route('/auth/reset/:token').post(users.reset);
    app.route('/auth/signup').post(users.cleanInput, users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);
    app.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));
    app.route('/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/auth/google/callback').get(users.oauthCallback('google'));
    app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
    app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));
    app.route('/auth/github').get(passport.authenticate('github'));
    app.route('/auth/github/callback').get(users.oauthCallback('github'));
    app.param('userId', users.userByID);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=users.server.routes.js.map