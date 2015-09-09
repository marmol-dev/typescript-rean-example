'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../app/models/user.server.model');

module.exports = function () {
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
                    .error(function (err) {
                        //TODO: improve error categorization
                        return done(null, false, {
                            message: 'Unknown user or invalid password'
                        });
                    });
            }
        )
    );
};
