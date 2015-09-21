'use strict';

/**
 * Module dependencies.
 */
import * as passport from 'passport';
import * as url from 'url';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import Config from '../config';
var config = Config.getInstance();
import UsersController from '../../app/controllers/users.server.controller';
var users = UsersController.getInstance();
import * as express from 'express';


export default function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req : express.Request, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
