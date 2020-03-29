"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter = _interopRequireDefault(require("@async-generators/filter"));

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const markForClosure = async ({
  client,
  context,
  args
}, pr) => {
  await client.issues.addLabels({ ...context.repo,
    issue_number: pr.number,
    labels: [...pr.labels.map(l => l.name), args.closingSoonLabel]
  });
  await client.issues.createComment({ ...context.repo,
    issue_number: pr.number,
    body: args.closingSoonComment.replace(/\@closeTime/g, (0, _common.nowPlusSecs)(args.autoCloseAfterWarnSecs))
  });
};

var _default = opts => async prs => {
  const {
    args,
    logger
  } = opts;
  const toMark = (0, _filter.default)(prs, p => p.labels && (0, _common.hasLabel)(p, args.autoCloseLabel) && !(0, _common.hasLabel)(p, args.closingSoonLabel) && !(0, _common.updatedInTheLastSecs)(p, args.warnClosingAfterSecs));
  const processedPrNumbers = [];

  for await (let pr of toMark) {
    logger.debug(`Marking PR ${(0, _common.describePr)(pr)} for closure`);
    await markForClosure(opts, pr);
    processedPrNumbers.push(pr.number);
  }

  logger.info(`Marked ${processedPrNumbers.length} PRs for closure`);
  return processedPrNumbers;
};

exports.default = _default;
//# sourceMappingURL=mark-prs.js.map