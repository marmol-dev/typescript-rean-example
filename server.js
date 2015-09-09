'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = require('./config/db').start();

db.then(function () {
        console.log(chalk.black('RethinkDB running on port ' + config.db.port));
        // Init the express application
        var app = require('./config/express')(db);

        // Bootstrap passport config
        require('./config/passport')();

        // Start the app by listening on <port>
        app.listen(config.port);
    })
    .error(function (err) {
        console.error(chalk.red('Could not connect to RethinkDB!'));
        console.log(chalk.red(err));
    });

// Logging initialization
console.log('REAN application started on port ' + config.port);
