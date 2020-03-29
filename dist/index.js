"use strict";

var _actions = _interopRequireDefault(require("./actions"));

var _args = _interopRequireDefault(require("./args"));

var _logger = _interopRequireDefault(require("./logger"));

var _processPrs = _interopRequireDefault(require("./process-prs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const main = async () => {
  const logger = (0, _logger.default)();

  try {
    const args = (0, _args.default)(logger);
    const actions = (0, _actions.default)(args, logger);
    await (0, _processPrs.default)(args, actions);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

main();
//# sourceMappingURL=index.js.map