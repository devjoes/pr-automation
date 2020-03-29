"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter = _interopRequireDefault(require("@async-generators/filter"));

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const unMarkForClosure = async (opts, pr) => {
  const {
    context,
    client,
    args
  } = opts;
  await client.issues.removeLabel({ ...context.repo,
    issue_number: pr.number,
    name: args.closingSoonLabel
  });
  await deleteComments(opts, pr.number);
};

const deleteComments = async ({
  client,
  context,
  args
}, issueNumber) => {
  const comments = (await client.issues.listComments({ ...context.repo,
    issue_number: issueNumber
  })).data.filter(c => c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) === 0);
  await comments.forEach(async c => {
    await client.issues.deleteComment({ ...context.repo,
      comment_id: c.id
    });
  });
};

var _default = opts => async prs => {
  const {
    logger
  } = opts;
  const filtered = (0, _filter.default)(prs, p => p.labels && (0, _common.hasLabel)(p, opts.args.autoCloseLabel) && (0, _common.hasLabel)(p, opts.args.closingSoonLabel) && (0, _common.updatedInTheLastSecs)(p, opts.args.warnClosingAfterSecs));
  const processedPrNumbers = [];

  for await (let pr of filtered) {
    const oldestComment = (await (0, _common.getLatestClosingCommentAgeSecs)(opts, pr.number)) || opts.args.warnClosingAfterSecs;

    if (oldestComment >= opts.args.warnClosingAfterSecs) {
      logger.debug(`Unmarked PR ${(0, _common.describePr)(pr)} for closure`);
      await unMarkForClosure(opts, pr);
      processedPrNumbers.push(pr.number);
    }
  }

  logger.info(`Unmarked ${processedPrNumbers.length} PRs for closure`);
  return processedPrNumbers;
};

exports.default = _default;
//# sourceMappingURL=unmark-prs.js.map