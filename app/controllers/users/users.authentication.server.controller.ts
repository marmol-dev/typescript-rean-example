'use strict';

/**
 * Module dependencies.
 */

import * as _ from 'lodash';
import ErrorsController from '../errors.server.controller';
var errorHandler = ErrorsController.getInstance();
import {default as User, UserAttributes} from '../../models/user.server.model';
import DbConfig from '../../../config/db';
var r = DbConfig.getInstance().getThinky().r;
import * as express from 'express';
import * as passport from 'passport';

//check security
export default class UsersAuthenticationController {

    cleanInput(req: express.Request, res: express.Response, next: express.Errback) {
        var body: UserAttributes = req.body;
        delete body.roles;
        delete body.updated;
        delete body.created;
        delete body.resetPasswordToken;
        delete body.resetPasswordExpires;
        next(undefined);
    }

    //TODO: create
    /**
     * Available
     * Check if the user is available (on signup and update)
     */



    //TODO: create funcion notLogged

    /**
     * Signup
     */
    signup(req, res) {
        // Init Variables
        var user = new User(req.body);

        // Add missing user fields
        user.provider = 'local';
        user.displayName = user.firstName + ' ' + user.lastName;

        var sameCredentialsError = new Error('There is another user with the same email or username');

        // Then save the user
        User.getByUsername(req.body.username)
            .run()
            .then(function(user) {
            throw sameCredentialsError;
        }, function(err) {
                return User.getByEmail(req.body.email).run()
                    .then(function() {
                    throw sameCredentialsError;
                }, function(err) {
                        return;
                    });
            })
            .then(function() {
            return user.save();
        })
            .then(function(doc) {

            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        })
            .then(null, function(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        });

    };

    /**
     * Signin after passport authentication
     */
    signin(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err || !user) {
                res.status(400).send(info);
            } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        })(req, res, next);
    };

    /**
     * Signout
     */
    signout(req, res) {
        req.logout();
        res.redirect('/');
    };

    /**
     * OAuth callback
     */
    oauthCallback(strategy) {
        return function(req, res, next) {
            passport.authenticate(strategy, function(err, user, redirectURL) {
                if (err || !user) {
                    return res.redirect('/#!/signin');
                }
                req.login(user, function(err) {
                    if (err) {
                        return res.redirect('/#!/signin');
                    }

                    return res.redirect(redirectURL || '/');
                });
            })(req, res, next);
        };
    };

    /**
     * Helper function to save or update a OAuth user profile
     */
    saveOAuthUserProfile(req: express.Request, providerUserProfile, done) {
        if (!req.user) {
            // Define a search query fields
            var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
            var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

            // Define main provider search query
            var mainProviderSearchQuery = {};
            mainProviderSearchQuery['provider'] = providerUserProfile.provider;
            mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

            // Define additional provider search query
            var additionalProviderSearchQuery = {};
            additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];


            User.filter(r.expr(mainProviderSearchQuery).or(r.expr(additionalProviderSearchQuery)))
                .limit(1)
                .run()
                .then(function(users) { //mirar si devuelve users vacios
                if (users.length === 0) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        var user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function(err, doc) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(null, users);
                }
            })
                .then(null, function(err) {
                return done(err);
            });
        } else {
            // User is already logged in, join the provider data to the existing user
            var user = req.user;

            // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
            if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
                // Add the provider data to the additional provider data field
                if (!user.additionalProvidersData) user.additionalProvidersData = {};
                user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

                // Then tell thinky that we've updated the additionalProvidersData field
                //user.markModified('additionalProvidersData');

                // And save the user
                user.save(function(err) {
                    return done(err, user, '/#!/settings/accounts');
                });
            } else {
                return done(new Error('User is already connected using this provider'), user);
            }
        }
    };

    /**
     * Remove OAuth provider
     */
    removeOAuthProvider(req, res, next) {
        var user = req.user;
        var provider = req.param('provider');

        if (user && provider) {
            // Delete the additional provider
            if (user.additionalProvidersData[provider]) {
                delete user.additionalProvidersData[provider];

                // Then tell thinky that we've updated the additionalProvidersData field
                //user.markModified('additionalProvidersData');
            }

            user.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    req.login(user, function(err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
        }
    }
}
