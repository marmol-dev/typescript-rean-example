'use strict';

/**
 * Module dependencies.
 */
import * as _ from 'lodash';
import UsersAuthenticationController from './users/users.authentication.server.controller';
import UsersAuthorizationController from './users/users.authorization.server.controller';
import UsersPasswordController from './users/users.password.server.controller';
import UsersProfileController from './users/users.profile.server.controller';

//Workaround for multiple inheritance
interface IUsersController extends UsersProfileController, UsersPasswordController, UsersAuthorizationController, UsersAuthenticationController {}

/**
 * Extend user's controller
 */
export default class UsersController {
	private static instance : IUsersController = undefined;
	static getInstance() : IUsersController {
		if (!this.instance) {
			this.instance = <IUsersController> new UsersController();
		}
		return this.instance;
	}

	constructor(){
		//Workaround for multiple inheritance
		_.extend(this, UsersAuthenticationController.prototype, UsersAuthorizationController.prototype, UsersPasswordController.prototype, UsersProfileController.prototype);
		UsersAuthenticationController.apply(this, arguments);
		UsersAuthorizationController.apply(this, arguments);
		UsersPasswordController.apply(this, arguments);
		UsersProfileController.apply(this, arguments);
	}
}
