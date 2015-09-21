'use strict';
var errors_server_controller_1 = require('../errors.server.controller');
var errorHandler = errors_server_controller_1.default.getInstance();
var user_server_model_1 = require('../../models/user.server.model');
var config_1 = require('../../../config/config');
var config = config_1.default.getInstance();
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var db_1 = require('../../../config/db');
var r = db_1.default.getInstance().getThinky().r;
var UsersPasswordController = (function () {
    function UsersPasswordController() {
    }
    UsersPasswordController.prototype.forgot = function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buffer) {
                    var token = buffer.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                if (req.body.username) {
                    user_server_model_1.default.getByUsername(req.body.username)
                        .without(['salt', 'password'])
                        .run()
                        .then(function (user) {
                        if (user.provider !== 'local') {
                            return res.status(400).send({
                                message: 'It seems like you signed up using your ' + user.provider + ' account'
                            });
                        }
                        else {
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000;
                            user.save(function (err) {
                                done(err, token, user);
                            });
                        }
                    })
                        .then(null, function (err) {
                        return res.status(400).send({
                            message: 'No account with that username has been found'
                        });
                    });
                }
                else {
                    return res.status(400).send({
                        message: 'Username field must not be blank'
                    });
                }
            },
            function (token, user, done) {
                res.render('templates/reset-password-email', {
                    name: user.displayName,
                    appName: config.app.title,
                    url: 'http://' + req.headers.host + '/auth/reset/' + token
                }, function (err, emailHTML) {
                    done(err, emailHTML, user);
                });
            },
            function (emailHTML, user, done) {
                var smtpTransport = nodemailer.createTransport(config.mailer.options);
                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: 'Password Reset',
                    html: emailHTML
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    if (!err) {
                        res.send({
                            message: 'An email has been sent to ' + user.email + ' with further instructions.'
                        });
                    }
                    done(err);
                });
            }
        ], function (err) {
            if (err)
                return next(err);
        });
    };
    UsersPasswordController.prototype.validateResetToken = function (req, res) {
        user_server_model_1.default.filter(r.row('resetPasswordToken')
            .eq(req.param.token)
            .and(r.row('resetPasswordExpires').gt(Date.now())))
            .limit(1)
            .run()
            .then(function (user) {
            if (!user) {
                return res.redirect('/#!/password/reset/invalid');
            }
            res.redirect('/#!/password/reset/' + req.params.token);
        })
            .then(null, function (err) {
            return res.redirect('/#!/password/reset/invalid');
        });
    };
    UsersPasswordController.prototype.reset = function (req, res, next) {
        var passwordDetails = req.body;
        async.waterfall([
            function (done) {
                user_server_model_1.default.filter(r.row('resetPasswordToken')
                    .eq(req.param.token)
                    .and(r.row('resetPasswordExpires').gt(Date.now())))
                    .limit(1)
                    .nth(0)
                    .run()
                    .then(function (user) {
                    if (user) {
                        if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                            user.password = passwordDetails.newPassword;
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            user.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                }
                                else {
                                    req.login(user, function (err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        }
                                        else {
                                            res.json(user);
                                            done(err, user);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            return res.status(400).send({
                                message: 'Passwords do not match'
                            });
                        }
                    }
                    else {
                        return res.status(400).send({
                            message: 'Password reset token is invalid or has expired.'
                        });
                    }
                })
                    .then(null, function (err) {
                    return res.status(400).send({
                        message: 'Password reset token is invalid or has expired.'
                    });
                });
            },
            function (user, done) {
                res.render('templates/reset-password-confirm-email', {
                    name: user.displayName,
                    appName: config.app.title
                }, function (err, emailHTML) {
                    done(err, emailHTML, user);
                });
            },
            function (emailHTML, user, done) {
                var smtpTransport = nodemailer.createTransport(config.mailer.options);
                var mailOptions = {
                    to: user.email,
                    from: config.mailer.from,
                    subject: 'Your password has been changed',
                    html: emailHTML
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err)
                return next(err);
        });
    };
    UsersPasswordController.prototype.changePassword = function (req, res) {
        var passwordDetails = req.body;
        if (req.user) {
            if (passwordDetails.newPassword) {
                user_server_model_1.default.get(req.user.id)
                    .run()
                    .then(function (user) {
                    if (user) {
                        if (user.authenticate(passwordDetails.currentPassword)) {
                            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                                user.password = passwordDetails.newPassword;
                                user.save(function (err) {
                                    if (err) {
                                        return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                                        });
                                    }
                                    else {
                                        req.login(user, function (err) {
                                            if (err) {
                                                res.status(400).send(err);
                                            }
                                            else {
                                                res.send({
                                                    message: 'Password changed successfully'
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                res.status(400).send({
                                    message: 'Passwords do not match'
                                });
                            }
                        }
                        else {
                            res.status(400).send({
                                message: 'Current password is incorrect'
                            });
                        }
                    }
                    else {
                        res.status(400).send({
                            message: 'User is not found'
                        });
                    }
                })
                    .then(null, function (err) {
                    res.status(400).send({
                        message: 'User is not found'
                    });
                });
            }
            else {
                res.status(400).send({
                    message: 'Please provide a new password'
                });
            }
        }
        else {
            res.status(400).send({
                message: 'User is not signed in'
            });
        }
    };
    return UsersPasswordController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersPasswordController;
//# sourceMappingURL=users.password.server.controller.js.map