import filter from '@async-generators/filter';
import { hasLabel } from '../common';

const update = async ({ client, context }, pr) =>
  await client.pulls.updateBranch({
    ...context.repo,
    pull_number: pr.number,
  });

const needsUpdate = async ({ client, context }, pr) => {
  const fullPr = await client.pulls.get({
    ...context.repo,
    pull_number: pr.number,
  });
  return fullPr.data.mergeable_state === 'behind';
};

export default opts => async prs => {
  const { logger } = opts;
  const filtered = filter(prs, p => p.labels && hasLabel(p, opts.args.autoMergeLabel));
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
