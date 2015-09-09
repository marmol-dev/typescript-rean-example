'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    passport = require('passport'),
    User = require('../../models/user.server.model'),
    r = require('../../../config/db').getThinky().r;

/**
 * Update user details
 */
exports.update = function (req, res) {
    // Init Variables
    var user = req.user; //comprobar si puede modificaar el id
    var message = null;


    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;


        User.filter(
                r.row('username').eq(user.username).or(
                    r.row('email').eq(user.email))
            )
            .limit(2)
            .run()
            .then(function (users) {
                if (users.length === 0) {
                    return;
                } else {
                    var distinctId = _.any(users, function (userItr) {
                        return user.id !== userItr.id;
                    });

                    if (distinctId) {
                        throw new Error('There is another user with the same email or username');
                    } else {
                        return;
                    }
                }
            })
            .then(function () {
                return user.save();
            })
            .then(function () {
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            })
            .catch(function (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Send User
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};
