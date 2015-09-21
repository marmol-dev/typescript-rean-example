'use strict';

class ErrorsController {
	//singleton
	private static instance : ErrorsController = undefined;
	static getInstance() : ErrorsController {
		if (!this.instance) this.instance = new ErrorsController();
		return this.instance;
	}

	private getUniqueErrorMessage(err : any) : string {
		var output : string;

		try {
			var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
			output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

		} catch (ex) {
			output = 'Unique field already exists';
		}

		return output;
	}

	getErrorMessage(err : any) : string {
		var message = '';

		if (err.code) {
			switch (err.code) {
				case 11000:
				case 11001:
					message = this.getUniqueErrorMessage(err);
					break;
				default:
					message = 'Something went wrong';
			}
		} else if (err.errors) {
			for (var errName in err.errors) {
				if (err.errors[errName].message) message = err.errors[errName].message;
			}
		} else if (err.message) {
	        message = err.message;
	    }

		console.log(err, '--->', message);

		return message;
	}
}

export default ErrorsController;
