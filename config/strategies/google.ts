'use strict';

/**
 * Module dependencies.
 */

import * as passport from 'passport';
import * as url from 'url';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import Config from '../config';
var config = Config.getInstance();
import UsersController from '../../app/controllers/users.server.controller';
var users = UsersController.getInstance();
import * as express from 'express';

export default function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req : express.Request, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
