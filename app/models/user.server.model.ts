'use strict';

/**
 * Module dependencies.
 */
 import * as crypto from 'crypto';
 import config = require('../../config/config');
 import dbConfig = require('../../config/db');
 var thinky = dbConfig.getInstance().getThinky();
 var {r, type} = thinky;
 import * as Thinky from 'thinky';
 import * as bluebird from 'bluebird';

/**
 * A Validation function for local strategy properties
 */
function validateLocalStrategyProperty(property : any) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
}

/**
 * A Validation function for local strategy password
 */
function validateLocalStrategyPassword(password : string) {
    return (this.provider !== 'local' || (password && password.length > 6));
}

interface UserAttributes {
    id : string;
    firstName? : string;
    lastName?: string;
    displayName : string;
    email : string;
    username : string;
    password : string;
    salt : string;
    provider : string;
    providerData : any;
    additionalProvidersData : any;
    roles?: string[];
    updated? : Date;
    created?: Date;
    resetPasswordToken : string;
    resetPasswordExpires : Date;
}

interface UserDocument extends UserAttributes, Thinky.Document<UserDocument, UserModel, UserAttributes> {
    hashPassword(password : string) : string;
    authenticate(password : string) : boolean;
}

interface UserModel extends Thinky.Model<UserDocument, UserModel, UserAttributes> {
    findUniqueUsername(username : string, suffix? : number, callback? : (possibleUsername : string) => void) : bluebird.Thenable<string>;
    getByUsername(username : string) : Thinky.Expression<UserDocument>;
    getByEmail(email : string) : Thinky.Expression<UserDocument>;
}

var User = thinky.createModel<UserDocument, UserModel, UserAttributes>('users', {
    id: type.string(), //do not put here .required()
    firstName: type.string().validator<any>(validateLocalStrategyProperty).default(''),//TODO: improve
    lastName: type.string().validator<any>(validateLocalStrategyProperty).default(''),
    displayName: type.string(),
    email: type.string().email().required(),
    username: type.string().required(),
    password: type.string().validator<string>(validateLocalStrategyPassword),
    salt: type.string(),
    provider: type.string(),
    providerData: type.object(),
    additionalProvidersData: type.object(),
    roles: type.array().schema(type.string().enum('user', 'admin')).default(['user']).required(),
    updated: type.date().optional().allowNull().default(() => new Date()),
    created: type.date().optional().allowNull().default(() => new Date()),
    resetPasswordToken: type.string(),
    resetPasswordExpires: type.date()
}, {
    enforce_extra: 'remove'
});

User.ensureIndex('username');
User.ensureIndex('email');

/**
 * Hook a pre save method to hash the password
 */
User.pre('save', function (next) {

    var self : UserDocument = this;

    if (self.password && self.password.length > 6) {
        self.salt = (new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')).toString();
        self.password = self.hashPassword(self.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
User.define('hashPassword', function (password : string) : string {
    var self : UserDocument = this;

    if (self.salt && password) {
        return crypto.pbkdf2Sync(password, self.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
});

/**
 * Create instance method for authenticating user
 */
User.define('authenticate', function (password : string) : boolean {
    var self : UserDocument = this;
    return self.password === self.hashPassword(password);
});

/**
 * Find possible not used username
 */
User.defineStatic('findUniqueUsername', function (username : string, suffix? : number, callback? : (possibleUsername : string) => void) : bluebird.Thenable<string> {
    var _this : UserModel = this;
    var possibleUsername = username + (suffix || '');

    return _this.getByUsername(possibleUsername)
        .run()
        .then(
            (user) => _this.findUniqueUsername(username, (suffix || 0) + 1, callback),
            (err) => {
                if (typeof callback === 'function'){
                    callback(possibleUsername);
                }
                return possibleUsername;
            }
        );
});

User.defineStatic('getByUsername', function (username) : Thinky.Expression<UserDocument> {
    var self : UserModel = this;
    return self.getAll(username, {index : 'username'})
        .limit(1)
        .nth(0);
});

User.defineStatic('getByEmail', function(email) : Thinky.Expression<UserDocument> {
    var self : UserModel = this;
    return self.getAll(email, {index : 'email'})
        .limit(1)
        .nth(0);
});

export = User;
