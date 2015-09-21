'use strict';
var _ = require('lodash');
var users_authentication_server_controller_1 = require('./users/users.authentication.server.controller');
var users_authorization_server_controller_1 = require('./users/users.authorization.server.controller');
var users_password_server_controller_1 = require('./users/users.password.server.controller');
var users_profile_server_controller_1 = require('./users/users.profile.server.controller');
var UsersController = (function () {
    function UsersController() {
        _.extend(this, users_authentication_server_controller_1.default.prototype, users_authorization_server_controller_1.default.prototype, users_password_server_controller_1.default.prototype, users_profile_server_controller_1.default.prototype);
        users_authentication_server_controller_1.default.apply(this, arguments);
        users_authorization_server_controller_1.default.apply(this, arguments);
        users_password_server_controller_1.default.apply(this, arguments);
        users_profile_server_controller_1.default.apply(this, arguments);
    }
    UsersController.getInstance = function () {
        if (!this.instance) {
            this.instance = new UsersController();
        }
        return this.instance;
    };
    UsersController.instance = undefined;
    return UsersController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersController;
//# sourceMappingURL=users.server.controller.js.map