'use strict';
var core_server_controller_1 = require('../controllers/core.server.controller');
function default_1(app) {
    var core = core_server_controller_1.default.getInstance();
    app.route('/').get(core.index);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=core.server.routes.js.map