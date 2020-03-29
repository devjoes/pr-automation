"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter = _interopRequireDefault(require("@async-generators/filter"));

var _common = require("../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const merge = async ({
  client,
  context
}, pr) => await client.pulls.merge({ ...context.repo,
  pull_number: pr.number
});

const isMergable = async ({
  client,
  context
}, pr) => {
  const fullPr = await client.pulls.get({ ...context.repo,
    pull_number: pr.number
  });
  return fullPr.data.mergeable && (fullPr.data.mergeable_state === 'clean' || fullPr.data.mergeable_state === 'unstable') // this means that non required builds are failing
  ;
};

var _default = opts => async prs => {
  const {
    logger
  } = opts;
  const filtered = (0, _filter.default)(prs, p => p.labels && (0, _common.hasLabel)(p, opts.args.autoMergeLabel));
  const processedPrNumbers = [];

  for await (let pr of filtered) {
    if (await isMergable(opts, pr)) {
      logger.info(`Merging ${(0, _common.describePr)(pr)}`);
      await merge(opts, pr);

      if (opts.args.deleteOnMerge) {
        await (0, _common.deletePrBranch)(opts, pr);
      }

      processedPrNumbers.push(pr.number);
    }
  }

  logger.info(`Merged ${processedPrNumbers.length} PRs`);
  return processedPrNumbers;
};

exports.default = _default;
//# sourceMappingURL=merge-prs.js.map