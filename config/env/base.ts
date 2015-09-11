"use strict";

class BaseConfiguration {

	app : {
        title? : string;
        description? : string;
        keywords? : string;
    }
    db : {
        host : string;
        port : number;
        db: string;
        sessionTable : string;
    }
    port : number | string;
    templateEngine : string;
    sessionSecret : string;
    sessionCollection : string;
    assets : {
        lib? : {
            css? : string[];
            js? : string[];
        };
        css? : string[];
        js? : string[];
        tests? : string[];
    }
    facebook : {
        clientID : string;
        clientSecret : string;
        callbackURL : string;
    }
    google : {
        clientID : string;
        clientSecret : string;
        callbackURL : string;
    }
    twitter : {
        clientID : string;
        clientSecret : string;
        callbackURL : string;
    }
    linkedin : {
        clientID : string;
        clientSecret : string;
        callbackURL : string;
    }
    github : {
        clientID : string;
        clientSecret : string;
        callbackURL : string;
    }
    mailer : {
        from : string;
        options : {
            service : string;
            auth: {
                user : string;
                pass : string;
            };
        }
    }

	//singleton
	private static instance : BaseConfiguration = undefined;
	static getInstance() : BaseConfiguration {
		if (!this.instance) this.instance = new BaseConfiguration();
		return this.instance;
	}

	constructor(){
		this.app = {
			title: 'rean-typescript example',
			description: 'REAN and typescript',
			keywords: 'RethinkDB, Express, AngularJS, Node.js'
		};
		this.port = parseInt(process.env.PORT) || 3000;
		this.templateEngine = 'swig';
		this.sessionSecret = 'REAN';
		this.sessionCollection = 'sessions';
		this.assets = {
			lib: {
				css: [
					'public/lib/bootstrap/dist/css/bootstrap.css',
					'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				],
				js: [
					'public/lib/angular/angular.js',
					'public/lib/angular-resource/angular-resource.js',
					'public/lib/angular-cookies/angular-cookies.js',
					'public/lib/angular-animate/angular-animate.js',
					'public/lib/angular-touch/angular-touch.js',
					'public/lib/angular-sanitize/angular-sanitize.js',
					'public/lib/angular-ui-router/release/angular-ui-router.js',
					'public/lib/angular-ui-utils/ui-utils.js',
					'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
				]
			},
			css: [
				'public/modules/**/css/*.css'
			],
			js: [
				'public/config.js',
				'public/application.js',
				'public/modules/*/*.js',
				'public/modules/*/*[!tests]*/*.js'
			],
			tests: [
				'public/lib/angular-mocks/angular-mocks.js',
				'public/modules/*/tests/*.js'
			]
		};
	}
}

export default BaseConfiguration;
