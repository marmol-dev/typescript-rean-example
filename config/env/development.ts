'use strict';

import BaseConfiguration from './base';
import EnviromentConfiguration from './enviroment';

class DevelopmentConfiguration implements EnviromentConfiguration {
    private static instance : DevelopmentConfiguration = undefined;

    //singleton
    static getInstance() : DevelopmentConfiguration {
        if (!this.instance) this.instance = new DevelopmentConfiguration();
        return this.instance;
    }

    applyConfiguration(configObject : BaseConfiguration){
        configObject.db = {
            host: '127.0.0.1',
            port: 28015,
            db: 'reanTypescriptExampleDev',
            sessionTable: 'session'
        };
        configObject.app = {
            title: 'rean-typescript example - Development Environment'
        };
    	configObject.facebook = {
    		clientID: process.env.FACEBOOK_ID || 'APP_ID',
    		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    		callbackURL: '/auth/facebook/callback'
    	};
    	configObject.twitter = {
    		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    		callbackURL: '/auth/twitter/callback'
    	};
    	configObject.google = {
    		clientID: process.env.GOOGLE_ID || 'APP_ID',
    		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    		callbackURL: '/auth/google/callback'
    	};
    	configObject.linkedin = {
    		clientID: process.env.LINKEDIN_ID || 'APP_ID',
    		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    		callbackURL: '/auth/linkedin/callback'
    	};
    	configObject.github = {
    		clientID: process.env.GITHUB_ID || 'APP_ID',
    		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    		callbackURL: '/auth/github/callback'
    	};
    	configObject.mailer = {
    		from: process.env.MAILER_FROM || 'MAILER_FROM',
    		options: {
    			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
    			auth: {
    				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
    				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
    			}
    		}
    	}
    }
}

export = DevelopmentConfiguration;
