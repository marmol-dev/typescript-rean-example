'use strict';

/**
 * Module dependencies.
 */

import * as passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import User from '../../app/models/user.server.model';

export default function () {
    // Use local strategy
    passport.use(
        new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            function (username, password, done) {
                User.getByUsername(username)
                    .run()
                    .then(function (user) {

                        if (!user.authenticate(password)) {
                            return done(null, false, {
                                message: 'Unknown user or invalid password'
                            });
                        }

                        return done(null, user);
                    })
                    .then(null, function (err) {
                        //TODO: improve error categorization
                        return done(null, false, {
                            message: 'Unknown user or invalid password'
                        });
                    });
            }
        )
    );
};
