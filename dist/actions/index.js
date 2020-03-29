"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var github = _interopRequireWildcard(require("@actions/github"));

var _closePrs = _interopRequireDefault(require("./close-prs"));

var _getPrs = _interopRequireDefault(require("./get-prs"));

var _markPrs = _interopRequireDefault(require("./mark-prs"));

var _mergePrs = _interopRequireDefault(require("./merge-prs"));

var _unmarkPrs = _interopRequireDefault(require("./unmark-prs"));

var _updatePrs = _interopRequireDefault(require("./update-prs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = (args, logger, context = github.context, client = new github.GitHub(args.token)) => {
  const opts = {
    args,
    context,
    client,
    logger
  };

  const handleErrors = (func, funcName) => (...args) => new Promise(r => {
    const promise = func(...args);
    promise.then(r);
    promise.catch(err => {
      logger.warning(`${funcName} errored. ${err}`);
      r([]);
    });
  });

  return {
    getPrs: (0, _getPrs.default)(opts),
    closePrs: handleErrors((0, _closePrs.default)(opts), 'closePrs'),
    markPrs: handleErrors((0, _markPrs.default)(opts), 'markPrs'),
    mergePrs: handleErrors((0, _mergePrs.default)(opts), 'mergePrs'),
    unmarkPrs: handleErrors((0, _unmarkPrs.default)(opts), 'unmarkPrs'),
    updatePrs: handleErrors((0, _updatePrs.default)(opts), 'updatePrs')
  };
};

exports.default = _default;
//# sourceMappingURL=index.js.map