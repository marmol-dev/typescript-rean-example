'use strict';

/**
 * Module dependencies.
 */
import * as express from 'express';

export default class CoreController {
	private static instance : CoreController = undefined;
	static getInstance() : CoreController {
		if (!this.instance){
			this.instance = new CoreController();
		}
		return this.instance;
	}

	index(req : express.Request, res : express.Response) {
		res.render('index', {
			user: req.user || null,
			request: req
		});
	}
}
