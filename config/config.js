'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var base_1 = require('./env/base');
var glob = require('glob');
var _ = require('lodash');
var GlobalConfiguration = (function (_super) {
    __extends(GlobalConfiguration, _super);
    function GlobalConfiguration() {
        _super.call(this);
        //apply specific enviroment configuration
        var currentEnv = process.env.NODE_ENV || 'development';
        var EnvConfiguration = (require('./env/' + currentEnv) || require('./env/development')).getInstance();
        EnvConfiguration.applyConfiguration(this);
    }
    GlobalConfiguration.getInstance = function () {
        if (!this._instance)
            this._instance = new GlobalConfiguration();
        return this._instance;
    };
    GlobalConfiguration.prototype.getGlobbedFiles = function (globPatterns, removeRoot) {
        // For context switching
        var _this = this;
        // URL paths regex
        var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
        // The output array
        var output = [];
        // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
        if (globPatterns instanceof Array) {
            globPatterns.forEach(function (globPattern) {
                output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
            });
        }
        else if (typeof globPatterns === 'string') {
            if (urlRegex.test(globPatterns)) {
                output.push(globPatterns);
            }
            else {
                glob(globPatterns, {
                    sync: true
                }, function (err, files) {
                    if (removeRoot) {
                        files = files.map(function (file) {
                            return file.replace(removeRoot, '');
                        });
                    }
                    output = _.union(output, files);
                });
            }
        }
        return output;
    };
    GlobalConfiguration.prototype.getJavaScriptAssets = function (includeTests) {
        if (typeof includeTests === 'undefined')
            includeTests = false;
        var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');
        // To include tests
        if (includeTests) {
            output = _.union(output, this.getGlobbedFiles(this.assets.tests, 'public/'));
        }
        return output;
    };
    GlobalConfiguration.prototype.getCSSAssets = function () {
        var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
        return output;
    };
    //singleton
    GlobalConfiguration._instance = undefined;
    return GlobalConfiguration;
})(base_1.default);
module.exports = GlobalConfiguration;
//# sourceMappingURL=config.js.map