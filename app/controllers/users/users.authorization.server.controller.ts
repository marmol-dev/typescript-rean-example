'use strict';

/**
 * Module dependencies.
 */

import * as _ from 'lodash';
import {default as User} from '../../models/user.server.model';


export default class UsersAuthorizationController {
    /**
     * User middleware
     */
    userByID(req, res, next, id) {
        User.get(id)
            .without(['salt', 'password'])
            .run()
            .then(function(user) {
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        })
            .then(null, function(err) {
            return next(err);
        });
    }

    /**
     * Require login routing middleware
     */
    requiresLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
        }

        next();
    }

    /**
     * User authorizations routing middleware
     */
    hasAuthorization(roles) {
        var _this = this;

        return function(req, res, next) {
            _this.requiresLogin(req, res, function() {
                if (_.intersection(req.user.roles, roles).length) {
                    return next();
                } else {
                    return res.status(403).send({
                        message: 'User is not authorized'
                    });
                }
            });
        };
    }
}
