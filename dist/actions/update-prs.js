"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter = _interopRequireDefault(require("@async-generators/filter"));

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const update = async ({
  client,
  context
}, pr) => await client.pulls.updateBranch({ ...context.repo,
  pull_number: pr.number
});

const needsUpdate = async ({
  client,
  context
}, pr) => {
  const fullPr = await client.pulls.get({ ...context.repo,
    pull_number: pr.number
  });
  return fullPr.data.mergeable_state === 'behind';
};

var _default = opts => async prs => {
  const {
    logger
  } = opts;
  const filtered = (0, _filter.default)(prs, p => p.labels && (0, _common.hasLabel)(p, opts.args.autoMergeLabel));
  const processedPrNumbers = [];

  for await (let pr of filtered) {
    if (await needsUpdate(opts, pr)) {
      logger.debug(`Updated PR ${pr.number} (branch ${pr.head.ref}) from base ${pr.base.ref}`);
      await update(opts, pr);
      processedPrNumbers.push(pr.number);
    }
  }

  logger.info(`Merged changes in to ${processedPrNumbers.length} PRs from their base branches`);
  return processedPrNumbers;
};

exports.default = _default;
//# sourceMappingURL=update-prs.js.map