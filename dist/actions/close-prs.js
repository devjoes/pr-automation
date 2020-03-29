"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter = _interopRequireDefault(require("@async-generators/filter"));

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = opts => async prs => {
  const {
    args,
    logger
  } = opts;
  const prsToClose = (0, _filter.default)(prs, p => (0, _common.hasLabel)(p, args.autoCloseLabel) && (0, _common.hasLabel)(p, args.closingSoonLabel));
  const processedPrNumbers = [];

  for await (let pr of prsToClose) {
    const latestCommentAge = await (0, _common.getLatestClosingCommentAgeSecs)(opts, pr.number);

    if (latestCommentAge != null && latestCommentAge > args.autoCloseAfterWarnSecs) {
      logger.info(`Closing ${(0, _common.describePr)(pr)}`);
      await closePr(opts, pr);
      processedPrNumbers.push(pr.number);
    }
  }

  logger.info(`Closed ${processedPrNumbers.length} PRs`);
  return processedPrNumbers;
};

exports.default = _default;

const closePr = async (opts, p) => {
  const {
    client,
    context,
    args
  } = opts;
  await client.pulls.update({ ...context.repo,
    pull_number: p.number,
    state: 'closed'
  });

  if (args.deleteOnClose) {
    await (0, _common.deletePrBranch)(opts, p);
  }
};
//# sourceMappingURL=close-prs.js.map