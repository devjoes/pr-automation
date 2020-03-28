import { describePr,branchNameFromRef } from '../common';

export default ({ client, context, logger, args }) =>
  async function* () {
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
        page: page,
      });
      if (prs.data.length) {
        logger.debug(`Got page ${page} (${prs.data.length} PRs)`);
      }
      for (let i = 0; i < prs.data.length; i++) {
        const pr = prs.data[i];
        if (
          args.branchBlackListLowerCase.indexOf(branchNameFromRef(pr.head.ref)) === -1 &&
          args.branchBlackListLowerCase.indexOf(branchNameFromRef(pr.base.ref)) === -1
        ) {
          yield pr;
        } else {
          logger.warning('Refused to process ' + describePr(pr));
        }
      }
    } while (prs.data.length && page < 1000);
  };