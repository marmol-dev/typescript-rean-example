'use strict';

import BaseConfiguration from './env/base';
import Enviroment from './env/enviroment';
import * as glob from 'glob';
import * as _ from 'lodash';

class GlobalConfiguration extends BaseConfiguration {
	//singleton
	private static _instance : GlobalConfiguration = undefined;

	static getInstance() : GlobalConfiguration {
		if (!this._instance) this._instance = new GlobalConfiguration();
		return this._instance;
	}

	constructor(){
		super();
		//apply specific enviroment configuration
		let currentEnv : string = process.env.NODE_ENV || 'development';
		let EnvConfiguration : Enviroment = (require('./env/' + currentEnv) || require('./env/development')).getInstance();
		EnvConfiguration.applyConfiguration(this);
	}

	getGlobbedFiles(globPatterns : string | string[], removeRoot : string) : string[] {
		// For context switching
		var _this = this;

		// URL paths regex
		var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

		// The output array
		var output : string[] = [];

		// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
		if (globPatterns instanceof Array) {
			globPatterns.forEach(function(globPattern) {
				output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
			});
		} else if (typeof globPatterns === 'string') {
			if (urlRegex.test(globPatterns)) {
				output.push(globPatterns);
			} else {
				glob(globPatterns, {
					sync: true
				}, function(err, files) {
					if (removeRoot) {
						files = files.map(function(file) {
							return file.replace(removeRoot, '');
						});
					}

					output = _.union(output, files);
				});
			}
		}

		return output;
	}

	getJavaScriptAssets(includeTests? : boolean) : string[] {
		if (typeof includeTests === 'undefined') includeTests = false;

		var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

		// To include tests
		if (includeTests) {
			output = _.union(output, this.getGlobbedFiles(this.assets.tests, 'public/'));
		}

		return output;
	}

	getCSSAssets() : string[] {
		var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
		return output;
	}
}

export = GlobalConfiguration;
