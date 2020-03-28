import filter from '@async-generators/filter';
import { hasLabel, updatedInTheLastSecs } from '../common';

const unMarkForClosure = async (opts, pr) => {
  const { context, client, args } = opts;
  await client.issues.removeLabel({
    ...context.repo,
    issue_number: pr.number,
    name: args.closingSoonLabel,
  });
  await deleteComments(opts, pr.number);
};
const deleteComments = async ({ client, context, args }, issueNumber) => {
  const comments = (
    await client.issues.listComments({
      ...context.repo,
      issue_number: issueNumber,
    })
  ).data.filter(c => c.body.indexOf(args.closingSoonComment.replace(/\@.*/, '')) === 0);

  await comments.forEach(async c => {
    await client.issues.deleteComment({
      ...context.repo,
      comment_id: c.id,
    });
  });
};

export default opts => async prs => {
  const {logger }= opts;
  const filtered = filter(
    prs,
    p =>
      p.labels &&
      hasLabel(p, opts.args.autoCloseLabel) &&
      hasLabel(p, opts.args.closingSoonLabel) &&
      updatedInTheLastSecs(p, opts.args.warnClosingAfterSecs),
  );
  const processedPrNumbers = [];
  for await (let pr of filtered) {
    logger.debug(`Unmarked PR ${pr.number} for deletion`);
    await unMarkForClosure(opts, pr);
    processedPrNumbers.push(pr.number);
  }
  logger.info(`Unmarked ${processedPrNumbers.length} PRs for closure`);
  return processedPrNumbers;
};
