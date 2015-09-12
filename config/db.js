'use strict';
var config = require('./config');
var thinky = require('thinky');
var DbConfiguration = (function () {
    function DbConfiguration() {
        this.thinky = undefined;
    }
    DbConfiguration.getInstance = function () {
        if (!this.instance)
            this.instance = new DbConfiguration();
        return this.instance;
    };
    DbConfiguration.prototype.start = function () {
        var r = this.getThinky().r;
        var dbConfig = config.getInstance().db;
        return r.dbList()
            .run()
            .then(function (dbs) {
            if (dbs.lastIndexOf(dbConfig.db) == -1) {
                return r.dbCreate(dbConfig.db)
                    .run();
            }
        })
            .then(function (conn) {
            return r.db(dbConfig.db)
                .tableList()
                .run()
                .then(function (tables) {
                if (tables.lastIndexOf(dbConfig.sessionTable) == -1)
                    return r.db(dbConfig.db)
                        .tableCreate(dbConfig.sessionTable)
                        .run();
            });
        });
    };
    DbConfiguration.prototype.getThinky = function () {
        if (!this.thinky) {
            this.thinky = thinky(config.getInstance().db);
        }
        return this.thinky;
    };
    DbConfiguration.instance = undefined;
    return DbConfiguration;
})();
module.exports = DbConfiguration;
//# sourceMappingURL=db.js.map