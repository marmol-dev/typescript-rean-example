'use strict';
var _ = require('lodash');
var user_server_model_1 = require('../../models/user.server.model');
var UsersAuthorizationController = (function () {
    function UsersAuthorizationController() {
    }
    UsersAuthorizationController.prototype.userByID = function (req, res, next, id) {
        user_server_model_1.default.get(id)
            .without(['salt', 'password'])
            .run()
            .then(function (user) {
            if (!user)
                return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        })
            .then(null, function (err) {
            return next(err);
        });
    };
    UsersAuthorizationController.prototype.requiresLogin = function (req, res, next) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
        }
        next();
    };
    UsersAuthorizationController.prototype.hasAuthorization = function (roles) {
        var _this = this;
        return function (req, res, next) {
            _this.requiresLogin(req, res, function () {
                if (_.intersection(req.user.roles, roles).length) {
                    return next();
                }
                else {
                    return res.status(403).send({
                        message: 'User is not authorized'
                    });
                }
            });
        };
    };
    return UsersAuthorizationController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersAuthorizationController;
//# sourceMappingURL=users.authorization.server.controller.js.map