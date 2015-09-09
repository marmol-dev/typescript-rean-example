'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    User = require('../../models/user.server.model');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
    User.get(id)
        .without(['salt', 'password'])
        .run()
        .then(function (user) {
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        })
        .error(function (err) {
            return next(err);
        });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles) {
    var _this = this;

    return function (req, res, next) {
        _this.requiresLogin(req, res, function () {
            if (_.intersection(req.user.roles, roles).length) {
                return next();
            } else {
                return res.status(403).send({
                    message: 'User is not authorized'
                });
            }
        });
    };
};
