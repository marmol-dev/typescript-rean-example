'use strict';

var r = require('rethinkdb'),
    config = require('./config.js');

module.exports.start = function () {

    return r.connect({
            host: config.db.host,
            port: config.db.port,
        })
        //check the db exists
        .then(function (conn) {
            return r.dbList()
                .run(conn)
                .then(function (dbs) {
                    if (dbs.lastIndexOf(config.db.db) > -1) {
                        return conn;
                    }

                    return r.dbCreate(config.db.db)
                        .run(conn)
                        .then(function () {
                            return conn;
                        });
                });
        })
        .then(function (conn) {
            return conn.close();
        })
        .then(function () {
            return r.connect({
                host: config.db.host,
                port: config.db.port,
                db: config.db.db
            });
        })
        //check the session table exists
        .then(function (conn) {
            return r.db(config.db.db)
                .tableList()
                .run(conn)
                .then(function (tables) {
                    if (tables.lastIndexOf(config.db.sessionTable) > -1) {
                        return conn;
                    }

                    return r.tableCreate(config.db.sessionTable)
                        .run(conn)
                        .then(function () {
                            return conn;
                        });
                });
        });
};

var thinky = null;
module.exports.getThinky = function(){
    if (!thinky){
        thinky = require('thinky')(config.db);
    }
    
    return thinky;
};
