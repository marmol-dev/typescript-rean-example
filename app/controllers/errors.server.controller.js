'use strict';
var ErrorsController = (function () {
    function ErrorsController() {
    }
    ErrorsController.getInstance = function () {
        if (!this.instance)
            this.instance = new ErrorsController();
        return this.instance;
    };
    ErrorsController.prototype.getUniqueErrorMessage = function (err) {
        var output;
        try {
            var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
            output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
        }
        catch (ex) {
            output = 'Unique field already exists';
        }
        return output;
    };
    ErrorsController.prototype.getErrorMessage = function (err) {
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
        }
        else if (err.errors) {
            for (var errName in err.errors) {
                if (err.errors[errName].message)
                    message = err.errors[errName].message;
            }
        }
        else if (err.message) {
            message = err.message;
        }
        console.log(err, '--->', message);
        return message;
    };
    ErrorsController.instance = undefined;
    return ErrorsController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorsController;
//# sourceMappingURL=errors.server.controller.js.map