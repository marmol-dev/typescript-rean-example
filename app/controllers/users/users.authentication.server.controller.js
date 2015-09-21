'use strict';
var errors_server_controller_1 = require('../errors.server.controller');
var errorHandler = errors_server_controller_1.default.getInstance();
var user_server_model_1 = require('../../models/user.server.model');
var db_1 = require('../../../config/db');
var r = db_1.default.getInstance().getThinky().r;
var passport = require('passport');
var UsersAuthenticationController = (function () {
    function UsersAuthenticationController() {
    }
    UsersAuthenticationController.prototype.cleanInput = function (req, res, next) {
        var body = req.body;
        delete body.roles;
        delete body.updated;
        delete body.created;
        delete body.resetPasswordToken;
        delete body.resetPasswordExpires;
        next(undefined);
    };
    UsersAuthenticationController.prototype.signup = function (req, res) {
        var user = new user_server_model_1.default(req.body);
        user.provider = 'local';
        user.displayName = user.firstName + ' ' + user.lastName;
        var sameCredentialsError = new Error('There is another user with the same email or username');
        user_server_model_1.default.getByUsername(req.body.username)
            .run()
            .then(function (user) {
            throw sameCredentialsError;
        }, function (err) {
            return user_server_model_1.default.getByEmail(req.body.email).run()
                .then(function () {
                throw sameCredentialsError;
            }, function (err) {
                return;
            });
        })
            .then(function () {
            return user.save();
        })
            .then(function (doc) {
            user.password = undefined;
            user.salt = undefined;
            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.json(user);
                }
            });
        })
            .then(null, function (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        });
    };
    ;
    UsersAuthenticationController.prototype.signin = function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                res.status(400).send(info);
            }
            else {
                user.password = undefined;
                user.salt = undefined;
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        res.json(user);
                    }
                });
            }
        })(req, res, next);
    };
    ;
    UsersAuthenticationController.prototype.signout = function (req, res) {
        req.logout();
        res.redirect('/');
    };
    ;
    UsersAuthenticationController.prototype.oauthCallback = function (strategy) {
        return function (req, res, next) {
            passport.authenticate(strategy, function (err, user, redirectURL) {
                if (err || !user) {
                    return res.redirect('/#!/signin');
                }
                req.login(user, function (err) {
                    if (err) {
                        return res.redirect('/#!/signin');
                    }
                    return res.redirect(redirectURL || '/');
                });
            })(req, res, next);
        };
    };
    ;
    UsersAuthenticationController.prototype.saveOAuthUserProfile = function (req, providerUserProfile, done) {
        if (!req.user) {
            var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
            var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;
            var mainProviderSearchQuery = {};
            mainProviderSearchQuery['provider'] = providerUserProfile.provider;
            mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
            var additionalProviderSearchQuery = {};
            additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
            user_server_model_1.default.filter(r.expr(mainProviderSearchQuery).or(r.expr(additionalProviderSearchQuery)))
                .limit(1)
                .run()
                .then(function (users) {
                if (users.length === 0) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
                    user_server_model_1.default.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                        var user = new user_server_model_1.default({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });
                        user.save(function (err, doc) {
                            return done(err, user);
                        });
                    });
                }
                else {
                    return done(null, users);
                }
            })
                .then(null, function (err) {
                return done(err);
            });
        }
        else {
            var user = req.user;
            if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
                if (!user.additionalProvidersData)
                    user.additionalProvidersData = {};
                user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
                user.save(function (err) {
                    return done(err, user, '/#!/settings/accounts');
                });
            }
            else {
                return done(new Error('User is already connected using this provider'), user);
            }
        }
    };
    ;
    UsersAuthenticationController.prototype.removeOAuthProvider = function (req, res, next) {
        var user = req.user;
        var provider = req.param('provider');
        if (user && provider) {
            if (user.additionalProvidersData[provider]) {
                delete user.additionalProvidersData[provider];
            }
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        }
                        else {
                            res.json(user);
                        }
                    });
                }
            });
        }
    };
    return UsersAuthenticationController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersAuthenticationController;
//# sourceMappingURL=users.authentication.server.controller.js.map