'use strict';

/**
 * Module dependencies.
 */

import * as passport from 'passport';
import User from '../app/models/user.server.model';
import * as path from 'path';
import Config from './config';
var config = Config.getInstance();

interface Strategy {
    () : void;
}

/**
 * Module init function.
 */
export default function () {
    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function (id, done) {
        User.get(id)
            .without(['salt', 'password'])
            .run()
            .then(function (user) {
                done(null, user);
            })
            .then(null, function (err) {
                done(err, null);
            });
    });

    // Initialize strategies
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategyPath) {
        var strategy : Strategy = require(path.resolve(strategyPath)).default;
        strategy();
    });
};
