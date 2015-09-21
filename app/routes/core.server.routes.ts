'use strict';

import * as express from 'express';
import CoreController from '../controllers/core.server.controller';

export default function(app : express.Application) {
	// Root routing
	var core = CoreController.getInstance();
	app.route('/').get(core.index);
};
