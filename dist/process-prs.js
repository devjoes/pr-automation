"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cacheExcludeProcessed = _interopRequireDefault(require("./cache-exclude-processed"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (args, actions) => {
  const prs = await actions.getPrs();
  const cache = await (0, _cacheExcludeProcessed.default)(prs); //console.log(args);
  //console.log(cache);

  if (args.autoMergeLabel && args.autoMergeLabel != '') {
    await cache.runAction(actions.updatePrs);
    await cache.runAction(actions.mergePrs);
    await cache.runAction(actions.updatePrs);
  }

  if (args.autoCloseLabel && args.autoCloseLabel != '') {
    await cache.runAction(actions.unmarkPrs);
    await cache.runAction(actions.markPrs);
    await cache.runAction(actions.closePrs);
  }
};

exports.default = _default;
//# sourceMappingURL=process-prs.js.map