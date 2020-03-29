import filter from '@async-generators/filter';
import { hasLabel, describePr, getLatestClosingCommentAgeSecs, deletePrBranch } from '../common';

export default opts => async prs => {
  const { args, logger } = opts;

  const prsToClose = filter(
    prs,
    p => hasLabel(p, args.autoCloseLabel) && hasLabel(p, args.closingSoonLabel),
  );

  const processedPrNumbers = [];
  for await (let pr of prsToClose) {
    const latestCommentAge = await getLatestClosingCommentAgeSecs(opts, pr.number);
    if (latestCommentAge != null && latestCommentAge > args.autoCloseAfterWarnSecs) {
      logger.info(`Closing ${describePr(pr)}`);
      await closePr(opts, pr);
      processedPrNumbers.push(pr.number);
    }
  }
  logger.info(`Closed ${processedPrNumbers.length} PRs`);
  return processedPrNumbers;
};

const closePr = async (opts, p) => {
  const {client, context, args} = opts;
  await client.pulls.update({
    ...context.repo,
    pull_number: p.number,
    state: 'closed',
  });
  if (args.deleteOnClose) {
    await deletePrBranch(opts, p);
  }
};
