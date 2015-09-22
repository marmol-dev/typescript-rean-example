'use strict';
/**
 * Module dependencies.
 */

import init from './config/init';
import Config from './config/config';
var config = Config.getInstance();
import * as chalk from 'chalk';
import DbConfig from './config/db';
var dbConfig = DbConfig.getInstance();
import * as express from 'express';
import bootstrapPassport from './config/passport';
import bootstrapExpress from './config/express';
import * as http from 'http';
import * as https from 'https';

init();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = dbConfig
	.start()
	.then(function () {
        console.log(chalk.black('RethinkDB running on port ' + config.db.port));
        // Init the express application
        var app = bootstrapExpress(db);

        // Bootstrap passport config
        bootstrapPassport();

        // Start the app by listening on <port>
        app.listen(config.port);
    })
    .then(null, function (err) {
        console.error(chalk.red('Could not connect to RethinkDB!'));
        console.log(chalk.red(err));
    });

// Logging initialization
console.log('REAN application started on port ' + config.port);
