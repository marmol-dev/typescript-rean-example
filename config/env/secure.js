'use strict';
var SecureConfiguration = (function () {
    function SecureConfiguration() {
    }
    //singleton
    SecureConfiguration.getInstance = function () {
        if (!this.instance)
            this.instance = new SecureConfiguration();
        return this.instance;
    };
    SecureConfiguration.prototype.applyConfiguration = function (configObject) {
        configObject.port = 443;
        configObject.db = {
            host: '127.0.0.1',
            port: 28015,
            db: 'reanTypescriptExampleSec',
            sessionTable: 'session'
        };
        configObject.assets = {
            lib: {
                css: [
                    'public/lib/bootstrap/dist/css/bootstrap.min.css',
                    'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
                ],
                js: [
                    'public/lib/angular/angular.min.js',
                    'public/lib/angular-resource/angular-resource.min.js',
                    'public/lib/angular-animate/angular-animate.min.js',
                    'public/lib/angular-ui-router/release/angular-ui-router.min.js',
                    'public/lib/angular-ui-utils/ui-utils.min.js',
                    'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
                ]
            },
            css: ['public/dist/application.min.css'],
            js: ['public/dist/application.min.js']
        };
        configObject.facebook = {
            clientID: process.env.FACEBOOK_ID || 'APP_ID',
            clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
            callbackURL: 'https://localhost:443/auth/facebook/callback'
        };
        configObject.twitter = {
            clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
            clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
            callbackURL: 'https://localhost:443/auth/twitter/callback'
        };
        configObject.google = {
            clientID: process.env.GOOGLE_ID || 'APP_ID',
            clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
            callbackURL: 'https://localhost:443/auth/google/callback'
        };
        configObject.linkedin = {
            clientID: process.env.LINKEDIN_ID || 'APP_ID',
            clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
            callbackURL: 'https://localhost:443/auth/linkedin/callback'
        };
        configObject.github = {
            clientID: process.env.GITHUB_ID || 'APP_ID',
            clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
            callbackURL: 'https://localhost:443/auth/github/callback'
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
        };
    };
    SecureConfiguration.instance = undefined;
    return SecureConfiguration;
})();
exports.default = SecureConfiguration;
//# sourceMappingURL=secure.js.map