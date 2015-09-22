declare module 'helmet' {
    import * as express from 'express';

    export function xframe() : express.RequestHandler;
    export function xssFilter() : express.RequestHandler;
    export function nosniff() : express.RequestHandler;
    export function ienoopen() : express.RequestHandler;

    //TODO: complete the rest of the methods
}
