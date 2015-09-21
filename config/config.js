'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require('./env/base');
var glob = require('glob');
var _ = require('lodash');
var GlobalConfiguration = (function (_super) {
    __extends(GlobalConfiguration, _super);
    function GlobalConfiguration() {
        _super.call(this);
        var currentEnv = process.env.NODE_ENV || 'development';
        var EnvConfiguration = (require('./env/' + currentEnv) || require('./env/development')).default.getInstance();
        EnvConfiguration.applyConfiguration(this);
    }
    GlobalConfiguration.getInstance = function () {
        if (!this._instance)
            this._instance = new GlobalConfiguration();
        return this._instance;
    };
    GlobalConfiguration.prototype.getGlobbedFiles = function (globPatterns, removeRoot) {
        var _this = this;
        removeRoot = removeRoot || '';
        var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
        var output = [];
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
        if (includeTests) {
            output = _.union(output, this.getGlobbedFiles(this.assets.tests, 'public/'));
        }
        return output;
    };
    GlobalConfiguration.prototype.getCSSAssets = function () {
        var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
        return output;
    };
    GlobalConfiguration._instance = undefined;
    return GlobalConfiguration;
})(base_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalConfiguration;
//# sourceMappingURL=config.js.map