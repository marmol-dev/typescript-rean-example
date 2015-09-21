'use strict';

import config from './config';
import * as bluebird from 'bluebird';
import * as thinky from 'thinky';

class DbConfiguration {
    private static instance : DbConfiguration = undefined;
    static getInstance() : DbConfiguration {
        if (!this.instance) this.instance = new DbConfiguration();
        return this.instance;
    }

    start() : bluebird.Thenable<any> {
        let r = this.getThinky().r;
        let dbConfig = config.getInstance().db;

            return r.dbList()
                .run()
                .then(function (dbs) {
                    if (dbs.lastIndexOf(dbConfig.db) == -1) {
                        return r.dbCreate(dbConfig.db)
                            .run();
                    }
                })
                //check the session table exists
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
    }

    private thinky : thinky.Thinky = undefined;

    getThinky() : thinky.Thinky {
        if (!this.thinky){
            this.thinky = thinky(config.getInstance().db);
        }
        return this.thinky;
    }
}

export default DbConfiguration;
