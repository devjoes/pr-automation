"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = require("../common");

var _default = ({
  client,
  context,
  logger,
  args
}) => async function* () {
  let prs = [];
  let page = 0;
  logger.info(`Getting PRs in repository ${context.repo.owner}/${context.repo.repo}`);

  do {
    page++;
    prs = await client.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      per_page: 100,
      page: page
    });

    if (prs.data.length) {
      logger.debug(`Got page ${page} (${prs.data.length} PRs)`);
    }

    for (let i = 0; i < prs.data.length; i++) {
      const pr = prs.data[i];
      const headOk = args.branchBlackListLowerCase.indexOf((0, _common.branchNameFromRef)(pr.head.ref)) === -1;
      const baseOk = args.branchBlackListLowerCase.indexOf((0, _common.branchNameFromRef)(pr.base.ref)) === -1;

      if (headOk && baseOk) {
        yield pr;
      } else {
        logger.warning(`Refused to process ${(0, _common.describePr)(pr)} the branch's${headOk ? '' : ` HEAD (${pr.head.ref})`}${baseOk ? '' : ` BASE (${pr.base.ref})`} is blacklisted`);
      }
    }
  } while (prs.data.length && page < 1000);
};

exports.default = _default;
//# sourceMappingURL=get-prs.js.map