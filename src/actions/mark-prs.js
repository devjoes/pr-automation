import filter from '@async-generators/filter';
import { hasLabel, updatedInTheLastSecs, nowPlusSecs } from '../common';

const markForClosure = async ({ client, context, args }, pr) => {
  await client.issues.addLabels({
    ...context.repo,
    issue_number: pr.number,
    labels: [...pr.labels.map(l => l.name), args.closingSoonLabel],
  });
  await client.issues.createComment({
    ...context.repo,
    issue_number: pr.number,
    body: args.closingSoonComment.replace(/\@closeTime/g, nowPlusSecs(args.autoCloseAfterWarnSecs)),
  });
};

export default opts => async prs => {
  const { args, logger } = opts;
  //console.log(prs)
  const toMark = filter(prs, p => {
    // p.then(r => console.log('awaited',r))
    // console.log(
    //   hasLabel(p, args.autoCloseLabel),
    //   !hasLabel(p, args.closingSoonLabel),
    //   !updatedInTheLastSecs(p, args.warnClosingAfterSecs),
    // );
    return (
      p.labels &&
      hasLabel(p, args.autoCloseLabel) &&
      !hasLabel(p, args.closingSoonLabel) &&
      !updatedInTheLastSecs(p, args.warnClosingAfterSecs)
    );
  });
  const processedPrNumbers = [];
  for await (let pr of toMark) {
    logger.debug(`Marking PR ${pr.number} for closure`);
    await markForClosure(opts, pr);
    processedPrNumbers.push(pr.number);
  }
  logger.info(`Marked ${processedPrNumbers.length} PRs for closure`);
  return processedPrNumbers;
};
