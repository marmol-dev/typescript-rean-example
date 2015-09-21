'use strict';
var CoreController = (function () {
    function CoreController() {
    }
    CoreController.getInstance = function () {
        if (!this.instance) {
            this.instance = new CoreController();
        }
        return this.instance;
    };
    CoreController.prototype.index = function (req, res) {
        res.render('index', {
            user: req.user || null,
            request: req
        });
    };
    CoreController.instance = undefined;
    return CoreController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CoreController;
//# sourceMappingURL=core.server.controller.js.map