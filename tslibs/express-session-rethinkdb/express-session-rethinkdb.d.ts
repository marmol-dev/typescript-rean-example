declare module 'express-session-rethinkdb' {
    import * as session from 'express-session';
    import * as express from 'express';
    function sessionHandler(session : any) : StoreClass; //TODO: improve session any

    interface Options {
        connectOptions?: {
            db: string,
            host: string,
            port: number
        };
        table?: string;
        sessionTimeout?: number;
        flushInterval?: number;
    }

    module sessionHandler {}

    class RDBStore implements session.Store {
        constructor(options : Options);
        get: (sid: string, callback: (err: any, session: Express.Session) => void) => void;
        set: (sid: string, session: Express.Session, callback: (err: any) => void) => void;
        destroy: (sid: string, callback: (err: any) => void) => void;
        length: (callback: (err: any, length: number) => void) => void;
        clear: (callback: (err: any) => void) => void;
    }

    //Workaround for returning classes in TS
    interface StoreClass {
        new (options : Options) : RDBStore;
    }

    export = sessionHandler;
}
