'use strict';

/**
 * Module dependencies.
 */
import * as _ from 'lodash';
import ErrorsController from '../errors.server.controller';
var errorHandler = ErrorsController.getInstance();
import * as passport from 'passport';
import {UserDocument, UserAttributes, default as User} from '../../models/user.server.model';
import DbConfig from '../../../config/db';
var r = DbConfig.getInstance().getThinky().r;
import * as express from 'express';

export default class UsersProfileController {

    /**
     * Update user details
     */
    update(req: express.Request, res: express.Response) {
        // Init Variables
        var user: UserDocument = req.user; //comprobar si puede modificaar el id
        var body: Object = req.user;
        var message = null;

        if (user) {
            // Merge existing user
            user = <UserDocument> _.extend(user, body);//TODO: improve casting
            user.updated = new Date();
            user.displayName = user.firstName + ' ' + user.lastName;

            User.filter(
                r.row('username').eq(user.username).or(
                    r.row('email').eq(user.email))
                )
                .limit(2)
                .run()
                .then(function(users) {
                if (users.length === 0) {
                    return;
                } else {
                    var distinctId = _.any(users, function(userItr) {
                        return user.id !== userItr.id;
                    });

                    if (distinctId) {
                        throw new Error('There is another user with the same email or username');
                    } else {
                        return;
                    }
                }
            })
                .then(function() {
                return user.save();
            })
                .then(function() {
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
        } else {
            res.status(400).send({
                message: 'User is not signed in'
            });
        }
    }

    /**
     * Send User
     */
    me(req: express.Request, res: express.Response) {
        res.json(req.user || null);
    }
}
