import filter from '@async-generators/filter';
import { hasLabel, describePr, deletePrBranch } from '../common';

const merge = async ({ client, context }, pr) =>
  await client.pulls.merge({
    ...context.repo,
    pull_number: pr.number,
  });

const isMergable = async ({ client, context }, pr) => {
  const fullPr = await client.pulls.get({
    ...context.repo,
    pull_number: pr.number,
  });
  return (
    fullPr.data.mergeable &&
    (fullPr.data.mergeable_state === 'clean'
     || fullPr.data.mergeable_state === 'unstable') // this means that non required builds are failing
  );
};

export default opts => async prs => {
  const { logger } = opts;
  const filtered = filter(prs, p => p.labels && hasLabel(p, opts.args.autoMergeLabel));
  const processedPrNumbers = [];
  for await (let pr of filtered) {
    if (await isMergable(opts, pr)) {
      logger.info(`Merging ${describePr(pr)}`);
      await merge(opts, pr);
      if (opts.args.deleteOnMerge) {
        await deletePrBranch(opts, pr);
      }
      processedPrNumbers.push(pr.number);
    }
  }
  logger.info(`Merged ${processedPrNumbers.length} PRs`);
  return processedPrNumbers;
};
