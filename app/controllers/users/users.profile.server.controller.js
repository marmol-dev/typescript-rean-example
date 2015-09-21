'use strict';
var _ = require('lodash');
var errors_server_controller_1 = require('../errors.server.controller');
var errorHandler = errors_server_controller_1.default.getInstance();
var user_server_model_1 = require('../../models/user.server.model');
var db_1 = require('../../../config/db');
var r = db_1.default.getInstance().getThinky().r;
var UsersProfileController = (function () {
    function UsersProfileController() {
    }
    UsersProfileController.prototype.update = function (req, res) {
        var user = req.user;
        var body = req.user;
        var message = null;
        if (user) {
            user = _.extend(user, body);
            user.updated = new Date();
            user.displayName = user.firstName + ' ' + user.lastName;
            user_server_model_1.default.filter(r.row('username').eq(user.username).or(r.row('email').eq(user.email)))
                .limit(2)
                .run()
                .then(function (users) {
                if (users.length === 0) {
                    return;
                }
                else {
                    var distinctId = _.any(users, function (userItr) {
                        return user.id !== userItr.id;
                    });
                    if (distinctId) {
                        throw new Error('There is another user with the same email or username');
                    }
                    else {
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
        }
        else {
            res.status(400).send({
                message: 'User is not signed in'
            });
        }
    };
    UsersProfileController.prototype.me = function (req, res) {
        res.json(req.user || null);
    };
    return UsersProfileController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersProfileController;
//# sourceMappingURL=users.profile.server.controller.js.map