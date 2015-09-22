'use strict';
var init_1 = require('./config/init');
var config_1 = require('./config/config');
var config = config_1.default.getInstance();
var chalk = require('chalk');
var db_1 = require('./config/db');
var dbConfig = db_1.default.getInstance();
var passport_1 = require('./config/passport');
var express_1 = require('./config/express');
init_1.default();
var db = dbConfig
    .start()
    .then(function () {
    console.log(chalk.black('RethinkDB running on port ' + config.db.port));
    var app = express_1.default(db);
    passport_1.default();
    app.listen(config.port);
})
    .then(null, function (err) {
    console.error(chalk.red('Could not connect to RethinkDB!'));
    console.log(chalk.red(err));
});
console.log('REAN application started on port ' + config.port);
//# sourceMappingURL=server.js.map